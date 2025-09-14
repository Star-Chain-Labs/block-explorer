



// import React, { useState, useEffect } from "react";

// const yieldCards = [
//   { name: "Bastion Trading", description: "Institutional Credit", apy: "15.0%", tvl: "$10,519,434", logoColor: "bg-[#4f46e5]", icon: "🟪" },
//   { name: "Lido", description: "Liquid staking", apy: "3.7%", tvl: "$804,182", logoColor: "bg-[#0ea5e9]", icon: "💧" },
//   { name: "Steakhouse Financial", description: "Crypto & RWA-secured lending", apy: "8.2%", tvl: "$325,127", logoColor: "bg-[#8b5cf6]", icon: "🍽️" },
// ];

// const HeroSection = () => {
//   const [typedWord, setTypedWord] = useState("Sustainable");
//   const [currentTvl, setCurrentTvl] = useState(0);
//   const [generatedYield, setGeneratedYield] = useState(0);
//   const words = ["Sustainable", "Stable", "Consistent", "Reliable"];

//   useEffect(() => {
//     let wordIndex = 0;
//     let charIndex = 0;
//     let isDeleting = false;

//     const typingInterval = setInterval(() => {
//       if (!isDeleting && charIndex <= words[wordIndex].length) {
//         setTypedWord(words[wordIndex].substring(0, charIndex));
//         charIndex++;
//       } else if (isDeleting && charIndex >= 0) {
//         setTypedWord(words[wordIndex].substring(0, charIndex));
//         charIndex--;
//       }

//       if (charIndex === words[wordIndex].length + 1) {
//         isDeleting = true;
//       } else if (charIndex === 0 && isDeleting) {
//         isDeleting = false;
//         wordIndex = (wordIndex + 1) % words.length;
//       }
//     }, 200);

//     const animateTvl = setInterval(() => {
//       if (currentTvl < 125574633) setCurrentTvl((prev) => prev + 1000000);
//       if (generatedYield < 20057186) setGeneratedYield((prev) => prev + 100000);
//     }, 10);

//     return () => {
//       clearInterval(typingInterval);
//       clearInterval(animateTvl);
//     };
//   }, [currentTvl, generatedYield]);

//   return (
//     <div className="relative h-screen w-full bg-gradient-to-r from-[#249ec7] via-[#071232] to-[#071232] text-white flex flex-col justify-center items-center px-6 overflow-hidden">
//       <div className="absolute inset-0 opacity-60" style={{
//         background: `
//           radial-gradient(circle at center, rgba(37, 212, 208, 0.15) 0%, rgba(7, 18, 50, 0.9) 70%),
//           radial-gradient(circle at 50% 50%, transparent 150px, rgba(255, 255, 255, 0.08) 155px, transparent 160px),
//           radial-gradient(circle at 50% 50%, transparent 250px, rgba(255, 255, 255, 0.06) 255px, transparent 260px),
//           radial-gradient(circle at 50% 50%, transparent 350px, rgba(255, 255, 255, 0.04) 355px, transparent 360px),
//           radial-gradient(circle at 50% 50%, transparent 450px, rgba(255, 255, 255, 0.03) 455px, transparent 460px),
//           radial-gradient(circle at 50% 50%, transparent 550px, rgba(255, 255, 255, 0.02) 555px, transparent 560px)
//         `
//       }} />

//       <div className="absolute inset-0 flex items-center justify-center">
//         <div className="relative w-full h-full max-w-6xl max-h-6xl">
//           <div className="absolute inset-0 animate-spin" style={{ animationDuration: '60s', animationDirection: 'normal' }}>
//             <svg className="w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
//               <circle cx="300" cy="300" r="120" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" fill="none" strokeDasharray="8,12" />
//               <circle cx="300" cy="300" r="180" stroke="rgba(37, 212, 208, 0.08)" strokeWidth="0.8" fill="none" strokeDasharray="12,8" />
//               <circle cx="300" cy="300" r="240" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.6" fill="none" strokeDasharray="6,10" />
//             </svg>
//           </div>
//           <div className="absolute inset-0 animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }}>
//             <svg className="w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
//               <circle cx="300" cy="300" r="150" stroke="rgba(37, 212, 208, 0.1)" strokeWidth="0.8" fill="none" strokeDasharray="10,6" />
//               <circle cx="300" cy="300" r="210" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.6" fill="none" strokeDasharray="4,8" />
//               <circle cx="300" cy="300" r="270" stroke="rgba(37, 212, 208, 0.04)" strokeWidth="0.4" fill="none" strokeDasharray="8,6" />
//             </svg>
//           </div>
//           <div className="absolute inset-0">
//             <svg className="w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
//               <circle cx="300" cy="300" r="100" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5" fill="none" />
//               <circle cx="300" cy="300" r="320" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.4" fill="none" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="absolute -left-20 -top-20 -z-10">
//         <div className="w-[50rem] h-[50rem] rounded-full border border-white/10 opacity-20"></div>
//       </div>

