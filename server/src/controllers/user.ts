import type { Context } from 'koa';
import twilio from 'twilio';
import bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import type { ValidationError } from 'class-validator';

import User from 'src/models/user';
import { CreateUserDto, SendSMSVerificationCodeDto } from 'typings/auth.dto';
import { CreateUserProps } from 'typings/auth';

export const verifyExistenceUsername = async (ctx: Context) => {
  const { username } = ctx.params;

  const exUser = await User.findOne({
    where: { username },
  });

  if (exUser) {
    ctx.status = 409;
    ctx.body = { message: '이미 존재하는 username 입니다.' };
    return;
  }
  ctx.status = 202;
  ctx.body = { message: '사용 가능한 username 입니다.' };
};

export const sendSMSVerificationCode = async (ctx: Context) => {
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
  ctx.session.verificationCode[phoneNumber] = verificationCodeStr;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const recipient = client.messages
    .create({
      body: '',
      from: process.env.TWILIO_FROM,
      to: phoneNumber,
    })
    .then((info) => info.to)
    .catch((err) => console.error(err));

  ctx.status = 200;
  ctx.body = { message: `${recipient} 번호로 인증번호가 전송되었습니다.` };
};

export const checkSMSVerificationCode = async (ctx: Context) => {
  const { phoneNumber, code } = ctx.request.body;

  if (!ctx.session) throw new Error('ctx 에 session 프로퍼티가 존재하지 않습니다.');
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

export const createUser = async (ctx: Context) => {
  const createUserFields: CreateUserProps = ctx.request.body;

  const createUserDto = new CreateUserDto();
  Object.keys(createUserFields).forEach((fieldName) => {
    type FieldName = keyof CreateUserProps;
    createUserDto[fieldName as FieldName] = createUserFields[fieldName as FieldName];
  });

  const validationErrors: ValidationError[] = await validate(createUserDto);
  if (validationErrors.length > 0) {
    ctx.status = 400;
    ctx.body = { message: validationErrors };
    return;
  }

  const hashedPassword = await bcrypt.hash(createUserFields.password, 10);
  await User.create({
    phone_number: createUserFields.phoneNumber, // TODO: 카멜케이스로 적어도 DB에서 스네이크로 자동 변환되는지 확인하기
    realname: createUserFields.realname,
    username: createUserFields.username,
    password: hashedPassword,
  });

  ctx.status = 201;
  ctx.body = { message: '회원가입이 완료되었습니다' };
};
