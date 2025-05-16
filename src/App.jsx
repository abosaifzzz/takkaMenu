
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
import MenuSettings from './Pages/MenuSettings/MenuSettings.jsx';
import Reviews from './Pages/Reviews/Reviews.jsx';
import Signup from './Pages/Signup/Signup.jsx';
import ConfirmEmail from './Pages/ConfirmEmail/ConfirmEmail.jsx';
import StartForm from './Pages/StartForm/StartForm.jsx';
import Home from './Pages/Home/Home.jsx';
import Layout from './Components/Layout/Layout.jsx';
import Notefound from './Pages/NotFound/Notefound.jsx';


function App() {
  let routers = createBrowserRouter([
    {
      path: "",

      element: <Layout />,
      children: [

        {
          index: true,
          element: <Home />
        },
      ]
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/confirm",
      element: <ConfirmEmail />,
    },
    {
      path: "/start",
      element: <StartForm />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "",
      element: <DashboardLayout />,
      children: [

        {
          path: "menu/:menuId/dashboard",
          element: <Dashboard />
        },
        {
          path: "menu/:menuId/menu-editor",
          element: <MenuManagement />
        },
        {
          path: "account-management",
          element: <AccountManagement />
        },
        {
          path: "menu-settings",
          element: <MenuSettings />
        },
        {
          path: "customer-reviews",
          element: <Reviews />
        },


      ]

    },
    {


      path: "menu/:menu_id",
      element: <Menu />

    },

    {


      path: "/menu/:menuId/cart",
      element: <Cart />

    },
    {


      path: "proceed",
      element: <CartProceed />

    },
    {
      path: "*",
      element: <Notefound />
    }

  ])

  return (
    <>
      <RouterProvider router={routers} />
    </>)
}

export default App;