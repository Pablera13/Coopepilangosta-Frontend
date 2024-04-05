import api from "../Api/apiAxios";

export const getProductCostumer = async(costumerid, state) => { 
  let data = await api.get(`ProductCostumer?costumerid=${costumerid}`).then(result => result.data);
  //console.log("Reviews desde el service" + JSON.stringify(data))
  state(data)
  return data;
}

export const getProductCostumerById = async(productId, costumerid, state) => { 
  let data = await api.get(`ProductCostumer/${productId},${costumerid}`).then(result => result.data);
  //console.log("Reviews desde el service" + JSON.stringify(data))
  state(data)
  return data;
}

export const getSingleProductCostumerById = async(id,state) => {
  let data = await api.get(`ProductCostumer/${id}`).then(result => result.data);
  state(data)
  return data;
}

export const createProductCostumer = async (productcostumer) => { 
  let data = await api.post('ProductCostumer', productcostumer).then(result => result.data);
  console.log(data)
  return data;
};

export const deleteProductCostumer = async (id) => { 
    let data = await api.delete(`productcostumer/${id}`);
    return data;
};

export const editProductCostumerById = async (productcostumer) => { 
  console.log(productcostumer)
  
  let productcostumerEdit = {
        productId: productcostumer.productId ,
        costumerId : productcostumer.costumerId,
        purchasePrice: productcostumer.purchasePrice ,
        description: productcostumer.description ,
        margin: productcostumer.margin ,
        unit: productcostumer.unit ,
      }

  let data = await api.put(`ProductCostumer/${productcostumer.id}`,productcostumerEdit).then(result => result.data);
  return data;
};