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
  readonly _id: string
  userId: string;
  commentary: [Commentary]
  content: string;
  date: Date;
  userType: string
  isOpeningCommentary?: boolean;
}

export interface Commentary {
  readonly _id: string,
  userId: string,
  type: string,
  data: string
}
