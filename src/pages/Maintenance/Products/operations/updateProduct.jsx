import React, { useState, useEffect, useRef } from 'react';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getProductById, editProduct } from '../../../../services/productService';
import { NavLink } from 'react-router-dom';
import { Table, Button, Form } from 'react-bootstrap';
import { getCategories } from '../../../../services/categoryService';

const updateProduct = () => {
  const { product } = useParams();
  const queryClient = new QueryClient();
  
  const [productRequest, setProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const apiKey = 'c401b6d5b22b0888799f01ee6c69edca';

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    getProductById(product, (productData) => {
      const imagesArray = productData.image.split(',');
      productData.image = imagesArray;
      setProduct(productData);
    });
  }, [product]);

  const handleImageUpload = async (e) => {
    const imageInput = e.target.files[0];

    if (imageInput) {
      try {
        const formData = new FormData();
        formData.append('image', imageInput);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          const uploadedImageUrl = data.data.url;

          setNewImages((prevImages) => [...prevImages, uploadedImageUrl]);

          console.log('Url = ', uploadedImageUrl);
        } else {
          console.error('error al subir la imagen');
        }
      } catch (error) {
        console.error('error de solicitud', error);
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setProduct((prevProduct) => {
      const updatedProduct = { ...prevProduct };
      updatedProduct.image.splice(indexToRemove, 1);

      return updatedProduct;
    });
  };

  const { data, isLoading, isError } = useQuery('product', getCategories);

    const mutation = useMutation('product', editProduct, {
      onSettled: () => queryClient.invalidateQueries('product'),
      mutationKey: 'product',
    });
    


  const nameRef = useRef();
  const descriptionRef = useRef();
  const unit = useRef();
  const marginRef = useRef();
  const ivaRef = useRef();
  const stateRef = useRef();
  const categoryIdRef = useRef();

  const saveEdit = async (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setValidated(true);
    }
    if (form.checkValidity() === true) {
      
      const updatedImages = [...productRequest.image, ...newImages];
      const serializedImages = updatedImages.join(',');

      const editProductData = {
        id: productRequest.id,
        code: productRequest.code,
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        unit: unit.current.value,
        margin: marginRef.current.value,
        iva: ivaRef.current.value,
        state: stateRef.current.value,
        categoryId: categoryIdRef.current.value,
        image: serializedImages,
      };

        await mutation.mutateAsync(editProductData);

        swal({
          title: 'Agregado!',
          text: 'El producto se edito correctamente',
          icon: 'success',
        });
        setTimeout(() => {
          history.back(); 
        }, 2000);
    }

  };


  return (
    <>
      {productRequest != null ? (
        <>
          <div className='container mt-4'>
            <h3>Editar Producto</h3>
            <Form validated={validated} onSubmit={saveEdit}>
              <div className='row mb-4'>
                <div className='col-md-6 mb-3'>
                  <div className='form-group mb-4'>
                    <label htmlFor='name' className='mb-3'>Nombre:</label>
                    <input type='text' className='form-control' id='name' defaultValue={productRequest.name} ref={nameRef} required />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingrese un nombre.
                    </Form.Control.Feedback>
                  </div>
                  <div className='form-group mb-4'>
                    <label htmlFor='description' className='mb-3'>Descripción:</label>
                    <input
                      required
                      type='text'
                      className='form-control'
                      id='description'
                      defaultValue={productRequest.description}
                      ref={descriptionRef}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingrese una descripción.
                    </Form.Control.Feedback>
                  </div>

                  <div className='form-group mb-4'>
                    <label htmlFor='unit' className='mb-3'>Unidad:</label>

                    {/* <input 
                      required 
                      type='text' 
                      className='form-control' 
                      id='unit' 
                      defaultValue={productRequest.unit} 
                       /> */}
                       <br></br>
                       <div className="custom-select-container">
                                        <select className="custom-select" id="unitOptions" ref={unit}>
                                            <option value="Kilogramo">Kilogramo</option>
                                            <option value="Rollo">Rollo</option>
                                            <option value="Unidad">Unidad</option>
                                            <option value="Paquete 200g">Paquete 200g</option>
                                            <option value="Paquete 250g">Paquete 250g</option>
                                            <option value="Paquete 270g">Paquete 270g</option>
                                            <option value="Paquete 340g">Paquete 340g</option>
                                            <option value="Barra">Barra</option>
                                            <option value="Litro">Litro</option>
                                            <option value="Galon">Galón</option>
                                            <option value="Botella 750ml">Botella 750ml</option>
                                        </select>
                                    </div>
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingrese una unidad.
                    </Form.Control.Feedback>
                  </div>

                  <div className='form-group mb-4'>
                    <label htmlFor='categoryId' className='mb-3'>Categoría:</label>
                    <select
                      required
                      className='form-control'
                      id='categoryId'
                      ref={categoryIdRef}
                      defaultValue={productRequest.categoryId}
                    >
                      {data != null ? (
                        data.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option value=''>Espere</option>
                      )}
                    </select>
                    <Form.Control.Feedback type="invalid">
                      Por favor, seleccione una categoría.
                    </Form.Control.Feedback>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='form-group mb-4'>
                    <label htmlFor='margin' className='mb-3'>Margen de Ganancia:</label>
                    <input
                      required
                      type='number'
                      className='form-control'
                      id='margin'
                      defaultValue={productRequest.margin}
                      ref={marginRef}
                      min='0'
                      style={{ maxWidth: '100px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingrese un margen de ganancia válido.
                    </Form.Control.Feedback>
                  </div>
                  <div className='form-group mb-4'>
                    <label htmlFor='iva' className='mb-3'>IVA:</label>
                    <input
                      required
                      type='number'
                      className='form-control'
                      id='iva'
                      defaultValue={productRequest.iva}
                      ref={ivaRef}
                      min='0'
                      style={{ maxWidth: '100px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingrese un valor de IVA válido.
                    </Form.Control.Feedback>
                  </div>
                  <div className='form-group mb-4'>
                    <label htmlFor='state' className='mb-3'>Estado:</label>
                    <select className='form-control' id='state' ref={stateRef} defaultValue={productRequest.state}>
                      <option value='true'>Activo</option>
                      <option value='false'>Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='form-group'>
                <label className='mb-3'>Imágenes:</label>
                <Table className='styled-table'>
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRequest.image.map((imageUrl, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            src={imageUrl}
                            alt={`Image ${index}`}
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                          />
                        </td>
                        <td>
                          <Button variant='danger' onClick={() => removeImage(index)}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <input type='file' accept='image/*' className='form-control-file' onChange={handleImageUpload} />
                {newImages.map((imageUrl, index) => (
                  <div key={index}>Nueva imagen {index + 1}</div>
                ))}
              </div>

              <Button variant='primary' type='submit' className='mt-4'>
                Aceptar
              </Button>

              <NavLink to={'/listProducts'} className='btn btn-secondary ml-2 mt-4'>
                Regresar
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

export default updateProduct;
