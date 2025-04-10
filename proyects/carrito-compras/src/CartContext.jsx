// Importamos las herramientas necesarias de React:
// createContext: Para crear el contexto del carrito
// useState: Para manejar estados
// useContext: Para usar el contexto
// useEffect: Para efectos secundarios
import { createContext, useState, useContext, useEffect } from 'react';

// Creamos un nuevo contexto para el carrito
const CartContext = createContext();

// Definimos el costo fijo de envío
const SHIPPING_COST = 10;

// Componente principal que provee el contexto del carrito
// children: Componentes hijos que tendrán acceso al contexto
export function CartProvider({ children }) {
    // Estado para los items del carrito
    // useState con función de inicialización para cargar datos del localStorage
    const [cartItems, setCartItems] = useState(() => {
        // Intentamos obtener el carrito guardado en localStorage
        const savedCart = localStorage.getItem('cart');
        // Si existe, lo transformamos a objeto, si no, retornamos array vacío []
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Estado para el precio total final
    const [total, setTotal] = useState(0);
    // Estado para el subtotal (suma de productos sin envío)
    const [subtotal, setSubtotal] = useState(0);

    // useEffect se ejecuta cuando cambia cartItems
    useEffect(() => {
        // Guardamos el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
        // Recalculamos los totales
        calculateTotals();
    }, [cartItems]);

    // Función para calcular subtotal y total
    const calculateTotals = () => {
        // Reduce el array de items a un único valor sumando precio * cantidad
        const itemsSubtotal = cartItems.reduce((sum, item) => 
            sum + (item.precio * item.cantidad), 0
        );
        
        // Calcula el total añadiendo el costo de envío
        const finalTotal = itemsSubtotal + SHIPPING_COST;

        // Actualiza los estados
        setSubtotal(itemsSubtotal);
        setTotal(finalTotal);
    };

    // Función para agregar productos al carrito
    const agregarAlCarrito = (producto) => {
        setCartItems(prevItems => {
            // Busca si el producto ya existe en el carrito
            const existingItem = prevItems.find(item => item.id === producto.id);
            if (existingItem) {
                // Si existe, aumenta su cantidad en 1
                return prevItems.map(item =>
                    item.id === producto.id
                        ? {...item, cantidad: item.cantidad + 1}
                        : item
                );
            }
            // Si no existe, lo agrega con cantidad 1
            return [...prevItems, {...producto, cantidad: 1}];
        });
    };

    // Función para eliminar un producto del carrito
    const eliminarDelCarrito = (productoId) => {
        // Filtra el array excluyendo el producto con el ID especificado
        setCartItems(prevItems => 
            prevItems.filter(item => item.id !== productoId)
        );
    };

    // Función para actualizar la cantidad de un producto
    const actualizarCantidad = (productoId, nuevaCantidad) => {
        // Solo actualiza si la nueva cantidad es mayor que 0
        if (nuevaCantidad > 0) {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productoId
                        ? {...item, cantidad: nuevaCantidad}
                        : item
                )
            );
        }
    };

    // Función para vaciar el carrito
    const limpiarCarrito = () => {
        setCartItems([]);
    };

    // Función asíncrona para procesar el pago
    const procesarPago = async () => {
        // Crea objeto con detalles de la orden
        const orden = {
            items: cartItems,
            subtotal,
            envio: SHIPPING_COST,
            total,
        };

        // Simula proceso de pago con Promise y setTimeout
        return new Promise((resolve) => {
            setTimeout(() => {
                limpiarCarrito();
                resolve(orden);
            }, 1500); // Delay de 1.5 segundos
        });
    };

    // Objeto con todos los valores y funciones que estarán disponibles en el contexto
    const value = {
        cartItems,
        total,
        subtotal,
        shipping: SHIPPING_COST,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        procesarPago,
        limpiarCarrito
    };

    // Retorna el Provider del contexto con los valores
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
    // Obtiene el contexto
    const context = useContext(CartContext);
    // Si no existe el contexto, significa que se está usando fuera del Provider
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    // Retorna el contexto
    return context;
};