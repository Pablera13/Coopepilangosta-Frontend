import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Layout } from "./pages/_layout/Layout.jsx";

import ListProducts from "./pages/Maintenance/Products/listProducts";

import ListCategories from "./pages/Maintenance/category/listCategories";

import ListWarehouse from "./pages/Maintenance/Warehouse/listWarehouse";

import ListProducers from "./pages/Maintenance/Producer/listProducers";

import ListProducerOrder from "./pages/Maintenance/ProducerOrder/listProducerOrder";

import ListCustomerOrder from "./pages/Maintenance/CustomerOrder/listCustomerOrder";
import MyCostumerOrder from "./pages/Maintenance/CustomerOrder/myCostumerOrder";

import ListOrders from "../src/pages/Inventory/Orders/listOrders";

import ListEntries from "./pages/Inventory/Entries/listEntries";
import CheckEntry from "./pages/Inventory/Entries/actions/checkEntry";
import ListWarehouseEntries from "./pages/Inventory/warehouseEntries/listWarehouseEntries.jsx";

import Catalog from "./pages/catalog/Catalog";
import ProductDetail from "./pages/catalog/ProductDetail";

import ListForesight from "./pages/Inventory/Foresight/listForesight";
import AddForesight from "./pages/Inventory/Foresight/actions/addForesight";

import ListInventories from "./pages/Inventory/Inventories/listInventories";
import AddInventories from "./pages/Inventory/Inventories/actions/addInventories";

import ListCostumers from "./pages/security/costumers/listCostumers";
import ListEmployee from "./pages/security/employee/listEmployee";

import Login from "./pages/security/login";
import CostumerRegister from "./pages/security/costumers/costumerRegister";
import { UserProfile } from "./pages/security/user/userProfile";
import UserOrder from "./pages/security/user/userOrder";
import ForgotPassword from "./pages/security/user/forgotPassword/forgotPassword";

import ProductReport from "./pages/reports/productReport";
import StockReport from "./pages/reports/stockReport/stockReport.jsx";

import ShoppingCart from "./pages/ShoppingCart/ShoppingCart";

import ListProductCostumer from "./pages/Maintenance/ProductCostumer/listProductCostumer";
import ForbiddenPage from "./views/HTTP403-Forbidden.jsx";
import NotFound from "./views/404-NotFound.jsx";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* Single page routes */}
        <Route path="/forbidden" element={<ForbiddenPage/>}></Route>

        {/* Layout routes */}
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<NotFound />}></Route>
          <Route index element={<Catalog />} />
          <Route index element={<Catalog />} />
          <Route path="/home" element={<Catalog />}></Route>
          <Route path="/listProducts" element={<ListProducts />}></Route>
          <Route path="/listCategories" element={<ListCategories />}></Route>
          <Route path="/listWareHouse" element={<ListWarehouse />} />

          <Route
            path="/ProductDetail/:idcategory/:idproduct"
            element={<ProductDetail />}
          />

          <Route path="/ShoppingCart" element={<ShoppingCart />} />

          <Route path="/listProducers" element={<ListProducers />} />

          <Route
            path="/listProducerOrder/:filter"
            element={<ListProducerOrder />}
          />

          <Route
            path="/listCustomerOrder/:filter"
            element={<ListCustomerOrder />}
          />

          <Route path="/userOrder/:orderid" element={<UserOrder />} />
          <Route path="/productReport/:productId" element={<ProductReport />} />
          <Route path="/stockReport/" element={<StockReport />} />

          <Route
            path="/listProductCostumer/:costumername/:costumerid"
            element={<ListProductCostumer />}
          />

          <Route path="/myCustomerOrders" element={<MyCostumerOrder />} />

          

          <Route path="/listEntries" element={<ListEntries />} />
          <Route
            path="/listWarehouseEntries"
            element={<ListWarehouseEntries />}
          />
          <Route path="/listInventories" element={<ListInventories />} />
          <Route
            path="/addInventories/:product"
            element={<AddInventories />}
          ></Route>
          <Route
            path="/checkProducerOrder/:producerorder"
            element={<CheckEntry />}
          />
          <Route path="/listForesights" element={<ListForesight />} />
          <Route path="/addForesight" element={<AddForesight />} />
          <Route path="/listOrders" element={<ListOrders />} />
          <Route path="/listEmployee" element={<ListEmployee />} />
          <Route path="/listCostumers" element={<ListCostumers />} />

          <Route path="/login" element={<Login />}></Route>
          <Route path="/registerCostumer" element={<CostumerRegister />} />
          <Route path="/userProfile" element={<UserProfile />} />

          <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
