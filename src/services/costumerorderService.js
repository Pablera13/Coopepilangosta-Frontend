import api from "../Api/apiAxios";

export const getCostumerOrder = async () => { 
    let data = await api.get('costumerorder').then(result => result.data);
    //console.log(data)
    return data;
};

export const getCostumerOrderById = async (id,state) => { 
    let data = await api.get(`costumerorder/${id}`).then(result => result.data);
    state(data)
    // console.log(data)
    return data;
};

export const getCostumerOrderById2 = async (id) => { 
    let data = await api.get(`costumerorder/${id}`).then(result => result.data);
    // console.log(data)
    return data;
};

export const createCostumerOrder = async (costumerorder) => { 
    // console.log(costumerorder)
    let data = await api.post('costumerorder', costumerorder).then(result => result.data);
    // console.log(data)
    return data;
};

export const deleteCostumerOrder = async (id) => { 
    let data = await api.delete(`costumerorder/${id}`);
    return data;
};

export const editCostumerOrder = async (costumerorder) => { 
    
    const id = costumerorder.id;
    let costumerorderEdit = {

        total: costumerorder.Total ,
        detail: costumerorder.Detail ,
        stage: costumerorder.Stage ,
        costumerId : costumerorder.CostumerId,
        confirmedDate: costumerorder.ConfirmedDate ,
        paidDate: costumerorder.paidDate,
        deliveredDate: costumerorder.deliveredDate,
    }

    let data = await api.put(`costumerorder/${id}`,costumerorderEdit).then(result => result.data);
    
    return data;
};