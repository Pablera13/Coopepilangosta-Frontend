import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Table, Container, Col, Row, Button, Form } from "react-bootstrap";
import { deleteProducerOrder } from "../../../services/producerorderService";
import { getProducerOrder } from "../../../services/producerorderService";
import Select from "react-select";
import PrintProducerOrder from "./actions/printProducerOrder.jsx";
import AddProducerOrderModal from "./actions/addProducerOrderModal.jsx";
import { MdDelete } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { TiEdit } from "react-icons/ti";
import CheckEntryModal from '../../Inventory/Entries/actions/checkEntryModal.jsx'
import UpdateProducerOrderModal from "./actions/updateProducerOrderModal.jsx";

import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";


const listProducerOrder = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: producerorderData,
    isLoading,
    isError,
  } = useQuery("producerorder", getProducerOrder);

  useEffect(() => {
    if (selectedOption != null) {
      navigate(`/listProducerOrder/${selectedOption}`);
    }
  }, [selectedOption, navigate]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  const optionsSelect = [
    { value: "all", label: "Todos los pedidos" },
    { value: "paid", label: "Pedidos pagados" },
    { value: "notpaid", label: "Pedidos sin pagar" },
    { value: "delivered", label: "Pedidos recibidos" },
    { value: "notdelivered", label: "Pedidos sin recibir" },
  ];

  if (isLoading) return <div className="Loading">
  <ul>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</div>
;

  if (isError) return <div>Error</div>;

  let dataFiltered = producerorderData || [];

  if (params.filter) {
    if (params.filter === "paid") {
      dataFiltered = dataFiltered.filter(
        (prodorder) => prodorder.paidDate !== "0001-01-01T00:00:00"
      );
    } else if (params.filter === "notpaid") {
      dataFiltered = dataFiltered.filter(
        (prodorder) => prodorder.paidDate === "0001-01-01T00:00:00"
      );
    } else if (params.filter === "delivered") {
      dataFiltered = dataFiltered.filter(
        (prodorder) => prodorder.deliveredDate !== "0001-01-01T00:00:00"
      );
    } else if (params.filter === "notdelivered") {
      dataFiltered = dataFiltered.filter(
        (prodorder) => prodorder.deliveredDate === "0001-01-01T00:00:00"
      );
    }
  }

  const filteredByDate = dataFiltered.filter((pedido) => {
    if (selectedDate) {
      const pedidoDate = new Date(pedido.confirmedDate);
      const selected = new Date(selectedDate);
      return pedidoDate.toDateString() === selected.toDateString();
    }
    return true;
  });

  const recordsPerPage = 10;
  const offset = currentPage * recordsPerPage;
  const paginatedPedidos = filteredByDate.slice(
    offset,
    offset + recordsPerPage
  );
  const pageCount = Math.ceil(filteredByDate.length / recordsPerPage);

  if (producerorderData) {
    console.log(producerorderData)
  }

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "Esta seguro que desea eliminar este pedido?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteProducerOrder(id).then(
        swal({
          title: "Eliminado!",
          text: `El pedido ha sido eliminado`,
          icon: "success"
        }).then(function(){window.location.reload()}))
        
      }
    });
  };

  return (
    <Container>
      <div className="table-container">
        <h2 className="table-title">Pedidos a Productores</h2>
        <hr className="divider" />
        <br></br>
        <Form>
          <Row className="mb-3 filters-container">
            <Col xs={12} md={6}>
              <AddProducerOrderModal/>
            </Col>
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
        <Col xs={12} md={2} lg={12}>
          {producerorderData ? (
            <Row>
              <Col xs={12}>
                <Table className="Table" responsive>
                  <thead>
                    <tr className="TblProducerOrder">
                      <th>#</th>
                      <th>Fecha del pedido</th>
                      <th>Total</th>
                      <th>Estado del pago</th>
                      <th>Estado de entrega</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPedidos.map((ProducerOrder) => (
                      <tr key={ProducerOrder.id}>
                        <td>{ProducerOrder.id}</td>
                        <td>
                          {format(
                            new Date(ProducerOrder.confirmedDate),
                            "yyyy-MM-dd"
                          )}
                        </td>
                        <td>₡{ProducerOrder.total.toFixed(2)}</td>
                        <td>
                          {ProducerOrder.paidDate === "0001-01-01T00:00:00"
                            ? "Sin pagar"
                            : format(
                                new Date(ProducerOrder.paidDate),
                                "yyyy-MM-dd"
                              )}
                        </td>
                        <td>
                          {ProducerOrder.deliveredDate === "0001-01-01T00:00:00"
                            ? "No recibido"
                            : format(
                                new Date(ProducerOrder.deliveredDate),
                                "yyyy-MM-dd"
                              )}
                        </td>
                        <td>
                          <div className="BtnContainer">
                            <UpdateProducerOrderModal props={ProducerOrder}/>
                            {ProducerOrder.deliveredDate !==
                              "0001-01-01T00:00:00" && (
                              <CheckEntryModal props={ProducerOrder} />
                            )}
                            
                            <PrintProducerOrder props={ProducerOrder.id} />
                            <Button
                              className="BtnRed"
                              onClick={() => showAlert(ProducerOrder.id)}
                              size="sm"
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
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
            </Row>
          ) : (
            "Cargando"
          )}
        </Col>
      </div>
    </Container>
  );
};

export default listProducerOrder;
