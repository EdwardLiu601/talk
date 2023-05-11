// 用户注册和登录验证的通用代码

class FieldValidator {
  /**
   * 构造器
   * @param {String} txtId // 被验证的input的id
   * @param {Function} validatorFunc // 验证逻辑的函数，当需要对文本框进行验证时，调用该函数，如果验证失败，返回错误信息，如果验证成功，返回空字符串
   */
  constructor(txtId, validatorFunc) {
    this.input = $(`#${txtId}`);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => {
      this.validate();
    };
  }

  /**
   * 验证成功返回true，验证失败返回false
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      // 如果有错误
      this.p.innerHTML = err;
      return false;
    } else {
      // 如果没有错误
      this.p.innerHTML = "";
      return true;
    }
  }

  /**
   * 执行所有验证器
   * @param  {...any} validators
   */
  static async validate(...validators) {
    const proms = await Promise.all(validators.map((r) => r.validate()));
    return proms.every((r) => r);
  }
}
