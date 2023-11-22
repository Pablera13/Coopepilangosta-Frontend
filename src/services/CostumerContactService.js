import api from "../Api/apiAxios";

export const getContactCostumer = async () => { 
    let data = await api.get('CostumerContact').then(result => result.data);
    //console.log(data)
    return data;
};

export const createContactCostumer = async (CostumerContact) => { 
    let data = await api.post('CostumerContact',CostumerContact,).then(result => result.data);
    return data;
};

export const deleteCostumerContact = async (id) => { 
    let data = await api.delete(`CostumerContact/${id}`);
    return data;
};

export const editCostumerContact = async (employee) => { 
    let data = await api.put('CostumerContact',employee).then(result => result.data);
    
    return data;
};