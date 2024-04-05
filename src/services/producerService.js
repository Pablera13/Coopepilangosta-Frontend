import api from "../Api/apiAxios";

export const getProducers = async () => { 
    let data = await api.get('producer').then(result => result.data);
    return data;
};

export const getProducerById = async(id,state) => {
    
    let data = await api.get(`producer/${id}`).then(result => result.data);
    state(data)
    return data;
}

export const CheckCedulaProducerAvailability = async(id) => {
    
    let data = await api.get(`producer/CheckCedulaAvailability?cedula=${id}`).then(result => result.data);
    
    return data;
}

export const createProducer = async (producer) => { 
    let data = await api.post('producer',producer).then(result => result.data);
    return data;
};

export const deleteProducerService = async (id) => { 
    let data = await api.delete(`producer/${id}`);
    return data;
};

export const updateProducer = async (producer) => { 
    console.log(producer)
    
    let producerEdit = {
        cedula: producer.cedula,
        name: producer.name,
        lastname1: producer.lastname1,
        lastname2: producer.lastname2,
        phoneNumber: producer.phoneNumber,
        email: producer.email,
        province: producer.province,
        canton: producer.canton,
        district: producer.district,
        address: producer.address,
        bankAccount: producer.bankAccount,
    }

    let data = await api.put(`producer/${producer.id}`,producerEdit).then(result => result.data);
    
    return data;
};