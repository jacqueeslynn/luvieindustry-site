// Progressive enhancement only: product links and direct contact work without JavaScript.
document.addEventListener('click',e=>{for(const menu of document.querySelectorAll('.series-menu[open]'))if(!menu.contains(e.target))menu.open=false;});
document.addEventListener('keydown',e=>{if(e.key==='Escape')for(const menu of document.querySelectorAll('.series-menu[open]')){menu.open=false;menu.querySelector('summary').focus();}});
for(const section of document.querySelectorAll('#buying-guides')){
 const search=section.querySelector('.series-search');if(!search)continue;
 const rows=[...section.querySelectorAll('li')],details=section.querySelector('details');
 if(rows.length<7)continue;
 search.hidden=false;
 const normalize=s=>s.normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase();
 search.querySelector('input').addEventListener('input',e=>{
  const terms=normalize(e.target.value).trim().split(/\s+/).filter(Boolean);let count=0;
  for(const row of rows){row.hidden=!terms.every(t=>normalize(row.textContent).includes(t));if(!row.hidden)count++;}
  if(details){details.open=terms.length>0;details.hidden=terms.length>0&&!details.querySelector('li:not([hidden])');}
  search.querySelector('[role="status"]').hidden=count>0;
 });
}
