// Pompom Sequence: Hold -> Drag -> Throw, one pompom throughout.
// Engine, physics, drawing and audio come from the pompom Hold, Drag and Throw studies
// (artifacts/). The Throw study's ground position `g` + height `z` model is the base;
// Hold and Drag run on the same body with z = 0.
const HOLD=0,DRAG=1,THROW=2,DONE=3;
const HOLD_TIME=1.1;      // s of continuous hold to fill the ring (Hold study)
// Throw study tunables (units: RF = pompom radius, px, seconds)
const CFG={pullMax:1.4,pullMin:.3,rangePerPx:3.4,gravity:2000,flightBase:.55,flightPower:.45,bounceKeep:.38,bounceMinImpact:260,groundKeep:.55,rollFriction:.08,hitRadius:.85,grabRadius:.9,restTime:.9,ringRadius:.9};

const stage=document.getElementById('stage'),cv=document.getElementById('c'),ctx=cv.getContext('2d');
let W,H,D,S,RF,RR,PMAX,L={x:0,y:0},Tg={x:0,y:0};
const fib=F.map(f=>({x0:f[0],y0:f[1],xm:f[2],ym:f[3],x1:f[4],y1:f[5],col:f[6],w:f[7],o:f[8],
 tx:0,ty:0,vx:0,vy:0,k:40+Math.random()*90,c:3.5+Math.random()*4,ph:Math.random()*6.28,len:Math.hypot(f[4],f[5])}));
const g={x:0,y:0},gv={x:0,y:0},B={x:0,y:0,vx:0,vy:0,ax:0,ay:0},T={x:0,y:0};
// phase: sequence step. mode: Throw study sub-state (idle/aim/fly/roll/return/done) or 'drag'/'settle' in Drag
let phase=HOLD,mode='idle',holding=false,p=0,z=0,vz=0,puff=.45,pv=0,pulse=0,off={x:0,y:0},last=performance.now(),t0=last,hid=null,
 used=false,hit=false,landed=false,rest=0,wob=0,flash=0,reveal=0,sized=false;
let A=null,muted=false;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const mg=()=>RF*.55;
const home=()=>({x:W/2,y:H*.42});
const markR=()=>RF*.95;   // dashed launch mark radius (Throw study)
function size(){const r=stage.getBoundingClientRect();D=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*D;cv.height=H*D;
 S=W*.3/160;RF=160*S;RR=RF*CFG.ringRadius;PMAX=RF*CFG.pullMax;L={x:W/2,y:H*.62};Tg={x:W/2,y:H*.2};
 // first call sets the start state; later resizes keep progress
 if(!sized){sized=true;reset(true)}else if(phase===HOLD){const h=home();g.x=T.x=h.x;g.y=T.y=h.y}else if(phase===THROW&&mode==='idle'){g.x=T.x=L.x;g.y=T.y=L.y}}
function reset(quiet){phase=HOLD;mode='idle';holding=false;p=0;z=vz=0;puff=.45;pv=0;pulse=0;used=false;hit=false;landed=false;rest=0;wob=0;flash=0;reveal=0;hid=null;
 const h=home();g.x=T.x=B.x=h.x;g.y=T.y=B.y=h.y;gv.x=gv.y=B.vx=B.vy=B.ax=B.ay=0;for(const f of fib){f.tx=f.ty=f.vx=f.vy=0}if(!quiet)thump(.4)}
addEventListener('resize',size);

// audio (unchanged from the studies)
function initAudio(){if(A)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 const x=new AC(),len=x.sampleRate*2,buf=x.createBuffer(1,len,x.sampleRate),d=buf.getChannelData(0);let l=0;
 for(let i=0;i<len;i++){const w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=l*3.5}
 const src=x.createBufferSource();src.buffer=buf;src.loop=true;
 const bp=x.createBiquadFilter();bp.type='bandpass';bp.Q.value=.5;bp.frequency.value=700;
 const gn=x.createGain();gn.gain.value=0;src.connect(bp).connect(gn).connect(x.destination);src.start();A={x,buf,bp,g:gn}}
function thump(a){if(!A||muted)return;const x=A.x,t=x.currentTime;
 const o=x.createOscillator(),gn=x.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(55,t+.25);
 gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(.35*a,t+.02);gn.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(gn).connect(x.destination);o.start(t);o.stop(t+.4);
 const n=x.createBufferSource();n.buffer=A.buf;const f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=900;const g2=x.createGain();
 g2.gain.setValueAtTime(.5*a,t);g2.gain.exponentialRampToValueAtTime(.001,t+.18);n.connect(f).connect(g2).connect(x.destination);n.start(t,Math.random(),.2)}

