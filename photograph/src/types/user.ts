export type UserInfo = {
  _id: string;
  nickname: string;
  avatar_file: { url: string };
  phone?: string;
  profession?: string;
  email?: string;
  gender?: number;
  register_date: number;
  birthday?: string;
};
export type ShoppingCart = {
  title: string;
  name: string;
  _id: string;
  image: string;
  price: number;
};
export type Subscirbe = { name: string; image: string; price: number };
