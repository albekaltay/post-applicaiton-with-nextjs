
export interface IPost {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface IAuthor {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}


export interface CommentRequest {
  body: string;
  postId: number;
  userId: number;
}

// Interface ekleyelim
export interface GetPostsResponse {
  posts: IPost[];
  total: number;
  skip: number;
  limit: number;
}


// Mevcut interface'i güncelle veya yeni ekle
export interface GetPostsParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Mevcut interface'i güncelleyelim
export interface GetPostsByTagArgs extends GetPostsParams {
  tag: string;
}

// Yeni interface ekleyelim
export interface CreatePostRequest {
  title: string;
  userId: number;
}

export interface CreatePostResponse  extends CreatePostRequest{
  id: number;
}

export interface ICommentUser {
  id: number;
  username: string;
  fullName: string;
}

export interface IComment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: ICommentUser;
}
  
export interface GetCommentsResponse {
  comments: IComment[];
  total: number;
  skip: number;
  limit: number;
}

export interface IUserHair {
  color: string;
  type: string;
}

interface ICoordinates {
  lat: number;
  lng: number;
}

interface IAddress {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: ICoordinates;
  country: string;
}

interface ICompany {
  department: string;
  name: string;
  title: string;
  address: IAddress;
}

interface IBank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

interface ICrypto {
  coin: string;
  wallet: string;
  network: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: IUserHair;
  ip: string;
  address: IAddress;
  macAddress: string;
  university: string;
  bank: IBank;
  company: ICompany;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: ICrypto;
  role: 'admin' | 'moderator' | 'user';
}

export interface ApiError {
  data?: {
    message?: string;
  };
}