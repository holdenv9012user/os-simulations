const $ = id => document.getElementById(id);
let timers = [], highest = 10, activeId = null;
const opened = new Map();
function later(delay, fn) { timers.push(setTimeout(fn, delay)); }
function cancelBoot() { timers.forEach(clearTimeout); timers = []; }
function menu(open) { $('start-menu').hidden = !open; $('start').setAttribute('aria-expanded', String(open)); }
function desktop() {
  cancelBoot(); $('bios').hidden = true; $('splash').hidden = true; $('off').hidden = true;
  $('desktop').hidden = false; $('boot-controls').hidden = true; $('start').focus();
}
function boot() {
  cancelBoot(); opened.clear(); $('windows').replaceChildren(); $('tasks').replaceChildren(); activeId = null; highest = 10;
  menu(false); $('desktop').hidden = true; $('off').hidden = true; $('bios').hidden = false;
  $('splash').hidden = true; $('boot-controls').hidden = false; $('memory').textContent = '0';
  const old = $('bios-extra'); if (old) old.remove();
  [8192,16384,24576,32768].forEach((n,i) => later(250 + i*250, () => $('memory').textContent = n));
  later(1300, () => { const text = document.createElement('span'); text.id='bios-extra'; text.textContent='\nDetecting Primary Master ... IDE HARD DISK\n\nStarting Windows 95...'; $('post').append(text); });
  later(2300, () => { $('bios').hidden = true; $('splash').hidden = false; });
  later(5700, desktop);
}
function focusWindow(id) {
  const entry = opened.get(id); if (!entry) return;
  activeId = id; entry.win.hidden = false; entry.win.style.zIndex = ++highest;
  for (const [key, item] of opened) { item.win.classList.toggle('active',key===id); item.task.classList.toggle('active',key===id); }
}
function focusRemaining() {
  activeId = null;
  const visible = [...opened].filter(([,entry]) => !entry.win.hidden).sort((a,b) => Number(b[1].win.style.zIndex)-Number(a[1].win.style.zIndex));
  if (visible.length) focusWindow(visible[0][0]);
}
function file(label, target, glyph='▰') { return `<button class="file-icon" data-open="${target}"><span class="file-glyph" aria-hidden="true">${glyph}</span>${label}</button>`; }
const pages = {
  computer: ['My Computer', `<div class="items">${file('3½ Floppy (A:)','floppy')}${file('(C:)','drive')}${file('Control Panel','settings','⚙')}${file('Printers','printers','▤')}</div>`, '4 object(s)'],
  drive: ['(C:)', `<div class="items">${file('Windows','windowsFolder','📁')}${file('My Documents','documents','📁')}${file('Program Files','programs','📁')}</div>`, '3 object(s)'],
  windowsFolder: ['Windows', `<div class="items">${file('Notepad','notepad','▤')}${file('Read Me','readme','▱')}</div>`, '2 object(s)'],
  network: ['Network Neighborhood', '<p>No other computers were found on this network.</p>', '0 object(s)'],
  recycle: ['Recycle Bin', '', '0 object(s)'],
  floppy: ['3½ Floppy (A:)', '<p>The device is not ready.</p><p>There is no disk in this simulated drive.</p>', 'Drive A:'],
  printers: ['Printers', '<p>No printers are installed.</p>', '0 object(s)'],
  documents: ['My Documents', `<div class="items">${file('Read Me.txt','readme','▱')}</div>`, '1 object(s)'],
  programs: ['Programs', `<div class="items">${file('Notepad','notepad','▤')}${file('MS-DOS Prompt','dos','▣')}</div>`, '2 object(s)'],
  settings: ['Control Panel', '<h3>Display properties</h3><p>Choose a desktop color:</p><button class="raised run-submit" data-color="#008080">Teal</button> <button class="raised run-submit" data-color="#3a6ea5">Blue</button> <button class="raised run-submit" data-color="#556b2f">Olive</button>', 'Personalize this simulation'],
  find: ['Find', '<p>This simulated computer has a small collection of sample programs.</p><p>Open Programs to try Notepad or the MS-DOS Prompt.</p><button class="raised run-submit" data-open="programs">Open Programs</button>', 'Local simulation'],
  help: ['Windows Help', '<h3>Welcome to Windows 95</h3><p>Double-click a desktop icon to open it. On touch screens, tap once. You can also focus an icon and press Enter.</p><p>Drag a window by its title bar. Use the title-bar buttons to minimize, maximize, or close it. Click its taskbar button to restore it.</p><p>Choose Start → Shut Down to finish. Everything here runs inside this page.</p>', 'Windows Help'],
  readme: ['Read Me.txt', '<h3>Welcome to your simulated PC!</h3><p>This Windows 95-inspired desktop is made entirely with HTML, CSS, and JavaScript.</p><p>Explore My Computer, type in Notepad, or change the desktop color in Control Panel. Changes last only for this session.</p>', 'Read Me'],
  notepad: ['Untitled - Notepad', '<textarea aria-label="Notepad document" spellcheck="false" placeholder=""></textarea>', 'Text is kept while this window is open'],
  dos: ['MS-DOS Prompt', '<pre>Microsoft(R) Windows 95\n   (C)Copyright Microsoft Corp 1981-1995.\n\nC:\\WINDOWS&gt;_</pre><p>Display-only command prompt.</p>', 'MS-DOS simulation'],
  run: ['Run', '<p>Type the name of a program, and Windows will open it for you.</p><form id="run-form"><label class="run-row">Open: <input name="command" autocomplete="off" aria-label="Program name"></label><button class="raised run-submit">OK</button><p id="run-message">Try notepad, explorer, control, or command.</p></form>', 'Run a simulated program']
};
function openWindow(id) {
  menu(false); if (!pages[id]) return; if (opened.has(id)) { focusWindow(id); return; }
  const [title, html, status] = pages[id];
  const win = document.createElement('section'); win.className='window raised'; win.setAttribute('aria-label',title);
  const offset = opened.size * 24;
  win.style.left = Math.min(125+offset,Math.max(12,innerWidth-580))+'px';
  win.style.top = Math.min(55+offset,Math.max(12,innerHeight-420))+'px';
  win.innerHTML=`<div class="titlebar"><span class="title">${title}</span><button data-window="minimize" aria-label="Minimize">_</button><button data-window="maximize" aria-label="Maximize">□</button><button data-window="close" aria-label="Close">×</button></div><div class="menubar" aria-hidden="true">File Edit View Help</div><div class="window-content">${html}</div><div class="statusbar">${status}</div>`;
  const task=document.createElement('button'); task.className='task raised'; task.textContent=title;
  $('windows').append(win); $('tasks').append(task); opened.set(id,{win,task}); focusWindow(id);
  win.addEventListener('pointerdown',()=>focusWindow(id));
  task.addEventListener('click',()=>{ if(activeId===id&&!win.hidden){win.hidden=true;task.classList.remove('active');focusRemaining();}else focusWindow(id); });
  win.addEventListener('click',event=>{
    const action=event.target.closest('[data-window]')?.dataset.window;
    if(action==='close'){win.remove();task.remove();opened.delete(id);focusRemaining();}
    if(action==='minimize'){win.hidden=true;task.classList.remove('active');focusRemaining();}
    if(action==='maximize'){win.classList.toggle('maximized');event.target.setAttribute('aria-label',win.classList.contains('maximized')?'Restore':'Maximize');}
  });
  const bar=win.querySelector('.titlebar'); let drag=null;
  bar.addEventListener('pointerdown',event=>{
    if(event.target.closest('button')||win.classList.contains('maximized'))return;
    const rect=win.getBoundingClientRect();drag={x:event.clientX-rect.left,y:event.clientY-rect.top};bar.setPointerCapture(event.pointerId);
  });
  bar.addEventListener('pointermove',event=>{if(!drag)return;win.style.left=Math.max(0,Math.min(innerWidth-win.offsetWidth,event.clientX-drag.x))+'px';win.style.top=Math.max(0,Math.min(innerHeight-70,event.clientY-drag.y))+'px';});
  bar.addEventListener('pointerup',()=>drag=null);bar.addEventListener('pointercancel',()=>drag=null);
  bar.addEventListener('dblclick',event=>{if(!event.target.closest('button'))win.classList.toggle('maximized');});
  if(id==='run')win.querySelector('form').addEventListener('submit',event=>{
    event.preventDefault();const command=new FormData(event.target).get('command').trim().toLowerCase().replace(/\.exe$/,'');
    const target={notepad:'notepad',explorer:'computer',control:'settings',command:'dos'}[command];
    if(target)openWindow(target);else $('run-message').textContent='Cannot find that program. Try notepad, explorer, control, or command.';
  });
}
document.addEventListener('click',event=>{
  const target=event.target.closest('[data-open]');
  if(target&&!target.classList.contains('desktop-icon'))openWindow(target.dataset.open);
  const color=event.target.closest('[data-color]');if(color)$('desktop').style.background=color.dataset.color;
  if(!event.target.closest('#start-menu')&&!event.target.closest('#start'))menu(false);
});
document.querySelectorAll('.desktop-icon').forEach(icon=>{
  icon.addEventListener('dblclick',()=>openWindow(icon.dataset.open));
  icon.addEventListener('click',event=>{if(event.detail===0)openWindow(icon.dataset.open);});
  icon.addEventListener('pointerup',event=>{if(event.pointerType==='touch')openWindow(icon.dataset.open);});
});
$('start').addEventListener('click',()=>menu($('start-menu').hidden));
document.addEventListener('keydown',event=>{if(event.key==='Escape')menu(false);});
$('shutdown').addEventListener('click',()=>{menu(false);$('shutdown-dialog').returnValue='cancel';$('shutdown-dialog').showModal();});
$('shutdown-dialog').addEventListener('close',()=>{
  if($('shutdown-dialog').returnValue!=='okay')return;
  if(document.querySelector('input[name="power"]:checked').value==='restart'){boot();return;}
  $('desktop').hidden=true;$('off').hidden=false;$('power-on').focus({preventScroll:true});$('power-on').blur();
});
$('skip').addEventListener('click',desktop);$('power-on').addEventListener('click',boot);
function clock(){ $('clock').textContent=new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}); }
clock();setInterval(clock,1000);boot();
