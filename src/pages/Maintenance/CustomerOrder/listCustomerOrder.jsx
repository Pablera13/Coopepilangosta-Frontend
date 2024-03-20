import { React, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { NavLink, Navigate, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Table, Container, Col, Row, Button, Form } from "react-bootstrap";
import { deleteCostumerOrder } from "../../../services/costumerorderService";
import { getCostumerOrder } from "../../../services/costumerorderService";
import Select from "react-select";
import PrintCustomerOrder from "./actions/printCustomerOrder.jsx";

import { MdDelete } from "react-icons/md";

import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import ReactPaginate from "react-paginate";

import UpdateCustomerOrderModal from "./actions/updateCustomerOrderModal.jsx";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess.js";

const listCustomerOrder = () => {

  useEffect(() => {
    validateAllowedPageAccess()
  
  }, [])
  const params = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("all"); // Default filter option
  const navigate = useNavigate();
  const {
    data: customerorderData,
    isLoading,
    isError,
  } = useQuery("customerorder", getCostumerOrder);
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const optionsSelect = [
    { value: "all", label: "Todos los pedidos" },
    { value: "paid", label: "Pedidos pagados" },
    { value: "notpaid", label: "Pedidos sin pagar" },
    { value: "delivered", label: "Pedidos recibidos" },
    { value: "notdelivered", label: "Pedidos sin recibir" },
  ];

  useEffect(() => {
    if (selectedOption !== null) {
      navigate(`/listCustomerOrder/${selectedOption}`);
    }
  }, [selectedOption, navigate]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  if (isLoading)
    return (
      <div className="Loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );
  if (isError) return <div>Error</div>;

  let filteredCustomerOrders = customerorderData || [];

  if (selectedDate) {
    filteredCustomerOrders = filteredCustomerOrders.filter((pedido) => {
      const pedidoDate = new Date(pedido.confirmedDate);
      const selected = new Date(selectedDate);
      return pedidoDate.toDateString() === selected.toDateString();
    });
  }

  if (params.filter) {
    if (params.filter === "paid") {
      filteredCustomerOrders = filteredCustomerOrders.filter(
        (prodorder) => prodorder.paidDate !== "0001-01-01T00:00:00"
      );
    } else if (params.filter === "notpaid") {
      filteredCustomerOrders = filteredCustomerOrders.filter(
        (prodorder) => prodorder.paidDate === "0001-01-01T00:00:00"
      );
    } else if (params.filter === "delivered") {
      filteredCustomerOrders = filteredCustomerOrders.filter(
        (prodorder) => prodorder.deliveredDate !== "0001-01-01T00:00:00"
      );
    } else if (params.filter === "notdelivered") {
      filteredCustomerOrders = filteredCustomerOrders.filter(
        (prodorder) => prodorder.deliveredDate === "0001-01-01T00:00:00"
      );
    }
  }

  const paginatedProducers = filteredCustomerOrders.slice(
    currentPage * recordsPerPage,
    (currentPage + 1) * recordsPerPage
  );
  const pageCount = Math.ceil(filteredCustomerOrders.length / recordsPerPage);

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar este pedido?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteCostumerOrder(id).then(
          swal({
            title: "Eliminado",
            text: "El pedido ha sido eliminado",
            icon: "success",
          }).then(function () {
            window.location.reload();
          })
        );
      }
    });
  };

  return (
    <Container>
      <div className="table-container">
        <h2 className="table-title">Pedidos Recibidos</h2>
        <hr className="divider" />
        <br></br>
        <Form>
          <Row className="mb-3 filters-container">
            <Col xs={12} md={6}></Col>
            <Col xs={12} md={3}>
              <Form.Control
                type="datetime-local"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Col>
            <Col xs={12} md={3}>
              <Select
                placeholder="Todos los pedidos"
                value={optionsSelect.find(
                  (option) => option.value === selectedOption
                )}
                onChange={(option) => setSelectedOption(option.value)}
                options={optionsSelect}
              />
            </Col>
          </Row>
        </Form>
        <Col xs={12} md={12} lg={12}>
          <Row>
            <Col xs={12} sm={12} md={12}>
              <Table className="Table" responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Recibido</th>
                    <th>Total</th>
                    <th>Estado Pago</th>
                    <th>Estado Entrega</th>
                    <th>Seguimiento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducers.map((CustomerOrder) => (
                    <tr key={CustomerOrder.id}>
                      <td>{CustomerOrder.id}</td>
                      <td>
                        {format(
                          new Date(CustomerOrder.confirmedDate),
                          "yyyy-MM-dd"
                        )}
                      </td>
                      <td>{CustomerOrder.total === 0? "Por cortizar" : "₡" + CustomerOrder.total.toFixed(2)} </td>
                      <td>
                        {CustomerOrder.paidDate === "0001-01-01T00:00:00"
                          ? "Sin pagar"
                          : format(
                              new Date(CustomerOrder.paidDate),
                              "yyyy-MM-dd"
                            )}
                      </td>
                      <td>
                        {CustomerOrder.deliveredDate === "0001-01-01T00:00:00"
                          ? "No entregado"
                          : format(
                              new Date(CustomerOrder.deliveredDate),
                              "yyyy-MM-dd"
                            )}
                      </td>

                      <td>{CustomerOrder.stage}</td>
                      <td>
                        <div className="BtnContainer">
                          <UpdateCustomerOrderModal props={CustomerOrder} />
                          <Button
                            onClick={() => showAlert(CustomerOrder.id)}
                            size="sm"
                            className="BtnRed"
                          >
                            <MdDelete />
                          </Button>
                          <PrintCustomerOrder props={CustomerOrder.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col>
              <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                breakLabel="..."
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName="pagination"
                subContainerClassName="pages pagination"
                activeClassName="active"
              />
            </Col>
          </Row>
        </Col>
      </div>
    </Container>
  );
};

export default listCustomerOrder;
