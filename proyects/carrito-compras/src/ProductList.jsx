// Importamos los hooks necesarios
import { useState } from 'react';
import { useCart } from './CartContext';

// Lista de productos disponibles
const productosDisponibles = [
    {
        id: 1,
        nombre: "iPhone 16 Pro Max",
        precio: 1200,
        imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        descripcion: "6.7' Super Retina XDR, A18 Pro, 1TB",
        categoria: "iPhone Pro Max"
    },
    {
        id: 2,
        nombre: "iPhone 16 Pro",
        precio: 1100,
        imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        descripcion: "6.1' Super Retina XDR, A18 Pro, 1TB",
        categoria: "iPhone Pro"
    },
    {
        id: 3,
        nombre: "iPhone 16",
        precio: 950,
        imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        descripcion: "6.1' Super Retina XDR, A18, 512GB",
        categoria: "iPhone"
    },
    {
        id: 4,
        nombre: "iPhone 15 Pro Max",
        precio: 1200,
        imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        descripcion: "6.7' Super Retina XDR, A17 Pro, 1TB",
        categoria: "iPhone Pro Max"
    },
    {
        id: 5,
        nombre: "iPhone 15 Pro",
        precio: 1000,
        imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        descripcion: "6.1' Super Retina XDR, A17 Pro, 1TB",
        categoria: "iPhone Pro"
    },
    {
        id: 6,
        nombre: "iPhone 15",
        precio: 800,
        imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        descripcion: "6.1' Super Retina XDR, A16, 512GB",
        categoria: "iPhone"
    },
    {
        id: 7,
        nombre: "iPhone 14 Pro Max",
        precio: 1000,
        imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        descripcion: "6.7' Super Retina XDR, A16 Pro, 1TB",
        categoria: "iPhone Pro Max"
    },
    {
        id: 8,
        nombre: "iPhone 14 Pro",
        precio: 900,
        imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        descripcion: "6.1' Super Retina XDR, A16 Pro, 1TB",
        categoria: "iPhone Pro"
    },
    {
        id: 9,
        nombre: "iPhone 14",
        precio: 700,
        imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        descripcion: "6.1' Super Retina XDR, A15, 512GB",
        categoria: "iPhone"
    }
];

// Componente principal de la lista de productos
export function ProductList() {
    // Obtenemos la función para agregar al carrito del contexto
    const { agregarAlCarrito } = useCart();
    
    // Estados para manejar la categoría seleccionada y notificaciones
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showNotification, setShowNotification] = useState(false);

    // Obtenemos las categorías únicas de los productos
    const categorias = ['Todos', ...new Set(productosDisponibles.map(p => p.categoria))];

    // Filtramos los productos según la categoría seleccionada
    const productosFiltrados = productosDisponibles.filter(producto => 
        selectedCategory === 'Todos' || producto.categoria === selectedCategory
    );

    // Manejador para agregar productos al carrito
    const handleAgregarAlCarrito = (producto) => {
        agregarAlCarrito(producto);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    return (
        <div className="productos-container">
            {/* Notificación de producto agregado */}
            {showNotification && (
                <div className="notification">
                    Producto agregado al carrito
                </div>
            )}

            {/* Selector de categorías */}
            <div className="filtros">
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="categoria-select"
                >
                    {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* productos */}
            <div className="productos-grid">
                {productosFiltrados.map(producto => (
                    <div key={producto.id} className="producto-card">
                        <div className="producto-imagen-container">
                            <img 
                                src={producto.imagen} 
                                alt={producto.nombre}
                                className="producto-imagen"
                            />
                        </div>
                        <h3>{producto.nombre}</h3>
                        <p className="precio">USD {producto.precio.toFixed(2)}</p>
                        <p className="descripcion">{producto.descripcion}</p>
                        <button 
                            onClick={() => handleAgregarAlCarrito(producto)}
                            className="boton-agregar"
                        >
                            Agregar al Carrito
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}