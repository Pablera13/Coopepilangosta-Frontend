import api from "../Api/apiAxios";

export const getPurchase = async () => {
    try {
        const response = await api.get('purchase');
        const data = response.data; 
  
        if (data) {
            //console.log("Datos del servicio:", data);
            return data;
        }
    } catch (error) {
        console.error("Error al obtener purchases en el service ", error);
    }
  };

export const createPurchase = async (purchase) => { 
    let data = await api.post('purchase', purchase).then(result => result.data);
    return data;
};