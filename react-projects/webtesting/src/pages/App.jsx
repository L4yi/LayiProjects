import '../index.css';
import '../assets/styles/MainStyle.css';
import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import Signin from "./Signin";
import Signup from "./SignUp";
import ResetPassword from "./ResetPassword";
export const router = createBrowserRouter([

  {
    path: "/",
    element: <Home />
  },
  {
    path: "/signin",
    element: <Signin />
  } ,
  {
    path: "/signup",
    element: <Signup />
  } ,
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  }
]);