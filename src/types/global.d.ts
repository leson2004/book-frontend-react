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
    isActive: boolean;
    createAt: date;
    upDateAt: date;
  }
  interface IUserBulk {
    countSuccess: string;
    countError: string;
    detail: any;
  }
}
