/**
 * Method to generate UUID
 * A RFC4122 version 4 compliant solution that solves that issue by offsetting the first 13 hex numbers
 * by a hex portion of the timestamp. That way, even if Math.random is on the same seed, both clients
 * would have to generate the UUID at the exact same millisecond (or 10,000+ years later) to get the same UUID.
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
function generateUUID() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    // use high-precision timer if available
    d += performance.now();
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return uuid;
}

export default generateUUID;
