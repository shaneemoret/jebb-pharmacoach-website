import { useState } from "react";
import { ArrowRight, List, X } from "@phosphor-icons/react";

const A = `${import.meta.env.BASE_URL}assets/source/`;
const bookingUrl = "https://medrepcollege.com/book-a-call-with-jebb";
const testimonialsUrl = "https://www.thepharmacoach.com/pharmaceutical-sales-success-stories";
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
  { tier: "Self-paced", name: "Fast Track Academy", price: "$899", note: "A focused path for turning your current experience into a pharmaceutical-sales job search." },
  { tier: "Most popular", name: "Mastermind Accelerator", price: "$2,499", note: "Weekly strategy, mentorship and accountability as you pursue pharmaceutical-sales roles.", featured: true },
  { tier: "High touch", name: "VIP Signature Access", price: "$5,799", note: "A customized pharmaceutical-sales career strategy with direct, high-touch mentorship." },
];

const objections = [
  ["Do I need pharmaceutical sales experience?", "No. Sales, healthcare, teaching and other customer-facing backgrounds can bring transferable strengths. The work is showing how your results, relationships and ability to learn complex information fit a pharmaceutical sales role."],
  ["How does my sales or healthcare experience translate to pharma?", "Sales professionals can show prospecting, relationship-building and performance results. Healthcare professionals can show clinical fluency, provider communication and patient education. Both need a clear story that connects those strengths to pharmaceutical sales."],
  ["What if I have no formal sales experience?", "You are not necessarily starting from zero. Teaching, patient education, care coordination and other roles can demonstrate communication, influence and follow-through. Coaching helps you identify credible examples and present them in the language hiring managers expect."],
  ["How do I know pharmaceutical sales is the right fit for me?", "Consider whether you enjoy science, relationship-building, explaining complex information and being accountable for commercial results. A career diagnosis can help you assess the role, the lifestyle and your next step before you apply."],
  ["Why pharma instead of medical device sales?", "Pharma often suits people drawn to clinical science, mechanisms of action and long-term provider relationships. Device sales is typically more procedure- and engineering-oriented. The right choice depends on how you think, work and want to spend your day."],
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
    ["About", "https://www.thepharmacoach.com/about"],
  ];
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="The Pharma Coach home"><span>THE</span><strong>PHARMA COACH</strong></a>
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
  return (
    <div id="top" className="logo-strip" role="img" aria-label={`Industry logos shown on The Pharma Coach's official site: ${officialLogos.map(([, name]) => name).join(", ")}`}>
      <div className="logo-strip__track" aria-hidden="true">
        {[0, 1].map((copy) => <div className="logo-strip__group" key={copy}>
          {officialLogos.map(([file, name]) => <img key={file} src={`${A}official-logo-strip/${file}`} alt="" title={name} loading="eager" decoding="async" />)}
        </div>)}
      </div>
    </div>
  );
}

