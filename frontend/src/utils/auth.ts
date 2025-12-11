const TOKEN_KEY = "jellyfish_auth_token";

export const loginMock = (
  username: string,
  password: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端校验，默认 admin/admin
      if (username === "admin" && password === "admin") {
        localStorage.setItem(TOKEN_KEY, "mock-jwt-token-xyz");
        resolve(true);
      } else {
        resolve(false);
      }
    }, 800); // 模拟网络延迟
  });
};

// 登出逻辑
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "/login";
};

// 简单判断是否已登录 (Token是否存在)
// 进阶版：可以在这里解析 JWT 查看是否过期 (exp字段)
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};
