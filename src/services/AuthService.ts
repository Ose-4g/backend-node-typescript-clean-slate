// import { IUserRepository } from '../repositories/userRepository';
// import { IUser } from '../models/UserModel';
// import AppError from '../errors/AppError';
// import { createAccessToken, generateHashedValue, checkValidity, generateSixDigitCode } from '../utils/helpers/auth';
// import logger from '../utils/logger';
// import env from '../env.config';
// import { INotificationService } from './NotificationService';
// import validator from 'validator';
// import filteredUser from '../utils/helpers/filterUserInfo';
// import constants from '../utils/constants';

// const { ADMIN } = constants.userRoles;

// const { VERIFY_TOKEN_EXPIRES_IN } = env;

// export interface IAuthService {
//   login(email: string, password: string): Promise<{ user: IUser; token: string }>;
//   signup(
//     email: string,
//     fullname: string,
//     username: string,
//     password: string,
//     toc: boolean,
//     role: string,
//     occupation: string,
//     bio: string,
//     profileImageUrl: string
//   ): Promise<IUser>;
//   verifyAccount(verifyToken: string): Promise<IUser>;
//   forgotPassword(email: string): Promise<null>;
//   resetPassword(password: string, passwordResetToken: string): Promise<null>;
//   requestAccountVerification(email: string): Promise<null>;
//   checkBannedOrDeleted(userId: string): Promise<IUser | void>;
//   seedDatabase(email: string, fullname: string, username: string, password: string): Promise<void>;
// }

// class AuthService implements IAuthService {
//   private readonly userRepository: IUserRepository;
//   private notificationService: INotificationService;
//   constructor(userRepository: IUserRepository, notificationService: INotificationService) {
//     this.userRepository = userRepository;
//     this.notificationService = notificationService;
//   }

//   /**
//    *
//    * @param email : email of the user that wants to log in
//    * @param password : passoword of the user that wants to log in
//    * @returns : details of the user that wants to login as well as the access token
//    */
//   login = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
//     const user: IUser | null = await this.userRepository.findOne(
//       {
//         email: email,
//       },
//       '+password'
//     );
//     if (!user) {
//       throw new AppError('User does not exist', 404);
//     }
//     if (user.verified === false) throw new AppError('User is not verified. Please verify your account', 400);
//     if (!checkValidity(password, user.password)) throw new AppError('Invalid Email or Password', 400);

//     const { token } = await createAccessToken(user._id);
//     return { user: filteredUser(user), token: token };
//   };

//   /**
//    * function to create a user profile in the database
//    * @param email : email of the user to be registered
//    * @param fullname : full name (firstname lastname) of the user
//    * @param username : unique username of the user
//    * @param password : password of the user
//    * @param toc : boolean: true if the user accepted terms and conditions
//    * @param role : user role. Valid values are admin, user and client
//    * @param occupation : occupation of user
//    * @param bio : user bio
//    * @param profileImageUrl: user profile image
//    * @returns : The signed up user object.
//    */
//   signup = async (
//     email: string,
//     fullname: string,
//     username: string,
//     password: string,
//     toc: boolean,
//     role: string,
//     occupation: string,
//     bio: string,
//     profileImageUrl: string
//   ): Promise<IUser> => {
//     logger.info('Starting SignUp Service');
//     const prevUser1 = await this.userRepository.findOne({ email: email });
//     if (prevUser1) throw new AppError(`Duplicate email used. Email ${email} already exists`, 400);
//     const prevUser2 = await this.userRepository.findOne({ username: username });
//     if (prevUser2) throw new AppError(`Duplicate username used. Username ${username} already exists`, 400);
//     const verificationToken = generateSixDigitCode();
//     const newPassword = await generateHashedValue(password);
//     const user = await this.userRepository.createUser({
//       fullname: fullname,
//       username: username,
//       email: email,
//       profileImageUrl: profileImageUrl,
//       password: newPassword,
//       toc: toc,
//       bio: bio,
//       role: role,
//       occupation: occupation,
//       verifyToken: verificationToken,
//       verifyTokenExpires: new Date(Date.now() + Number(VERIFY_TOKEN_EXPIRES_IN) * 60000).toISOString(),
//     } as IUser);

//     //Email Notification and verification
//     this.notificationService.sendMail(
//       email,
//       'Verify your account- Sprungg',
//       'Verify your account',
//       `Hello, Thanks for registering an account with Sprungg. To continue, please verify your account by filling in the verification code: ${verificationToken}`,
//       false
//     );
//     return filteredUser(user);
//   };

