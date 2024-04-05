import api from "../Api/apiAxios";

export const loginUser  = async (userLogin) => {
    let data = await api.get(`Authentication/Login?email=${userLogin.email}&password=${userLogin.password}`).then(result => result.data);
    return data;
}

export const getUserInformation  = async (userLogin) => {
    let data = await api.get(`Authentication/getLoginInfo?email=${userLogin.email}&password=${userLogin.password}`).then(result => result.data);
    return data;
}

export const getChangePasswordT  = async (email,state) => {
    let data = await api.get(`Authentication/GetchangePasswordToken?email=${email}`).then(result => result.data);
    state(data)
    return data;
}

export const changePasswordT  = async (newCredentials) => {
    let data = 
    await api.put(`Authentication/ChangePassword?email=${newCredentials.email}&newPassword=${newCredentials.password}`).then(result => result.data);
    return data;
}

