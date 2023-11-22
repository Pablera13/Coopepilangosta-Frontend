import api from "../Api/apiAxios";

export const getRoles = async () => { 
    let data = await api.get('roles').then(result => result.data);
    //console.log(data)
    return data;
};
