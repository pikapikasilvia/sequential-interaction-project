// Pompom Sequence: Hold -> Drag -> Flick, one pompom throughout.
// Physics, drawing and audio come from the pompom Hold, Drag and Flick studies
// (one shared engine); the study's MODE switch is replaced by a linear `phase`.
const HOLD=0,DRAG=1,FLICK=2,FLY=3,REST=4;
const HOLD_TIME=1.1;      // s of continuous hold to fill the ring (Hold study)
const DRAG_WIDTHS=1.5;    // drag must cover this many pompom widths to complete
const FLICK_MIN=900;      // px/s release speed that counts as a flick

const stage=document.getElementById('stage'),cv=document.getElementById('c'),ctx=cv.getContext('2d');
let W,H,D,S,RF;
const fib=F.map(f=>({x0:f[0],y0:f[1],xm:f[2],ym:f[3],x1:f[4],y1:f[5],col:f[6],w:f[7],o:f[8],
 tx:0,ty:0,vx:0,vy:0,k:40+Math.random()*90,c:3.5+Math.random()*4,ph:Math.random()*6.28,len:Math.hypot(f[4],f[5])}));
const B={x:0,y:0,vx:0,vy:0,ax:0,ay:0},T={x:0,y:0};
let phase=HOLD,holding=false,dragging=false,used=false,p=0,puff=.45,pv=0,pulse=0,off={x:0,y:0},grab={x:0,y:0},last=performance.now(),t0=last,hid=null;
const home=()=>({x:W/2,y:H*.42});
const ringR=()=>RF*.62;   // the visible hint ring; one pompom width = 2*ringR
function size(){const r=stage.getBoundingClientRect();D=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*D;cv.height=H*D;S=W*.3/160;RF=160*S;
 // first call sets the start state; later resizes keep sequence progress and just re-bound the pompom
 if(!sized){sized=true;reset(true)}else if(phase===HOLD){const h=home();B.x=T.x=h.x;B.y=T.y=h.y}else{clampT();B.x=Math.max(mg(),Math.min(W-mg(),B.x));B.y=Math.max(mg(),Math.min(H-64-mg(),B.y))}}
let sized=false;
function reset(quiet){phase=HOLD;holding=false;dragging=false;used=false;hid=null;p=0;puff=.45;pv=0;pulse=0;const h=home();B.x=T.x=h.x;B.y=T.y=h.y;B.vx=B.vy=0;for(const f of fib){f.tx=f.ty=f.vx=f.vy=0}if(!quiet)thump(.4)}
addEventListener('resize',size);

// audio (unchanged from the studies)
let A=null,muted=false;
function initAudio(){if(A)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 const x=new AC(),len=x.sampleRate*2,buf=x.createBuffer(1,len,x.sampleRate),d=buf.getChannelData(0);let l=0;
 for(let i=0;i<len;i++){const w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=l*3.5}
 const src=x.createBufferSource();src.buffer=buf;src.loop=true;
 const bp=x.createBiquadFilter();bp.type='bandpass';bp.Q.value=.5;bp.frequency.value=700;
 const g=x.createGain();g.gain.value=0;src.connect(bp).connect(g).connect(x.destination);src.start();A={x,buf,bp,g}}
function thump(a){if(!A||muted)return;const x=A.x,t=x.currentTime;
 const o=x.createOscillator(),g=x.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(55,t+.25);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35*a,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g).connect(x.destination);o.start(t);o.stop(t+.4);
 const n=x.createBufferSource();n.buffer=A.buf;const f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=900;const g2=x.createGain();
 g2.gain.setValueAtTime(.5*a,t);g2.gain.exponentialRampToValueAtTime(.001,t+.18);n.connect(f).connect(g2).connect(x.destination);n.start(t,Math.random(),.2)}

