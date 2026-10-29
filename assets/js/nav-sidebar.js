/* Sidebar + navbar interactions only. Page/business logic lives in app.js. */
const $nav=s=>document.querySelector(s);
const $$nav=s=>[...document.querySelectorAll(s)];
$$nav('.nav-item').forEach(b=>b.addEventListener('click',()=>{
  const page=b.dataset.page;
  window.AurumApp?.closeOverlays();
  window.AurumApp?.render(page);
  $nav('#sidebar')?.classList.remove('mobile-open');
  $nav('#mobileOverlay')?.classList.remove('show');
}));
window.addEventListener('aurum:page-rendered',e=>{
  $$nav('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===e.detail.page));
});
const collapseBtn=$nav('#collapseBtn');
function setSidebarCollapsed(collapsed){
  document.documentElement.classList.toggle('collapsed',collapsed);
  const label=collapsed?'Expand sidebar':'Collapse sidebar';
  if(collapseBtn){collapseBtn.textContent=collapsed?'›':'‹';collapseBtn.title=label;collapseBtn.setAttribute('aria-label',label);collapseBtn.setAttribute('aria-expanded',String(!collapsed));}
  try{localStorage.setItem('aurumSidebarCollapsed',String(collapsed));}catch(e){}
}
try{setSidebarCollapsed(localStorage.getItem('aurumSidebarCollapsed')==='true');}catch(e){setSidebarCollapsed(false);}
if(collapseBtn)collapseBtn.onclick=()=>setSidebarCollapsed(!document.documentElement.classList.contains('collapsed'));
const mobileMenu=$nav('#mobileMenu'), mobileOverlay=$nav('#mobileOverlay');
if(mobileMenu)mobileMenu.onclick=()=>{$nav('#sidebar')?.classList.add('mobile-open');mobileOverlay?.classList.add('show');};
if(mobileOverlay)mobileOverlay.onclick=()=>{$nav('#sidebar')?.classList.remove('mobile-open');mobileOverlay.classList.remove('show');};
const rateTop=$nav('#rateTop'), notifyBtn=$nav('#notifyBtn');
if(rateTop)rateTop.onclick=()=>window.AurumApp?.render('rates');
if(notifyBtn)notifyBtn.onclick=()=>window.AurumApp?.toast('Notifications: 3 overdue jobs, 2 low-stock products, 6 pending invoices.');
// Admin dropdown and logout belong to the shared navbar.
const adminToggle=$nav('#adminMenuToggle'), adminDropdown=$nav('#adminDropdown');
if(adminToggle&&adminDropdown){
  adminToggle.onclick=e=>{e.stopPropagation();const open=adminDropdown.hidden;adminDropdown.hidden=!open;adminToggle.setAttribute('aria-expanded',String(open));};
  document.addEventListener('click',e=>{if(!e.target.closest('.top-user-wrap')){adminDropdown.hidden=true;adminToggle.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){adminDropdown.hidden=true;adminToggle.setAttribute('aria-expanded','false');}});
  const logout=$nav('#logoutButton');
  if(logout)logout.onclick=()=>{adminDropdown.hidden=true;adminToggle.setAttribute('aria-expanded','false');const ok=window.confirm('Are you sure you want to log out of the Aurum ERP demo?');if(ok){window.AurumApp?.toast('Logged out of demo workspace.');const inSubfolder=location.pathname.split('/').filter(Boolean).length>1;window.location.href=inSubfolder?'../index.html':'index.html';}};
}
