// Progressive enhancement only: product links and direct contact work without JavaScript.
document.addEventListener('click',e=>{for(const menu of document.querySelectorAll('.series-menu[open]'))if(!menu.contains(e.target))menu.open=false;});
document.addEventListener('keydown',e=>{if(e.key==='Escape')for(const menu of document.querySelectorAll('.series-menu[open]')){menu.open=false;menu.querySelector('summary').focus();}});
