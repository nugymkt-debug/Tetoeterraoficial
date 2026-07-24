import React, { useState, useRef, useEffect } from 'react';
import { X, Loader, Plus } from 'lucide-react';
import { API_BASE, adminFetch } from '../config/supabase';

interface MultiImageUploaderProps {
  onImagesChange: (urls: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
  label?: string;
}

export function MultiImageUploader({
  onImagesChange,
  currentImages = [],
  maxImages = 10,
  label = "Imagens"
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [images, setImages] = useState<string[]>(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mantém o estado interno em sincronia com o imóvel que está sendo editado
  useEffect(() => {
    const incoming = currentImages || [];
    setImages((prev) => (prev.join('|') === incoming.join('|') ? prev : incoming));
  }, [currentImages]);

  // Função para otimizar imagem
  const optimizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionar se muito grande (max 1920px)
          const maxDimension = 1920;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Erro ao criar contexto canvas'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Erro ao otimizar imagem'));
              }
            },
            'image/jpeg',
            0.85 // Qualidade 85%
          );
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = maxImages - images.length;

    if (remaining <= 0) {
      alert(`❌ Este imóvel já tem o máximo de ${maxImages} imagens.\n\nRemova alguma imagem antes de adicionar outra.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Envia o que couber em vez de recusar a seleção inteira
    let selectedFiles = files;
    if (files.length > remaining) {
      alert(
        `⚠️ Você selecionou ${files.length} imagens, mas ainda cabem apenas ${remaining} (limite de ${maxImages} por imóvel).\n\n` +
        `Serão enviadas as ${remaining} primeiras.`
      );
      selectedFiles = files.slice(0, remaining);
    }

    setUploading(true);
    setProgress({ done: 0, total: selectedFiles.length });
    const newImageUrls: string[] = [];

    try {
      // Inicializar storage
      await adminFetch(`${API_BASE}/storage/init`, { method: 'POST' });

      for (const file of selectedFiles) {
        // Validar tamanho original
        if (file.size > 10 * 1024 * 1024) {
          alert(`❌ Arquivo ${file.name} muito grande! Tamanho máximo: 10MB`);
          setProgress((p) => ({ ...p, done: p.done + 1 }));
          continue;
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
          alert(`❌ ${file.name} não é uma imagem!`);
          setProgress((p) => ({ ...p, done: p.done + 1 }));
          continue;
        }

        try {
          // Otimizar imagem
          const optimizedBlob = await optimizeImage(file);
          const optimizedFile = new File([optimizedBlob], file.name, { type: 'image/jpeg' });

          console.log(`📸 Imagem otimizada: ${file.name} - Original: ${(file.size / 1024).toFixed(0)}KB → Otimizada: ${(optimizedFile.size / 1024).toFixed(0)}KB`);

          // Fazer upload
          const formData = new FormData();
          formData.append('file', optimizedFile);

          const response = await adminFetch(`${API_BASE}/storage/upload`, {
            method: 'POST',
            body: formData
          });

          // Respostas de erro do gateway nem sempre são JSON
          const data = await response.json().catch(() => null);

          if (response.ok && data?.success) {
            newImageUrls.push(data.url);
          } else {
            alert(`❌ Erro ao enviar ${file.name}: ${data?.message || `falha no servidor (HTTP ${response.status})`}`);
          }
        } catch (error) {
          console.error(`Erro ao processar ${file.name}:`, error);
          alert(`❌ Erro ao processar ${file.name}`);
        } finally {
          setProgress((p) => ({ ...p, done: p.done + 1 }));
        }
      }

      if (newImageUrls.length > 0) {
        const updatedImages = [...images, ...newImageUrls];
        setImages(updatedImages);
        onImagesChange(updatedImages);
        alert(`✅ ${newImageUrls.length} imagem(ns) enviada(s) com sucesso!`);
      }
    } catch (error) {
      const isFetchError = error instanceof TypeError && (error as TypeError).message === 'Failed to fetch';
      if (isFetchError) {
        alert('❌ Upload não disponível neste ambiente.\n\nO upload de imagens funciona apenas após o deploy do projeto.');
      } else {
        console.error('Erro no upload:', error);
        alert('❌ Erro ao enviar imagens. Tente novamente.');
      }
    } finally {
      setUploading(false);
      setProgress({ done: 0, total: 0 });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#162936]">
        {label} ({images.length}/{maxImages})
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Imagem ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border-2 border-[#8494a4]/30"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  className="bg-white text-[#162936] p-2 rounded-full hover:bg-[#7f9f5f] hover:text-white transition-colors"
                  title="Mover para esquerda"
                >
                  ←
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                title="Remover"
              >
                <X className="w-4 h-4" />
              </button>
              {index < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  className="bg-white text-[#162936] p-2 rounded-full hover:bg-[#7f9f5f] hover:text-white transition-colors"
                  title="Mover para direita"
                >
                  →
                </button>
              )}
            </div>
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-[#7f9f5f] text-white text-xs px-2 py-1 rounded">
                Principal
              </div>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <div
            className="h-32 border-2 border-dashed border-[#8494a4]/30 rounded-lg hover:border-[#7f9f5f] transition-colors cursor-pointer flex flex-col items-center justify-center"
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader className="w-8 h-8 text-[#7f9f5f] animate-spin mb-2" />
                <p className="text-xs text-[#747c80]">
                  {progress.total > 1 ? `Enviando ${progress.done + 1} de ${progress.total}...` : 'Enviando...'}
                </p>
              </>
            ) : (
              <>
                <Plus className="w-8 h-8 text-[#8494a4] mb-2" />
                <p className="text-xs text-[#747c80] text-center px-2">
                  Adicionar imagem
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-[#747c80]">
        Imagens serão otimizadas automaticamente. Máximo 10MB por imagem.
      </p>

      {images.length >= maxImages && (
        <p className="text-xs text-[#7f9f5f] font-medium">
          Limite de {maxImages} imagens atingido. Remova alguma imagem para adicionar outra.
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}
