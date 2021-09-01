import type { CreateUserProps } from 'typings/user';

export default function getJoinTestFields(): CreateUserProps {
  const seed = Math.ceil(Math.random() * 1000);
  const unique = `${Date.now()}${seed}`;
  return {
    phoneNumber: '+821000000000',
    realname: 'test',
    username: `test_${unique}`,
    password: 'test0000',
  };
}
