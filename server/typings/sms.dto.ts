import { IsMobilePhone, IsString } from 'class-validator';
import type { SendSMSCodeProps } from 'typings/sms';

export default class SendSMSCodeDto {
  constructor({ phoneNumber }: SendSMSCodeProps) {
    this.phoneNumber = phoneNumber;
  }

  @IsString()
  @IsMobilePhone('ko-KR')
  phoneNumber!: string;
}
