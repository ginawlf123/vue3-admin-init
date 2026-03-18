// 为了保持代码的整洁和可复用性，建议将 NProgress 的配置和调用进行简单封装，并集成到路由守卫中
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'; // 引入核心样式

// 进度条配置项
NProgress.configure({
  minimum: 0.3, // 启动时最小的百分比
  easing: 'ease', // 动画方式
  speed: 500, // 动画速度（毫秒）
  showSpinner: false, // 是否显示右上角的旋转加载器（通常设为 false 更简洁）
  trickleSpeed: 200, // 自动递增的间隔
  parent: 'body', // 指定父容器
})

// 导出开始和关闭方法，方便在其他地方调用
export const start = () => {
  NProgress.start()
}

export const done = () => {
  NProgress.done()
}