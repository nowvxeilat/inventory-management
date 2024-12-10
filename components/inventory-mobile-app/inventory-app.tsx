'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Plus, Search, Grid, LayoutGrid } from 'lucide-react';
import { AddItemForm } from './add-item-form';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Item {
  id: number;
  category: string;
  name: string;
  quantity: number;
  image: string;
  date: string;
}

const categories: Category[] = [
  { id: 'housekeeping', name: 'משק', icon: '🧹' },
  { id: 'maintenance', name: 'אחזקה', icon: '🔧' },
  { id: 'management', name: 'בעלים', icon: '👔' },
  { id: 'other', name: 'אחר', icon: '❓' },
];

export function InventoryApp() {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleAddItem = (newItem: Omit<Item, 'id' | 'date'>) => {
    const item: Item = {
      ...newItem,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setItems([...items, item]);
    setIsAddItemOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and view mode controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <LayoutGrid /> : <Grid />}
          </Button>
        </div>
        <div className="relative flex-1 mx-4">
          <Input
            type="text"
            placeholder="חיפוש..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 text-right"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`p-4 text-center cursor-pointer transition-colors ${
              selectedCategory === category.id ? 'bg-blue-50 border-blue-500' : ''
            }`}
            onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <div className="text-sm">{category.name}</div>
          </Card>
        ))}
      </div>

      {/* Items Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
          : 'space-y-4'
      }`}>
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            {item.image && (
              <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <h3 className="font-semibold text-right">{item.name}</h3>
            <p className="text-gray-600 text-sm text-right">כמות: {item.quantity}</p>
          </Card>
        ))}
      </div>

      {/* Add Item Button - Fixed at bottom */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setIsAddItemOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg"
        >
          <Plus size={24} />
        </Button>
      </div>

      {/* Add Item Modal */}
      {isAddItemOpen && (
        <AddItemForm onClose={() => setIsAddItemOpen(false)} />
      )}
    </div>
  );
}
