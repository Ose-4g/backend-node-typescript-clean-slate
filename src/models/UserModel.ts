import { Document, Model, model, Types, Schema } from 'mongoose';
import { role, TimeStamps } from '../utils/types';
import validator from 'validator';
import getTypeAndDefaultValue from '../utils/helpers/getTypeAndDefaultValue';
import constants from '../utils/constants';

const { USER } = constants.mongooseModels;
const { ADMIN, CLIENT, USER: USER_ROLE } = constants.userRoles;
export interface IUser extends Document, TimeStamps {
  fullname: string;
  username: string;
  email: string;
  role: string | role;
  bio?: string;
  password: string;
  profileImageUrl: string;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null | string;
  passwordChangedAt: Date | null;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  verified: boolean;
  verifyToken?: string;
  verifyTokenExpires?: Date | string;
  occupation: string | null;
  oneSignalId: string[] | null;
  toc: boolean;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    fullname: {
      type: String,
      trim: true,
      required: [true, "User's full name is required"],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, 'Email is invalid'],
      required: [true, 'Email address is required'],
    },
    role: {
      type: String,
      enum: [USER_ROLE, ADMIN, CLIENT],
      default: USER_ROLE,
    },
    toc: {
      type: Boolean,
      required: [true, 'Terms of Condition is required'],
    },
    bio: getTypeAndDefaultValue(String, ''),
    password: {
      type: String,
      select: false,
      required: [true, 'Password is required'],
    },
    profileImageUrl: {
      type: String,
      default: 'https://ui-avatars.com/api/?name=New+User',
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    banReason: {
      type: String,
      default: null,
    },
    banExpires: {
      type: Date,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifyToken: getTypeAndDefaultValue(String, ''),
    verifyTokenExpires: getTypeAndDefaultValue(Date, ''),
    occupation: {
      type: String,
      default: null,
    },
    oneSignalId: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const User: Model<IUser> = model(USER, UserSchema);

export default User;
