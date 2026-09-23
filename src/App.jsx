import { useState } from "react";
import { ArrowRight, List, X } from "@phosphor-icons/react";
import CareerComparison from "./CareerComparison";

const A = `${import.meta.env.BASE_URL}assets/source/`;
const bookingUrl = "https://medrepcollege.com/secure-your-spot";
const privacyUrl = "https://medrepcollege.com/privacy";
const termsUrl = "https://medrepcollege.com/terms";
const applicationUrl = "https://medrepcollege.com/apply-for-med-rep-college-now";
const testimonialsUrl = "https://www.thepharmacoach.com/pharmaceutical-sales-success-stories";
const videoTestimonialsUrl = "https://medrepcollege.com/mastermind-accelerator";
const studentVideos = [
  { name: "Lauren", path: "Business owner to pharmaceutical sales", file: "69ce8c24dd9155358d68e6c8.mov" },
  { name: "Matthew R.", path: "Retail to medical device sales", file: "69b5c33b0e6afdda34f59a08.mov" },
  { name: "Kara P.", path: "Advancing in pharmaceutical sales", file: "69b5c395302795ad60dfb409.mov" },
];
const officialLogos = [
  ["logo-01.jpeg", "Sanofi"],
  ["logo-02.png", "Edwards Lifesciences"],
  ["logo-03.jpeg", "Lilly"],
  ["logo-04.jpeg", "GSK"],
  ["logo-05.jpeg", "Medtronic"],
  ["logo-06.jpeg", "Cardinal Health"],
  ["logo-07.jpeg", "Johnson & Johnson"],
  ["logo-08.jpeg", "Amgen"],
  ["logo-09.jpeg", "Bristol Myers Squibb"],
  ["logo-10.jpeg", "Novartis"],
  ["logo-11.png", "Boehringer Ingelheim"],
  ["logo-12.jpeg", "AbbVie"],
  ["logo-13.jpeg", "Pfizer"],
  ["logo-14.png", "Henry Schein Dental"],
  ["logo-15.png", "Boston Scientific"],
  ["logo-16.jpeg", "Merck"],
  ["logo-17.jpeg", "AstraZeneca"],
  ["logo-18.jpeg", "Stryker"],
  ["logo-19.png", "Abbott"],
];

const programs = [
  { tier: "Self-paced", name: "Fast Track Academy", price: "$899", url: "https://www.thepharmacoach.com/academy", note: "A focused path for turning your current experience into a pharmaceutical-sales job search." },
  { tier: "Most popular", name: "Mastermind Accelerator", price: "$2,499", url: "https://medrepcollege.com/mastermind-accelerator", note: "Weekly strategy, mentorship and accountability as you pursue pharmaceutical-sales roles.", featured: true },
  { tier: "High touch", name: "VIP Signature Access", price: "$5,799", url: "https://www.thepharmacoach.com/pharmaceutical-sales-vip-mentorship", note: "A customized pharmaceutical-sales career strategy with direct, high-touch mentorship." },
];

const objections = [
  ["Can I move into pharma without pharma experience?", "Yes, some roles accept experience from other fields. Sales, healthcare, and teaching can offer transferable skills. Requirements vary by employer and role."],
  ["Why am I applying but not getting interviews?", "Your résumé, target roles, or networking approach may not show how your experience fits. Jebb helps you identify the gaps rather than simply send more applications."],
  ["What makes this different from generic career advice?", "Jebb brings medical-sales hiring and training experience to your résumé, networking, and interview preparation. The focus is on this industry and your next role."],
  ["Should I start before I’m ready to leave my job?", "You can research roles and prepare your applications while employed. Start when you have time to do the work; you do not need to rush a career decision."],
  ["Will coaching guarantee a job or a higher salary?", "No. Hiring and compensation depend on employers, your experience, and your execution. Review program terms before paying; do not assume placement or earnings are guaranteed."],
  ["What does the first call cost?", "The discovery call is $25 for 45 minutes with Jebb. Discuss your fit and next steps before choosing a coaching program. Confirm current booking and cancellation terms before paying."],
];

