/* ─── PARTICLES ─── */
(function(){
  const c=document.getElementById('particles'),ctx=c.getContext('2d');
  function resize(){c.width=innerWidth;c.height=innerHeight}
  resize();window.addEventListener('resize',resize);
  const pts=Array.from({length:55},()=>({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,
    r:Math.random()*1.5+.5,o:Math.random()*.4+.1
  }));
  function frame(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;
      if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,200,1,${p.o})`;ctx.fill();
    });
    pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<100){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
      ctx.strokeStyle=`rgba(255,200,1,${.08*(1-d/100)})`;ctx.lineWidth=.5;ctx.stroke();}
    }));
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ─── HERO MAP ANIMATION ─── */
(function(){
  const rA=document.getElementById('rA'),rB=document.getElementById('rB'),rC=document.getElementById('rC');
  const vA=document.getElementById('vA'),vB=document.getElementById('vB');
  setTimeout(()=>{
    [rA,rB,rC].forEach((r,i)=>{
      r.style.transition=`stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1) ${.5+i*.4}s`;
      r.style.strokeDashoffset='0';
    });
  },200);
  /* Animate vehicles along paths */
  const paths={
    vA:[{cx:30,cy:260},{cx:90,cy:240},{cx:150,cy:210},{cx:210,cy:185},{cx:260,cy:165},{cx:330,cy:140},{cx:400,cy:115}],
    vB:[{cx:30,cy:90},{cx:80,cy:90},{cx:120,cy:120},{cx:120,cy:180},{cx:175,cy:180},{cx:220,cy:205},{cx:220,cy:230},{cx:310,cy:230},{cx:400,cy:230}]
  };
  let t=0;
  function lerp(a,b,t){return a+(b-a)*t}
  function animVeh(){
    t=(t+.003)%1;
    const ni=Math.floor(t*paths.vA.length);
    const nj=Math.min(ni+1,paths.vA.length-1);
    const ft=(t*paths.vA.length)%1;
    const ax=lerp(paths.vA[ni].cx,paths.vA[nj].cx,ft);
    const ay=lerp(paths.vA[ni].cy,paths.vA[nj].cy,ft);
    vA.setAttribute('transform',`translate(${ax.toFixed(1)},${ay.toFixed(1)})`);
    const bi=Math.floor(t*paths.vB.length);
    const bj=Math.min(bi+1,paths.vB.length-1);
    const bx=lerp(paths.vB[bi].cx,paths.vB[bj].cx,ft);
    const by=lerp(paths.vB[bi].cy,paths.vB[bj].cy,ft);
    vB.setAttribute('transform',`translate(${bx.toFixed(1)},${by.toFixed(1)})`);
    requestAnimationFrame(animVeh);
  }
  animVeh();
})();

/* ─── SLEEPERS ─── */
(function(){
  const sl=document.getElementById('sleepers');
  for(let i=0;i<80;i++){const d=document.createElement('div');d.className='sleeper';sl.appendChild(d);}
})();

/* ─── LIVE DASHBOARD ─── */
(function(){
  function spark(id,data,color='#FFC801'){
    const el=document.getElementById(id);if(!el)return;
    el.innerHTML='';const max=Math.max(...data);
    data.forEach(v=>{
      const b=document.createElement('div');b.className='spark-bar';
      b.style.height=Math.round((v/max)*22)+'px';b.style.background=color;
      el.appendChild(b);
    });
  }
  spark('spark-veh',[2700,2780,2820,2800,2810,2847]);
  spark('spark-ontime',[96,95,94.8,95.1,94.5,94.2]);
  spark('spark-delay',[2.1,2.3,2.0,1.9,1.8,1.8]);
  spark('spark-alerts',[5,7,9,10,11,12],'#FF9932');
  /* Gently mutate values */
  let veh=2847,ontime=94.2,delay=1.8,alerts=12;
  function tick(){
    veh+=Math.floor((Math.random()-.4)*5);
    ontime=Math.max(90,Math.min(99,(ontime+(Math.random()-.5)*.3)));
    delay=Math.max(.5,Math.min(5,(delay+(Math.random()-.5)*.1)));
    document.getElementById('d-veh').textContent=veh.toLocaleString();
    document.getElementById('d-ontime').textContent=ontime.toFixed(1);
    document.getElementById('d-delay').textContent=delay.toFixed(1);
    document.getElementById('last-update').textContent='just now';
  }
  setInterval(tick,3200);
})();

/* ─── COUNTER (vehicles) ─── */
(function(){
  const el=document.getElementById('c-veh');
  let n=0;const target=2401209;
  const step=Math.ceil(target/80);
  const iv=setInterval(()=>{
    n=Math.min(n+step,target);
    el.textContent=n.toLocaleString();
    if(n>=target)clearInterval(iv);
  },22);
})();

/* ─── BENTO ─── */
document.querySelectorAll('.bnode').forEach(n=>{
  n.addEventListener('click',()=>{
    document.querySelectorAll('.bnode').forEach(b=>b.classList.remove('active'));
    n.classList.add('active');
  });
  n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')n.click();});
});

/* ─── INTERACTIVE MAP ─── */
const routeStats={
  r1:{vehicles:4,stops:3,riders:'2,104',ontime:'99%',color:'#FFC801'},
  r2:{vehicles:3,stops:3,riders:'3,847',ontime:'91%',color:'#FF9932'},
  r3:{vehicles:2,stops:2,riders:'1,204',ontime:'97%',color:'#4ade80'},
  r4:{vehicles:5,stops:1,riders:'4,201',ontime:'93%',color:'#60a5fa'}
};
function selectRoute(r,btn){
  document.querySelectorAll('.route-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.iroute').forEach(p=>{
    p.style.opacity=p.dataset.route===r?'1':'.25';
    p.style.strokeWidth=p.dataset.route===r?'4':'2';
  });
  const s=routeStats[r];
  document.getElementById('rs-vehicles').textContent=s.vehicles;
  document.getElementById('rs-stops').textContent=s.stops;
  document.getElementById('rs-riders').textContent=s.riders;
  document.getElementById('rs-ontime').textContent=s.ontime;
}
document.querySelectorAll('.istop').forEach(s=>{
  s.addEventListener('mouseenter',function(e){
    const tt=document.getElementById('rtooltip');
    tt.innerHTML=`<strong>${this.dataset.name}</strong><span style="color:${this.dataset.status==='on-time'?'#4ade80':'#FF9932'}">${this.dataset.status==='on-time'?'On time':this.dataset.status}</span>`;
    const rect=document.getElementById('imap-svg').getBoundingClientRect();
    tt.style.display='block';
    tt.style.left=(parseFloat(this.getAttribute('cx'))/(600)*rect.width+10)+'px';
    tt.style.top=(parseFloat(this.getAttribute('cy'))/(440)*rect.height-40)+'px';
  });
  s.addEventListener('mouseleave',()=>document.getElementById('rtooltip').style.display='none');
});

/* ─── ANIMATE MAP VEHICLES ─── */
(function(){
  const paths=[
    {el:'ivA',pts:[{x:40,y:380},{x:200,y:260},{x:360,y:170},{x:560,y:120},{x:360,y:170},{x:200,y:260}]},
    {el:'ivB',pts:[{x:40,y:120},{x:160,y:120},{x:280,y:240},{x:420,y:320},{x:560,y:320},{x:420,y:320},{x:280,y:240}]},
    {el:'ivC',pts:[{x:40,y:280},{x:200,y:220},{x:380,y:120},{x:560,y:120},{x:380,y:120},{x:200,y:220}]}
  ];
  const ts=[0,.33,.66];
  function lerp(a,b,t){return a+(b-a)*t}
  function anim(){
    ts.forEach((t,i)=>{
      ts[i]=(ts[i]+.0018)%1;
      const pts=paths[i].pts;
      const ni=Math.floor(ts[i]*pts.length);
      const nj=Math.min(ni+1,pts.length-1);
      const f=(ts[i]*pts.length)%1;
      const x=lerp(pts[ni].x,pts[nj].x,f);
      const y=lerp(pts[ni].y,pts[nj].y,f);
      const v=document.getElementById(paths[i].el);
      if(v)v.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);
    });
    requestAnimationFrame(anim);
  }
  anim();
})();

/* ─── PRICING ─── */
const prices={
  USD:{sym:'$',v:[29,89,249]},EUR:{sym:'€',v:[27,82,229]},
  GBP:{sym:'£',v:[24,72,199]},INR:{sym:'₹',v:[2399,7399,20999]}
};
let curCur='USD',curBill='monthly';
function updatePrices(){
  const p=prices[curCur];const mult=curBill==='annual'?.8:1;
  for(let i=0;i<3;i++){
    document.getElementById('cur'+i).textContent=p.sym;
    const val=document.getElementById('val'+i);
    val.style.opacity='.3';
    setTimeout(()=>{val.textContent=Math.round(p.v[i]*mult);val.style.opacity='1';},150);
  }
}
function setCurrency(c,btn){
  curCur=c;
  document.querySelectorAll('#currency-grp .ctrl-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  updatePrices();
}
function setBilling(b,btn){
  curBill=b;
  document.querySelectorAll('[data-b]').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  updatePrices();
}

/* ─── FAQ ─── */
function toggleFaq(q){
  const item=q.parentElement;
  item.classList.toggle('open');
}

/* ─── SCROLL REVEAL ─── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* ─── PROGRESS BAR ─── */
const bar=document.getElementById('pgbar');
window.addEventListener('scroll',()=>{
  const pct=(scrollY/(document.body.scrollHeight-innerHeight))*100;
  bar.style.width=pct+'%';
});

/* ─── TOAST NOTIFICATIONS ─── */
const toasts=[
  {head:'⚡ Alert fired',body:'Metro Line 2: +3 min delay detected',delay:4000},
  {head:'📍 Vehicle on route',body:'Route 14A Bus #2471 — approaching Market Sq',delay:9000},
  {head:'✅ Route restored',body:'Line 6 Connector: Back on schedule',delay:16000},
  {head:'🔔 Ridership spike',body:'Bus 27B — 94% capacity. Alert sent to dispatch',delay:23000},
];
const tEl=document.getElementById('toast');
toasts.forEach(t=>{
  setTimeout(()=>{
    document.getElementById('toast-head').textContent=t.head;
    document.getElementById('toast-body').textContent=t.body;
    tEl.classList.add('show');
    setTimeout(()=>tEl.classList.remove('show'),3500);
  },t.delay);
});

/* ─── ROUTE DRAW ON SCROLL ─── */
const mapObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      ['rA','rB','rC'].forEach((id,i)=>{
        const r=document.getElementById(id);
        if(!r)return;
        r.style.transition=`stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1) ${i*.35}s`;
        r.style.strokeDashoffset='0';
      });
    }
  });
},{threshold:.1});
const heroMap=document.getElementById('hero-map');
if(heroMap)mapObs.observe(heroMap);

/* ════════ THEME TOGGLE ════════ */
(function(){
  const saved=null; // no persistence across sessions by design (kept in-memory only)
  let theme='dark';
  window.toggleTheme=function(){
    theme=theme==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme',theme);
    document.getElementById('theme-icon').style.transform=theme==='light'?'rotate(180deg)':'rotate(0deg)';
  };
})();

/* ════════ COMMAND PALETTE ════════ */
(function(){
  const items=[
    {label:'Go to Platform',tag:'nav',action:()=>scrollToHash('#platform')},
    {label:'Go to Routes',tag:'nav',action:()=>scrollToHash('#routes')},
    {label:'Go to Pricing',tag:'nav',action:()=>scrollToHash('#pricing')},
    {label:'Go to FAQ',tag:'nav',action:()=>scrollToHash('#faq')},
    {label:'Toggle theme',tag:'action',action:()=>window.toggleTheme()},
    {label:'Copy API snippet',tag:'action',action:()=>window.copyCode()},
    {label:'View Route 14A · Bus',tag:'route',action:()=>jumpToRoute('r1')},
    {label:'View Metro Line 2 · Train',tag:'route',action:()=>jumpToRoute('r2')},
    {label:'View Metro C · Express',tag:'route',action:()=>jumpToRoute('r3')},
    {label:'View Line 6 · Rapid',tag:'route',action:()=>jumpToRoute('r4')},
    {label:'Start free trial',tag:'action',action:()=>scrollToHash('#pricing')},
  ];
  function scrollToHash(h){
    closePalette();
    const el=document.querySelector(h);
    if(el)el.scrollIntoView({behavior:'smooth'});
  }
  function jumpToRoute(r){
    closePalette();
    document.querySelector('#routes').scrollIntoView({behavior:'smooth'});
    setTimeout(()=>{
      const btn=document.querySelector(`.route-btn[data-r="${r}"]`);
      if(btn)selectRoute(r,btn);
    },450);
  }
  let sel=0,filtered=items;
  function render(){
    const res=document.getElementById('palette-results');
    if(!filtered.length){res.innerHTML='<div class="palette-empty">No matches. Try "pricing" or "routes".</div>';return;}
    res.innerHTML=filtered.map((it,i)=>`<div class="palette-item ${i===sel?'sel':''}" data-i="${i}"><span>${it.label}</span><span class="palette-item-tag">${it.tag}</span></div>`).join('');
    res.querySelectorAll('.palette-item').forEach(el=>{
      el.addEventListener('click',()=>filtered[+el.dataset.i].action());
      el.addEventListener('mouseenter',()=>{sel=+el.dataset.i;render();});
    });
  }
  window.openPalette=function(){
    document.getElementById('palette-overlay').classList.add('open');
    const input=document.getElementById('palette-input');
    input.value='';filtered=items;sel=0;render();
    setTimeout(()=>input.focus(),10);
  };
  window.closePalette=function(){
    document.getElementById('palette-overlay').classList.remove('open');
  };
  document.getElementById('palette-input').addEventListener('input',e=>{
    const q=e.target.value.toLowerCase();
    filtered=items.filter(it=>it.label.toLowerCase().includes(q)||it.tag.includes(q));
    sel=0;render();
  });
  document.addEventListener('keydown',e=>{
    const open=document.getElementById('palette-overlay').classList.contains('open');
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open?closePalette():openPalette();return;}
    if(!open)return;
    if(e.key==='Escape'){closePalette();}
    else if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,filtered.length-1);render();}
    else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,0);render();}
    else if(e.key==='Enter'){e.preventDefault();if(filtered[sel])filtered[sel].action();}
  });
})();

/* ════════ ALERTS FEED ════════ */
(function(){
  const alerts=[
    {sev:'warn',title:'Metro Line 2 — +3 min delay',body:'Signal fault detected near Elm St junction.',time:'2m ago'},
    {sev:'warn',title:'Tram 8 — +7 min delay',body:'Scheduled track maintenance, Westside.',time:'14m ago'},
    {sev:'ok',title:'Line 6 — back on schedule',body:'Downtown Connector resolved after dispatch reroute.',time:'41m ago'},
    {sev:'ok',title:'Bus 27B — capacity alert cleared',body:'Ridership dropped below 90% threshold.',time:'1h ago'},
  ];
  const colors={warn:'var(--amber)',ok:'#4ade80'};
  document.getElementById('alerts-feed').innerHTML=alerts.map(a=>
    `<div class="alert-row"><span class="alert-dot" style="background:${colors[a.sev]}"></span><div><strong>${a.title}</strong>${a.body}</div><span class="alert-time">${a.time}</span></div>`
  ).join('');
  window.toggleAlertsFeed=function(){
    document.getElementById('alerts-feed').classList.toggle('open');
    document.getElementById('alerts-toggle').classList.toggle('open');
  };
})();

/* ════════ ROUTE SEARCH FILTER ════════ */
window.filterRoutes=function(q){
  q=q.trim().toLowerCase();
  const btns=document.querySelectorAll('#route-btn-panel .route-btn');
  let visible=0;
  btns.forEach(b=>{
    const match=!q||(b.dataset.name||'').includes(q);
    b.style.display=match?'':'none';
    if(match)visible++;
  });
  document.getElementById('route-empty').style.display=visible?'none':'block';
};

/* ════════ RIDERSHIP CHART (canvas) ════════ */
(function(){
  function genData(n,seed){
    const out=[];let v=seed;
    for(let i=0;i<n;i++){v+=(Math.random()-.45)*seed*.06;out.push(Math.max(seed*.5,v));}
    return out;
  }
  const datasets={7:genData(7,42000),30:genData(30,40000),90:genData(90,38000)};
  let current=7;
  function draw(){
    const canvas=document.getElementById('ridership-chart');
    if(!canvas)return;
    const dpr=window.devicePixelRatio||1;
    const rect=canvas.getBoundingClientRect();
    canvas.width=rect.width*dpr;canvas.height=220*dpr;
    const ctx=canvas.getContext('2d');
    ctx.scale(dpr,dpr);
    const W=rect.width,H=220,pad=24;
    ctx.clearRect(0,0,W,H);
    const data=datasets[current];
    const max=Math.max(...data),min=Math.min(...data);
    const stepX=(W-pad*2)/(data.length-1);
    function xy(i){
      const x=pad+i*stepX;
      const y=H-pad-((data[i]-min)/(max-min||1))*(H-pad*2);
      return [x,y];
    }
    /* grid */
    ctx.strokeStyle='rgba(217,232,226,.12)';ctx.lineWidth=1;
    for(let g=0;g<4;g++){
      const y=pad+g*((H-pad*2)/3);
      ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-pad,y);ctx.stroke();
    }
    /* area fill */
    const grad=ctx.createLinearGradient(0,pad,0,H-pad);
    grad.addColorStop(0,'rgba(255,200,1,.28)');
    grad.addColorStop(1,'rgba(255,200,1,0)');
    ctx.beginPath();
    data.forEach((_,i)=>{const[x,y]=xy(i);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.lineTo(W-pad,H-pad);ctx.lineTo(pad,H-pad);ctx.closePath();
    ctx.fillStyle=grad;ctx.fill();
    /* line */
    ctx.beginPath();
    data.forEach((_,i)=>{const[x,y]=xy(i);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#FFC801';ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();
    /* points (sparse for >20) */
    const pointEvery=data.length>20?Math.ceil(data.length/14):1;
    data.forEach((_,i)=>{
      if(i%pointEvery!==0&&i!==data.length-1)return;
      const[x,y]=xy(i);
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);
      ctx.fillStyle='#172B36';ctx.fill();
      ctx.lineWidth=1.5;ctx.strokeStyle='#FFC801';ctx.stroke();
    });
    canvas._xy=xy;canvas._data=data;canvas._pad=pad;canvas._stepX=stepX;
  }
  window.setChartRange=function(r,btn){
    current=r;
    document.querySelectorAll('#chart-range-grp .ctrl-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    draw();
  };
  window.addEventListener('resize',draw);
  document.addEventListener('DOMContentLoaded',draw);
  setTimeout(draw,50);
  /* hover tooltip */
  const canvas=document.getElementById('ridership-chart');
  if(canvas){
    canvas.addEventListener('mousemove',e=>{
      if(!canvas._data)return;
      const rect=canvas.getBoundingClientRect();
      const mx=e.clientX-rect.left;
      const i=Math.round((mx-canvas._pad)/canvas._stepX);
      if(i<0||i>=canvas._data.length)return;
      const tt=document.getElementById('chart-tooltip');
      const val=Math.round(canvas._data[i]).toLocaleString();
      tt.textContent=`${current<=7?'Day':'Point'} ${i+1} · ${val} riders`;
      tt.style.display='block';
      tt.style.left=mx+10+'px';
      tt.style.top='10px';
    });
    canvas.addEventListener('mouseleave',()=>{document.getElementById('chart-tooltip').style.display='none';});
  }
})();

/* ════════ API SNIPPET TABS + COPY ════════ */
(function(){
  const snippets={
    curl:`curl https://api.pulsegrid.io/v1/vehicles \\
  -H "Authorization: Bearer $PULSEGRID_KEY" \\
  -G --data-urlencode "route=14A"`,
    js:`import Pulsegrid from "@pulsegrid/sdk";

