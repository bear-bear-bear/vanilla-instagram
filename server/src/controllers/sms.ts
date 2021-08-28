import type { Context } from 'koa';
import twilio from 'twilio';
import { validate } from 'class-validator';
import type { ValidationError } from 'class-validator';

import SendSMSVerificationCodeDto from 'typings/sms.dto';

export const sendSMSVerificationCode = async (ctx: Context): Promise<void> => {
  const { phoneNumber } = ctx.request.body;

  const sendSMSVerificationCodeDto = new SendSMSVerificationCodeDto();
  sendSMSVerificationCodeDto.phoneNumber = phoneNumber;

  const validationErrors: ValidationError[] = await validate(sendSMSVerificationCodeDto);
  if (validationErrors.length > 0) {
    ctx.status = 400;
    ctx.body = { message: validationErrors };
    return;
  }

  const max = 999_999;
  const randomNum = Math.ceil(Math.random() * max);
  const verificationCodeStr = randomNum.toString().padStart(6, '0'); // '000001' ~ '999999'

  if (!ctx.session) throw new Error('ctx 에 session 프로퍼티가 존재하지 않습니다.');
  if (!ctx.session.verificationCode) ctx.session.verificationCode = {};
  ctx.session.verificationCode[phoneNumber] = verificationCodeStr;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const recipient = await client.messages
    .create({
      body: `[TOYSTAGRAM] 인증번호: ${verificationCodeStr} 인증번호를 입력해주세요.`,
      from: process.env.TWILIO_FROM,
      to: phoneNumber,
    })
    .then((info) => info.to);

  ctx.status = 200;
  ctx.body = {
    message: `${recipient} 번호로 인증번호가 전송되었습니다.`,
    data: {
      maxAge: 3 * 60 * 1000,
    },
  };
};

export const checkSMSVerificationCode = async (ctx: Context): Promise<void> => {
  const { phoneNumber, code } = ctx.request.body;

  if (!ctx.session) throw new Error('ctx 에 session 프로퍼티가 존재하지 않습니다.');
  if (!ctx.session.verificationCode) ctx.session.verificationCode = {};
  const sentCode = ctx.session.verificationCode[phoneNumber];
  if (!sentCode)
    throw new Error(`${phoneNumber} 번호로 저장했던 인증 코드가 만료되었거나 존재하지 않습니다.`);

  if (code !== sentCode) {
    ctx.status = 400;
    ctx.body = { message: '잘못된 인증번호입니다.' };
    return;
  }
  ctx.status = 202;
  ctx.body = { message: '인증번호 확인 완료.' };
};
