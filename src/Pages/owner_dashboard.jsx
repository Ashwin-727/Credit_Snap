import React, { useState } from 'react';
import canteenLogo from '../assets/CreditSnap_logo_Canteen.png';

export default function CreditSnapDashboard() {
  // State to manage the canteen toggle switch
  const [isCanteenOpen, setIsCanteenOpen] = useState(true);
  
  // State to manage orders. It starts empty so "No Current Orders" shows by default.
  const [orders, setOrders] = useState([]);

  return (
    <div className="credit-snap-wrapper">
      <style>{`
        /* --- RESET & BASIC SETUP --- */
        .credit-snap-wrapper {
            background-color: #EEF4ED; 
            height: 100vh;
            overflow: hidden;
            display: flex;
        }

        .credit-snap-wrapper * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* --- SIDEBAR --- */
        .sidebar {
            width: 260px;
            background-color: #0D2137; /* Navy Blue */
            color: white;
            display: flex;
            flex-direction: column;
            padding: 20px 0;
            flex-shrink: 0;
            z-index: 100;
        }

        .hamburger {
            padding: 0 25px 30px;
            cursor: pointer;
            fill: white;
        }

        .nav-list {
            list-style: none;
            flex-grow: 1;
        }

        .nav-item {
            cursor: pointer;
            margin-bottom: 5px;
            transition: all 0.2s ease;
            position: relative;
        }

        .nav-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 15px 0;
            color: white;
            text-decoration: none;
            font-size: 14px;
            font-weight: 400;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            margin-bottom: 8px;
            fill: white;
        }

        /* ACTIVE STATE */
        .nav-item.active {
            margin: 0 15px;
            background-color: #D9901C; /* Golden Orange */
            border-radius: 6px;
        }

        /* HOVER STATE */
        .nav-item:not(.active):hover {
            margin: 0 15px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
        }

        /* ABOUT US - CENTERED */
        .sidebar-footer {
            padding: 20px 25px;
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: center; 
            align-items: center;     
        }
        
        .sidebar-footer a {
            color: white;
            text-decoration: none;
            font-size: 15px;
        }

        /* --- MAIN CONTENT --- */
        .main-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* --- HEAD BAR --- */
        .header {
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            background-color: #EBF5FB; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            z-index: 10;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .brand-logo-img {
            height: 50px; 
            width: auto;
        }

        .brand-name {
            font-size: 20px;
            font-weight: 700;
            color: #C08020; 
        }

        .header-icons {
            display: flex;
            gap: 25px;
            align-items: center;
        }
        .header-icon {
            width: 28px;
            height: 28px;
            cursor: pointer;
            fill: #0D2137;
        }

        /* --- DASHBOARD AREA --- */
        .dashboard {
            padding: 10px 40px 40px;
            overflow-y: auto;
            flex-grow: 1;
        }

        .page-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 30px 0; 
        }

        .page-title {
            font-size: 34px;
            font-weight: 400;
            color: #000;
        }

        .canteen-status {
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 22px;
            font-weight: 400;
        }

        /* TOGGLE SWITCH */
        .switch {
            position: relative;
            display: inline-block;
            width: 64px;
            height: 34px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #D00000;
            transition: .4s;
            border-radius: 34px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider { background-color: #38b000; } 
        input:checked + .slider:before { transform: translateX(30px); }

        /* --- CARDS --- */
        .card-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .order-card {
            background: white;
            border-radius: 20px;
            padding: 25px 35px;
            display: grid;
            grid-template-columns: 1.5fr 1fr 0.8fr; 
            align-items: center;
            gap: 30px; 
            position: relative;
            box-shadow: 0 4px 10px rgba(0,0,0,0.06);
        }

        /* Column 1: Info */
        .info-col h2 {
            font-size: 22px;
            font-weight: 500;
            color: #000;
            margin-bottom: 2px; 
        }
        .info-col p {
            font-size: 13px;
            color: #888;
            margin-bottom: 2px; 
            line-height: 1.2;
        }
        .info-col p:last-child {
            margin-bottom: 0;
        }

        /* Column 2: Items */
        .items-col {
            display: flex;
            flex-direction: column;
            gap: 4px; 
            justify-content: center;
        }
        .item-text {
            font-size: 16px;
            color: #000;
            font-weight: 400;
        }

        /* Column 3: Actions */
        .action-col {
            display: flex;
            flex-direction: column;
            align-items: flex-end; 
            justify-content: center;
            gap: 15px;
        }
        
        .price {
            font-size: 26px;
            font-weight: 500;
            color: #000;
            margin-right: 20px; 
        }

        .btn-group {
            display: flex;
            gap: 10px;
        }
        .btn {
            border: none;
            padding: 8px 25px;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .btn-accept { background-color: #98ea98; color: #155e15; }
        .btn-reject { background-color: #ff9999; color: #7a1c1c; }
        
        .debt-badge {
            background-color: #ffe0b2;
            color: #e65100;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
        }

        .close-x {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 18px; 
            color: #999;
            cursor: pointer;
            background: none;
            border: none;
        }

        /* Empty State */
        .empty-state {
            display: none;
            height: 60vh;
            align-items: center;
            justify-content: center;
        }
        .empty-text {
            font-size: 64px;
            font-weight: 700;
            letter-spacing: -2px;
            color: black;
        }
      `}</style>

      <nav className="sidebar">
        <div className="hamburger">
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </div>

        <ul className="nav-list">
          <li className="nav-item active">
            <a href="#" className="nav-link">
              <svg className="nav-icon" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              <span>Home</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <svg className="nav-icon" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              <span>Edit Menu</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <svg className="nav-icon" viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              <span>Active Debts</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <svg className="nav-icon" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
              <span>Analytics</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <svg className="nav-icon" viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
              <span>History</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <svg className="nav-icon" viewBox="0 0 24 24"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
              <span>Help</span>
            </a>
          </li>
        </ul>

        <div className="sidebar-footer">
          <a href="#">About us</a>
        </div>
      </nav>

      <main className="main-content">
        <div className="header">
          <div className="brand">
            <img src={canteenLogo} alt="CreditSnap Logo" className="brand-logo-img" />
          </div>
          <div className="header-icons">
            <svg className="header-icon" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
            <svg className="header-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
        </div>

        <div className="dashboard">
          <div className="page-title-row">
            <h1 className="page-title">Active Orders</h1>
            <div className="canteen-status">
              <span>Canteen Status:</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isCanteenOpen} 
                  onChange={() => setIsCanteenOpen(!isCanteenOpen)} 
                  id="statusToggle" 
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div 
            id="cardsList" 
            className="card-container" 
            style={{ display: (isCanteenOpen && orders.length > 0) ? 'flex' : 'none' }}
          >
            {/* Example of how an order card is structured when you are ready to map over the 'orders' array */}
            {/* <div className="order-card">
              <div className="info-col">
                <h2>Student Name</h2>
                <p>Ph no. +91xxxxxxxxx, Hall 3, B116</p>
                <p>Time: 9:32 PM</p>
              </div>
              <div className="items-col">
                <span className="item-text">Cheese Maggie x1</span>
                <span className="item-text">Chai x1</span>
              </div>
              <div className="action-col">
                <span className="price">₹60</span>
                <div className="btn-group">
                  <button className="btn btn-accept">Accept</button>
                  <button className="btn btn-reject">Reject</button>
                </div>
              </div>
            </div> 
            */}
          </div>

          <div 
            id="emptyState" 
            className="empty-state"
            style={{ display: (!isCanteenOpen || orders.length === 0) ? 'flex' : 'none' }}
          >
            <span className="empty-text">No Current Orders</span>
          </div>

        </div>
      </main>
    </div>
  );
}