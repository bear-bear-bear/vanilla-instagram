import type { Context, Next } from 'koa';
import { createMockContext } from '@shopify/jest-koa-mocks';
 
import {
  verifyExistenceUsername,
  sendSMSVerificationCode,
  checkSMSVerificationCode,
  createUser,
} from 'src/controllers/user';
import User from 'src/models/user';
import mockJoinFields from '../mock-data/join-fields.json';

// mock
User.create = jest.fn();
User.findAll = jest.fn();

let ctx: Context;
let next: Next;
beforeEach(() => {
  ctx = createMockContext();
  next = jest.fn();
});

describe('Create User Controllers', () => {
  describe('verifyExistenceUsername', () => {
    beforeEach(() => {
      ctx.request.body = mockJoinFields.username;
    });

    test('User 모델의 findAll 메서드를 호출해야 한다.', async () => {
      await verifyExistenceUsername(ctx, next);
      expect(User.findAll).toBeCalledWith(mockJoinFields.username);
    });

    test('상태코드 409로 응답해야 한다.', async () => {
      await verifyExistenceUsername(ctx, next);
      expect(ctx.status).toBe(409);
    });
  });

  describe('sendSMSVerificationCode', () => {
    beforeEach(() => {
      ctx.request.body = mockJoinFields.phoneNumber;
    });

    test('상태코드 200으로 응답해야 한다.', async () => {
      await sendSMSVerificationCode(ctx, next);
      expect(ctx.status).toBe(200);
    });
  });

  describe('checkSMSVerificationCode', () => {
    beforeEach(() => {
      const mockVerificationCode = 123456;
      ctx.request.body = mockVerificationCode;
    });

    test('상태코드 200으로 응답해야 한다.', async () => {
      await checkSMSVerificationCode(ctx, next);
      expect(ctx.status).toBe(200);
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      ctx.request.body = mockJoinFields;
    });

    test('User 모델의 create 메서드를 호출해야 한다.', async () => {
      await createUser(ctx, next);
      expect(User.create).toBeCalledWith(mockJoinFields);
    });

    test('상태코드 201로 응답해야 한다.', async () => {
      await createUser(ctx, next);
      expect(ctx.status).toBe(201);
    });
  });
});
