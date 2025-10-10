import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Header from "../components/Header";
// import Header from "../components/Header"; // Commented out to clarify if needed

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <main className="flex-1 bg-gray-50 md:pt-36 pt-22 ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};