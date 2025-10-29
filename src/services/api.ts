import axios from "./axios.customize";

const loginApi = async (username: string, password: string) => {
  return await axios.post<IBackendRes<ILogin>>("/api/v1/auth/login", {
    username,
    password,
  });
};
const registerApi = async (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  return await axios.post<IBackendRes<IRegister>>("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};
const fetchAccountAPI = async () => {
  return await axios.get<IBackendRes<IAccount>>("/api/v1/auth/account", {
    headers: { delay: 2000 },
  });
};
const logoutAPI = async () => {
  return await axios.post<IBackendRes<IRegister>>("/api/v1/auth/logout");
};
const getUsersAPI = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(
    `api/v1/user?${query}`
  );
};
const createNewUser = async (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  return await axios.post<IBackendRes<IRegister>>(`/api/v1/user`, {
    fullName,
    email,
    password,
    phone,
  });
};
const createNewUserBulk = (
  arrayUserUpload: {
    password: string;
    fullName: string;
    email: string;
    phone: string;
  }[]
) => {
  return axios.post<IBackendRes<IUserBulk>>(
    "/api/v1/user/bulk-create",
    arrayUserUpload
  );
};
const updateUser = (
  _id: string | undefined,
  fullName: string,
  phone: string
) => {
  return axios.put<IBackendRes<IRegister>>("/api/v1/user", {
    _id,
    fullName,
    phone,
  });
};
const deleteUser = (id: string) => {
  return axios.delete<IBackendRes<IRegister>>(`/api/v1/user/${id}`);
};
const getBookAPI = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IBooks>>>(`/api/v1/book${query}`);
};
const getCategoryAPI = () => {
  const urlBackend = `/api/v1/database/category`;
  return axios.get<IBackendRes<string[]>>(urlBackend);
};
export const callUploadBookImg = (fileImg: any, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios<
    IBackendRes<{
      fileUploaded: string;
    }>
  >({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": folder,
    },
  });
};
export const createNewBook = (data: {
  thumbnail: string;
  slider: string[];
  mainText: string;
  author: string;
  price: number;
  quantity: number;
  category: string;
}) => {
  const urlBackend = `/api/v1/book`;
  return axios.post<IBackendRes<IBooks>>(urlBackend, data);
};

export {
  loginApi,
  registerApi,
  fetchAccountAPI,
  logoutAPI,
  getUsersAPI,
  createNewUser,
  createNewUserBulk,
  updateUser,
  deleteUser,
  getBookAPI,
  getCategoryAPI,
};
