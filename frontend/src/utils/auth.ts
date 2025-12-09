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

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};
