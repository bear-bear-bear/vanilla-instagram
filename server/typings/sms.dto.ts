import { IsMobilePhone, IsString, Matches } from 'class-validator';
import regex from 'src/lib/regex';
import type { SendSMSCodeProps } from 'typings/sms';

export default class SendSMSCodeDto {
  constructor({ phoneNumber }: SendSMSCodeProps) {
    this.phoneNumber = phoneNumber;
  }

  @IsString()
  @IsMobilePhone('ko-KR', { strictMode: true })
  @Matches(regex.phoneNumber)
  phoneNumber!: string;
}
