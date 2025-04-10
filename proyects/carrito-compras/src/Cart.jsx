import { useState } from 'react';
import { useCart } from './CartContext';

export function Cart() {
    const { 
        cartItems, //Array con los productos en el carrito
        total, //Precio total final
        subtotal, //Suma de todos los productos sin envío
        shipping, //Costo de envío
        eliminarDelCarrito, //Función para eliminar productos
        actualizarCantidad, //Función para cambiar cantidad de productos
        procesarPago //Función para procesar la compra
    } = useCart();

    const [isProcessing, setIsProcessing] = useState(false); //isProcessing indica si se está procesando el pago
    const [message, setMessage] = useState(''); //Muestra mensajes al usuario

    const handleCheckout = async () => { //Maneja el proceso de pago operacion asincrona
        setIsProcessing(true);
        try {
            const orden = await procesarPago();
            setMessage('¡Compra realizada con éxito!');

            setTimeout(() => {
                setMessage('');
            }, 2000)
        } catch (error) {
            setMessage('Error al procesar el pago');
        }
        setIsProcessing(false);
    };

    return (
        <div className="carrito">
            <h2>Carrito de Compras</h2>
            
            {message && (
                <div className="notification"> 
                    {message}
                </div>
            )}
            
            {cartItems.length === 0 ? ( //Si el carrito está vacío
                <p className="carrito-vacio">Tu carrito está vacío</p> 
            ) : (
                <>
                    <div className="carrito-items">
                        {cartItems.map(item => ( //Se mapea el array de productos en el carrito
                            <div key={item.id} className="carrito-item">
                                <img 
                                    src={item.imagen} 
                                    alt={item.nombre} 
                                    className="carrito-item-imagen"
                                />
                                <div className="carrito-item-detalles">
                                    <h3>{item.nombre}</h3>
                                    <p className="item-precio">${item.precio.toFixed(2)}</p> 
                                    <div className="cantidad-controles">
                                        <button 
                                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} 
                                            disabled={item.cantidad <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.cantidad}</span>
                                        <button 
                                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="item-subtotal">
                                        Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                                    </p>
                                    <button 
                                        onClick={() => eliminarDelCarrito(item.id)}
                                        className="boton-eliminar"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="carrito-resumen">
                        <h3>Resumen del Pedido</h3>
                        <div className="resumen-linea">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="resumen-linea">
                            <span>Envío:</span>
                            <span>${shipping.toFixed(2)}</span>
                        </div>
                        <div className="resumen-linea total">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <button 
                            className="boton-checkout"
                            onClick={handleCheckout}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}