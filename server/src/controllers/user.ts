import type { Context } from 'koa';
import bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import type { ValidationError } from 'class-validator';

import User from 'src/models/user';
import { CreateUserDto } from 'typings/user.dto';
import { CreateUserProps } from 'typings/user';

export const verifyExistenceUsername = async (ctx: Context): Promise<void> => {
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

export const createUser = async (ctx: Context): Promise<void> => {
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
