import request from "./request";

interface LoginResult {
  access_token: string;
  token_type: string;
}

export const loginApi = (data: { username: string; password: string }) => {
  return request.post<any, LoginResult>("/api/auth/login", data);
};
