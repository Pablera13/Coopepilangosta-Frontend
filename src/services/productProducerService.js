import api from "../Api/apiAxios";

export const getProductProducer = async (ProductId, ProducerId) => {
  try {
      const response = await api.get(`ProductProducer?ProductId=${ProductId}&ProducerId=${ProducerId}`);
      const data = response.data; 

      if (data) {
        //   console.log("Datos del servicio:", data);
          return data.purchasePrice;
      }
  } catch (error) {
      console.error("Error al obtener purchase price en el service ", error);
  }
};

export const createProductProducer = async (productproducer) => { 
  let data = await api.post('productproducer', productproducer).then(result => result.data);
  console.log(data)
  return data;
};

export const getProductProducerById = async (id) => { 
  let data = await api.get(`productproducer/${id}`).then(result => result.data);
  console.log(data)
  return data;
};

export const editProductProducer = async (productproducer) => { 
    
  let producerorderEdit = {

    productId: productproducer.productId ,
    producerId : productproducer.producerId,
    purchasePrice: productproducer.purchasePrice ,
  }

  let data = await api.put(`ProductProducer?ProductId=${productproducer.productId}&ProducerId=${productproducer.producerId}`, producerorderEdit).then(result => result.data);
  
  return data;
};