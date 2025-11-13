import { ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface PromoCardProps {
  title: string;
  code: string;
  discount: number;
  image: string;
}

export const PromoCard = ({ title, code, discount, image }: PromoCardProps) => {
  return (
    <Card className="relative overflow-hidden rounded-3xl h-64 border-0 shadow-lg hover:shadow-primary transition-smooth group cursor-pointer">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />
      </div>
      
      <div className="relative h-full p-6 flex flex-col justify-between">
        <Badge className="self-start gradient-secondary text-white font-semibold px-4 py-1.5">
          {discount}% OFF: {code}
        </Badge>
        
        <div>
          <h3 className="text-white text-3xl font-bold uppercase mb-2 leading-tight drop-shadow-lg">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-white/90 group-hover:gap-3 transition-smooth">
            <span className="text-sm font-semibold">Ver Detalhes</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Card>
  );
};
