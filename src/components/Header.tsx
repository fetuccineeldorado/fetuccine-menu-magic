import { Link } from 'react-router-dom';
import { ShoppingCart, Phone, Menu } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from './ui/button';

export const Header = () => {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-dark shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Left - Menu Button & Phone */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full w-10 h-10"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <a
              href="tel:+551199999999"
              className="hidden sm:flex items-center gap-2 text-white hover:text-primary transition-base"
            >
              <Phone className="w-4 h-4" />
              <span className="flex flex-col">
                <span className="text-xs font-semibold opacity-75">Hotline:</span>
                <span className="text-sm font-bold">+55 11 9999-9999</span>
              </span>
            </a>
          </div>

          {/* Center - Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              <span className="text-primary">Fetuccine</span>
            </h1>
          </Link>

          {/* Right - Cart */}
          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/10 rounded-full w-10 h-10 transition-smooth"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
