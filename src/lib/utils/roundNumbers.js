/**
 * Utility function - simple Math.round method
 * alternative #1 - Math.round(num * 10) / 10; //*** returns 1 decimal
 * alternative #2 - Math.round((num + 0.00001) * 100) / 100; //*** returns 2 decimals
 */
function roundNumbers(number, decimals) {
  if (
    number === null ||
    number === undefined ||
    Number.isNaN(number) ||
    !parseFloat(number)
  ) {
    return;
  }
  // Truncate decimals with exponential notation
  if (
    !Number.isNaN(number) &&
    parseFloat(number) !== 0 &&
    -Math.floor(Math.log10(parseFloat(number)) + 1) >= decimals
  ) {
    return Number.parseFloat(number).toExponential(decimals);
  }
  return Number(
    Math.round(parseFloat(number) + ('e' + decimals)) + ('e-' + decimals)
  );
}

export default roundNumbers;
