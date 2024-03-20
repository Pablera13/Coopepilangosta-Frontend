import { React, useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { getProducerOrderSales } from "../../../services/saleService";
import { getProductById2 } from "../../../services/productService";
import { getCostumerOrderById } from "../../../services/costumerorderService";
import {
  Form,
  Row,
  Col,
  Button,
  Container,
  InputGroup,
  Collapse,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RiArrowGoBackFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { format } from "date-fns";
import "./userOrder.css";
import { FaTruck } from "react-icons/fa";
import { FaBoxesPacking } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa";

const userOrder = () => {

    const order = useParams();
    const [customerorderRequest, setCustomerorder] = useState(null)
    const [MyFilteredData, setMyFilteredData] = useState([]);
    const [MyOrders, setMyOrders] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const navigate = useNavigate()


  useEffect(() => {
    async function settingSales() {
      getProducerOrderSales(order.orderid, setMyFilteredData);
      getCostumerOrderById(order.orderid, setCustomerorder);
    }
    settingSales();
  }, []);

  useEffect(() => {
    async function MeCagoEnLasRestricciones() {
      let MySales = [];
      let subtotal = 0;

      for (const sale of MyFilteredData) {
        const product = await getProductById2(sale.productId);
        const Sale = {
          ProductName: product.name,
          ProductImage: product.image,
          IVA: product.iva / 100,
          UnitPrice: sale.unitPrice,
          Quantity: sale.quantity,
          Unit: sale.unit,
          Total: sale.purchaseTotal,
        };

        console.log("Sale = " + Sale);
        MySales.push(Sale);
        subtotal += sale.unitPrice * sale.quantity;
      }
      setMyOrders(MySales);
      setSubTotal(subtotal);
    }

    MeCagoEnLasRestricciones();
  }, [MyFilteredData]);

    return (
        <Container>
            {customerorderRequest != null && MyOrders.length > 0 ? (
                <>
                    <article className="card">
                        <header className="card-header">
                            <h6>Código de Pedido: #{order.orderid}</h6>
                        </header>
                        <div className="card-body">
                            <Row className="mb-3">
                                <Col>
                                    <strong>Fecha de pedido</strong>
                                    <br />
                                    {customerorderRequest.confirmedDate === "0001-01-01T00:00:00"
                                        ? "Sin pagar"
                                        : format(new Date(customerorderRequest.confirmedDate), 'yyyy-MM-dd')}
                                </Col>
                                <Col>
                                    <strong>Fecha de pago</strong>
                                    <br />
                                    {customerorderRequest.paidDate === "0001-01-01T00:00:00"
                                        ? "Sin pagar"
                                        : format(new Date(customerorderRequest.paidDate), 'yyyy-MM-dd')}
                                </Col>
                                <Col>
                                    <strong>Fecha de entrega</strong>
                                    <br />
                                    {customerorderRequest.deliveredDate === "0001-01-01T00:00:00"
                                        ? "Sin entregar"
                                        : format(new Date(customerorderRequest.deliveredDate), 'yyyy-MM-dd')}
                                </Col>
                            </Row>
                            <Table responsive className="table table-borderless table-shopping-cart">
                                <thead>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th>Unidad</th>
                                        <th>Precio Unitario</th>
                                        <th>Subtotal</th>
                                        <th>IVA</th>
                                        <th>Final</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MyOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td>
                                                <img src={order.ProductImage} className="img-sm" alt={order.ProductName} />
                                            </td>
                                            <td>{order.ProductName}</td>
                                            <td>{order.Quantity}</td>
                                            <td>{order.Unit}</td>
                                            <td>{order.UnitPrice == 0 ? 'Por cotizar' : '₡' + order.UnitPrice}</td>
                                            <td>{order.UnitPrice == 0 ? 'Por cotizar' : '₡' + order.UnitPrice * order.Quantity}</td>
                                            <td>{(order.IVA * 100)}%</td>
                                            <td>{order.Total == 0 ? 'Por cotizar' : '₡' + order.Total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div className="card">
                                <div className="card-body row">
                                    <Col md={{ span: 1, offset: 10 }}>
                                        <strong>Subtotal</strong>
                                    </Col>
                                    <Col>
                                        {subTotal == 0 ? 'Por cotizar' : '₡' + subTotal.toFixed(2)}
                                    </Col>
                                    <Col md={{ span: 1, offset: 10 }}>
                                        <strong>Total</strong>
                                    </Col>
                                    <Col>
                                        {customerorderRequest.total == 0 ? 'Por cotizar' : '₡' + customerorderRequest.total}
                                    </Col>
                                </div>
                            </div>
                        </div>
                    </article>

          <article className="card">
            <div className="card-body">
              {customerorderRequest.detail !== "" && (
                <article className="card">
                  <div className="card-body row">
                    <Col>
                      <strong>Detalle del pedido</strong>
                      <br />
                      <br />
                      {customerorderRequest.detail}
                    </Col>
                  </div>
                </article>
              )}
              <div className="track">
                <div
                  className={
                    customerorderRequest.stage === "Confirmado" ||
                    customerorderRequest.stage === "En preparación" ||
                    customerorderRequest.stage === "En ruta de entrega" ||
                    customerorderRequest.stage === "Entregado"
                      ? "step active"
                      : "step"
                  }
                >
                  <span className="icon">
                    <FaCheck />
                    <i className="fa fa-check"></i>{" "}
                  </span>
                  <span className="text">Pedido confirmado</span>
                </div>
                <div
                  className={
                    customerorderRequest.stage === "En preparación" ||
                    customerorderRequest.stage === "En ruta de entrega" ||
                    customerorderRequest.stage === "Entregado"
                      ? "step active"
                      : "step"
                  }
                >
                  <span className="icon">
                    <FaBoxesPacking />
                    <i className="fa fa-user"></i>{" "}
                  </span>
                  <span className="text">En preparación</span>
                </div>
                <div
                  className={
                    customerorderRequest.stage === "En ruta de entrega" ||
                    customerorderRequest.stage === "Entregado"
                      ? "step active"
                      : "step"
                  }
                >
                  <span className="icon">
                    <FaTruck />
                    <i className="fa fa-truck"></i>{" "}
                  </span>
                  <span className="text">En ruta de entrega</span>
                </div>
                <div
                  className={
                    customerorderRequest.stage === "Entregado"
                      ? "step active"
                      : "step"
                  }
                >
                  <span className="icon">
                    <FaCheckDouble />
                    <i className="fa fa-box"></i>{" "}
                  </span>
                  <span className="text">Entregado</span>
                </div>
              </div>
              <br />
              <hr />{" "}
              <Button
                className="BtnBrown"
                onClick={() => navigate(`/userProfile`)}
              >
                <RiArrowGoBackFill />
              </Button>
              <br />
            </div>
          </article>
        </>
      ) : (
        "Cargando..."
      )}
    </Container>
  );
};

export default userOrder;
