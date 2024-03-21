import React, { useRef, useState } from 'react'
import { Form, Row, Col, Button, Container, InputGroup, Collapse, Card } from 'react-bootstrap'
import { QueryClient } from 'react-query'
import { useNavigate } from "react-router-dom";

import { createuser } from '../../../services/userService'
import { createCostumer, checkCedula } from '../../../services/costumerService'
import { createContactCostumer } from '../../../services/CostumerContactService'
import '../costumers/register.css'
import { useMutation } from 'react-query'
import { provinces } from '../../../utils/provinces'
import swal from 'sweetalert'
import emailjs from 'emailjs-com'
import { format } from 'date-fns';
import { checkEmailAvailability } from '../../../services/userService'

import { locations } from '../../../utils/provinces'
import Select from 'react-select'
import { checkPasswordFormat } from '../../../utils/validatePasswordFormat'

const costumerRegister = () => {
  const queryClient = new QueryClient();
  const [validated, setValidated] = useState(false);
  const [showUserRegistration, setShowUserRegistration] = useState(false);
  const [costumerData, setcostumerData] = useState(false);
  const navigate = useNavigate();

  const cedulaJuridica = useRef();
  const name = useRef();;
  const address = useRef();
  const postalCode = useRef();
  const bankAccount = useRef();
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

  const addCostumerMutation = useMutation('costumer', createCostumer,
    {
      onSettled: () => queryClient.invalidateQueries('costumer'),
      mutationKey: 'costumer',
      onSuccess: () => {
        swal({
          title: 'Guardado!',
          text: 'Se creo el usuario',
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
          }
          , 'VLTRXG-aDYJG_QYt-').then(history.back())
        
      },

      onError: () => {
        console.log("Error creating the costumer")

      }
    })
    const handleCompanyRegistrationSubmit = async (event) => {
      const form = event.currentTarget;
      event.preventDefault();
    
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        setValidated(true);
    
        const cedulaAvailability = await checkCedula(cedulaJuridica.current.value);
        const costumerEmailAvailability = await checkEmailAvailability(costumerEmail.current.value);
    
        if (cedulaAvailability && costumerEmailAvailability) {
          if (
            cedulaJuridica.current.value &&
            name.current.value &&
            selectedProvincia &&
            selectedCanton &&
            selectedDistrito &&
            address.current.value &&
            postalCode.current.value &&
            bankAccount.current.value &&
            costumerEmail.current.value &&
            phone.current.value
          ) {
            setShowUserRegistration(true);
    
            let CostumerRegistered = {
              cedulaJuridica: cedulaJuridica.current.value,
              name: name.current.value,
              province: selectedProvincia.label,
              canton: selectedCanton.label,
              district: selectedDistrito.label,
              address: address.current.value,
              postalCode: postalCode.current.value,
              bankAccount: bankAccount.current.value,
              verified: false,
              email: costumerEmail.current.value,
              phoneNumber: phone.current.value,
            };
    
            setcostumerData(CostumerRegistered);
          } else {
            swal("Error", "Por favor, complete todos los campos obligatorios", "error");
          }
        } else {
          if (!cedulaAvailability) {
            swal("Cedula se encuentra registrada", "Ya existe un usuario con la cedula ingresada", "warning");
          }
          if (!costumerEmailAvailability) {
            swal("Correo se encuentra registrada", "Ya existe un usuario con este correo ingresado", "warning");
          }
        }
      }
    };
    
    


  const handleUserRegistrationSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity()  === false ) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setValidated(true);
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
          cedulaJuridica: costumerData.cedulaJuridica,
          name: costumerData.name,
          province: costumerData.province,
          canton: costumerData.canton,
          district: costumerData.district,
          address: costumerData.address,
          postalCode: costumerData.postalCode,
          bankAccount: costumerData.bankAccount,
          verified: false,
          email: costumerData.email,
          phoneNumber: costumerData.phoneNumber,
          userId: createdUser.id
        }

        console.log(newCostumer)
        await addCostumerMutation.mutateAsync(newCostumer);

      } else {
        if (emailAvailability == false) {
          swal("Correo electronico se encuentra registrada", "Ya existe un usuario con el correo ingresado", "warning")
        }
        if (validPasswordFormat == false) {
          swal('Contraseña invalida!', 'La contraseña deseada, no es valida, debe contener minimo 8 caracteres de longitud.', 'warning')
        }
        if (password.current.value != confirmPassword.current.value) {
          swal('Contraseña invalida!', 'Las contraseñas ingresadas no coinciden', 'warning')
        }
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
      <div className="imagen-de-fondo"></div>
      <Container className="loginContainerRegister">

        {!showUserRegistration && (

          <Card>
            <Card.Body className="cardContainerRegister">
              <h3>Registro de Empresa</h3>
<br></br>
              <Form noValidate validated={validated} onSubmit={handleCompanyRegistrationSubmit}>
                <Row className="mb-3 p-2">
                <Col xs={4} md={4} lg={4}>
                    <Form.Group md="4" controlId="validationCustom01">
                      <Form.Label className="labelLogin">Cédula</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        min={1}
                        placeholder="Ingrese la cédula"
                        ref={cedulaJuridica}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={4} md={4} lg={4}>

                    <Form.Group md="4" controlId="validationCustom02">
                      <Form.Label className="labelLogin">Nombre</Form.Label>
                      <Form.Control
                        required
                        type="string"
                        placeholder="Ingrese el nombre"
                        ref={name}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col xs={4} md={4} lg={4}>
                    <Form.Group md="4" controlId="validationCustom01">
                      <Form.Label className="labelLogin">Correo</Form.Label>
                      <Form.Control
                        required
                        type="string"
                        placeholder="Ingrese su correo corporativo"
                        ref={costumerEmail}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3 p-2">
                <Col xs={4} md={4} lg={4}>
                    <Form.Group controlId="validationCustom03">
                      <Form.Label className="labelLogin"><Form.Label>Provincia</Form.Label></Form.Label>

                      <Select required
                        placeholder='Provincia' options={provinciasArray}
                        onChange={(selected) => { handleProvinciasSelectChange(selected.value); setSelectedProvincia(selected); }}

                      ></Select>
                      <Form.Control.Feedback type="invalid">
                        Ingrese su provincia
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={4} md={4} lg={4}>
                    <Form.Group controlId="validationCustom04">
                      <Form.Label className="labelLogin"><Form.Label>Cantón</Form.Label></Form.Label>
                      <Select required
                        placeholder='Canton' options={cantonesOptions}
                        onChange={(selected) => { setSelectedCanton(selected); handlecantonesSelectChange(selected.value); }}
                      ></Select>
                      <Form.Control.Feedback type="invalid">
                        Por favor indique el canton
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={4} md={4} lg={4}>
                    <Form.Group controlId="validationCustom05">
                      <Form.Label className="labelLogin"><Form.Label>Distrito</Form.Label></Form.Label>
                      <Select required
                        placeholder='Distrito' options={distritosOptions}
                        onChange={(selected) => setSelectedDistrito(selected)}
                      ></Select>
                      <Form.Control.Feedback type="invalid">
                        Indique su distrito!.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='p-2'>
                  <Col xs={6} md={6} lg={6}>

                    <Form.Group md="4" controlId="validationCustom06">
                      <Form.Label className="labelLogin"><Form.Label>Dirección</Form.Label></Form.Label>
                      <Form.Control required
                        type="text" placeholder="Indique la dirección" ref={address} />
                      <Form.Control.Feedback type="invalid">
                        Indique su dirección
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col xs={6} md={6} lg={6}>

                    <Form.Group controlId="validationCustom07">
                      <Form.Label className="labelLogin"><Form.Label>Código postal</Form.Label></Form.Label>

                      <Form.Control type="number" min={1}
                        placeholder="Ingrese el código postal" required ref={postalCode} />
                      <Form.Control.Feedback type="invalid">
                        Indique su código postal
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <br />

                <Row className='p-2'>
                <Col xs={6} md={6} lg={6}>
                    <Form.Group md="4" controlId="validationCustom02">
                      <Form.Label className="labelLogin"><Form.Label>Teléfono</Form.Label></Form.Label>
                      <Form.Control
                        required
                        type="number"
                        min={1}

                        placeholder="Ingrese su teléfono corporativo"
                        ref={phone}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col xs={6} md={6} lg={6}>
                    <Form.Group controlId="validationCustom08">
                      <Form.Label className="labelLogin"><Form.Label>Cuenta IBAN</Form.Label></Form.Label>
                      <Form.Control type="number" placeholder="Ingrese una cuenta bancaria" required ref={bankAccount} />
                      <Form.Control.Feedback type="invalid">
                        Indique su cuenta IBAN
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                </Row>
                <div className="justify-content-md-center">
                  <br></br>
                <Button className="BtnStar" onClick={handleCompanyRegistrationSubmit}>
                  Continuar
                </Button></div>
              </Form>

            </Card.Body>
          </Card>
        )}


        {showUserRegistration && (
          <Card>
            <Card.Body className="cardContainerRegister">
            <h3>Registro de Usuario</h3>
<br></br>

              <Form noValidate validated={validated} onSubmit={handleUserRegistrationSubmit}>
                  <Row className='p-2'>
                  <Col>
                    <Form.Group controlId="validationCustom09">
                      <Form.Label className="labelLogin"><Form.Label>Correo</Form.Label></Form.Label>
                      <Form.Control type="text" placeholder="Ingrese su correo" required ref={email} />
                      <Form.Control.Feedback type="invalid">
                        Indique su correo
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="validationCustom10">
                      <Form.Label className="labelLogin"><Form.Label>Usuario</Form.Label></Form.Label>
                      <Form.Control type="text" placeholder="Ingrese nombre de usuario" required ref={userName} />
                      <Form.Control.Feedback type="invalid">
                        Indique su usuario
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='p-2'>
                  <Col>
                    <Form.Label className="labelLogin"><Form.Label>Contraseña</Form.Label></Form.Label>

                    <Form.Control placeholder="Ingrese la contraseña" ref={password} type='password' required />
                  </Col>

                  <Col>
                    <Form.Label className="labelLogin"><Form.Label>Confirmar</Form.Label></Form.Label>
                    <Form.Control placeholder="Confirme la contraseña" ref={confirmPassword} type='password' required />
                  </Col>

                </Row>
                <div className="justify-content-md-center">
                <br></br>
                <Button className="BtnStar" onClick={handleUserRegistrationSubmit}
                >
                  Registrar Usuario
                </Button>
                </div>
               
              </Form>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default costumerRegister;
