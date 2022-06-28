const LEO_API_URL = 'https://api.lingualeo.com/getTranslates'

const link = document.createElement('link');
link.href =  browser.runtime.getURL('fp.css');
link.rel = 'stylesheet';
document.documentElement.insertBefore(link, document.documentElement.firstChild);

let cx;
let cy;

document.onmouseup = function(e){
  const fp = document.getElementById('notes_float_panel');
  const selection = window.getSelection().toString();
  if ( check(selection, fp) ){
    cx = e.clientX - 50;
    cy = e.clientY - 30 + document.body.scrollTop;
    popup.invoke(cx, cy);
    popup.getSel(selection);
  }
}

function remove_panel(fp){
  if (!fp) return;

  fp.removeEventListener("mousedown", popup.sendData);
  document.body.removeChild(fp);
}

function check(selection,fp){
  if (selection.length && fp){
    if (selection != popup.data){
      remove_panel(fp);
      return true;
    }
    remove_panel(fp);
    return;
  }
  else if (selection.length && !fp){
    return true;
  }
  else if (!selection.length && fp){
    remove_panel(fp);
    return;
  }
  else if (!selection.length && !fp){
    return;
  }
  else
    return true;
}
// function: remove element with id "notes_float_panel_translation" on click somewhere on page
document.onclick = function(e) {   // при клике на странице
  const fp = document.getElementById('notes_float_panel_translation');
  remove_panel(fp);
}

const popup = {
  data: "",

  invoke: function(x,y){
    const fp = document.createElement('img');

    fp.id = 'notes_float_panel';
    fp.src = browser.runtime.getURL("edit.png");
    fp.style.cssText = 'left:'+x+'px;\
                        top:' +y+'px;';
    fp.addEventListener("mousedown", popup.sendData);

    document.body.appendChild(fp);
  },

  getSel: function(data){
    this.data = data;
  },

  showTranslation: function(data){
    const div = document.createElement('div');

    div.id = 'notes_float_panel_translation';
    div.innerHTML = data;
    div.style.cssText = 'left:'+cx+'px;\
                         top:' +cy+'px;'

    document.body.appendChild(div);
    const fp = document.getElementById('notes_float_panel');
    remove_panel(fp)
  },

  sendData: function(ev){
    ev.stopPropagation();
    const fp = document.getElementById('notes_float_panel');
    remove_panel(fp);

    const data = {
      'apiVersion': '1.0.1',
      'op': 'getTranslates',
      'text': popup.data,
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
      then(resp => popup.showTranslation(resp.translation));
  }
}
