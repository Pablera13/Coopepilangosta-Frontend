import { Outlet } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import emailjs from 'emailjs-com';
import { Stack, Container, Row, Col, Form, Button } from 'react-bootstrap';
import ResponsiveNavbar from './Components/ResponsiveNavbar';
import { FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { CiFacebook } from 'react-icons/ci';
import '../../Styles/footer.css'

export const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/productReport/:productId') {
      document.body.classList.add('login-body', 'header');
    } else {
      document.body.classList.remove('login-body', 'header');
    }
  }, [location]);

  const message = useRef();
  const email = useRef();
  const [validated, setValidated] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();
    const formFields = [message, email];
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

    emailjs.send('service_vd4y2ba', 'template_uuzf9f9', {
      message: message.current.value,
      email: email.current.value
    }, 'wp2slKrA6ADSD4NTz');

    message.current.value = '';
    email.current.value = '';

    swal({
      title: 'Enviado!',
      text: 'Se envió el correo',
      icon: 'success',
    });
  };

  return (
    <>
      <ResponsiveNavbar />
      <main style={{ marginBottom: '150px' }}>
        <Outlet />
      </main>
      <footer className="footer">
        <Container>
          <Row>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <Link to="/" className="logo">
                    <img src="https://coopepilangosta.com/wp-content/uploads/2022/09/Copia-de-Logo-CoopePilangosta-c2.png" className="LogoImgFooter" style={{ width: "50%" }} alt="Logo" />
                  </Link>
                  <br /><br />
                  <span>
                    Somos el resultado de una aventura colectiva que comenzó en 1962 cuando… los productores de café se unieron.
                  </span>
                  <br /><br />
                </Col>

                <Col md={12}>
                  <Stack direction="horizontal" gap={4}>
                    <div>
                      <Link to="https://www.facebook.com/people/Diria-Coffee-Tour/100070937904555/" rel="noopener noreferrer" target="_blank">
                        <CiFacebook style={{ fontSize: "200%" }} />
                      </Link>
                    </div>
                    <div>
                      <Link to="https://www.instagram.com/diriacoffee/" rel="noopener noreferrer" target="_blank">
                        <FaInstagram style={{ fontSize: "200%" }} />
                      </Link>
                    </div>
                    <div>
                      <Link to="https://wa.me/+50683195638?text=¡Hola!%20Me%20interesa%20conocer%20más%20sobre%20sus%20productos%20y%20obtener%20una%20cotización.%20¿Podría%20proporcionarme%20información%20detallada%20sobre%20su%20catálogo%20y%20precios?%20¡Gracias!" rel="noopener noreferrer" target="_blank">
                        <FaWhatsapp style={{ fontSize: "200%" }} />
                      </Link>
                      <br />
                    </div>
                    <div>
                      <Link to="https://www.tiktok.com/@diria.coffee?_t=8iLUxJT86vl&_r=1">
                        <FaTiktok style={{ fontSize: "200%" }} />
                      </Link>
                      <br />
                    </div>
                  </Stack>
                  <br></br>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <div className="contact-info">
                <h5>Contáctenos</h5>
                <p>Teléfono: +506 2659 9130</p>
                <p>Teléfono: +506 8541 9130</p>
                <p>Correo: info@coopepilangosta.com</p>
                <p>Ubicación: 600 metros de Bario Cementerio, Hojancha, Guanacaste</p>
              </div>
              <Form onSubmit={sendMessage}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control required type="email" placeholder="Ingrese su correo" ref={email} />
                </Form.Group>
                <br></br>
                <Form.Group controlId="formBasicMessage">
                  <Form.Control as="textarea" required placeholder="Mensaje" ref={message} />
                </Form.Group>
                <br></br>
                <button className="btnSugerencia" type="submit" >
                  Enviar
                </button>
              </Form>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Layout;
