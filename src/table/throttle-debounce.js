function throttle(delay, noTrailing, callback, debounceMode) {
  // After wrapper has stopped being called, this timeout ensures that
  // `callback` is executed at the proper times in `throttle` and `end`
  // debounce modes.
  let timeoutID

  // Keep track of the last time `callback` was executed.
  let lastExec = 0

  // `noTrailing` defaults to falsy.
  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback
    callback = noTrailing
    noTrailing = undefined
  }

  // The `wrapper` function encapsulates all of the throttling / debouncing
  // functionality and when executed will limit the rate at which `callback`
  // is executed.
  function wrapper(...argss) {
    const self = this
    const elapsed = Number(new Date()) - lastExec
    const args = argss

    // Execute `callback` and update the `lastExec` timestamp.
    function exec() {
      lastExec = Number(new Date())
      callback.apply(self, args)
    }

    // If `debounceMode` is true (at begin) this is used to clear the flag
    // to allow future `callback` executions.
    function clear() {
      timeoutID = undefined
    }

    if (debounceMode && !timeoutID) {
      // Since `wrapper` is being called for the first time and
      // `debounceMode` is true (at begin), execute `callback`.
      exec()
    }

    // Clear any existing timeout.
    if (timeoutID) {
      clearTimeout(timeoutID)
    }

    if (debounceMode === undefined && elapsed > delay) {
      // In throttle mode, if `delay` time has been exceeded, execute
      // `callback`.
      exec()
    } else if (noTrailing !== true) {
      // In trailing throttle mode, since `delay` time has not been
      // exceeded, schedule `callback` to execute `delay` ms after most
      // recent execution.
      //
      // If `debounceMode` is true (at begin), schedule `clear` to execute
      // after `delay` ms.
      //
      // If `debounceMode` is false (at end), schedule `callback` to
      // execute after `delay` ms.
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay)
    }
  }

  // Return the wrapper function.
  return wrapper
}

function debounce(delay, atBegin, callback) {
  return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false)
}

module.exports = {
  throttle,
  debounce
}
