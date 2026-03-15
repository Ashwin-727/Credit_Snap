import React from 'react';
import { 
  Home, 
  PenSquare, 
  Wallet, 
  BarChart2, 
  History, 
  HelpCircle, 
  Menu, 
  Bell, 
  UserCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, LabelList
} from 'recharts';

// --- MOCK DATA ---
const earningsData = [
  { month: 'Sep', earnings: 210000 },
  { month: 'Oct', earnings: 295000 },
  { month: 'Nov', earnings: 305000 },
  { month: 'Dec', earnings: 20000 },
  { month: 'Jan', earnings: 205000 },
  { month: 'Feb', earnings: 285000 },
  { month: 'Mar', earnings: 265000 },
];

const popularOrdersData = [
  { name: 'Cheese Maggie', value: 30, color: '#A78BFA' },
  { name: 'Masala Maggie', value: 25, color: '#FF8A8A' },
  { name: 'Chicken Biryani', value: 20, color: '#38BDF8' },
  { name: 'Burger', value: 15, color: '#FB923C' },
  { name: 'Others', value: 10, color: '#60A5FA' },
];

const weeklyOrdersData = [
  { day: 'Mon', orders: 167 },
  { day: 'Tue', orders: 182 },
  { day: 'Wed', orders: 140 },
  { day: 'Thu', orders: 189 },
  { day: 'Fri', orders: 162 },
  { day: 'Sat', orders: 223 },
  { day: 'Sun', orders: 247 },
];

export default function AnalyticsDashboard() {
  return (
    // Changed overflow-hidden to ensure the whole page never scrolls
    <div className="flex h-screen w-full bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <div className="w-[240px] bg-[#0E1F3B] text-white flex flex-col justify-between shrink-0 h-full">
        <div>
          <div className="p-6 pb-8">
            <Menu className="w-6 h-6 text-white cursor-pointer" />
          </div>

          <nav className="flex flex-col gap-2 px-4">
            <NavItem icon={<Home />} label="Home" />
            <NavItem icon={<PenSquare />} label="Edit Menu" />
            <NavItem icon={<Wallet />} label="Active Debts" />
            
            <div className="flex flex-col items-center justify-center py-3 bg-[#EAB308] rounded-xl text-white cursor-pointer shadow-md">
              <BarChart2 className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">Analytics</span>
            </div>
            
            <NavItem icon={<History />} label="History" />
            <NavItem icon={<HelpCircle />} label="Help" />
          </nav>
        </div>

        <div>
          <div className="h-[1px] bg-white/20 w-full mb-4"></div>
          <div className="px-8 pb-6 cursor-pointer hover:text-gray-300">
            <span className="text-lg font-medium">About us</span>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      {/* Changed overflow-y-auto to overflow-hidden so the content area doesn't scroll */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-[#0E1F3B]">
              <span className="text-xs font-bold text-[#0E1F3B]">CS</span>
            </div>
            <span className="text-xl font-bold text-[#0E1F3B]">CreditSnap</span>
          </div>
          <div className="flex items-center gap-6">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
            <UserCircle className="w-10 h-10 text-[#0E1F3B] cursor-pointer" />
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        {/* Adjusted padding and gap slightly, added flex-1 and min-h-0 */}
        <main className="flex-1 p-6 flex flex-col gap-6 min-h-0">
          
          {/* TOP SECTION: Earnings Area Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
            <div className="flex justify-between items-start mb-2 shrink-0">
              <div className="flex items-center">
                <span className="-rotate-90 origin-left text-gray-400 font-medium tracking-widest text-sm translate-y-12">
                  Earnings
                </span>
              </div>
              <p className="text-xs text-gray-400 italic">
                *This graph only presents the data collected from the orders done Through our website
              </p>
            </div>

            {/* Chart Container */}
            <div className="flex-1 w-full pl-6 min-h-0 flex flex-col">
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={true} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                    <YAxis axisLine={true} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `${value.toLocaleString()}`} />
                    <Tooltip />
                    <Area type="linear" dataKey="earnings" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Properly positioned Month label */}
              <div className="w-full text-center mt-1 shrink-0">
                <span className="text-gray-400 font-medium tracking-widest text-sm">Month</span>
              </div>
            </div>
          </div>
          {/* BOTTOM SECTION: Two Charts */}
          {/* Uses flex-1 so it splits the vertical space with the top chart */}
          <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
            
            {/* Bottom Left: Popular Orders Donut Chart */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center min-h-0">
              <h3 className="text-[#38BDF8] font-semibold text-lg mb-1 shrink-0">Most Popular Orders</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={popularOrdersData}
                      cx="50%"
                      cy="50%"
                      innerRadius="40%"
                      outerRadius="80%"
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {popularOrdersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      verticalAlign="bottom" 
                      height={30} 
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px', color: '#6B7280' }}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Right: Number of Orders Bar Chart */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center min-h-0">
              <h3 className="text-[#A78BFA] font-semibold text-lg mb-1 shrink-0">Number of Orders</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyOrdersData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="day" axisLine={true} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="orders" fill="#93C5FD" radius={[10, 10, 10, 10]} maxBarSize={40}>
                      {
                        weeklyOrdersData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#8B5CF6" />
                        ))
                      }
                      <LabelList dataKey="orders" position="center" fill="white" fontSize={12} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 text-gray-300 hover:text-white cursor-pointer hover:bg-white/5 rounded-xl transition-colors">
      <div className="mb-1">{icon}</div>
      <span className="text-sm">{label}</span>
    </div>
  );
}