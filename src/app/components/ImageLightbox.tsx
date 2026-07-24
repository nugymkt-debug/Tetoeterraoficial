import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ImageLightbox({ images, currentIndex, onClose, onNext, onPrev }: ImageLightboxProps) {
  // Navegação por teclado: Esc fecha, setas trocam a foto
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && images.length > 1) onNext();
      if (e.key === 'ArrowLeft' && images.length > 1) onPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [images.length, onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      <img
        src={images[currentIndex]}
        alt="Visualização"
        className="max-w-[90%] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 px-4 py-2 rounded-full">
          <span className="text-white text-sm">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
}
