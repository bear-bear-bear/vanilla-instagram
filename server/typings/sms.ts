export interface SendSMSCodeProps {
  phoneNumber: string;
}

export interface CheckSMSCodeProps {
  phoneNumber: string;
  code: string;
}
