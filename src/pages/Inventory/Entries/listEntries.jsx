import { React, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import { format } from "date-fns";
import { Table, Container, Col, Row, Button } from "react-bootstrap";
import { deleteProducerOrder } from "../../../services/producerorderService";
import { getProducerOrder } from "../../../services/producerorderService";
import { getProducerOrderById } from "../../../services/producerorderService";
import { getProducerById } from "../../../services/producerService";
import { getPurchase } from "../../../services/purchaseService";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import { MdLocalPrintshop } from "react-icons/md"; 
import jsPDF from "jspdf";
import { getProductById } from "../../../services/productService";
import { getProductProducer } from "../../../services/productProducerService";
import ReactPaginate from "react-paginate";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess";

const listEntries = () => {
  useEffect(()=>{
    validateAllowedPageAccess()
  },[])

  const {
    data: producerorderData,
    isLoading,
    isError,
  } = useQuery("producerorder", getProducerOrder);
  let dataFiltered = [];

  if (producerorderData) {
    dataFiltered = producerorderData.filter(
      (prodorder) => prodorder.deliveredDate != "0001-01-01T00:00:00"
    );
    console.log(dataFiltered);
  }

  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const offset = currentPage * recordsPerPage;
  const paginatedEntries = dataFiltered.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(dataFiltered.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const { data: purchases } = useQuery("purchase", getPurchase);

  const [ProductProducer, setProduct] = useState(null);
  var [MyPurchases, setMyPurchases] = useState([]);
  const [MyOrders, setMyOrders] = useState([]);
  const [producerorderRequest, setProducerorder] = useState(null);
  const [producerRequest, setProducer] = useState(null);
  const [productRequest, setProductRequest] = useState(null);

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

  const generatePDF = async (id) => {
    try {
      let producerorder = await getProducerOrderById(id, setProducerorder);
      let producer = await getProducerById(
        producerorder.producerId,
        setProducer
      );

      if (purchases) {
        MyPurchases = purchases.filter(
          (purchases) => purchases.producerOrderId === id
        );
      }

      MyPurchases.forEach(async (purchase) => {
        const product = await getProductById(
          purchase.productId,
          setProductRequest
        );
        const purchaseprice = await getProductProducer(product.id, producer.id);

        const Order = {
          ProductCode: product.code,
          ProductName: product.name,
          UnitPrice: purchaseprice,
          Quantity: purchase.quantity,
          Unit: product.unit,
          Total: purchase.purchaseTotal,
        };

       
        setMyOrders((prevOrders) => [...prevOrders, Order]);
      });

      const doc = new jsPDF();

      
      doc.setFontSize(16);
      doc.setFont("Helvetica");

  
      doc.text("Coopepilangosta R.L.", 10, 20);

      
      doc.setFontSize(14);
      doc.text(`#${producerorder.id}`, 180, 20);

      
      doc.setLineWidth(0.2);
      doc.line(10, 25, 200, 25);

    
      doc.setFontSize(10);
      doc.text("600 metros de Barrio Cementerio, Hojancha, Guanacaste", 10, 30);
      doc.text("+506 2659 9130", 10, 40);
      doc.text("info@coopepilangosta.com", 10, 50);
      doc.text("https://coopepilangosta.com/", 10, 60);

      
      doc.setFontSize(14);
      doc.text("Productor", 10, 80);

     
      doc.setFontSize(14);
      doc.text("Factura", 100, 80);

     
      doc.setLineWidth(0.2);
      doc.line(10, 85, 200, 85);

      const currentDate = new Date();
      const formattedDate = format(currentDate, "yyyy-MM-dd");

      
      doc.setFontSize(10);
      doc.text(
        `${producer.name} ${producer.lastname1} ${producer.lastname2}`,
        10,
        90
      );
      doc.text(
        `${producer.address}, ${producer.district}, ${producer.canton}`,
        10,
        100
      );
      doc.text(`Teléfono: ${producer.phoneNumber}`, 10, 110);
      doc.text(`Email: ${producer.email}`, 10, 120);
      doc.text(`Cuenta Bancaria: ${producer.bankAccount}`, 10, 130);

      
      doc.text("Fecha de factura:", 100, 100);
      doc.text(formattedDate, 150, 100);
      doc.text("Fecha de pago:", 100, 110);
      doc.text(
        producerorder.paidDate === "0001-01-01T00:00:00"
          ? "Sin pagar"
          : `${producerorder.paidDate}`,
        150,
        110
      );

      doc.setLineWidth(0.2);
      doc.line(10, 135, 200, 135);

      const tableData = MyOrders.map((order, index) => [
        order.ProductCode,
        order.ProductName,
        order.Unit,
        order.Quantity,
        `${order.UnitPrice}`,
        `${order.Total}`,
      ]);

      const totalPedido = MyOrders.reduce(
        (total, order) => total + order.Total,
        0
      );
      tableData.push(["", "", "", "", "Total", `${totalPedido}`]);

      const startY = 140;
      const headText = [
        "Código de producto",
        "Producto",
        "Unidad comercial",
        "Cantidad",
        "Precio por unidad",
        "Total",
      ];

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
          4: { halign: "right" },
          5: { halign: "right" },
        },
      });

    
      doc.setFontSize(14);
      doc.text("Detalle:", 10, doc.autoTable.previous.finalY + 10);

      doc.setFontSize(10);
      doc.text(producerorder.detail, 20, doc.autoTable.previous.finalY + 20);

     

      
      doc.setLineWidth(0.2);
      doc.line(
        10,
        doc.autoTable.previous.finalY + 12,
        200,
        doc.autoTable.previous.finalY + 12
      ); 

     
      doc.output("dataurlnewwindow");

      setMyOrders([]);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const deleteObject = (id) => {
    deleteProducerOrder(id);
  };

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Esta seguro que desea eliminar este pedido?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        swal({
          title: "Eliminado!",
          text: `El pedido ha sido eliminado`,
          icon: "success",
        }).then(function(){window.location.reload()});
      }
    });
  };

  return (
    <Container>
      <h2 className="text-center">Pedidos recibidos</h2>
      <div className="buttons">
  
      </div>
      <Col xs={8} md={2} lg={12}>
        {dataFiltered ? (
          <Row>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Número de pedido</th>
                  <th>Fecha del pedido</th>
                  <th>Total</th>
                  <th>Estado del pago</th>
                  <th>Estado de entrega</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.map((ProducerOrder) => (
                  <tr key={ProducerOrder.id}>
                    <td>{ProducerOrder.id}</td>
                    <td>
                      {format(
                        new Date(ProducerOrder.confirmedDate),
                        "yyyy-MM-dd"
                      )}
                    </td>
                    <td>₡{ProducerOrder.total}</td>
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
                      <Button
                        href={`/editProducerOrder/${ProducerOrder.id}`}
                        className="BtnBrown"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => deleteObject(ProducerOrder.id)}
                        variant="BtnRed"
                        size="sm"
                      >
                        Eliminar
                      </Button>
                      <Button className="BtnPrint" onClick={() => generatePDF(ProducerOrder.id)}>
                        Imprimir <MdLocalPrintshop />
                      </Button>
                      <Button 
                        href={`/checkProducerOrder/${ProducerOrder.id}`}
                        className="BtnAdd"
                      >
                        Ingresar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="Pagination-Container">
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
              </div>
          </Row>
        ) : (
          "Cargando"
        )}
      </Col>
    </Container>
  );
};

export default listEntries;
