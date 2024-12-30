
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Pages/Login/Login';
import DashboardLayout from './Components/DashboardLayout/DashboardLayout';
import Dashboard from './Pages/Dashboard/Dashboard';
import MenuManagement from './Pages/MenuManagement/MenuManagement';
import Menu from './Pages/Menu/Menu';
import ItemDetails from './Pages/ItemDetails/ItemDetails';
import Cart from './Pages/Cart/Cart';
import CartProceed from './Pages/CartProceed/CartProceed';
import AccountManagement from './Pages/AccountManagement/AccountManagement.jsx';


function App() {
  let routers = createBrowserRouter([
    {
      index: true,
      element: <Login />,
    },
    {
      path: "",
      element: <DashboardLayout />,
      children: [

        {
          path: "dashboard",
          element: <Dashboard />
        },
        {
          path: "menu-editor",
          element: <MenuManagement />
        },
        {
          path: "account-management",
          element: <AccountManagement />
        },
      ]

    },
    {


      path: "menu",
      element: <Menu />

    },
    {


      path: "item-details",
      element: <ItemDetails />

    },
    {


      path: "cart",
      element: <Cart />

    },
    {


      path: "proceed",
      element: <CartProceed />

    }

  ]);

  return (
    <>
      <RouterProvider router={routers} />
    </>)
}

export default App
