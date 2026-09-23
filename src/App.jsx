import { useState } from "react";
import { ArrowRight, List, X } from "@phosphor-icons/react";
import CareerComparison from "./CareerComparison";

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
    ["Testimonials", "#testimonials"],
    ["About", "#about"],
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
    <div className="logo-strip" role="img" aria-label={`Industry logos shown on The Pharma Coach's official site: ${officialLogos.map(([, name]) => name).join(", ")}`}>
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
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero__image" src={`${A}pharma-field-hero.png`} alt="Pharmaceutical sales professional arriving at a healthcare facility" />
          <div className="hero__copy">
            <h1 id="hero-title">Start or advance your career in pharmaceutical sales.</h1>
            <p className="lead">Jebb helps nurses, healthcare professionals, and sales reps land pharmaceutical sales rep roles—and advance in the field.</p>
            <Button />
          </div>
        </section>

        <LogoStrip />

        <section id="problem" className="problem section-pad">
          <div className="image-frame image-frame--portrait"><img src={`${A}pharma-nurse-work-from-home-v6-approved.png`} alt="Blonde healthcare professional planning her next career move at a laptop" /></div>
          <div className="problem__copy">
            <p className="eyebrow">Your background is not the problem</p>
            <h2>Get help landing your next pharma sales role.</h2>
            <p className="lead">Jebb helps you improve your résumé, build a networking strategy, and prepare for interviews. Show hiring managers how your sales or healthcare experience fits the job.</p>
            <ol className="number-list">
              <li><span>01</span><div><strong>Make your résumé relevant</strong><p>Show the experience and results that matter for the role you want.</p></div></li>
              <li><span>02</span><div><strong>Know who to reach out to</strong><p>Build a focused approach to connecting with recruiters and hiring managers.</p></div></li>
              <li><span>03</span><div><strong>Walk into interviews prepared</strong><p>Explain your strengths through clear examples from your own experience.</p></div></li>
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

        <CareerComparison />

        <section id="about" className="coach section-pad" aria-labelledby="coach-title">
          <div className="coach__portrait"><img src={`${A}jebb-official-about-portrait.webp`} alt="Jebb Ruff, The Pharma Coach" width="800" height="971" loading="lazy" /></div>
          <div className="coach__copy">
            <p className="eyebrow">Meet your coach</p>
            <h2 id="coach-title">Jebb Ruff, MBA</h2>
            <p className="coach__role">Medical sales hiring manager, sales trainer, and career coach.</p>
            <p>Jebb built his career in pharmaceutical, medical device, and biotech sales. He has spent more than a decade interviewing and hiring medical sales professionals, giving him a view of what employers look for when they choose a candidate.</p>
            <p>He also knows what it feels like to be on the outside: his own move into the industry took more than a year. Today, he helps professionals prepare for their next role through interview planning and practical sales coaching.</p>
            <dl className="coach__credentials">
              <div><dt>Since 2001</dt><dd>Career in medical sales</dd></div>
              <div><dt>19 awards</dt><dd>President’s Club recognition</dd></div>
              <div><dt>10+ years</dt><dd>Interviewing and hiring reps</dd></div>
            </dl>
            <a className="coach__source" href="https://www.thepharmacoach.com/about">Read Jebb’s full background<ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <section id="method" className="method section-pad">
          <div className="method__title"><p className="eyebrow eyebrow--light">The $100K Med Rep Method</p><h2>How it works.</h2></div>
          <div className="method__steps">
            <article><b>01</b><p className="method__stage">Access</p><h3>Understand the field</h3><p>Learn what hiring managers look for and how your sales or healthcare experience fits a pharmaceutical sales role.</p></article>
            <article><b>02</b><p className="method__stage">Strategy</p><h3>Build your strategy</h3><p>Focus your résumé, networking, and interview preparation on the roles you want.</p></article>
            <article><b>03</b><p className="method__stage">Momentum</p><h3>Make your move</h3><p>Put your plan into practice with the level of training and coaching that fits your next career step.</p></article>
          </div>
          <Button />
        </section>

        <section id="testimonials" className="testimonials section-pad" aria-labelledby="testimonials-title">
          <div className="testimonials__intro">
            <h2 id="testimonials-title">Client results</h2>
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
