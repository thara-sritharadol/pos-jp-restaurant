import React from 'react';

const Cart = ({ cart, totalAmount, isCheckingOut, onCheckout, onUpdateQuantity }) => {
    return (
        <div className="w-[340px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-10">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-jp-indigo">รายการสั่งซื้อ</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {cart.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex flex-col border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-jp-charcoal">{item.productName}</h4>
                            <p className="font-black text-jp-indigo text-lg">฿{item.subTotal}</p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">฿{item.unitPrice} / จาน</p>
                            
                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                                <button 
                                    onClick={() => onUpdateQuantity(item.productId, -1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-jp-red rounded-l-lg transition-colors font-bold"
                                    title="ลดจำนวน (หากเหลือ 0 จะลบรายการ)"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center font-bold text-jp-charcoal text-sm">
                                    {item.quantity}
                                </span>
                                <button 
                                    onClick={() => onUpdateQuantity(item.productId, 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-green-600 rounded-r-lg transition-colors font-bold"
                                    title="เพิ่มจำนวน"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {cart.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <span className="text-4xl">🛒</span>
                        <p>ยังไม่มีรายการอาหาร</p>
                    </div>
                )}
            </div>

            <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-bold">ยอดรวมทั้งสิ้น</span>
                    <span className="text-3xl font-black text-jp-red">฿{totalAmount}</span>
                </div>
                
                <button 
                    onClick={onCheckout}
                    disabled={cart.length === 0 || isCheckingOut}
                    className="w-full bg-jp-indigo hover:bg-slate-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCheckingOut ? 'กำลังดำเนินการ...' : 'ชำระเงิน (Cash)'}
                </button>
            </div>
        </div>
    );
};

export default Cart;