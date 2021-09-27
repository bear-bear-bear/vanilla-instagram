export interface VerifyExistenceUsernameProps {
  username: string;
}

export interface CreateUserProps {
  phoneNumber: string;
  realname: string;
  username: string;
  password: string;
}

export interface ReadUserProps {
  id: string; // phone number || username
  password: string;
}
