import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { getProductCostumer } from "../../../services/productCostumerService.js";
import { NavLink } from "react-router-dom";
import { deleteProductCostumer } from "../../../services/productCostumerService.js";
import { Table, Container, Col, Row, Button, Form } from "react-bootstrap";
import AddProductCostumer from "./actions/addProductCostumer.jsx";
import ReactPaginate from "react-paginate";
import syles from "../ProductCostumer/listProductCostumer.css";
import { useNavigate, useParams } from "react-router-dom";
import UpdateProductCostumer from "./actions/updateProductCostumer";
import VolumeDiscountModal from "./actions/volumeDiscountModal";
import ExportProductCostumer from "./actions/exportProductCostumer";
import { MdDelete } from "react-icons/md";
import { getProductById2 } from "../../../services/productService";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";

const listProductCostumer = () => {
  const Params = useParams();

  const [ProductCostumers, setProductCostumers] = useState([]);
  const [Cotizaciones, setCotizaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const recordsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    async function obtainProductCostumer() {
      await getProductCostumer(Params.costumerid, setProductCostumers);
    }
    obtainProductCostumer();
  }, [Params.costumerid]);

  useEffect(() => {
    if (ProductCostumers && ProductCostumers.length > 0) {
      ObtainCotizaciones();
    }
  }, [ProductCostumers]);

  const ObtainCotizaciones = async () => {
    if (ProductCostumers) {
      let cotizaciones = [];
      for (const productcostumer of ProductCostumers) {
        const product = await getProductById2(productcostumer.productId);

        const MargenGanancia =
          productcostumer.purchasePrice * (productcostumer.margin / 100);
        const PrecioConMargen = productcostumer.purchasePrice + MargenGanancia;
        const IVA = PrecioConMargen * (product.iva / 100);
        const PrecioFinal = PrecioConMargen + IVA;

        let cotizacion = {
          id: productcostumer.id,
          productId: product.id,
          productName: product.name,
          productUnit: productcostumer.unit,
          productIva: product.iva,
          finalPrice: PrecioFinal.toFixed(0),
          costumerId: Params.costumerid,
          purchasePrice: productcostumer.purchasePrice,
          description: productcostumer.description,
          margin: productcostumer.margin,
        };
        cotizaciones.push(cotizacion);
      }
      setCotizaciones(cotizaciones);
    }
  };

  const filteredCotizaciones = Cotizaciones.filter(
    (cotizacion) =>
      cotizacion.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cotizacion.productUnit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * recordsPerPage;
  const paginatedCotizaciones = filteredCotizaciones.slice(
    offset,
    offset + recordsPerPage
  );

  const pageCount = Math.ceil(Cotizaciones.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("paginatedCotizaciones = " + paginatedCotizaciones.length);
  };
  //const paginatedFilter = filteredBySearch.slice(offset, offset + recordsPerPage);

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar esta cotización?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteProductCostumer(id);
        swal({
          title: "Eliminado",
          text: "La cotización ha sido eliminada",
          icon: "success",
        }).then(function () {
          window.location.reload();
        });
      }
    });
  };

  return (
    <Container>
      <div className="table-container">
        <h2 className="table-title">
          Cotizaciones para {Params.costumername}{" "}
        </h2>
        <hr className="divider" />

        <br></br>

        <Form>
          <Row className="mb-3 filters-container">
          <Col xs={6} md={6}>
              <AddProductCostumer />
            </Col>
            <Col xs={0} md={0}></Col>
            <Col xs={12} md={3}>
              <Form.Control
                type="text"
                placeholder="Por nombre o unidad comercial..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </Col>
          </Row>
        </Form>

        <Col xs={12} md={2} lg={12}>
          {Cotizaciones && Cotizaciones.length > 0 ? (
            <Row>
              <Table
                className="Table"
                responsive
              >
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
                  {paginatedCotizaciones.map((cotizacion) => (
          
                    <tr>
                      <td>{cotizacion.productName}</td>
                      <td>{cotizacion.productUnit}</td>
                      <td>₡{cotizacion.purchasePrice}</td>
                      <td>{cotizacion.margin}%</td>
                      <td>{cotizacion.productIva}%</td>
                      <td>₡{cotizacion.finalPrice}</td>
                      <td>{cotizacion.description}</td>
                      <td>
                        <div className="BtnContainer">
                          <UpdateProductCostumer props={cotizacion} />

                          <Button
                            className="BtnRed"
                            onClick={() => showAlert(cotizacion.id)}
                          >
                            <MdDelete />
                          </Button>

                          <VolumeDiscountModal props={cotizacion.id} />
                          <ExportProductCostumer props={cotizacion} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="Pagination-Container">
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              </div>
            </Row>
          ) : (
            "Cargando"
          )}
        </Col>
      </div>
    </Container>
  );
};

export default listProductCostumer;
