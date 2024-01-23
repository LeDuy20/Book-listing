import React, { useEffect } from "react";
import "./App.scss";
import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Contact from "./pages/Contact";
import Book from "./pages/Book";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Register from "./pages/Register";
import { callFetchAccount } from "./utils/UserServices";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import NoFound from "./pages/NotFound";
import Admin from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const getAccount = async () => {
    if (window.location.pathname === "/login") return;
    const res = await callFetchAccount();
    if (res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };
  useEffect(() => {
    getAccount();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NoFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "book",
          element: <Book />,
        },
      ],
    },
    {
      path: "/admin",
      element: <Layout />,
      errorElement: <NoFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          ),
        },
        {
          path: "user",
          element: <Contact />,
        },
        {
          path: "book",
          element: <Book />,
        },
      ],
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      {isAuthenticated === true || window.location.pathname === "/login" || window.location.pathname === "/admin" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </div>
  );
}
