/**
 * вызов функции будет происходить не чаще, чем раз в ${ms} миллисекунд
 * @param func {Function}
 * @param ms {number}
 * @returns {Function}
 */
export function throttle(func, ms) {
  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }
    func.apply(this, arguments);
    isThrottled = true;
    setTimeout(function() {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}
