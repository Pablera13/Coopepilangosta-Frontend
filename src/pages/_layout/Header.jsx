import Navbar from './Components/Navbar';
import { Link } from 'react-router-dom';
import ResponsiveNavbar from './Components/ResponsiveNavbar';
const Header = () => {
  return (
    <header>
      <div className="nav-area">
        
        <ResponsiveNavbar />
      </div>
    </header>
    
  );
};

export default Header;