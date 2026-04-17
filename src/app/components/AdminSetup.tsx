import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { X, Lock, User, Key } from 'lucide-react';
import { SUPABASE_ANON_KEY, API_BASE as API_BASE_URL } from '../config/supabase';

const publicAnonKey = SUPABASE_ANON_KEY;
const API_BASE = API_BASE_URL;

interface AdminSetupProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminSetup({ onClose, onSuccess }: AdminSetupProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!secretKey) {
      setError('Digite a chave secreta de configuração');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/admin/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ username, password, secretKey })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Credenciais configuradas com sucesso!\n\nAnote as credenciais:\nUsuário: ' + username + '\nSenha: (a que você definiu)');
        onSuccess();
      } else {
        setError(data.message || 'Erro ao configurar credenciais');
      }
    } catch (error) {
      const isFetchError = error instanceof TypeError && (error as TypeError).message === 'Failed to fetch';
      if (isFetchError) {
        setError('Não foi possível conectar ao servidor. A configuração admin funciona apenas após o deploy do projeto.');
      } else {
        console.error('Erro no setup:', error);
        setError('Erro ao conectar com o servidor. Certifique-se que o servidor Supabase foi deployado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#162936]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Configurar Painel Admin
          </h2>
          <button onClick={onClose} className="text-[#747c80] hover:text-[#162936]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          <p className="font-bold mb-2">⚠️ Configure APENAS UMA VEZ</p>
          <p className="text-xs">
            Defina o usuário e senha que sua cliente usará para acessar o painel administrativo.
            Esta ação só pode ser feita uma vez.
          </p>
        </div>

        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#162936] mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Usuário
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#162936] mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Senha
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
            />
            <p className="text-xs text-[#747c80] mt-1">Mínimo 8 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#162936] mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Confirmar Senha
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite a senha novamente"
              required
            />
          </div>

          <div className="pt-4 border-t border-[#8494a4]/20">
            <label className="block text-sm font-medium text-[#162936] mb-2">
              <Key className="w-4 h-4 inline mr-2" />
              Chave Secreta de Configuração
            </label>
            <Input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="TETO-TERRA-SETUP-2026"
              required
            />
            <p className="text-xs text-[#747c80] mt-1">
              Chave: <code className="bg-[#7f9f5f]/10 px-2 py-1 rounded text-[#162936]">TETO-TERRA-SETUP-2026</code>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Configurando...' : 'Configurar Credenciais'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
