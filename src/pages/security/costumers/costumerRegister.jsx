import React, { useRef, useState } from 'react'
import { Form, Row, Col, Button, Container, Card, InputGroup, Spinner } from 'react-bootstrap'
import { QueryClient } from 'react-query'
import { useNavigate } from "react-router-dom";
import { createuser } from '../../../services/userService'
import { createCostumer, checkCedula } from '../../../services/costumerService'
import { LettersOnly, NumbersOnly } from '../../../utils/validateFields'
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
  const [isLoadingPost, setIsLoading] = useState(false)

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

    let cedulaJuridicaWithNoSign = cedulaJuridica.current.value
    console.log(cedulaJuridicaWithNoSign.replace(/[-]/g,''))

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setValidated(true);

      

      const cedulaAvailability = await checkCedula(cedulaJuridica.current.value.replace(/[-]/g,''));
      const costumerEmailAvailability = await checkEmailAvailability(costumerEmail.current.value);
      const validCedulaFormat = checkCedulaFormat(cedulaJuridica.current.value)
      const validateFormFormat = checkPhoneFormat(phone.current.value)


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
        if (!validateFormFormat) {
          swal("Formato de teléfono inválido", "El número de teléfono debe poseeer 8 dígitos", "warning");
        }
      }
    }
  };


  const handleUserRegistrationSubmit = async (event) => {
    setIsLoading(true)

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
      setIsLoading(false)
      let newCostumer = {
        cedulaJuridica: cedulaJuridica.current.value.replace(/[-]/g,''),
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
      await addCostumerMutation.mutateAsync(newCostumer).then(()=>setIsLoading(false));

    } else {
      if (emailAvailability == false) {
        swal("Correo se encuentra registrado", "Ya existe un usuario con el correo ingresado", "warning")
        setIsLoading(false)
      }
      if (validPasswordFormat == false) {
        swal('Contraseña inválida!', 'La contraseña deseada, no es válida, debe contener mínimo 8 carácteres de longitud.', 'warning')
        setIsLoading(false)
      }
      if (password.current.value != confirmPassword.current.value) {
        swal('Contraseña inválida!', 'Las contraseñas ingresadas no coinciden', 'warning')
        setIsLoading(false)
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
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-primary shadow">
              <Card.Body className="p-4">
                <h3 className="text-center mb-4">Registro de Empresa</h3>

                <Form noValidate validated={validated} onSubmit={validation}>
                  <div className="mb-4">
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Cédula jurídica: Ej: X-XXX-XXXXXX
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          required
                          type="text"
                          min={1}
                          placeholder="Ingrese la cédula "
                          ref={cedulaJuridica}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique la cédula
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <hr className="my-4" />

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Nombre de la organización
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          required
                          type="text"
                          placeholder="Ingrese el nombre de la organización"
                          ref={name}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique la organización
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </div>

                  <hr className="my-4" />

                  <h4 className="text-center mb-4">Ubicación</h4>

                  <div className="mb-4">
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Provincia
                      </Form.Label>
                      <Col sm="8">
                        <Select
                          required
                          placeholder="Provincia"
                          options={provinciasArray}
                          onChange={(selected) => {
                            handleProvinciasSelectChange(selected.value);
                            setSelectedProvincia(selected);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique la provincia
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Cantón
                      </Form.Label>
                      <Col sm="8">
                        <Select
                          required
                          placeholder="Cantón"
                          options={cantonesOptions}
                          onChange={(selected) => {
                            setSelectedCanton(selected);
                            handlecantonesSelectChange(selected.value);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique el cantón
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Distrito
                      </Form.Label>
                      <Col sm="8">
                        <Select
                          required
                          placeholder="Distrito"
                          options={distritosOptions}
                          onChange={(selected) => setSelectedDistrito(selected)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique el distrito
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </div>

                  <hr className="my-4" />

                  <h4 className="text-center mb-4">Dirección y Contacto</h4>

                  <div className="mb-4">
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Dirección
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          required
                          type="text"
                          placeholder="Indique la dirección"
                          ref={address}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique su dirección
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Código postal
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="number"
                          min={1}
                          placeholder="Ingrese el código postal"
                          required
                          ref={postalCode}
                          onKeyDown={NumbersOnly}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique su código postal
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Teléfono corporativo
                      </Form.Label>
                      <Col sm="8">
                        <InputGroup>
                          <InputGroup.Text>+506</InputGroup.Text>
                          <Form.Control
                            required
                            type="number"
                            min={1}
                            placeholder="Ingrese su teléfono corporativo"
                            ref={phone}
                            maxLength="8"
                            onKeyDown={NumbersOnly}
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor indique su teléfono corporativo
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Correo corporativo
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          required
                          type="email"
                          placeholder="Ingrese su correo corporativo"
                          ref={costumerEmail}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique su correo corporativo
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </div>

                  <hr className="my-4" />

                  <h4 className="text-center mb-4">Registro de Usuario</h4>

                  <div className="mb-4">
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Correo de usuario
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="email"
                          placeholder="Ingrese su correo"
                          required
                          ref={email}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique su correo de usuario
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Usuario
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="text"
                          placeholder="Ingrese nombre de usuario"
                          required
                          ref={userName}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor indique su nombre de usuario
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Contraseña
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          placeholder="Ingrese la contraseña"
                          ref={password}
                          type="password"
                          required
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="text-end">
                        Confirmar contraseña
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          placeholder="Confirme la contraseña"
                          ref={confirmPassword}
                          type="password"
                          required
                        />
                      </Col>
                    </Form.Group>
                  </div>

                  <div className="text-center">
                    <Button className="BtnStar" onClick={validation} disabled={isLoadingPost}>
                      {
                        isLoadingPost?(<Spinner size='sm'/>):(null)
                      }
                      
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
