import { useState } from "react";
import { ArrowRight, List, X } from "@phosphor-icons/react";

const A = `${import.meta.env.BASE_URL}assets/source/`;
const bookingUrl = "https://medrepcollege.com/book-a-call-with-jebb";

const programs = [
  { tier: "Self-paced", name: "Fast Track Academy", price: "$899", note: "A focused path for turning your current experience into a pharmaceutical-sales job search.", href: "https://medrepcollege.com/fast-track-checkout", cta: "Start my pharma path" },
  { tier: "Most popular", name: "Mastermind Accelerator", price: "$2,499", note: "Weekly strategy, mentorship and accountability as you pursue pharmaceutical-sales roles.", href: "https://medrepcollege.com/accelerator-checkout-page", cta: "Get guided support", featured: true },
  { tier: "High touch", name: "VIP Signature Access", price: "$5,799", note: "A customized pharmaceutical-sales career strategy with direct, high-touch mentorship.", href: "https://medrepcollege.com/vip-access", cta: "Explore VIP support" },
];

const objections = [
  ["Do I need pharmaceutical sales experience?", "No. Sales, healthcare, teaching and other customer-facing backgrounds can bring transferable strengths. The work is showing how your results, relationships and ability to learn complex information fit a pharmaceutical sales role."],
  ["How does my sales or healthcare experience translate to pharma?", "Sales professionals can show prospecting, relationship-building and performance results. Healthcare professionals can show clinical fluency, provider communication and patient education. Both need a clear story that connects those strengths to pharmaceutical sales."],
  ["What if I have no formal sales experience?", "You are not necessarily starting from zero. Teaching, patient education, care coordination and other roles can demonstrate communication, influence and follow-through. Coaching helps you identify credible examples and present them in the language hiring managers expect."],
  ["How do I know pharmaceutical sales is the right fit for me?", "Consider whether you enjoy science, relationship-building, explaining complex information and being accountable for commercial results. A career diagnosis can help you assess the role, the lifestyle and your next step before you apply."],
  ["Why pharma instead of medical device sales?", "Pharma often suits people drawn to clinical science, mechanisms of action and long-term provider relationships. Device sales is typically more procedure- and engineering-oriented. The right choice depends on how you think, work and want to spend your day."],
];