export function App() {
  const [active, setActive] = useState(0);
  return (
    <>
      <Header />
      <LogoStrip />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero__image" src={`${A}pharma-field-hero.png`} alt="Pharmaceutical sales professional arriving at a healthcare facility" />
          <div className="hero__copy">
            <h1 id="hero-title">Start or advance your career in pharmaceutical sales.</h1>
            <p className="lead">Jebb helps nurses, healthcare professionals, and sales reps land pharmaceutical sales rep roles—and advance in the field.</p>
            <Button />
          </div>
        </section>

        <section className="brand-strip" aria-label="What we help you do">
          <a href="#problem"><span>01</span><strong>Understand the field</strong><p>See how your sales or healthcare experience translates to pharmaceutical sales.</p><ArrowRight size={19} aria-hidden="true" /></a>
          <a href="#method"><span>02</span><strong>Build your strategy</strong><p>Position your strengths with the $100K Med Rep Method.</p><ArrowRight size={19} aria-hidden="true" /></a>
          <a href="#programs"><span>03</span><strong>Make your move</strong><p>Choose the right level of coaching for your next career step.</p><ArrowRight size={19} aria-hidden="true" /></a>
        </section>

        <section id="problem" className="problem section-pad">
          <div className="image-frame image-frame--portrait"><img src={`${A}pharma-nurse-work-from-home-v6-approved.png`} alt="Blonde healthcare professional planning her next career move at a laptop" /></div>
          <div className="problem__copy">
            <p className="eyebrow">Your background is not the problem</p>
            <h2>Pharma hiring managers can’t select what they can’t see.</h2>
            <p className="lead">You already know how to sell, care for people or teach complex ideas. Your application just isn’t translating those strengths into a pharma-ready story.</p>
            <ol className="number-list">
              <li><span>01</span><div><strong>You already sell</strong><p>But your results and relationship skills are not connected to pharmaceutical value.</p></div></li>
              <li><span>02</span><div><strong>You already understand healthcare</strong><p>But clinical experience alone does not prove you can win business.</p></div></li>
              <li><span>03</span><div><strong>You already make complexity simple</strong><p>But your resume and interviews do not make that advantage obvious.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="shift">
          <div className="section-pad shift__inner">
            <div>
              <p className="eyebrow eyebrow--light">Reposition—don’t restart</p>
              <h2>Your experience and skills are transferable.</h2>
              <p>Sales professionals bring prospecting, negotiation and quota discipline. Healthcare workers bring clinical fluency and trusted relationships. Educators know how to make complex information simple. The strategy is showing pharma employers exactly why that matters.</p>
            </div>
            <div className="shift-card" aria-label="From unclear positioning to a focused pharmaceutical sales strategy">
              <p>From</p>
              <ul><li>Generic applications</li><li>Unclear positioning</li><li>Scattered effort</li></ul>
              <span aria-hidden="true">→</span>
              <p>To</p>
              <ul><li>A focused target</li><li>A credible pharma story</li><li>Interview readiness</li></ul>
            </div>
          </div>
        </section>

        <section className="outcomes section-pad">
          <div className="outcomes__intro">
            <p className="eyebrow">What your next move is really for</p>
            <h2>More upside. More autonomy. A career with room to grow.</h2>
          </div>
          <div className="outcome-grid">
            <article><span>01</span><h3>Earning upside</h3><p>Compete for roles with salary, commission and benefits—without treating any result as guaranteed.</p></article>
            <article><span>02</span><h3>More control</h3><p>Pursue a field role with more ownership of your territory, schedule and professional relationships.</p></article>
            <article><span>03</span><h3>A better fit</h3><p>Use your science, relationship and communication strengths in a career built around influence.</p></article>
          </div>
          <div className="photo-band">
            <div className="photo-band__image"><img src={`${A}jebb-authentic-family-candid.jpg`} alt="Jebb Ruff in an authentic candid photograph" /></div>
            <blockquote><p>Pharmaceutical sales rewards people who understand the science, earn trust and make complex information simple.</p><cite>The Pharma Coach approach</cite></blockquote>
          </div>
        </section>

        <section id="method" className="method section-pad">
          <div className="method__title"><p className="eyebrow eyebrow--light">The $100K Med Rep Method</p><h2>From “Could I do this?” to a focused pharmaceutical-sales plan.</h2></div>
          <div className="method__steps">
            <article><b>01</b><h3>Diagnose fit</h3><p>Confirm that pharmaceutical sales matches how you think, work and want to live.</p></article>
            <article><b>02</b><h3>Translate</h3><p>Turn sales, clinical or teaching experience into a credible pharmaceutical story.</p></article>
            <article><b>03</b><h3>Get selected</h3><p>Build the access, interviews and execution discipline required to compete.</p></article>
          </div>
          <Button />
        </section>

        <section id="testimonials" className="testimonials section-pad" aria-labelledby="testimonials-title">
          <div className="testimonials__intro">
            <p className="eyebrow">Client stories</p>
            <h2 id="testimonials-title">What clients say about working with Jebb.</h2>
            <p>Real career moves from sales, nursing and medical-sales backgrounds.</p>
          </div>
          <div className="testimonials__grid">
            {testimonials.map((item, index) => <article key={item.name} className="testimonial">
              <span className="testimonial__number">0{index + 1}</span>
              <p className="testimonial__path">{item.path}</p>
              <blockquote>“{item.quote}”</blockquote>
              <p className="testimonial__story">{item.story}</p>
              <p className="testimonial__person"><strong>{item.name}</strong><span>{item.location}</span></p>
            </article>)}
          </div>
          <p className="testimonials__source">Excerpts and story summaries from <a href={testimonialsUrl}>The Pharma Coach’s client stories</a>. Individual results vary.</p>
        </section>

        <section id="programs" className="programs section-pad">
          <div className="centered-heading"><p className="eyebrow">Choose your support level</p><h2>Stop piecing together generic advice. Build one focused pharma strategy.</h2><p>Discuss the current program details and pricing on your call.</p></div>
          <div className="program-grid">
            {programs.map((p) => <article key={p.name} className={p.featured ? "program-card program-card--featured" : "program-card"}>
              <span>{p.tier}</span><h3>{p.name}</h3><strong>{p.price}</strong><p>{p.note}</p>
            </article>)}
          </div>
          <div className="programs__action"><Button /></div>
        </section>

        <section className="faq section-pad">
          <div><p className="eyebrow eyebrow--light">Before you decide</p><h2>Is pharmaceutical sales the right next step for you?</h2><p>Start with the questions sales professionals, healthcare workers and career changers ask when they are ready to enter or advance in the field.</p></div>
          <div className="accordion">
            {objections.map(([q, a], i) => <article key={q}>
              <button aria-expanded={active === i} onClick={() => setActive(active === i ? -1 : i)}><span>{q}</span><b aria-hidden="true">{active === i ? "−" : "+"}</b></button>
              {active === i && <p>{a}</p>}
            </article>)}
          </div>
        </section>

        <section className="final-cta section-pad">
          <div><p className="eyebrow">Your next chapter</p><h2>Ready to make your experience count in pharma?</h2><p>Find out whether pharmaceutical sales fits you—and what your clearest path into the field looks like.</p></div>
          <Button />
        </section>
      </main>
      <footer>
        <div className="footer__brand"><strong>THE PHARMA COACH</strong><p>Pharmaceutical-sales career coaching for professionals ready to reposition their experience and compete.</p></div>
        <div className="footer__links"><a href="https://www.thepharmacoach.com/about">About</a><a href="https://www.thepharmacoach.com/academy">Academy</a><a href="https://www.thepharmacoach.com/medical-sales-faq">FAQ</a><a href="https://www.thepharmacoach.com/pharmaceutical-sales-career-advice">Career advice</a></div>
        <div className="footer__links"><a href="https://www.instagram.com/pharma_coach_jebb_ruff_mba/">Instagram</a><a href="https://www.linkedin.com/company/the-pharma-coach/">LinkedIn</a></div>
        <p className="footer__legal">© The Pharma Coach, LLC. All rights reserved. Results vary. Earnings and placement examples are not guarantees.</p>
      </footer>
    </>
  );
}
