import type { CreateUserProps } from 'typings/user';

export default function getJoinTestFields(): CreateUserProps {
  const seed = Math.ceil(Math.random() * 1000);
  const unique = `${Date.now()}${seed}`;
  return {
    phoneNumber: process.env.TWILIO_TEST_TO as string,
    realname: 'test',
    username: `test_${unique}`,
    password: 'test0000',
  };
}
