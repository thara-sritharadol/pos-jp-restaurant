import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // ยิง Request ไปที่ Spring Boot
            const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
                username: username,
                password: password,
            });

            const token = response.data.token;
            const role = response.data.role;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role)
            console.log('Login สำเร็จ, ได้รับ Token แล้ว!');

            onLoginSuccess(role); 
            
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Username หรือ Password ไม่ถูกต้อง หรือ เซิร์ฟเวอร์มีปัญหา');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-jp-bg px-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                
                <h1 className="text-3xl font-extrabold text-jp-red text-center mb-4 tracking-tighter">
                    THARA POS
                    <span className="block text-xl font-medium text-jp-charcoal mt-1">
                        Japanese Restaurant
                    </span>
                </h1>
                
                <h2 className="text-xl font-bold text-jp-indigo text-center mb-8">
                    ลงชื่อเข้าใช้งาน
                </h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-jp-charcoal mb-2" htmlFor="username">
                            ชื่อผู้ใช้งาน
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="พิมพ์ชื่อผู้ใช้งานของคุณ"
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jp-red focus:border-jp-red outline-none transition duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-jp-charcoal mb-2" htmlFor="password">
                            รหัสผ่าน
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jp-red focus:border-jp-red outline-none transition duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-jp-red hover:bg-red-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                        {isLoading ? 'กำลังโหลด...' : 'ลงชื่อเข้าใช้'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-10">
                    &copy; 2026 Thara POS. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;