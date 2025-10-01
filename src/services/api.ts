import axios from './axios.customize';

const loginApi=async(username:string ,password:string)=>{
    return await axios.post<IBackendRes<ILogin >>("/api/v1/auth/login",{username,password})
}
const registerApi = async(fullName:string,email:string,password:string,phone:string)=>{
    return await axios.post<IBackendRes<IRegister >>("/api/v1/user/register",{fullName,email,password,phone})

}
const fetchAccountApi = async()=>{
    return await axios.get<IBackendRes<IAccount>>("/api/v1/auth/account")
}

export {loginApi,registerApi,fetchAccountApi}