/**
 * Generic page visibility detection for invoke function call
 */
function onVisibilityChange() {
  let hidden;
  let visibilityChange;
  // Set the name of the hidden property and the change event for visibility
  // Opera 12.10 and Firefox 18 and later support
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  } else {
    console.warn('This browser does not support Page Visibility API');
  }

  return { hidden, visibilityChange };
}

export default onVisibilityChange;
