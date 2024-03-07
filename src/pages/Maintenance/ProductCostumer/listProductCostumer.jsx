import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { getProductCostumer } from '../../../services/productCostumerService.js';
import { NavLink } from 'react-router-dom';
import { deleteProductCostumer } from '../../../services/productCostumerService.js';
import { Table, Container, Col, Row, Button, Form} from 'react-bootstrap';
import AddProductCostumer from './actions/addProductCostumer.jsx';
import ReactPaginate from 'react-paginate';
import syles from '../ProductCostumer/listProductCostumer.css'
import {useNavigate, useParams} from 'react-router-dom';
import UpdateProductCostumer from './actions/updateProductCostumer'
import VolumeDiscountModal from './actions/volumeDiscountModal'
import ExportProductCostumer from './actions/exportProductCostumer'
import { MdDelete } from "react-icons/md";
import { getProductById2 } from '../../../services/productService';

const listProductCostumer = () => {
  const Params = useParams();

  const [ProductCostumers, setProductCostumers] = useState([]);
  const [Cotizaciones, setCotizaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate()
  const recordsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0); 

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

  const filteredCotizaciones = Cotizaciones.filter(cotizacion =>
    cotizacion.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cotizacion.productUnit.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <br></br>

      <Form>
        <Row className="mb-3">
          <Col md={3}>
            <AddProductCostumer />
          </Col>
          <Col md={3}>
            <Form.Label>Buscar</Form.Label>
            <Form.Control
              type="text"
              placeholder="Por nombre o unidad comercial..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
      </Form>


      <Col xs={8} md={2} lg={12}>
        {Cotizaciones && Cotizaciones.length > 0?(
          <Row>
            <Table className='Table' striped bordered hover variant="light" responsive>
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
              {filteredCotizaciones.map((cotizacion) => (
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

                  <Button className='BtnRed'
                  onClick={() => showAlert(cotizacion.id)}
                  > 
                  Eliminar <MdDelete />
                  </Button>

                  <VolumeDiscountModal props={cotizacion.id}/>
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
