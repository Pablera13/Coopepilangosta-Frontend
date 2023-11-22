import api from "../Api/apiAxios";

export const getForesightById = async(id,state) => {
    
    let data = await api.get(`Foresight/${id}`).then(result => result.data);
    console.log(data)
    state(data)
    return data;
}

export const createForesight = async (foresight) => { 
    let data = await api.post('Foresight',foresight).then(result => result.data);
    console.log(data)
    return data;
};