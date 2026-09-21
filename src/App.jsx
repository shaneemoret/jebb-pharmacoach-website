import { useState } from "react";

const A = `${import.meta.env.BASE_URL}assets/source/`;

const programs = [
  { tier: "Self-paced", name: "Fast Track Academy", price: "$899", note: "A focused path for turning your current experience into a pharmaceutical-sales job search.", href: "https://medrepcollege.com/fast-track-checkout", cta: "Start my pharma path" },
  { tier: "Most popular", name: "Mastermind Accelerator", price: "$2,499", note: "Weekly strategy, mentorship and accountability as you pursue pharmaceutical-sales roles.", href: "https://medrepcollege.com/accelerator-checkout-page", cta: "Get guided support", featured: true },
  { tier: "High touch", name: "VIP Signature Access", price: "$5,799", note: "A customized pharmaceutical-sales career strategy with direct, high-touch mentorship.", href: "https://medrepcollege.com/vip-access", cta: "Explore VIP support" },
];

const objections = [
  ["Do I need pharmaceutical or healthcare experience?", "No. Jebb identified strong-fit clients in traditional sales, healthcare and education. The work is translating the experience you already have into the evidence pharmaceutical hiring managers need to see."],
  ["I’m a nurse or healthcare professional. How does my background translate?", "Your clinical fluency, provider relationships, patient communication and ability to make complex information understandable can become a strong pharmaceutical-sales story. The missing piece is commercial positioning and sales strategy."],
  ["I already work in sales. Why am I not breaking in?", "Selling skill alone does not explain your fit for pharma. You need a focused story that connects your results, relationship skills, degree and ability to learn clinical information to the role you want."],
  ["How do I know pharma fits me better than medical device?", "Pharma often fits people who enjoy science, clinical relationships and making complex information simple. Device tends to reward a more engineering- and procedure-oriented mindset. A diagnosis call helps you choose the path before you chase the wrong role."],
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
            <p className="eyebrow">Pharmaceutical sales career coaching</p>
            <h1>You’re not starting over. <em>You’re repositioning for pharmaceutical sales.</em></h1>
            <p className="lead">For sales professionals, nurses, healthcare workers and educators ready for more income opportunity, autonomy and work-life balance.</p>
            <p className="proof-line"><strong>650+ clients placed.</strong> Learn how to make your sales, clinical or teaching background matter to pharmaceutical hiring managers.</p>
            <div className="button-row">
              <Button href="https://www.thepharmacoach.com/apply-for-pharmaceutical-sales-career-coaching">Find my pharma path</Button>
              <a className="text-link" href="https://medrepcollege.com/book-a-call-with-jebb">Book a career diagnosis <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="hero__visual">
            <img src={`${A}4310ea7e87b3a0cc-decoded.png`} alt="$100K Med Rep Method with Jebb Ruff" />
            <div className="hero__stamp"><strong>$100K</strong><span>career<br/>method</span></div>
          </div>
        </section>

        <section className="brand-strip" aria-label="Program focus">
          <span>Sales professionals</span><span>Nurses</span><span>Healthcare workers</span><span>Educators</span><span>Pharma reps</span>
        </section>

        <section className="problem section-pad">
          <div className="image-frame image-frame--portrait"><img src={`${A}dda3946000c24b11-decoded.png`} alt="Professional frustrated by an unproductive job search" /></div>
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
            <img src={`${A}ac01166809d45e77-decoded.png`} alt="Before guidance and after mentorship comparison" />
          </div>
        </section>

        <section className="outcomes section-pad">
          <div className="outcomes__intro">
            <p className="eyebrow">What the career change is really for</p>
            <h2>More upside. More autonomy. A career beyond shifts and burnout.</h2>
          </div>
          <div className="outcome-grid">
            <article><span>01</span><h3>Earning upside</h3><p>Compete for roles with salary, commission and benefits—without treating any result as guaranteed.</p></article>
            <article><span>02</span><h3>More control</h3><p>Pursue a field known for greater schedule autonomy than rigid shifts or constant patient load.</p></article>
            <article><span>03</span><h3>A better fit</h3><p>Use your science, relationship and communication strengths in a career built around influence.</p></article>
          </div>
          <div className="photo-band">
            <img src={`${A}570bca25963a7ea5-decoded.png`} alt="Jebb Ruff, The Pharma Coach" />
            <blockquote><p>Pharmaceutical sales rewards people who understand the science, earn trust and make complex information simple.</p><cite>The Pharma Coach approach</cite></blockquote>
          </div>
        </section>

        <section className="method section-pad">
          <div className="method__title"><p className="eyebrow eyebrow--light">The $100K Med Rep Method</p><h2>From “Could I do this?” to a focused pharmaceutical-sales plan.</h2></div>
          <div className="method__steps">
            <article><b>01</b><h3>Diagnose fit</h3><p>Confirm that pharmaceutical sales matches how you think, work and want to live.</p></article>
            <article><b>02</b><h3>Translate</h3><p>Turn sales, clinical or teaching experience into a credible pharmaceutical story.</p></article>
            <article><b>03</b><h3>Get selected</h3><p>Build the access, interviews and execution discipline required to compete.</p></article>
          </div>
          <Button href="https://medrepcollege.com/fast-track">Build my pharma plan</Button>
        </section>

        <section className="programs section-pad">
          <div className="centered-heading"><p className="eyebrow">Choose your support level</p><h2>Stop piecing together generic advice. Build one focused pharma strategy.</h2><p>Current program pricing and terms are confirmed on the linked official enrollment pages.</p></div>
          <div className="program-grid">
            {programs.map((p) => <article key={p.name} className={p.featured ? "program-card program-card--featured" : "program-card"}>
              <span>{p.tier}</span><h3>{p.name}</h3><strong>{p.price}</strong><p>{p.note}</p><Button href={p.href} tone={p.featured ? "blue" : "navy"}>{p.cta}</Button>
            </article>)}
          </div>
        </section>

        <section className="faq section-pad">
          <div><p className="eyebrow eyebrow--light">Before you decide</p><h2>Does your experience fit pharma?</h2><p>Start with the questions people in sales, healthcare and education ask most often, then book a career diagnosis for personal guidance.</p></div>
          <div className="accordion">
            {objections.map(([q, a], i) => <article key={q}>
              <button aria-expanded={active === i} onClick={() => setActive(active === i ? -1 : i)}><span>{q}</span><b aria-hidden="true">{active === i ? "−" : "+"}</b></button>
              {active === i && <p>{a}</p>}
            </article>)}
          </div>
        </section>

        <section className="final-cta section-pad">
          <div><p className="eyebrow">Your next chapter</p><h2>Ready to make your experience count in pharma?</h2><p>Find out whether pharmaceutical sales fits you—and what your clearest path into the field looks like.</p></div>
          <Button href="https://medrepcollege.com/book-a-call-with-jebb">Book my career diagnosis</Button>
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
