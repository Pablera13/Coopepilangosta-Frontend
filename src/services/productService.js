import api from "../Api/apiAxios";

export const getProducts = async () => { 
    let data = await api.get('product').then(result => result.data);
    return data;
};

export const createProduct = async (product) => { 
    let data = await api.post('product',product).then(result => result.data);
    return data;
};

export const getProductById = async(id,state) => {
    
    let data = await api.get(`product/${id}`).then(result => result.data);
    state(data)
    return data;
}

export const getCoffee = async() => {
    
    let data = await api.get(`product/coffee`).then(result => result.data);
    return data;
}

export const checkCodeAvailability = async(id) => {
    
    let data = await api.get(`product/CheckCodeAvailability?code=${id}`).then(result => result.data);
    return data;
}

export const checkProductStock = async(productid, quantity) => {
    
    let data = await api.get(`product/CheckStockAvailability?productid=${productid}`).then(result => result.data);
    return data;
}


export const updateStock = async(productid, newStock) => {
    
    let data = await api.patch(`product/${productid}/UpdateStock?NewStock=${newStock}`).then(result => result.data);
    return data;
}

export const reduceStock = async(productid, newStock) => {

    let data = await api.patch(`product/${productid}/ReduceStock?NewStock=${newStock}`).then(result => result.data);
    return data;
}

export const getProductById2 = async(id) => {
    
    let data = await api.get(`product/${id}`).then(result => result.data);
    return data;
}

export const editProduct = async (product) => { 
    console.log(product)
    const id = product.id
    let productEdit = {
        code: product.code,
        name: product.name,
        description: product.description,
        stock: product.stock,
        unit: product.unit,
        margin: product.margin,
        iva: product.iva,
        state: product.state,
        stockable: product.stockable,
        categoryId: product.categoryId,
        image: product.image
    }

    let data = await api.put(`product/${id}`,productEdit).then(result => result.data);
    
    return data;
};

export const deleteProduct = async (id) => { 
    let data = await api.delete(`product/${id}`);
    return data;
};
