import { useState } from "react";

const A = "/assets/source/";

const programs = [
  { tier: "Break in", name: "Fast Track Academy", price: "$899", note: "Self-paced path to enter medical sales in 10 weeks.", href: "https://medrepcollege.com/fast-track-checkout", cta: "Get hired fast" },
  { tier: "Most popular", name: "Mastermind Accelerator", price: "$2,499", note: "Weekly structure, strategy, mentorship and accountability.", href: "https://medrepcollege.com/accelerator-checkout-page", cta: "Accelerate my career", featured: true },
  { tier: "Elite", name: "VIP Signature Access", price: "$5,799", note: "High-touch mentorship and a customized career strategy.", href: "https://medrepcollege.com/vip-access", cta: "Get VIP access" },
];

const objections = [
  ["I don’t have sales experience.", "The method starts with the experience you already have and teaches you how to position it for medical-sales hiring managers."],
  ["I can’t afford it right now.", "Choose the path that matches your current stage. Each option links to the current official enrollment page and its available payment terms."],
  ["I’ve already tried coaching and it didn’t work.", "This system is built around medical-sales access, interview strategy and accountable execution—not generic job-search advice."],
  ["What if I still don’t get hired?", "Use the diagnosis call to review fit, readiness and the right level of support before you enroll."],
];

function Button({ href, children, tone = "orange" }) {
  return <a className={`button button--${tone}`} href={href}>{children}<span aria-hidden="true">→</span></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["About", "https://www.thepharmacoach.com/about"],
    ["Academy", "https://www.thepharmacoach.com/academy"],
    ["Mastermind", "https://www.thepharmacoach.com/pricing-plans/pharmaceutical-sales-interview-help"],
    ["VIP Access", "https://www.thepharmacoach.com/pharmaceutical-sales-vip-mentorship"],
    ["Testimonials", "https://www.thepharmacoach.com/pharmaceutical-sales-success-stories"],
  ];
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="The Pharma Coach home"><strong>THE PHARMA</strong><span>COACH</span></a>
      <button className="menu-button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
        <span className="sr-only">Toggle navigation</span><i/><i/><i/>
      </button>
      <nav id="primary-nav" className={open ? "nav nav--open" : "nav"} aria-label="Primary navigation">
        {links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        <Button href="https://www.thepharmacoach.com/apply-for-pharmaceutical-sales-career-coaching">Apply now</Button>
      </nav>
    </header>
  );
}

