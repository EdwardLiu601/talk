const API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }

  function post(path, body) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * 注册
   * @param {*} userInfo
   * @returns
   */
  async function reg(userInfo) {
    const resp = await post(`/api/user/reg`, userInfo);
    return await resp.json();
  }

  /**
   * 登录
   * @param {*} loginInfo
   * @returns
   */
  async function login(loginInfo) {
    const resp = await post(`/api/user/login`, loginInfo);
    const result = await resp.json();
    if (result.code === 0) {
      // 将响应头中的令牌保存到localStorage
      const token = resp.headers.get("authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  }

  /**
   * 验证账号
   * @param {*} loginId
   * @returns
   */
  async function exists(loginId) {
    return await get(`/api/user/exists?loginId=${loginId}`).then((resp) =>
      resp.json()
    );
  }

  /**
   * 当前登录的用户信息
   * @returns
   */
  async function profile() {
    return await get(`/api/user/profile`).then((resp) => resp.json());
  }

  /**
   * 发送聊天消息
   * @param {*} content
   * @returns
   */
  async function sendChat(content) {
    return await post(`/api/chat`, content).then((resp) => resp.json());
  }

  /**
   * 获取聊天记录
   * @returns
   */
  async function getHistory() {
    return await get(`/api/chat/history`).then((resp) => resp.json());
  }

  /**
   * 注销
   * 删除token
   */
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
    TOKEN_KEY,
  };
})();