const client = new Pulsegrid(process.env.PULSEGRID_KEY);
const vehicles = await client.vehicles.list({ route: "14A" });
console.log(vehicles);`,
    py:`from pulsegrid import Client

client = Client(api_key=os.environ["PULSEGRID_KEY"])
vehicles = client.vehicles.list(route="14A")
print(vehicles)`
  };
  window.setCodeTab=function(lang,btn){
    document.querySelectorAll('#code-tabs .code-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('code-body').textContent=snippets[lang];
  };
  window.copyCode=function(){
    const text=document.getElementById('code-body').textContent;
    const btn=document.getElementById('copy-btn');
    const label=document.getElementById('copy-label');
    const finish=()=>{
      btn.classList.add('copied');label.textContent='Copied!';
      setTimeout(()=>{btn.classList.remove('copied');label.textContent='Copy';},1800);
    };
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(finish).catch(finish);
    }else{finish();}
  };
})();

/* ════════ NEWSLETTER SIGNUP ════════ */
window.submitNewsletter=function(e){
  e.preventDefault();
  const input=document.getElementById('newsletter-email');
  const msg=document.getElementById('newsletter-msg');
  const label=document.getElementById('newsletter-btn-label');
  const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRe.test(input.value)){
    input.classList.add('invalid');
    msg.textContent='Please enter a valid email address.';
    msg.className='newsletter-msg err';
    return false;
  }
  input.classList.remove('invalid');
  label.textContent='Subscribing…';
  setTimeout(()=>{
    msg.textContent=`You're in — confirmation sent to ${input.value}.`;
    msg.className='newsletter-msg ok';
    label.textContent='Subscribed ✓';
    input.value='';
    setTimeout(()=>{label.textContent='Subscribe';},2200);
  },700);
  return false;
};
