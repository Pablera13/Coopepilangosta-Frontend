import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoryById, updateCategory } from '../../../../services/categoryService';
import { QueryClient, useMutation } from 'react-query';
import { NavLink } from 'react-router-dom';
import { Form, Button, Col, Row } from 'react-bootstrap';

const editCategory = () => {
  const categoryIdParams = useParams();
  const queryClient = new QueryClient();

  const [categoryRequest, setCategory] = useState(null);

  const [validated, setValidated] = useState(false);


  useEffect(() => {
    getCategoryById(categoryIdParams.idCategory, setCategory);
  }, []);

  // const mutation = useMutation('category', updateCategory, {
  //   onSettled: () => queryClient.invalidateQueries('category'),
  //   mutationKey: 'category',
  //   onSuccess: () => history.back(),
  // });

  const mutation = useMutation('category', updateCategory, {
    onSettled: () => queryClient.invalidateQueries('category'),
    mutationKey: 'category',
    onSuccess: () => {
        swal({
            title: 'Editado!',
            text: 'Se edito la categoría',
            icon: 'success',
        });
        setTimeout(() => {
            history.back();
        }, 2000);
    },
});

  const name = useRef();

  const saveEdit = (event) => {
    const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setValidated(true);
        }
        if (form.checkValidity() === true) {

    let editCategory = {
      id: categoryIdParams.idCategory,
      name: name.current.value,
    };
    mutation.mutateAsync(editCategory);
    //limpiarInput();
  }};

  const limpiarInput = () => {
    name.current.value = '';
  };

  return (
    <>
      {categoryRequest != null ? (
        <>
          <div className='container mt-4'>
            <h3 className='mb-4' style={{ fontSize: '18px' }}>
              Editar
            </h3>
            <Form validated={validated} onSubmit={saveEdit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId='name' className='mb-2'>
                    <Form.Label style={{ fontSize: '16px' }}>Nombre de la categoría:</Form.Label>
                    <Form.Control required type='text' defaultValue={categoryRequest.name} ref={name} style={{ fontSize: '16px' }} />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant='primary' type='submit' style={{ fontSize: '16px', marginTop: '20px' }}>
                Guardar Cambios
              </Button>
              <NavLink to={'/listCategories'} className='btn btn-secondary ml-2' style={{ fontSize: '16px', marginTop: '20px' }}>
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

export default editCategory;
