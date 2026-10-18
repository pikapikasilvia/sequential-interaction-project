// Tuning panels. Two floating, collapsible panels edit pompom.js settings live:
//   "Motion panel" (left)  -> SET / SAVED          (Hold, Drag, Throw behaviour)
//   "Visual panel" (right) -> VIS / VIS_SAVED      (background, fibers, ring, cues, shadow)
//
// SHOW / HIDE: panels are hidden for the final demo. Set SHOW_PANELS to true to bring them
// back permanently, or open the page with ?tune or #tune at the end of the URL to show them
// for that visit only.
const SHOW_PANELS=false;
(function(){
const wanted=SHOW_PANELS||/[?&]tune\b/.test(location.search)||location.hash==='#tune';
if(!wanted)return;

const MOTIONS=[['linear','Linear'],['easeIn','Ease In'],['easeOut','Ease Out'],['easeInOut','Ease In-Out'],['spring','Spring / Bounce']];
// item: [key, label, unit, min, max, step] | [key, label, 'motion'] | [key, label, 'color']
const PANELS=[
 {id:'motion',name:'Motion panel',side:'left',live:SET,saved:SAVED,groups:[
  ['Hold',[
   ['holdTime','Hold duration','s',.3,3,.05],
   ['deflatedSize','Deflated size','× full size',.2,.9,.01],
   ['holdShake','Fiber shake at full hold','× resting sway',0,8,.1],
   ['holdCurve','Inflate curve','motion']]],
  ['Drag',[
   ['dragStiffness','Follow stiffness','spring k',20,200,1],
   ['dragDamping','Follow damping','spring c',2,30,.5],
   ['snapDistance','Launch mark snap distance','× pompom radius',.3,2,.05],
   ['snapMotion','Snap motion','motion'],
   ['snapDuration','Snap duration (eased)','s',.1,1.5,.05]]],
  ['Throw',[
   ['pullMax','Max pull distance','× pompom radius',.6,2.5,.05],
   ['rangePerPx','Throw power','px flight per px pulled',1,6,.1],
   ['gravity','Gravity','px/s²',500,5000,50],
   ['bounceKeep','Bounce amount','× impact speed kept',0,.9,.01],
   ['rollFriction','Rolling friction','speed kept per s (lower = more friction)',.01,.6,.01],
   ['ringRadius','Ring radius','× pompom radius',.4,1.6,.05],
   ['hitRadius','Hit tolerance','× ring radius',.3,1.2,.01],
   ['returnMotion','Return after miss','motion'],
   ['returnDuration','Return duration (eased)','s',.1,1.5,.05]]]]},
 {id:'visual',name:'Visual panel',side:'right',live:VIS,saved:VIS_SAVED,groups:[
  ['Background',[
   ['page','Page around stage','color'],
   ['stage','Stage','color'],
   ['grain','Paper grain','0 = flat, 1 = strong',0,1,.05]]],
  ['Fibers',[
   ['fiberDark','Darkest strands','color'],
   ['fiberLight','Lightest strands','color'],
   ['fiberOpacity','Strand opacity','× original opacity',.3,1.6,.05],
   ['fiberWidth','Strand thickness','× original width',.4,2.5,.05]]],
  ['Ring & cues',[
   ['ringFill','Ring fill','color'],
   ['ringStroke','Ring outline','color'],
   ['ringWidth','Ring outline width','px',0,10,.5],
   ['cue','Hint rings, launch mark, aim path','color'],
   ['accent','Progress arc & hit flash','color']]],
  ['Shadow',[
   ['shadow','Shadow color','color'],
   ['shadowOpacity','Shadow opacity','0–1 at rest',0,.6,.01],
   ['shadowSoftness','Shadow softness','0 = hard edge, 1 = very soft',0,1,.05]]]]}];

const css=`
.tune{position:fixed;top:12px;z-index:10;font:12px -apple-system,BlinkMacSystemFont,sans-serif;color:#2c2c2c}
.tune.left{left:12px}.tune.right{right:12px;text-align:right}
.tune .tab{position:static;transform:none;width:auto;height:auto;border-radius:18px;padding:8px 14px;background:#f7f7f7;color:#2c2c2c;box-shadow:0 2px 10px rgba(0,0,0,.18);font:600 12px -apple-system,BlinkMacSystemFont,sans-serif;display:inline-block}
.tune .body{text-align:left;margin-top:8px;width:260px;max-width:calc(100vw - 24px);max-height:calc(100vh - 80px);overflow:auto;background:#f7f7f7;border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,.2);padding:4px 12px 12px}
.tune[data-open="false"] .body{display:none}
.tune h3{margin:12px 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#5a5a5a}
.tune .row{display:grid;grid-template-columns:1fr auto;gap:2px 8px;align-items:center;padding:5px 0;border-bottom:1px solid #e4e4e4}
.tune label{font-weight:600}
.tune .val{font-variant-numeric:tabular-nums;text-align:right;font-family:ui-monospace,monospace;font-size:11px}
.tune .unit{grid-column:1/-1;color:#7a7a7a;font-size:11px}
.tune input[type=range]{grid-column:1/-1;width:100%;margin:2px 0;accent-color:#3a3a3a}
.tune input[type=color]{width:44px;height:24px;padding:0;border:1px solid #c2c2c2;border-radius:4px;background:none}
.tune select{grid-column:1/-1;font:inherit;padding:4px;border:1px solid #c2c2c2;border-radius:6px;background:#fff}
.tune .btns{display:flex;gap:8px;margin-top:12px}
.tune .btns button{position:static;transform:none;width:auto;height:auto;flex:1;border-radius:8px;padding:8px;font:600 12px -apple-system,BlinkMacSystemFont,sans-serif;background:#3a3a3a;color:#f7f7f7}
.tune .btns button.alt{background:#d6d6d6;color:#2c2c2c}
.tune .note{margin-top:8px;color:#5a5a5a;min-height:1em}
.tune textarea{width:100%;height:120px;font:11px ui-monospace,monospace;margin-top:6px;box-sizing:border-box}
`;
document.head.appendChild(Object.assign(document.createElement('style'),{textContent:css}));
const fmt=(v,st)=>{const d=st>=1?0:String(st).split('.')[1].length;return Number(v).toFixed(d)};

for(const P of PANELS){
 const root=document.createElement('div');root.className='tune '+P.side;root.id='tune-'+P.id;
 root.innerHTML=`<button type="button" class="tab" aria-expanded="true"></button><div class="body"></div>`;
 document.body.appendChild(root);
 const tab=root.querySelector('.tab'),body=root.querySelector('.body');
 const setOpen=o=>{root.dataset.open=String(o);tab.setAttribute('aria-expanded',String(o));tab.textContent=P.name+(o?' ▾':' ▸')};
 tab.addEventListener('click',()=>setOpen(root.dataset.open!=='true'));
 setOpen(innerWidth>=900);   // starts collapsed on narrow screens so it doesn't cover the stage
 const inputs={};
 for(const [name,items] of P.groups){
  const h=document.createElement('h3');h.textContent=name;body.appendChild(h);
  for(const it of items){
   const [key,label,unit]=it,row=document.createElement('div');row.className='row';const id=P.id+'-'+key;
   if(unit==='motion'){
    row.innerHTML=`<label for="${id}">${label}</label><span></span><select id="${id}">${MOTIONS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select>`;
    const el=row.querySelector('select');el.addEventListener('change',()=>{P.live[key]=el.value});inputs[key]={el,set:v=>{el.value=v}};
   }else if(unit==='color'){
    row.innerHTML=`<label for="${id}">${label}</label><input type="color" id="${id}"><span class="unit val" style="text-align:left"></span>`;
    const el=row.querySelector('input'),out=row.querySelector('.unit');
    el.addEventListener('input',()=>{P.live[key]=el.value;out.textContent=el.value});inputs[key]={el,set:v=>{el.value=v;out.textContent=v}};
   }else{
    const [,,,min,max,st]=it;
    row.innerHTML=`<label for="${id}">${label}</label><span class="val"></span><input type="range" id="${id}" min="${min}" max="${max}" step="${st}"><span class="unit">${unit} · range ${min}–${max}</span>`;
    const el=row.querySelector('input'),out=row.querySelector('.val'),show=v=>{out.textContent=fmt(v,st)};
    el.addEventListener('input',()=>{P.live[key]=parseFloat(el.value);show(el.value)});inputs[key]={el,set:v=>{el.value=v;show(v)}};
   }
   body.appendChild(row);
  }}
 const btns=document.createElement('div');btns.className='btns';
 btns.innerHTML='<button type="button" class="alt">Restore defaults</button><button type="button">Copy settings</button>';
 body.appendChild(btns);
 const note=document.createElement('div');note.className='note';body.appendChild(note);
 const sync=()=>{for(const k in inputs)inputs[k].set(P.live[k])};
 sync();P.sync=sync;
 const [restore,copy]=btns.querySelectorAll('button');
 restore.addEventListener('click',()=>{Object.assign(P.live,P.saved);sync();note.textContent='Restored saved defaults.'});
 const text=()=>{const lines=['Pompom Sequence settings: '+P.name];
  for(const [name,items] of P.groups){lines.push('',name);
   for(const it of items){const [key,label,unit]=it,v=P.live[key];
    lines.push(unit==='motion'?`- ${label} (${key}): ${MOTIONS.find(m=>m[0]===v)[1]} ('${v}')`:
     unit==='color'?`- ${label} (${key}): ${v}`:`- ${label} (${key}): ${fmt(v,it[5])} ${unit}`)}}
  lines.push('','Apply these values as the prototype\'s saved defaults. Retain the panel code for later adjustments. Commit and push the changes.');
  return lines.join('\n')};
 copy.addEventListener('click',()=>{
  const tx=text(),old=body.querySelector('textarea');if(old)old.remove();
  const fallback=()=>{const ta=document.createElement('textarea');ta.readOnly=true;ta.value=tx;body.appendChild(ta);ta.focus();ta.select();
   note.textContent='Copying is blocked here. The text is selected below; copy it manually.'};
  try{navigator.clipboard.writeText(tx).then(()=>{note.textContent='Copied settings to the clipboard.'},fallback)}catch(e){fallback()}});
}
// lets screenshot scripts apply a preset and refresh both panels
window.applyTuning=(motion,visual)=>{Object.assign(SET,motion||{});Object.assign(VIS,visual||{});for(const P of PANELS)P.sync&&P.sync()};
})();
