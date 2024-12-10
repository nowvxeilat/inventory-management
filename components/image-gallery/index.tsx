import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imagePath: string) => void;
}

export function ImageGallery({ isOpen, onClose, onSelect }: ImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>בחר תמונה מהגלריה</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full p-4">
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              <div>טוען תמונות...</div>
            ) : images.length === 0 ? (
              <div>אין תמונות בגלריה</div>
            ) : (
              images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer hover:opacity-80"
                  onClick={() => {
                    onSelect(image);
                    onClose();
                  }}
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
