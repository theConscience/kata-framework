/**
  * throttle(func, delay) - нормализует количество вызовов одной функции так,
  * чтобы реально вызывалась она не чаще, чем 1 раз за delay миллисекунд
  *
  * Использование:
  throttle(function() { //some code }, 60)()
  или в обработчике:
  window.addEventListener('resize', throttle(function() { //some code }, 60));
*/

function throttle(func, delay) {
  var is_throttled = false, context, args;
  function throttled_wrapper() {
    if (is_throttled) {
      context = this;
      args = arguments;
      return;
    }
    func.apply(this, arguments);
    is_throttled = true;
    setTimeout(function() {
      is_throttled = false;
      if (args) {
        throttled_wrapper.apply(context, args);
        context = args = null;
      }
    }, delay);
  }
  return throttled_wrapper;
}
