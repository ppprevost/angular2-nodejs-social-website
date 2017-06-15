export interface Friends {
  userId: string;
  date: Date;
  username?: string;
  image?: string;
  statut: string;
}

export interface User {
  username: string;
  readonly _id: string;
  email: string;
  role: number;
  following: Array<Friends>;
  website?: string;
  gender?: string;
  location?: string;
  bio?: string;
  modifiedAt: Date;
}

export interface Waste {
  readonly _id: string;
  userId: string;
  commentary: Array<Commentary>;
  content: string;
  date: Date;
  likes: number;
  userType: string;
  isOpeningCommentary?: boolean;
}

export interface Commentary {
  readonly _id: string;
  userId: string;
  likes: number;
  type: string;
  data: string;
}
