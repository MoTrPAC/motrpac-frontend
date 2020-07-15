/**
 * Generic page visibility detection for invoke function call
 */
function onVisibilityChange(handleVisible, handleHidden) {
  let hidden;
  let visibilityChange;
  // Set the name of the hidden property and the change event for visibility
  if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }

  function handleVisibilityChange() {
    if (!document[hidden]) {
      handleVisible();
    } else {
      handleHidden();
    }
  }

  if (typeof document.addEventListener === 'undefined' || hidden === undefined) {
    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    console.warn('This browser does not support Page Visibility API');
  } else {
    // Handle page visibility change
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }
}

export default onVisibilityChange;