function Button({ href, children, tone = "navy" }) {
  return <a className={`button button--${tone}`} href={href}>{children}<ArrowRight size={18} weight="regular" aria-hidden="true" /></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Programs", "#programs"],
    ["The Method", "#method"],
    ["Why Pharma", "#why-pharma"],
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
        <Button href={bookingUrl}>Schedule a call</Button>
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
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero__image" src={`${A}pharma-field-hero.png`} alt="Pharmaceutical sales professional arriving at a healthcare facility" />
          <div className="hero__copy">
            <p className="eyebrow eyebrow--light">The Pharma Coach <span aria-hidden="true">/</span> Med Rep College</p>
            <h1 id="hero-title">Start or advance your career in pharmaceutical sales.</h1>
            <p className="lead">Practical coaching for nurses, healthcare professionals, and sales reps making their next move.</p>
            <Button href={bookingUrl} tone="gold">Schedule a call</Button>
          </div>
        </section>

        <section className="brand-strip" aria-label="What we help you do">
          <a href="#why-pharma"><span>01</span><strong>Understand the field</strong><p>See how your sales or healthcare experience translates to pharmaceutical sales.</p><ArrowRight size={19} aria-hidden="true" /></a>
          <a href="#method"><span>02</span><strong>Build your strategy</strong><p>Position your strengths with the $100K Med Rep Method.</p><ArrowRight size={19} aria-hidden="true" /></a>
          <a href="#programs"><span>03</span><strong>Make your move</strong><p>Choose the right level of coaching for your next career step.</p><ArrowRight size={19} aria-hidden="true" /></a>
        </section>

        <section id="why-pharma" className="why-pharma section-pad">
          <div className="why-pharma__intro">
            <p className="eyebrow">Why Pharma Sales</p>
            <h2>Bring your experience into a bigger career move.</h2>
            <p className="lead">Pharma sales gives people from sales and healthcare backgrounds a way to use their existing strengths in a career built around education, influence and trusted provider relationships.</p>
          </div>
          <div className="why-pharma__reasons">
            <article><span>01</span><div><h3>Use your existing advantage</h3><p>Bring sales results or clinical knowledge into relevant conversations with healthcare professionals.</p></div></article>
            <article><span>02</span><div><h3>Expand your earning opportunity</h3><p>Pursue roles that can combine salary, performance incentives and benefits while building a long-term commercial career.</p></div></article>
            <article><span>03</span><div><h3>Create more autonomy</h3><p>Move toward a field-based career with greater ownership of your schedule, territory and professional relationships.</p></div></article>
            <article><span>04</span><div><h3>Move beyond a stalled path</h3><p>Pursue a new challenge or your next level in healthcare without staying tied to the role that no longer fits.</p></div></article>
          </div>
        </section>

        <section className="problem section-pad">
          <div className="image-frame image-frame--portrait"><img src={`${A}pharma-hcp-conversation.png`} alt="Pharmaceutical field representative in a professional conversation with a healthcare provider" /></div>
          <div className="problem__copy">
            <p className="eyebrow">Your background is not the problem</p>
            <h2>Pharma hiring managers can’t select what they can’t see.</h2>
            <p className="lead">You already know how to sell, care for people or teach complex ideas. Your application just isn’t translating those strengths into a pharma-ready story.</p>
            <ol className="number-list">
              <li><span>01</span><div><strong>You already sell</strong><p>But your results and relationship skills are not connected to pharmaceutical value.</p></div></li>
              <li><span>02</span><div><strong>You already understand healthcare</strong><p>But clinical experience alone does not prove you can win business.</p></div></li>
              <li><span>03</span><div><strong>You already make complexity simple</strong><p>But your resume and interviews do not make that advantage obvious.</p></div></li>
            </ol>
            <Button href="https://medrepcollege.com/access" tone="navy">Translate my experience</Button>
          </div>
        </section>

        <section className="shift">
          <div className="section-pad shift__inner">
            <div>
              <p className="eyebrow eyebrow--light">Reposition—don’t restart</p>
              <h2>Your experience already belongs in the conversation.</h2>
              <p>Sales professionals bring prospecting, negotiation and quota discipline. Healthcare workers bring clinical fluency and trusted relationships. Educators know how to make complex information simple. The strategy is showing pharma employers exactly why that matters.</p>
              <Button href="https://www.thepharmacoach.com/pricing-plans/pharmaceutical-sales-interview-help">See how my background fits</Button>
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
            <img src={`${A}jebb-executive-portrait-review.png`} alt="Executive-style portrait of Jebb Ruff" />
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
          <Button href="https://medrepcollege.com/fast-track">Build my pharma plan</Button>
        </section>

        <section id="programs" className="programs section-pad">
          <div className="centered-heading"><p className="eyebrow">Choose your support level</p><h2>Stop piecing together generic advice. Build one focused pharma strategy.</h2><p>Current program pricing and terms are confirmed on the linked official enrollment pages.</p></div>
          <div className="program-grid">
            {programs.map((p) => <article key={p.name} className={p.featured ? "program-card program-card--featured" : "program-card"}>
              <span>{p.tier}</span><h3>{p.name}</h3><strong>{p.price}</strong><p>{p.note}</p><Button href={p.href} tone={p.featured ? "blue" : "navy"}>{p.cta}</Button>
            </article>)}
          </div>
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
          <Button href={bookingUrl}>Book my career diagnosis</Button>
        </section>
      </main>
      <footer>
        <div className="footer__brand"><strong>THE PHARMA COACH</strong><p>Pharmaceutical-sales career coaching for professionals ready to reposition their experience and compete.</p></div>
        <div className="footer__links"><a href="https://www.thepharmacoach.com/about">About</a><a href="https://www.thepharmacoach.com/academy">Academy</a><a href="https://www.thepharmacoach.com/medical-sales-faq">FAQ</a><a href="https://www.thepharmacoach.com/pharmaceutical-sales-career-advice">Career advice</a></div>
        <div className="footer__links"><a href="https://www.instagram.com/pharma_coach_jebb_ruff_mba/">Instagram</a><a href="https://www.linkedin.com/company/the-pharma-coach/">LinkedIn</a><a href="mailto:Jebb@ThePharmaCoach.com">Email</a><a href="tel:713-480-2140">Call or text</a></div>
        <p className="footer__legal">© The Pharma Coach, LLC. All rights reserved. Results vary. Earnings and placement examples are not guarantees.</p>
      </footer>
    </>
  );
}
