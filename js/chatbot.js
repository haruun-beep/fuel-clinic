/* FUEL Clinic — chatbot.js | RAG-powered, no API, pure JS */
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  //  KNOWLEDGE BASE — extracted from site content
  // ─────────────────────────────────────────────────────────────
  const KB = [
    {
      id: 'overview',
      keywords: ['fuel','clinic','about','what','who','award','edmonton','multi','disciplinary','overview','canadian','choice'],
      response: `<strong>About FUEL Clinic</strong><br>FUEL Pain &amp; Injury Recovery Clinic is Edmonton's award-winning multi-disciplinary health clinic in downtown Edmonton. We offer 10+ recovery services under one roof and are the <span style="color:var(--green)">2025–2026 Canadian Choice Award Winner</span>.<br><br>Our 8+ practitioners take a collaborative, biopsychosocial approach to your recovery.`,
      link: 'about.html', linkText: 'About Us'
    },
    {
      id: 'location',
      keywords: ['location','address','where','hours','open','close','downtown','map','directions','find','phone','call','email','contact','visit'],
      response: `<strong>Location &amp; Hours</strong><br>📍 10240 124 St NW, Edmonton, AB T5N 1R1<br>📞 <a href="tel:7807055452">(780) 705-5452</a><br>✉️ <a href="mailto:info@fuelclinicedmonton.com">info@fuelclinicedmonton.com</a><br><br><strong>Hours:</strong><br>Mon–Fri: 8:00am – 8:00pm<br>Saturday: 9:00am – 5:00pm<br>Sunday: Massage by request`,
      link: 'contact.html', linkText: 'Get Directions'
    },
    {
      id: 'booking',
      keywords: ['book','booking','appointment','schedule','reserve','online','same','day','walk','available','how','janeapp','cancel'],
      response: `<strong>Book an Appointment</strong><br>🖥️ <strong>Online:</strong> <a href="https://fuelclinic.janeapp.com/" target="_blank" style="color:var(--green)">fuelclinic.janeapp.com</a><br>📞 <strong>Phone:</strong> <a href="tel:7807055452">(780) 705-5452</a><br><br>Same-day and next-day appointments are often available. Walk-ins welcome subject to availability.`,
      link: 'https://fuelclinic.janeapp.com/', linkText: 'Book Online Now', external: true
    },
    {
      id: 'billing',
      keywords: ['billing','insurance','direct','cost','price','pay','covered','extended','health','plan','sunlife','manulife','blue','cross','greatlwest','free','covered','coverage','expensive'],
      response: `<strong>Direct Billing &amp; Insurance</strong><br>We offer <span style="color:var(--green)">direct billing</span> to most major extended health providers including Sun Life, Manulife, Great-West Life, Blue Cross &amp; more.<br><br>For MVA (car accident) claims we bill your auto insurer directly — <strong>no out-of-pocket cost</strong>.<br><br>Call to verify: <a href="tel:7807055452">(780) 705-5452</a>`,
      link: 'contact.html', linkText: 'Verify My Coverage'
    },
    {
      id: 'mva',
      keywords: ['mva','car','accident','motor','vehicle','whiplash','injury','crash','collision','claim','sgi','td','intact','auto'],
      response: `<strong>Motor Vehicle Accident Recovery</strong><br>FUEL specializes in MVA rehabilitation. We bill your auto insurer directly — <strong>no out-of-pocket cost</strong>.<br><br>We treat whiplash, soft tissue injuries, back &amp; neck pain, concussion, and psychological trauma.<br><br>⚠️ <strong>MVA claims have time limits — book within 48 hours of your accident.</strong>`,
      link: 'services/mva.html', linkText: 'MVA Services'
    },
    {
      id: 'chiropractic',
      keywords: ['chiro','chiropractic','chiropractor','back','neck','spine','adjustment','joint','disc','herniated','sasha','babovic'],
      response: `<strong>Chiropractic Care</strong><br><strong>Dr. Saša Babović</strong> (BSc Kinesiology · DC · MSc Sports Medicine) provides evidence-based chiropractic for:<br><br>• Chronic back &amp; neck pain<br>• Headaches &amp; migraines<br>• Sports injuries<br>• Joint pain &amp; dysfunction<br><br>Direct billing available. Same-day appointments often possible.`,
      link: 'services/chiropractic-care.html', linkText: 'Chiropractic Services'
    },
    {
      id: 'osteopathy',
      keywords: ['osteo','osteopathy','osteopath','manual','brandon','barr','chase','dach','whole','body','structural','visceral','cranial'],
      response: `<strong>Manual Osteopathy</strong><br><strong>Brandon Barr</strong> (MOT · RMT) and <strong>Chase Dach</strong> (DOMP · RMT) treat the root cause of pain using gentle, whole-body hands-on therapy.<br><br>• Back &amp; neck pain<br>• Headaches &amp; migraines<br>• Digestive issues<br>• Joint dysfunction<br>• Postural imbalances`,
      link: 'services/manual-osteopathy-edmonton.html', linkText: 'Osteopathy Services'
    },
    {
      id: 'massage',
      keywords: ['massage','rmt','registered','deep','tissue','sports','swedish','prenatal','hot','stone','relaxation','jake','collier','trigger','myofascial'],
      response: `<strong>Registered Massage Therapy</strong><br>Our RMTs offer a full range of therapeutic massage:<br><br>• Deep Tissue · Sports Massage<br>• Swedish / Relaxation<br>• Hot Stone · Prenatal<br>• Myofascial Release · Trigger Point<br><br>Evening &amp; weekend appointments available. Direct billing to most plans.`,
      link: 'services/massage-therapy-downtown-edmonton.html', linkText: 'Massage Therapy'
    },
    {
      id: 'acupuncture',
      keywords: ['acupuncture','tcm','chinese','medicine','needle','cupping','guasha','gua','sha','fertility','anxiety','insomnia','zoe','cooper','albert','wang','moxibustion'],
      response: `<strong>Acupuncture &amp; Traditional Chinese Medicine</strong><br>Licensed acupuncturists <strong>Zoe Cooper</strong> and <strong>Albert Wang</strong> provide acupuncture, cupping, gua-sha, moxibustion &amp; electro-acupuncture.<br><br>Treats chronic pain, stress, anxiety, fertility, insomnia, headaches, digestive health &amp; more.`,
      link: 'services/chinese-medicine-acupuncture-edmonton.html', linkText: 'Acupuncture Services'
    },
    {
      id: 'psychology',
      keywords: ['psychology','psychologist','mental','health','cbt','emdr','trauma','anxiety','depression','ptsd','grief','therapy','counselling','counseling','christina','worthing','virtual','online'],
      response: `<strong>Psychology Services</strong><br><strong>Christina Worthing</strong> (Registered Psychologist) provides CBT, EMDR, trauma-informed therapy, ACT, DBT &amp; more.<br><br>In-person and virtual sessions available. Covered by most extended health &amp; EAP plans.`,
      link: 'services/psychology-services-edmonton.html', linkText: 'Psychology Services'
    },
    {
      id: 'personaltraining',
      keywords: ['personal','training','trainer','fitness','strength','weight','loss','gym','workout','exercise','sport','performance','rehab','jake'],
      response: `<strong>Personal Training</strong><br>Certified trainers with injury-smart programming for:<br><br>• Strength &amp; Muscle Building<br>• Weight / Fat Loss<br>• Athletic Performance<br>• Post-Rehab Return to Sport<br><br>Clinical oversight available — train and recover under one roof.`,
      link: 'services/personal-training.html', linkText: 'Personal Training'
    },
    {
      id: 'shockwave',
      keywords: ['shockwave','shock','wave','laser','eswt','lllt','plantar','fasciitis','tendon','tendinopathy','calcific','heel','achilles','tennis','elbow','golfer','rotator','cuff','chronic','pain'],
      response: `<strong>Shockwave &amp; Laser Therapy</strong><br>Using EMS Swiss DolorClast shockwave &amp; LuxMaster laser — treats:<br><br>• Plantar Fasciitis · Heel Pain<br>• Achilles &amp; Patellar Tendinopathy<br>• Calcific Shoulder Deposits<br>• Tennis / Golfer's Elbow<br><br>Most patients see results in <strong>3–5 sessions</strong>. No surgery, no drugs, no downtime.`,
      link: 'services/shockwave-therapy-edmonton.html', linkText: 'Shockwave Therapy'
    },
    {
      id: 'bpulse',
      keywords: ['bpulse','b-pulse','pelvic','floor','incontinence','bladder','leaking','chair','electromagnetic','kegel','postpartum','womens','mens'],
      response: `<strong>B-Pulse Pelvic Floor Chair</strong><br>Non-invasive electromagnetic pelvic floor therapy — <strong>fully clothed, no internal assessment</strong>.<br><br>Treats urinary incontinence, urgency, pelvic floor weakness, &amp; men's health conditions.<br><br>28-minute sessions. Typical results in 6–10 sessions.`,
      link: 'services/b-pulse-chair.html', linkText: 'B-Pulse Chair'
    },
    {
      id: 'cosmeticacupuncture',
      keywords: ['cosmetic','facial','acupuncture','rejuvenation','botox','filler','collagen','wrinkles','lines','skin','tone','beauty','anti','aging','natural'],
      response: `<strong>Cosmetic Acupuncture</strong><br>Natural facial rejuvenation — stimulates your body's own collagen &amp; elastin production.<br><br>• Reduces fine lines &amp; wrinkles<br>• Improves skin tone &amp; texture<br>• Natural radiance &amp; glow<br>• Zero downtime, no chemicals<br><br>Performed by Zoe Cooper &amp; Albert Wang.`,
      link: 'services/cosmetic-acupuncture.html', linkText: 'Cosmetic Acupuncture'
    },
    {
      id: 'pelvicfloor',
      keywords: ['pelvic','floor','physio','incontinence','prolapse','postpartum','prenatal','pregnancy','diastasis','recti','painful','intercourse','private','confidential'],
      response: `<strong>Pelvic Floor Physiotherapy</strong><br>Specialized pelvic health physiotherapy in a private, judgment-free setting.<br><br>• Urinary incontinence &amp; urgency<br>• Pelvic pain &amp; painful intercourse<br>• Pelvic organ prolapse<br>• Prenatal &amp; postpartum recovery<br>• Diastasis recti`,
      link: 'services/b-pulse-chair.html', linkText: 'Pelvic Floor Services'
    },
    {
      id: 'services_list',
      keywords: ['services','offer','list','all','available','do','treat','help','conditions','what'],
      response: `<strong>Our Services</strong><br>FUEL offers 10+ services under one roof:<br><br>• Chiropractic Care<br>• Manual Osteopathy<br>• Registered Massage Therapy<br>• Acupuncture &amp; TCM<br>• Psychology<br>• Personal Training<br>• Shockwave &amp; Laser Therapy<br>• Pelvic Floor Physiotherapy<br>• B-Pulse Pelvic Chair<br>• Cosmetic Acupuncture<br>• MVA Rehabilitation`,
      link: 'services.html', linkText: 'View All Services'
    },
    {
      id: 'team',
      keywords: ['team','staff','practitioners','brandon','sasha','christina','albert','chase','jake','zoe','noreen','who','therapist','doctor'],
      response: `<strong>Our Team</strong><br>FUEL's multi-disciplinary team includes:<br><br>• <strong>Brandon Barr</strong> — Owner &amp; Manual Osteopath<br>• <strong>Saša Babović</strong> — Chiropractor<br>• <strong>Christina Worthing</strong> — Psychologist<br>• <strong>Albert Wang</strong> — Acupuncturist &amp; RMT<br>• <strong>Chase Dach</strong> — Osteopath &amp; RMT<br>• <strong>Jake Collier</strong> — RMT &amp; Personal Trainer<br>• <strong>Zoe Cooper</strong> — Acupuncturist &amp; TCM<br>• <strong>Noreen Remtulla</strong> — Clinic Administrator`,
      link: 'team.html', linkText: 'Meet the Full Team'
    },
    {
      id: 'parking',
      keywords: ['park','parking','transit','bus','train','lrt','accessible','wheelchair','disability'],
      response: `<strong>Getting Here</strong><br>FUEL Clinic is located at 10240 124 St NW in downtown Edmonton — easily accessible by transit and with street parking available nearby.<br><br>For specific transit or accessibility questions, give us a call: <a href="tel:7807055452">(780) 705-5452</a>`,
      link: 'contact.html', linkText: 'View Map &amp; Directions'
    },
    {
      id: 'newpatient',
      keywords: ['new','patient','first','visit','intake','form','what','expect','bring','prepare','initial'],
      response: `<strong>Your First Visit</strong><br>For your first appointment:<br><br>• Arrive 10 minutes early for intake paperwork<br>• Bring your insurance card &amp; ID<br>• Wear comfortable, movable clothing<br>• Bring any relevant medical records if available<br><br>We'll complete a thorough assessment before beginning treatment.`,
      link: 'https://fuelclinic.janeapp.com/', linkText: 'Book Your First Visit', external: true
    },
  ];

  // ─────────────────────────────────────────────────────────────
  //  RETRIEVAL — TF-IDF keyword scoring
  // ─────────────────────────────────────────────────────────────
  const STOP = new Set(['a','an','the','is','are','was','were','be','have','has','do','does','i','me','my','we','our','you','your','it','this','that','and','but','or','for','in','of','on','to','at','as','with','about','can','get','not','what','how','when','where','why','will','would','could','should','need','want','please','hi','hello','hey','thanks','thank','okay']);

  function tokens(str) {
    return str.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(t => t.length > 1 && !STOP.has(t));
  }

  function retrieve(query) {
    const qt = tokens(query);
    if (!qt.length) return null;
    let best = null, bestScore = 0;
    KB.forEach(chunk => {
      let s = 0;
      qt.forEach(q => {
        chunk.keywords.forEach(kw => {
          if (kw === q) s += 4;
          else if (kw.startsWith(q) || q.startsWith(kw)) s += 2;
          else if (kw.includes(q) || q.includes(kw)) s += 1;
        });
      });
      if (s > bestScore) { bestScore = s; best = chunk; }
    });
    return bestScore >= 2 ? best : null;
  }

  // ─────────────────────────────────────────────────────────────
  //  RESOLVE RELATIVE PATHS
  // ─────────────────────────────────────────────────────────────
  function resolveHref(link) {
    const depth = (window.location.pathname.match(/\//g) || []).length;
    // If we're in /lp/ or /services/ (depth >= 2), prefix with ../
    if (depth >= 2 && !link.startsWith('http')) return '../' + link;
    return link;
  }

  // ─────────────────────────────────────────────────────────────
  //  CHAT UI
  // ─────────────────────────────────────────────────────────────
  function init() {
    // Styles
    const css = document.createElement('style');
    css.textContent = `
      #fchat-btn{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:56px;height:56px;border-radius:50%;background:#16c75a;color:#080d0c;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(22,199,90,.45);transition:transform .25s,background .25s;font-size:1.5rem;line-height:1}
      #fchat-btn:hover{transform:scale(1.1);background:#22e56e}
      #fchat-win{position:fixed;bottom:4.75rem;right:1.5rem;z-index:9998;width:360px;max-width:calc(100vw - 2rem);background:#0c1a19;border:1px solid rgba(14,122,118,.4);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.7);flex-direction:column;overflow:hidden;display:none;font-family:'Inter',sans-serif}
      #fchat-win.open{display:flex}
      #fchat-head{background:linear-gradient(135deg,#0c3232,#0c1a19);padding:.9rem 1.1rem;display:flex;align-items:center;gap:.7rem;border-bottom:1px solid rgba(14,122,118,.3)}
      .fch-av{width:34px;height:34px;border-radius:50%;background:#16c75a;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0;color:#080d0c}
      .fch-ht h4{margin:0;font-size:.85rem;font-weight:700;color:#fff;font-family:'Montserrat',sans-serif;letter-spacing:-.01em}
      .fch-ht p{margin:0;font-size:.7rem;color:rgba(255,255,255,.45);margin-top:.1rem}
      .fch-x{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:1rem;padding:.2rem;line-height:1;transition:color .2s}
      .fch-x:hover{color:#fff}
      #fchat-msgs{overflow-y:auto;padding:.9rem;display:flex;flex-direction:column;gap:.65rem;max-height:320px;min-height:160px;scroll-behavior:smooth}
      #fchat-msgs::-webkit-scrollbar{width:3px}
      #fchat-msgs::-webkit-scrollbar-thumb{background:rgba(14,122,118,.4);border-radius:2px}
      .fm{display:flex;flex-direction:column;max-width:90%}
      .fm.u{align-self:flex-end;align-items:flex-end}
      .fm.b{align-self:flex-start;align-items:flex-start}
      .fb{padding:.6rem .85rem;border-radius:12px;font-size:.83rem;line-height:1.65}
      .fm.u .fb{background:#16c75a;color:#080d0c;border-bottom-right-radius:3px;font-weight:500}
      .fm.b .fb{background:#152a28;color:rgba(255,255,255,.85);border-bottom-left-radius:3px;border:1px solid rgba(14,122,118,.22)}
      .fb a{color:#16c75a;font-weight:600}
      .fb a:hover{color:#22e56e}
      .flink{display:inline-flex;align-items:center;gap:.25rem;margin-top:.45rem;font-size:.74rem;font-weight:700;color:#16c75a;text-transform:uppercase;letter-spacing:.07em;text-decoration:none;transition:color .2s}
      .flink:hover{color:#22e56e}
      .ftyp{display:flex;gap:.28rem;padding:.6rem .85rem;background:#152a28;border-radius:12px;border-bottom-left-radius:3px;border:1px solid rgba(14,122,118,.22);width:fit-content;align-self:flex-start}
      .ftyp span{width:6px;height:6px;border-radius:50%;background:#16c75a;animation:ftp .9s infinite ease-in-out}
      .ftyp span:nth-child(2){animation-delay:.15s}.ftyp span:nth-child(3){animation-delay:.3s}
      @keyframes ftp{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-5px);opacity:1}}
      #fchat-chips{padding:.45rem .9rem;display:flex;flex-wrap:wrap;gap:.35rem;border-top:1px solid rgba(14,122,118,.18)}
      .fchip{background:rgba(14,122,118,.12);border:1px solid rgba(14,122,118,.28);border-radius:20px;padding:.28rem .7rem;font-size:.73rem;color:rgba(255,255,255,.7);cursor:pointer;transition:all .2s;white-space:nowrap;line-height:1.4}
      .fchip:hover{background:rgba(22,199,90,.14);border-color:#16c75a;color:#fff}
      #fchat-row{display:flex;gap:.5rem;padding:.65rem .9rem;border-top:1px solid rgba(14,122,118,.18)}
      #fchat-in{flex:1;background:#0a1614;border:1px solid rgba(14,122,118,.32);border-radius:8px;padding:.5rem .8rem;color:#fff;font-size:.83rem;outline:none;transition:border-color .2s}
      #fchat-in:focus{border-color:#16c75a}
      #fchat-in::placeholder{color:rgba(255,255,255,.28)}
      #fchat-go{background:#16c75a;color:#080d0c;border:none;border-radius:8px;width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.9rem;transition:background .2s;font-weight:700}
      #fchat-go:hover{background:#22e56e}
      .fch-ub{display:inline-block;width:7px;height:7px;border-radius:50%;background:#16c75a;margin-left:.35rem;box-shadow:0 0 0 2px rgba(22,199,90,.3)}
      @media(max-width:480px){#fchat-win{right:.75rem;bottom:4.5rem;width:calc(100vw - 1.5rem)}}
    `;
    document.head.appendChild(css);

    // HTML
    const btn = document.createElement('button');
    btn.id = 'fchat-btn';
    btn.setAttribute('aria-label', 'Open chat assistant');
    btn.innerHTML = '💬';

    const win = document.createElement('div');
    win.id = 'fchat-win';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'FUEL Clinic Chat Assistant');
    win.innerHTML = `
      <div id="fchat-head">
        <div class="fch-av">⚡</div>
        <div class="fch-ht">
          <h4>FUEL Clinic Assistant <span class="fch-ub"></span></h4>
          <p>Ask me anything about our services</p>
        </div>
        <button class="fch-x" aria-label="Close">✕</button>
      </div>
      <div id="fchat-msgs" role="log" aria-live="polite"></div>
      <div id="fchat-chips">
        <span class="fchip">Book appointment</span>
        <span class="fchip">Services offered</span>
        <span class="fchip">Direct billing</span>
        <span class="fchip">Location &amp; hours</span>
        <span class="fchip">MVA claims</span>
      </div>
      <div id="fchat-row">
        <input id="fchat-in" type="text" placeholder="Ask about services, booking, hours…" maxlength="200" autocomplete="off">
        <button id="fchat-go" aria-label="Send">➤</button>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(win);

    const msgs  = win.querySelector('#fchat-msgs');
    const input = win.querySelector('#fchat-in');
    const chips = win.querySelector('#fchat-chips');

    function botMsg(html, chunk) {
      const d = document.createElement('div');
      d.className = 'fm b';
      let inner = `<div class="fb">${html}</div>`;
      if (chunk && chunk.link) {
        const href = chunk.external ? chunk.link : resolveHref(chunk.link);
        const tgt  = chunk.external ? ' target="_blank" rel="noopener"' : '';
        inner += `<a class="flink" href="${href}"${tgt}>${chunk.linkText} →</a>`;
      }
      d.innerHTML = inner;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function userMsg(text) {
      const d = document.createElement('div');
      d.className = 'fm u';
      d.innerHTML = `<div class="fb">${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function typing() {
      const d = document.createElement('div');
      d.className = 'ftyp'; d.id = 'ftyp-ind';
      d.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      return d;
    }

    function respond(text) {
      userMsg(text);
      chips.style.display = 'none';
      const t = typing();
      const delay = 650 + Math.random() * 350;
      setTimeout(() => {
        t.remove();
        const chunk = retrieve(text);
        if (chunk) {
          botMsg(chunk.response, chunk);
        } else {
          botMsg(`I don't have a specific answer for that, but our team is happy to help! 😊<br><br>📞 <a href="tel:7807055452">(780) 705-5452</a><br>✉️ <a href="mailto:info@fuelclinicedmonton.com">info@fuelclinicedmonton.com</a>`, { link: resolveHref('contact.html'), linkText: 'Contact Us' });
        }
      }, delay);
    }

    function send() {
      const v = input.value.trim();
      if (v) { input.value = ''; respond(v); }
    }

    // Greet
    botMsg(`👋 Hi! I'm the FUEL Clinic assistant. I can answer questions about our <strong>services, team, booking, insurance, and location</strong>.<br><br>What can I help you with?`);

    // Events
    btn.addEventListener('click', () => {
      const open = win.classList.toggle('open');
      btn.innerHTML = open ? '✕' : '💬';
      btn.style.fontSize = open ? '1rem' : '1.5rem';
      if (open) setTimeout(() => input.focus(), 100);
    });
    win.querySelector('.fch-x').addEventListener('click', () => {
      win.classList.remove('open');
      btn.innerHTML = '💬'; btn.style.fontSize = '1.5rem';
    });
    win.querySelector('#fchat-go').addEventListener('click', send);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    win.querySelectorAll('.fchip').forEach(c => {
      c.addEventListener('click', () => respond(c.textContent.replace(/&amp;/g,'&')));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
