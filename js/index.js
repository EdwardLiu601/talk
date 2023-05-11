(async function () {
  // 验证token
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    alert("未登录或登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }

  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };
  setUserInfo();

  // 注销事件
  doms.close.onclick = () => {
    API.loginOut();
    location.href = "./login.html";
  };

  // 获取历史数据
  await loadHistory();

  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChart(item);
    }
    scrollBottom();
  }

  // 发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };

  /**
   * 滚动到底部
   */
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  // 设置用户信息
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  // 根据消息对象，将其添加到页面中
  function addChart(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) div.classList.add("me");

    const img = $$$("img");
    img.classList.add("chat-avatar");
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.classList.add("chat-content");
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.classList.add("chat-date");
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  }

  /**
   * 格式化时间
   * @param {Number} timestamp
   * @returns
   */
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const years = date.getFullYear();
    const months = (date.getMonth() + 1).toString().padStart(2, "0");
    const days = date.getDay().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${years}-${months}-${days} ${hours}:${minutes}:${seconds}`;
  }

  //   addChart({
  //     content: "你几岁啦？",
  //     createdAt: 1651213093992,
  //     from: "haha",
  //     to: null,
  //   });

  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    addChart({
      from: user.loginId,
      createdAt: Date.now(),
      content,
      to: null,
    });
    doms.txtMsg.value = "";
    if (!content) return;
    const resp = await API.sendChat({ content });
    console.log("resp: ", resp);
    addChart({
      to: user.loginId,
      from: null,
      ...resp.data,
    });
    scrollBottom();
  }
})();
