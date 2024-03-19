import { Outlet } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { Link } from 'react-router-dom';
import '../../Styles/footer.css'

import swal from 'sweetalert'
import emailjs2 from 'emailjs-com'
import { Stack } from 'react-bootstrap';
import ResponsiveNavbar from './Components/ResponsiveNavbar';
export const Layout = () => {

  const location = useLocation();

  useEffect(() => {
    if (location.pathname == '/login' || location.pathname == '/registerCostumer') {
      document.body.classList.add('login-body');
      document.body.classList.add('header');
    }
    else { document.body.classList.remove('login-body') }
  }, [location])

  const message = useRef()
  const email = useRef()

  const sendMessage = () => {

    console.log("message: " + message.current.value)
    console.log("email: " + email.current.value)


    emailjs2.send('service_vd4y2ba', 'template_uuzf9f9',
      {
        message: message.current.value,
        email: email.current.value
      }
      , 'wp2slKrA6ADSD4NTz')

    message.current.value = ''
    email.current.value = ''

    swal({
      title: 'Enviado!',
      text: 'Se envió el correo',
      icon: 'success',
    });
  }

  return (
    <>

      <ResponsiveNavbar />


      <main style={{ marginBottom: '150px' }}>

        <Outlet />

      </main>
      <footer className="footer" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <Link to="/" className="logo">
                <img src="https://coopepilangosta.com/wp-content/uploads/2022/09/Copia-de-Logo-CoopePilangosta-c2.png" className='LogoImgFooter' />
              </Link>
              <br />
              <span>
                Somos el resultado de una aventura colectiva que comenzó en 1962 cuando… los productores de café se unieron.
              </span>
              <br />
            </div>
            <div className="col-md-2">
              <h5 className="text-md-right">Contáctenos</h5>
              <div className="row">
                <Stack gap={3}>
                  <div>
                    <Link to="https://www.facebook.com/people/Diria-Coffee-Tour/100070937904555/" rel="stylesheet" href="">
                      <img src="https://w7.pngwing.com/pngs/296/226/png-transparent-computer-icons-facebook-inc-logo-like-button-facebook-logo-desktop-wallpaper-brand.png"
                        alt="" className='socialNetworkImg' /><a href="">Facebook</a>
                    </Link>
                  </div>
                  <div>
                    <Link to="https://www.instagram.com/diriacoffee/" rel="stylesheet" href="">
                      <img src="https://img.freepik.com/premium-vector/vinnytsia-ukraine-april-27-2023-popular-social-media-icon-instagram-vector-design_545793-1681.jpg"
                        alt="" className='socialNetworkImg' /><a href="">Instagram</a>
                    </Link>

                  </div>
                  <div>
                    <Link to="https://wa.me/+50683195638?text=¡Hola!%20Me%20interesa%20conocer%20más%20sobre%20sus%20productos%20y%20obtener%20una%20cotización.%20¿Podría%20proporcionarme%20información%20detallada%20sobre%20su%20catálogo%20y%20precios?%20¡Gracias!" rel="stylesheet" href="">
                      <img src="https://i.imgflip.com/68fgu8.png"
                        alt="" className='socialNetworkImg' /><a href="">WhatsApp</a>
                    </Link>
                  </div>


                </Stack>
              </div>

              <hr></hr>
            </div>
            <div className="col-md-5">
              <form>

                <fieldset className="form-group">
                  <input type="email" className="form-control" id="InputEmail1" placeholder="Ingrese su correo" ref={email} />
                </fieldset>

                <br />

                <fieldset className="form-group">
                  <textarea className="form-control" id="InputMessage" placeholder="Mensaje" ref={message}></textarea>
                </fieldset>

                <br />

                <fieldset className="form-group text-xs-right">
                  <button type="button" className="btn btn-secondary-outline btn-lg" id="btnSend" onClick={sendMessage}>Enviar</button>
                </fieldset>

              </form>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Layout