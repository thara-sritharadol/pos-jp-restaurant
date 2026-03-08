// src/App.jsx
import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import PosDashboard from './pages/PosDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('pos');
  
  // 🌟 1. เพิ่ม State สำหรับเก็บ Role
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // ดึง Role ขึ้นมาด้วย
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  // 🌟 2. รับค่า Role ตอน Login สำเร็จ
  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // ล้าง Role ทิ้งตอนออกระบบ
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentView('pos');
  };

  return (
    <div>
      {isAuthenticated ? (
        // 🌟 3. ป้องกันอีกชั้น: ถ้าจะเข้าหน้า admin แต่ไม่ใช่ ADMIN ให้เตะกลับไปหน้าร้าน
        currentView === 'admin' && userRole === 'ROLE_ADMIN' ? (
           <AdminDashboard 
              onBackToPOS={() => setCurrentView('pos')} 
           />
        ) : (
           <PosDashboard 
              onLogout={handleLogout} 
              onGoToAdmin={() => setCurrentView('admin')}
              userRole={userRole} // 🌟 4. ส่ง Role ไปให้ PosDashboard
           />
        )
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;