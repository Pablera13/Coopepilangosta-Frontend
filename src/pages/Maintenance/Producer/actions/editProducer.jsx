import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getProducerById, updateProducer } from '../../../../services/producerService';
import { QueryClient, useMutation } from 'react-query';
import { NavLink } from 'react-router-dom';
import { Form, Button, Col, Row } from 'react-bootstrap';
import swal from 'sweetalert';


const editProducer = () => {
  const producer = useParams();
  const queryClient = new QueryClient();

  const [producerRequest, setProducer] = useState(null);
  const [validated, setValidated] = useState(false);


  useEffect(() => {
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
      }, 2000);
    },
  });

  const cedula = useRef();
  const name = useRef();
  const lastname1 = useRef();
  const lastname2 = useRef();
  const phoneNumber = useRef();
  const email = useRef();
  const province = useRef();
  const canton = useRef();
  const district = useRef();
  const address = useRef();
  const bankAccount = useRef();

  const update = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setValidated(true);
    }
    if (form.checkValidity() === true) {

      let editProducer = {
        id: producer.producer,
        cedula: cedula.current.value,
        name: name.current.value,
        lastname1: lastname1.current.value,
        lastname2: lastname2.current.value,
        phoneNumber: phoneNumber.current.value,
        email: email.current.value,
        province: province.current.value,
        canton: canton.current.value,
        district: district.current.value,
        address: address.current.value,
        bankAccount: bankAccount.current.value,
      };
      mutation.mutateAsync(editProducer);
      //limpiarInput();
    }
  };

  const limpiarInput = () => {
    cedula.current.value = '';
    name.current.value = '';
    lastname1.current.value = '';
    lastname2.current.value = '';
    phoneNumber.current.value = '';
    email.current.value = '';
    province.current.value = '';
    canton.current.value = '';
    district.current.value = '';
    address.current.value = '';
    bankAccount.current.value = '';
  };

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
                  <Form.Group controlId='province' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Provincia:</Form.Label>
                    <Form.Control required type='text' defaultValue={producerRequest.province} ref={province} style={{ fontSize: '14px', height: '30px' }} />
                  </Form.Group>

                  <Form.Group controlId='canton' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Cantón:</Form.Label>
                    <Form.Control required type='text' defaultValue={producerRequest.canton} ref={canton} style={{ fontSize: '14px', height: '30px' }} />
                  </Form.Group>

                  <Form.Group controlId='district' style={{ marginBottom: '20px' }}>
                    <Form.Label className='mb-2'>Distrito:</Form.Label>
                    <Form.Control required type='text' defaultValue={producerRequest.district} ref={district} style={{ fontSize: '14px', height: '30px' }} />
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
