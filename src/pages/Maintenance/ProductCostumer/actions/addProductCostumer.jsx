import React, { useRef, useState, useEffect } from "react";
import { Modal, Row, Col, Button, Form } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import Select from "react-select";
import { QueryClient } from "react-query";
import { createProductCostumer } from "../../../../services/productCostumerService.js";
import { useParams } from "react-router-dom";
import { getProducts } from "../../../../services/productService";
import { getProductById2 } from "../../../../services/productService";
import "../../../../css/Pagination.css";
import "../../../../css/StylesBtn.css";
import { GrAddCircle } from "react-icons/gr";
import { Tooltip } from '@mui/material';

export const addProductCostumer = () => {
  const queryClient = new QueryClient();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const Params = useParams();

  const [validated, setValidated] = useState(false);

  const PurchasePrice = useRef();
  const Description = useRef();
  const Margin = useRef();
  const Unit = useRef();

  const { data: products } = useQuery("product", getProducts);
  const [ProductOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (selectedProduct) {
      ObtainMargin(selectedProduct.value);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (products && products.length > 0) {
      FillSelect();
    }
  }, [products]);

  const FillSelect = async () => {
    if (products) {
      let productsOptions = [];
      for (const product of products) {
        let productOption = {
          value: product.id,
          label: product.name,
        };
        productsOptions.push(productOption);
      }
      setProductOptions(productsOptions);
    }
  };

  const ObtainMargin = async (productId) => {
    try {
      let Leproduct = await getProductById2(productId);
      Margin.current.value = Leproduct.margin;
      Unit.current.value = Leproduct.unit;
    } catch (error) {
      console.error("Error al obtener margin en el componente ", error);
    }
  };

  const mutation = useMutation("productcostumer", createProductCostumer, {
    onSettled: () => queryClient.invalidateQueries("productcostumer"),
    mutationKey: "productcostumer",
    onSuccess: () => {
      swal({
        title: "Agregado!",
        text: "La cotización ha sido agregada",
        icon: "success",
      }).then(function () { window.location.reload() });

    },
  });

  const saveProductCostumer = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setValidated(true);

      let productcostumer = {
        productId: selectedProduct.value,
        costumerId: Params.costumerid,
        purchasePrice: PurchasePrice.current.value,
        description: Description.current.value,
        margin: Margin.current.value,
        unit: Unit.current.value,
      };
      mutation.mutateAsync(productcostumer);
    }
  };

  return (
    <>

      <Tooltip title="Agregar">
        <Button className="BtnAdd" variant="info" onClick={handleShow} size="sm">
          <GrAddCircle />
        </Button>
      </Tooltip>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="HeaderModal" closeButton>
          <Modal.Title>Agregar nueva cotización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Row>
              <Col>
                <Form.Label>
                  Seleccione el producto
                </Form.Label>
                <Select
                  options={ProductOptions}
                  placeholder="Producto"
                  onChange={(selectedOption) =>
                    setSelectedProduct(selectedOption)
                  }
                  className="small-input"
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label>Precio inicial</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Ingrese el precio inicial"
                  ref={PurchasePrice}
                />
              </Col>
              <Col>
                <Form.Label>Margen de ganancia</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Ingrese el margen de ganancia"
                  ref={Margin}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label>Unidad</Form.Label>
                <Form.Control
                  required
                  placeholder="Ingrese la unidad comercial"
                  ref={Unit}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  required
                  type="textarea"
                  rows={3}
                  placeholder="Ingrese la descripción"
                  ref={Description}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="BtnSave" size="sm" onClick={saveProductCostumer}>
            Guardar
          </Button>
          <Button className="BtnClose" size="sm" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default addProductCostumer;
