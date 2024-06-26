import React, { useRef, useState } from "react";
import { QueryClient, useMutation } from "react-query";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { LettersOnly, NumbersOnly } from '../../../../utils/validateFields'
import swal from "sweetalert";
import {
  createProducer,
  CheckCedulaProducerAvailability,
} from "../../../../services/producerService";
import { locations } from "../../../../utils/provinces";
import Select from "react-select";
import "../../../../css/StylesBtn.css";
import { GrAddCircle } from "react-icons/gr";
import { Tooltip } from '@mui/material';


const addProducerModal = () => {
  const [show, setShow] = useState(false);
  const queryClient = new QueryClient();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [validated, setValidated] = useState(false);

  const mutation = useMutation("producer", createProducer, {
    onSettled: () => queryClient.invalidateQueries("producer"),
    mutationKey: "producer",
    onSuccess: () => {
      swal({
        title: "Agregado!",
        text: "El productor ha sido agregado",
        icon: "success",
      }).then(function () {
        window.location.reload();
      });
    },
  });

  const cedula = useRef();
  const name = useRef();
  const lastname1 = useRef();
  const lastname2 = useRef();
  const phoneNumber = useRef();
  const email = useRef();
  const address = useRef();
  const bankAccount = useRef();

  const saveProducer = async (event) => {
    event.preventDefault();
    const formFields = [cedula, name, lastname1, lastname2, phoneNumber, email, address, bankAccount];
    let fieldsValid = true;

    formFields.forEach((fieldRef) => {
      if (!fieldRef.current.value) {
        fieldsValid = false;
      }
    });

    if (!fieldsValid) {
      setValidated(true);
      return;
    } else {
      setValidated(false);
    }


    let newProducer = {
      cedula: cedula.current.value,
      name: name.current.value,
      lastname1: lastname1.current.value,
      lastname2: lastname2.current.value,
      phoneNumber: phoneNumber.current.value,
      email: email.current.value,
      province: selectedProvincia.label,
      canton: selectedCanton.label,
      district: selectedDistrito.label,
      address: address.current.value,
      bankAccount: bankAccount.current.value,
    };

    let cedulaAvailability = await CheckCedulaProducerAvailability(
      cedula.current.value
    ).then((data) => data);

    if (cedulaAvailability == true) {
      mutation.mutateAsync(newProducer);
    } else {
      event.preventDefault();
      swal(
        "Advertencia",
        "Ya existe un productor con el número de cédula ingresado.",
        "warning"
      );
    }
  };

  const handleNameChange = (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, "");
  };

  const handleLastNameChange = (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, "");
  };

  const handlePhoneChange = (event) => {
    event.target.value = event.target.value.replace(/[^0-9]/g, "");
  };

  const [selectedProvincia, setSelectedProvincia] = useState();
  const [selectedCanton, setSelectedCanton] = useState();
  const [selectedDistrito, setSelectedDistrito] = useState();

  const provinciasArray = Object.keys(locations.provincias).map((index) => {
    const indexNumber = parseInt(index, 10);

    return {
      value: indexNumber,
      label: locations.provincias[index].nombre,
    };
  });

  const [cantonesOptions, setCantonesOptions] = useState();

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

      <Tooltip title="Agregar">
        <Button onClick={handleShow} className="BtnAdd">
          <GrAddCircle />
        </Button>
      </Tooltip>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="HeaderModal" closeButton>
          <Modal.Title>Agregar nuevo productor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={validated} onSubmit={saveProducer}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="cedula">
                  <Form.Label>Cédula</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    placeholder="Ingrese la cédula"
                    ref={cedula}
                    onKeyDown={NumbersOnly}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="phoneNumber">
                  <Form.Label>Teléfono</Form.Label>
                  <InputGroup>
                          <InputGroup.Text>+506</InputGroup.Text>
                  <Form.Control
                    required
                    type="number"
                    placeholder="Ingrese el teléfono"
                    ref={phoneNumber}
                    onChange={handlePhoneChange}
                    onKeyDown={NumbersOnly}
                  />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingrese el nombre"
                    ref={name}
                    onChange={handleNameChange}
                    onKeyDown={LettersOnly}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="lastname1">
                  <Form.Label>Primer Apellido</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingrese el primer apellido"
                    ref={lastname1}
                    onChange={handleLastNameChange}
                    onKeyDown={LettersOnly}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="lastname2">
                  <Form.Label>Segundo Apellido</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingrese el segundo apellido"
                    ref={lastname2}
                    onChange={handleLastNameChange}
                    onKeyDown={LettersOnly}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Ingrese el email"
                    ref={email}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="MnuCountry">
              <Form.Group as={Col} md="4" controlId="validationCustom03">
                <Form.Label>Provincia</Form.Label>
                <Select
                  placeholder="Provincia"
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
              <Form.Group as={Col} md="4" controlId="validationCustom04">
                <Form.Label>Canton</Form.Label>
                <Select
                  placeholder="Canton"
                  options={cantonesOptions}
                  onChange={(selected) => {
                    setSelectedCanton(selected);
                    handlecantonesSelectChange(selected.value);
                  }}
                ></Select>
                <Form.Control.Feedback type="invalid">
                  Por favor indique el canton
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                className="DropMenu"
                as={Col}
                md="4"
                controlId="validationCustom05"
              >
                <Form.Label>Distrito</Form.Label>
                <Select
                  placeholder="Distrito"
                  options={distritosOptions}
                  onChange={(selected) => setSelectedDistrito(selected)}
                ></Select>
                <Form.Control.Feedback type="invalid">
                  Indique su distrito!.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row></Row>
            <Form.Group controlId="address">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ingrese la dirección"
                ref={address}
              />
            </Form.Group>
            <Form.Group controlId="bankAccount">
              <Form.Label>Cuenta IBAN</Form.Label>
              <InputGroup>
              <InputGroup.Text>CR</InputGroup.Text>
              <Form.Control
                required
                type="number"
                placeholder="Ingrese la cuenta bancaria"
                ref={bankAccount}
                onKeyDown={NumbersOnly}
              />
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="BtnSave"
            variant="primary"
            size="sm"
            type="submit"
            onClick={saveProducer}
          >
            Guardar productor
          </Button>
          <Button
            className="BtnClose"
            variant="secondary"
            size="sm"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default addProducerModal;
