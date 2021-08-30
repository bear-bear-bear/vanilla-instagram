import request from 'supertest';
import bcrypt from 'bcrypt';
import app from 'src/app';
import User from 'src/models/user';
import type { Server } from 'http';

import mockJoinFields from '../mock-data/join-fields.json';

let listener: Server;
let joinedMockUser: User;

beforeAll(async () => {
  listener = app.listen(process.env.PORT || 8001);

  // Error 1. findOne return null
  const exJoinedMockUser = await User.findOne({
    where: { username: mockJoinFields.username },
  });

  console.log('exJoinedMockUser:', exJoinedMockUser);

  if (exJoinedMockUser) {
    joinedMockUser = exJoinedMockUser;
  }

  console.log('mockJoinFields:', mockJoinFields);

  const hashedPassword = await bcrypt.hash(mockJoinFields.password, 10);
  // Error 2. Sequelize Validation error
  joinedMockUser = await User.create({
    ...mockJoinFields,
    password: hashedPassword,
  });
});

afterAll(async () => {
  await User.destroy({
    where: { id: joinedMockUser.id },
  });

  listener.close();
});

describe('GET /api/user/:username/exist', () => {
  it('이미 존재하는 username에 대해 409 반환', async () => {
    const reqURL = `/api/user/${mockJoinFields.username}/exist`;
    const response = await request(app.callback()).get(reqURL);

    expect(reqURL).toBe(`/api/user/honggildong123/exist`);
    expect(response.status).toBe(409);
  });
});
