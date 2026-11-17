import '../index.css';
import '../assets/styles/MainStyle.css';
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoadingSpinner } from "../components/common";

import DashboardLayout from "../components/DashboardLayout";
import CustomerLayout from "../components/CustomerLayout";
import RoleRouteGuard from "../components/auth/RoleRouteGuard";
import { 
  canAccessStaffs, 
  canAccessCustomers, 
  canAccessTransactions, 
  canAccessReports 
} from "../utils/permissions";
import { 
  ErrorPage, 
  NotFound404, 
  ServerError500, 
  BadRequest400, 
  Forbidden403, 
  ServiceUnavailable503 
} from "./errors";

// Code-split routes with React.lazy
const Home = lazy(() => import("./Home"));
const SignIn = lazy(() => import("./SignIn"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const ResetPassword = lazy(() => import("./ResetPassword"));
const Profile = lazy(() => import("./Profile"));

// Admin Portal Pages
const Dashboard = lazy(() => import("./Dashboard"));
const Staffs = lazy(() => import("./Staffs"));
const Categories = lazy(() => import("./Categories"));
const Products = lazy(() => import("./Products"));
const Customers = lazy(() => import("./Customers"));
const Orders = lazy(() => import("./Orders"));
const Transactions = lazy(() => import("./Transactions"));
const Report = lazy(() => import("./Report"));

// Customer Portal Pages
const CustomerDashboard = lazy(() => import("./customer/CustomerDashboard"));
const CustomerCategories = lazy(() => import("./customer/CustomerCategories"));
const CustomerCategoryProducts = lazy(() => import("./customer/CustomerCategoryProducts"));
const CustomerProductDetails = lazy(() => import("./customer/CustomerProductDetails"));
const CustomerProducts = lazy(() => import("./customer/CustomerProducts"));
const CustomerOrders = lazy(() => import("./customer/CustomerOrders"));
const CustomerTrackOrder = lazy(() => import("./customer/CustomerTrackOrder"));
const CustomerCart = lazy(() => import("./customer/CustomerCart"));
const CustomerWishlist = lazy(() => import("./customer/CustomerWishlist"));
const CustomerNotifications = lazy(() => import("./customer/CustomerNotifications"));
const CustomerAddresses = lazy(() => import("./customer/CustomerAddresses"));
const CustomerPaymentMethods = lazy(() => import("./customer/CustomerPaymentMethods"));
const CustomerSupport = lazy(() => import("./customer/CustomerSupport"));
const CustomerCheckout = lazy(() => import("./customer/CustomerCheckout"));
const CustomerSignIn = lazy(() => import("./customer/CustomerSignIn"));
const CustomerSignUp = lazy(() => import("./customer/CustomerSignUp"));

// Route suspense wrapper for silky-smooth lazy loading
const S = (Component, variant = "spinner") => (
  <Suspense
    fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", width: "100%" }}>
        <LoadingSpinner variant={variant} />
      </div>
    }
  >
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: S(SignIn)
  },
  {
    path: "/home",
    element: S(Home)
  },
  {
    path: "/signin",
    element: S(SignIn)
  },
  {
    path: "/signup",
    element: <Navigate to="/customer/signup" replace />
  },
  {
    path: "/forgot-password",
    element: S(ForgotPassword)
  },
  {
    path: "/reset-password",
    element: S(ResetPassword)
  },
  {
    path: "/profile",
    element: S(Profile)
  },
  {
    path: "/customer/signin",
    element: S(CustomerSignIn)
  },
  {
    path: "/customer/signup",
    element: S(CustomerSignUp)
  },
  {
    path: "/customer",
    element: <Navigate to="/customer/dashboard" replace />
  },
  {
    element: <CustomerLayout />,
    errorElement: <ServerError500 />,
    children: [
      {
        path: "/customer/dashboard",
        element: S(CustomerDashboard)
      },
      {
        path: "/customer/categories",
        element: S(CustomerCategories)
      },
      {
        path: "/customer/products",
        element: S(CustomerProducts)
      },
      {
        path: "/customer/orders",
        element: S(CustomerOrders)
      },
      {
        path: "/customer/track-order",
        element: S(CustomerTrackOrder)
      },
      {
        path: "/customer/category/:categoryId",
        element: S(CustomerCategoryProducts)
      },
      {
        path: "/customer/product/:productId",
        element: S(CustomerProductDetails)
      },
      {
        path: "/customer/cart",
        element: S(CustomerCart)
      },
      {
        path: "/customer/wishlist",
        element: S(CustomerWishlist)
      },
      {
        path: "/customer/notifications",
        element: S(CustomerNotifications)
      },
      {
        path: "/customer/addresses",
        element: S(CustomerAddresses)
      },
      {
        path: "/customer/payment-methods",
        element: S(CustomerPaymentMethods)
      },
      {
        path: "/customer/checkout",
        element: S(CustomerCheckout)
      },
      {
        path: "/customer/settings",
        element: S(Profile)
      },
      {
        path: "/customer/support",
        element: S(CustomerSupport)
      }
    ]
  },
  {
    element: <DashboardLayout />,
    errorElement: <ServerError500 />,
    children: [
      {
        path: "/dashboard",
        element: S(Dashboard)
      },
      {
        path: "/staffs",
        element: (
          <RoleRouteGuard permissionCheck={canAccessStaffs}>
            {S(Staffs)}
          </RoleRouteGuard>
        )
      },
      {
        path: "/categories",
        element: S(Categories)
      },
      {
        path: "/products",
        element: S(Products)
      },
      {
        path: "/customers",
        element: (
          <RoleRouteGuard permissionCheck={canAccessCustomers}>
            {S(Customers)}
          </RoleRouteGuard>
        )
      },
      {
        path: "/orders",
        element: S(Orders)
      },
      {
        path: "/transactions",
        element: (
          <RoleRouteGuard permissionCheck={canAccessTransactions}>
            {S(Transactions)}
          </RoleRouteGuard>
        )
      },
      {
        path: "/report",
        element: (
          <RoleRouteGuard permissionCheck={canAccessReports}>
            {S(Report)}
          </RoleRouteGuard>
        )
      }
    ]
  },
  {
    path: "/404",
    element: <NotFound404 />
  },
  {
    path: "/500",
    element: <ServerError500 />
  },
  {
    path: "/400",
    element: <BadRequest400 />
  },
  {
    path: "/403",
    element: <Forbidden403 />
  },
  {
    path: "/503",
    element: <ServiceUnavailable503 />
  },
  {
    path: "/error/:code",
    element: <ErrorPage />
  },
  {
    path: "*",
    element: <NotFound404 />
  }
]);
