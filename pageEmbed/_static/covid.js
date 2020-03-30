// keep it simple
var frame = document.getElementById('ushahidi');
var framelinks = document.querySelectorAll('a.frame');
var mailTxt = document.querySelectorAll('.nospace_m');
setTimeout(function() {
  for (i=0; i < mailTxt.length; i++) {
    mailTxt[i].innerHTML = mailTxt[i].innerHTML.replace(' ','@').replace(' ','.');
  }
}, 2001);

function resize() {
  var sw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  frame.style.display = sw < 880 ? 'none' : 'block';
  var i = 0;
  for (i=0; i < framelinks.length; i++) {
    framelinks[i].target = sw < 880 ? '_blank' : 'ushahidi'
  }
}
window.onresize = resize;
resize()
