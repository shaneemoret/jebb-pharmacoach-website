import { useEffect } from "react";
import about from "./about.json";
import { Header, SiteFooter, BOOKING_URL, objections } from "./App.jsx";

const A = `${import.meta.env.BASE_URL}assets/source/`;
const BASE = import.meta.env.BASE_URL;

export function About() {
  useEffect(() => { document.title = "About The Pharma Coach | Jebb C. Ruff, MBA"; }, []);
  return (
    <>
      <Header />
      <main className="about" id="top">
        <section className="about-hero">
          <div className="about-hero__copy">
            <p className="eyebrow eyebrow--light">About The Pharma Coach</p>
            <h1>{about.headline}</h1>
            <p className="about-hero__deck">{about.valueProp}</p>
            <a className="button button--gold" href={BOOKING_URL}>Schedule a call</a>
          </div>
          <div className="about-hero__portrait">
            <img src={`${A}jebb-headshot-owner.png`} alt="Jebb Ruff, The Pharma Coach" width="1139" height="1381" fetchPriority="high" />
          </div>
          <dl className="about-hero__stats">
            {about.credentials.map(([figure, label]) => (
              <div key={label}><dt>{figure}</dt><dd>{label}</dd></div>
            ))}
          </dl>
        </section>

        <section className="about-band about-band--paper" aria-labelledby="about-does">
          <h2 id="about-does">What The Pharma Coach does</h2>
          <div className="about-cards">
            {about.services.map(service => (
              <article key={service.name}>
                <p className="about-cards__price">{service.price}</p>
                {service.tier && <p className="about-cards__tier">{service.tier}</p>}
                <h3>{service.name}</h3>
                <p>{service.body}</p>
                <a href={service.path ? `${BASE}${service.path}/` : service.url}>See the details</a>
              </article>
            ))}
          </div>
        </section>

        <section className="about-band about-band--navy" aria-labelledby="about-different">
          <h2 id="about-different">What makes The Pharma Coach different</h2>
          <div className="about-steps">
            {about.differentiators.map((item, index) => (
              <article key={item.name}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <h3>{item.name}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-band about-band--paper" aria-labelledby="about-who">
          <h2 id="about-who">Who uses The Pharma Coach</h2>
          <div className="about-who">
            {about.icp.map(item => <article key={item}><p>{item}</p></article>)}
          </div>
        </section>

        <section className="about-band about-band--white about-founder" aria-labelledby="about-team">
          <div className="about-founder__copy">
            <h2 id="about-team">The team behind The Pharma Coach</h2>
            <h3>Jebb C. Ruff, MBA, founder</h3>
            <p>Jebb has worked in medical sales since 2001 and carried a bag before he coached anyone. He sold dermatology products for Allergan, and across his selling career he has earned 19 President's Club awards.</p>
            <p>For more than 10 years he has been on the hiring side, interviewing and hiring medical sales representatives. That is the perspective the coaching is built on: what a hiring manager is actually reading for, and why strong candidates get passed over.</p>
            <p>The Pharma Coach is Jebb's own practice. Coaching is delivered by him rather than by an account team.</p>
            <p className="about__social">
              <a href="https://www.linkedin.com/company/the-pharma-coach/">LinkedIn</a>
              <a href="https://www.instagram.com/pharma_coach_jebb_ruff_mba/">Instagram</a>
              <a href="https://www.tiktok.com/@entermedicalsales">TikTok</a>
              <a href="mailto:Jebb@ThePharmaCoach.com">Jebb@ThePharmaCoach.com</a>
            </p>
          </div>
          <ol className="about-how">
            {about.how.map((step, index) => (
              <li key={step.name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{step.name}</h3><p>{step.body}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-band about-band--paper" aria-labelledby="about-facts">
          <h2 id="about-facts">Key facts</h2>
          <dl className="about-facts">
            {about.keyFacts.map(([term, value]) => (
              <div key={term}><dt>{term}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </section>

        <section className="about-band about-band--paper about-band--tight" aria-labelledby="about-faq">
          <h2 id="about-faq">Frequently asked questions</h2>
          <div className="about-faq">
            {objections.map(([question, answer]) => (
              <article key={question}><h3>{question}</h3><p>{answer}</p></article>
            ))}
          </div>
        </section>

        <section className="about-band about-band--navy about-cta">
          <div>
            <h2>Start with a conversation.</h2>
            <p>A 45-minute discovery call with Jebb. $25. Talk through your fit and your next step before choosing a programme.</p>
          </div>
          <a className="button button--gold" href={BOOKING_URL}>Schedule a call</a>
        </section>

        {/* Organization and founder data are generated in the initial HTML. */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: objections.map(([question, answer]) => ({
            '@type': 'Question', name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        })}</script>
      </main>
      <SiteFooter />
    </>
  );
}