//       <div className="z-10 text-center pt-20">
//         <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
//           <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//             Your Unique Edge For{" "}
//           </span>
//           <br />
//           <span 
//             className="text-[#25d4d0] inline-block animate-fade-in-up bg-gradient-to-r from-[#25d4d0] to-[#1a9b96] bg-clip-text text-transparent"
//             style={{ animationDelay: '0.6s' }}
//           >
//             {typedWord}
//           </span>
//           <span className="inline-block animate-fade-in-up" style={{ animationDelay: '1s' }}>
//             {" "}Yields
//           </span>
//         </h1>
//       </div>

//       <div className="flex flex-col md:flex-row gap-6 mt-16 z-10">
//         {yieldCards.map((card, index) => (
//           <div
//             key={index}
//             className="bg-[#1a2433]/80 backdrop-blur-sm rounded-2xl p-6 w-full md:w-80 shadow-lg flex flex-col justify-between transform transition-all hover:scale-105 hover:shadow-xl hover:bg-[#1a2433] animate-fade-in-up border border-white/10"
//             style={{ animationDelay: `${1.4 + index * 0.2}s` }}
//           >
//             <div className="flex items-center gap-3 mb-2">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${card.logoColor} shadow-lg`}>
//                 {card.icon}
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold">{card.name}</h2>
//                 <p className="text-sm text-gray-400">Up to</p>
//               </div>
//             </div>
//             <div className="text-2xl font-bold text-[#25d4d0]">
//               {card.apy} <span className="text-gray-400 text-base font-medium">APY</span>
//             </div>
//             <div className="mt-6 flex justify-between items-center">
//               <span className="bg-[#2c3749]/70 backdrop-blur-sm text-sm px-3 py-1 rounded-full border border-white/10">
//                 {card.tvl} TVL
//               </span>
//               <button className="text-white p-2 rounded-full bg-[#25d4d0]/20 hover:bg-[#25d4d0]/30 transition-all hover:scale-110 border border-[#25d4d0]/30">
//                 →
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Dummy Logos at Bottom Left */}
//     <div className="absolute bottom-10 left-10 flex flex-col gap-4 z-10">
//   <p className="text-white text-sm font-medium opacity-80">
//     Trusted by
//   </p>
//   <div className="flex gap-6">
//     <img 
//       src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
//       alt="Google Logo" 
//       className="w-14 h-14 object-contain opacity-60 hover:opacity-100 transition-opacity" 
//     />
    
//     <img 
//       src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
//       alt="PayPal Logo" 
//       className="w-14 h-14 object-contain opacity-60 hover:opacity-100 transition-opacity" 
//     />
   
//     <img 
//       src="https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg" 
//       alt="Binance Logo" 
//       className="w-14 h-14 object-contain opacity-60 hover:opacity-100 transition-opacity" 
//     />
//   </div>
// </div>



//       {/* Animated TVL and Generated Yield at Right Bottom */}
//       <div className="absolute bottom-5  right-10 flex gap-10  items-center z-10  text-sm">
//         <div className="">
//           <p>Current TVL</p>
//           <p className="text-2xl font-bold">${currentTvl.toLocaleString()}</p>
//         </div>
//         <div>
//           <p>Generated Yield</p>
//           <p className="text-2xl font-bold">${generatedYield.toLocaleString()}</p>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in-up {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
//       `}</style>
//     </div>
//   );
// };

// export default HeroSection;




// import React, { useState, useEffect } from "react";

// const yieldCards = [
//   { name: "Bastion Trading", description: "Institutional Credit", apy: "15.0%", tvl: "$10,519,434", logoColor: "bg-[#4f46e5]", icon: "🟪" },
//   { name: "Lido", description: "Liquid staking", apy: "3.7%", tvl: "$804,182", logoColor: "bg-[#0ea5e9]", icon: "💧" },
//   { name: "Steakhouse Financial", description: "Crypto & RWA-secured lending", apy: "8.2%", tvl: "$325,127", logoColor: "bg-[#8b5cf6]", icon: "🍽️" },
// ];

