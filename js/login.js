const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "请填写密码";
  }
});

const form = $(".user-form");

form.onsubmit = async function (e) {
  // 阻止默认提交事件
  e.preventDefault();
  // 进行表单验证
  const result = await FieldValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );
  // 如果验证未通过，跳过
  if (!result) return;
  // 处理数据，提交给接口
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const resp = await API.login(data);
  if (resp.code === 0) {
    // 账号密码输入正确
    alert("登录成功");
    location.href = "./index.html";
  } else {
    loginIdValidator.p.innerHTML = resp.msg;
    loginPwdValidator.input.value = "";
  }
};
