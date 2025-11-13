import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, UtensilsCrossed, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    items: 0,
    customers: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [ordersRes, itemsRes, customersRes] = await Promise.all([
      supabase.from('orders').select('total', { count: 'exact' }),
      supabase.from('menu_items').select('*', { count: 'exact' }),
      supabase.from('profiles').select('*', { count: 'exact' }),
    ]);

    const revenue = ordersRes.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

    setStats({
      orders: ordersRes.count || 0,
      items: itemsRes.count || 0,
      customers: customersRes.count || 0,
      revenue,
    });
  };

  const cards = [
    { title: 'Pedidos', value: stats.orders, icon: ShoppingBag, color: 'text-tomato' },
    { title: 'Itens no Cardápio', value: stats.items, icon: UtensilsCrossed, color: 'text-basil' },
    { title: 'Clientes', value: stats.customers, icon: Users, color: 'text-olive' },
    { title: 'Receita Total', value: `R$ ${stats.revenue.toFixed(2)}`, icon: TrendingUp, color: 'text-tomato' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
