import React, { useState, useEffect } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Container } from 'react-bootstrap';
import { menuItems, menuItemsCostumer, menuItemsNotLogin, menuItemsEmployee } from '../../../menuItems';
import navbarstyles from '../../../Styles/responsiveNavbar.css'
import { Link } from 'react-router-dom';

const ResponsiveNavbar = () => {
    const [MenuItemsInUse, setMenuItems] = useState();

    const [menu, setMenu] = useState([])
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {

        if (user == null) {
            setMenu(menuItemsNotLogin)

        } else {

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

    console.log(menu)

    return (
        <Navbar expand="lg" className="bg-body-tertiary" id='navbarHead' sticky='top'>
            <Container id='navbarContainer'>
                <Link to="/" className="logo">

                    <img src="https://coopepilangosta.com/wp-content/uploads/2022/09/Copia-de-Logo-CoopePilangosta-couleur.png"
                        className='logoImg'

                    />
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {
                            menu.map((menuIt) => 
                                menuIt.submenu?(
                                    
                                    <NavDropdown title={menuIt.title} id="basic-nav-dropdown" key={menuIt.title}>
                                        {
                                            menuIt.submenu.map((subMenuItem)=>
                                            <NavDropdown.Item href={subMenuItem.url} key={subMenuItem.title}>{subMenuItem.title}</NavDropdown.Item>
                                            )
                                        }
                                    </NavDropdown>
                                    
                                ):(
                                    <Nav.Link href={menuIt.url}>{menuIt.title}</Nav.Link>
                                )
                            )
                        }
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default ResponsiveNavbar