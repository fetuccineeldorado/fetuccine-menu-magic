import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminItems() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: true,
    is_vegan: false,
    is_new: false,
    is_spicy: false,
    preparation_time: '20',
  });

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  const loadItems = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .order('name');
    if (data) setItems(data);
  };

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('display_order');
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      preparation_time: parseInt(formData.preparation_time),
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
        toast.success('Item atualizado!');
      } else {
        const { error } = await supabase.from('menu_items').insert(data);
        if (error) throw error;
        toast.success('Item criado!');
      }
      setOpen(false);
      resetForm();
      loadItems();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este item?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Item excluído!');
      loadItems();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      is_available: true,
      is_vegan: false,
      is_new: false,
      is_spicy: false,
      preparation_time: '20',
    });
    setEditingItem(null);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id,
      image_url: item.image_url || '',
      is_available: item.is_available,
      is_vegan: item.is_vegan,
      is_new: item.is_new,
      is_spicy: item.is_spicy,
      preparation_time: item.preparation_time.toString(),
    });
    setOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Itens do Cardápio</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Item' : 'Novo Item'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tempo de Preparo (min)</Label>
                  <Input
                    type="number"
                    value={formData.preparation_time}
                    onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Disponível</Label>
                  <Switch
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Vegano</Label>
                  <Switch
                    checked={formData.is_vegan}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_vegan: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Novo</Label>
                  <Switch
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Picante</Label>
                  <Switch
                    checked={formData.is_spicy}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_spicy: checked })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingItem ? 'Atualizar' : 'Criar'} Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <img
                src={item.image_url || '/placeholder.svg'}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <CardTitle className="flex justify-between items-start">
                <span>{item.name}</span>
                <span className="text-tomato font-bold">R$ {item.price.toFixed(2)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(item)}
                  className="flex-1"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
