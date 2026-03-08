import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProductFormModal = ({ isOpen, onClose, onSave, categories, editingProduct }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (editingProduct) {
            setName(editingProduct.name);
            setPrice(editingProduct.price);
            setCategoryId(editingProduct.categoryId);
            setIsAvailable(editingProduct.isAvailable);
            setSelectedFile(null);
        } else {
            setName('');
            setPrice('');
            setCategoryId(categories.length > 0 ? categories[0].id : '');
            setIsAvailable(true);
            setSelectedFile(null);
        }
    }, [editingProduct, categories, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let finalImageUrl = editingProduct ? editingProduct.imageUrl : 'default.jpg';

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                
                const uploadRes = await api.post('/files/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = uploadRes.data;
            }

            const productData = {
                name: name,
                price: parseFloat(price),
                categoryId: parseInt(categoryId),
                imageUrl: finalImageUrl,
                isAvailable: isAvailable
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, productData);
                alert('อัปเดตข้อมูลเมนูสำเร็จ!');
            } else {
                await api.post('/products', productData);
                alert('เพิ่มเมนูใหม่สำเร็จ!');
            }

            onSave();
            onClose();

        } catch (error) {
            console.error("บันทึกข้อมูลล้มเหลว:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                <div className="p-6 bg-jp-indigo text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {editingProduct ? 'แก้ไขเมนูอาหาร' : 'เพิ่มเมนูอาหารใหม่'}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-red-400 font-bold text-xl px-2">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-jp-charcoal mb-1">ชื่อเมนู</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-jp-indigo" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-jp-charcoal mb-1">ราคา (บาท)</label>
                            <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)}
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-jp-indigo" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-jp-charcoal mb-1">หมวดหมู่</label>
                            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-jp-indigo">
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-jp-charcoal mb-1">สถานะ</label>
                        <select value={isAvailable} onChange={e => setIsAvailable(e.target.value === 'true')}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-jp-indigo">
                            <option value="true">พร้อมขาย</option>
                            <option value="false">หมดชั่วคราว</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-jp-charcoal mb-1">รูปภาพ (ถ้ามี)</label>
                        <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        {editingProduct && !selectedFile && (
                            <p className="text-xs text-gray-400 mt-1">* หากไม่เลือก รูปภาพเดิมจะยังคงอยู่</p>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-bold">ยกเลิก</button>
                        <button type="submit" disabled={isLoading} className="px-5 py-2 bg-jp-red hover:bg-red-800 text-white rounded-xl font-bold shadow-md disabled:opacity-50">
                            {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;