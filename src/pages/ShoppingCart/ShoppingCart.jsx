
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
import { NumbersOnly } from '../../utils/validateFields.js'
import { getUserLocalStorage } from '../../utils/getLocalStorageUser'
import { Tooltip } from '@mui/material';

import "./ShoppingCart.css";
import { IoWarning } from "react-icons/io5";
const ShoppingCart = () => {

  const user = getUserLocalStorage()

  const [LocalShopping, setLocalShopping] = useState([]);
  const queryClient = new QueryClient();
  const [validated, setValidated] = useState(false);

  let storedCar;
  const navigate = useNavigate();

  const [TotalOrder, setTotalOrder] = useState();
  const [SubTotal, setSubTotal] = useState();
  const Detail = useRef();
  const Address = useRef();

  const handleKeyDown = (e, index) => {
    const currentValue = e.target.value;

    if (
      !(
        (e.key >= '0' && e.key <= '9') ||
        e.key === 'Backspace' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'Delete'
      )
    ) {
      e.preventDefault();
    }

    if (currentValue.length === 1 && e.key === 'Backspace') {
      e.preventDefault();
    }
  };

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

    const formFields = [Address.current.value, selectedDistrito, selectedCanton, selectedProvincia];
    let fieldsValid = true;

    console.log("selectedDistrito = " + selectedDistrito.label)
    console.log("selectedCanton = " + selectedCanton.label)
    console.log("selectedProvincia = " + selectedProvincia.label)


    formFields.forEach((fieldRef) => {
      if (!fieldRef) {
        fieldsValid = false;
        swal({
          title: 'Error',
          text: 'Por favor ingrese una dirección válida',
          icon: 'error',
        });
      }
    });
    if (!fieldsValid) {
      setValidated(true);
      return;
    } else {
      setValidated(false);
    }


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


  const [selectedProvincia, setSelectedProvincia] = useState({
    value: 0,
    label: user.costumer.province
  });

  const [selectedCanton, setSelectedCanton] = useState({
    value: 0,
    label: user.costumer.canton
  });

  const [selectedDistrito, setSelectedDistrito] = useState({
    value: 0,
    label: user.costumer.district
  });


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
    setDistritosOptions(distritosOpt);
  };

  return (
    <>
      {LocalShopping.length >= 1 && localStorage.getItem("ShoppingCar") !== null ? (
        <Container className="Josefin">
          <Row>
            <Col md={8}>
              <Card className="mb-3">
                <Card.Body>
                  <h5 className="card-title">Productos en el Carrito</h5>
                  <Table responsive className="table table-borderless table-shopping-cart">
                    <thead>
                      <tr className='text-center'>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                        <th>IVA</th>
                        <th>Final</th>
                        <th>Acciones</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {LocalShopping.map((Sale, index) => (


                        <tr key={Sale.ProductId} className='text-center'>
                          <td className="ProductDetail">
                            <div className="product-description">
                              <div className="product-info">
                                <img
                                  src={Sale.ProductImage}
                                  className="img-sm"
                                  alt={Sale.ProductName}
                                />
                                <div className="product-name">{Sale.ProductName}</div>
                              </div>
                              <div className="product-unit">
                                <span className="unit-label"></span> {Sale.ProductUnit}
                              </div>
                            </div>
                          </td>

                          <td className="ProductDetail" style={{ width: "10%" }}>
                            <input
                              className="form-control text-center"
                              defaultValue={Sale.Quantity}
                              onKeyDown={(e) => handleKeyDown(e, index)}
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

                          <td className="ProductDetail">
                            {Sale.PrecioConMargen == 0
                              ? "Por cotizar"
                              : "₡" + Sale.PrecioConMargen}
                          </td>

                          <td className="ProductDetail">
                            {Sale.SubTotal == 0
                              ? "Por cotizar"
                              : "₡" + Sale.SubTotal.toFixed(2)}
                          </td>
                          <td className="ProductDetail">{Sale.iva}%</td>
                          <td className="ProductDetail">
                            {Sale.TotalVenta == 0
                              ? "Por cotizar"
                              : "₡" + Sale.TotalVenta.toFixed(2)}
                          </td>


                          <td className="ProductDetail">

                          <Tooltip title="Eliminar">
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
                            </Tooltip>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
            
            <Card className="mb-3">
      <Card.Body>
      <h5 className="card-title mb-4">Resumen del Pedido</h5>
        <Container>
          <Row>
            <Col>
              <Row className="mb-3">
                <Col>
                  <h6 className="text-muted">SubTotal:</h6>
                  <p>{SubTotal === 0 ? "Por cotizar" : `₡${SubTotal}`}</p>
                </Col>
                <Col>
                  <h6 className="text-muted">Total:</h6>
                  <p>{TotalOrder === 0 ? "Por cotizar" : `₡${TotalOrder}`}</p>
                </Col>
              </Row>
              <hr />
              <h6 className="text-muted">Detalle del Pedido</h6>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  placeholder="Ingrese el detalle del envío"
                  rows={3}
                  ref={Detail}
                />
                <Form.Control.Feedback type="invalid">
                  Este campo es obligatorio.
                </Form.Control.Feedback>
              </Form.Group>
              <hr />
              <h6 className="text-muted">Dirección de Envío</h6>
              <Form.Group>
                <Form.Control
                  type="text"
                  required
                  placeholder="Dirección de Envío"
                  defaultValue={user.costumer.address}
                  ref={Address}
                />
                <Form.Control.Feedback type="invalid">
                  Este campo es obligatorio.
                </Form.Control.Feedback>
              </Form.Group>
              <hr />
              <h6 className="text-muted">Provincia</h6>
              <Form.Group>
                <Select
                  placeholder={user.costumer.province}
                  options={provinciasArray}
                  onChange={(selected) => {
                    handleProvinciasSelectChange(selected.value);
                    setSelectedProvincia(selected);
                  }}
                />
              </Form.Group>
              <hr />
              <h6 className="text-muted">Cantón</h6>
              <Form.Group>
                <Select
                  placeholder={user.costumer.canton}
                  options={cantonesOptions}
                  onChange={(selected) => {
                    setSelectedCanton(selected);
                    handlecantonesSelectChange(selected.value);
                  }}
                />
              </Form.Group>
              <hr />
              <h6 className="text-muted">Distrito</h6>
              <Form.Group>
                <Select
                  placeholder={user.costumer.district}
                  options={distritosOptions}
                  onChange={(selected) => setSelectedDistrito(selected)}
                />
              </Form.Group>
              <hr />
              <Form.Group className="text-center">
                <Button
                  className="BtnSave "
                  variant="primary"
                  onClick={checkStockAvailability}
                >
                  Realizar Pedido
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>

            </Col>
          </Row>
        </Container>

      ) : (
        <div className='text-center'>
          <br></br>
          <IoWarning className='text-warning' size={60} />
          <h4>Su carrito de compras está vacío</h4>
          <Button onClick={() => navigate(`/home`)} className="BtnSave" variant='primary' size='sm'>
            <RiArrowGoBackFill size={20} /> Regresar
          </Button>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;