export function generateOTP(length = 4) {
    return Math.floor(
      10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1)
    ).toString();
  }
  
  
  export function getOTPMessage(otp: string, phone: string) {
    const message = `Your Account OTP is: ${otp} Please do not share this with anyone. - ARHAFX - Arhasri Technologies Private Limited`;
    const body = {
      key: '2675D8AD6BBA2A',
      msg: message,
      to: phone,
      rid: 16,
      sender: 'ARHAFX',
      compaign: 0,
    };
    return JSON.stringify(body);
  }
  