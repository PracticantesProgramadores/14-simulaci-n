const game=document.getElementById('game');
const startBtn=document.getElementById('startBtn');
const endBtn=document.getElementById('endBtn');
const sinapsisCountEl=document.getElementById('sinapsisCount');
const correctCountEl=document.getElementById('correctCount');
const leftCountEl=document.getElementById('leftCount');
const modal=document.getElementById('modal');
const questionText=document.getElementById('questionText');
const optionsWrap=document.getElementById('options');
const finalModal=document.getElementById('finalModal');
const resumenEl=document.getElementById('resumen');
const closeFinal=document.getElementById('closeFinal');
const loseModal=document.getElementById('loseModal');
const loseContinue=document.getElementById('loseContinue');
let neuron,synapse;
let nx=0,ny=0,sx=0,sy=0;
let speed=10,size=22,started=false,awaiting=false;
let timer=null,moving=false,dirX=0,dirY=0;
let sinapsisCount=0,correctCount=0,leftCount=0,qi=0;
let segments=[];
const questions=[
{t:'¿Cuál es la unidad básica del sistema nervioso?',o:['Neurona','Axón','Mielina'],c:0},
{t:'¿Qué función cumple el encéfalo?',o:['Regula la digestión','Controla el organismo, pensamiento, ánimo y coordina movimientos','Transporta oxígeno'],c:1},
{t:'¿Qué estructura comunica el cerebro con el resto del cuerpo?',o:['Cerebelo','Hipófisis','Médula espinal'],c:2},
{t:'¿Cuántos pares de nervios craneales existen?',o:['10 pares','12 pares','14 pares'],c:1},
{t:'¿Cuántos pares de nervios espinales existen?',o:['28 pares','31 pares','33 pares'],c:1},
{t:'¿Qué función cumplen los nervios espinales?',o:['Inervan todo el cuerpo excepto la cabeza','Controlan emociones','Llevan nutrientes a las neuronas'],c:0},
{t:'¿Qué sistema regula la activación corporal?',o:['Parasimpático','Simpático','Somático'],c:1},
{t:'¿Qué sistema devuelve el cuerpo al equilibrio?',o:['Simpático','Somático','Parasimpático'],c:2},
{t:'¿Qué beneficios tiene la actividad física sobre el cerebro?',o:['Reduce memoria y coordinación','Mejora cognición, reflejos y protege contra enfermedades','Afecta negativamente a las neuronas'],c:1},
{t:'¿Qué puede causar un estilo de vida poco saludable?',o:['Fortalecer el sistema nervioso','Mejorar la concentración','Trastornos del sueño, ansiedad, migrañas y deterioro mental'],c:2},
{t:'¿Qué sustancias afectan negativamente al sistema nervioso?',o:['Agua y frutas','Vitaminas','Café, cigarrillo y alcohol'],c:2},
{t:'¿Por qué es importante dormir bien?',o:['Solo recupera los músculos','No afecta al cerebro','El descanso adecuado evita desórdenes y ayuda al funcionamiento cerebral'],c:2},
{t:'¿Qué es una alteración sensorial?',o:['Mejora de los sentidos','Fortalecimiento sensorial','Trastorno que afecta cómo la persona integra los sentidos'],c:2},
{t:'¿Qué enfermedades neuronales se pueden prevenir con ejercicio?',o:['Fiebre y resfriado','Fracturas óseas','Parkinson, Alzheimer y trastornos cognitivos'],c:2},
{t:'¿Qué hábitos ayudan a mantener el sistema nervioso sano?',o:['Consumo de alcohol y fumar','Dormir poco y no ejercitar','Buen sueño, ejercicio moderado, buena alimentación, evitar estrés'],c:2}
];
function startGame(){
 if(started)return;
 started=true;awaiting=false;sinapsisCount=0;correctCount=0;qi=0;leftCount=questions.length;
 sinapsisCountEl.textContent='0';correctCountEl.textContent='0';leftCountEl.textContent=String(leftCount);
 game.innerHTML='';
 segments=[];
 neuron=document.createElement('div');
 neuron.className='neuron';
 game.appendChild(neuron);
 const gw=game.clientWidth,gh=game.clientHeight;
 nx=Math.round(gw/2-size/2);ny=Math.round(gh/2-size/2);
 drawNeuron();
 spawnSynapse();
 game.focus();
 document.addEventListener('keydown',onKey);
 moving=false;dirX=0;dirY=0;
 if(timer)clearInterval(timer);
 timer=setInterval(tick,60);
}
function endGame(){
 if(!started)return;
 started=false;document.removeEventListener('keydown',onKey);
 moving=false;dirX=0;dirY=0;
 if(timer){clearInterval(timer);timer=null;}
 resetSnakeLength();
 const resumen=`Sinapsis alcanzadas: <strong>${sinapsisCount}</strong><br>Preguntas correctas: <strong>${correctCount}</strong>`;
 resumenEl.innerHTML=resumen;
 finalModal.classList.remove('oculto');
}
function drawNeuron(){
 neuron.style.left=nx+'px';
 neuron.style.top=ny+'px';
}
function drawSynapse(){
 if(!synapse){synapse=document.createElement('div');synapse.className='synapse';game.appendChild(synapse);} 
 synapse.style.left=sx+'px';
 synapse.style.top=sy+'px';
}
function spawnSynapse(){
 const gw=game.clientWidth,gh=game.clientHeight;
 const maxX=gw-size,maxY=gh-size;
 sx=Math.floor(Math.random()*(maxX+1));
 sy=Math.floor(Math.random()*(maxY+1));
 drawSynapse();
}
function onKey(e){
 if(!started||awaiting)return;
 if(e.key==='ArrowUp'){e.preventDefault();dirX=0;dirY=-1;moving=true;}
 else if(e.key==='ArrowDown'){e.preventDefault();dirX=0;dirY=1;moving=true;}
 else if(e.key==='ArrowLeft'){e.preventDefault();dirX=-1;dirY=0;moving=true;}
 else if(e.key==='ArrowRight'){e.preventDefault();dirX=1;dirY=0;moving=true;}
}
function tick(){
 if(!started||awaiting||!moving)return;
 const gw=game.clientWidth,gh=game.clientHeight;
 const maxX=gw-size,maxY=gh-size;
 const oldX=nx,oldY=ny;
 nx=Math.max(0,Math.min(maxX,nx+dirX*speed));
 ny=Math.max(0,Math.min(maxY,ny+dirY*speed));
 let px=oldX,py=oldY;
 for(let i=0;i<segments.length;i++){
  const s=segments[i];
  const sx=s.x,sy=s.y;
  s.x=px;s.y=py;
  s.el.style.left=s.x+'px';
  s.el.style.top=s.y+'px';
  px=sx;py=sy;
 }
 drawNeuron();
 checkCollision();
 checkBorder();
}
function checkCollision(){
 const cx1=nx+size/2,cy1=ny+size/2,cx2=sx+size/2,cy2=sy+size/2;
 const dx=cx1-cx2,dy=cy1-cy2;
 const d=Math.hypot(dx,dy);
 if(d<=size){
  sinapsisCount++;
  sinapsisCountEl.textContent=String(sinapsisCount);
  openQuestion();
  }
}
function checkBorder(){
 const gw=game.clientWidth,gh=game.clientHeight;
 const maxX=gw-size,maxY=gh-size;
 if(nx===0||ny===0||nx===maxX||ny===maxY){
  moving=false;
  resetSnakeLength();
  resetQuestionsOnBorder();
  loseModal.classList.remove('oculto');
  }
}
function resetQuestionsOnBorder(){
 qi=0;leftCount=questions.length;leftCountEl.textContent=String(leftCount);
 awaiting=false;modal.classList.add('oculto');
 const gw=game.clientWidth,gh=game.clientHeight;
 nx=Math.round(gw/2-size/2);
 ny=Math.round(gh/2-size/2);
 drawNeuron();
 spawnSynapse();
}
function openQuestion(){
 awaiting=true;moving=false;
 if(qi>=questions.length){endGame();return;}
 const q=questions[qi];
 questionText.textContent=q.t;
 optionsWrap.innerHTML='';
 q.o.forEach((opt,idx)=>{
  const b=document.createElement('button');
  b.textContent=opt;
  b.addEventListener('click',()=>selectAnswer(idx));
  optionsWrap.appendChild(b);
 });
 modal.classList.remove('oculto');
}
function selectAnswer(idx){
 const q=questions[qi];
 const buttons=Array.from(optionsWrap.querySelectorAll('button'));
 buttons.forEach((b,i)=>{
  if(i===q.c){b.classList.add('correcta');} else {b.classList.add('incorrecta');}
  b.disabled=true;
 });
 if(idx===q.c){correctCount++;correctCountEl.textContent=String(correctCount);growSnake();} 
 leftCount=Math.max(0,leftCount-1);leftCountEl.textContent=String(leftCount);
 setTimeout(()=>{
  modal.classList.add('oculto');
  qi++;
  awaiting=false;moving=true;
  if(qi>=questions.length){endGame();return;}
  spawnSynapse();
 },700);
}
function growSnake(){
 const tx=segments.length?segments[segments.length-1].x:nx;
 const ty=segments.length?segments[segments.length-1].y:ny;
 const el=document.createElement('div');
 el.className='segment';
 game.appendChild(el);
 segments.push({el,x:tx,y:ty});
 el.style.left=tx+'px';
 el.style.top=ty+'px';
}
function resetSnakeLength(){
 for(const s of segments){
  if(s.el&&s.el.parentNode===game)game.removeChild(s.el);
 }
 segments=[];
}
startBtn.addEventListener('click',startGame);
endBtn.addEventListener('click',endGame);
closeFinal.addEventListener('click',()=>{finalModal.classList.add('oculto');});
loseContinue.addEventListener('click',()=>{
  loseModal.classList.add('oculto');
  moving=true;
});
