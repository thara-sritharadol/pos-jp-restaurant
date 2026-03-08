import React from 'react';

const ProductGrid = ({ products, selectedCategory, onAddToCart }) => {

    const filteredProducts = products.filter(p => p.categoryId === selectedCategory);

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-jp-indigo mb-6">เลือกเมนูอาหาร</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                    <button 
                        key={product.id}
                        onClick={() => onAddToCart(product)}
                        disabled={!product.isAvailable}
                        className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left flex flex-col h-full ${!product.isAvailable && 'opacity-50 cursor-not-allowed'}`}
                    >
                        
                        {product.imageUrl && product.imageUrl !== 'default.jpg' ? (
                            <img 
                                src={`http://localhost:8080/uploads/${product.imageUrl}`} 
                                alt={product.name} 
                                className="w-full h-32 object-cover rounded-xl mb-4 bg-gray-50"
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%20%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18b5c9%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18b5c9%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23F3F4F6%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2274%22%20y%3D%22104.5%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                                }} 
                            />
                        ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400">
                                <span>No Image</span>
                            </div>
                        )}
                        
                        <h3 className="font-bold text-jp-charcoal text-lg mb-1">{product.name}</h3>
                        <div className="mt-auto pt-4 flex justify-between items-center w-full">
                            <span className="text-jp-red font-black text-xl">฿{product.price}</span>
                            {!product.isAvailable && <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded-md">หมด</span>}
                        </div>
                    </button>
                ))}
                
                {filteredProducts.length === 0 && (
                    <p className="text-gray-400 col-span-full mt-10 text-center font-bold">ยังไม่มีเมนูในหมวดหมู่นี้</p>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;