export function App() {
  const [active, setActive] = useState(0);
  return (
    <>
      <Header />
      <main id="top">
        <section className="hero section-pad">
          <div className="hero__copy">
            <p className="eyebrow">Medical sales career coaching</p>
            <h1>Stop wondering how others break into medical sales. <em>Become one of them.</em></h1>
            <p className="lead">The pharmaceutical sales hiring process isn’t fair. Stop preparing like it is.</p>
            <p className="proof-line"><strong>650+ clients placed.</strong> A hiring-manager-built system for ambitious professionals ready to become the obvious choice.</p>
            <div className="button-row">
              <Button href="https://www.thepharmacoach.com/apply-for-pharmaceutical-sales-career-coaching">Ambitious professionals only</Button>
              <a className="text-link" href="https://medrepcollege.com/book-a-call-with-jebb">Book a diagnosis call <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="hero__visual">
            <img src={`${A}4310ea7e87b3a0cc-decoded.png`} alt="$100K Med Rep Method with Jebb Ruff" />
            <div className="hero__stamp"><strong>$100K</strong><span>career<br/>method</span></div>
          </div>
        </section>

        <section className="brand-strip" aria-label="Program focus">
          <span>Access</span><span>Strategy</span><span>Momentum</span><span>Medical sales</span><span>Career impact</span>
        </section>

        <section className="problem section-pad">
          <div className="image-frame image-frame--portrait"><img src={`${A}dda3946000c24b11-decoded.png`} alt="Professional frustrated by an unproductive job search" /></div>
          <div className="problem__copy">
            <p className="eyebrow">You’ve done everything right</p>
            <h2>So why aren’t you getting hired?</h2>
            <p className="lead">You tweaked your resume. You applied for three months. And you’re still waiting.</p>
            <ol className="number-list">
              <li><span>01</span><div><strong>Invisible applications</strong><p>Resume after resume disappears into the void. No callbacks.</p></div></li>
              <li><span>02</span><div><strong>First round and done</strong><p>You land the recruiter call, but never advance.</p></div></li>
              <li><span>03</span><div><strong>Grueling interview process</strong><p>Nobody explains what hiring managers actually need to hear.</p></div></li>
            </ol>
            <Button href="https://medrepcollege.com/access" tone="navy">Get the free interview guide</Button>
          </div>
        </section>

        <section className="shift">
          <div className="section-pad shift__inner">
            <div>
              <p className="eyebrow eyebrow--light">The shift</p>
              <h2>You’re working too hard to keep getting ignored.</h2>
              <p>Effort isn’t the problem. Strategy is. Get the positioning, clarity and certainty that turn your background into a credible medical-sales story.</p>
              <Button href="https://www.thepharmacoach.com/pricing-plans/pharmaceutical-sales-interview-help">Secure your $100K strategy</Button>
            </div>
            <img src={`${A}ac01166809d45e77-decoded.png`} alt="Before guidance and after mentorship comparison" />
          </div>
        </section>

        <section className="outcomes section-pad">
          <div className="outcomes__intro">
            <p className="eyebrow">A career with impact, income and independence</p>
            <h2>What life looks like with the #1 hiring-manager-built system.</h2>
          </div>
          <div className="outcome-grid">
            <article><span>01</span><h3>Positioning</h3><p>A resume and story that get noticed.</p></article>
            <article><span>02</span><h3>Certainty</h3><p>A networking plan that opens real doors.</p></article>
            <article><span>03</span><h3>Clarity</h3><p>Interview strategy that puts you in control.</p></article>
          </div>
          <div className="photo-band">
            <img src={`${A}570bca25963a7ea5-decoded.png`} alt="Jebb Ruff, The Pharma Coach" />
            <blockquote><p>“Stop applying blind. Start getting selected.”</p><cite>Jebb Ruff, MBA · The Pharma Coach</cite></blockquote>
          </div>
        </section>

        <section className="method section-pad">
          <div className="method__title"><p className="eyebrow eyebrow--light">The $100K Med Rep Method</p><h2>Three moves to your six-figure career.</h2></div>
          <div className="method__steps">
            <article><b>01</b><h3>Access</h3><p>Land more medical-sales interviews.</p></article>
            <article><b>02</b><h3>Strategy</h3><p>Secure a high-paying medical-sales job.</p></article>
            <article><b>03</b><h3>Momentum</h3><p>Build the skills to maximize your commission career.</p></article>
          </div>
          <Button href="https://medrepcollege.com/fast-track">Start the fast track</Button>
        </section>

        <section className="programs section-pad">
          <div className="centered-heading"><p className="eyebrow">Choose your path</p><h2>One investment. One career that pays you forever.</h2><p>Current program pricing and terms are confirmed on the linked official enrollment pages.</p></div>
          <div className="program-grid">
            {programs.map((p) => <article key={p.name} className={p.featured ? "program-card program-card--featured" : "program-card"}>
              <span>{p.tier}</span><h3>{p.name}</h3><strong>{p.price}</strong><p>{p.note}</p><Button href={p.href} tone={p.featured ? "blue" : "navy"}>{p.cta}</Button>
            </article>)}
          </div>
        </section>

        <section className="faq section-pad">
          <div><p className="eyebrow eyebrow--light">Before you decide</p><h2>Let’s clear the air.</h2><p>Use the questions to understand fit, then book a diagnosis call for personal guidance.</p></div>
          <div className="accordion">
            {objections.map(([q, a], i) => <article key={q}>
              <button aria-expanded={active === i} onClick={() => setActive(active === i ? -1 : i)}><span>{q}</span><b aria-hidden="true">{active === i ? "−" : "+"}</b></button>
              {active === i && <p>{a}</p>}
            </article>)}
          </div>
        </section>

        <section className="final-cta section-pad">
          <div><p className="eyebrow">Your next chapter</p><h2>Ready to stop guessing?</h2><p>Build the positioning, access and interview strategy to compete for the medical-sales career you want.</p></div>
          <Button href="https://medrepcollege.com/book-a-call-with-jebb">Schedule your diagnosis call</Button>
        </section>
      </main>
      <footer>
        <div className="footer__brand"><strong>THE PHARMA COACH</strong><p>Medical-sales career coaching built around access, strategy and momentum.</p></div>
        <div className="footer__links"><a href="https://www.thepharmacoach.com/about">About</a><a href="https://www.thepharmacoach.com/academy">Academy</a><a href="https://www.thepharmacoach.com/medical-sales-faq">FAQ</a><a href="https://www.thepharmacoach.com/pharmaceutical-sales-career-advice">Career advice</a></div>
        <div className="footer__links"><a href="https://www.instagram.com/pharma_coach_jebb_ruff_mba/">Instagram</a><a href="https://www.linkedin.com/company/the-pharma-coach/">LinkedIn</a><a href="mailto:Jebb@ThePharmaCoach.com">Email</a><a href="tel:713-480-2140">Call or text</a></div>
        <p className="footer__legal">© The Pharma Coach, LLC. All rights reserved. Results vary. Earnings and placement examples are not guarantees.</p>
      </footer>
    </>
  );
}
