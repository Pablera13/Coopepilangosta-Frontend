import api from "../Api/apiAxios";

export const getCategories = async () => { 
    let data = await api.get('category').then(result => result.data);
    //console.log(data)
    return data;
};

export const getCategoryById = async (id,state) => { 
    let data = await api.get(`category/${id}`).then(result => result.data);
    state(data)
    console.log(data)
    return data;
};

export const createCategory = async (category) => { 
    let data = await api.post('category',category).then(result => result.data);
    return data;
};

export const deleteCategory = async (id) => { 
    let data = await api.delete(`category/${id}`);
    return data;
};

export const updateCategory = async (category) => { 
    console.log(category)
    const id = category.id;
    let categoryEdit = {
        name: category.name,
    }

    let data = await api.put(`category/${id}`,categoryEdit).then(result => result.data);
    
    return data;
};