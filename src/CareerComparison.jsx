const pharmaSource = "https://careers.amgen.com/en/job/new-york/specialty-representative-senior-specialty-representive-respiratory-biologic-poughkeepsie-ny/87/97936512208";
import { Clock, House, Lightning } from "@phosphor-icons/react";
const nursingSource = "https://www.bls.gov/ooh/healthcare/registered-nurses.htm";
const salesSource = "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm";
const salaries = [
  { name: "Nontechnical B2B sales", detail: "Wholesale and manufacturing; excludes technical/scientific products", value: 72080 },
  { name: "Registered nursing", detail: "Registered nurses across work settings", value: 97550 },
  { name: "Technical & scientific sales", detail: "Includes pharmaceuticals and other technical products, not pharma alone", value: 104920 },
];
const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function CareerComparison() {
  return <section id="career-potential" className="career-comparison section-pad" aria-labelledby="career-potential-title">
    <div className="career-comparison__heading">
      <h2 id="career-potential-title">Compare the paycheck.<br />And what the job asks of you.</h2>
    </div>
    <div className="earnings-chart">
      <div className="earnings-chart__intro"><p>U.S. median annual wages, May 2025.</p><p className="comparison-note">Technical/scientific sales includes pharma and other products. This is not a pharma-only salary estimate.</p></div>
      <div className="earnings-chart__ranges">
        {salaries.map((salary, index) => <div className={`salary-range salary-median salary-median--${index}`} key={salary.name}>
          <h4>{salary.name}</h4>
          <p className="salary-range__value">{money(salary.value)}</p>
          <div className="salary-range__track" aria-hidden="true"><div style={{ left: 0, width: `${salary.value / 120000 * 100}%` }} /></div>
        </div>)}
        <div className="earnings-chart__axis" aria-hidden="true"><span>$0</span><span>$60k</span><span>$120k</span></div>
        <p className="comparison-note">BLS: <a href={nursingSource}>nursing</a> / <a href={salesSource}>wholesale and manufacturing sales</a>. These are medians, not starting salaries or guaranteed income.</p>
      </div>
    </div>
    <section className="demands-comparison" aria-labelledby="demands-title">
      <h3 id="demands-title">What does it ask of your time?</h3>
      <p className="comparison-note">Compare the trade-offs, not just the paycheck. These are work patterns, not measured scores or guaranteed hours at home.</p>
      <div className="demands-grid">
        {[
          {name: "Nursing", source: nursingSource, rows: ["Hospital shifts can include nights, weekends and holidays.", "On-call work can interrupt time at home; schedules vary by setting.", "Patient care, prolonged standing and lifting."]},
          {name: "Traditional B2B sales", source: salesSource, rows: ["Many wholesale/manufacturing reps work more than 40 hours a week.", "Large territories can require days or weeks away from home.", "Prospecting, sales quotas and customer needs."]},
          {name: "Pharma sales example", source: pharmaSource, rows: ["Provider visits and territory responsibilities shape the workday.", "This Amgen role includes travel and occasional overnight meetings or training.", "Performance targets, clinical knowledge and provider relationships."]},
        ].map(item => <article className="demands-card" key={item.name}>
          <h4>{item.name}</h4>
          <dl>{[[Clock, "Schedule"], [House, "Time away from home"], [Lightning, "Job demands"]].map(([Icon, label], index) => <div key={label}><dt><Icon size={24} aria-hidden="true" /><span>{label}</span></dt><dd>{item.rows[index]}</dd></div>)}</dl>
          <a href={item.source}>See source</a>
        </article>)}
      </div>
      <p className="demands-takeaway">Before accepting an offer, ask: How many overnight trips? Any evenings or weekends? What are the territory and performance expectations?</p>
    </section>
    <p className="comparison-note comparison-note--footer">A career change does not guarantee higher pay, fewer hours, or less stress. Compare actual offers and schedules.</p>
  </section>;
}
