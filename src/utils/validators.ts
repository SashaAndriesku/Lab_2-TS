export namespace Validation {
  export function isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  export function isDigitsOnly(value: string): boolean {
    return /^\d+$/.test(value.trim());
  }

  export function isValidYear(value: string): boolean {
    if (!isDigitsOnly(value)) return false;
    const year = parseInt(value, 10);
    const currentYear = new Date().getFullYear();
    return year >= 1000 && year <= currentYear;
  }

  export function isValidEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  }
}