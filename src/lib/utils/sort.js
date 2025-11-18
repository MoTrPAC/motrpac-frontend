/**
 * Sort list by timeStamp number (e.g. '1547241116820') in descending order
 */
function sortByNumber(list, field) {
  let sortedList = [];
  if (list.length) {
    sortedList = list.sort((x, y) =>
      Number.parseFloat(x[field]) !== Number.parseFloat(y[field])
        ? Number.parseFloat(x[field]) > Number.parseFloat(y[field])
          ? -1
          : 1
        : 0,
    );
  }
  return sortedList;
}

export default sortByNumber;
