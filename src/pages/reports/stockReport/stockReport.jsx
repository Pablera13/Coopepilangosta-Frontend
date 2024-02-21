import React, { useState } from 'react';
import { getstocks } from '../../../services/reportServices/stockreportService';
import { useQuery } from 'react-query';
import { Table, Form, Container, Col, Row, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

import { format } from 'date-fns';

const stockReport = () => {
  const { data: stocksData, isLoading: stocksLoading, isError: stocksError } = useQuery(
    'stockreport',
    getstocks
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (stocksLoading) {
    return <div>Cargando...</div>;
  }

  if (stocksError) {
    return <div>Error al cargar los datos.</div>;
  }

  const filteredBySearch = stocksData.filter(
    (stock) =>
      stock.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.motive.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredByDate = filteredBySearch.filter((stock) => {
    if (startDate && endDate) {
      const stockDate = new Date(stock.cambioFecha);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return stockDate >= start && stockDate <= end;
    }
    return true;
  });

  const recordsPerPage = 10;
  const offset = currentPage * recordsPerPage;
  const paginatedStocks = filteredByDate.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(filteredByDate.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (

      <Container>
      <h2 className="text-center">Historial de Inventario</h2>
      <br></br>

      <Form>
        <Row className="mb-3">

          <Col md={3}>
            <Form.Label>Buscar</Form.Label>
            <Form.Control
              type="text"
              placeholder="Por nombre, motivo o correo electrónico..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>

          <Col md={3}>
            <Form.Label>Fecha Inicial</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Col>

          <Col md={3}>
            <Form.Label>Fecha Final</Form.Label>
            <Form.Control
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Col>

        </Row>
      </Form>

     <Col xs={8} md={2} lg={12}>
        {stocksData ? (
          <Row>
            <Table className='TableProducts' striped bordered hover variant="light" >
        <thead>
          <tr>
            <th>Producto</th>
            <th>Fecha</th>
            <th>Inicial</th>
            <th>Modificado</th>
            <th>Motivo</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStocks.map((stock) => (
            <tr key={stock.Id}>
              <td>{stock.productName}</td>
              <td>{(format(new Date(stock.cambioFecha), "dd-MM-yyyy"))}</td>
              <td>{stock.oldStock}</td>
              <td>{stock.newStock}</td>
              <td>{stock.motive}</td>
              <td>{stock.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className='Pagination-Container'>
      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Siguiente'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </div>
  </Row>
  ) : (
    "Cargando"
  )}
</Col>
</Container>
);
};

export default stockReport;