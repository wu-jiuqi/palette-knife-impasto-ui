const toast=document.querySelector('.toast');const field=document.querySelector('.particle-field');let timer;
const messages={start:'旅程已开启 · 颜料正在流动',gallery:'画廊档案将在下一幕展开',settings:'设置面板 · 由运行时接管'};
function burst(btn){const r=btn.getBoundingClientRect();const cx=r.left+r.width*.78,cy=r.top+r.height*.52;for(let i=0;i<18;i++){const p=document.createElement('i');p.className='paint-particle '+(['','gold','cream'][i%3]);p.style.left=cx+'px';p.style.top=cy+'px';p.style.setProperty('--dx',((Math.random()-.5)*170)+'px');p.style.setProperty('--dy',((Math.random()-.68)*130)+'px');p.style.setProperty('--rot',((Math.random()-.5)*420)+'deg');p.style.animationDelay=(i*10)+'ms';field.appendChild(p);setTimeout(()=>p.remove(),900)}}
document.querySelectorAll('.menu-btn').forEach(btn=>{btn.addEventListener('click',()=>{burst(btn);toast.textContent=messages[btn.dataset.action];toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),1800)})});
const dropBtn=document.querySelector('#dropBtn'),dropMenu=document.querySelector('#dropMenu');
const modal=document.querySelector('#modal'),infoBtn=document.querySelector('#infoBtn'),closeTip=document.querySelector('#closeTip');
let modalTrigger=null;
function closeModal(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');if(modalTrigger){modalTrigger.focus();modalTrigger=null}}
function closeDropdown(){dropMenu.classList.remove('open');dropBtn.setAttribute('aria-expanded','false')}
window.addEventListener('keydown',e=>{
  const target=e.target;
  const isInteractive=target instanceof HTMLElement&&['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(target.tagName);
  if(e.key==='Enter'&&!isInteractive){document.querySelector('.primary').click()}
  if(e.key==='Escape'){
    if(modal.classList.contains('show')) closeModal();
    else if(dropMenu.classList.contains('open')){closeDropdown();dropBtn.focus()}
    toast.classList.remove('show');
  }
  if(e.key==='Tab'&&modal.classList.contains('show')){
    e.preventDefault();closeTip.focus();
  }
});
dropBtn.addEventListener('click',()=>{const open=!dropMenu.classList.contains('open');dropMenu.classList.toggle('open',open);dropBtn.setAttribute('aria-expanded',String(open))});
dropMenu.querySelectorAll('button').forEach(opt=>opt.addEventListener('click',()=>{dropBtn.querySelector('span').textContent=opt.dataset.filter;dropMenu.querySelectorAll('[role="option"]').forEach(item=>item.setAttribute('aria-selected',String(item===opt)));closeDropdown();toast.textContent='筛选：'+opt.dataset.filter;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),1600)}));
infoBtn.addEventListener('click',()=>{modalTrigger=infoBtn;modal.classList.add('show');modal.setAttribute('aria-hidden','false');requestAnimationFrame(()=>closeTip.focus())});closeTip.addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('click',e=>{if(!e.target.closest('.select-wrap'))closeDropdown()});
document.querySelector('#search').addEventListener('input',e=>{if(e.target.value){toast.textContent='正在刮开：'+e.target.value;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),1200)}});

// Full component atlas: filters and state feedback stay semantic while the painted surface remains intact.
const atlasTabs=document.querySelectorAll('.atlas-tab');
const atlasCards=document.querySelectorAll('.showcase-card');
atlasTabs.forEach(tab=>tab.addEventListener('click',()=>{atlasTabs.forEach(item=>{item.classList.toggle('active',item===tab);item.setAttribute('aria-current',item===tab?'page':'false')});const family=tab.dataset.tab;atlasCards.forEach(card=>{card.hidden=family!=='all'&&card.dataset.family!==family})}));
document.querySelectorAll('.mini-tab').forEach(tab=>tab.addEventListener('click',()=>{const parent=tab.closest('.mini-tabs');parent.querySelectorAll('.mini-tab').forEach(item=>{const active=item===tab;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active))})}));
const wetness=document.querySelector('#wetness'),rangeValue=document.querySelector('#rangeValue');
wetness?.addEventListener('input',()=>{rangeValue.textContent=wetness.value+'%';wetness.closest('.showcase-card')?.querySelector('.progress-paint')?.setAttribute('aria-valuenow',wetness.value)});
document.querySelectorAll('[data-demo-toast]').forEach(control=>control.addEventListener('click',()=>{toast.textContent=control.dataset.demoToast;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),1800)}));
document.querySelectorAll('.paint-list-item').forEach(item=>item.addEventListener('click',()=>{item.parentElement.querySelectorAll('.paint-list-item').forEach(other=>other.classList.toggle('selected',other===item));toast.textContent='已切换：'+item.querySelector('strong').textContent;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),1400)}));
