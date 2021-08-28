import { IsMobilePhone, IsString } from 'class-validator';

export default class SendSMSVerificationCodeDto {
  @IsString()
  @IsMobilePhone('ko-KR')
  phoneNumber!: string;
}

// export class CheckSMSVerificationCodeDto {
//   @IsString()
//   @IsMobilePhone('ko-KR')
//   phoneNumber!: string;

//   @IsNumberString()
//   @Length(6, 6)
//   code!: string;
// }
