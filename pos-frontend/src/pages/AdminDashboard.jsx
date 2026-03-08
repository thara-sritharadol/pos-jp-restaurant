import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductFormModal from '../components/ProductFormModal';

const AdminDashboard = ({ onBackToPOS }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                api.get('/categories'),
                api.get('/products')
            ]);
            setCategories(catRes.data);
            setProducts(prodRes.data);
        } catch (error) {
            console.error("ดึงข้อมูลล้มเหลว", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddClick = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id, name) => {
        if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${name}" ?`)) {
            try {
                await api.delete(`/products/${id}`);
                alert("ลบเมนูสำเร็จ!");
                fetchData();
            } catch (error) {
                console.error("ลบข้อมูลล้มเหลว", error);
                alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                
                <div className="bg-jp-indigo p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">THARA POS <span className="text-lg font-normal opacity-80">| Admin Dashboard</span></h1>
                        <p className="text-sm mt-1 opacity-80">ระบบจัดการหลังร้าน</p>
                    </div>
                    <div className="space-x-4">
                        <button onClick={onBackToPOS} className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition">
                            กลับไปหน้าร้าน
                        </button>
                        <button onClick={handleAddClick} className="px-5 py-2 bg-jp-red hover:bg-red-600 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5">
                            เพิ่มเมนูใหม่
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-jp-charcoal border-b-2 border-gray-200">
                                <th className="p-4 font-bold rounded-tl-xl">รูปภาพ</th>
                                <th className="p-4 font-bold">ชื่อเมนู</th>
                                <th className="p-4 font-bold">หมวดหมู่</th>
                                <th className="p-4 font-bold">ราคา</th>
                                <th className="p-4 font-bold">สถานะ</th>
                                <th className="p-4 font-bold text-center rounded-tr-xl">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
                                            {product.imageUrl && product.imageUrl !== 'default.jpg' ? (
                                                <img src={`http://localhost:8080/uploads/${product.imageUrl}`} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-gray-400">No Img</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-jp-charcoal">{product.name}</td>
                                    <td className="p-4 text-gray-500">{product.categoryName}</td>
                                    <td className="p-4 font-black text-jp-indigo">฿{product.price}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.isAvailable ? 'พร้อมขาย' : 'หมด'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-2">
                                        <button onClick={() => handleEditClick(product)} className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg transition">
                                            แก้ไข
                                        </button>
                                        <button onClick={() => handleDeleteClick(product.id, product.name)} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg transition">
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-gray-400">ยังไม่มีเมนูอาหารในระบบ</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={fetchData} 
                categories={categories} 
                editingProduct={editingProduct} 
            />
        </div>
    );
};

export default AdminDashboard;