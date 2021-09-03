import type { Context } from 'koa';
import { createMockContext } from '@shopify/jest-koa-mocks';

import { checkSMSCode } from 'src/controllers/sms';
import { createUser } from 'src/controllers/user';

import getJoinUniqueFields from '../helper/getJoinUniqueFields';

const mockPhoneNumber = '+821000000000';
const mockSMSCode = '000000';
const ctx: Context = createMockContext({
  session: {
    code: {},
  },
});

beforeAll(() => {
  if (!ctx.session) throw new Error('never');
  ctx.session.code[mockPhoneNumber] = mockSMSCode;
});

describe('SMS 인증부분 세션 관련 로직 e2e에 대한 커버링', () => {
  it('SMS 코드 인증 완료 시 해당 번호 session.checked 배열에 반영', async () => {
    ctx.request.body = {
      phoneNumber: mockPhoneNumber,
      code: mockSMSCode,
    };
    await checkSMSCode(ctx);

    expect(ctx.session?.checked.includes(mockPhoneNumber)).toBe(true);
  });
});

describe('회원가입 요청 세션 관련 로직 e2e에 대한 커버링', () => {
  it('인증되지 않은 휴대폰 번호에 대해 401 반환', async () => {
    ctx.request.body = {
      ...getJoinUniqueFields(),
      phoneNumber: '+8255555555555',
    };
    await createUser(ctx);

    expect(ctx.status).toBe(401);
  });

  it('입력 필드에 대해 validation 수행', async () => {
    const wrongRealname = '@@@';
    ctx.request.body = {
      ...getJoinUniqueFields(),
      realname: wrongRealname,
      phoneNumber: mockPhoneNumber,
    };
    await createUser(ctx);

    expect(ctx.status).toBe(400);
  });
});
