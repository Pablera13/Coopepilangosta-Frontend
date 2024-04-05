import api from "../Api/apiAxios";
import {getCostumerOrderById2} from './costumerorderService';
import { format } from 'date-fns';

export const createSale= async (sale) => { 
    let data = await api.post('sale', sale).then(result => result.data);
    return data;
};

// export const getSale = async () => {
//     try {
//         const response = await api.get('sale');
//         const data = response.data; 
  
//         if (data) {
//             //console.log("Datos del servicio:", data);
//             return data;
//         }
//     } catch (error) {
//         console.error("Error al obtener sales en el service ", error);
//     }
//   };

  export const getProducerOrderSales = async(producerorderid,state) => { 
    let data = await api.get(`sale/FilteredByOrder?producerorderid=${producerorderid}`).then(result => result.data);
    state(data)
    return data;
}

export const getProductSales = async(productid) => { 
    let data = await api.get(`sale/FilteredByProduct?productid=${productid}`).then(result => result.data);
    let salesData =[]
    for(const sale of data){
                const Sale = {
                    Quantity: sale.quantity,
                    PurchaseTotal: sale.purchaseTotal,
                    Date: format(new Date(sale.date), 'yyyy-MM-dd'),
                  };
                  salesData.push(Sale)
            }
    return salesData;
}