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

export {
  loginApi,
  registerApi,
  fetchAccountAPI,
  logoutAPI,
  getUsersAPI,
  createNewUser,
};
