import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <main className="p-4 pt-20">
        <Outlet /> {/* ✅ This renders the current route's page */}
      </main>
    </div>
  );
};

export default Layout;