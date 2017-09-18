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

export interface Article {
  author: string;
  content: string;
  description: string;
  type: string;
  image: string;
  source: string;
  title: string;
  url: any;
  _url: any;
}

export type TypePost = 'public' | 'private' |'all';

export interface Waste {
  readonly _id: string;
  userId: string;
  commentary: Array<Commentary>;
  content: Article;
  youLikeThis: boolean;
  date: Date;
  likes: Array<string>;
  persoLikeSentence: {content: string,userIds: Array<string>};
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
