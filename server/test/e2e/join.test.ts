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

  const exJoinedMockUser = await User.findOne({
    where: { username: mockJoinFields.username },
  });

  if (!exJoinedMockUser) {
    const hashedPassword = await bcrypt.hash(mockJoinFields.password, 10);
    joinedMockUser = await User.create({
      ...mockJoinFields,
      password: hashedPassword,
    });
    return;
  }

  joinedMockUser = exJoinedMockUser;
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
    const reqURL = `/api/user/${mockJoinFields.username}/exist`;
    const response = await request(app.callback()).get(reqURL);

    expect(response.status).toBe(409);
  });
});
