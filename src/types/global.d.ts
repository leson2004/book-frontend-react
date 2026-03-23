export {};

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IUser<> {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    id: string;
  }
  interface IRegister<> {
    _id: string;
    email: string;
    fullName: string;
  }
  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  interface ILogin<> {
    access_token: string;
    user: {
      email: string;
      phone: string;
      fullName: string;
      role: string;
      avatar: string;
      id: string;
    };
    message: string;
  }
  // interface IErrorLogin<>{
  //     error:string,
  //     message:string,
  //     statusCode:number
  // }
  interface IAccount<> {
    user: IUser;
  }
  interface IUserTable {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    avatar: string;
    phone: string;
    isActive: boolean;
    createAt: date;
    upDateAt: date;
  }
  interface IUserBulk {
    countSuccess: string;
    countError: string;
    detail: any;
  }
  interface IBooks {
    _id: string;
    thumbnail: string;
    slider: [];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: string;
    updatedAt: string;
  }
  interface ICarts {
    _id: string;
    quantity: number;
    detail: IBooks;
  }
  interface IOrderHistory{
    _id:string;
    name:string;
    type:string;
    email:string;
    phone:string;
    userId:string;
    detail:
    {
    bookName:string;
    quantity:number;
    _id:string;
  }[];
    totalPrice:number;
    createdAt: string;
    updatedAt: string;
  }
  interface IDashboard {
    countOrder:number;
    countUser:number;countBook:number;
  }
  interface IOrder {
    _id: string;
    name: string;
    address: string;
    phone:string;
    type:string;
    paymentStatus:string;
    paymentRef:string;
    detail:
    {
    bookName:string;
    quantity:number;
    _id:string;
    }[];
    totalPrice:number;
    createdAt: string;
    updatedAt: string;

  }
}
