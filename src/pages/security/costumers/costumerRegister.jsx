import React, { useRef, useState } from 'react'
import { Form, Row, Col, Button, Container, InputGroup, Collapse } from 'react-bootstrap'
import { QueryClient } from 'react-query'
import { createuser } from '../../../services/userService'
import { createCostumer,checkCedula } from '../../../services/costumerService'
import { createContactCostumer } from '../../../services/CostumerContactService'
import '../costumers/register.css'
import { useMutation } from 'react-query'
import { provinces } from '../../../utils/provinces'
import swal from 'sweetalert'
import emailjs from 'emailjs-com'
import { format } from 'date-fns';


import { locations } from '../../../utils/provinces'
import Select from 'react-select'
const costumerRegister = () => {
    const queryClient = new QueryClient();
    const [validated, setValidated] = useState(false);

    const cedulaJuridica = useRef();
    const name = useRef();
    const province = useRef();
    const canton = useRef();
    const district = useRef();
    const address = useRef();
    const postalCode = useRef();
    const bankAccount = useRef();
    const email = useRef();
    const userName = useRef();
    const password = useRef();

    const addUserMutation = useMutation('users', createuser,
        {
            onSettled: () => queryClient.invalidateQueries('users'),
            mutationKey: 'users',
            onSuccess: () => console.log("User created"),
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

                const currentDate = new Date();
                const formattedDate = format(currentDate, 'yyyy-MM-dd');

                emailjs.send('service_segj454', 'template_0w3fvg4', 
                {name: name.current.value,
                 cedulaJuridica: cedulaJuridica.current.value,
                 date: formattedDate}
                , 'VLTRXG-aDYJG_QYt-')

            },
            onError: () => {
                console.log("Error creating the costumer")

            }
        })

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            console.log(event);
        } else if (form.checkValidity() === true) {

            let newCostumerUser = {
                email: email.current.value,
                userName: userName.current.value,
                password: password.current.value,
                idRole: 2
            }

            const check = await checkCedula(cedulaJuridica.current.value)
            
            if (check == false) {

                const createdUser = await addUserMutation.mutateAsync(newCostumerUser)
                let newCostumer = {
                    cedulaJuridica: cedulaJuridica.current.value,
                    name: name.current.value,
                    province: selectedProvincia.label,
                    canton: selectedCanton.label,
                    district: selectedDistrito.label,
                    address: address.current.value,
                    postalCode: postalCode.current.value,
                    bankAccount: bankAccount.current.value,
                    verified: false,
                    userId: createdUser.id
                }
                await addCostumerMutation.mutateAsync(newCostumer); 
            }else{
                swal("Cedula se encuentra registrada","Ya existe un usuario con la cedula ingresada","warning")
            }
        }
    };

    const [selectedProvincia,setSelectedProvincia] = useState();
    const [selectedCanton,setSelectedCanton] = useState()
    const [selectedDistrito,setSelectedDistrito] = useState(); 

    const provinciasArray = Object.keys(locations.provincias).map((index) => {
        
        const indexNumber = parseInt(index, 10);
        
        return {
          value: indexNumber,
          label: locations.provincias[index].nombre
        };
      });
    
   
    const [cantonesOptions,setCantonesOptions] = useState();
    let cantones = []
    const handleProvinciasSelectChange = (provinceIndex) => {
       
        let cantones = locations.provincias[provinceIndex].cantones
        
        const cantonesOptions = Object.keys(cantones).map((index) => {           
            const indexNumber = parseInt(index, 10);
            
            return {
              value: indexNumber,
              label: cantones[index].nombre
            };
          });
        
        setCantonesOptions(cantonesOptions)
    }  

    const [distritosOptions,setDistritosOptions] = useState();
    let distritos = []
    

    const handlecantonesSelectChange = (cantonIndex) => {
        console.log(cantonIndex)
        let distritos = locations.provincias[selectedProvincia.value].cantones[cantonIndex].distritos
        console.log(selectedProvincia.value)
        const distritosOpt = Object.keys(distritos).map((index) => {           
            const indexNumber = parseInt(index, 10);
            
            return {
              value: indexNumber,
              label: distritos[index].toString()
            };
          });
        console.log(distritosOpt)
        setDistritosOptions(distritosOpt)
    }      

    const verEleccion = ()=>{
        console.log(selectedProvincia)
        console.log(selectedCanton)
        console.log(selectedDistrito)

    }

    return (
        <>
            <Container className='registerContainer'>
                <Row>
                    <h2 className='h3register'>Registro</h2>
                </Row>
                <Row>
                    <h3>Información general</h3>
                </Row>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                            <Form.Label>Cédula jurídica</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                placeholder="Ingrese la cédula"
                                ref={cedulaJuridica}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Ingrese el nombre"
                                ref={name}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom03">
                            <Form.Label>Provincia</Form.Label>
                            <Select placeholder='Provincia' options={provinciasArray}
                                onChange={(selected)=>{handleProvinciasSelectChange(selected.value);setSelectedProvincia(selected);}}
                                on
                            ></Select>
                            <Form.Control.Feedback type="invalid">
                                Ingrese su provincia
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustom04">
                            <Form.Label>Canton</Form.Label>
                            <Select placeholder='Canton' options={cantonesOptions}
                                onChange={(selected)=>{setSelectedCanton(selected);handlecantonesSelectChange(selected.value);}}
                            ></Select>
                            <Form.Control.Feedback type="invalid">
                                Por favor indique el canton
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustom05">
                            <Form.Label>Distrito</Form.Label>
                            <Select placeholder='Distrito' options={distritosOptions}
                                onChange={(selected)=>setSelectedDistrito(selected)}
                            ></Select>
                            <Form.Control.Feedback type="invalid">
                                Indique su distrito!.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} md="4" controlId="validationCustom06">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" placeholder="Indique la dirección" ref={address} />
                            <Form.Control.Feedback type="invalid">
                                Indique su dirección
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="3" controlId="validationCustom07">
                            <Form.Label>Código postal</Form.Label>
                            <Form.Control type="number" placeholder="Ingrese el código postal" required ref={postalCode} />
                            <Form.Control.Feedback type="invalid">
                                Indique su código postal
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="5" controlId="validationCustom08">
                            <Form.Label>Cuenta bancaria</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese una cuenta bancaria" required ref={bankAccount} />
                            <Form.Control.Feedback type="invalid">
                                Indique su código postal
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col>
                            <h3>Información de usuario</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="validationCustom09">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su correo" required ref={email} />
                                <Form.Control.Feedback type="invalid">
                                    Indique su correo
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="validationCustom10">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese nombre de usuario" required ref={userName} />
                                <Form.Control.Feedback type="invalid">
                                    Indique su usuario
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control placeholder="Ingrese la contraseña" ref={password} type='password' required />
                        </Col>

                    </Row>
                </Form>
                <Row className='justify-content-md-center'>
                    <Col >
                        <Button onClick={handleSubmit}>Enviar</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default costumerRegister