export type Detail = {
  image: string[];
  title: string;
  price: number;
  types: Types[];
};
export type Types = {
  name: string;
  url: string;
  value: number;
};
export type Week = {
  week: string;
  day: number;
};
export type Mold = {
  _id: string;
  image: string[];
  title: string;
};
export type Zone = {
  mold: string;
  photograph: string[];
  zone: string;
  _id: string;
};
