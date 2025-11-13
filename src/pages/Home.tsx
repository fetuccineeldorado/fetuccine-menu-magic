import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PromoCard } from '@/components/PromoCard';
import { MenuItemCard } from '@/components/MenuItemCard';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    loadFeaturedItems();
  }, []);

  const loadFeaturedItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('rating', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error loading items:', error);
      return;
    }
    setFeaturedItems(data || []);
  };

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    });
    toast.success(`${item.name} adicionado ao carrinho!`);
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Olá! Gostaria de fazer um pedido no Fetuccine.');
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
            Saboreie o melhor da <span className="text-primary">Itália</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-lg">
            no Fetuccine
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2 bg-white rounded-full p-2 shadow-2xl">
              <div className="flex items-center gap-2 px-4 flex-1">
                <MapPin className="w-5 h-5 text-primary" />
                <Input
                  placeholder="Digite seu endereço..."
                  className="border-0 focus-visible:ring-0 text-foreground"
                />
              </div>
              <Button className="gradient-primary text-white rounded-full px-6 shadow-primary hover:opacity-90">
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg" className="gradient-primary text-white shadow-primary hover:opacity-90">
                Ver Cardápio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              onClick={handleWhatsAppOrder}
              variant="outline"
              className="bg-white/90 hover:bg-white border-0 text-basil shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Pedir pelo WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Ofertas Especiais</h2>
              <div className="w-8 h-1 bg-primary rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PromoCard
              title="Carbonara Clássica"
              code="CARBO15"
              discount={15}
              image="https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80"
            />
            <PromoCard
              title="Risoto de Funghi"
              code="RISOTO10"
              discount={10}
              image="https://images.unsplash.com/photo-1476124369491-c80afdaeae52?w=800&q=80"
            />
            <PromoCard
              title="Lasagna Bolonhesa"
              code="LASAGNA12"
              discount={12}
              image="https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80"
            />
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Mais Pedidos</h2>
              <div className="w-8 h-1 bg-primary rounded-full" />
            </div>
            <Link to="/menu">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Ver Todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                {...item}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Fetuccine</h3>
              <p className="text-white/75">
                Sabores autênticos da Itália, com ingredientes frescos e receitas tradicionais.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <ul className="space-y-2 text-white/75">
                <li>Rua Exemplo, 123 - São Paulo</li>
                <li>+55 11 9999-9999</li>
                <li>contato@fetuccine.com.br</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Horários</h4>
              <p className="text-white/75">Seg-Sex: 11h - 23h</p>
              <p className="text-white/75">Sáb-Dom: 12h - 00h</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/60">
            <p>&copy; 2024 Fetuccine. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
