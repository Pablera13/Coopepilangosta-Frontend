import { menuItems,menuItemsCostumer,menuItemsNotLogin,menuItemsEmployee } from '../../../menuItems';
import MenuItems from './MenuItems'
import navbarstyles from '../../../Styles/navbar.css'
import { useEffect, useState } from 'react';

const Navbar = () => {

  const user = JSON.parse(localStorage.getItem('user'));
  console.log(JSON.stringify(user))

  const [menu,setMenu] = useState([])

  useEffect(() => {

    if (user == null) {
      setMenu(menuItemsNotLogin)

    }else{

      //setMenu(menuItemsEmployee)
      
      switch (user.role.name) {
        case "Cliente":
          setMenu(menuItemsCostumer)
        break;

        case "Admin":
          setMenu(menuItemsEmployee)
        break;

        case "SuperAdmin":
          setMenu(menuItems)
        break;

        default:
          setMenu(menuItemsNotLogin)
        break;
      }

    }
  }, [])
  

  return (
    <nav>
      <ul className="menus">
        {menu.map((menu, index) => {
          const depthLevel = 0;
          return (
            <MenuItems
              items={menu}
              key={index}
              depthLevel={depthLevel}
              
            />
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
