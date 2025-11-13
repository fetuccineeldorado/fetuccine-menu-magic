import { Star, Clock, Plus } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface MenuItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  rating?: number;
  review_count?: number;
  preparation_time?: number;
  is_new?: boolean;
  is_vegan?: boolean;
  onAddToCart: () => void;
}

export const MenuItemCard = ({
  name,
  description,
  price,
  image_url,
  rating = 4.5,
  review_count = 0,
  preparation_time = 20,
  is_new,
  is_vegan,
  onAddToCart,
}: MenuItemCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-primary transition-smooth h-full">
      <div className="relative overflow-hidden">
        <img
          src={image_url || '/placeholder.svg'}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-smooth"
        />
        
        {/* Top Badge */}
        {rating >= 4.5 && (
          <Badge className="absolute bottom-3 left-3 bg-basil text-white gap-1">
            <Star className="w-3 h-3 fill-current" />
            Top Rated
          </Badge>
        )}
        
        {/* Offer Badge */}
        {is_new && (
          <Badge className="absolute top-3 left-0 gradient-gold text-white gap-1 rounded-l-none shadow-lg">
            <span className="font-bold">NOVO!</span>
          </Badge>
        )}
        
        {/* Add Button Overlay */}
        <Button
          onClick={onAddToCart}
          size="icon"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white text-primary rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-smooth shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <CardContent className="p-4">
        {/* Rating & Time */}
        <div className="flex items-center gap-3 mb-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="bg-secondary rounded w-4 h-4 flex items-center justify-center">
              <Star className="w-2.5 h-2.5 text-white fill-current" />
            </div>
            <span className="font-semibold text-foreground">{rating}</span>
            <span className="text-muted-foreground">({review_count})</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{preparation_time} min</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-base">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>

        {/* Badges */}
        <div className="flex gap-2 mb-3">
          {is_vegan && (
            <Badge variant="outline" className="text-xs text-basil border-basil">
              Vegano
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            R$ {price.toFixed(2)}
          </span>
          <Button
            onClick={onAddToCart}
            className="gradient-primary text-white shadow-primary hover:opacity-90"
          >
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
