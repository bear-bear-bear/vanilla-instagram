import {
  IsAlphanumeric,
  IsLowercase,
  IsMobilePhone,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { CreateUserProps, ReadUserProps } from 'typings/user';

export class CreateUserDto {
  constructor({ phoneNumber, realname, username, password }: CreateUserProps) {
    this.phoneNumber = phoneNumber;
    this.realname = realname;
    this.username = username;
    this.password = password;
  }

  @IsMobilePhone('ko-KR')
  phoneNumber!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  realname!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @IsAlphanumeric()
  @IsLowercase()
  username!: string;

  @IsString()
  @Matches(/.+/) // TODO: regex 회의 후 수정
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
