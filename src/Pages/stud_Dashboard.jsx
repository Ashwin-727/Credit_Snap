import React, { useState } from 'react';
import { Menu, Home, Utensils, Wallet, History, HelpCircle, Bell, UserCircle, AlertTriangle } from 'lucide-react';

// 1. WE IMPORT YOUR LOGO HERE! 
// We use '../' to step out of the Pages folder and into the assets folder.
import studentLogo from '../assets/CreditSnap_logo_Student.png';

export default function StudDashboard() {
  const [totalDebt, setTotalDebt] = useState(0); 
  const [alerts, setAlerts] = useState([]); 
  const [currentOrders, setCurrentOrders] = useState([]); 

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-48 bg-[#1e293b] text-white flex flex-col justify-between">
        <div>
          <div className="p-4">
            <Menu className="w-8 h-8 cursor-pointer hover:text-orange-400 transition" />
          </div>

          <nav className="mt-4 flex flex-col gap-2">
            <div className="bg-[#f97316] mx-2 py-3 px-4 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-lg">
              <Home className="w-6 h-6 mb-1" />
              <span className="text-sm font-semibold">Home</span>
            </div>

            <div className="py-3 px-4 flex flex-col items-center justify-center text-gray-300 hover:text-white cursor-pointer opacity-70 transition">
              <Utensils className="w-6 h-6 mb-1" />
              <span className="text-sm">Canteens</span>
            </div>
            <div className="py-3 px-4 flex flex-col items-center justify-center text-gray-300 hover:text-white cursor-pointer opacity-70 transition">
              <Wallet className="w-6 h-6 mb-1" />
              <span className="text-sm text-center leading-tight">View debts</span>
            </div>
            <div className="py-3 px-4 flex flex-col items-center justify-center text-gray-300 hover:text-white cursor-pointer opacity-70 transition">
              <History className="w-6 h-6 mb-1" />
              <span className="text-sm">History</span>
            </div>
            <div className="py-3 px-4 flex flex-col items-center justify-center text-gray-300 hover:text-white cursor-pointer opacity-70 transition">
              <HelpCircle className="w-6 h-6 mb-1" />
              <span className="text-sm">Help</span>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-700 text-center cursor-pointer hover:bg-slate-700 transition">
          <span className="text-sm text-gray-300">About us</span>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
       {/* Top Navbar */}
        <header className="h-16 bg-[#f4f7fb] border-b flex justify-between items-center px-4 shadow-sm z-10 overflow-hidden">
          <div className="flex items-center h-full">
             {/* THE FIX: 
                h-full makes it span top-to-bottom.
                scale-[1.4] zooms it in to crop out the empty white space in your file!
                origin-left keeps it pinned to the left side while zooming.
             */}
             <img 
                src={studentLogo} 
                alt="CreditSnap Logo" 
                className="h-full w-auto object-contain mix-blend-multiply scale-[1.1] origin-left ml-2" 
             />
          </div>
          <div className="flex items-center gap-4 pr-2">
            <Bell className="w-6 h-6 text-gray-700 cursor-pointer hover:text-orange-500 transition" />
            <UserCircle className="w-8 h-8 text-gray-900 cursor-pointer hover:text-orange-500 transition" />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 overflow-y-auto flex-1">
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-2xl p-6 text-white flex-1 shadow-lg h-40 flex flex-col justify-between">
              <div>
                <p className="text-lg opacity-90">Total Debt:</p>
                <h1 className="text-4xl font-bold tracking-tight">₹{totalDebt.toFixed(2)}</h1>
              </div>
              {totalDebt > 0 && (
                <div>
                  <button className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-1.5 rounded-full font-semibold shadow-md transition">
                    Pay Now
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 flex-1 shadow-sm border border-gray-100 max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">Alerts</h2>
              </div>
              
              <div className="space-y-2">
                {alerts.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">You have no active alerts.</p>
                ) : (
                  alerts.map((alert, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-lg border-l-4 border-orange-400 bg-orange-50/50">
                      <span className="font-medium text-gray-800">{alert.canteen}</span>
                      <span className="text-sm font-semibold text-red-800">{alert.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Orders:</h2>
            <div className="space-y-4">
              {currentOrders.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                   <p className="text-gray-500">You have no active orders. Go to Canteens to order some food!</p>
                </div>
              ) : (
                currentOrders.map((order, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{order.items}</h3>
                      <p className="text-gray-600 text-sm">{order.canteen}, <span className="text-gray-500">{order.time}</span></p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">{order.status}</span>
                      <span className="font-semibold text-blue-900">Price: <span className="text-blue-600">₹{order.price}</span></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}