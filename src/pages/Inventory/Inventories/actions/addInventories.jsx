import { React, useState, useEffect, useRef } from 'react'
import { QueryClient, useMutation, useQuery } from "react-query";
import { useParams } from 'react-router-dom'
import { getProductById } from '../../../../services/productService';
import { createStockReport } from '../../../../services/reportServices/stockreportService';
import { editProduct } from '../../../../services/productService';
import { NavLink } from 'react-router-dom';
import { Button, Row, Col, Container } from 'react-bootstrap';


const addInventories = () => {
  const product = useParams();
  const queryClient = new QueryClient();

  const [productRequest, setProduct] = useState(null)
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    getProductById(product.product, setProduct)
  }, [])

  
  const mutation = useMutation("product", editProduct,
    {
      onSettled: () => queryClient.invalidateQueries("product"),
      mutationKey: "product",
      onSuccess: () => history.back()
    })

  const stock = useRef();
  const userEmail = JSON.parse(localStorage.getItem('user')).email;
  const [selectedMotive, setSelectedMotive] = useState('');
  const [initialStock, setInitialStock] = useState(0);
  const [cambioFecha, setCambioFecha] = useState('');

  useEffect(() => {
    getProductById(product.product, (data) => {
      setProduct(data);
      setInitialStock(data.stock); 
    });
  }, []);

  const saveEdit = () => {

    const editProductData = {
      id: productRequest.id,
      code: productRequest.code,
      name: productRequest.name,
      description: productRequest.description,
      stock: stock.current.value,
      unit: productRequest.unit,
      price: productRequest.price,
      margin: productRequest.margin,
      iva: productRequest.iva,
      state: productRequest.state,
      categoryId: productRequest.categoryId,
      image: productRequest.image,
    };
    
    const stockReportData = {
      ProductId: productRequest.id,
      ProductName: productRequest.name,
      CambioFecha: new Date(cambioFecha),
      OldStock: initialStock, 
      NewStock: stock.current.value, 
      motive: selectedMotive,
      Email: userEmail,
    };

    editProduct(editProductData)
      .then(() => {
        createStockReport(stockReportData)
          .then(() => {
            limpiarInput();
          })
          .catch((error) => {
            console.error('Error al guardar datos en StockReport', error);
          });
      })
      .catch((error) => {
        console.error('Error al editar el producto', error);
      });
  };

  const limpiarInput = () => {
    stock.current.value = "";
  }

  return (
    <>
      {productRequest != null ?
        (
          <>
            <Container>
            <Row className="justify-content-md-center">
              <Col lg={3}>
                <div>
                <span>Stock: </span>
                <input type="text" defaultValue={productRequest.stock} ref={stock} />
                </div><br />
                  <div>
                <span>Motivo: </span>
                <select value={selectedMotive} onChange={(e) => setSelectedMotive(e.target.value)}>
                <option value="">Seleccionar motivo</option>
                <option value="regalía">Regalía</option>
                <option value="venta">Venta</option>
                <option value="devolución">Devolución</option>
                <option value="producto dañado">Producto Dañado</option>
                <option value="aumento">Aumento de Existencias</option>
                <option value="prueba de mercado">Prueba de mercado</option>
                </select>
                  </div><br />
                  <div>
                  <span>Fecha de Cambio: </span>
                  <input
                  type="datetime-local"
                  value={cambioFecha}
                  onChange={(e) => setCambioFecha(e.target.value)}
                  />
                  </div><br />
              </Col>
            </Row>
              <Row className="justify-content-md-center">
                <Col lg={2}>
                  <Button onClick={saveEdit} size='sm'>Aceptar</Button>
                  <NavLink to={'/ListInventories'}>Regresar</NavLink>
                </Col>
              </Row>
            </Container>
          </>
        )
        : ("Cargando..")}
    </>

  )
}

export default addInventories
