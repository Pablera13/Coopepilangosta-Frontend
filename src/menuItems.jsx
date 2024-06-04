import { PiShoppingCartFill } from "react-icons/pi";
import { PiShoppingCartLight } from "react-icons/pi";
import React, { useEffect } from 'react';


export const menuItemsNotLogin = [
    {
        title: 'Catálogo',
        url: '/home',
    },
    {
        title: 'Iniciar Sesión',
        url: '/login',
    }
]


export const menuItemsCostumer = (CartValue) => {
    {
        let iCON
        if (CartValue == "lleno") {iCON = <PiShoppingCartLight style={{fontSize:"150%"}}/>} 
        else if (CartValue == "vacío") { iCON = <PiShoppingCartFill style={{fontSize:"150%"}} />}


        let array = [
            {
                title: 'Catálogo',
                url: '/home',
            },
            
            {
                title: 'Mis Pedidos',
                url: '/myCustomerOrders',
            },
            {
                title: 'Perfil',
                url: '/userProfile',
            },
            {

                title: iCON,
                url: '/ShoppingCart',
            }
        ]

        return array

    }
}

export const menuItemsEmployee = [
    {
        title: 'Catálogo',
        url: '/home',
    },
    {
        title: 'Mantenimiento',
        submenu: [
            {
                title: 'Productos',
                url: '/listProducts'
            },
            {
                title: 'Productores',
                url: '/listProducers',
            },
            {
                title: 'Categorías',
                url: '/listCategories',
            },
            {
                title: 'Bodegas',
                url: '/listWarehouse',
            }
        ],
    },
    {
        title: 'Inventario',
        submenu: [
            {
                title: 'Pedidos',
                url: '/listProducerOrder/all',
            },
            {
                title: 'Previsiones',
                url: '/listForesights',
            },
            {
                title: 'Existencias',
                url: '/listInventories',
            },
        ],
    },
    {
        title: 'Reportes',
        submenu: [
            {
                title: 'Pedidos Recibidos',
                url: '/listCustomerOrder/all',
            },
            {
                title: 'Reporte de Ventas',
                url: '/productReport/:0',
            },
            {
                title: 'Historial de Inventario',
                url: '/stockReport/',
            },
        ],
    },
    {
        title: 'Usuarios',
        submenu: [
            {
                title: 'Clientes',
                url: '/listCostumers',
            },
        ]
    },
    {
        title: 'Perfil',
        url: '/userProfile',
    },
]

export const menuItems = [
    {
        title: 'Catálogo',
        url: '/home',
    },
    {
        title: 'Mantenimiento',
        submenu: [
            {
                title: 'Productos',
                url: '/listProducts'
            },
            {
                title: 'Productores',
                url: '/listProducers',
            },
            {
                title: 'Categorías',
                url: '/listCategories',
            },
            {
                title: 'Bodegas',
                url: '/listWarehouse',
            }
        ],
    },
    {
        title: 'Inventario',
        submenu: [
            {
                title: 'Pedidos',
                url: '/listProducerOrder/all',
            },
            {
                title: 'Previsiones',
                url: '/listForesights',
            },
            {
                title: 'Existencias',
                url: '/listInventories',
            },
        ],
    },
    {
        title: 'Reportes',
        submenu: [
            {
                title: 'Pedidos Recibidos',
                url: '/listCustomerOrder/all',

            },
            {
                title: 'Reporte de Ventas',
                url: '/productReport/:0',
            },
            {
                title: 'Historial de Inventario',
                url: '/stockReport/',
            },
        ],
    },

    {
        title: 'Usuarios',
        submenu: [
            {
                title: 'Empleados',
                url: '/listEmployee',
            },
            {
                title: 'Clientes',
                url: '/listCostumers',
            },
        ]
    }
    ,
    {
        title: 'Perfil',
        url: '/userProfile',
    },

]


