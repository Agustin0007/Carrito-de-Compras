import { createContext, useState, useContext, useEffect } from 'react';

// Creamos el contexto para el carrito de compras
const CartContext = createContext();

// Definimos el costo fijo de envío 
const SHIPPING_COST = 10;

// Proveedor del contexto del carrito que maneja toda la lógica de compras
export function CartProvider({ children }) {
    // Inicializamos el carrito desde localStorage o como array vacío
    const [cartItems, setCartItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    });

    // Estado combinado para total y subtotal para mejor manejo
    const [{ total, subtotal }, setTotals] = useState({ total: 0, subtotal: 0 });

    // Efecto para actualizar localStorage y recalcular totales cuando cambia el carrito
    useEffect(() => {
        // Guardamos en localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Calculamos el nuevo subtotal sumando (precio * cantidad) de cada item
        const newSubtotal = cartItems.reduce((sum, item) => 
            sum + (item.precio * item.cantidad), 0
        );
        
        // Actualizamos totales incluyendo envío
        setTotals({
            subtotal: newSubtotal,
            total: newSubtotal + SHIPPING_COST
        });
    }, [cartItems]);

    // Añade un producto al carrito o incrementa su cantidad si ya existe
    const agregarAlCarrito = (producto) => {
        setCartItems(items => {
            const index = items.findIndex(item => item.id === producto.id);
            if (index >= 0) {
                const newItems = [...items];
                newItems[index] = { ...items[index], cantidad: items[index].cantidad + 1 };
                return newItems;
            }
            return [...items, { ...producto, cantidad: 1 }];
        });
    };

    // Elimina un producto específico del carrito
    const eliminarDelCarrito = (productoId) => {
        setCartItems(items => items.filter(item => item.id !== productoId));
    };

    // Actualiza la cantidad de un producto específico
    const actualizarCantidad = (productoId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) return;
        setCartItems(items =>
            items.map(item => 
                item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
            )
        );
    };

    // Vacía completamente el carrito
    const limpiarCarrito = () => setCartItems([]);

    // Simula el proceso de pago (demo)
    const procesarPago = () => {
        const orden = { 
            items: cartItems, 
            subtotal, 
            envio: SHIPPING_COST, 
            total 
        };
        
        return new Promise(resolve => {
            setTimeout(() => {
                limpiarCarrito();
                resolve(orden);
            }, 1500); // Simulamos un delay de procesamiento
        });
    };

    // Retornamos el Provider con todos los valores y funciones necesarias
    return (
        <CartContext.Provider value={{
            cartItems,
            total,
            subtotal,
            shipping: SHIPPING_COST,
            agregarAlCarrito,
            eliminarDelCarrito,
            actualizarCantidad,
            procesarPago,
            limpiarCarrito
        }}>
            {children}
        </CartContext.Provider>
    );
}

// Hook personalizado para acceder al contexto del carrito desde cualquier componente
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};