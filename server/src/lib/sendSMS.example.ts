// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
import twilio from 'twilio';
import dotenv from 'dotenv';
import path from 'path';

// 테스트는 lib/ 에서 하고, SMS 인증 로직은 라우터로 작성할 것임 -bear

dotenv.config({ path: path.join(__dirname, '..', '..', `.env.development`) });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

client.messages
  .create({
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    from: process.env.TWILIO_FROM,
    to: '+821026525302',
  })
  .then((message) => console.log(message.sid));
