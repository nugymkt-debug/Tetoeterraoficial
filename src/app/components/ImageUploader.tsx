import React, { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { API_BASE as API_BASE_URL, adminFetch } from '../config/supabase';

const API_BASE = API_BASE_URL;

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
  accept?: string;
}

export function ImageUploader({ onUpload, currentImage, label = "Imagem", accept = "image/*" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ Arquivo muito grande! Tamanho máximo: 10MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('❌ Apenas imagens são permitidas!');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      // Inicializar storage (caso não exista)
      await adminFetch(`${API_BASE}/storage/init`, { method: 'POST' });

      // Fazer upload
      const formData = new FormData();
      formData.append('file', file);

      const response = await adminFetch(`${API_BASE}/storage/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        onUpload(data.url);
        setPreview(data.url);
        alert('✅ Imagem enviada com sucesso!');
      } else {
        alert('❌ Erro ao enviar imagem: ' + (data?.message || `falha no servidor (HTTP ${response.status})`));
        setPreview(currentImage || null);
      }
    } catch (error) {
      const isFetchError = error instanceof TypeError && (error as TypeError).message === 'Failed to fetch';
      if (isFetchError) {
        alert('❌ Upload não disponível neste ambiente.\n\nO upload de imagens funciona apenas após o deploy do projeto.');
      } else {
        console.error('Erro no upload:', error);
        alert('❌ Erro ao enviar imagem. Tente novamente.');
      }
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#162936]">{label}</label>

      <div className="border-2 border-dashed border-[#8494a4]/30 rounded-xl p-4 hover:border-[#7f9f5f] transition-colors">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-8 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader className="w-12 h-12 text-[#7f9f5f] animate-spin mb-3" />
                <p className="text-sm text-[#747c80]">Enviando...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-[#8494a4] mb-3" />
                <p className="text-sm font-medium text-[#162936] mb-1">
                  Clique para selecionar uma imagem
                </p>
                <p className="text-xs text-[#747c80]">
                  PNG, JPG, WEBP (máx. 10MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}
