const element = document.getElementById('topText');
//element.style.textAlign = 'center';
element.style.wordSpacing = 25;

window.addEventListener('scroll', function() {
    var topLine = document.querySelector('#topLine');
    topLine.style.top = window.pageYOffset + 'px';
  });