// input
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function pt(e){const r=stage.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
cv.addEventListener('pointerdown',e=>{if(hid!==null)return;const q=pt(e);initAudio();if(A&&A.x.state!=='running')A.x.resume();
 if(phase===HOLD){if(dist(q,B)<RF*.75){holding=true;hid=e.pointerId;cv.setPointerCapture(hid)}}
 else if((phase===DRAG||phase===FLICK)&&dist(q,B)<RF*.9){dragging=true;used=true;hid=e.pointerId;cv.setPointerCapture(hid);
  off={x:B.x-q.x,y:B.y-q.y};grab={x:B.x,y:B.y};T.x=q.x+off.x;T.y=q.y+off.y;clampT();thump(.3)}});
cv.addEventListener('pointermove',e=>{if(e.pointerId!==hid||!dragging)return;const q=pt(e);T.x=q.x+off.x;T.y=q.y+off.y;clampT()});
function up(e){if(e.pointerId!==hid)return;hid=null;holding=false;if(!dragging)return;dragging=false;
 if(phase===DRAG){
  if(dist(T,grab)>=DRAG_WIDTHS*2*ringR()){phase=FLICK;used=false;pulse=Math.max(pulse,.5);thump(.6)}else thump(.3)}
 else if(phase===FLICK){
  if(Math.hypot(B.vx,B.vy)>=FLICK_MIN){phase=FLY;thump(.3)}else thump(.3)}}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
const mg=()=>RF*.55;
function clampT(){T.x=Math.max(mg(),Math.min(W-mg(),T.x));T.y=Math.max(mg(),Math.min(H-64-mg(),T.y))}
document.getElementById('rst').addEventListener('click',()=>reset(false));
const sb=document.getElementById('snd');sb.addEventListener('click',()=>{muted=!muted;sb.setAttribute('aria-pressed',String(!muted))});

// loop
function step(now){
 const dt=Math.min(Math.max((now-last)/1000,.004),.033);last=now;const t=(now-t0)/1000;
 // Hold: fill the ring, or drain it when released early
 if(phase===HOLD&&holding){p=Math.min(1,p+dt/HOLD_TIME);if(p>=1){phase=DRAG;holding=false;used=false;pulse=1;thump(.9)}}
 else if(phase===HOLD&&p>0)p=Math.max(0,p-dt/.5);
 const pt0=phase===HOLD?.45+.55*p:1;pv+=(-(puff-pt0)*130-pv*10)*dt;puff+=pv*dt;
 if(phase===HOLD){const g=home();T.x=g.x;T.y=g.y}
 const px=B.vx,py=B.vy;
 if(phase!==FLY){const k=dragging?90:26,c=dragging?13:7;
  B.vx+=(-(B.x-T.x)*k-B.vx*c)*dt;B.vy+=(-(B.y-T.y)*k-B.vy*c)*dt;B.x+=B.vx*dt;B.y+=B.vy*dt}
 else{const m=Math.hypot(B.vx,B.vy);if(m>2400){B.vx*=2400/m;B.vy*=2400/m}
  const fr=Math.pow(.35,dt);B.vx*=fr;B.vy*=fr;B.x+=B.vx*dt;B.y+=B.vy*dt;
  const hit=(v)=>{pulse=Math.max(pulse,Math.min(1,Math.abs(v)/1200));thump(Math.min(1,Math.abs(v)/1500))};
  if(B.x<mg()){B.x=mg();hit(B.vx);B.vx=-B.vx*.6}if(B.x>W-mg()){B.x=W-mg();hit(B.vx);B.vx=-B.vx*.6}
  if(B.y<mg()){B.y=mg();hit(B.vy);B.vy=-B.vy*.6}if(B.y>H-64-mg()){B.y=H-64-mg();hit(B.vy);B.vy=-B.vy*.6}
  if(m<8){B.vx=B.vy=0;T.x=B.x;T.y=B.y;phase=REST}}
 B.ax=(B.vx-px)/dt;B.ay=(B.vy-py)/dt;
 const sn=Math.min(Math.hypot(B.vx,B.vy)/1400,1);pulse*=Math.pow(.02,dt);
 const amp=1+(holding?p*3.5:0);
 for(const f of fib){
  const lim=f.len*.8,gx=-B.vx*.05/S,gy=-B.vy*.05/S,wx=Math.sin(t*(1.3+(holding?6:0))+f.ph)*1.6*amp,wy=Math.cos(t*(1.1+(holding?6:0))+f.ph)*1.6*amp;
  const rx=f.x1/f.len*pulse*28,ry=f.y1/f.len*pulse*28;
  const ax=-f.k*(f.tx-gx-wx-rx)-f.c*f.vx-B.ax/S*.35,ay=-f.k*(f.ty-gy-wy-ry)-f.c*f.vy-B.ay/S*.35;
  f.vx+=ax*dt;f.vy+=ay*dt;f.tx+=f.vx*dt;f.ty+=f.vy*dt;const m=Math.hypot(f.tx,f.ty);if(m>lim){f.tx*=lim/m;f.ty*=lim/m}}
 if(A){const lv=muted?0:Math.max(Math.pow(sn,.9)*.5,holding?p*.35:0);A.g.gain.setTargetAtTime(lv,A.x.currentTime,.05);
  A.bp.frequency.setTargetAtTime(Math.max(500+sn*2800,holding?400+p*1800:0),A.x.currentTime,.05)}
 // draw
 ctx.setTransform(D,0,0,D,0,0);ctx.fillStyle='#ececec';ctx.fillRect(0,0,W,H);
 const rr=ringR();ctx.strokeStyle='#7a7a7a';ctx.lineWidth=3;
 if(phase===HOLD){
  // Hold study: pulsing hint ring, faint target ring, progress arc
  if(!holding&&p===0){const f=(t%1.6)/1.6;ctx.globalAlpha=.55*(1-f);ctx.beginPath();ctx.arc(B.x,B.y,rr*(1+f*.45),0,6.283);ctx.stroke()}
  ctx.globalAlpha=.35;ctx.beginPath();ctx.arc(B.x,B.y,rr,0,6.283);ctx.stroke();ctx.globalAlpha=1;
  if(p>0){ctx.strokeStyle='#3a3a3a';ctx.lineWidth=5;ctx.beginPath();ctx.arc(B.x,B.y,rr,-1.5708,-1.5708+6.283*p);ctx.stroke()}}
 else if((phase===DRAG||phase===FLICK)&&!used&&!dragging){
  // Drag/Flick studies: affordance ring until the step's first grab
  const f=(t%1.6)/1.6,R=RF*.95;ctx.globalAlpha=.55*(1-f);ctx.beginPath();ctx.arc(B.x,B.y,R*(1+f*.25),0,6.283);ctx.stroke();
  ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(B.x,B.y,R,0,6.283);ctx.stroke();ctx.globalAlpha=1}
 ctx.lineCap='round';
 for(const f of fib){ctx.beginPath();ctx.moveTo(B.x+f.x0*puff*S,B.y+f.y0*puff*S);
  ctx.quadraticCurveTo(B.x+(f.xm*puff+f.tx*.45)*S,B.y+(f.ym*puff+f.ty*.45)*S,B.x+(f.x1*puff+f.tx)*S,B.y+(f.y1*puff+f.ty)*S);
  ctx.strokeStyle=f.col;ctx.globalAlpha=f.o;ctx.lineWidth=f.w*S*1.1;ctx.stroke()}
 ctx.globalAlpha=1;
 requestAnimationFrame(step)}
size();requestAnimationFrame(step);
