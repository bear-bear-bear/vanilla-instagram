import type { Context } from 'koa';
import twilio from 'twilio';
import { validate } from 'class-validator';
import type { ValidationError } from 'class-validator';

import SendSMSCodeDto from 'typings/sms.dto';
import type { CheckSMSCodeProps, SendSMSCodeProps } from 'typings/sms';

export const sendSMSCode = async (ctx: Context): Promise<void> => {
  const { phoneNumber }: SendSMSCodeProps = ctx.request.body;

  const sendSMSCodeDto = new SendSMSCodeDto({ phoneNumber });
  const validationErrors: ValidationError[] = await validate(sendSMSCodeDto);
  if (validationErrors.length > 0) {
    ctx.status = 400;
    ctx.body = { error: validationErrors };
    return;
  }

  const max = 999_999;
  const randomNum = Math.ceil(Math.random() * max);
  const codeStr = randomNum.toString().padStart(6, '0'); // '000001' ~ '999999'

  if (!ctx.session) throw new TypeError('"ctx.session" is not defined');
  if (!ctx.session.code) ctx.session.code = {};
  ctx.session.code[phoneNumber] = codeStr;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const recipient = await client.messages
    .create({
      body: `[TOYSTAGRAM] 인증번호: ${codeStr} 인증번호를 입력해주세요.`,
      from: process.env.TWILIO_FROM,
      to: phoneNumber,
    })
    .then((info) => info.to);

  ctx.status = 200;
  ctx.body = {
    message: `${recipient} 번호로 인증번호가 전송되었습니다.`,
    data: {
      maxAge: ctx.session.maxAge, // 클라이언트에 타이머 요청하기
    },
  };
};

export const checkSMSCode = async (ctx: Context): Promise<void> => {
  const { phoneNumber, code }: CheckSMSCodeProps = ctx.request.body;

  if (!ctx.session) throw new TypeError('"ctx.session" is not defined');
  if (!ctx.session.code) ctx.session.code = {};
  const sentCode = ctx.session.code[phoneNumber];

  if (!sentCode) {
    ctx.status = 410;
    ctx.body = {
      error: `${phoneNumber} 번호로 저장했던 인증 코드가 만료되었거나 존재하지 않습니다.`,
    };
    return;
  }
  if (code !== sentCode) {
    ctx.status = 400;
    ctx.body = { error: '잘못된 인증번호입니다.' };
    return;
  }
  ctx.status = 202;
  ctx.body = { message: '인증번호 확인 완료.' };
};
