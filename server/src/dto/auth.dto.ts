import {
  IsAlphanumeric,
  IsLowercase,
  IsMobilePhone,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { CreateUserProps, ReadUserProps } from 'typings/auth';

export class CreateUserDto implements CreateUserProps {
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

export class ReadUserDto implements ReadUserProps {
  @IsString()
  id!: string; // phone number || username

  @IsString()
  password!: string;
}
