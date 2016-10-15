/**
  * debounce(func, delay) - если функция вызвана, то она не сработает, пока не
  * пройдёт delay времени без единого повторного вызова
  * Использование:
  debounce(function() { //some code }, 60)()
  или в обработчике:
  window.addEventListener('resize', debounce(function() { //some code }, 60));
*/

function debounce(func, delay) {
  var delay_timer = null;
  return function() {
    var context = this,  // сохраняем контекст, в котором вызывается debounce
      args = arguments;  // сохраняем аргументы переданные в функцию
    //console.log(args);
    clearTimeout(delay_timer);
    delay_timer = setTimeout(function() {
      func.apply(context, args); // выполняем нашу функцию в контексте в котором вызвали debounce, с нужными аргументами
    }, delay);
  };
}
