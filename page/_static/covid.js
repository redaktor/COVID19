// keep it simple
  var links = document.querySelectorAll('a');
  function resize() {
    var sw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    document.querySelector('iframe').style.display = sw < 880 ? 'none' : 'block';
    var i = 0;
    for (i=0; i < links.length; i++) { links[i].target = sw < 880 ? '_blank' : 'ushahidi' }
  }
  window.onresize = resize;
