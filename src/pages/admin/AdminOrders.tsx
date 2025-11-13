import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
    
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Status atualizado!');
      loadOrders();
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-purple-500',
      ready: 'bg-green-500',
      delivered: 'bg-gray-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const statusLabels: any = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Pedidos</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.customer_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                  {order.customer_email && (
                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  )}
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {statusLabels[order.status] || order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold mb-2">Itens:</p>
                  {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                    <p key={idx} className="text-sm">
                      {item.quantity}x {item.name} - R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  ))}
                </div>

                {order.order_type === 'delivery' && order.delivery_address && (
                  <div>
                    <p className="font-semibold">Endereço:</p>
                    <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                  </div>
                )}

                {order.notes && (
                  <div>
                    <p className="font-semibold">Observações:</p>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Total:</p>
                    <p className="text-2xl font-bold text-tomato">R$ {Number(order.total).toFixed(2)}</p>
                  </div>
                  <Select
                    value={order.status}
                    onValueChange={(status) => updateStatus(order.id, status)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label as string}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
