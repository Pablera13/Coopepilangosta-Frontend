import api from "../Api/apiAxios";

export const getEmployees = async () => { 
    let data = await api.get('employee').then(result => result.data);
    //console.log(data)
    return data;
};

export const getEmployeeById = async (id,state) => { 
    let data = await api.get(`employee/${id}`).then(result => result.data);
    state(data)
    
    return data;
};

export const CheckEmployeeCedulaAvailability = async (id) => { 
    let data = await api.get(`employee/CheckEmployeeCedulaAvailability?cedula=${id}`).then(result => result.data);
    
    return data;
};


export const createEmployee = async (employee) => { 
    let data = await api.post('employee',employee).then(result => result.data);
    return data;
};

export const editEmployee = async (employee) => { 
    let data = await api.put('employee',employee).then(result => result.data);
    
    return data;
};

export const deleteEmployee = async (id) => { 
    let data = await api.delete(`employee/${id}`);
    return data;
};