"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { uploadImage } from '@/lib/uploadImage';
import { 
  Camera, Plus, Search, Grid, Settings, LayoutGrid, X, Edit,
  Trash2, AlertCircle, Check, Download, Image as ImageIcon, Upload
} from 'lucide-react';
import { ImageGallery } from '../image-gallery';

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

interface NewItem {
  name: string;
  quantity: string;
  category: string;
  image: string | null;
}

const categories: Category[] = [
  { id: 'housekeeping', name: 'משק', icon: '🧹' },
  { id: 'maintenance', name: 'אחזקה', icon: '🔧' },
  { id: 'management', name: 'בעלים', icon: '👔' },
  { id: 'unknown', name: 'לא ידוע', icon: '❓' },
  { id: 'av', name: 'הגברה ותאורה', icon: '🎵' },
  { id: 'restaurant', name: 'מסעדה', icon: '🍽️' },
  { id: 'general', name: 'כללי', icon: '📦' }
];

export function InventoryApp() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [newItem, setNewItem] = useState<NewItem>({
    name: '',
    quantity: '',
    category: '',
    image: null
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState<'new' | 'edit' | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const captureImage = useCallback(async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
            try {
              const imageUrl = await uploadImage(file);
              if (isEditingItem === 'new') {
                setNewItem(prev => ({ ...prev, image: imageUrl }));
              } else if (isEditingItem === 'edit' && selectedItem) {
                setSelectedItem(prev => prev ? { ...prev, image: imageUrl } : null);
              }
            } catch (error) {
              console.error('Error uploading captured image:', error);
            }
          }
        }, 'image/jpeg', 0.8);
      }
    }
    setIsCameraOpen(false);
    stopCamera();
  }, [isEditingItem, selectedItem, uploadImage]);

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraOpen, startCamera, stopCamera]);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleAddItem = useCallback(() => {
    if (!newItem.name || !newItem.quantity || !newItem.category) return;
    
    const itemToAdd: Item = {
      id: items.length + 1,
      name: newItem.name,
      quantity: parseInt(newItem.quantity),
      category: newItem.category,
      image: newItem.image || 'https://placehold.co/400x300/png',
      date: new Date().toISOString().split('T')[0]
    };
    
    setItems(prevItems => [...prevItems, itemToAdd]);
    setNewItem({
      name: '',
      quantity: '',
      category: '',
      image: null
    });
    setIsNewItemOpen(false);
  }, [items, newItem]);

  const handleEditItem = useCallback(() => {
    if (!selectedItem) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === selectedItem.id ? { ...selectedItem } : item
      )
    );
    setIsEditOpen(false);
    setSelectedItem(null);
  }, [selectedItem]);

  const handleDeleteItem = useCallback(() => {
    if (!selectedItem) return;
    
    setItems(prevItems => prevItems.filter(item => item.id !== selectedItem.id));
    setIsDeleteOpen(false);
    setSelectedItem(null);
  }, [selectedItem]);

  const handleImageSelect = useCallback((imagePath: string) => {
    if (isEditingItem === 'new') {
      setNewItem(prev => ({ ...prev, image: imagePath }));
    } else if (isEditingItem === 'edit' && selectedItem) {
      setSelectedItem(prev => prev ? { ...prev, image: imagePath } : null);
    }
  }, [isEditingItem, selectedItem]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      
      if (isEditingItem === 'new') {
        setNewItem(prev => ({ ...prev, image: imageUrl }));
      } else if (isEditingItem === 'edit' && selectedItem) {
        setSelectedItem(prev => prev ? { ...prev, image: imageUrl } : null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false);
    }
  }, [isEditingItem, selectedItem]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchTerm]);

  const generateReport = useCallback(() => {
    const reportHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <title>דו"ח מלאי</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            direction: rtl;
          }
          .report-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px;
          }
          .item-card {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            background: white;
          }
          .item-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          .item-details {
            margin-top: 10px;
          }
          .item-category {
            color: #666;
            font-size: 0.9em;
          }
          @media print {
            .items-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>דו"ח מלאי</h1>
          <p>נוצר בתאריך: ${new Date().toLocaleDateString('he-IL')}</p>
        </div>
        <div class="items-grid">
          ${items.map(item => `
            <div class="item-card">
              <img src="${item.image}" alt="${item.name}" class="item-image">
              <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-category">${categories.find(cat => cat.id === item.category)?.name || 'קטגוריה לא ידועה'} ${categories.find(cat => cat.id === item.category)?.icon || ''}</p>
                <p>כמות: ${item.quantity}</p>
                <p>תאריך: ${item.date}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <script>
          window.onload = () => {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    
    if (win) {
      win.onload = () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [items]);

  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="חיפוש..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedCategory(null)}
          >
            {selectedCategory ? <X className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>

        {!selectedCategory && (
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="h-16 flex flex-col gap-1"
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="text-xs">{category.name}</span>
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="p-3">
              <div className="flex gap-3">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">
                    {categories.find(cat => cat.id === item.category)?.name} {categories.find(cat => cat.id === item.category)?.icon}
                  </p>
                  <p className="text-xs">כמות: {item.quantity}</p>
                  <div className="flex justify-end gap-2 mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsEditOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isNewItemOpen} onOpenChange={setIsNewItemOpen}>
        <DialogContent className="sm:max-w-[90%]">
          <DialogHeader>
            <DialogTitle>הוספת פריט חדש</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative w-full aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
              {newItem.image ? (
                <Image
                  src={newItem.image}
                  alt="Item preview"
                  fill
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="new-item-image"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <label
                  htmlFor="new-item-image"
                  className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isUploading ? 'מעלה...' : 'העלה תמונה'}
                  <Upload className="h-4 w-4 ml-2" />
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setIsEditingItem('new');
                    setIsCameraOpen(true);
                  }}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Input
              type="text"
              placeholder="שם הפריט"
              value={newItem.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewItem(prev => ({ ...prev, name: e.target.value }))
              }
            />
            <Input
              type="number"
              placeholder="כמות"
              value={newItem.quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewItem(prev => ({ ...prev, quantity: e.target.value }))
              }
            />
            <select
              className="w-full p-2 rounded-md border"
              value={newItem.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setNewItem(prev => ({ ...prev, category: e.target.value }))
              }
            >
              <option value="">בחר קטגוריה</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsNewItemOpen(false);
                setNewItem({
                  name: '',
                  quantity: '',
                  category: '',
                  image: null
                });
              }}>
                ביטול
              </Button>
              <Button onClick={handleAddItem}>
                הוספה
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[90%]">
          <DialogHeader>
            <DialogTitle>עריכת פריט</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
                {selectedItem.image ? (
                  <Image
                    src={selectedItem.image}
                    alt="Item preview"
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="edit-item-image"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="edit-item-image"
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {isUploading ? 'מעלה...' : 'העלה תמונה'}
                    <Upload className="h-4 w-4 ml-2" />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setIsEditingItem('edit');
                      setIsCameraOpen(true);
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Input
                type="text"
                placeholder="שם הפריט"
                value={selectedItem.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setSelectedItem(prev => prev ? { ...prev, name: e.target.value } : null)
                }
              />
              <Input
                type="number"
                placeholder="כמות"
                value={selectedItem.quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setSelectedItem(prev => prev ? { ...prev, quantity: parseInt(e.target.value) || 0 } : null)
                }
              />
              <select
                className="w-full p-2 rounded-md border"
                value={selectedItem.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  setSelectedItem(prev => prev ? { ...prev, category: e.target.value } : null)
                }
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsEditOpen(false);
                  setSelectedItem(null);
                }}>
                  ביטול
                </Button>
                <Button onClick={handleEditItem}>
                  שמירה
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[90%]">
          <DialogHeader>
            <DialogTitle>מחיקת פריט</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertCircle className="h-5 w-5" />
              <p>האם אתה בטוח שברצונך למחוק פריט זה?</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsDeleteOpen(false);
                setSelectedItem(null);
              }}>
                ביטול
              </Button>
              <Button variant="destructive" onClick={handleDeleteItem}>
                מחיקה
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={(open) => {
        if (!open) {
          stopCamera();
        }
        setIsCameraOpen(open);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>צלם תמונה</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={() => {
              setIsCameraOpen(false);
              stopCamera();
            }}>
              ביטול
            </Button>
            <Button onClick={captureImage}>
              צלם
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ImageGallery
        isOpen={isGalleryOpen}
        onClose={() => {
          setIsGalleryOpen(false);
          setIsEditingItem(null);
        }}
        onSelect={handleImageSelect}
      />

      <div className="fixed bottom-4 right-4 flex gap-2">
        <Button
          className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          onClick={generateReport}
        >
          <Download className="w-6 h-6" />
        </Button>
        <Button
          className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600 text-white shadow-lg"
          onClick={() => {
            setIsNewItemOpen(true);
            setNewItem({
              name: '',
              quantity: '',
              category: '',
              image: null
            });
          }}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
