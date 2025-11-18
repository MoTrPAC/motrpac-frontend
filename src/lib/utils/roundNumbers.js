/* eslint-disable no-else-return */
import fromExponential from 'from-exponential';
/**
 * Utility function - simple Math.round method
 * alternative #1 - Math.round(num * 10) / 10; //*** returns 1 decimal
 * alternative #2 - Math.round((num + 0.00001) * 100) / 100; //*** returns 2 decimals
 */
function roundNumbers(number, decimals) {
  if (number === null || number === undefined) {
    return;
  }
  // Truncate decimals with exponential notation
  if (number && parseFloat(number) && number.toString().indexOf('e-') > -1) {
    const originalFloat = fromExponential(parseFloat(number));
    return Number.parseFloat(originalFloat).toExponential(decimals);
  } else if (
    number &&
    parseFloat(number) &&
    -Math.floor(Math.log10(parseFloat(number)) + 1) >= decimals
  ) {
    return Number.parseFloat(number).toExponential(decimals);
  } else {
    return Number(
      Math.round(parseFloat(number) + ('e' + decimals)) + ('e-' + decimals),
    );
  }
}

export default roundNumbers;
