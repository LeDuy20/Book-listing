import React, { useEffect } from "react";
import "./App.scss";
import "./styles/global.scss";
import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Carts from "./pages/Carts";
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
import History from "./pages/History/History";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutAdmin from "./components/AdminLayout";
import UserTable from "./components/AdminLayout/User/UserTable";
import ListBook from "./components/AdminLayout/Book/ListBook";

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
  const isLoading = useSelector((state) => state.account.isLoading);
  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;
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
          path: "cart",
          element: <Carts />,
        },
        {
          path: "book/:slug",
          element: <Book />,
        },
        {
          path: "history",
          element: <History />,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
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
          path: "/admin/user",
          element: <UserTable />,
        },
        {
          path: "/admin/book",
          element: <ListBook />,
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
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </div>
  );
}
