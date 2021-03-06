import {
  IsAlphanumeric,
  IsLowercase,
  IsMobilePhone,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import regex from 'src/lib/regex';
import type { CreateUserProps, ReadUserProps } from 'typings/user';

export class CreateUserDto {
  constructor({ phoneNumber, realname, username, password }: CreateUserProps) {
    this.phoneNumber = phoneNumber;
    this.realname = realname;
    this.username = username;
    this.password = password;
  }

  @IsString()
  @IsMobilePhone('ko-KR', { strictMode: true })
  @Matches(regex.phoneNumber)
  phoneNumber!: string;

  @IsString()
  @Matches(regex.realname)
  realname!: string;

  @IsString()
  @Matches(regex.username)
  username!: string;

  @IsString()
  @Matches(regex.password) // TODO: regex 회의 후 수정
  password!: string;
}

export class ReadUserDto {
  constructor({ id, password }: ReadUserProps) {
    this.id = id;
    this.password = password;
  }

  @IsString()
  id!: string; // phone number || username

  @IsString()
  password!: string;
}
