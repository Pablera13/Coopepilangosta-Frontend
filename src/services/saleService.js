import api from "../Api/apiAxios";
import {getCostumerOrderById2} from './costumerorderService';
// import {getSale} from './saleService';
import { format } from 'date-fns';

export const getSale = async () => {
    try {
        const response = await api.get('sale');
        const data = response.data; 
  
        if (data) {
            //console.log("Datos del servicio:", data);
            return data;
        }
    } catch (error) {
        console.error("Error al obtener sales en el service ", error);
    }
  };

export const createSale= async (sale) => { 
    let data = await api.post('sale', sale).then(result => result.data);
    return data;
};

export const getProductSales = async (productid) => { 

    let Sales = await getSale();
    let salesData = []

    if ( productid != 0){
    Sales = Sales.filter((sale) => sale.productId == productid)
    }
    
    for(const sale of Sales){

        const CostumerOrder = await getCostumerOrderById2(sale.costumerOrderId)

        const Sale = {
            Quantity: sale.quantity,
            PurchaseTotal: sale.purchaseTotal,
            Date: format(new Date(CostumerOrder.confirmedDate), 'yyyy-MM-dd'),
          };
          salesData.push(Sale)
    }
    return salesData;
}