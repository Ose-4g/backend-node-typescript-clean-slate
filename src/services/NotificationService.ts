// import sendMail from '../utils/sendMail';
// import emailTemplate from '../utils/templates/email-template';
// import emailTemplateNoButton from '../utils/templates/email-template-no-button';
// import Pusher from 'pusher';
// import axios from 'axios';
// import envConfig from '../env.config';
// import logger from '../utils/logger';
// import { INotificationRepository } from '../repositories/notificationRepository';
// import { INotification } from '../models/NotificationModel';
// import { FilterQuery } from 'mongoose';
// import { IUser } from '../models/UserModel';
// import constants from '../utils/constants';
// import { IRoot } from '../models/RootModel';
// import { IProject } from '../models/ProjectModel';
// import { PaginatedResult } from '../utils/types';
// const {
//   PUSHER_APP_ID,
//   PUSHER_APP_KEY,
//   PUSHER_APP_SECRET,
//   PUSHER_APP_CLUSTER,
//   ONESIGNAL_APP_ID,
//   ONE_SIGNAL_REST_API_KEY,
// } = envConfig;

// const { USER, ROOT, PROJECT } = constants.mongooseModels;
// const { ACCEPTED, REJECTED } = constants.inviteStatus;

// export interface INotificationService {
//   getAllNotification(
//     userId: string,
//     page: number,
//     limit: number,
//     hasRead?: boolean
//   ): Promise<PaginatedResult<INotification>>;
//   markNotificationsAsRead(notificationIds: string[]): Promise<void>;
//   sendMail(
//     to: string,
//     subject: string,
//     header: string,
//     message: string,
//     button: boolean,
//     buttonText?: string,
//     redirectLink?: string
//   ): void;
//   sendNotificationsToMembers(emails: string[], invitedEmail: string, status: string): void;
//   pusherTrigger(channel: string, event: string, data: any): void;
//   handleInviteNotifications(
//     users: IUser[],
//     options: { root?: IRoot; project?: IProject },
//     userId: string
//   ): Promise<INotification[]>;
//   sendOneSignalNotificationExternalIds(
//     title: string,
//     message: string,
//     externalIds: string[],
//     data: any,
//     webUrl: string
//   ): void;
//   sendOneSignalNotificaionPlayerId(
//     title: string,
//     message: string,
//     playerIds: string[],
//     data: any,
//     webUrl: string
//   ): void;
// }

// const ONE_SIGNAL_BASE_URL = 'https://onesignal.com/api/v1/notifications';

// //singleton class for notifications.
// class NotificationService implements INotificationService {
//   private pusher = new Pusher({
//     appId: PUSHER_APP_ID as string,
//     key: PUSHER_APP_KEY as string,
//     secret: PUSHER_APP_SECRET as string,
//     cluster: PUSHER_APP_CLUSTER as string,
//     useTLS: true,
//   });

//   // private static instance: INotificationService | null = null;
//   notificationRepository: INotificationRepository;

//   constructor(notificationRepository: INotificationRepository) {
//     this.notificationRepository = notificationRepository;
//   }

//   // static getInstance(): INotificationService {
//   //   if (!NotificationService.instance) NotificationService.instance = new NotificationService();
//   //   return NotificationService.instance;
//   // }

//   async getAllNotification(
//     userId: string,
//     page: number,
//     limit: number,
//     hasRead?: boolean
//   ): Promise<PaginatedResult<INotification>> {
//     const options: any = {};
//     [
//       {
//         path: 'receiver', // populate createdBy
//         select: 'username fullname email ',
//       },
//       {
//         path: 'sender', // populate mentions
//         select: 'username fullname email ',
//       },
//       {
//         path: 'action',
//       },
//     ];
//     options.populate = [
//       {
//         path: 'receiver', // populate createdBy
//         select: 'username fullname email ',
//       },
//       {
//         path: 'sender', // populate mentions
//         select: 'username fullname email ',
//       },
//       {
//         path: 'action',
//       },
//     ];
//     const filter: FilterQuery<INotification> = {};
//     filter.receiver = userId;
//     if (hasRead) filter.hasRead = hasRead;
//     let notifications = await this.notificationRepository.findAndPaginate(
//       filter,
//       page,
//       limit,
//       { createdAt: -1 },
//       undefined,
//       options
//     );
//     return notifications;
//   }

