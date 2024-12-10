'use client';

import { useState } from 'react';
import { AddItemForm } from '@/components/inventory-mobile-app/add-item-form';

export default function AddItemPage() {
  const [isAddItemOpen, setIsAddItemOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">הוספת פריט חדש</h1>
        </div>

        {/* The form will always be visible on this page */}
        <AddItemForm onClose={() => {
          // Here you might want to navigate back or handle the close action differently
          window.history.back();
        }} />
      </div>
    </div>
  );
}
