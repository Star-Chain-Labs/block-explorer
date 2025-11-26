// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import CommingSoon from "../components/CommingSoon";
// import { useState } from "react";
// // import Header from "../components/Header"; // Commented out to clarify if needed

// export const MainLayout = () => {
//   const [isCommingSoon, setIsCommingSoon] = useState(false);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar isCommingSoon={isCommingSoon} setIsCommingSoon={setIsCommingSoon} />
//       <main className="w-full flex-1 bg-gray-50 md:pt-24 pt-24 min-h-screen">
//         {isCommingSoon && <CommingSoon setIsCommingSoon={setIsCommingSoon} />}
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// };


import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CommingSoon from "../components/CommingSoon";
import { useState } from "react";

export const MainLayout = () => {
  const [isCommingSoon, setIsCommingSoon] = useState(false);
console.log(isCommingSoon)

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar
        isCommingSoon={isCommingSoon}
        setIsCommingSoon={setIsCommingSoon}
      />

      <main className="w-full flex-1 bg-gray-50 md:pt-24 pt-24 min-h-screen">
        <Outlet />
      </main>

      <Footer />

      {/* Popup ko hamesha sabke upar rakho */}
      {isCommingSoon && (
        <CommingSoon setIsCommingSoon={setIsCommingSoon} />
      )}
    </div>
  );
};
