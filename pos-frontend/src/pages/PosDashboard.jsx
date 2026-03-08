import React, { useState, useEffect } from 'react';
import api from '../services/api';

import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import OrderHistoryModal from '../components/OrderHistoryModal';

const PosDashboard = ({ onLogout, onGoToAdmin, userRole }) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cart, setCart] = useState([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryRes, productRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/products')
                ]);
                setCategories(categoryRes.data);
                setProducts(productRes.data);
                if (categoryRes.data.length > 0) {
                    setSelectedCategory(categoryRes.data[0].id);
                }
            } catch (error) {
                console.error("ดึงข้อมูลล้มเหลว:", error);
                alert("เซสชันอาจหมดอายุ กรุณาล็อกอินใหม่");
                onLogout();
            }
        };
        fetchData();
    }, [onLogout]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === product.id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.productId === product.id 
                    ? { ...item, quantity: item.quantity + 1, subTotal: (item.quantity + 1) * item.unitPrice }
                    : item
                );
            }
            return [...prevCart, {
                productId: product.id,
                productName: product.name,
                unitPrice: product.price,
                quantity: 1,
                subTotal: product.price
            }];
        });
    };

    const updateCartItemQuantity = (productId, delta) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.productId === productId) {
                    const newQuantity = item.quantity + delta;
                    return { 
                        ...item, 
                        quantity: newQuantity, 
                        subTotal: newQuantity * item.unitPrice 
                    };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsCheckingOut(true);
        try {
            const orderPayload = {
                paymentMethod: "CASH",
                items: cart.map(item => ({ productId: item.productId, quantity: item.quantity }))
            };
            const response = await api.post('/orders', orderPayload);
            alert(`เปิดบิลสำเร็จ!\nเลขที่บิล: ${response.data.id}\nยอดรวม: ฿${response.data.totalAmount}`);
            setCart([]); 
        } catch (error) {
            console.error("เปิดบิลล้มเหลว:", error);
            alert("เกิดข้อผิดพลาดในการเปิดบิล กรุณาลองใหม่");
        } finally {
            setIsCheckingOut(false);
        }
    };

    const totalCartAmount = cart.reduce((sum, item) => sum + item.subTotal, 0);

    return (
        <div className="flex h-screen bg-jp-bg overflow-hidden font-sans">
            <Sidebar 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
                onLogout={onLogout} 
                onOpenHistory={() => setIsHistoryOpen(true)}
                onGoToAdmin={onGoToAdmin}
                userRole={userRole}
            />
            
            <ProductGrid 
                products={products} 
                selectedCategory={selectedCategory} 
                onAddToCart={addToCart} 
            />
            
            <Cart 
                cart={cart} 
                totalAmount={totalCartAmount} 
                isCheckingOut={isCheckingOut} 
                onCheckout={handleCheckout}
                onUpdateQuantity={updateCartItemQuantity}
            />

            <OrderHistoryModal 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)} 
            />
        </div>
    );
};

export default PosDashboard;