import { createBrowserRouter } from "react-router";

import MainLayout from "@/layouts/MainLayout";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";

import UniversitasTerbuka from "@/pages/universitas-terbuka/Universitas-Terbuka";
import PhotoResult from "@/pages/universitas-terbuka/PhotoResult";

import Events from "@/pages/admin/Event";
import Students from "@/pages/admin/Students";
import AdminLogin from "@/pages/admin/Login";

import ProtectedRoute from "@/components/ProtectedRoute";
import BulkImport from "@/pages/admin/BulkImport";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: import.meta.env.PROD ? <UniversitasTerbuka /> : <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/portfolio",
        element: <Portfolio />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/blog/:id",
        element: <BlogDetail />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/universitas-terbuka",
        element: <UniversitasTerbuka />,
      },
      {
        path: "/universitas-terbuka/photos",
        element: <PhotoResult />,
      },
    ],
  },

  // ============================================
  // ADMIN LOGIN
  // ============================================

  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  // ============================================
  // PROTECTED ADMIN
  // ============================================

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin/events",
        element: <Events />,
      },
      {
        path: "/admin/events/:eventId/students",
        element: <Students />,
      },
      {
        path: "/admin/events/:eventId/import",
        element: <BulkImport />,
      },
    ],
  },
]);
