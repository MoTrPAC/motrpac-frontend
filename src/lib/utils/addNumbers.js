/**
 * Utility function to return the sum of numeric values
 */
const addNumbers = (arrayOfNumbers) => {
  let total = 0;
  arrayOfNumbers.forEach((value) => {
    if (typeof Number(value) === 'number') {
      total += Number(value);
    }
  });
  return total;
};

export default addNumbers;
