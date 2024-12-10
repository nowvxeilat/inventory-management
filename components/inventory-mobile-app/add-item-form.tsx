'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ImageUploader } from '../ui/image-uploader';

export function AddItemForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    category: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the item to your database
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">הוספת פריט חדש</h2>
            <button onClick={onClose} className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
              <ImageUploader
                onImageUploaded={(imageUrl) => setFormData({ ...formData, imageUrl })}
              />
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="שם הפריט"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Input
                type="number"
                placeholder="כמות"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                required
                min="0"
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded-md text-right"
                required
              >
                <option value="">בחר קטגוריה</option>
                <option value="אחזקה">אחזקה</option>
                <option value="משק">משק</option>
                <option value="אחר">אחר</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={onClose}
              >
                ביטול
              </Button>
              <Button type="submit" className="w-1/2">
                הוספה
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