// const HeroSection = () => {
//   const [typedWord, setTypedWord] = useState("Sustainable");
//   const [currentTvl, setCurrentTvl] = useState(0);
//   const [generatedYield, setGeneratedYield] = useState(0);
//   const words = ["Sustainable", "Stable", "Consistent", "Reliable"];

//   useEffect(() => {
//     let wordIndex = 0;
//     let charIndex = 0;
//     let isDeleting = false;

//     const typingInterval = setInterval(() => {
//       if (!isDeleting && charIndex <= words[wordIndex].length) {
//         setTypedWord(words[wordIndex].substring(0, charIndex));
//         charIndex++;
//       } else if (isDeleting && charIndex >= 0) {
//         setTypedWord(words[wordIndex].substring(0, charIndex));
//         charIndex--;
//       }

//       if (charIndex === words[wordIndex].length + 1) {
//         isDeleting = true;
//       } else if (charIndex === 0 && isDeleting) {
//         isDeleting = false;
//         wordIndex = (wordIndex + 1) % words.length;
//       }
//     }, 200);

//     const animateTvl = setInterval(() => {
//       if (currentTvl < 125574633) setCurrentTvl((prev) => prev + 1000000);
//       if (generatedYield < 20057186) setGeneratedYield((prev) => prev + 100000);
//     }, 10);

//     return () => {
//       clearInterval(typingInterval);
//       clearInterval(animateTvl);
//     };
//   }, [currentTvl, generatedYield]);

//   return (
//     <div className="relative min-h-screen w-full bg-gradient-to-r from-[#249ec7] via-[#071232] to-[#071232] text-white overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0 opacity-60" style={{
//         background: `
//           radial-gradient(circle at center, rgba(37, 212, 208, 0.15) 0%, rgba(7, 18, 50, 0.9) 70%),
//           radial-gradient(circle at 50% 50%, transparent 150px, rgba(255, 255, 255, 0.08) 155px, transparent 160px),
//           radial-gradient(circle at 50% 50%, transparent 250px, rgba(255, 255, 255, 0.06) 255px, transparent 260px),
//           radial-gradient(circle at 50% 50%, transparent 350px, rgba(255, 255, 255, 0.04) 355px, transparent 360px),
//           radial-gradient(circle at 50% 50%, transparent 450px, rgba(255, 255, 255, 0.03) 455px, transparent 460px),
//           radial-gradient(circle at 50% 50%, transparent 550px, rgba(255, 255, 255, 0.02) 555px, transparent 560px)
//         `
//       }} />

//       {/* Animated Background Circles - Hidden on small screens */}
//       <div className="absolute inset-0 hidden md:flex items-center justify-center">
//         <div className="relative w-full h-full max-w-6xl max-h-6xl">
//           <div className="absolute inset-0 animate-spin" style={{ animationDuration: '60s', animationDirection: 'normal' }}>
//             <svg className="w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
//               <circle cx="300" cy="300" r="120" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" fill="none" strokeDasharray="8,12" />
//               <circle cx="300" cy="300" r="180" stroke="rgba(37, 212, 208, 0.08)" strokeWidth="0.8" fill="none" strokeDasharray="12,8" />
//               <circle cx="300" cy="300" r="240" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.6" fill="none" strokeDasharray="6,10" />
//             </svg>
//           </div>
//           <div className="absolute inset-0 animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }}>
//             <svg className="w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
//               <circle cx="300" cy="300" r="150" stroke="rgba(37, 212, 208, 0.1)" strokeWidth="0.8" fill="none" strokeDasharray="10,6" />
//               <circle cx="300" cy="300" r="210" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.6" fill="none" strokeDasharray="4,8" />
//               <circle cx="300" cy="300" r="270" stroke="rgba(37, 212, 208, 0.04)" strokeWidth="0.4" fill="none" strokeDasharray="8,6" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Container */}
//       <div className="relative z-10 flex flex-col min-h-screen">
//         {/* Header Section */}
//         <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
//           {/* Title */}
//           <div className="text-center mb-8 sm:mb-12 lg:mb-16">
//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
//               <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//                 Your Unique Edge For{" "}
//               </span>
//               <br />
//               <span 
//                 className="text-[#25d4d0] inline-block animate-fade-in-up bg-gradient-to-r from-[#25d4d0] to-[#1a9b96] bg-clip-text text-transparent"
//                 style={{ animationDelay: '0.6s' }}
//               >
//                 {typedWord}
//               </span>
//               <span className="inline-block animate-fade-in-up" style={{ animationDelay: '1s' }}>
//                 {" "}Yields
//               </span>
//             </h1>
//           </div>

