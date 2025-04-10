import { CartProvider } from './CartContext'
import { Cart } from './Cart'
import { ProductList } from './ProductList'
import './App.css'

export default function App() {
  return (
    <CartProvider>
      <div className="App">
        <header className="app-header">
          <h1>Mi Carrito Online</h1>
        </header>
        <main className="app-main">
          <ProductList />
          <Cart />
        </main>
      </div>
    </CartProvider>
  )
}