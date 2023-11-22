import { React, useState, useEffect } from 'react'
import { useQuery } from 'react-query';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import { deleteCostumerOrder } from '../../../services/costumerorderService';
import { getCostumerOrder } from '../../../services/costumerorderService';
import { getCostumerOrderById } from '../../../services/costumerorderService';
import { getCostumerById } from '../../../services/costumerService';
import { getSale } from '../../../services/saleService';
import Select from 'react-select';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getProductById } from '../../../services/productService';
import { getProductProducerById } from '../../../services/productProducerService';

import styles from './listCustomerOrder.css'

import ReactPaginate from 'react-paginate';

const listCustomerOrder = () => {

  const params = useParams();

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

  const { data: customerorderData, isLoading, isError } = useQuery('customerorder', getCostumerOrder);
  let dataFiltered = []

  const filter = params.filter

  if (customerorderData) {

    if (filter === 'all') {
      dataFiltered = customerorderData

    } else if (filter === 'paid') {

      dataFiltered = customerorderData.filter((prodorder) => prodorder.paidDate != "0001-01-01T00:00:00")

    } else if (filter === 'notpaid') {

      dataFiltered = customerorderData.filter((prodorder) => prodorder.paidDate === "0001-01-01T00:00:00")

    } else if (filter === 'delivered') {

      dataFiltered = customerorderData.filter((prodorder) => prodorder.deliveredDate != "0001-01-01T00:00:00")

    } else if (filter === 'notdelivered') {

      dataFiltered = customerorderData.filter((prodorder) => prodorder.deliveredDate === "0001-01-01T00:00:00")

    }

  }

  const { data: sales } = useQuery('sale', getSale);


  const optionsSelect = [
    { value: 'all', label: 'Todos los pedidos' },
    { value: 'paid', label: 'Pedidos pagados' },
    { value: 'notpaid', label: 'Pedidos sin pagar' },
    { value: 'delivered', label: 'Pedidos recibidos' },
    { value: 'notdelivered', label: 'Pedidos sin recibir' }
  ];

  const [selectedOption, setSelectedOption] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedOption != null) {

      navigate(`/listCustomerOrder/${selectedOption.value}`)

      console.log("Entro al effect")
    }
  }, [selectedOption]);

  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const offset = currentPage * recordsPerPage;

  const [ProductProducer, setProduct] = useState(null)
  var [MySales, setMySales] = useState([])
  const [MyOrders, setMyOrders] = useState([]);
  const [customerorderRequest, setCustomerorder] = useState(null)
  const [customerRequest, setCustomer] = useState(null)
  const [productRequest, setProductRequest] = useState(null)

  if (isLoading)
    return <div>Loading...</div>

  if (isError)
    return <div>Error</div>

  const paginatedProducers = customerorderData.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(customerorderData.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };


  const generatePDF = async (id) => {

    try {

      let customerorder = await getCostumerOrderById(id, setCustomerorder)
      let customer = await getCostumerById(customerorder.costumerId, setCustomer)

      if (sales) {
        MySales = sales.filter(
          (sales) => sales.costumerOrderId === id
        )
      };


      async function fetchProductData() {
        const sales = [];
        for (const sale of MySales) {

          const product = await getProductById(sale.productId, setProductRequest);
          const averageeprice = await getProductProducerById(product.id);
          const MargenGanancia = averageeprice * (product.margin / 100)
          const PrecioConMargen = averageeprice + MargenGanancia
          const IVA = PrecioConMargen * (product.iva / 100)
          const PrecioFinal = PrecioConMargen + IVA

          const Order = {
            ProductCode: product.code,
            ProductName: product.name,
            UnitPrice: PrecioFinal,
            Quantity: sale.quantity,
            Unit: product.unit,
            Total: sale.purchaseTotal,
          };
          sales.push(Order)
        }
        return sales;
      }

      const MyOrders = await fetchProductData()

      const doc = new jsPDF();

      // tamano de fuente y fuente
      doc.setFontSize(16);
      doc.setFont("Helvetica");

      // datos de la organización 
      doc.text("Coopepilangosta R.L.", 10, 20);

      // Texto factura
      doc.setFontSize(14);
      doc.text(`#${customerorder.id}`, 180, 20);

      // primera linea
      doc.setLineWidth(0.2);
      doc.line(10, 25, 200, 25);

      // datos cope
      doc.setFontSize(10);
      doc.text("600 metros de Barrio Cementerio, Hojancha, Guanacaste", 10, 30);
      doc.text("+506 2659 9130", 10, 40);
      doc.text("info@coopepilangosta.com", 10, 50);
      doc.text("https://coopepilangosta.com/", 10, 60);

      // Texto Customer
      doc.setFontSize(14);
      doc.text("Cliente", 10, 80);

      // Texto Factura
      doc.setFontSize(14);
      doc.text("Factura", 100, 80);

      // segunda linea
      doc.setLineWidth(0.2);
      doc.line(10, 85, 200, 85);

      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd');

      // Datos customer
      doc.setFontSize(10);
      doc.text(`${customer.name}`, 10, 90);
      doc.text(`${customer.address}, ${customer.district}, ${customer.canton}`, 10, 100);
      doc.text(`Cedula Juridica: ${customer.cedulaJuridica}`, 10, 110);
      doc.text(`Email de contacto: ${customer.email}`, 10, 120);
      doc.text(`Cuenta Bancaria: ${customer.bankAccount}`, 10, 130);

      // Datos factura
      doc.text("Fecha de factura:", 100, 100);
      doc.text(formattedDate, 150, 100);
      doc.text("Fecha de pago:", 100, 110);
      doc.text(
        customerorder.paidDate === "0001-01-01T00:00:00" ? "Sin pagar" : `${customerorder.paidDate}`,
        150, 110
      );

      // Tercera linea
      doc.setLineWidth(0.2);
      doc.line(10, 135, 200, 135);

      // Tabla de la factura
      const tableData = MyOrders.map((order, index) => [
        order.ProductCode,
        order.ProductName,
        order.Unit,
        order.Quantity,
        `${order.UnitPrice.toFixed(0)}`,
        `${order.Total.toFixed(2)}`,
      ]);

      const totalPedido = MyOrders.reduce((total, order) => total + order.Total, 0);
      tableData.push(["", "", "", "", "Total", `${totalPedido.toFixed(2)}`]);

      const startY = 140;
      const headText = ["Código de producto", "Producto", "Unidad comercial", "Cantidad", "Precio por unidad", "Total"];

      doc.autoTable({
        startY: startY,
        head: [headText],
        body: tableData,
        margin: { top: 10 },
        styles: {
          fontSize: 10,
          cellPadding: 2,
          lineWidth: 0.5,
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
        columnStyles: {
          0: { cellWidth: 25 },
          4: { halign: 'right' },
          5: { halign: 'right' },
        },
      });

      // Texto detalle
      doc.setFontSize(14);
      doc.text("Detalle:", 10, doc.autoTable.previous.finalY + 10);

      doc.setFontSize(10);
      doc.text(customerorder.detail, 20, doc.autoTable.previous.finalY + 20);

      // doc.text(customerorder.detail);

      //ultima linea
      doc.setLineWidth(0.2);
      doc.line(10, doc.autoTable.previous.finalY + 12, 200, doc.autoTable.previous.finalY + 12); // Línea horizontal

      // mostrar el PDF
      doc.output('dataurlnewwindow');

      setMyOrders([])

    } catch (error) {
      console.error("Error al obtener datos:", error);
    }

  };


  const deleteObject = (id) => {

    deleteCostumerOrder(id);

  }

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "Esta seguro que desea eliminar este pedido?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"]
    }).then(answer => {
      if (answer) {
        swal({
          title: 'Eliminado!',
          text: `El pedido ha sido eliminado`,
          icon: "success"

        })
        setTimeout(function () {
          deleteCostumerOrder(id);
          window.location.reload();
        }, 2000)

      }
    })
  }


  return (
    <Container>
      <h2 className="text-center">Pedidos Recibidos</h2>
      <div className="buttons">
      </div>
      <Col xs={8} md={2} lg={12}>

        <span>Seleccione los pedidos que desea ver:</span>
        <Select onChange={(selected) => setSelectedOption(selected)} options={optionsSelect} />

        <br></br>

        {customerorderData ? (
          <Row>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Número de pedido</th>
                  <th>Fecha del pedido</th>
                  <th>Total</th>
                  <th>Estado del pago</th>
                  <th>Estado de entrega</th>
                  <th>Seguimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {dataFiltered.map((CustomerOrder) => (
                  <tr key={CustomerOrder.id}>
                    <td>{CustomerOrder.id}</td>
                    <td>{format(new Date(CustomerOrder.confirmedDate), 'yyyy-MM-dd')}</td>
                    <td>₡{CustomerOrder.total.toFixed(2)}</td>
                    <td>
                      {CustomerOrder.paidDate === "0001-01-01T00:00:00"
                        ? "Sin pagar"
                        : format(new Date(CustomerOrder.paidDate), 'yyyy-MM-dd')}
                    </td>
                    <td>
                      {CustomerOrder.deliveredDate === "0001-01-01T00:00:00"
                        ? "No entregado"
                        : format(new Date(CustomerOrder.deliveredDate), 'yyyy-MM-dd')}
                    </td>
                    <td>{CustomerOrder.stage}</td>
                    <td>

                  <Button
                  onClick={() => navigate(`/editCustomerOrder/${CustomerOrder.id}`)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Editar
                  </Button>

                  <Button
                  onClick={() => showAlert(CustomerOrder.id)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Eliminar
                  </Button> 

                  <Button
                  onClick={() => generatePDF(CustomerOrder.id)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Imprimir
                  </Button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <ReactPaginate
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
            />
          </Row>
        ) : (
          "Cargando"
        )}
      </Col>
    </Container>
  );
};

export default listCustomerOrder;