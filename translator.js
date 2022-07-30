const LEO_API_URL = 'https://api.lingualeo.com/getTranslates'

const link = document.createElement('link');
link.href =  browser.runtime.getURL('fp.css');
link.rel = 'stylesheet';
document.documentElement.insertBefore(link, document.documentElement.firstChild);

let cx;
let cy;

document.ondblclick = function(e){
  const selection = window.getSelection().toString();
  cx = e.clientX - 50;
  cy = e.clientY - 30 + window.scrollY;
  if (selection.length && e.metaKey) sendData(selection);
}

document.onclick = function(e) {
  const fp = document.getElementById('notes_float_panel_translation');
  fp && document.body.removeChild(fp);
}

const showTranslation = function(data){
  const div = document.createElement('div');

  div.id = 'notes_float_panel_translation';
  div.innerHTML = data;
  div.style.cssText = 'left:'+cx+'px;\
                         top:' +cy+'px;'

  document.body.appendChild(div);
};

const sendData = function(selection){
  const data = {
    'apiVersion': '1.0.1',
    'op': 'getTranslates',
    'text': selection,
    'ctx': {
      'config': {
        'isCheckData': true,
        'isLogging': true
      }
    }
  }

  const request = new Request(LEO_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  fetch(request).
    then(response => response.json()).
    then(resp => showTranslation(resp.translation));
}
