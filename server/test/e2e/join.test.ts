import request from 'supertest';
import type { Server } from 'http';

import app from 'src/app';
import User from 'src/models/user';

import getJoinUniqueFields from '../helper/getJoinUniqueFields';

let listener: Server;
let joinedMockUser: User;
// let newMockUser: User;

beforeAll(async () => {
  listener = app.listen(process.env.PORT || 8001);

  const joinedUserFields = await getJoinUniqueFields();
  joinedMockUser = await User.create({
    ...joinedUserFields,
  });
});

afterAll(async () => {
  await User.destroy({
    where: { id: joinedMockUser.id },
    force: true,
  });

  listener.close();
});

describe('GET /api/user/:username/exist', () => {
  it('이미 존재하는 username에 대해 409 반환', async () => {
    const reqURL = `/api/user/${joinedMockUser.username}/exist`;
    const response = await request(app.callback()).get(reqURL);

    expect(response.status).toBe(409);
  });
});