// input
function pt(e){const r=stage.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function clampT(){T.x=Math.max(mg(),Math.min(W-mg(),T.x));T.y=Math.max(mg(),Math.min(H-64-mg(),T.y))}
// Throw study: aim target, limited to pullMax around the launch mark
function setAim(q){let x=q.x+off.x,y=q.y+off.y;const dx=x-L.x,dy=y-L.y,len=Math.hypot(dx,dy);
 if(len>PMAX){x=L.x+dx/len*PMAX;y=L.y+dy/len*PMAX}T.x=x;T.y=y;clampT()}
function pull(){const dx=L.x-T.x,dy=L.y-T.y,len=Math.hypot(dx,dy)||1;
 const pw=Math.min(1,len/PMAX),tf=CFG.flightBase+CFG.flightPower*pw,range=len*CFG.rangePerPx;
 return{len,pw,tf,dir:{x:dx/len,y:dy/len},land:{x:L.x+dx/len*range,y:L.y+dy/len*range}}}
cv.addEventListener('pointerdown',e=>{if(hid!==null)return;const q=pt(e);initAudio();if(A&&A.x.state!=='running')A.x.resume();
 if(phase===HOLD){if(dist(q,g)<RF*.75){holding=true;hid=e.pointerId;cv.setPointerCapture(hid)}}
 else if(phase===DRAG&&dist(q,g)<RF*.9){mode='drag';used=true;hid=e.pointerId;cv.setPointerCapture(hid);
  off={x:g.x-q.x,y:g.y-q.y};T.x=q.x+off.x;T.y=q.y+off.y;clampT();thump(.3)}
 else if(phase===THROW&&mode==='idle'&&dist(q,g)<RF*CFG.grabRadius){mode='aim';used=true;hid=e.pointerId;cv.setPointerCapture(hid);
  off={x:g.x-q.x,y:g.y-q.y};setAim(q);thump(.3)}});
cv.addEventListener('pointermove',e=>{if(e.pointerId!==hid)return;const q=pt(e);
 if(mode==='drag'){T.x=q.x+off.x;T.y=q.y+off.y;clampT()}else if(mode==='aim')setAim(q)});
function release(){const P=pull();
 if(P.len<RF*CFG.pullMin){mode='idle';T.x=L.x;T.y=L.y;thump(.2);return}
 gv.x=(P.land.x-g.x)/P.tf;gv.y=(P.land.y-g.y)/P.tf;vz=CFG.gravity*P.tf/2;z=.01;landed=false;hit=false;rest=0;mode='fly';
 pulse=Math.max(pulse,.3*P.pw);thump(.4+.4*P.pw)}
function up(e){if(e.pointerId!==hid)return;hid=null;holding=false;
 if(mode==='drag'){
  // Drag -> Throw: released inside the dashed launch mark snaps onto it; elsewhere it stays put
  if(dist(T,L)<markR()){phase=THROW;mode='return';used=false;T.x=L.x;T.y=L.y;pulse=Math.max(pulse,.5);thump(.6)}
  else{mode='settle';thump(.3)}}
 else if(mode==='aim')release()}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
document.getElementById('rst').addEventListener('click',()=>reset(false));
const sb=document.getElementById('snd');sb.addEventListener('click',()=>{muted=!muted;sb.setAttribute('aria-pressed',String(!muted))});

// landing (Throw study)
function land(imp){
 if(!landed){landed=true;mode='roll';hit=dist(g,Tg)<RR*CFG.hitRadius;
  if(hit){pulse=1;flash=1;thump(1)}else{thump(.5);if(dist(g,Tg)<RR*2)wob=1}}
 else thump(Math.min(.5,imp/1500));
 pv-=Math.min(imp,1400)*.0016;
 if(imp>CFG.bounceMinImpact){vz=imp*CFG.bounceKeep;gv.x*=CFG.groundKeep;gv.y*=CFG.groundKeep}else vz=0}

// loop
function step(now){
 const dt=Math.min(Math.max((now-last)/1000,.004),.033);last=now;const t=(now-t0)/1000;
 pulse*=Math.pow(.02,dt);flash*=Math.pow(.05,dt);wob*=Math.pow(.03,dt);
 if(phase>=DRAG)reveal=Math.min(1,reveal+dt/.4);
 // Hold study: fill the ring, or drain it when released early; completion bursts and unlocks Drag
 if(phase===HOLD&&holding){p=Math.min(1,p+dt/HOLD_TIME);if(p>=1){phase=DRAG;holding=false;used=false;pulse=1;thump(.9)}}
 else if(phase===HOLD&&p>0)p=Math.max(0,p-dt/.5);
 const pt0=phase===HOLD?.45+.55*p:1;pv+=(-(puff-pt0)*130-pv*10)*dt;puff+=pv*dt;
 if(phase===HOLD){const h=home();T.x=h.x;T.y=h.y}
 if(mode==='fly'||mode==='roll'){
  if(landed){
   if(hit){gv.x+=(-(g.x-Tg.x)*40-gv.x*9)*dt;gv.y+=(-(g.y-Tg.y)*40-gv.y*9)*dt}
   else{const fr=Math.pow(CFG.rollFriction,dt);gv.x*=fr;gv.y*=fr}}
  g.x+=gv.x*dt;g.y+=gv.y*dt;
  if(z>0||vz>0){vz-=CFG.gravity*dt;z+=vz*dt;if(z<=0){const imp=-vz;z=0;land(imp)}}
  if(landed){
   const wl=(v)=>{pulse=Math.max(pulse,Math.min(.6,Math.abs(v)/1500));thump(Math.min(.6,Math.abs(v)/1500))};
   if(g.x<mg()){g.x=mg();wl(gv.x);gv.x=-gv.x*.5}if(g.x>W-mg()){g.x=W-mg();wl(gv.x);gv.x=-gv.x*.5}
   if(g.y<mg()){g.y=mg();wl(gv.y);gv.y=-gv.y*.5}if(g.y>H-64-mg()){g.y=H-64-mg();wl(gv.y);gv.y=-gv.y*.5}
   if(z===0&&vz===0){const sp=Math.hypot(gv.x,gv.y);
    // in the ring: the ending. Missed: back to the launch mark to try again
    if(hit){if(dist(g,Tg)<5&&sp<15){g.x=Tg.x;g.y=Tg.y;gv.x=gv.y=0;mode='done';phase=DONE}}
    else if(sp<10){gv.x=gv.y=0;rest+=dt;if(rest>CFG.restTime){mode='return';T.x=L.x;T.y=L.y}}else rest=0}}
 }else if(mode!=='done'){
  // spring follow: stiff while held (Drag/aim), soft otherwise (Drag study settle, Throw study return)
  const held=mode==='aim'||mode==='drag',k=held?90:26,c=held?13:7;
  gv.x+=(-(g.x-T.x)*k-gv.x*c)*dt;gv.y+=(-(g.y-T.y)*k-gv.y*c)*dt;g.x+=gv.x*dt;g.y+=gv.y*dt;
  if(mode==='return'&&dist(g,L)<3&&Math.hypot(gv.x,gv.y)<20){mode='idle';g.x=L.x;g.y=L.y;gv.x=gv.y=0}}
 // body = ground position lifted by height
 const bx=g.x,by=g.y-z,px=B.vx,py=B.vy,a=Math.min(1,dt*30);
 B.vx+=((bx-B.x)/dt-B.vx)*a;B.vy+=((by-B.y)/dt-B.vy)*a;B.x=bx;B.y=by;
 B.ax=Math.max(-9000,Math.min(9000,(B.vx-px)/dt));B.ay=Math.max(-9000,Math.min(9000,(B.vy-py)/dt));
 const sn=Math.min(Math.hypot(B.vx,B.vy)/1400,1);
 const amp=1+(holding?p*3.5:0),fq=holding?6:0;
 for(const f of fib){
  const lim=f.len*.8,gx=-B.vx*.05/S,gy=-B.vy*.05/S,wx=Math.sin(t*(1.3+fq)+f.ph)*1.6*amp,wy=Math.cos(t*(1.1+fq)+f.ph)*1.6*amp;
  const rx=f.x1/f.len*pulse*28,ry=f.y1/f.len*pulse*28;
  const ax=-f.k*(f.tx-gx-wx-rx)-f.c*f.vx-B.ax/S*.35,ay=-f.k*(f.ty-gy-wy-ry)-f.c*f.vy-B.ay/S*.35;
  f.vx+=ax*dt;f.vy+=ay*dt;f.tx+=f.vx*dt;f.ty+=f.vy*dt;const m=Math.hypot(f.tx,f.ty);if(m>lim){f.tx*=lim/m;f.ty*=lim/m}}
 const P=pull(),aiming=mode==='aim';
 if(A){const lv=muted?0:Math.max(Math.pow(sn,.9)*.5,aiming?P.pw*.3:0,holding?p*.35:0);A.g.gain.setTargetAtTime(lv,A.x.currentTime,.05);
  A.bp.frequency.setTargetAtTime(Math.max(500+sn*2800,aiming?500+P.pw*1500:0,holding?400+p*1800:0),A.x.currentTime,.05)}

 // draw
 ctx.setTransform(D,0,0,D,0,0);ctx.fillStyle='#ececec';ctx.fillRect(0,0,W,H);ctx.lineCap='round';
 if(phase>=DRAG){
  // target ring (Throw study), faded in once Hold is done
  ctx.save();ctx.globalAlpha=reveal;ctx.translate(Tg.x,Tg.y);ctx.scale(1+wob*.07*Math.sin(t*28),1+wob*.07*Math.sin(t*28));
  ctx.fillStyle='#e2e2e2';ctx.beginPath();ctx.arc(0,0,RR,0,6.283);ctx.fill();
  ctx.strokeStyle='#7a7a7a';ctx.lineWidth=4;ctx.stroke();
  if(flash>.02){ctx.globalAlpha=flash;ctx.strokeStyle='#3a3a3a';ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,RR*(1+(1-flash)*.14),0,6.283);ctx.stroke()}
  ctx.restore();
  // dashed launch mark (Throw study); darker while the dragged pompom is inside it
  const over=mode==='drag'&&dist(T,L)<markR();
  ctx.strokeStyle=over?'#3a3a3a':'#7a7a7a';ctx.lineWidth=3;ctx.setLineDash([8,9]);ctx.globalAlpha=(over?.8:.4)*reveal;
  ctx.beginPath();ctx.arc(L.x,L.y,markR(),0,6.283);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
 ctx.strokeStyle='#7a7a7a';ctx.lineWidth=3;
 if(phase===HOLD){
  // Hold study: pulsing hint ring, faint target ring, progress arc
  const rr=RF*.62;
  if(!holding&&p===0){const f=(t%1.6)/1.6;ctx.globalAlpha=.55*(1-f);ctx.beginPath();ctx.arc(g.x,g.y,rr*(1+f*.45),0,6.283);ctx.stroke()}
  ctx.globalAlpha=.35;ctx.beginPath();ctx.arc(g.x,g.y,rr,0,6.283);ctx.stroke();ctx.globalAlpha=1;
  if(p>0){ctx.strokeStyle='#3a3a3a';ctx.lineWidth=5;ctx.beginPath();ctx.arc(g.x,g.y,rr,-1.5708,-1.5708+6.283*p);ctx.stroke()}}
 else if(!used&&(phase===DRAG&&mode!=='drag'||phase===THROW&&mode==='idle')){
  // Drag/Throw studies: affordance ring until the step's first grab
  const f=(t%1.6)/1.6,R=RF*.95;ctx.globalAlpha=.55*(1-f);ctx.beginPath();ctx.arc(g.x,g.y,R*(1+f*.25),0,6.283);ctx.stroke();ctx.globalAlpha=1}
 // aim: band, trajectory preview, landing marker (Throw study)
 if(aiming&&P.len>=RF*CFG.pullMin){
  ctx.globalAlpha=.35;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(L.x,L.y);ctx.lineTo(g.x,g.y);ctx.stroke();
  const zmax=CFG.gravity*P.tf*P.tf/8;ctx.fillStyle='#5a5a5a';
  for(let i=1;i<=12;i++){const u=i/12,x=T.x+(P.land.x-T.x)*u,y=T.y+(P.land.y-T.y)*u-4*zmax*u*(1-u);
   ctx.globalAlpha=.65*(1-u*.5);ctx.beginPath();ctx.arc(x,y,3,0,6.283);ctx.fill()}
  ctx.globalAlpha=.5;ctx.strokeStyle='#7a7a7a';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(P.land.x,P.land.y,RF*.3,RF*.15,0,0,6.283);ctx.stroke();ctx.globalAlpha=1}
 // shadow (Throw study)
 if(phase>=THROW){const sh=1/(1+z/300);ctx.fillStyle='#555';ctx.globalAlpha=.2*sh;ctx.beginPath();ctx.ellipse(g.x+z*.12,g.y+RF*.55,RF*.7*sh*puff,RF*.25*sh*puff,0,0,6.283);ctx.fill();ctx.globalAlpha=1}
 // pompom
 const pf=puff*(1+z/420);
 for(const f of fib){ctx.beginPath();ctx.moveTo(B.x+f.x0*pf*S,B.y+f.y0*pf*S);
  ctx.quadraticCurveTo(B.x+(f.xm*pf+f.tx*.45)*S,B.y+(f.ym*pf+f.ty*.45)*S,B.x+(f.x1*pf+f.tx)*S,B.y+(f.y1*pf+f.ty)*S);
  ctx.strokeStyle=f.col;ctx.globalAlpha=f.o;ctx.lineWidth=f.w*S*1.1;ctx.stroke()}
 ctx.globalAlpha=1;
 requestAnimationFrame(step)}
size();requestAnimationFrame(step);
