import '../index.css';
import '../assets/styles/MainStyle.css';
import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Profile from "./Profile";
import DashboardLayout from "../components/DashboardLayout";
import Dashboard from "./Dashboard";
import Staffs from "./Staffs";
import Categories from "./Categories";
import Products from "./Products";
import Customers from "./Customers";
import Orders from "./Orders";
import Transactions from "./Transactions";
import Report from "./Report";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/staffs",
        element: <Staffs />
      },
      {
        path: "/categories",
        element: <Categories />
      },
      {
        path: "/products",
        element: <Products />
      },
      {
        path: "/customers",
        element: <Customers />
      },
      {
        path: "/orders",
        element: <Orders />
      },
      {
        path: "/transactions",
        element: <Transactions />
      },
      {
        path: "/report",
        element: <Report />
      }
    ]
  }
]);

export default function App() {
  return null;
}