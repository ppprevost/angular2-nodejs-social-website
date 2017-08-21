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

export type TypePost = 'public' | 'private' |'all';

export interface Waste {
  readonly _id: string;
  userId: string;
  commentary: Array<Commentary>;
  content: string;
  date: Date;
  likes: Array<string>;
  likeItVeryMuch: boolean;
  userType: TypePost;
  isOpeningCommentary?: boolean;
}

export interface Commentary {
  readonly _id: string;
  userId: string;
  likes: number;
  type: string;
  data: string;
}
