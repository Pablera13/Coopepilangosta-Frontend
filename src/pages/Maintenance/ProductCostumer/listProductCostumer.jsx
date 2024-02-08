import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { getProductCostumer } from '../../../services/productCostumerService.js';
import { NavLink } from 'react-router-dom';
import { deleteProductCostumer } from '../../../services/productCostumerService.js';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import AddProductCostumer from './actions/addProductCostumer.jsx';
import ReactPaginate from 'react-paginate';
import syles from '../ProductCostumer/listProductCostumer.css'
import {useNavigate, useParams} from 'react-router-dom';
import UpdateProductCostumer from './actions/updateProductCostumer'
import ExportProductCostumer from './actions/exportProductCostumer'

import { getProductById2 } from '../../../services/productService';

const listProductCostumer = () => {
  const Params = useParams();

  const [ProductCostumers, setProductCostumers] = useState([]);
  const [Cotizaciones, setCotizaciones] = useState([]);

  useEffect(() => {
    async function obtainProductCostumer() {
      await getProductCostumer(Params.costumerid, setProductCostumers)
    }
    obtainProductCostumer();
  }, [Params.costumerid]);

  useEffect(() => {
    if (ProductCostumers && ProductCostumers.length > 0) {
      ObtainCotizaciones();
    }
  }, [ProductCostumers]);


  const ObtainCotizaciones = async () => {
      if (ProductCostumers){
        let cotizaciones = [];
        for (const productcostumer of ProductCostumers) {
    
          const product = await getProductById2(productcostumer.productId);

        const MargenGanancia = productcostumer.purchasePrice * (productcostumer.margin / 100)
        const PrecioConMargen = productcostumer.purchasePrice + MargenGanancia
        const IVA = PrecioConMargen * (product.iva / 100)
        const PrecioFinal = PrecioConMargen + IVA
    
          let cotizacion = {
           id: productcostumer.id,
           productId : product.id,
           productName : product.name,
           productUnit : productcostumer.unit,
           productIva : product.iva,
           finalPrice : PrecioFinal.toFixed(0),
           costumerId : Params.costumerid,
           purchasePrice : productcostumer.purchasePrice,
           description : productcostumer.description,
           margin : productcostumer.margin,
          }
          cotizaciones.push(cotizacion)
        } setCotizaciones(cotizaciones)}
};

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

  // const showAlert = (id) => {
  //   swal({
  //     title: "Eliminar",
  //     text: "¿Está seguro de que desea eliminar esta cotización?",
  //     icon: "warning",
  //     buttons: ["Cancelar", "Aceptar"],
  //   }).then((answer) => {
  //     if (answer) {
  //       swal({
  //         title: 'Eliminado!',
  //         text: 'La cotización ha sido eliminado',
  //         icon: 'success',
  //       });
  //       setTimeout(function () {
  //         deleteProductCostumer(id).finally(window.location.reload());
          
  //       }, 2000);
  //     }
  //   });
  // };

  const showAlert = (id) => {
    swal({
      title: 'Eliminar',
      text: '¿Está seguro de que desea eliminar esta cotización?',
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
    }).then((answer) => {
      if (answer) {
        deleteProductCostumer(id);
        swal({
          title: 'Eliminado',
          text: 'La cotización ha sido eliminada',
          icon: 'success',
        });
        setTimeout(function () {
          console.log("cotización eliminada" + id)
          window.location.reload();
        }, 2000);
      }
    });
  };
  
  return (
    <Container>
      <h2 className="text-center">Cotizaciones para {Params.costumername} </h2>
      <div className="buttons">
        <AddProductCostumer />
      </div>
      <Col xs={8} md={2} lg={12}>
        {Cotizaciones && Cotizaciones.length > 0?(
          <Row>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Unidad</th>
                  <th>Precio inicial</th>
                  <th>Margen</th>
                  <th>IVA</th>
                  <th>Precio Final</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
              {Cotizaciones.map((cotizacion) => (
                // <tr key={productcostumer.id}>
                <tr>
                  <td>{cotizacion.productName}</td>
                  <td>{cotizacion.productUnit}</td>
                  <td>₡{cotizacion.purchasePrice}</td>
                  <td>{cotizacion.margin}%</td>
                  <td>{cotizacion.productIva}%</td>
                  <td>₡{cotizacion.finalPrice}</td>
                  <td>{cotizacion.description}</td>
                  <td>

                  <UpdateProductCostumer props={cotizacion}/>

                  <Button
                  onClick={() => showAlert(cotizacion.id)}
                  size='sm'
                  >
                  Eliminar
                  </Button>

                  <ExportProductCostumer props={cotizacion}/>


                  </td>
                </tr>
              ))}
              </tbody>
            </Table>

            {/* <ReactPaginate
              previousLabel="Anterior"
              nextLabel="Siguiente"
              breakLabel="..."
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              subContainerClassName="pages pagination"
              activeClassName="active"
            /> */}

          </Row>
        ) : (
          "Cargando"
        )}
      </Col>
    </Container>
  );
};

export default listProductCostumer;
