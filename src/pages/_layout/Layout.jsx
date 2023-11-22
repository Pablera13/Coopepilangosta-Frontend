import { Outlet } from 'react-router-dom'
import React, { useState,useEffect,useRef } from 'react'
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { Link } from 'react-router-dom';
import '../../Styles/footer.css'

export const Layout = () => {

  const location = useLocation();  
  const [isLoginScreen, setIsLoginScreen] = useState(false);
    
  useEffect(()=>{
    if(location.pathname == '/login'){
      document.body.classList.add('login-body');
      document.body.classList.add('header');
    }
      
    else{document.body.classList.remove('login-body')}
  },[location])

  return (
    <>
      <div>
        <Header />
      </div>

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
                <div className="col-6">
                  <ul className="list-unstyled">
                    <Link to="https://www.facebook.com/people/Diria-Coffee-Tour/100070937904555/" rel="stylesheet" href="">
                      <img src="https://w7.pngwing.com/pngs/296/226/png-transparent-computer-icons-facebook-inc-logo-like-button-facebook-logo-desktop-wallpaper-brand.png"
                        alt="" className='socialNetworkImg' /><a href="">Faceboock</a>
                    </Link>
                    <Link to="https://www.instagram.com/diriacoffee/" rel="stylesheet" href="">
                      <img src="https://img.freepik.com/premium-vector/vinnytsia-ukraine-april-27-2023-popular-social-media-icon-instagram-vector-design_545793-1681.jpg"
                        alt="" className='socialNetworkImg' /><a href="">Instagram</a>
                    </Link>

                  </ul>
                </div>
              </div>

              <hr></hr>
            </div>
            <div className="col-md-5">
              <form>
                <fieldset className="form-group">
                  <input type="email" className="form-control" id="InputEmail1" placeholder="Enter email" />
                </fieldset>
                <br />
                <fieldset className="form-group">
                  <textarea className="form-control" id="InputMessage" placeholder="Message"></textarea>
                </fieldset>
                <br />
                <fieldset className="form-group text-xs-right">
                  <button type="button" className="btn btn-secondary-outline btn-lg" id="btnSend">Send</button>
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