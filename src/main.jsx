import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Layout } from './pages/_layout/Layout.jsx'

//Componentes de productos
import ListProducts from './pages/Maintenance/Products/listProducts'
import UpdateProduct from './pages/Maintenance/Products/operations/updateProduct'

//Componentes de categorias
import ListCategories from './pages/Maintenance/category/listCategories'
import EditCategory from './pages/Maintenance/category/actions/editCategory'

//Componentes de bodegas
import ListWarehouse from './pages/Maintenance/Warehouse/listWarehouse'
import EditWarehouse from './pages/Maintenance/Warehouse/actions/editWarehouse'

//Componentes de Productores
import ListProducers from './pages/Maintenance/Producer/listProducers'
import EditProducer from './pages/Maintenance/Producer/actions/editProducer'

//Componentes de pedidos al productor
import ListProducerOrder from './pages/Maintenance/ProducerOrder/listProducerOrder'
import AddProducerOrder from './pages/Maintenance/ProducerOrder/actions/addProducerOrder'
import UpdateProducerOrder from './pages/Maintenance/ProducerOrder/actions/updateProducerOrder'

//Componentes de pedidos del cliente
import ListCustomerOrder from './pages/Maintenance/CustomerOrder/listCustomerOrder'
import UpdateCustomerOrder from './pages/Maintenance/CustomerOrder/actions/updateCustomerOrder'

//Componente de ordenes
import ListOrders from '../src/pages/Inventory/Orders/listOrders'

//Componentes de entradas
import ListEntries from './pages/Inventory/Entries/listEntries'
import CheckEntry from './pages/Inventory/Entries/actions/checkEntry'
import ListWarehouseEntries from './pages/Inventory/warehouseEntries/listWarehouseEntries.jsx'
//Componentes del catalogo
import Catalog from './pages/catalog/Catalog'
import ProductDetail from './pages/catalog/ProductDetail'

//Componentes de previsiones
import ListForesight from './pages/Inventory/Foresight/listForesight'
import AddForesight from './pages/Inventory/Foresight/actions/addForesight'

//Componentes de exisencias
import ListInventories from './pages/Inventory/Inventories/listInventories'
import AddInventories from './pages/Inventory/Inventories/actions/addInventories'

//Componentes de usuarios
import ListCostumers from './pages/security/costumers/listCostumers'
import ListEmployee from './pages/security/employee/listEmployee'

//Componentes de registro i login
import Login from './pages/security/login'
import CostumerRegister from './pages/security/costumers/costumerRegister'
import { UserProfile } from './pages/security/user/userProfile'
import UserOrder from './pages/security/user/userOrder'
import ForgotPassword from './pages/security/user/forgotPassword/forgotPassword'

//Componentes de reportes
import ProductReport from './pages/reports/productReport'
import StockReport from './pages/reports/stockReport/stockReport.jsx'

//Componentes del carro de compra
import ShoppingCart from './pages/ShoppingCart/ShoppingCart'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>

  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
    <Route index element={<Catalog/>}/>
      <Route index element={<Catalog />}/>
      <Route path='/home' element={<Catalog/>}></Route>
      <Route path='/listProducts' element={<ListProducts/>}></Route>
      <Route path='/editProduct/:product' element={<UpdateProduct/>}></Route>
      <Route path='/listCategories' element={<ListCategories/>}></Route>
      <Route path='/editCategory/:idCategory' element={<EditCategory />}></Route>
      <Route path="/listWareHouse"element={<ListWarehouse/>}/>
      <Route path="/editWarehouse/:idWarehouse"element={<EditWarehouse/>}/>

      {/* <Route path="/ProductDetail/:idproduct"element={<ProductDetail/>}/> */}
      <Route path="/ProductDetail/:idcategory/:idproduct"element={<ProductDetail/>}/>

      <Route path="/ShoppingCart"element={<ShoppingCart/>}/>

      <Route path="/listProducers"element={<ListProducers/>}/>
      <Route path='/editProducer/:producer'element={<EditProducer/>}/>

      {/* <Route path="/listProducerOrder"element={<ListProducerOrder/>}/> */}
      <Route path="/listProducerOrder/:filter"element={<ListProducerOrder/>}/>
      {/* <Route path="/listCustomerOrders"element={<ListCustomerOrders/>}/> */}
      <Route path="/listCustomerOrder/:filter"element={<ListCustomerOrder/>}/>
      
      <Route path="/userOrder/:orderid"element={<UserOrder/>}/>
      <Route path="/productReport/:productId"element={<ProductReport/>}/>
      <Route path="/stockReport/"element={<StockReport/>}/>




      <Route path="/addProducerOrder"element={<AddProducerOrder/>}/>

      <Route path='/editProducerOrder/:producerorder'element={<UpdateProducerOrder/>}/>
      <Route path='/editCustomerOrder/:customerorder'element={<UpdateCustomerOrder/>}/>


      <Route path='/listEntries' element={<ListEntries/>}/>
      <Route path='/listWarehouseEntries' element={<ListWarehouseEntries/>}/>
      <Route path='/listInventories' element={<ListInventories/>}/>
      <Route path='/addInventories/:product' element={<AddInventories/>}></Route>
      <Route path='/checkProducerOrder/:producerorder' element={<CheckEntry/>}/>
      <Route path='/listForesights' element={<ListForesight/>}/>
      <Route path='/addForesight' element={<AddForesight/>}/>
      <Route path='/listOrders' element={<ListOrders/>}/>
      <Route path='/listEmployee' element={<ListEmployee/>}/>
      <Route path='/listCostumers' element={<ListCostumers/>}/>


      <Route path='/login' element={<Login/>}></Route>
      <Route path='/registerCostumer' element={<CostumerRegister/>}/>
      <Route path='/userProfile' element={<UserProfile/>}/>

      <Route path='/forgotPassword' element={<ForgotPassword/>}/>

    </Route>
      </Routes>
      </BrowserRouter>
      

</QueryClientProvider>
)
