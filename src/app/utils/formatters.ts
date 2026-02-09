/**
 * Formatea un número como moneda con comas y símbolo de dólar
 * @param amount - El monto a formatear
 * @param decimals - Número de decimales (por defecto 2)
 * @returns String formateado como moneda (ej: $1,234.56)
 */
export function formatCurrency(amount: number, decimals: number = 2): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
}

/**
 * Formatea un número con comas sin símbolo de moneda
 * @param value - El número a formatear
 * @returns String formateado con comas (ej: 1,234)
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Convierte un string de moneda a número
 * @param currency - String de moneda (ej: "$1,234.56")
 * @returns Número parseado
 */
export function parseCurrency(currency: string): number {
  return parseFloat(currency.replace(/[$,]/g, '')) || 0;
}
