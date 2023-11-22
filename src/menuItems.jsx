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

export const menuItemsCostumer = [
    {
        title: 'Catálogo',
        url: '/home',
    },
    {
        title: 'Carro de compras',
        // url: '/ShoppingCart/:idcostumer',
        url: '/ShoppingCart',
    },
    {
        title: 'Perfil',
        url: '/userProfile',
    }
]

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
                title: 'Proveedores',
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
            // {
            //     title: 'Entradas',
            //     url: '/listWarehouseEntries', 
            // }
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
                title: 'Proveedores',
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
        title: 'Carro de compras',
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


