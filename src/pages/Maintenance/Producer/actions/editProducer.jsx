import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getProducerById, updateProducer } from '../../../../services/producerService';
import { QueryClient, useMutation } from 'react-query';
import { NavLink } from 'react-router-dom';
import { Form, Button, Col, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import Select from 'react-select';
import { locations } from '../../../../utils/provinces';

const editProducer = () => {
  const producer = useParams();
  const queryClient = new QueryClient();

  const [producerRequest, setProducer] = useState(null);
  const [validated, setValidated] = useState(false);


  useEffect( () => {
    getProducerById(producer.producer, setProducer);
    
  }, []);

  const mutation = useMutation('producer', updateProducer, {
    onSettled: () => queryClient.invalidateQueries('producer'),
    mutationKey: 'producer',
    onSuccess: () => {
      swal({
        title: 'Editado!',
        text: 'Se edito el productor',
        icon: 'success',
      });
      setTimeout(() => {
        history.back();
        window.location.reload()
      }, 2000);
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

  const update = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setValidated(true);
    }
    if (form.checkValidity() === true)  {
      event.preventDefault();
      let editProducer = {
        id: producer.producer,
        cedula: cedula.current.value,
        name: name.current.value,
        lastname1: lastname1.current.value,
        lastname2: lastname2.current.value,
        phoneNumber: phoneNumber.current.value,
        email: email.current.value,
        province: selectedProvincia !=null?(selectedProvincia.label):(producerRequest.province),
        canton: selectedCanton?(selectedCanton.label):(producerRequest.canton),
        district: selectedDistrito?(selectedDistrito.label):(producerRequest.district),
        address: address.current.value,
        bankAccount: bankAccount.current.value,
      };
      mutation.mutateAsync(editProducer);
    }
  };



  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedCanton, setSelectedCanton] = useState(null)
  const [selectedDistrito, setSelectedDistrito] = useState(null);


  const provinciasArray = Object.keys(locations.provincias).map((index) => {

    const indexNumber = parseInt(index, 10);

    return {
      value: indexNumber,
      label: locations.provincias[index].nombre
    };
  });

  const [cantonesOptions, setCantonesOptions] = useState();
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

  const [distritosOptions, setDistritosOptions] = useState();
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

  return (
    <>
      {producerRequest != null ? (
        <>
          <div className='container mt-4'>
            <h3 className='mb-3' style={{ marginBottom: '20px' }}>Editar Productor</h3>
            <Form validated={validated} onSubmit={update}>
              <Row style={{ marginBottom: '20px' }}>
                <Col md={4}>
                  <Form.Group controlId='cedula' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Cédula:</Form.Label>
                    <Form.Control required type='number' defaultValue={producerRequest.cedula} ref={cedula} style={{ fontSize: '14px', height: '30px' }} />
                  </Form.Group>

                  <Form.Group controlId='name' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Nombre:</Form.Label>
                    <Form.Control required type='text' defaultValue={producerRequest.name} ref={name} style={{ fontSize: '14px', height: '30px' }} />
                  </Form.Group>

                  <Form.Group controlId='lastname1' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Primer Apellido:</Form.Label>
                    <Form.Control required type='text' defaultValue={producerRequest.lastname1} ref={lastname1} style={{ fontSize: '14px', height: '30px' }} />
                  </Form.Group>

                  <Form.Group controlId='lastname2' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Segundo Apellido:</Form.Label>
                    <Form.Control required type='text' defaultValue={producerRequest.lastname2} ref={lastname2} style={{ fontSize: '14px', height: '30px' }} />
                  </Form.Group>

                  <Form.Group controlId='phoneNumber' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Teléfono:</Form.Label>
                    <Form.Control required type='number' defaultValue={producerRequest.phoneNumber} ref={phoneNumber} style={{ fontSize: '14px', height: '30px' }} />
                  </Form.Group>

                  <Form.Group controlId='email' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Email:</Form.Label>
                    <Form.Control required type='email' defaultValue={producerRequest.email} ref={email} style={{ fontSize: '14px', height: '30px' }} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group as={Col} md="4" lg="12" controlId="validationCustom03">
                    <Form.Label>Provincia</Form.Label>
                    <Select placeholder={producerRequest.province} options={provinciasArray} 
                      onChange={(selected) => { handleProvinciasSelectChange(selected.value); setSelectedProvincia(selected); }}
                      on
                    ></Select>
                    <Form.Control.Feedback type="invalid">
                      Ingrese su provincia
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" lg="12" controlId="validationCustom04">
                    <Form.Label>Canton</Form.Label>
                    <Select placeholder={producerRequest.canton} options={cantonesOptions}
                      onChange={(selected) => { setSelectedCanton(selected); handlecantonesSelectChange(selected.value); }}
                    ></Select>
                    <Form.Control.Feedback type="invalid">
                      Por favor indique el canton
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" lg="12" controlId="validationCustom05">
                    <Form.Label>Distrito</Form.Label>
                    <Select placeholder={producerRequest.district} options={distritosOptions}
                      onChange={(selected) => setSelectedDistrito(selected)}
                    ></Select>
                    <Form.Control.Feedback type="invalid">
                      Indique su distrito!.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId='address' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Dirección:</Form.Label>
                    <Form.Control required as='textarea' rows={3} defaultValue={producerRequest.address} ref={address} style={{ fontSize: '14px' }} />
                  </Form.Group>

                  <Form.Group controlId='bankAccount' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Cuenta Bancaria:</Form.Label>
                    <Form.Control required type='text' defaultValue={producerRequest.bankAccount} ref={bankAccount} style={{ fontSize: '14px', height: '30px' }} />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant='primary' type='submit' style={{ marginTop: '20px' }}>
                Enviar Cambios
              </Button>
              <NavLink to={'/listProducers'} className='btn btn-secondary ml-2' style={{ marginTop: '20px' }}>
                Cancelar
              </NavLink>
            </Form>
          </div>
        </>
      ) : (
        'Espere'
      )}
    </>
  );
};

export default editProducer;
