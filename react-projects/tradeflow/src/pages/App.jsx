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
import CustomerSignIn from "./customer/CustomerSignIn";
import CustomerSignUp from "./customer/CustomerSignUp";
import CustomerLayout from "../components/CustomerLayout";
import CustomerDashboard from "./customer/CustomerDashboard";
import CustomerCategories from "./customer/CustomerCategories";
import CustomerCategoryProducts from "./customer/CustomerCategoryProducts";
import CustomerProductDetails from "./customer/CustomerProductDetails";
import CustomerCart from "./customer/CustomerCart";

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
    path: "/customer/signin",
    element: <CustomerSignIn />
  },
  {
    path: "/customer/signup",
    element: <CustomerSignUp />
  },
  {
    element: <CustomerLayout />,
    children: [
      {
        path: "/customer",
        element: <CustomerDashboard />
      },
      {
        path: "/customer/dashboard",
        element: <CustomerDashboard />
      },
      {
        path: "/customer/categories",
        element: <CustomerCategories />
      },
      {
        path: "/customer/category/:categoryId",
        element: <CustomerCategoryProducts />
      },
      {
        path: "/customer/product/:productId",
        element: <CustomerProductDetails />
      },
      {
        path: "/customer/cart",
        element: <CustomerCart />
      },
      {
        path: "/customer/settings",
        element: <Profile isCustomer={true} />
      }
    ]
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