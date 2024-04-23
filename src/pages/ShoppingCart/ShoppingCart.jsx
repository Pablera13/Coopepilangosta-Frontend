
import React, { useState, useEffect, useRef } from "react";
import { QueryClient, useMutation } from "react-query";
import swal from "sweetalert";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createCostumerOrder } from "../../services/costumerorderService";
import { checkProductStock } from "../../services/productService";
import { reduceStock } from "../../services/productService";
import { createStockReport } from "../../services/reportServices/stockreportService";
import { locations } from "../../utils/provinces";
import { createSale } from "../../services/saleService";
import { Form, Row, Col, Button, Container, Collapse, Table, Card, } from "react-bootstrap";
import Select from "react-select";
import { MdDelete } from "react-icons/md";
import { RiArrowGoBackFill } from 'react-icons/ri';

import "./ShoppingCart.css";
import { IoWarning } from "react-icons/io5";
const ShoppingCart = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [LocalShopping, setLocalShopping] = useState([]);
  const queryClient = new QueryClient();

  let storedCar;
  const navigate = useNavigate();

  const [TotalOrder, setTotalOrder] = useState();
  const [SubTotal, setSubTotal] = useState();
  const Detail = useRef();
  const Address = useRef();

  useEffect(() => {
    storedCar = localStorage.getItem("ShoppingCar");
    if (storedCar) {
      const parsestoredCar = JSON.parse(storedCar);
      setLocalShopping(parsestoredCar);

      async function xd() {
        let newTotal = 0;
        let newSubTotal = 0;
        parsestoredCar.forEach((sale) => {
          newTotal += sale.TotalVenta;
          newSubTotal += sale.SubTotal;
        });
        setTotalOrder(newTotal);
        setSubTotal(newSubTotal);
      }

      xd();
    } else {
      console.log("No había carrito");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ShoppingCar", JSON.stringify(LocalShopping));
  }, [LocalShopping]);

  const mutationCostumerOrder = useMutation(
    "costumerorder ",
    createCostumerOrder,
    {
      onSettled: () => queryClient.invalidateQueries("costumerorder"),
      mutationKey: "producerorder",
      onSuccess: () => {
        swal({
          title: "Agregado!",
          text: `El pedido ha sido agregado`,
          icon: "success",
        });

        setTimeout(() => {
          setLocalShopping([]);
          localStorage.setItem("ShoppingCar", []);
          navigate(`/myCustomerOrders`);
        }, 2000);
      },
    }
  );

  const mutationSale = useMutation("sale ", createSale, {
    onSettled: () => queryClient.invalidateQueries("sales"),
    mutationKey: "sale",
  });

  const mutationStock = useMutation("stock", createStockReport, {
    onSettled: () => queryClient.invalidateQueries("stock"),
    mutationKey: "stock",
  });

  const DeleteProduct = (ProductId) => {
    const updatedCart = LocalShopping.filter(
      (sale) => sale.ProductId !== ProductId
    );
    setLocalShopping(updatedCart);
  };
  const DeleteCotizacion = (CotizacionId) => {
    const updatedCart = LocalShopping.filter(
      (sale) => sale.CotizacionId !== CotizacionId
    );
    setLocalShopping(updatedCart);
  };

  const checkStockAvailability = async () => {
    let FailedProducts = [];
    let QuantityValidation = true;

    const promises = LocalShopping.map(async (sale) => {
      if (sale.Stockable) {
        let QuantityAvailable = await checkProductStock(sale.ProductId);

        if (sale.Quantity > QuantityAvailable) {
          QuantityValidation = false;
          FailedProducts.push(sale.ProductName);
        }
      }
    });

    await Promise.all(promises);

    console.log("Valor de quantityvalidation: " + QuantityValidation);
    if (QuantityValidation === true) {
      saveProducerOrder();
    } else {
      let message = "";
      FailedProducts.map(async (sale) => {
        message = message + sale + ", ";
      });

      swal({
        title: "Lo sentimos",
        text:
          `Las cantidades seleccionadas de ` +
          message +
          ` exceden nuestro inventario actual`,
        icon: "warning",
        timer: 4000,
      });
    }
  };

  const saveProducerOrder = async () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyy-MM-dd");

    let OrdersSummed = 0;
    let CostumerId;

    LocalShopping.map((sale) => {
      OrdersSummed = OrdersSummed + sale.TotalVenta;
      CostumerId = sale.CostumerId;
    });

    let newCostumerOrder = {
      CostumerId: CostumerId,
      Total: OrdersSummed,
      ConfirmedDate: formattedDate,
      PaidDate: "0001-01-01T00:00:00",
      DeliveredDate: "0001-01-01T00:00:00",
      Detail: Detail.current.value,
      Stage: "Sin confirmar",
      Address: `${Address.current.value}, ${selectedDistrito.label}, ${selectedCanton.label}, ${selectedProvincia.label}`,
    };

    const costumerOrder = await mutationCostumerOrder
      .mutateAsync(newCostumerOrder)
      .finally((data) => data);

    LocalShopping.map(async (sale) => {
      let newSale = {
        ProductId: sale.ProductId,
        Quantity: sale.Quantity,
        PurchaseTotal: sale.TotalVenta,
        CostumerOrderId: costumerOrder.id,
        UnitPrice: sale.PrecioConMargen,
        Unit: sale.ProductUnit,
      };
      mutationSale.mutateAsync(newSale);

      if (sale.Stockable == true) {
        let QuantityAvailable = await checkProductStock(sale.ProductId);

        const stockReportData = {
          ProductId: sale.ProductId,
          ProductName: sale.ProductName,
          CambioFecha: formattedDate,
          OldStock: QuantityAvailable,
          NewStock: QuantityAvailable - sale.Quantity,
          motive: "Venta",
          Email: user.email,
        };
        mutationStock.mutateAsync(stockReportData);
        reduceStock(sale.ProductId, sale.Quantity);
      }
    });
  };

  const [selectedProvincia, setSelectedProvincia] = useState(
    user.costumer.province
  );
  const [selectedCanton, setSelectedCanton] = useState(user.costumer.canton);
  const [selectedDistrito, setSelectedDistrito] = useState(
    user.costumer.district
  );

  const provinciasArray = Object.keys(locations.provincias).map((index) => {
    const indexNumber = parseInt(index, 10);

    return {
      value: indexNumber,
      label: locations.provincias[index].nombre,
    };
  });

  const [cantonesOptions, setCantonesOptions] = useState();
  let cantones = [];
  const handleProvinciasSelectChange = (provinceIndex) => {
    let cantones = locations.provincias[provinceIndex].cantones;

    const cantonesOptions = Object.keys(cantones).map((index) => {
      const indexNumber = parseInt(index, 10);

      return {
        value: indexNumber,
        label: cantones[index].nombre,
      };
    });

    setCantonesOptions(cantonesOptions);
  };

  const [distritosOptions, setDistritosOptions] = useState();
  let distritos = [];

  const handlecantonesSelectChange = (cantonIndex) => {
    console.log(cantonIndex);
    let distritos =
      locations.provincias[selectedProvincia.value].cantones[cantonIndex]
        .distritos;
    console.log(selectedProvincia.value);
    const distritosOpt = Object.keys(distritos).map((index) => {
      const indexNumber = parseInt(index, 10);

      return {
        value: indexNumber,
        label: distritos[index].toString(),
      };
    });
    console.log(distritosOpt);
    setDistritosOptions(distritosOpt);
  };

  return (
    <>
      {LocalShopping.length >= 1 &&
        localStorage.getItem("ShoppingCar") != null ? (
        <>

          <Container className="Josefin">

            <Row>
              <Col xs={12} md={12} lg={12}>
                <div className="warning">
                  <div className="TxtWarning">
                    Los precios indicados en este catálogo son referenciales y
                    pueden estar sujetos a variaciones en el precio final.
                    Por favor consulte con nuestro equipo para conocer precios especiales y descuentos disponibles
                  </div>
                  <div className="IconWarning">
                    <IoWarning />
                  </div>
                </div>
              </Col>
            </Row>


            <Row className="mb-3">
              <div className="card">

                <br></br>
                <div>
                  <Col xs={12} md={12} lg={12}>
                    <Row>
                      <Table
                        responsive
                        className="table table-borderless table-shopping-cart"
                      >
                        <br></br>

                        <thead>
                          <tr className='text-center'>
                            <th>Imagen</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Unidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                            <th>IVA</th>
                            <th>Final</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>

                        <tbody className='text-center'>
                          {LocalShopping.map((Sale, index) => (
                            <tr key={Sale.ProductId}>
                              <td>
                                <img
                                  src={Sale.ProductImage}
                                  className="img-sm"
                                  alt={Sale.ProductName}
                                />
                              </td>

                              <td>{Sale.ProductName}</td>

                              <td style={{ width: "10%" }}>
                                <input
                                  className="form-control text-center"
                                  defaultValue={Sale.Quantity}


                                  max={
                                    Sale.Stockable == true ? Sale.Stock : false
                                  }
                                  type="number"
                                  min={1}
                                  onChange={(e) => {
                                    const updatedShopping = [...LocalShopping];
                                    updatedShopping[index].Quantity = parseInt(
                                      e.target.value
                                    );

                                    if (Sale.CotizacionId != 0) {
                                      var volumesArray = [];
                                      volumesArray = Sale.Volumes;

                                      const initialVolume = {
                                        id: 0,
                                        price:
                                          updatedShopping[index].PrecioInicial,
                                        volume: 1,
                                        productCostumerId: 1,
                                        productCostumer: null,
                                      };

                                      volumesArray.push(initialVolume);

                                      function compararPorVolume(a, b) {
                                        return a.volume - b.volume;
                                      }
                                      volumesArray.sort(compararPorVolume);

                                      for (let object of volumesArray) {
                                        if (e.target.value >= object.volume) {
                                          updatedShopping[
                                            index
                                          ].PrecioConMargen = object.price;
                                        }

                                        updatedShopping[index].TotalVenta =
                                          updatedShopping[index].PrecioFinal *
                                          parseInt(e.target.value);
                                        updatedShopping[index].SubTotal =
                                          updatedShopping[index]
                                            .PrecioConMargen *
                                          parseInt(e.target.value);

                                        let newTotal = 0;
                                        updatedShopping.map(
                                          (sale) =>
                                          (newTotal =
                                            newTotal + sale.TotalVenta)
                                        );
                                        setTotalOrder(newTotal);

                                        let newSubTotal = 0;
                                        updatedShopping.map(
                                          (sale) =>
                                          (newSubTotal =
                                            newSubTotal + sale.SubTotal)
                                        );
                                        setSubTotal(newSubTotal.toFixed(0));
                                      }

                                      setLocalShopping(updatedShopping);
                                    }
                                  }}
                                />
                              </td>
                              <td>{Sale.ProductUnit}</td>

                              <td>
                                {Sale.PrecioConMargen == 0
                                  ? "Por cotizar"
                                  : "₡" + Sale.PrecioConMargen}
                              </td>

                              <td>
                                {Sale.SubTotal == 0
                                  ? "Por cotizar"
                                  : "₡" + Sale.SubTotal}
                              </td>
                              <td>{Sale.iva}%</td>
                              <td>
                                {Sale.TotalVenta == 0
                                  ? "Por cotizar"
                                  : "₡" + Sale.TotalVenta}
                              </td>

                              <td>
                                <button
                                  variant="danger"
                                  className="btn btn-light"
                                  size="sm"
                                  onClick={() => {
                                    Sale.CotizacionId != 0
                                      ? DeleteCotizacion(Sale.CotizacionId)
                                      : DeleteProduct(Sale.ProductId);
                                  }}
                                >
                                  <MdDelete />
                                </button>
                              </td>
                            </tr>
                          ))}

                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                              <b>SubTotal</b>
                            </td>
                            <td>
                              {SubTotal == 0 ? "Por cotizar" : "₡" + SubTotal}
                            </td>
                          </tr>

                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                              <b>Total</b>
                            </td>
                            <td>
                              {TotalOrder == 0
                                ? "Por cotizar"
                                : "₡" + TotalOrder}
                            </td>
                          </tr>

                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </Table>
                    </Row>
                  </Col>
                </div>
              </div>
            </Row>
          </Container>

          <Container id="AdeContai" className="Josefin">
            <Row className="mb-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <Card>
                      <Card.Body>
                        <h5 className="card-title ">Dirección de Envío</h5>
                        <br/>
                        <div className="row">
                          <div className="col-lg-4">
                            <Form.Group controlId="validationCustom03">
                              <Form.Label>Provincia</Form.Label>
                              <Select
                                placeholder={user.costumer.province}
                                options={provinciasArray}
                                onChange={(selected) => {
                                  handleProvinciasSelectChange(selected.value);
                                  setSelectedProvincia(selected);
                                }}
                                on
                              ></Select>
                              <Form.Control.Feedback type="invalid">
                                Ingrese su provincia
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-md-4">
                            <Form.Group md="4" controlId="validationCustom04">
                              <Form.Label>Cantón</Form.Label>
                              <Select
                                placeholder={user.costumer.canton}
                                options={cantonesOptions}
                                onChange={(selected) => {
                                  setSelectedCanton(selected);
                                  handlecantonesSelectChange(selected.value);
                                }}
                              ></Select>
                              <Form.Control.Feedback type="invalid">
                                Por favor indique el cantón
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-md-4">
                            <Form.Group md="4" controlId="validationCustom05">
                              <Form.Label>Distrito</Form.Label>
                              <Select
                                placeholder={user.costumer.district}
                                options={distritosOptions}
                                onChange={(selected) =>
                                  setSelectedDistrito(selected)
                                }
                              ></Select>
                              <Form.Control.Feedback type="invalid">
                                Indique su distrito!.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <Form.Group md="4" controlId="validationCustom05">
                                <br/>
                                <Form.Label>Dirección de Envío</Form.Label>
                                <Form.Control
                                  type="text"
                                  defaultValue={user.costumer.address}
                                  ref={Address}
                                />
                                <Form.Control.Feedback type="invalid">
                                  Indique su dirección!.
                                </Form.Control.Feedback>
                              </Form.Group>
                              <br />
                            </div>
                          </div>
                        </div>

                        <div className="row">

                          

                          <div className="col-md-8">
                            <Button
                             style={{fontSize:'160%'}}
                              className="BtnRed"
                              onClick={() => navigate(`/home`)}
                            >
                                                              <RiArrowGoBackFill />
                            </Button>
                          </div>

                          <div className="col-md-4">
                            <Button
                              className="BtnBrown"
                              style={{fontSize:'110%'}}
                              onClick={checkStockAvailability}
                            >
                              Realizar Pedido
                            </Button>
                          </div>

                        </div>
                      </Card.Body>
                    </Card>
                  </div>

                  <div className="col-md-6">
                    <Card>
                      <Card.Body>
                        <h5 className="card-title">Detalle de Envío</h5>
                        <div className="row">
                          <Form.Group>
                            <Form.Label></Form.Label>
                            <Form.Control
                              as="textarea"
                              placeholder="Ingrese el detalle del envío"
                              rows={5}
                              ref={Detail}
                            />
                          </Form.Group>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            </Row>
          </Container>
        </>
      ) : (


        <Container>
          <Row className="mb-3">
            <Card>
              <Card.Body className="text-center Josefin">
                <h5 className="card-title">¡Tu carrito de compras está vacío!</h5>

                <div className="empty-cart-message">
                  <p>Agrega productos para continuar</p>
                  <Button
                    className="BtnStar"
                    style={{ alignContent: "center" }}
                    onClick={() => navigate(`/home`)}
                  >
                    Ir a comprar{" "}
                  </Button>{" "}
                </div>

              </Card.Body>
            </Card>
          </Row>
        </Container>


      )}
    </>
  );
};

export default ShoppingCart;
