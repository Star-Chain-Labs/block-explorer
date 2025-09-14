import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export const  MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
