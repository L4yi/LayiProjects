import '../index.css';
import '../assets/styles/MainStyle.css';
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./Home";
import SignIn from "./SignIn";
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

import CustomerLayout from "../components/CustomerLayout";
import CustomerDashboard from "./customer/CustomerDashboard";
import CustomerCategories from "./customer/CustomerCategories";
import CustomerCategoryProducts from "./customer/CustomerCategoryProducts";
import CustomerProductDetails from "./customer/CustomerProductDetails";
import CustomerCart from "./customer/CustomerCart";
import CustomerSignIn from "./customer/CustomerSignIn";
import CustomerSignUp from "./customer/CustomerSignUp";

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
    element: <Navigate to="/customer/signup" replace />
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
    path: "/customer",
    element: <Navigate to="/customer/dashboard" replace />
  },
  {
    element: <CustomerLayout />,
    children: [
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
        element: <Profile />
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
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />
  }
]);
