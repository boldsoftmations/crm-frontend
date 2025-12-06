// utils/validateQuantity.js
export function DecimalValidation({
  numTypes = [],
  quantities = [],
  decimalCounts = [],
  unit,
  handleError,
}) {
  for (let i = 0; i < quantities.length; i++) {
    const type = numTypes[i];
    const q = quantities[i];
    const decimalCount = decimalCounts[i];

    // CASE 1: type = "number" -> only whole numbers allowed
    if (type === "number") {
      if (!/^\d+$/.test(q)) {
        handleError(`Decimal digits not allowed in ${unit[i]} unit `);
        return false;
      }
    }

    // CASE 2: decimal unit type
    else {
      // Pure numbers not allowed — decimal required
      if (/^\d+$/.test(q)) {
        handleError(
          `Numbers are not allowed in ${unit[i]} unit — only decimals`
        );
        return false;
      }

      // Allow only decimals with EXACT required digits
      const pattern = new RegExp(`^\\d*\\.\\d{${decimalCount}}$`);

      if (!pattern.test(q)) {
        handleError(
          `Only decimals with exactly ${decimalCount} digit(s) after decimal are allowed`
        );
        return false;
      }
    }
  }

  return true; // ✔ validation passed
}
