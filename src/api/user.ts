import request from "@/utils/request";

export const userApi = {
  // 登录
  login: async (data: { account: string; password: string }) => {
    const response = await request.post("/Login/GetToken", data);
    return response.data;
  },
};
