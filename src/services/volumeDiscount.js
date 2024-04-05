import api from "../Api/apiAxios";

export const getVolumeDiscount = async(productcostumerid, state) => { 
  let data = await api.get(`VolumeDiscount?productcostumerid=${productcostumerid}`).then(result => result.data);
  //console.log("Reviews desde el service" + JSON.stringify(data))
  state(data)
  return data;
}

export const getVolumeDiscountById = async(productcostumerid, state) => { 
  let data = await api.get(`VolumeDiscount/${productcostumerid}`).then(result => result.data);
  state(data)
  return data;
}

export const createVolumeDiscount = async (volumediscount) => { 
  let data = await api.post('VolumeDiscount', volumediscount).then(result => result.data);
  console.log(data)
  return data;
};

export const deleteVolumeDiscount = async (id) => { 
    let data = await api.delete(`VolumeDiscount/${id}`);
    return data;
};

export const editVolumeDiscountById = async (volumediscount) => { 
//   console.log(volumediscount)

  let volumediscountEdit = {
        price: volumediscount.price ,
        volume : volumediscount.volume,
        productCostumerId : volumediscount.productCostumerId,
      }

  let data = await api.put(`ProductCostumer/${volumediscount.id}`,volumediscountEdit).then(result => result.data);
  return data;
};