/** Convert a Pakistani number (0300-1234567 / +92…) into a wa.me link */
export function whatsappLinkFor(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0092')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = `92${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}
