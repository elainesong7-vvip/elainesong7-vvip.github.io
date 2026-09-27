const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const storage = {
  get(key, fallback){ try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } },
  set(key, value){ try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
};
const state={
  wishes:storage.get('magic_wishes',[]), journal:storage.get('magic_journal',[]), orbs:storage.get('magic_orbs',0),
  stars:storage.get('magic_stars',0), notice:storage.get('magic_notice',true), filter:'all', mode:'text', timer:900, timerId:null
};
const quotes=[
  '“你不需要把所有事情都做好，只需要找到一件值得期待的事情。”',
  '“慢慢来，你正在属于自己的光里。”',
  '“感恩不是忽略困难，而是在困难之外，也看见仍然存在的美好。”',
  '“今天先照顾好自己的心，再去处理世界的声音。”',
  '“当你开始注意美好，美好也开始变得更容易被看见。”'
];
function init(){
  const now=new Date();
  $('#todayDate').textContent=now.toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'long'});
  $('#dailyQuote').textContent=quotes[now.getDate()%quotes.length];
  $('#noticeToggle').checked=state.notice;
  bind();renderAll();
}
function bind(){
  $$('[data-nav]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.nav)));
  $('#menuBtn').addEventListener('click',openDrawer); $('#profileNav').addEventListener('click',openDrawer);
  $('#closeDrawer').addEventListener('click',closeDrawer); $('#drawer').addEventListener('click',e=>{if(e.target===$('#drawer'))closeDrawer()});
  $$('.drawer-links [data-nav]').forEach(b=>b.addEventListener('click',closeDrawer));
  $('#noticeBtn').addEventListener('click',openDrawer);
  $('#noticeToggle').addEventListener('change',e=>{state.notice=e.target.checked;storage.set('magic_notice',state.notice);toast(state.notice?'早晚 Notice 已开启':'Notice 已关闭')});
  $('#quoteLikeBtn').addEventListener('click',()=>toast('已收藏今日心语 ♡'));
  $('#addWishBtn').addEventListener('click',openWish); $('#closeWishModal').addEventListener('click',closeWish);
  $('#wishModal').addEventListener('click',e=>{if(e.target===$('#wishModal'))closeWish()});
  $$('.mode').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
  $('#wishForm').addEventListener('submit',saveWish);
  $$('.tab').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;$$('.tab').forEach(x=>x.classList.toggle('active',x===b));renderWishes()}));
  $('#gratitudeForm').addEventListener('submit',saveGratitude); $('#timerBtn').addEventListener('click',toggleTimer);
  $('#soundToggle').addEventListener('click',()=>toast('音乐将在下一版接入 ♫'));
}
function navigate(page){$$('.page').forEach(p=>p.classList.toggle('active',p.dataset.page===page));$$('.nav-item[data-nav]').forEach(n=>n.classList.toggle('active',n.dataset.nav===page));$('.header').style.display=page==='home'?'flex':'none';window.scrollTo({top:0,behavior:'smooth'});}
function openDrawer(){$('#drawer').classList.add('open');$('#drawer').setAttribute('aria-hidden','false')}
function closeDrawer(){$('#drawer').classList.remove('open');$('#drawer').setAttribute('aria-hidden','true')}
function openWish(){$('#wishModal').classList.add('open');$('#wishModal').setAttribute('aria-hidden','false')}
function closeWish(){$('#wishModal').classList.remove('open');$('#wishModal').setAttribute('aria-hidden','true');$('#wishForm').reset();setMode('text')}
function setMode(mode){state.mode=mode;$$('.mode').forEach(x=>x.classList.toggle('active',x.dataset.mode===mode));$('#wishText').classList.toggle('hidden',mode==='image');$('#uploadBox').classList.toggle('hidden',mode!=='image')}
function saveWish(e){e.preventDefault();if(state.mode==='text'){const text=$('#wishText').value.trim();if(!text)return toast('先写下一句话吧');state.wishes.unshift({id:Date.now(),type:'text',text,date:new Date().toISOString()});persistWishes();closeWish();toast('已经放进魔法盒 ✦')}else{const file=$('#wishImage').files[0];if(!file)return toast('先选择一张图片');const reader=new FileReader();reader.onload=()=>{state.wishes.unshift({id:Date.now(),type:'image',src:reader.result,date:new Date().toISOString()});persistWishes();closeWish();toast('照片已收藏进魔法盒 ✦')};reader.readAsDataURL(file)}}
function persistWishes(){storage.set('magic_wishes',state.wishes);renderWishes()}
function renderWishes(){const data=state.wishes.filter(w=>state.filter==='all'||w.type===state.filter);$('#wishGrid').innerHTML=data.length?data.map(w=>w.type==='text'?`<article class="wish-card text"><p>${escapeHtml(w.text)}</p><small>${date(w.date)}</small></article>`:`<article class="wish-card image"><img src="${w.src}" alt="收藏图片"></article>`).join(''):'<div class="empty-state">你的魔法盒还是空的。<br>放进第一份愿望吧 ✦</div>'}
function saveGratitude(e){e.preventDefault();const input=$('#gratitudeInput'),text=input.value.trim();if(!text)return toast('写下一件小事吧');state.journal.unshift({id:Date.now(),text,date:new Date().toISOString()});state.orbs++;state.stars++;storage.set('magic_journal',state.journal);storage.set('magic_orbs',state.orbs);storage.set('magic_stars',state.stars);input.value='';renderAll();toast('这一刻已收藏 · +1 光之球')}
function renderJournal(){$('#gratitudeCount').textContent=state.journal.length;$('#journalList').innerHTML=state.journal.length?state.journal.map(x=>`<article class="journal-entry"><p>${escapeHtml(x.text)}</p><small>${date(x.date)}</small></article>`).join(''):'<div class="empty-state">还没有记录。<br>今天从一件小事开始。</div>'}
function toggleTimer(){if(state.timerId){clearInterval(state.timerId);state.timerId=null;$('#timerBtn').textContent='继续冥想';return}$('#timerBtn').textContent='暂停';state.timerId=setInterval(()=>{state.timer--;renderTimer();if(state.timer<=0){clearInterval(state.timerId);state.timerId=null;state.timer=900;state.orbs++;state.stars++;storage.set('magic_orbs',state.orbs);storage.set('magic_stars',state.stars);renderAll();$('#timerBtn').textContent='再次冥想';toast('冥想完成 · +1 光之球 ✦')}},1000)}
function renderTimer(){const m=String(Math.floor(state.timer/60)).padStart(2,'0'),s=String(state.timer%60).padStart(2,'0');$('#timerText').textContent=`${m}:${s}`}
function renderAll(){$('#orbCount').textContent=state.orbs;$('#monthStars').textContent=`${Math.min(state.stars,31)} / 31`;renderWishes();renderJournal();renderTimer()}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1700)}
function date(v){return new Date(v).toLocaleDateString('zh-CN',{month:'2-digit',day:'2-digit'})}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
init();
