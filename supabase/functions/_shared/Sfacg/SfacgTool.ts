// deno-lint-ignore-file no-explicit-any
// 生成随机昵称
export function RandomName() {
  // 生成随机六位汉字+字母+数字组合的代码
  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min);
  const randomChar = (length: number) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[random(0, chars.length)];
    }
    return result;
  };
  const randomChinese = (length: number) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(random(0x4e00, 0x9fa5));
    }
    return result;
  };
  const randomName = randomChinese(2) + randomChar(4);
  return randomName;
}

// 隐藏手机号
export function Secret(phoneNumber: string) {
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

// 获得格式化时间xxxx-xx-xx
export function getNowFormatDate(): string {
  const date = new Date();
  const utc8Offset = 8 * 60;
  const now = new Date(date.getTime() + utc8Offset * 60 * 1000);
  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = now.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 创建一个可以自动重试的函数。
 * @param func 需要进行重试的异步函数。
 * @param retries 最大重试次数，默认为3。
 * @param delayMs 初始重试延迟时间（毫秒），默认为200毫秒，后续增加
 * @param notRetry  接收错误，判断是否不重试
 * @returns 返回一个新的异步函数，它将尝试执行 `func` 并在出错时进行重试。
 */
export function createRetry<T>(
  func: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 50,
  notRetry: (error: any) => boolean = () => true
): () => Promise<T> {
  return async () => {
    let lastError: any;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await func();
      } catch (e) {
        lastError = e;
        if (notRetry(e)) {
          throw e;
        }
        if (attempt < retries) {
          await new Promise(
            (r) => setTimeout(r, delayMs) //delayMs * Math.pow(2, attempt - 1),递增
          );
        }
      }
    }
    throw lastError;
  };
}


