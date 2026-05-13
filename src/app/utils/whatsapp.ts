export function buildWhatsAppUrl(phone: string | undefined, message: string): string {
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    const intl = digits.startsWith('55') ? digits : `55${digits}`;
    return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.link/phesg4?text=${encodeURIComponent(message)}`;
}
