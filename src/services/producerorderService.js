import api from "../Api/apiAxios";

export const getProducerOrder = async () => { 
    let data = await api.get('producerorder').then(result => result.data);
    return data;
};

export const getProducerOrderById = async (id,state) => { 
    let data = await api.get(`producerorder/${id}`).then(result => result.data);
    state(data)
    return data;
};

export const createProducerOrder = async (producerorder) => { 
    let data = await api.post('producerorder', producerorder).then(result => result.data);
    return data;
};

export const deleteProducerOrder = async (id) => { 
    let data = await api.delete(`producerorder/${id}`);
    return data;
};

export const editProducerOrder = async (producerorder) => { 
    
    const id = producerorder.id;
    let producerorderEdit = {

        total: producerorder.Total ,
        detail: producerorder.Detail ,
        producerId : producerorder.ProducerId,
        confirmedDate: producerorder.ConfirmedDate ,
        paidDate: producerorder.paidDate,
        deliveredDate: producerorder.deliveredDate,
    }

    let data = await api.put(`producerorder/${id}`,producerorderEdit).then(result => result.data);
    
    return data;
};