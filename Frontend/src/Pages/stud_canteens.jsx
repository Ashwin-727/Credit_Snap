import React, { useState, useEffect } from 'react';
import axios from 'axios';
// In stud_canteens.jsx
const response = await axios.get('http://localhost:5000/api/users/canteens');
const StudentCanteens = () => {
  // --- 1. STATES ---
  const [step, setStep] = useState('list'); 
  const [canteensData, setCanteensData] = useState([]); 
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [cart, setCart] = useState({}); 
  const [loading, setLoading] = useState(true);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all"); 
  const [sortBy, setSortBy] = useState(""); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // --- 2. FETCH CANTEENS (OWNERS) FROM BACKEND ---
  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        // This hits your backend which should return users with role: 'owner'
        const response = await axios.get('http://localhost:5000/api/users/canteens');
        
        if (response.data.status === 'success') {
          // Map backend data to match the UI needs (Timings/Status)
          const formatted = response.data.data.map(c => ({
            ...c,
            status: c.status || "Open", // Defaulting to Open as requested
            timings: c.timings || "4:00 PM - 4:00 AM"
          }));
          setCanteensData(formatted);
        }
      } catch (err) {
        console.error("Error fetching canteens:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCanteens();
  }, []);

  const menuData = [
    { id: 1, name: "Plain Maggie", price: 25, type: "veg" },
    { id: 2, name: "Plain Dosa", price: 50, type: "veg" },
    { id: 3, name: "Cheese Maggie", price: 50, type: "veg" },
    { id: 4, name: "Masala Maggie", price: 35, type: "veg" },
    { id: 5, name: "Chicken Biryani", price: 120, type: "non-veg" },
    { id: 6, name: "Veg Biryani", price: 60, type: "veg" },
  ];

  // --- 3. INTEGRATION: PLACE DEBT REQUEST ---
  const handlePlaceDebtRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const orderData = {
        canteenId: selectedCanteen._id, // This will be 69bc3ae44c89e28e5c10ee60
        items: Object.entries(cart).map(([id, qty]) => {
          const item = menuData.find(i => i.id === parseInt(id));
          return { name: item.name, quantity: qty, price: item.price };
        }),
        totalAmount: getTotalCost()
      };

      const response = await axios.post('http://localhost:5000/api/orders/place', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'success') {
        alert(`Success! Request sent to ${selectedCanteen.name}`);
        goToList(); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Order failed. Please log in again.");
    }
  };

  // --- 4. HELPER FUNCTIONS ---
  const goToMenu = (canteen) => {
    if (canteen.status === "Closed") return;
    setSelectedCanteen(canteen);
    setSearchQuery("");
    setStep('menu');
  };

  const goToList = () => {
    setStep('list');
    setCart({}); 
    setSelectedCanteen(null);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const getTotalCost = () => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = menuData.find(i => i.id === parseInt(id));
      return total + (item.price * qty);
    }, 0);
  };

  const getCartSummaryText = () => {
    return Object.entries(cart).map(([id, qty]) => {
      const item = menuData.find(i => i.id === parseInt(id));
      return `${item.name} x${qty}`;
    }).join(", ");
  };

  // --- 5. SEARCH & FILTER LOGIC ---
  let displayCanteens = canteensData.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  if (filterBy === 'open') displayCanteens = displayCanteens.filter(c => c.status === "Open");
  
  let displayMenu = menuData.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const styles = `
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    .controls-row { display: flex; justify-content: space-between; margin-bottom: 30px; align-items: center;}
    .search-bar { background: white; padding: 12px 20px; border-radius: 25px; display: flex; align-items: center; width: 450px; border: 1px solid #ddd;}
    .search-bar input { border: none; outline: none; margin-left: 10px; width: 100%; font-size: 16px;}
    .dropdown-btn { background: #f97316; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;}
    .canteen-list { display: flex; flex-direction: column; gap: 15px; }
    .canteen-card { background: white; padding: 20px 30px; border-radius: 15px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; cursor: pointer;}
    .status-badge.open { background-color: #D1FAE5; color: #065F46; padding: 5px 15px; border-radius: 20px; font-weight: bold;}
    .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .menu-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;}
    .cart-bar { position: fixed; bottom: 0; right: 0; width: calc(100% - 192px); background: #F8FAFC; border-top: 1px solid #ddd; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; z-index: 40;}
    .btn-checkout, .btn-debt { background: #f97316; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; cursor: pointer;}
    .checkout-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px;}
    .checkout-table th, .checkout-table td { padding: 15px; border-bottom: 1px solid #eee; text-align: left;}
  `;

  if (loading) return <div className="p-8 text-center text-xl">Connecting to Canteens...</div>;

  return (
    <>
      <style>{styles}</style>
      <main className="p-8 overflow-y-auto w-full h-full pb-32 bg-[#EEF4ED]">
        
        {step !== 'list' && (
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <i className="fa-solid fa-arrow-left mr-4 cursor-pointer text-gray-500" onClick={step === 'menu' ? goToList : () => setStep('menu')}></i>
            {selectedCanteen?.name}
          </h1>
        )}

        {step !== 'checkout' && (
          <div className="controls-row">
            <div className="search-bar">
              <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
              <input 
                type="text" 
                placeholder={step === 'list' ? "Search for Canteen" : "Search for Item"} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 'list' && (
          <div className="canteen-list">
            {displayCanteens.map(canteen => (
              <div key={canteen._id} className="canteen-card" onClick={() => goToMenu(canteen)}>
                <div>
                  <h2 className="text-xl font-semibold">{canteen.name}</h2>
                  <p className="text-gray-500">Timings: {canteen.timings}</p>
                </div>
                <div className="status-badge open">{canteen.status}</div>
              </div>
            ))}
          </div>
        )}

        {step === 'menu' && (
          <div className="menu-grid">
            {displayMenu.map(item => (
              <div className="menu-card" key={item.id}>
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-blue-600 font-bold">₹{item.price}</p>
                </div>
                {!cart[item.id] ? (
                  <button className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold" onClick={() => updateQuantity(item.id, 1)}>Order</button>
                ) : (
                  <div className="flex items-center border rounded-full px-2 bg-gray-50">
                    <button className="px-2 font-bold" onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span className="px-4 font-bold">{cart[item.id]}</span>
                    <button className="px-2 font-bold" onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 'checkout' && (
          <div className="max-w-4xl mx-auto">
            <table className="checkout-table shadow-sm">
              <thead>
                <tr><th>Food items</th><th>Quantity</th><th>Cost</th></tr>
              </thead>
              <tbody>
                {Object.entries(cart).map(([id, qty]) => {
                  const item = menuData.find(i => i.id === parseInt(id));
                  return (
                    <tr key={id}>
                      <td>{item.name}</td>
                      <td>{qty}</td>
                      <td className="font-bold">₹{item.price * qty}</td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-100 font-bold">
                  <td colSpan="2" className="text-right">Total:</td>
                  <td className="text-orange-600">₹{getTotalCost()}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-center mt-10">
              <button className="btn-debt text-lg" onClick={handlePlaceDebtRequest}>Place Debt Request</button>
            </div>
          </div>
        )}

      </main>
      
      {step === 'menu' && Object.keys(cart).length > 0 && (
        <div className="cart-bar">
          <div>
            <h4 className="text-sm text-gray-500">{getCartSummaryText()}</h4>
            <p className="text-xl font-bold">Total: ₹{getTotalCost()}</p>
          </div>
          <button className="btn-checkout" onClick={() => setStep('checkout')}>Check Out</button>
        </div>
      )}
    </>
  );
};

export default StudentCanteens;