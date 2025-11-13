import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MenuItemCard } from '@/components/MenuItemCard';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Menu() {
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addItem } = useCart();

  useEffect(() => {
    loadCategories();
    loadItems();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');

    if (!error && data) {
      setCategories(data);
    }
  };

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .eq('is_available', true)
      .order('name');

    if (!error && data) {
      setItems(data);
    }
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

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category_id === selectedCategory);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Nosso Cardápio</h1>
          <div className="w-12 h-1 bg-primary rounded-full" />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="mb-8 flex-wrap h-auto gap-2 bg-card p-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Todos
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  {...item}
                  onAddToCart={() => handleAddToCart(item)}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Nenhum item disponível nesta categoria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
