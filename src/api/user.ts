import request from "@/utils/request";
import type { UserInterface } from "@/types/user";

export const userApi = {
  // 获取用户列表
  getUserList: (params?: { page?: number; size?: number }) => {
    return request.get<UserInterface[]>("/users", params);
  },

  // 创建用户
  createUser: (data: Partial<UserInterface>) => {
    return request.post<UserInterface>("/users", data);
  },

  // 更新用户
  updateUser: (id: string, data: Partial<UserInterface>) => {
    return request.put<UserInterface>(`/users/${id}`, data);
  },

  // 删除用户
  deleteUser: (id: string) => {
    return request.delete(`/users/${id}`);
  },
};
