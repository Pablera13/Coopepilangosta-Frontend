import api from "../Api/apiAxios";

export const getEntries = async () => { 
    let data = await api.get('Entry').then(result => result.data);
    //console.log(data)
    return data;
};

export const createEntry = async (entry) => { 
    let data = await api.post('Entry',entry).then(result => result.data);
    return data;
};

export const checkEntryStatus = async (idProducerOrder,idProduct) => { 
    console.log(idProducerOrder + " "+ idProduct)
    let data = await api.get(`Entry/CheckEntryStatus?idProducerOrder=${idProducerOrder}&idProduct=${idProduct}`).then(result => result.data);
    //console.log(data)
    return data;
};
