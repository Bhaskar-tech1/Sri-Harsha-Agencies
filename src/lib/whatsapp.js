import { siteConfig } from '@/config/site';
import { formatCurrency } from '@/lib/pricing';

export function buildWhatsAppUrl(message) {
  const number = siteConfig.whatsappNumber.replace(/\D/g, '');
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppMessage(message) {
  const url = buildWhatsAppUrl(message);
  if (!url) return 'missing-number';
  const chat = window.open(url, '_blank');
  if (!chat) return 'blocked';
  chat.opener = null;
  return 'opened';
}

export function buildOrderMessage(lines, subtotal, customer) {
  const items = lines.map(({ product, variantLabel, quantity, price }) => {
    const lineTotal = quantity * price;
    return `• ${product.name}${variantLabel ? ` (${variantLabel})` : ''}\n  ${quantity} × ${formatCurrency(price)} = ${formatCurrency(lineTotal)}`;
  }).join('\n');
  return `Hello ${siteConfig.name}, I would like to place an order.\n\nCustomer details\nName: ${customer.name}\nPhone: ${customer.phone}\nDelivery address: ${customer.address}\nPIN code: ${customer.pinCode}\n\nOrder details\n${items}\n\nCart subtotal: ${formatCurrency(subtotal)}\n\nPlease share availability, delivery charges and delivery details.`;
}
