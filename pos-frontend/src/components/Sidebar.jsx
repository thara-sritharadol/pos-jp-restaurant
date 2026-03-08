import React from 'react';

const Sidebar = ({ categories, selectedCategory, onSelectCategory, onLogout, onOpenHistory, onGoToAdmin, userRole }) => {
    return (
        <div className="w-1/6 min-w-[200px] bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 bg-jp-red text-white">
                <h1 className="text-2xl font-black tracking-tighter">THARA POS</h1>
                <p className="text-sm opacity-80">ร้านอาหารญี่ปุ่น</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {categories.map(category => (
                    <button 
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={`w-full text-left px-4 py-4 rounded-xl font-bold transition-all ${
                            selectedCategory === category.id 
                            ? 'bg-red-50 text-jp-red border-r-4 border-jp-red' 
                            : 'text-jp-charcoal hover:bg-gray-50'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200 space-y-2">
                <button 
                    onClick={onOpenHistory} 
                    className="w-full py-3 bg-gray-100 text-jp-indigo hover:bg-gray-200 rounded-xl font-bold transition"
                >
                    ประวัติการขาย
                </button>
                
                {userRole === 'ROLE_ADMIN' && (
                    <button 
                        onClick={onGoToAdmin} 
                        className="w-full py-3 bg-red-50 text-jp-red hover:bg-red-100 rounded-xl font-bold transition"
                    >
                        จัดการหลังร้าน
                    </button>
                )}
                
                <button 
                    onClick={onLogout} 
                    className="w-full py-3 text-gray-500 hover:text-jp-red hover:bg-red-50 rounded-xl font-semibold transition"
                >
                    ออกจากระบบ
                </button>
            </div>
        </div>
    );
};

export default Sidebar;