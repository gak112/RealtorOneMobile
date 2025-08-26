export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: any;
  type: 'text' | 'image' | 'file';
  read: boolean;
  groupId?: string;
  sortDate?: any;
  seenBy?: { [userId: string]: boolean };
  image?: string;
  message?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[];
  createdBy: string;
  createdAt: any;
  updatedAt: any;
  lastMessage?: Message;
  isActive: boolean;
}

export interface GroupMember {
  userId: string;
  userName: string;
  userPhotoURL?: string;
  role: 'admin' | 'member';
  joinedAt: any;
}