const testimonials = [
  {
    path: "Retail sales to pharma",
    quote: "Working with Jebb changed everything.",
    story: "After a biology degree and retail-sales work, Rochelle struggled to get interviews. She says she now works in pharmaceutical sales.",
    name: "Rochelle S.",
    location: "Dallas, Texas",
  },
  {
    path: "Nursing to pharma",
    quote: "I successfully navigated six rounds of competitive interviews.",
    story: "Emily brought six years of bedside nursing experience. She credits Jebb’s resume and interview guidance in her move to a global pharmaceutical company.",
    name: "Emily T.",
    location: "Atlanta, Georgia",
  },
  {
    path: "Medical-sales growth",
    quote: "Jebb helped me uncover the blind spots.",
    story: "Alex describes improving sales techniques and territory management before reaching President’s Club in medical sales.",
    name: "Alex J.",
    location: "Denver, Colorado",
  },
];

function Button() {
  return <a className="button button--gold" href={bookingUrl}>Schedule a call<ArrowRight size={18} weight="regular" aria-hidden="true" /></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Programs", "#programs"],
    ["The Method", "#method"],
    ["Testimonials", "#testimonials"],
    ["About", "#about"],
  ];
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="The Pharma Coach home"><strong>THE PHARMA COACH</strong></a>
      <button className="menu-button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
        <span className="sr-only">Toggle navigation</span>{open ? <X size={25} /> : <List size={25} />}
      </button>
      <nav id="primary-nav" className={open ? "nav nav--open" : "nav"} aria-label="Primary navigation">
        {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <Button />
      </nav>
    </header>
  );
}

function LogoStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="logo-strip" role="region" aria-label={`Industry logos shown on The Pharma Coach's official site: ${officialLogos.map(([, name]) => name).join(", ")}`}>
      <button className="logo-strip__toggle" onClick={() => setPaused(!paused)} aria-label={paused ? "Play logo animation" : "Pause logo animation"}>{paused ? "Play" : "Pause"}</button>
      <div className="logo-strip__track" style={{ animationPlayState: paused ? "paused" : "running" }} aria-hidden="true">
        {[0, 1].map((copy) => <div className="logo-strip__group" key={copy}>
          {officialLogos.map(([file, name]) => <img key={file} src={`${A}official-logo-strip/${file}`} alt="" title={name} loading="eager" decoding="async" />)}
        </div>)}
      </div>
    </div>
  );
}

export function App() {
  const [active, setActive] = useState(-1);
  return (
    <>
      <Header />
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero__image" src={`${A}jebb-banner-owner.png`} alt="Jebb Ruff, The Pharma Coach" fetchPriority="high" />
          <div className="hero__copy">
            <h1 id="hero-title">Start or advance your career in pharmaceutical sales.</h1>
            <p className="lead">Jebb helps nurses, healthcare professionals, and sales reps land pharmaceutical sales rep roles and advance in the field.</p>
            <Button />
          </div>
        </section>

        <LogoStrip />

        <CareerComparison />

        <section id="about" className="coach section-pad" aria-labelledby="coach-title">
          <div className="coach__portrait"><img src={`${A}jebb-headshot-owner.png`} alt="Jebb Ruff, The Pharma Coach" width="1139" height="1381" loading="lazy" /></div>
          <div className="coach__copy">
            <p className="eyebrow">Meet your coach</p>
            <h2 id="coach-title">Jebb Ruff, MBA</h2>
            <p className="coach__role">Medical sales hiring manager, sales trainer, and career coach.</p>
            <p>Learn from someone who has hired medical sales reps, not just coached them. Jebb helps you turn your experience into a stronger résumé, networking plan, and interview.</p>
            <dl className="coach__credentials">
              <div><dt>Since 2001</dt><dd>Career in medical sales</dd></div>
              <div><dt>19 awards</dt><dd>President’s Club recognition</dd></div>
              <div><dt>10+ years</dt><dd>Interviewing and hiring reps</dd></div>
            </dl>
            <a className="coach__source" href="https://www.thepharmacoach.com/about">Read Jebb’s full background<ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <section id="method" className="method section-pad">
          <div className="method__title"><h2>How the $100K Med Rep Method works.</h2></div>
          <div className="method__steps">
            <article><b>01</b><h3>Find your fit</h3><p>Identify the roles that match your experience and goals.</p></article>
            <article><b>02</b><h3>Build your plan</h3><p>Focus your résumé, networking, and interview preparation.</p></article>
            <article><b>03</b><h3>Make your move</h3><p>Apply your plan with the coaching support you choose.</p></article>
          </div>
          <section id="programs" className="program-options" aria-labelledby="programs-title">
            <h2 id="programs-title">Choose your coaching support.</h2>
            <div className="program-options__cards">{programs.map(p => <article className={`program-card${p.featured ? " program-card--featured" : ""}`} key={p.name}><span>{p.tier}</span><h3>{p.name}</h3><strong>{p.price}</strong><p>{p.note}</p><a className="program-options__link" href={p.url} aria-label={`View ${p.name} details`}>View program details <ArrowRight size={16} aria-hidden="true" /></a></article>)}</div>
            <p>Review current inclusions, pricing, and terms on each official program page before enrolling.</p>
          </section>
        </section>

        <section id="testimonials" className="testimonials section-pad" aria-labelledby="testimonials-title">
          <div className="testimonials__intro">
            <h2 id="testimonials-title">Client results</h2>
          </div>
          <div className="student-videos" aria-label="Student video testimonials">
            {studentVideos.map(student => <article className="student-video" key={student.name}>
              <video controls playsInline preload="metadata" aria-label={`${student.name}'s video testimonial`}>
                <source src={`https://assets.cdn.filesafe.space/5Yn78yf8uYk9U7Fl1kJ2/media/${student.file}`} />
                Your browser cannot play this video. <a href={videoTestimonialsUrl}>Watch on Med Rep College</a>.
              </video>
              <h3>{student.name}</h3><p>{student.path}</p>
              <a href={videoTestimonialsUrl}>View original testimonial</a>
            </article>)}
          </div>
          <div className="testimonials__grid">
            {testimonials.map((item) => <article key={item.name} className="testimonial">
              <p className="testimonial__path">{item.path}</p>
              <blockquote>“{item.quote}”</blockquote>
              <details className="testimonial__details"><summary>Read the result</summary><p className="testimonial__story">{item.story}</p></details>
              <p className="testimonial__person"><strong>{item.name}</strong><span>{item.location}</span></p>
            </article>)}
          </div>
          <p className="testimonials__source">Videos and student labels from <a href={videoTestimonialsUrl}>Med Rep College</a>. Written excerpts and story summaries from <a href={testimonialsUrl}>The Pharma Coach’s client stories</a>. Individual results vary.</p>
        </section>

        <section className="faq section-pad">
          <div><h2>Your questions, answered.</h2></div>
          <div className="accordion">
            {objections.map(([q, a], i) => <article key={q}>
              <button aria-expanded={active === i} onClick={() => setActive(active === i ? -1 : i)}><span>{q}</span><b aria-hidden="true">{active === i ? "−" : "+"}</b></button>
              {active === i && <p>{a}</p>}
            </article>)}
          </div>
        </section>

        <section className="final-cta section-pad">
          <div><h2>Get clear on your next move.</h2><p>A 45-minute discovery call with Jebb. $25. Discuss your fit and next steps before choosing a coaching program.</p><p className="booking-note">Booking continues on Med Rep College, Jebb’s official booking site. <a href={privacyUrl}>Privacy policy</a> · <a href={termsUrl}>Terms & conditions</a></p></div>
          <Button />
        </section>
      </main>
      <footer>
        <div className="footer__brand"><strong>THE PHARMA COACH</strong><p>Pharmaceutical-sales career coaching for professionals ready to reposition their experience and compete.</p></div>
        <nav className="footer__links" aria-label="Programs and application"><strong>Programs</strong>{programs.map(p => <a key={p.name} href={p.url}>{p.name}</a>)}<a href={applicationUrl}>Coaching application</a></nav>
        <nav className="footer__links" aria-label="Resources and contact"><strong>Resources & contact</strong><a href="https://medrepcollege.com/access">Free interview guide</a><a href="https://www.thepharmacoach.com/medical-sales-faq">FAQ</a><a href="https://www.thepharmacoach.com/pharmaceutical-sales-career-advice">Career advice</a><a href="mailto:Jebb@ThePharmaCoach.com">Email Jebb</a><a href="https://www.linkedin.com/company/the-pharma-coach/">LinkedIn</a><a href="https://www.instagram.com/pharma_coach_jebb_ruff_mba/">Instagram</a></nav>
        <div className="footer__legal"><nav aria-label="Legal"><a href={privacyUrl}>Privacy policy</a><a href={termsUrl}>Terms & conditions</a></nav><p>© The Pharma Coach, LLC. All rights reserved. Results vary. Earnings and placement examples are not guarantees.</p></div>
      </footer>
    </>
  );
}
