import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getWarehouseById, updateWarehouse } from '../../../../services/warehouseService';
import { QueryClient, useMutation } from 'react-query';
import { NavLink } from 'react-router-dom';
import { Form, Button, Col, Row } from 'react-bootstrap';

const editWarehouse = () => {
  const warehouseParams = useParams();
  console.log("warehouseParams =" + warehouseParams)

  const queryClient = new QueryClient();

  const [warehouseRequest, setWarehouse] = useState(null);
  const [validated, setValidated] = useState(false);


  useEffect(() => {
    getWarehouseById(warehouseParams.idWarehouse, setWarehouse);
  }, []);

  console.log("warehouseParams = " + warehouseParams + ", warehouseParams.idWarehouse = " + warehouseParams.idWarehouse)

  // const mutation = useMutation('warehouse', updateWarehouse, {
  //   onSettled: () => queryClient.invalidateQueries('warehouse'),
  //   mutationKey: 'warehouse',
  //   onSuccess: () => history.back(),
  // });

  const mutation = useMutation('warehouse', updateWarehouse, {
    onSettled: () => queryClient.invalidateQueries('warehouse'),
    mutationKey: 'warehouse',
    onSuccess: () => {
        swal({
            title: 'Editado!',
            text: 'Se edito la bodega',
            icon: 'success',
        });
        setTimeout(() => {
            history.back();
        }, 2000);
    },
});

  const code = useRef();
  const description = useRef();
  const address = useRef();
  const state = useRef();

  const saveEdit = (event) => {
    const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setValidated(true);
        }
        if (form.checkValidity() === true) {

    let editWarehouse = {
      id: warehouseParams.idWarehouse,
      code: code.current.value,
      description: description.current.value,
      address: address.current.value,
      state: state.current.value,
    };
    mutation.mutateAsync(editWarehouse);
    //limpiarInput();
  }};

  const limpiarInput = () => {
    code.current.value = '';
    description.current.value = '';
    address.current.value = '';
    state.current.value = '';
  };

  return (
    <>
      {warehouseRequest != null ? (
        <>
          <div className='editContainer'>
            <div>
              <h3 className='mb-4' style={{ fontSize: '24px' }}>Editar Bodega</h3>
            </div>
            <Form validated={validated} onSubmit={saveEdit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId='code' className='mb-4'>
                    <Form.Label className='mb-2'>Código:</Form.Label>
                    <Form.Control required type='text' defaultValue={warehouseRequest.code} ref={code} style={{ fontSize: '18px' }} />
                  </Form.Group>

                  <Form.Group controlId='description' className='mb-4'>
                    <Form.Label className='mb-2'>Descripción:</Form.Label>
                    <Form.Control required type='text' defaultValue={warehouseRequest.description} ref={description} style={{ fontSize: '18px' }} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId='address' className='mb-4'>
                    <Form.Label className='mb-2'>Dirección:</Form.Label>
                    <Form.Control required type='text' defaultValue={warehouseRequest.address} ref={address} style={{ fontSize: '18px' }} />
                  </Form.Group>

                  <Form.Group controlId='state' className='mb-4'>
                    <Form.Label className='mb-2'>Estado:</Form.Label>
                    <Form.Control as='select' defaultValue={warehouseRequest.state} ref={state} style={{ fontSize: '18px' }}>
                      <option value='true'>Activo</option>
                      <option value='false'>Inactivo</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Button variant='primary' type='submit' style={{ marginTop: '20px', fontSize: '18px' }}>
                Guardar Cambios
              </Button>
              <NavLink to={'/listWarehouse'} className='btn btn-secondary ml-2' style={{ marginTop: '20px', fontSize: '18px' }}>
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

export default editWarehouse;
