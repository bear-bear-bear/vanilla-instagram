import request from 'supertest';
import type { Server } from 'http';

import app from 'src/app';
import { PREFIX } from 'src/routes';
import User from 'src/models/user';
import type { CreateUserProps } from 'typings/user';

import getJoinUniqueFields from '../helper/getJoinUniqueFields';

let listener: Server;
let router: request.SuperTest<request.Test>;
let newJoinFields: CreateUserProps;
let joinedUser: User;

beforeAll(async () => {
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
