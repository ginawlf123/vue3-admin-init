import { useUserStore } from "@/stores/user";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

// 扩展 AxiosRequestConfig 类型，添加自定义配置
interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean; // 是否显示加载提示
  showError?: boolean; // 是否显示错误提示
}

// 响应数据格式（根据你的后端结构调整）
export interface ApiResponse<T = any> {
  result: boolean; // 是否成功：true 成功，false 失败
  message: string; // 提示信息
  state: number; // 状态码：0 成功，其他失败
  bizData: T; // 返回数据
  // 为了兼容性，添加 data 字段（映射自 bizData）
  data?: T;
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
        const userStore = useUserStore();
        const token = userStore.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 3. 添加其他自定义头
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        config.headers["x-timestamp"] = Date.now().toString();

        // 4. 开发环境打印请求信息
        // if (import.meta.env.DEV) {
        //   console.log(
        //     `🚀 [API] ${config.method?.toUpperCase()} ${config.url}`,
        //     config,
        //   );
        // }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 关闭加载提示
        this.hideLoading();

        const res = response.data;

        // 判断请求是否成功：state === 0 或 result === true
        const isSuccess = res.state === 0 || res.result === true;

        if (isSuccess) {
          // ✅ 将 res数据返回 映射到 data 字段，方便调用方使用
          return {
            ...response,
            data: {
              ...res,
            },
          };
        }

        // 业务错误处理
        this.handleBusinessError(res, response.config as RequestConfig);
        return Promise.reject(new Error(res.message || "请求失败"));
      },
      (error) => {
        this.hideLoading();
        this.handleHttpError(error);
        return Promise.reject(error);
      }
    );
  }

  // 显示加载提示（预留接口，如需使用可取消注释）
  private showLoading() {
    this.loadingCount++;
    // 如需使用全局 loading，取消下面的注释
    // if (this.loadingCount === 1) {
    //   ElLoading.service({ fullscreen: true, text: '加载中...' });
    // }
  }

  // 隐藏加载提示
  private hideLoading() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    // 如需使用全局 loading，取消下面的注释
    // if (this.loadingCount === 0) {
    //   const loadingInstance = ElLoading.service();
    //   loadingInstance.close();
    // }
  }

  // 处理业务错误
  private handleBusinessError(res: ApiResponse, config?: RequestConfig) {
    // 如果不显示错误提示，直接返回
    if (config?.showError === false) return;

    // 使用 state 字段判断错误类型
    switch (res.state) {
      case 401: // 未授权或 token 过期
        this.handleUnauthorized();
        break;

      case 403: // 无权限
        ElMessage.error("您没有权限执行此操作");
        break;

      case 500: // 服务器错误
        ElMessage.error("服务器开小差了，请稍后重试");
        break;

      default:
        // 显示后端返回的错误消息
        ElMessage.error(res.message || "请求失败");
    }
  }

  // 处理未授权错误
  private handleUnauthorized() {
    ElMessageBox.confirm("登录已过期，请重新登录", "提示", {
      confirmButtonText: "去登录",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        const userStore = useUserStore();
        userStore.logout();
        // logout 内部已清理 store 并跳转，无需再手动操作 localStorage/router
      })
      .catch(() => {
        // 用户取消登录，不做任何操作
      });
  }

  // 处理 HTTP 错误
  private handleHttpError(error: any) {
    const { response, message } = error || {};
    const config = error?.config as RequestConfig | undefined;

    // 如果不显示错误提示，直接返回
    if (config?.showError === false) return;

    if (import.meta.env.DEV) {
      console.error("❌ [API] 请求失败:", error);
    }

    // 网络错误（没有响应）
    if (!response) {
      const errorMsg = this.getNetworkErrorMessage(message);
      ElMessage.error(errorMsg);
      return;
    }

    // HTTP 状态码错误
    this.handleHttpStatusError(response.status);
  }

  // 获取网络错误消息
  private getNetworkErrorMessage(message?: string): string {
    if (!message) return "请求失败，请稍后重试";

    const msg = message.toLowerCase();
    if (msg.includes("timeout")) {
      return "请求超时，请检查网络";
    }
    if (msg.includes("network error") || msg.includes("networkerror")) {
      return "网络连接失败，请检查网络";
    }
    return "请求失败，请稍后重试";
  }

  // 处理 HTTP 状态码错误
  private handleHttpStatusError(status: number) {
    const errorMap: Record<number, string> = {
      400: "请求参数错误",
      403: "禁止访问",
      404: "请求的资源不存在",
      500: "服务器内部错误",
      502: "网关错误",
      503: "服务不可用",
      504: "网关超时",
    };

    // 401 已在业务错误中处理，这里跳过
    if (status === 401) return;

    const errorMsg = errorMap[status] || `请求失败 (${status})`;
    ElMessage.error(errorMsg);
  }

  // 封装请求方法
  public request<T = any>(
    config: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.request<any, AxiosResponse<ApiResponse<T>>>(config);
  }

  public get<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.request<T>({ method: "GET", url, params, ...config });
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.request<T>({ method: "POST", url, data, ...config });
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.request<T>({ method: "PUT", url, data, ...config });
  }

  public delete<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.request<T>({ method: "DELETE", url, params, ...config });
  }

  // 上传文件
  public upload<T = any>(
    url: string,
    file: File | Blob,
    filename: string = "file",
    config?: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    const formData = new FormData();
    formData.append(filename, file);

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
    if (!contentDisposition) return "";

    // 匹配 filename= 或 filename*= 格式
    const match = contentDisposition.match(
      /filename[*]?=['"]?([^'";\n]+)['"]?/i
    );
    if (match?.[1]) {
      try {
        return decodeURIComponent(match[1].trim());
      } catch {
        return match[1].trim();
      }
    }
    return "";
  }
}

// 导出单例实例
export default new Request();
