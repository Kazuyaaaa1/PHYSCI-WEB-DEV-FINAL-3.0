document.addEventListener('DOMContentLoaded',()=>{
	// Year
	document.getElementById('year').textContent=new Date().getFullYear();

	// Mobile nav
	const toggle=document.querySelector('.nav-toggle');
	const list=document.querySelector('.nav-list');
	if(toggle){
		toggle.addEventListener('click',()=>{
			const open=list.classList.toggle('open');
			toggle.setAttribute('aria-expanded',String(open));
		});
	}

	// Scroll reveal
	const observer=new IntersectionObserver((entries)=>{
		for(const e of entries){
			if(e.isIntersecting){
				e.target.classList.add('visible');
				observer.unobserve(e.target);
			}
		}
	},{threshold:.12});
	for(const el of document.querySelectorAll('.reveal-up')){
		const d=Number(el.getAttribute('data-delay')||0);
		el.style.transitionDelay=d+'ms';
		observer.observe(el);
	}

	// Accordion
	for(const btn of document.querySelectorAll('.accordion-trigger')){
		btn.addEventListener('click',()=>{
			const panel=btn.nextElementSibling;
			const expanded=btn.getAttribute('aria-expanded')==='true';
			btn.setAttribute('aria-expanded',String(!expanded));
			panel.hidden=expanded;
		});
	}

	// Back to top button
	const toTop=document.getElementById('toTop');
	const onScroll=()=>{
		if(window.scrollY>350){toTop.classList.add('show')}else{toTop.classList.remove('show')}
	};
	window.addEventListener('scroll',onScroll,{passive:true});
	toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

	// Demo modal (optional placeholder)
    const demoModal=document.getElementById('demoModal');
    const watch=null; // removed modal buttons
    const watchExternal=null;
    const demoFrame=null;
    const demoClose=null;
	const ytId='dQw4w9WgXcQ'; // provided YouTube link id
    // modal and external watch removed; video now embedded in page

	// QR generator
	const qrModal=document.getElementById('qrModal');
	const qrImg=document.getElementById('qrImg');
	const openQR=document.getElementById('openQR');
	if(openQR && 'showModal' in qrModal){
		openQR.addEventListener('click',()=>{
			const url=location.href;
			const api=`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}`;
			qrImg.src=api;
			qrModal.showModal();
		});
	}

	// Quiz
	const form=document.getElementById('quizForm');
	const result=document.getElementById('quizResult');
	if(form){
		form.addEventListener('submit',(e)=>{
			e.preventDefault();
			const data=new FormData(form);
			const correct=(data.get('q1')==='true')+(data.get('q2')==='true');
			const messages=['Keep learning!','Nice!'];
			result.textContent=correct===2?`2/2 • Excellent!`:`${correct}/2 • ${messages[correct>0?1:0]}`;
			result.style.color=correct===2?'#21d4fd':correct===1?'#ffd166':'#ff6b6b';
		});
	}

	// Endorsement: rating interaction
	const stars=document.querySelectorAll('.rating .star');
	const scoreEl=document.querySelector('.rating .score');
	let score=4.6;
	const setStars=(val)=>{
		stars.forEach(s=>s.classList.toggle('active',Number(s.dataset.v)<=Math.round(val)));
		scoreEl && (scoreEl.textContent=val.toFixed(1));
	};
	if(stars.length){
		setStars(score);
		stars.forEach(s=>s.addEventListener('click',()=>{
			score=(Number(s.dataset.v)+score)/2; // simple running average
			setStars(score);
		}));
	}

	// Like button (persist per session)
	const likeBtn=document.getElementById('likeBtn');
	const likeCount=document.getElementById('likeCount');
	if(likeBtn){
		const saved=Number(sessionStorage.getItem('likes')||0);
		likeCount.textContent=String(saved);
		likeBtn.addEventListener('click',()=>{
			const n=Number(likeCount.textContent)+1;
			likeCount.textContent=String(n);
			sessionStorage.setItem('likes',String(n));
		});
	}

	// Carousel
	const track=document.getElementById('carTrack');
	const dots=document.getElementById('carDots');
	const prev=document.querySelector('.car-btn.prev');
	const next=document.querySelector('.car-btn.next');
	if(track && dots && prev && next){
		const items=[...track.children];
		let index=0;
		const update=()=>{
			track.style.transform=`translateX(${index*-100}%)`;
			[...dots.children].forEach((d,i)=>d.classList.toggle('active',i===index));
		};
		items.forEach((_,i)=>{
			const b=document.createElement('button');
			b.setAttribute('aria-label',`Slide ${i+1}`);
			b.addEventListener('click',()=>{index=i;update();});
			dots.appendChild(b);
		});
		[prev,next].forEach(btn=>btn.addEventListener('click',()=>{
			index=(btn===next)?(index+1)%items.length:(index-1+items.length)%items.length;
			update();
		}));
		let timer=setInterval(()=>{next.click();},5000);
		track.addEventListener('pointerenter',()=>clearInterval(timer));
		track.addEventListener('pointerleave',()=>{timer=setInterval(()=>{next.click();},5000);});
		update();
	}

	// Subtle tilt on media card
	for(const el of document.querySelectorAll('[data-tilt]')){
		let rect;
		el.addEventListener('pointermove',(e)=>{
			rect=rect||el.getBoundingClientRect();
			const x=(e.clientX-rect.left)/rect.width-.5;
			const y=(e.clientY-rect.top)/rect.height-.5;
			el.style.transform=`rotateY(${x*8}deg) rotateX(${y*-8}deg)`;
		});
		el.addEventListener('pointerleave',()=>{el.style.transform='rotateY(0) rotateX(0)';rect=null;});
	}

	// Set endorsement embedded video (no autoplay so it doesn't distract)
	const endorseFrame=document.getElementById('endorseFrame');
	if(endorseFrame){
		endorseFrame.src=`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`;
	}

  // Re-anchor to current hash after assets load to avoid jumping to top
  window.addEventListener('load',()=>{
    if(location.hash){
      const el=document.getElementById(location.hash.slice(1));
      if(el){
        el.scrollIntoView();
      }
    }
  });
});


