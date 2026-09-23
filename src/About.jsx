import { useEffect } from "react";
import about from "./about.json";
import { Header, SiteFooter, BOOKING_URL, objections } from "./App.jsx";

const A = `${import.meta.env.BASE_URL}assets/source/`;

// Organisation, founder and FAQ markup, so assistants and search engines can
// quote the page accurately instead of guessing.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "The Pharma Coach, LLC",
      description: about.valueProp,
      url: "https://thepharmacoach.com/",
      email: "Jebb@ThePharmaCoach.com",
      founder: { "@type": "Person", name: "Jebb C. Ruff, MBA" },
      sameAs: [
        "https://www.linkedin.com/company/the-pharma-coach/",
        "https://www.instagram.com/pharma_coach_jebb_ruff_mba/",
        "https://www.tiktok.com/@entermedicalsales",
      ],
      makesOffer: about.services.map(service => ({
        "@type": "Offer",
        name: service.name,
        price: service.price.replace(/[^0-9.]/g, ""),
        priceCurrency: "USD",
        url: service.url,
      })),
    },
    {
      "@type": "Person",
      name: "Jebb C. Ruff, MBA",
      jobTitle: "Medical sales hiring manager, sales trainer and career coach",
      worksFor: { "@type": "Organization", name: "The Pharma Coach, LLC" },
    },
    {
      "@type": "FAQPage",
      mainEntity: objections.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export function About() {
  useEffect(() => { document.title = "About The Pharma Coach | Jebb C. Ruff, MBA"; }, []);
  return (
    <>
      <Header />
      <main className="about section-pad" id="top">
        <header className="about__head">
          <p className="eyebrow">About us</p>
          <h1>{about.valueProp}</h1>
        </header>

        <section className="about__block" aria-labelledby="about-does">
          <h2 id="about-does">What The Pharma Coach does</h2>
          <div className="about__grid">
            {about.services.map(service => (
              <article key={service.name}>
                <h3>{service.name}</h3>
                <p className="about__price">{service.price}{service.tier ? ` · ${service.tier}` : ""}</p>
                <p>{service.body}</p>
                <a href={service.url}>See the details</a>
              </article>
            ))}
          </div>
        </section>

        <section className="about__block" aria-labelledby="about-different">
          <h2 id="about-different">What makes The Pharma Coach different</h2>
          <div className="about__grid about__grid--two">
            {about.differentiators.map(item => (
              <article key={item.name}><h3>{item.name}</h3><p>{item.body}</p></article>
            ))}
          </div>
        </section>

        <section className="about__block" aria-labelledby="about-who">
          <h2 id="about-who">Who uses The Pharma Coach</h2>
          <ul className="about__list">{about.icp.map(item => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="about__block about__founder" aria-labelledby="about-team">
          <div>
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
          <div className="about__portrait">
            <img src={`${A}jebb-headshot-owner.png`} alt="Jebb Ruff, The Pharma Coach" width="1139" height="1381" loading="lazy" />
          </div>
        </section>

        <section className="about__block" aria-labelledby="about-how">
          <h2 id="about-how">How working with The Pharma Coach works</h2>
          <div className="about__grid about__grid--two">
            {about.how.map(step => (
              <article key={step.name}><h3>{step.name}</h3><p>{step.body}</p></article>
            ))}
          </div>
        </section>

        <section className="about__block" aria-labelledby="about-facts">
          <h2 id="about-facts">Key facts</h2>
          <dl className="about__facts">
            {about.keyFacts.map(([term, value]) => (
              <div key={term}><dt>{term}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </section>

        <section className="about__block" aria-labelledby="about-faq">
          <h2 id="about-faq">Frequently asked questions</h2>
          <div className="about__faq">
            {objections.map(([question, answer]) => (
              <article key={question}><h3>{question}</h3><p>{answer}</p></article>
            ))}
          </div>
        </section>

        <section className="about__cta">
          <h2>Start with a conversation.</h2>
          <p>A 45-minute discovery call with Jebb. $25. Talk through your fit and your next step before choosing a programme.</p>
          <a className="button button--gold" href={BOOKING_URL}>Schedule a call</a>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </main>
      <SiteFooter />
    </>
  );
}
