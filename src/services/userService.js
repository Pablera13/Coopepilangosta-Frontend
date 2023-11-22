import api from "../Api/apiAxios";

export const getUsers = async () => { 
    let data = await api.get('users').then(result => result.data);
    //console.log(data)
    return data;
};

export const getUserById = async (id,state) => { 
    let data = await api.get(`users/${id}`).then(result => result.data);
    state(data)
    //console.log(data)
    return data;
};

export const createuser = async (user) => { 
    let data = await api.post('users',user).then(result => result.data);
    return data;
};

export const deleteUser = async (id) => { 
    let data = await api.delete(`users/${id}`);
    return data;
};

export const editUser = async (user) => { 
    let data = await api.put('users',user).then(result => result.data);
    return data;
};