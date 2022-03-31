// import { IUser } from '../models/UserModel';
// import { IUserRepository } from '../repositories/userRepository';
// import { PaginatedResult, role, UserProfile } from '../utils/types';
// import validator from 'validator';
// import AppError from '../errors/AppError';
// import { FilterQuery } from 'mongoose';
// import constants from '../utils/constants';
// import { deleteSingleFileFromS3 } from '../utils/aws';
// import { getUserProfile } from '../utils/convert';

// const { ADMIN, USER, CLIENT } = constants.userRoles;
// export interface IUserService {
//   fetchUserProfile(userId: string): Promise<UserProfile | void>;
//   updateProfileImage(imageUrl: string, targetUserId: string, loggedInUser: IUser): Promise<void>;
//   updateUserProfile(userId: string, name?: string, bio?: string, occupation?: string): Promise<void>;
//   getAllUsers(
//     page: number,
//     limit: number,
//     options?: { usertype?: string; maxDate?: Date; minDate?: Date }
//   ): Promise<PaginatedResult<UserProfile>>;
//   banUserLogic(userId: string, ban: boolean, banReason?: string, banExpires?: Date): Promise<void>;
//   deleteAccount(userId: string): Promise<void>;
// }

// class UserService implements IUserService {
//   userRepository: IUserRepository;

//   constructor(userRepository: IUserRepository) {
//     this.userRepository = userRepository;
//   }

//   /**
//    * Inner function to validate that a userId is valid
//    * @param userId : user id
//    * @returns : The found user if there's no error.
//    */
//   private async verifyUser(userId: string): Promise<IUser> {
//     if (!validator.isMongoId(userId as string)) throw new AppError('invalid id provided', 400);
//     const user = await this.userRepository.findById(userId);

//     if (!user) throw new AppError('user not found', 404);
//     return user;
//   }

//   /**
//    * Fetches information avout a user
//    * @param userId : id of the user
//    * @returns : The profile of the user/
//    */
//   async fetchUserProfile(userId: string): Promise<void | UserProfile> {
//     const user = await this.verifyUser(userId as string);
//     return getUserProfile(user);
//   }

//   /**
//    * Updates profile image of the user.
//    * Either the owner of the account or an admin can update the profile image.
//    * @param imageUrl : new image url
//    * @param targetUserId : the userId of account we want to update the profile picture
//    * @param loggedInUser : The id of hte user or admin that's logged in.
//    */
//   async updateProfileImage(imageUrl: string, targetUserId: string, loggedInUser: IUser): Promise<void> {
//     const validUser = loggedInUser._id.toString() === targetUserId || loggedInUser.role === ADMIN;
//     if (!validUser) throw new AppError('You are unauthorized to access this route', 403);
//     const user = await this.verifyUser(targetUserId);
//     deleteSingleFileFromS3(user.profileImageUrl);
//     await this.userRepository.findAndUpdate({ _id: targetUserId }, { profileImageUrl: imageUrl });
//   }

//   /**
//    * updates a user's profile.
//    * @param userId : id of the user
//    * @param name : new  name
//    * @param bio : new i: new occupationo
//    * @param occupation
//    */
//   async updateUserProfile(userId: string, name?: string, bio?: string, occupation?: string): Promise<void> {
//     await this.verifyUser(userId);

//     const update: any = {};
//     if (name) update.fullname = name;
//     if (bio) update.bio = bio;
//     if (occupation) update.occupation = occupation;

//     await this.userRepository.findAndUpdate({ _id: userId }, update);
//   }

//   /**
//    * Function to get all users paginated
//    * @param page : page of results to return
//    * @param limit : number of results per page
//    * @param options : filter options.
//    * @returns
//    */
//   async getAllUsers(
//     page: number,
//     limit: number,
//     options?: { usertype?: role | undefined; maxDate?: Date | undefined; minDate?: Date | undefined }
//   ): Promise<PaginatedResult<UserProfile>> {
//     const filter: FilterQuery<IUser> = {};
//     if (options) {
//       const { usertype, minDate, maxDate } = options;

//       if (usertype) {
//         if (usertype === ADMIN || usertype === USER || usertype === CLIENT) filter.role = usertype;
//       }
//       if (maxDate && minDate) {
//         filter.createdAt = { $lte: maxDate, $gte: minDate };
//       } else if (maxDate) {
//         filter.createdAt = { $lte: maxDate };
//       } else if (minDate) {
//         filter.createdAt = { $gte: minDate };
//       }
//     }
//     const data = await this.userRepository.findAndPaginate(filter, page, limit, { createdAt: -1 });
//     //remove sensitive data from the data.
//     const userTrimmed: UserProfile[] = [];

//     for (const doc of data.data) {
//       const { fullname, username, email, bio, profileImageUrl, occupation } = doc;
//       userTrimmed.push(getUserProfile(doc));
//     }
//     data.data = userTrimmed as IUser[];
//     return data as PaginatedResult<UserProfile>;
//   }
//   async banUserLogic(userId: string, ban: boolean, banReason?: string, banExpires?: Date): Promise<void> {
//     const user = await this.verifyUser(userId);
//     if (user.role === ADMIN) throw new AppError('cannot ban admin', 403);
//     if (ban) {
//       await this.userRepository.findAndUpdate(
//         { _id: userId },
//         {
//           banned: true,
//           banReason: banReason || '',
//           banExpires: banExpires || Date.now(),
//         }
//       );
//     } else {
//       await this.userRepository.findAndUpdate(
//         { _id: userId },
//         {
//           banned: false,
//           banReason: null,
//           banExpires: null,
//         }
//       );
//     }
//   }

//   async deleteAccount(userId: string): Promise<void> {
//     await this.verifyUser(userId);
//     await this.userRepository.findByIdAndDelete(userId);
//   }
// }

// export default UserService;
