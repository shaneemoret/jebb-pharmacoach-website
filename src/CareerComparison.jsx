const pharmaSource = "https://careers.amgen.com/en/job/new-york/specialty-representative-senior-specialty-representive-respiratory-biologic-poughkeepsie-ny/87/97936512208";
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
      <h2 id="career-potential-title">Make more money, without sacrificing lifestyle and family.</h2>
      <p className="comparison-note">That’s the goal. Compare the pay and the day-to-day demands to find a role that fits your life.</p>
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
      <p className="comparison-note">Colors identify different demands. Bar lengths are not scores or measured hours away.</p>
      <div className="demand-legend"><span className="demand-legend--schedule">Schedule</span><span className="demand-legend--away">Time away from home</span><span className="demand-legend--workload">Workload</span></div>
      <div className="demand-bars">
        {[
          {name: "Nursing", source: nursingSource, rows: ["Hospital shifts: nights & weekends possible", "On-call interruptions possible", "Patient care, standing & lifting"]},
          {name: "Traditional B2B sales", source: salesSource, rows: ["Many reps work 40+ hours", "Large territories: days or weeks away", "Prospecting & sales quotas"]},
          {name: "Pharma sales example", source: pharmaSource, rows: ["Provider visits & territory schedule", "Territory travel + occasional overnights", "Clinical knowledge & sales targets"]},
        ].map(item => <article className="demand-bar-row" key={item.name}>
          <h4><a href={item.source}>{item.name}</a></h4>
          <dl>{["Schedule", "Time away from home", "Workload"].map((label, index) => <div className={`demand-bar demand-bar--${index}`} key={label}><dt className="sr-only">{label}</dt><dd>{item.rows[index]}</dd></div>)}</dl>
        </article>)}
      </div>
      <p className="demands-takeaway">Before accepting an offer, ask: How many overnight trips? Any evenings or weekends? What are the territory and performance expectations?</p>
    </section>
    <p className="comparison-note comparison-note--footer">A career change does not guarantee higher pay, fewer hours, or less stress. Compare actual offers and schedules.</p>
  </section>;
}
