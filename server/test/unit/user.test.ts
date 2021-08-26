import { Context, Next } from 'koa';
import { createMockContext } from '@shopify/jest-koa-mocks';
 
import { createUser } from 'app/controllers/user';
import User from 'app/models/user';

let ctx: Context;
let next: Next;
beforeEach(() => {
  ctx = createMockContext();
  next = jest.fn();
});

describe('Create User Controllers', () => {
  describe('createUser', () => {
    it('함수여야한다.', () => {
      expect(typeof createUser).toBe('function');
    });

    it('User 모델의 create 메서드를 호출해야 한다.', async () => {
      await createUser(ctx, next);
    });
  });

  describe('verifyExistenceUsername', () => {
    
  });

  describe('sendSMSVerificationCode', () => {
    
  });
});
