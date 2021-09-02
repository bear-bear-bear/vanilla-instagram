import request from 'supertest';
import type { Server } from 'http';

import app from 'src/app';
import { connectDB } from 'src/models';
import { PREFIX } from 'src/routes';
import User from 'src/models/user';
import type { CreateUserProps } from 'typings/user';

import getJoinUniqueFields from '../helper/getJoinUniqueFields';

let listener: Server;
let router: request.SuperTest<request.Test>;
let newJoinFields: CreateUserProps;
let joinedUser: User;

beforeAll(async () => {
  await connectDB();
  listener = app.listen(process.env.PORT || 8001);
  router = request(app.callback());
  newJoinFields = getJoinUniqueFields();
  joinedUser = await User.create({
    ...getJoinUniqueFields(),
  });
});

afterAll(async () => {
  await User.destroy({
    where: { id: joinedUser.id },
    force: true, // ignore paranoid
  });

  listener.close();
});

describe(`사용 가능한 username인지 확인`, () => {
  it('사용 가능한 username에 대해 202 반환', async () => {
    const reqURL = `${PREFIX}/user/${newJoinFields.username}/exist`;
    const response = await router.get(reqURL);

    expect(response.status).toBe(202);
  });

  it('이미 존재하는 username에 대해 409 반환', async () => {
    const reqURL = `${PREFIX}/user/${joinedUser.username}/exist`;
    const response = await router.get(reqURL);

    expect(response.status).toBe(409);
  });
});

describe('SMS 인증코드 전송', () => {
  const reqURL = `${PREFIX}/sms`;

  it('전화번호 양식에 대해 validation 수행', async () => {
    const wrongPhoneNumber = 'abcd1234';
    const response = await router.post(reqURL).send({ phoneNumber: wrongPhoneNumber });

    expect(response.status).toBe(400);
  });

  /**
   * FIXME: env.example에 twilio 계정 정보를 넣으면 안되는데..?
   */
  // it('유효하지 않은 번호에 대해 400 반환', async () => {
  //   const notValidPhoneNumber = '+821000000000';
  //   const response = await router.post(reqURL).send({ phoneNumber: notValidPhoneNumber });

  //   expect(response.status).toBe(400);
  // });

  /**
   * @desc 비용문제로 주석처리
   */
  // it('인증코드 전송 성공 시 200과 함께 전화번호가 포함된 메세지와 해당 코드의 maxAge 반환', async () => {
  //   const { phoneNumber: validPhoneNumber } = newJoinFields;
  //   const response = await router.post(reqURL).send({ phoneNumber: validPhoneNumber });
  //   const { message, data } = response.body;

  //   expect(response.status).toBe(200);
  //   expect(message).toContain<string>(validPhoneNumber);
  //   expect<Session['maxAge']>(data.maxAge).toBe(ctx.session?.maxAge);
  // });
});

describe('SMS 인증코드 확인', () => {
  const reqURL = `${PREFIX}/sms/match`;

  it('API가 동작함', async () => {
    const { phoneNumber } = newJoinFields;
    const response = await router.post(reqURL).send({
      phoneNumber,
      code: '000000',
    });

    expect(response.status).not.toBe(404);
  });
});

describe('회원가입 요청', () => {
  const reqURL = `${PREFIX}/user`;

  it('API 동작함', async () => {
    const response = await router.post(reqURL).send({
      ...newJoinFields,
    });

    expect(response.status).not.toBe(404);
  });
});