//   /**
//    *
//    * @param verifyToken : token sent to user on registration or on request
//    * @returns : The user object after the email verification is successful
//    */
//   verifyAccount = async (verifyToken: string): Promise<IUser> => {
//     const user = await this.userRepository.findOne({
//       verifyToken: verifyToken,
//       verifyTokenExpires: { $gte: new Date().toISOString() },
//     });
//     if (!user) throw new AppError('Invalid / Expired verification token', 400);
//     if ((user as IUser).verified) throw new AppError('User is already verified', 400);
//     user.verified = true;
//     user.verifyToken = undefined;
//     user.verifyTokenExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     return filteredUser(user);
//   };

//   /**
//    *
//    * @param email : email of the user who forgot password
//    * @returns : null. It generates a token and sends to the user.
//    */
//   forgotPassword = async (email: string): Promise<null> => {
//     const resetToken = generateSixDigitCode();
//     const user = await this.userRepository.findAndUpdate(
//       { email: email },
//       {
//         passwordResetToken: resetToken,
//         passwordResetExpires: new Date(Date.now() + Number(VERIFY_TOKEN_EXPIRES_IN) * 60000).toISOString(),
//       }
//     );

//     const message = `Need a new password? No worries. Enter the code ${resetToken} to reset your password.
//       This reset code expires in ${VERIFY_TOKEN_EXPIRES_IN} minutes.`;
//     //Send an email to reset your password
//     this.notificationService.sendMail(
//       email,
//       'Reset your password- Sprungg',
//       'Reset your password',
//       `${message}`,
//       false
//     );

//     return null;
//   };

//   /**
//    *
//    * @param password : new password
//    * @param passwordResetToken : token send to the user in the previous function
//    * @returns : null, the user function is updated.
//    */
//   resetPassword = async (password: string, passwordResetToken: string): Promise<null> => {
//     const newPassword = await generateHashedValue(password);
//     const user = await this.userRepository.findOne({
//       passwordResetToken: passwordResetToken,
//       passwordResetExpires: { $gte: new Date().toISOString() },
//     });
//     // console.log(user);
//     if (!user) throw new AppError('Invalid or Expired Token, Please try again.', 400);
//     user.password = newPassword;
//     user.passwordChangedAt = new Date();
//     user.passwordResetToken = null;
//     user.passwordResetExpires = null;

//     await user.save();

//     return null;
//   };

//   /**
//    *
//    * @param email : email requesting verification
//    * @returns : null. An email is sent showing the details.
//    */
//   requestAccountVerification = async (email: string): Promise<null> => {
//     const user = await this.userRepository.findOne({ email: email });

//     if (!user) throw new AppError('User does not exist', 400);
//     const verificationToken = generateSixDigitCode();

//     logger.info('Checking if user is already verified');
//     if (user.verified) throw new AppError('User is already verified', 400);
//     user.verified = true;
//     user.verifyToken = verificationToken;
//     user.verifyTokenExpires = new Date(Date.now() + Number(VERIFY_TOKEN_EXPIRES_IN) * 60000).toISOString();

//     await user.save();
//     // TODO: Add  to send verification mail
//     this.notificationService.sendMail(
//       email,
//       'Verify your account- Sprungg',
//       'Verify your account',
//       `Hello, Thanks for registering an account with Sprungg. To continue, please verify your account by filling in the verification code: ${verificationToken}`,
//       false
//     );

//     return null;
//   };

//   /**
//    * Throw's an error if a user with id=userid does not exist, is banned or deleted.
//    * @param userId : user id of a user
//    * @returns : the user object only if the user is not banned or deleted.
//    */
//   checkBannedOrDeleted = async (userId: string): Promise<IUser | void> => {
//     if (!validator.isMongoId(userId)) throw new AppError('invalid user id', 400);

//     const user = await this.userRepository.findById(userId, '+password', { lean: true });
//     if (!user) throw new AppError('User not found', 404);
//     if (user.banned) throw new AppError('User is banned', 403);
//     if (user.verified === false) throw new AppError('User is not verified', 403);
//     return user;
//   };

//   /**
//    * created a default user in the database.
//    * @param email : email of the admin user
//    * @param fullname : fullname of the admin user
//    * @param username : usrname of the admin user
//    * @param password : password of the admin user
//    */
//   seedDatabase = async (email: string, fullname: string, username: string, password: string): Promise<void> => {
//     const prevUser = await this.userRepository.findOne({ email: email, role: 'admin' });
//     if (prevUser) {
//       logger.info(`Admin email ${email} already exists`);
//     } else {
//       const newPassword = await generateHashedValue(password);
//       await this.userRepository.createUser({
//         fullname: fullname,
//         username: username,
//         email: email,
//         profileImageUrl: 'https://ui-avatars.com/api?name=Sprungg+Admin',
//         password: newPassword,
//         toc: true,
//         verified: true,
//         role: ADMIN,
//       } as IUser);
//     }
//   };
// }

// export default AuthService;
