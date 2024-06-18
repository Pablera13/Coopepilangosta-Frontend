import React, { useRef, useState } from 'react'
import { Form, Row, Col, Button, Container, Card, InputGroup } from 'react-bootstrap'
import { QueryClient } from 'react-query'
import { useNavigate } from "react-router-dom";
import { createuser } from '../../../services/userService'
import { createCostumer, checkCedula } from '../../../services/costumerService'
import { useMutation } from 'react-query'
import swal from 'sweetalert'
import emailjs from 'emailjs-com'
import { format } from 'date-fns';
import { checkEmailAvailability } from '../../../services/userService'

import { locations } from '../../../utils/provinces'
import Select from 'react-select'
import { checkPasswordFormat } from '../../../utils/validatePasswordFormat'
import { checkCedulaFormat } from '../../../utils/validateCedulaFormatOrganization';
import { checkPhoneFormat } from '../../../utils/validatePhone';

const costumerRegister = () => {
  const queryClient = new QueryClient();
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const cedulaJuridica = useRef();
  const name = useRef();;
  const address = useRef();
  const postalCode = useRef();
  const email = useRef();
  const userName = useRef();
  const phone = useRef();
  const costumerEmail = useRef();
  const confirmPassword = useRef();
  const password = useRef();

  const addUserMutation = useMutation('users', createuser,
    {
      onSettled: () => queryClient.invalidateQueries('users'),
      mutationKey: 'users',
      onError: () => {
        swal({
          title: 'Error!',
          text: 'Ocurrió un error al guardar el usuario',
          icon: 'error',
        });
      }
    })

  const addCostumerMutation = useMutation('costumer', createCostumer, {

    onSettled: () => queryClient.invalidateQueries('costumer'),
    mutationKey: 'costumer',
    onSuccess: () => {

      swal({
        title: 'Guardado!',
        text: 'Se creó el usuario',
        icon: 'success',
      });

      setTimeout(() => {
        navigate(`/login`);
      }, 2000);

      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd');

      emailjs.send('service_segj454', 'template_0w3fvg4',
        {
          name: name.current.value,
          cedulaJuridica: cedulaJuridica.current.value,
          date: formattedDate
        }, 'VLTRXG-aDYJG_QYt-')
    },
    onError: () => {
      console.log("Error creating the costumer")
    }
  })

  const validation = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setValidated(true);

      const cedulaAvailability = await checkCedula(cedulaJuridica.current.value);
      const costumerEmailAvailability = await checkEmailAvailability(costumerEmail.current.value);
      const validCedulaFormat = checkCedulaFormat(cedulaJuridica.current.value)
      const checkPhoneFormat = checkPhoneFormat(phone.current.value)


      if (cedulaAvailability && costumerEmailAvailability && validCedulaFormat) {
        if (
          cedulaJuridica.current.value &&
          name.current.value &&
          selectedProvincia &&
          selectedCanton &&
          selectedDistrito &&
          address.current.value &&
          postalCode.current.value &&
          costumerEmail.current.value &&
          phone.current.value &&
          email.current.value &&
          userName.current.value &&
          confirmPassword.current.value &&
          password.current.value
        ) {

          handleUserRegistrationSubmit()

        } else {
          swal("Error", "Por favor, complete todos los campos obligatorios", "error");
        }

      } else {
        if (!cedulaAvailability) {
          swal("Cédula se encuentra registrada", "Ya existe un usuario con la cédula ingresada", "warning");
        }
        if (!costumerEmailAvailability) {
          swal("Correo se encuentra registrado", "Ya existe un usuario con este correo ingresado", "warning");
        }

        if (!validCedulaFormat) {
          swal("Formato de cédula jurídica inválido", "La cédula ingresada no se encuentra en el formato x-xxx-xxxxxx", "warning");
        }
        if (!checkPhoneFormat) {
          swal("Formato de teléfono inválido", "El número de teléfono debe poseeer 8 dígitos", "warning");
        }
      }
    }
  };


  const handleUserRegistrationSubmit = async (event) => {

    let newCostumerUser = {
      email: email.current.value,
      userName: userName.current.value,
      password: password.current.value,
      idRole: 2
    }

    const emailAvailability = await checkEmailAvailability(email.current.value).then(data => data)
    const validPasswordFormat = checkPasswordFormat(password.current.value)

    if (emailAvailability == true && validPasswordFormat == true &&
      password.current.value == confirmPassword.current.value

    ) {
      const createdUser = await addUserMutation.mutateAsync(newCostumerUser)
      let newCostumer = {
        cedulaJuridica: cedulaJuridica.current.value,
        name: name.current.value,
        province: selectedProvincia.label,
        canton: selectedCanton.label,
        district: selectedDistrito.label,
        address: address.current.value,
        postalCode: postalCode.current.value,
        bankAccount: 0,
        verified: false,
        email: costumerEmail.current.value,
        phoneNumber: phone.current.value,
        userId: createdUser.id
      }

      console.log(newCostumer)
      await addCostumerMutation.mutateAsync(newCostumer);

    } else {
      if (emailAvailability == false) {
        swal("Correo se encuentra registrado", "Ya existe un usuario con el correo ingresado", "warning")
      }
      if (validPasswordFormat == false) {
        swal('Contraseña inválida!', 'La contraseña deseada, no es válida, debe contener mínimo 8 carácteres de longitud.', 'warning')
      }
      if (password.current.value != confirmPassword.current.value) {
        swal('Contraseña inválida!', 'Las contraseñas ingresadas no coinciden', 'warning')
      }
    }
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
      <Container>
        <Row className="justify-content-center Josefin">
          <Col md={6}>

            <Card>
              <Card.Body className="cardContainerRegister Josefin">
                <h3>Registro de Empresa</h3>
                <br></br>
                <Form noValidate validated={validated} onSubmit={validation}>
                  <Row className="mb-3 p-2">
                    <Col xs={6} md={4} lg={6}>
                      <Form.Group md="4" controlId="validationCustom01">
                        <Form.Label>Cédula jurídica</Form.Label>
                        <Form.Control
                          required
                          type="number"
                          min={1}
                          placeholder="Ingrese la cédula"
                          ref={cedulaJuridica}
                        />
                        <Form.Control.Feedback type="invalid">Por favor indique la cédula</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={6} md={4} lg={6}>

                      <Form.Group md="4" controlId="validationCustom02">
                        <Form.Label >Nombre de la organización</Form.Label>
                        <Form.Control
                          required
                          type="string"
                          placeholder="Ingrese el nombre de la organización"
                          ref={name}
                        />
                        <Form.Control.Feedback type="invalid">Por favor indique la organización</Form.Control.Feedback>
                      </Form.Group>
                    </Col>


                  </Row>
                  <Row className="mb-3 p-2">
                    <Col xs={4} md={4} lg={4}>
                      <Form.Group controlId="validationCustom03">
                        <Form.Label ><Form.Label>Provincia</Form.Label></Form.Label>

                        <Select required
                          placeholder='Provincia' options={provinciasArray}
                          onChange={(selected) => { handleProvinciasSelectChange(selected.value); setSelectedProvincia(selected); }}

                        ></Select>
                        <Form.Control.Feedback type="invalid">Por favor indique la provincia</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={4} md={4} lg={4}>
                      <Form.Group controlId="validationCustom04">
                        <Form.Label><Form.Label>Cantón</Form.Label></Form.Label>
                        <Select required
                          placeholder='Canton' options={cantonesOptions}
                          onChange={(selected) => { setSelectedCanton(selected); handlecantonesSelectChange(selected.value); }}
                        ></Select>
                        <Form.Control.Feedback type="invalid">
                          Por favor indique el cantón
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={4} md={4} lg={4}>
                      <Form.Group controlId="validationCustom05">
                        <Form.Label><Form.Label>Distrito</Form.Label></Form.Label>
                        <Select required
                          placeholder='Distrito' options={distritosOptions}
                          onChange={(selected) => setSelectedDistrito(selected)}
                        ></Select>
                        <Form.Control.Feedback type="invalid">
                          Por favor indique el distrito
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className='p-2'>
                    <Col xs={8} md={8} lg={8}>
                      <Form.Group md="4" controlId="validationCustom06">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control required type="text" placeholder="Indique la dirección" ref={address} />
                        <Form.Control.Feedback type="invalid">Por favor indique su dirección</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col xs={4} md={4} lg={4}>
                      <Form.Group controlId="validationCustom07">
                        <Form.Label>Código postal</Form.Label>
                        <Form.Control type="number" min={1} placeholder="Ingrese el código postal" required ref={postalCode} />
                        <Form.Control.Feedback type="invalid">Por favor indique su código postal</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className='p-2'>


                    <Col xs={6} md={6} lg={6}>
                      <Form.Group md="4" controlId="validationCustom08">
                        <Form.Label>Teléfono corporativo</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>+506</InputGroup.Text>
                          <Form.Control
                            required
                            type="number"
                            min={1}
                            placeholder="Ingrese su teléfono corporativo"
                            ref={phone}
                            maxLength="8"
                          />
                          <Form.Control.Feedback type="invalid">Por favor indique su teléfono corporativo</Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>



                    <Col xs={6} md={6} lg={6}>
                      <Form.Group controlId="validationCustom09">
                        <Form.Label>Correo corporativo</Form.Label>
                        <Form.Control required type="email" placeholder="Ingrese su correo corporativo" ref={costumerEmail} />
                        <Form.Control.Feedback type="invalid">Por favor indique su correo corporativo</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>


                  <br></br>
                  <h3>Registro de Usuario</h3>
                  <br></br>


                  <Row className='p-2'>
                    <Col>
                      <Form.Group controlId="validationCustom09">
                        <Form.Label ><Form.Label>Correo de usuario</Form.Label></Form.Label>
                        <Form.Control type="email" placeholder="Ingrese su correo" required ref={email} />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique su correo de usuario
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="validationCustom10">
                        <Form.Label ><Form.Label>Usuario</Form.Label></Form.Label>
                        <Form.Control type="text" placeholder="Ingrese nombre de usuario" required ref={userName} />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique su nombre de usuario
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className='p-2'>
                    <Col>
                      <Form.Label ><Form.Label>Contraseña</Form.Label></Form.Label>

                      <Form.Control placeholder="Ingrese la contraseña" ref={password} type='password' required />
                    </Col>

                    <Col>
                      <Form.Label ><Form.Label>Confirmar contraseña</Form.Label></Form.Label>
                      <Form.Control placeholder="Confirme la contraseña" ref={confirmPassword} type='password' required />
                    </Col>

                  </Row>

                  <div className="justify-content-md-center">
                    <br></br>                      <br></br>

                    <Button className="BtnStar" onClick={validation}>
                      Registrarme
                    </Button>
                  </div>
                </Form>

              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </>
  );
};

export default costumerRegister;
