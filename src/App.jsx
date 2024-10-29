
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Pages/Login/Login';
import DashboardLayout from './Components/DashboardLayout/DashboardLayout';
import Dashboard from './Pages/Dashboard/Dashboard';
import MenuManagement from './Pages/MenuManagement/MenuManagement';
import Menu from './Pages/Menu/Menu';


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
      ]

    },
    {


      path: "menu",
      element: <Menu />

    }

  ]);

  return (
    <>
      <RouterProvider router={routers} />
    </>)
}

export default App
