import api from "../Api/apiAxios";

export const createForesightProducer = async (foresightProd) => { 
    let data = await api.post('ForesightProducer',foresightProd).then(result => result.data);
    return data;
};

export const deleteForesightProducer = async (id) => { 
    let data = await api.delete(`ForesightProducer/${id}`).then(result =>result);
    return data;
};