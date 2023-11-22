import React from 'react'
import { useRef, useState, useEffect  } from "react";
import { QueryClient, useMutation,useQuery} from "react-query";
import { NavLink } from 'react-router-dom'
import { format } from 'date-fns';
import { Table, Button, Form } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';

import swal from 'sweetalert';
import Select from 'react-select';
import { createProducerOrder } from '../../../../services/producerorderService';
import { createPurchase } from '../../../../services/purchaseService';
import { getProducers } from '../../../../services/producerService';
import { getProducts } from '../../../../services/productService';
import { getProductProducer } from '../../../../services/productProducerService';
import {useNavigate} from 'react-router-dom';
import { createProductProducer } from '../../../../services/productProducerService';
import { editProductProducer } from '../../../../services/productProducerService';

import { getProductById } from '../../../../services/productService';


const addProducerOrder = () => {

    const ProducerId = useRef()
    const ProductId = useRef()
    const Quantity = useRef()
    const PurchasePrice = useRef()
    const IVA = useRef()
    const PurchaseTotal = useRef()
    const Detail = useRef()

    const navigate = useNavigate()

    const buttonStyle = {
      borderRadius: '5px',
      backgroundColor: '#e0e0e0',
      color: '#333',
      border: '1px solid #e0e0e0',
      padding: '8px 12px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      minWidth: '100px',
      fontWeight: 'bold',
      hover: {
        backgroundColor: '#c0c0c0', 
      },
    };

    const [productRequest, setProduct] = useState(null)

    const [purchases, setPurchases] = useState([]);

    const [isProducerSelectDisabled, setIsProducerSelectDisabled] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [selectedProducer, setSelectedProducer] = useState(null); 
    const [selectedQuantity, setSelectedQuantity] = useState(null); 

    const queryClient = new QueryClient();
    const { data: producers, isLoading: producersLoading, isError: producersError} = useQuery('producer', getProducers);
    const { data: products, isLoading: productsLoading , isError: productsError} = useQuery('product', getProducts);

    function handleQuantityChange(event) {
        const currentQuantityValue = event.target.value;
        setSelectedQuantity(currentQuantityValue);
      }
      
        const ObtainPurchasePrice = async (productId, producerId) => {
            try {
                let purchaseprice = await getProductProducer(productId, producerId);
                    console.log("precio de compra = " + purchaseprice);
                    PurchasePrice.current.value = purchaseprice; 
            } catch (error) {
                console.error("Error al obtener purchase price en el componente ", error);
            }
        };

        const ObtainIVA = async (productId) => {
          try {
              let productiva = await await getProductById(productId , setProduct)
                  console.log("productiva = " + productiva.iva);
                  IVA.current.value = productiva.iva; 
          } catch (error) {
              console.error("Error al obtener productiva en el componente ", error);
          }
      };

        const mutationPurchase = useMutation("purchase ", createPurchase,
        {
            onSettled:()=>queryClient.invalidateQueries("purchases"),
            mutationKey: "purchase"   
        })
    
        const mutationProductProducer = useMutation("productproducer ", createProductProducer,
        {
            onSettled:()=>queryClient.invalidateQueries("productproducers"),
            mutationKey: "productproducer"   
        })

        const mutationProductProducerEdit = useMutation("producerorder", editProductProducer,
        {
        onSettled:()=>queryClient.invalidateQueries("producerorder"),
        mutationKey: "producerorder",
        })
        
        useEffect(() => {
            if (selectedProduct && selectedProducer) {
                ObtainIVA(selectedProduct.value);
              console.log(selectedProduct.value);
            }
          }, [selectedProduct, selectedProducer]);

          useEffect(() => {
            if (selectedProduct && selectedProducer) {
                ObtainPurchasePrice(selectedProduct.value, selectedProducer.value);
              console.log(selectedProduct.value +" , " + selectedProducer.value);
            }
          }, [selectedProduct, selectedProducer]);

          useEffect(() => {
            if (selectedProducer) {
                setIsProducerSelectDisabled(true)
            }
          }, [selectedProducer]);

          useEffect(() => {
            if (selectedQuantity) {
              let realiva = IVA.current.value/100
              console.log('realiva' + realiva)
              let totaliva = PurchasePrice.current.value * realiva
              console.log('totaliva' + totaliva)
              let total = parseInt(PurchasePrice.current.value) + totaliva
              console.log('total' + total)

              PurchaseTotal.current.value = (total * selectedQuantity).toFixed(2);
            }
          }, [selectedQuantity]);

    const isLoading = producersLoading || productsLoading ;
    const isError = producersError || productsError ;


    const savePurchase = async ()=>{

        const productId = selectedProduct.value;
        const Product = await getProductById(productId , setProduct)
        const PurchaseTotalText = PurchaseTotal.current.value;
        const PurchaseTotalDouble = parseFloat(PurchaseTotalText);
        //const iva = PTAsDouble * (Product.iva / 100).toFixed(2);

        let Purchase = {  
            ProductName: Product.name,
            ProductImage: Product.image,
            ProductUnit: Product.unit,
            ProductId: productId,
            Quantity: Quantity.current.value,
            PurchaseInitial: PurchasePrice.current.value * Quantity.current.value,
            Iva: IVA.current.value,
            PurchaseTotal: PurchaseTotalDouble,
            //PurchaseFinal: PTAsDouble + iva 
        };
        
        setPurchases((prevPurchases) => [...prevPurchases, Purchase]);

        const IsPurchasePrice = await getProductProducer(productId, selectedProducer.value)

        if (IsPurchasePrice != null) {

            let EditPurchasePrice = {   
                productId: productId,
                producerId: selectedProducer.value,
                purchasePrice: PurchasePrice.current.value,
            };

            mutationProductProducerEdit.mutateAsync(EditPurchasePrice);

        } else {

            let NewPurchasePrice = {   
                productId: productId,
                producerId: selectedProducer.value,
                purchasePrice: PurchasePrice.current.value,
            };
            mutationProductProducer.mutateAsync(NewPurchasePrice);
        }   

        Quantity.current.value = ""
        PurchasePrice.current.value = ""
        IVA.current.value = ""
        PurchaseTotal.current.value = ""

    };

    const mutationProducerOrder  = useMutation("producerorder ", createProducerOrder,
    {
        onSettled:()=>queryClient.invalidateQueries("producerorder"),
        mutationKey: "producerorder"
        ,
        onSuccess:() => swal({
            title:'Agregado!',
            text:`El pedido ha sido agregado`,
            icon:"success"           
          }),
          
                  
    })

    const saveProducerOrder = async ()=>{

        let PricesSummatory = 0
        purchases.map((purchase)=>{
        PricesSummatory = PricesSummatory + purchase.PurchaseTotal
        })

        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');

        let newProducerOrder = {      
            ProducerId: selectedProducer.value,
            Total: PricesSummatory,
            ConfirmedDate: formattedDate,
            PaidDate: "0001-01-01T00:00:00",
            DeliveredDate: "0001-01-01T00:00:00",
            Detail: Detail.current.value,
        };

        const producerOrder = await mutationProducerOrder.mutateAsync(newProducerOrder).finally(data => data)

        producerOrder !=null?(console.log(producerOrder)):(console.log("Empty"))

        purchases.map((purchase)=> {
            
            let NewPurchase = {      
                ProductId: purchase.ProductId,
                Quantity: purchase.Quantity,
                PurchaseTotal: purchase.PurchaseTotal,
                //PurchaseFinal: purchase.PurchaseFinal,
                ProducerOrderId : producerOrder.id,
            };

            mutationPurchase.mutateAsync(NewPurchase);
            })

        setSelectedProducer(null);
        setPurchases([]);

    }

      const RemoveOrder = (productId)=>{

        const updatedPurchases = purchases.filter((purchase) => purchase.ProductId !== productId);
        setPurchases(updatedPurchases);
      }

      if(isLoading)
      return <div>Loading...</div>
      
      if(isError)
      return <div>Error</div>
  
      const optionsProducer = producers.map((producer) => ({
          value: producer.id  ,
          label: producer.name + " " + producer.lastname1 + " " + producer.lastname2,
        }));
    
        const optionsProduct = products.map((product) => ({
          value: product.id,
          label: product.name + " (" + product.unit + ")",
        }));
  
        return (
            <div className='formContainer' style={{ textAlign: 'center', paddingTop: '50px' }}>
              <h1 style={{ fontSize: '24px', marginBottom: '40px' }}>Agregar nuevo pedido</h1>
              <div className="container">
                <div className="row justify-content-center">
                  {/* Primera Columna */}
                  <div className="col-sm-3">
                    <div className='inputsProduct'>
                      <Form>
                        <Form.Group style={{ marginBottom: '40px', textAlign: 'center' }}>
                          <Form.Label style={{ fontSize: '16px', marginBottom: '20px' }}>Seleccione el productor</Form.Label>
                          <Select
                            options={optionsProducer}
                            placeholder='Productor'
                            ref={ProducerId}
                            onChange={(selectedOption) => setSelectedProducer(selectedOption)}
                            isDisabled={isProducerSelectDisabled}
                            className="small-input"
                          />
                        </Form.Group>
                        <Form.Group style={{ marginBottom: '40px', textAlign: 'center' }}>
                          <Form.Label style={{ fontSize: '16px', marginBottom: '20px' }}>Seleccione el producto</Form.Label>
                          <Select
                            options={optionsProduct}
                            placeholder='Producto'
                            ref={ProductId}
                            onChange={(selectedOption) => setSelectedProduct(selectedOption)}
                            className="small-input"
                          />
                        </Form.Group>
                      </Form>
                    </div>
                  </div>
                  {/* Segunda Columna */}
                  <div className="col-sm-3">
                    <div className='inputsProduct'>
                      <Form>
                        <Form.Group style={{ marginBottom: '40px', textAlign: 'center' }}>
                          <Form.Label style={{ fontSize: '16px', marginBottom: '20px' }}>Precio de compra inicial</Form.Label>
                          <Form.Control
                            type='number'
                            placeholder='Precio por unidad'
                            ref={PurchasePrice}
                            min='1'
                            style={{ fontSize: '14px', height: '30px' }}
                            className="small-input"
                          />
                        </Form.Group>

                        <Form.Group style={{ marginBottom: '40px', textAlign: 'center' }}>
                          <Form.Label style={{ fontSize: '16px', marginBottom: '20px' }}>IVA del producto</Form.Label>
                          <Form.Control
                            style={{ fontSize: '14px', height: '30px' }}
                            placeholder='IVA'
                            ref={IVA}
                            type='number'
                            min='1'
                            onChange={handleQuantityChange}
                            className="small-input"
                          />
                        </Form.Group>
                        
                      </Form>
                    </div>
                  </div>
                  {/* Tercera Columna */}
                  <div className="col-sm-3">
                    <div className='inputsProduct'>
                      <Form>
                      <Form.Group style={{ marginBottom: '40px', textAlign: 'center' }}>
                          <Form.Label style={{ fontSize: '16px', marginBottom: '20px' }}>Ingrese la cantidad</Form.Label>
                          <Form.Control
                            style={{ fontSize: '14px', height: '30px' }}
                            placeholder='Cantidad'
                            ref={Quantity}
                            type='number'
                            min='1'
                            onChange={handleQuantityChange}
                            className="small-input"
                          />
                        </Form.Group>

                        <Form.Group style={{ marginBottom: '40px', textAlign: 'center' }}>
                          <Form.Label style={{ fontSize: '16px', marginBottom: '20px' }}>Precio total orden</Form.Label>
                          <Form.Control
                            style={{ fontSize: '14px', height: '30px' }}
                            placeholder='Precio total orden'
                            ref={PurchaseTotal}
                            type='number'
                            min='1'
                            className="small-input"
                          />
                        </Form.Group>

                        {/* <Button onClick={savePurchase} style={{ fontSize: '14px', marginBottom: '20px' }}>
                          Agregar orden
                        </Button> */}

                 <Button
                  onClick={savePurchase}
                  size='sm'
                  style={{...buttonStyle}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Agregar orden
                  </Button>



                      </Form>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '20px', marginTop: '20px' }}>Resumen del pedido</h4>
              </div>
              <div className='producersTable' style={{ width: '60%', margin: '0 auto', fontSize: '12px' }}>

              <br></br>

              {purchases.length >0 ? (

                <Table striped bordered hover size='sm'>
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Producto</th>
                      <th>Unidad Comercial</th>
                      <th>Cantidad</th>
                      <th>Precio inicial</th>
                      <th>IVA</th>
                      <th>Precio Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase, index) => (
                      <tr key={index}>
                        <td><img className='imgProduct'
                            src={purchase.ProductImage}
                        /></td>
                        <td>{purchase.ProductName}</td>
                        <td>{purchase.ProductUnit}</td>
                        <td>{purchase.Quantity}</td>
                        <td>₡{purchase.PurchaseInitial}</td>
                        <td>{purchase.Iva}%</td>
                        <td>₡{purchase.PurchaseTotal}</td>
                        <td>
                          <Button variant='danger' onClick={() => RemoveOrder(purchase.ProductId)}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                  ) : (
                    "No hay productos agregados"
                   )}
              </div>

              <br></br>

              <Form.Group style={{ marginBottom: '40px' }}>
                <h4 style={{ fontSize: '20px', marginTop: '20px' }}>Detalle del pedido</h4>
                <br></br>

                        <Form.Control
                          style={{ fontSize: '14px', height: '100px', width: '50%', margin: '0 auto' }}
                          placeholder='Detalle'
                          ref={Detail}
                          type='text area'
                          className="small-input"
                          />
                          </Form.Group>
              <div>

                <Button
                  onClick={saveProducerOrder}
                  size='sm'
                  style={{...buttonStyle}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Guardar Pedido
                  </Button>

                <Button
                  onClick={() => navigate('/listProducerOrder/all')}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Cancelar
                  </Button>

              </div>
              <br></br>
            </div>
            
          );
          
          
          
          
          
        };
export default addProducerOrder