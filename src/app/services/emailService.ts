import emailjs from '@emailjs/browser';

// Configuração do EmailJS
// INSTRUÇÕES PARA CONFIGURAR:
// 1. Criar conta gratuita em https://www.emailjs.com/
// 2. Adicionar serviço de email (Gmail, Outlook, etc.) usando tetoeterrarealstate@hotmail.com
// 3. Criar um template de email
// 4. Copiar as chaves abaixo do painel EmailJS

const EMAILJS_SERVICE_ID = 'service_petropolis'; // Substitua pela sua Service ID
const EMAILJS_TEMPLATE_ID = 'template_contato'; // Substitua pela sua Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE'; // Substitua pela sua Public Key

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  interest: string;
  project?: string;
  message?: string;
  context?: string;
}

export const sendContactEmail = async (data: ContactFormData): Promise<boolean> => {
  try {
    // Preparar dados para o template do EmailJS
    const templateParams = {
      to_email: 'tetoeterrarealstate@hotmail.com',
      from_name: data.name,
      from_email: data.email,
      phone: data.phone,
      interest: data.interest,
      project: data.project || 'Não especificado',
      message: data.message || 'Sem mensagem adicional',
      context: data.context || 'Formulário de contato principal',
      reply_to: data.email,
    };

    // Enviar email usando EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email enviado com sucesso:', response);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
};

// Função alternativa usando FormSubmit (não requer configuração, mas tem limitações)
export const sendContactEmailViaFormSubmit = async (data: ContactFormData): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('Nome', data.name);
    formData.append('Email', data.email);
    formData.append('Telefone', data.phone);
    formData.append('Interesse', data.interest);
    formData.append('Empreendimento', data.project || 'Não especificado');
    formData.append('Mensagem', data.message || 'Sem mensagem');
    formData.append('Contexto', data.context || 'Formulário principal');

    const response = await fetch('https://formsubmit.co/ajax/75a79e4acdd620d92ad6fd3540d89bf0', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      console.log('Email enviado com sucesso via FormSubmit');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao enviar email via FormSubmit:', error);
    return false;
  }
};