import api from "../../Api/apiAxios";

export const getstocks = async () => { 
    let data = await api.get('stockreport').then(result => result.data);
    //console.log(data)
    return data;
};

export const createStockReport = async (stockreport) => { 
    let data = await api.post('stockreport',stockreport).then(result => result.data);
    return data;
};

export const getStockReporttById = async(id,state) => {
    
    let data = await api.get(`stockreport/${id}`).then(result => result.data);
    state(data)
    return data;
}

