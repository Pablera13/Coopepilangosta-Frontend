import api from "../Api/apiAxios";

export const getWarehouse = async () => { 
    let data = await api.get('warehouse').then(result => result.data);
    return data;
};

export const getWarehouseEntries = async (idWarehouse) => { 
    let data = await api.get(`Warehouse/GetWarehouseEntries?idWarehouse=${idWarehouse}`).then(result => result.data);
    console.log(data)
    return data;
};

export const deleteWarehouse = async (id) => { 
    let data = await api.delete(`warehouse/${id}`);
    return data;
};

export const createWarehouse = async (warehouse) => { 
    let data = await api.post('warehouse',warehouse).then(result => result.data);
    return data;
};

export const getWarehouseById = async(id,state) => {
    
    let data = await api.get(`warehouse/${id}`).then(result => result.data);
    state(data)
    return data;
}

export const updateWarehouse = async (warehouse) => { 
    let warehouseEdit = {
        id: warehouse.id,
        code: warehouse.code,    
        description: warehouse.description,
        address: warehouse.address,
        state: warehouse.state
    }
    
    let data = await api.put(`warehouse/${warehouse.id}`,warehouse).then(result => result.data);
    
    return data;
};
