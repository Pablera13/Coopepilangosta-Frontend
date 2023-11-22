import Navbar from './Components/Navbar';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="nav-area">
        <Link to="/" className="logo">

          <img src="https://coopepilangosta.com/wp-content/uploads/2022/09/Copia-de-Logo-CoopePilangosta-couleur.png" 
          className='logoImg'

          />
        </Link>
        <Navbar />
      </div>
    </header>
    
  );
};

export default Header;