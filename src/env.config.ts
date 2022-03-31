//holds all our environment variables.
//makes it easier to access them withtheir types.
import dotenv from 'dotenv';

dotenv.config();

interface Env {
  PORT: string;
  NODE_ENV: string;
  MONGO_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  BCRYPT_SALT: string;
  VERIFY_TOKEN_EXPIRES_IN: string;
  AWS_ACCESS_ID: string;
  AWS_ACCESS_KEY: string;
  AWS_BUCKET_NAME: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
  EMAIL_FROM: string;
  NODEMAILER_USER: string;
  ONESIGNAL_APP_ID: string;
  ONE_SIGNAL_REST_API_KEY: string;
  PUSHER_APP_ID: string;
  PUSHER_APP_KEY: string;
  PUSHER_APP_SECRET: string;
  PUSHER_APP_CLUSTER: string;
  NODEMAILER_REFRESH_TOKEN: string;
}

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  BCRYPT_SALT: process.env.BCRYPT_SALT,
  VERIFY_TOKEN_EXPIRES_IN: process.env.VERIFY_TOKEN_EXPIRES_IN,
  AWS_ACCESS_ID: process.env.AWS_ACCESS_ID,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  EMAIL_FROM: process.env.EMAIL_FROM,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID,
  ONE_SIGNAL_REST_API_KEY: process.env.ONE_SIGNAL_REST_API_KEY,
  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
  PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
  PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
  NODEMAILER_REFRESH_TOKEN: process.env.NODEMAILER_REFRESH_TOKEN,
} as Env;
