import React, { useState, useEffect } from 'react';
import api from '../services/api';

const OrderHistoryModal = ({ isOpen, onClose }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchOrders();
            setExpandedOrderId(null);
        }
    }, [isOpen]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("ดึงประวัติการขายล้มเหลว:", error);
            alert("ไม่สามารถดึงข้อมูลประวัติการขายได้");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleExpand = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
                
                <div className="p-6 bg-jp-indigo text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold">ประวัติการขาย (Order History)</h2>
                    <button onClick={onClose} className="text-white hover:text-red-400 font-bold text-xl px-2 transition-colors">
                        X
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    {isLoading ? (
                        <p className="text-center text-gray-500 py-10 font-bold">กำลังโหลดข้อมูล...</p>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-jp-charcoal border-b border-gray-200">
                                        <th className="p-4 font-bold">เลขที่บิล</th>
                                        <th className="p-4 font-bold">วันที่ / เวลา</th>
                                        <th className="p-4 font-bold">สถานะ</th>
                                        <th className="p-4 font-bold text-right">ยอดรวม</th>
                                        <th className="p-4 font-bold text-center w-16"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const orderDate = new Date(order.createdAt).toLocaleString('th-TH');
                                        const isExpanded = expandedOrderId === order.id;

                                        return (
                                            <React.Fragment key={order.id}>
                                                
                                                <tr 
                                                    onClick={() => toggleExpand(order.id)}
                                                    className={`border-b border-gray-100 cursor-pointer transition-colors ${
                                                        isExpanded ? 'bg-red-50' : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <td className="p-4 font-bold text-jp-indigo">#{order.id}</td>
                                                    <td className="p-4 text-sm text-gray-600">{orderDate}</td>
                                                    <td className="p-4">
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right font-black text-jp-red text-lg">
                                                        ฿{order.totalAmount}
                                                    </td>
                                                    <td className="p-4 text-center text-gray-400">
                                                        {isExpanded ? '▲' : '▼'}
                                                    </td>
                                                </tr>

                                                {isExpanded && (
                                                    <tr className="bg-gray-50 border-b border-gray-200">
                                                        <td colSpan="5" className="p-6">
                                                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-inner">
                                                                <h4 className="font-bold text-jp-charcoal mb-4 border-b pb-2">รายการอาหารในบิล:</h4>
                                                                
                                                                <div className="space-y-3">
                                                                    {order.items.map((item, index) => (
                                                                        <div key={index} className="flex justify-between items-center text-sm">
                                                                            <div className="flex-1">
                                                                                <span className="font-semibold text-jp-charcoal">{item.productName}</span>
                                                                                <span className="text-gray-500 ml-2">(@ ฿{item.unitPrice})</span>
                                                                            </div>
                                                                            <div className="text-gray-600 w-16 text-center">
                                                                                x{item.quantity}
                                                                            </div>
                                                                            <div className="font-bold text-jp-indigo w-24 text-right">
                                                                                ฿{item.subTotal}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}

                                            </React.Fragment>
                                        )
                                    })}
                                    
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-10 text-center text-gray-400">ยังไม่มีประวัติการขาย</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryModal;