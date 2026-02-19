/**
 * Formatea un número como moneda dominicana con comas y símbolo RD$
 * @param amount - El monto a formatear
 * @param decimals - Número de decimales (por defecto 2)
 * @returns String formateado como moneda (ej: RD$1,234.56)
 */
export function formatCurrency(amount: number, decimals: number = 2): string {
  return `RD$${amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
}

/**
 * Formatea un número como pesos dominicanos usando Intl.NumberFormat
 * Formato oficial: RD$ 35,000.00
 * @param amount - El monto a formatear
 * @returns String formateado como moneda dominicana
 */
export function formatCurrencyDOP(amount: number): string {
  const formatted = new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  // Intl.NumberFormat puede retornar "RD$" o "DOP" dependiendo del navegador
  // Aseguramos que siempre sea "RD$"
  return formatted.replace('DOP', 'RD$');
}