import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { UserStore } from "@/stores/user";
import router from "@/router";

// 扩展 AxiosRequestConfig 类型，添加自定义配置
interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean; // 是否显示加载提示
  showError?: boolean; // 是否显示错误提示
}

// 响应数据格式（根据你的后端结构调整）
export interface ApiResponse<T = any> {
  code: number; // 状态码：20000 成功，其他失败
  message: string; // 提示信息
  data: T; // 返回数据
  timestamp?: number; // 时间戳
}

class Request {
  private instance: AxiosInstance;
  private loadingCount: number = 0; // 用于控制加载提示

  constructor() {
    this.instance = axios.create({
      // 使用你已配置的环境变量
      baseURL: import.meta.env.VITE_API_BASE_URL || "/dev-api",
      timeout: 15000,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig & RequestConfig) => {
        // 1. 显示加载提示（可选）
        if (config.showLoading !== false) {
          this.showLoading();
        }

        // 2. 添加 token（从你的 store 获取）
        const userStore = UserStore();
        const token = userStore.token || localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 3. 添加其他自定义头
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        config.headers["x-timestamp"] = Date.now().toString();

        // 4. 开发环境打印请求信息
        if (import.meta.env.DEV) {
          console.log(
            `🚀 [API] ${config.method?.toUpperCase()} ${config.url}`,
            config,
          );
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 关闭加载提示
        this.hideLoading();

        const res = response.data;

        if (import.meta.env.DEV) {
          console.log("✅ [API] 响应成功:", {
            url: response.config.url,
            code: res.code,
            data: res.data,
          });
        }

        // 根据你的后端状态码处理
        if (res.code === 20000 || res.code === 200) {
          // ✅ 返回完整的 response，但将数据放在 response.data 中
          return response;
        } else {
          // 业务错误处理
          this.handleBusinessError(res);
          return Promise.reject(new Error(res.message || "请求失败"));
        }
      },
      (error) => {
        this.hideLoading();
        this.handleHttpError(error);
        return Promise.reject(error);
      },
    );
  }

  // 显示加载提示
  private showLoading() {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      // 可以显示全局 loading
      // ElLoading.service({ fullscreen: true, text: '加载中...' })
    }
  }

  // 隐藏加载提示
  private hideLoading() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      // 关闭全局 loading
      // const loadingInstance = ElLoading.service()
      // loadingInstance.close()
    }
  }

  // 处理业务错误
  private handleBusinessError(res: ApiResponse) {
    const config = (res as any).config || {};

    // 如果不显示错误提示，直接返回
    if (config.showError === false) return;

    switch (res.code) {
      case 401: // 未授权或 token 过期
        ElMessageBox.confirm("登录已过期，请重新登录", "提示", {
          confirmButtonText: "去登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          // 清除用户信息
          const userStore = UserStore();
          userStore.logout();
          localStorage.removeItem("token");
          // 跳转到登录页
          router.push("/login");
        });
        break;

      case 403: // 无权限
        ElMessage.error("您没有权限执行此操作");
        break;

      case 500: // 服务器错误
        ElMessage.error("服务器开小差了，请稍后重试");
        break;

      default:
        if (res.message) {
          ElMessage.error(res.message);
        }
    }
  }

  // 处理 HTTP 错误
  private handleHttpError(error: any) {
    const { response, message } = error || {};

    if (import.meta.env.DEV) {
      console.error("❌ [API] 请求失败:", error);
    }

    // 网络错误（没有响应）
    if (!response) {
      if (message.includes("timeout")) {
        ElMessage.error("请求超时，请检查网络");
      } else if (message.includes("Network Error")) {
        ElMessage.error("网络连接失败，请检查网络");
      } else {
        ElMessage.error("请求失败，请稍后重试");
      }
      return;
    }

    // HTTP 状态码错误
    const status = response.status;
    switch (status) {
      case 400:
        ElMessage.error("请求参数错误");
        break;
      case 401:
        // 已经在业务错误中处理，这里不再重复提示
        break;
      case 403:
        ElMessage.error("禁止访问");
        break;
      case 404:
        ElMessage.error("请求的资源不存在");
        break;
      case 500:
        ElMessage.error("服务器内部错误");
        break;
      default:
        ElMessage.error(`请求失败 (${status})`);
    }
  }

  // 封装请求方法
  public request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.request<any, ApiResponse<T>>(config);
  }

  public get<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: "GET", url, params, ...config });
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: "POST", url, data, ...config });
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: "PUT", url, data, ...config });
  }

  public delete<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: "DELETE", url, params, ...config });
  }

  // 上传文件
  public upload<T = any>(
    url: string,
    file: File | Blob,
    filename?: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(filename || "file", file);

    return this.request<T>({
      method: "POST",
      url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  }

  // 下载文件
  public download(url: string, params?: any, filename?: string): Promise<void> {
    return this.instance({
      method: "GET",
      url,
      params,
      responseType: "blob",
    }).then((response) => {
      // 创建下载链接
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download =
        filename || this.getFileNameFromResponse(response) || "download";
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  // 从响应头获取文件名
  private getFileNameFromResponse(response: AxiosResponse): string {
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const match = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
      );
      if (match && match[1]) {
        return decodeURIComponent(match[1].replace(/['"]/g, ""));
      }
    }
    return "";
  }
}

// 导出单例实例
export default new Request();
