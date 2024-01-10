import api from "../Api/apiAxios";

export const getCostumers = async () => { 
    let data = await api.get('costumer').then(result => result.data);
    //console.log(data)
    return data;
};


export const getCostumerById = async(id,state) => {
    
    let data = await api.get(`costumer/${id}`).then(result => result.data);
    state(data)
    return data;
}

export const checkCedula = async(id) => {
    
    let data = await api.get(`costumer/checkCedula?${id}`).then(result => result.data);
    console.log(data)
    return data;
}

export const createCostumer = async (costumer) => { 
    let data = await api.post('Costumer',costumer).then(result => result.data);
    return data;
};

export const editCostumer = async (Costumer) => { 
    let data = await api.put('Costumer',Costumer).then(result => result.data);
    return data;
};