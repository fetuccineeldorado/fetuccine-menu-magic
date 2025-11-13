import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Tag, 
  Gift, 
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logout realizado!');
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: UtensilsCrossed, label: 'Itens do Cardápio', path: '/admin/items' },
    { icon: Tag, label: 'Categorias', path: '/admin/categories' },
    { icon: Gift, label: 'Complementos', path: '/admin/add-ons' },
    { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders' },
    { icon: Gift, label: 'Promoções', path: '/admin/promotions' },
    { icon: Users, label: 'Clientes', path: '/admin/customers' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-card border-r min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-tomato">Fetuccine Admin</h2>
        <p className="text-sm text-muted-foreground">Painel de Controle</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            activeClassName="bg-tomato/10 text-tomato font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors w-full"
      >
        <LogOut className="w-5 h-5" />
        <span>Sair</span>
      </button>
    </aside>
  );
}
