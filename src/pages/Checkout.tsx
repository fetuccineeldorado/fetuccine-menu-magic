import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in database
      const { error } = await supabase.from('orders').insert([{
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || null,
        delivery_address: orderType === 'delivery' ? formData.address : null,
        order_type: orderType,
        items: items as any,
        subtotal: total,
        delivery_fee: orderType === 'delivery' ? 5.00 : 0,
        total: total + (orderType === 'delivery' ? 5.00 : 0),
        notes: formData.notes || null,
      }]);

      if (error) throw error;

      toast.success('Pedido realizado com sucesso!');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const itemsText = items
      .map((item) => `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');
    const message = encodeURIComponent(
      `*Pedido do Fetuccine*\n\n${itemsText}\n\n*Total: R$ ${total.toFixed(2)}*\n\nNome: ${formData.name}\nTelefone: ${formData.phone}\nTipo: ${orderType === 'delivery' ? 'Entrega' : 'Retirada'}\n${orderType === 'delivery' ? `Endereço: ${formData.address}` : ''}\n${formData.notes ? `Obs: ${formData.notes}` : ''}`
    );
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  const deliveryFee = orderType === 'delivery' ? 5.00 : 0;
  const finalTotal = total + deliveryFee;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Finalizar Pedido</h1>
          <div className="w-12 h-1 bg-primary rounded-full" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Tipo de Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={orderType} onValueChange={(v) => setOrderType(v as any)}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-base">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Entrega</div>
                        <div className="text-sm text-muted-foreground">Receba em casa (+ R$ 5,00)</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-base">
                      <RadioGroupItem value="takeaway" id="takeaway" />
                      <Label htmlFor="takeaway" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Retirada</div>
                        <div className="text-sm text-muted-foreground">Busque no restaurante</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Seus Dados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(11) 99999-9999"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu@email.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {orderType === 'delivery' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="address">Endereço Completo *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Textarea
                          id="address"
                          required={orderType === 'delivery'}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Rua, número, complemento, bairro, cidade"
                          className="pl-10 min-h-[100px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Alguma observação sobre o pedido?"
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Summary Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-semibold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">R$ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxa de entrega</span>
                      <span className="font-semibold">R$ {deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-primary text-2xl">
                        R$ {finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-primary text-white shadow-primary hover:opacity-90"
                    size="lg"
                  >
                    {loading ? 'Processando...' : 'Confirmar Pedido'}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    variant="outline"
                    className="w-full border-basil text-basil hover:bg-basil hover:text-white"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Pedir pelo WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
