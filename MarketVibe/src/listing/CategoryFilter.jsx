import React from 'react';
import { Button } from "@/components/ui/button";
import { Laptop, Shirt, Sofa, Car, Dumbbell, BookOpen, Home, Gamepad2, Star, MoreHorizontal, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function CategoryFilter({ selected, onSelect }) {
  const { t } = useLanguage();

  const categories = [
    { value: 'all', labelKey: 'catAll', icon: LayoutGrid },
    { value: 'electronics', labelKey: 'catElectronics', icon: Laptop },
    { value: 'clothing', labelKey: 'catClothing', icon: Shirt },
    { value: 'furniture', labelKey: 'catFurniture', icon: Sofa },
    { value: 'vehicles', labelKey: 'catVehicles', icon: Car },
    { value: 'sports', labelKey: 'catSports', icon: Dumbbell },
    { value: 'books', labelKey: 'catBooks', icon: BookOpen },
    { value: 'home_garden', labelKey: 'catHomeGarden', icon: Home },
    { value: 'toys', labelKey: 'catToys', icon: Gamepad2 },
    { value: 'collectibles', labelKey: 'catCollectibles', icon: Star },
    { value: 'other', labelKey: 'catOther', icon: MoreHorizontal },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(cat => {
        const Icon = cat.icon;
        const isActive = selected === cat.value;
        return (
          <Button
            key={cat.value}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(cat.value)}
            className={`gap-1.5 rounded-full whitespace-nowrap shrink-0 ${isActive ? '' : 'bg-card hover:bg-accent'}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {t(cat.labelKey)}
          </Button>
        );
      })}
    </div>
  );
}