//           {/* Yield Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl px-4">
//             {yieldCards.map((card, index) => (
//               <div
//                 key={index}
//                 className="bg-[#1a2433]/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col justify-between transform transition-all hover:scale-105 hover:shadow-xl hover:bg-[#1a2433] animate-fade-in-up border border-white/10"
//                 style={{ animationDelay: `${1.4 + index * 0.2}s` }}
//               >
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl ${card.logoColor} shadow-lg`}>
//                     {card.icon}
//                   </div>
//                   <div>
//                     <h2 className="text-base sm:text-lg font-semibold">{card.name}</h2>
//                     <p className="text-xs sm:text-sm text-gray-400">Up to</p>
//                   </div>
//                 </div>
//                 <div className="text-xl sm:text-2xl font-bold text-[#25d4d0] mb-4">
//                   {card.apy} <span className="text-gray-400 text-sm sm:text-base font-medium">APY</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="bg-[#2c3749]/70 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full border border-white/10">
//                     {card.tvl} TVL
//                   </span>
//                   <button className="text-white p-1.5 sm:p-2 rounded-full bg-[#25d4d0]/20 hover:bg-[#25d4d0]/30 transition-all hover:scale-110 border border-[#25d4d0]/30">
//                     →
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//           {/* Stats Section */}
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 mb-8">
//             <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 text-center sm:text-left">
//               <div>
//                 <p className="text-sm sm:text-base opacity-80">Current TVL</p>
//                 <p className="text-xl sm:text-2xl font-bold">${currentTvl.toLocaleString()}</p>
//               </div>
//               <div>
//                 <p className="text-sm sm:text-base opacity-80">Generated Yield</p>
//                 <p className="text-xl sm:text-2xl font-bold">${generatedYield.toLocaleString()}</p>
//               </div>
//             </div>

//             {/* Trusted by Logos */}
//             <div className="flex flex-col items-center sm:items-end gap-3">
//               <p className="text-white text-sm font-medium opacity-80">
//                 Trusted by
//               </p>
//               <div className="flex gap-4 sm:gap-6">
//                 <img 
//                   src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
//                   alt="Google Logo" 
//                   className="w-10 h-10 sm:w-12 sm:h-12 object-contain opacity-60 hover:opacity-100 transition-opacity" 
//                 />
//                 <img 
//                   src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
//                   alt="PayPal Logo" 
//                   className="w-10 h-10 sm:w-12 sm:h-12 object-contain opacity-60 hover:opacity-100 transition-opacity" 
//                 />
//                 <img 
//                   src="https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg" 
//                   alt="Binance Logo" 
//                   className="w-10 h-10 sm:w-12 sm:h-12 object-contain opacity-60 hover:opacity-100 transition-opacity" 
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in-up {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
//       `}</style>
//     </div>
//   );
// };

// export default HeroSection;



import React, { useState, useEffect } from "react";

const yieldCards = [
  { name: "Bastion Trading", description: "Institutional Credit", apy: "15.0%", tvl: "$10,519,434", logoColor: "bg-[#4f46e5]", icon: "🟪" },
  { name: "Lido", description: "Liquid staking", apy: "3.7%", tvl: "$804,182", logoColor: "bg-[#0ea5e9]", icon: "💧" },
  { name: "Steakhouse Financial", description: "Crypto & RWA-secured lending", apy: "8.2%", tvl: "$325,127", logoColor: "bg-[#8b5cf6]", icon: "🍽️" },
];

