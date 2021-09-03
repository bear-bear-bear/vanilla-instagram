import type { Context } from 'koa';
import bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import type { ValidationError } from 'class-validator';

import User from 'src/models/user';
import { CreateUserDto } from 'typings/user.dto';
import type { CreateUserProps, VerifyExistenceUsernameProps } from 'typings/user';

export const verifyExistenceUsername = async (ctx: Context): Promise<void> => {
  const { username }: VerifyExistenceUsernameProps = ctx.params;

  const exUser = await User.findOne({
    where: { username },
  });

  if (exUser) {
    ctx.status = 409;
    ctx.body = { error: '이미 존재하는 username 입니다.' };
    return;
  }
  ctx.status = 202;
  ctx.body = { message: '사용 가능한 username 입니다.' };
};

export const createUser = async (ctx: Context): Promise<void> => {
  const createUserFields: CreateUserProps = ctx.request.body;

  if (!ctx.session) throw new TypeError('"ctx.session" is not defined');
  const isCheckedPhone = ctx.session?.checked?.includes(createUserFields.phoneNumber);
  if (!isCheckedPhone) {
    ctx.status = 401;
    ctx.body = { error: '인증되지 않은 핸드폰 번호 입니다.' };
    return;
  }

  const createUserDto = new CreateUserDto(createUserFields);
  const validationErrors: ValidationError[] = await validate(createUserDto);
  if (validationErrors.length > 0) {
    ctx.status = 400;
    ctx.body = { error: validationErrors };
    return;
  }

  const exUser = await User.findOne({
    where: {
      username: createUserFields.username,
    },
  });
  if (exUser) {
    ctx.status = 409;
    ctx.body = { error: '이미 존재하는 유저입니다.' };
    return;
  }

  const hashedPassword = await bcrypt.hash(createUserFields.password, 10);
  await User.create({
    ...createUserFields,
    password: hashedPassword,
  });

  ctx.status = 201;
  ctx.body = { message: '회원가입이 완료되었습니다' };
};
