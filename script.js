const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

const observer=new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      entry.target.style.transitionDelay=(Math.min(i%5,4)*80)+'ms';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const themeBtn=document.getElementById('themeBtn');
themeBtn.addEventListener('click',()=>{
  document.body.classList.toggle('light');
  themeBtn.textContent=document.body.classList.contains('light')?'☼':'◐';
});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
  });
});
