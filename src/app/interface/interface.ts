export interface Friends {
  userId: string;
  date: Date;
  statut: string;
}

export interface User {
  username: string;
  readonly _id: string;
  mail: string;
  role: number;
  following: [Friends];
  website?: string;
  gender?: string;
  location?: string;
  bio?: string;
  modifiedAt: Date;
}

export interface Waste {
  userId: string;
  content: string;
  date: Date;
  userType: string;
}