const HeroSection = () => {
  const [typedWord, setTypedWord] = useState("Sustainable");
  const [currentTvl, setCurrentTvl] = useState(0);
  const [generatedYield, setGeneratedYield] = useState(0);
  const words = ["Sustainable", "Stable", "Consistent", "Reliable"];

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typingInterval = setInterval(() => {
      if (!isDeleting && charIndex <= words[wordIndex].length) {
        setTypedWord(words[wordIndex].substring(0, charIndex));
        charIndex++;
      } else if (isDeleting && charIndex >= 0) {
        setTypedWord(words[wordIndex].substring(0, charIndex));
        charIndex--;
      }

      if (charIndex === words[wordIndex].length + 1) {
        isDeleting = true;
      } else if (charIndex === 0 && isDeleting) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }, 200);

    const animateTvl = setInterval(() => {
      if (currentTvl < 125574633) setCurrentTvl((prev) => prev + 1000000);
      if (generatedYield < 20057186) setGeneratedYield((prev) => prev + 100000);
    }, 10);

    return () => {
      clearInterval(typingInterval);
      clearInterval(animateTvl);
    };
  }, [currentTvl, generatedYield]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-r from-[#249ec7] via-[#071232] to-[#071232] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-60" style={{
        background: `
          radial-gradient(circle at center, rgba(37, 212, 208, 0.15) 0%, rgba(7, 18, 50, 0.9) 70%),
          radial-gradient(circle at 50% 50%, transparent 150px, rgba(255, 255, 255, 0.08) 155px, transparent 160px),
          radial-gradient(circle at 50% 50%, transparent 250px, rgba(255, 255, 255, 0.06) 255px, transparent 260px),
          radial-gradient(circle at 50% 50%, transparent 350px, rgba(255, 255, 255, 0.04) 355px, transparent 360px),
          radial-gradient(circle at 50% 50%, transparent 450px, rgba(255, 255, 255, 0.03) 455px, transparent 460px),
          radial-gradient(circle at 50% 50%, transparent 550px, rgba(255, 255, 255, 0.02) 555px, transparent 560px)
        `
      }} />

      {/* Animated Background Circles - Hidden on small screens */}
      <div className="absolute inset-0 hidden md:flex items-center justify-center">
        <div className="relative w-full h-full max-w-6xl max-h-6xl">
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '60s', animationDirection: 'normal' }}>
            <svg className="w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
              <circle cx="300" cy="300" r="120" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" fill="none" strokeDasharray="8,12" />
              <circle cx="300" cy="300" r="180" stroke="rgba(37, 212, 208, 0.08)" strokeWidth="0.8" fill="none" strokeDasharray="12,8" />
              <circle cx="300" cy="300" r="240" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.6" fill="none" strokeDasharray="6,10" />
            </svg>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }}>
            <svg className="w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
              <circle cx="300" cy="300" r="150" stroke="rgba(37, 212, 208, 0.1)" strokeWidth="0.8" fill="none" strokeDasharray="10,6" />
              <circle cx="300" cy="300" r="210" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.6" fill="none" strokeDasharray="4,8" />
              <circle cx="300" cy="300" r="270" stroke="rgba(37, 212, 208, 0.04)" strokeWidth="0.4" fill="none" strokeDasharray="8,6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 pt-40 sm:pt-44 lg:pt-40">
          {/* Title */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Your Unique Edge For{" "}
              </span>
              <br />
              <span 
                className="text-[#25d4d0] inline-block animate-fade-in-up bg-gradient-to-r from-[#25d4d0] to-[#1a9b96] bg-clip-text text-transparent"
                style={{ animationDelay: '0.6s' }}
              >
                {typedWord}
              </span>
              <span className="inline-block animate-fade-in-up" style={{ animationDelay: '1s' }}>
                {" "}Yields
              </span>
            </h1>
          </div>

          {/* Yield Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl px-4">
            {yieldCards.map((card, index) => (
              <div
                key={index}
                className="bg-[#1a2433]/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col justify-between transform transition-all hover:scale-105 hover:shadow-xl hover:bg-[#1a2433] animate-fade-in-up border border-white/10"
                style={{ animationDelay: `${1.4 + index * 0.2}s` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl ${card.logoColor} shadow-lg`}>
                    {card.icon}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">{card.name}</h2>
                    <p className="text-xs sm:text-sm text-gray-400">Up to</p>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#25d4d0] mb-4">
                  {card.apy} <span className="text-gray-400 text-sm sm:text-base font-medium">APY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="bg-[#2c3749]/70 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full border border-white/10">
                    {card.tvl} TVL
                  </span>
                  <button className="text-white p-1.5 sm:p-2 rounded-full bg-[#25d4d0]/20 hover:bg-[#25d4d0]/30 transition-all hover:scale-110 border border-[#25d4d0]/30">
                    →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Stats Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 text-center sm:text-left">
              <div>
                <p className="text-sm sm:text-base opacity-80">Current TVL</p>
                <p className="text-xl sm:text-2xl font-bold">${currentTvl.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm sm:text-base opacity-80">Generated Yield</p>
                <p className="text-xl sm:text-2xl font-bold">${generatedYield.toLocaleString()}</p>
              </div>
            </div>

            {/* Trusted by Logos */}
            <div className="flex flex-col items-center sm:items-end gap-3">
              <p className="text-white text-sm font-medium opacity-80">
                Trusted by
              </p>
              <div className="flex gap-4 sm:gap-6">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
                  alt="Google Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain opacity-60 hover:opacity-100 transition-opacity" 
                />
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                  alt="PayPal Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain opacity-60 hover:opacity-100 transition-opacity" 
                />
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg" 
                  alt="Binance Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain opacity-60 hover:opacity-100 transition-opacity" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default HeroSection;