import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface InvididualChat {
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  createdBy: string;
  updatedBy: string;
  sortDate: number;
  id?: string;
  objectID?: string;
  userIds: [string, string];
  isStarted: boolean;
  status: ChatStatus;
  requesterId: string;
  recipientId: string;
  statusUpdates: { type: ChatStatus; sortDate: number; createdBy: string }[];
  lastMessageIds: { [uid: string]: Timestamp | FieldValue };
}

export type ChatStatus = 'Requested' | 'Deleted' | 'Accepted' | 'Blocked';
