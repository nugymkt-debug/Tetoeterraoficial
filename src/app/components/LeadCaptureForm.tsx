import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { MessageCircle } from 'lucide-react';
import { sendContactEmailViaFormSubmit } from '../services/emailService';

interface LeadCaptureFormProps {
  title?: string;
  subtitle?: string;
  context?: string; // Ex: "Empreendimentos", "Aluguel", "Investimento"
  compact?: boolean;
}

export function LeadCaptureForm({ 
  title = "Deixe seus dados",
  subtitle = "Nossa equipe entrará em contato em breve",
  context = "geral",
  compact = false
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Enviar email
      const emailData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        interest: 'Contato rápido',
        project: '',
        message: `Interessado em: ${context}`,
        context: `Formulário de captura - ${context}`
      };

      const success = await sendContactEmailViaFormSubmit(emailData);
      
      if (success) {
        alert('✅ Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.');
        // Limpar formulário
        setFormData({ name: '', phone: '', email: '' });
      } else {
        alert('❌ Erro ao enviar. Entre em contato via WhatsApp.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao enviar. Entre em contato via WhatsApp: (24) 99264-3607');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div className="bg-[#7f9f5f]/10 border border-[#7f9f5f]/20 rounded-2xl p-6">
        <h4 className="text-xl text-[#162936] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          {title}
        </h4>
        <p className="text-sm text-[#747c80] mb-4">{subtitle}</p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-[#8494a4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f9f5f] text-sm"
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="w-full px-4 py-2 border border-[#8494a4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f9f5f] text-sm"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2 border border-[#8494a4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f9f5f] text-sm"
          />
          <Button variant="primary" type="submit" className="w-full !text-sm !py-2" disabled={isSubmitting}>
            <MessageCircle className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#8494a4]/20">
      <h3 className="text-2xl text-[#162936] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
        {title}
      </h3>
      <p className="text-[#747c80] mb-6">{subtitle}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome completo"
          placeholder="Seu nome"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Telefone / WhatsApp"
          placeholder="(XX) XXXXX-XXXX"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <Input
          label="E-mail"
          placeholder="seu@email.com"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Button variant="primary" type="submit" className="w-full" disabled={isSubmitting}>
          <MessageCircle className="w-5 h-5 mr-2" />
          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
        </Button>
      </form>
    </div>
  );
}