//   async markNotificationsAsRead(notificationIds: string[]): Promise<void> {
//     await this.notificationRepository.findAndUpdate({ _id: { $in: notificationIds } }, { hasRead: true });
//     // const notifications = await this.notificationRepository.find({ _id: { $in: notificationIds } });
//     // return notifications;
//   }

//   sendNotificationsToMembers(emails: string[], invitedEmail: string, status: string): void {
//     for (const email of emails) {
//       this.sendMail(
//         email,
//         `New Notification from Sprungg`,
//         `Notification from sprungg due to invited member`,
//         `${invitedEmail} ${status} the invite`
//       );
//     }
//   }

//   async handleInviteNotifications(
//     users: IUser[],
//     options: { root?: IRoot; project?: IProject },
//     userId: string
//   ): Promise<INotification[]> {
//     const notifications: INotification[] = [];
//     for (const user of users) {
//       if (user !== null) {
//         if (options.root) {
//           const notification: INotification = {
//             receiver: user._id,
//             sender: userId,
//             actionType: ROOT,
//             action: options.root._id,
//             notificationMessage: `You have been invited to the root ${options.root.name}`,
//             notificationTitle: `${options.root.name}`,
//           } as INotification;
//           notifications.push(notification);
//         } else if (options.project) {
//           const notification: INotification = {
//             receiver: user._id,
//             sender: userId,
//             actionType: PROJECT,
//             action: options.project._id,
//             notificationMessage: `You have been invited to the project ${options.project.name}`,
//             notificationTitle: `${options.project.name}`,
//           } as INotification;
//           notifications.push(notification);
//         }
//       }
//     }
//     const notes = await this.notificationRepository.create(notifications);
//     return notes;
//   }

//   sendMail(
//     to: string,
//     subject: string,
//     header: string,
//     message: string,
//     button: boolean = true,
//     buttonText: string = '',
//     redirectLink: string = ''
//   ) {
//     let html = emailTemplate(header, message, redirectLink, buttonText);
//     if (!button) html = emailTemplateNoButton(header, message);

//     try {
//       sendMail({ to, subject, html });
//     } catch (err) {
//       logger.error(err);
//     }
//   }

//   pusherTrigger(channel: string, event: string, data: any) {
//     this.pusher.trigger(channel, event, data);
//   }

//   sendOneSignalNotificationExternalIds(
//     title: string,
//     message: string,
//     externalIds: string[],
//     data: any,
//     webUrl: string
//   ) {
//     var body = {
//       app_id: ONESIGNAL_APP_ID,
//       contents: { en: message },
//       headings: { en: title },
//       channel_for_external_user_ids: 'push',
//       include_external_user_ids: externalIds, //["6392d91a-b206-4b7b-a620-cd68e32c3a76","76ece62b-bcfe-468c-8a78-839aeaa8c5fa","8e0f21fa-9a5a-4ae7-a9a6-ca1f24294b86"]
//       data,
//       web_url: webUrl,
//     };

//     axios.post(ONE_SIGNAL_BASE_URL, body, {
//       headers: {
//         'Content-Type': 'application/json; charset=utf-8',
//         Authorization: `Basic ${ONE_SIGNAL_REST_API_KEY}`,
//       },
//     });
//   }

//   sendOneSignalNotificaionPlayerId(title: string, message: string, playerIds: string[], data: any, webUrl: string) {
//     var body = {
//       app_id: ONESIGNAL_APP_ID,
//       contents: { en: message },
//       headings: { en: title },
//       include_player_ids: playerIds, //b206-4b7b-a620-cd68e32c3a76","76ece62b-bcfe-468c-8a78-839aeaa8c5fa","8e0f21fa-9a5a-4ae7-a9a6-ca1f24294b86"]
//       data,
//       web_url: webUrl,
//     };

//     axios.post(ONE_SIGNAL_BASE_URL, body, {
//       headers: {
//         'Content-Type': 'application/json; charset=utf-8',
//       },
//     });
//   }
// }

// export default NotificationService;
