const pharmaSource = "https://careers.amgen.com/en/job/new-york/specialty-representative-senior-specialty-representive-respiratory-biologic-poughkeepsie-ny/87/97936512208";
const nursingSource = "https://www.bls.gov/ooh/healthcare/registered-nurses.htm";
const salesSource = "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm";
const salaries = [
  { name: "Nontechnical B2B sales", detail: "Wholesale and manufacturing; excludes technical/scientific products", value: 72080 },
  { name: "Registered nursing", detail: "Registered nurses across work settings", value: 97550 },
  { name: "Technical & scientific sales", detail: "Includes pharmaceuticals and other technical products—not pharma alone", value: 104920 },
];
const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function CareerComparison() {
  return <section id="career-potential" className="career-comparison section-pad" aria-labelledby="career-potential-title">
    <div className="career-comparison__heading">
      <h2 id="career-potential-title">Compare the paycheck.<br />And what the job asks of you.</h2>
    </div>
    <div className="earnings-chart">
      <div className="earnings-chart__intro"><p>U.S. median annual wages, May 2025.</p><p className="comparison-note">Technical/scientific sales includes pharma and other products—not a pharma-only salary estimate.</p></div>
      <div className="earnings-chart__ranges">
        {salaries.map((salary, index) => <div className={`salary-range salary-median salary-median--${index}`} key={salary.name}>
          <h4>{salary.name}</h4>
          <p className="salary-range__value">{money(salary.value)}</p>
          <div className="salary-range__track" aria-hidden="true"><div style={{ left: 0, width: `${salary.value / 120000 * 100}%` }} /></div>
        </div>)}
        <div className="earnings-chart__axis" aria-hidden="true"><span>$0</span><span>$60k</span><span>$120k</span></div>
        <p className="comparison-note">BLS: <a href={nursingSource}>nursing</a> / <a href={salesSource}>wholesale and manufacturing sales</a>. Medians—not starting salaries or guaranteed income.</p>
      </div>
    </div>
    <details className="workday-details">
      <summary>What changes in your workday?</summary>
      <div className="schedule-comparison__examples schedule-comparison__examples--three">
        <article><p className="eyebrow">Nursing</p><h4>Patient care.<br />Physical demands.</h4><p>Bedside work can mean lifting patients, prolonged standing, and nights, weekends, or holidays. Office and school nursing can have more regular hours.</p><a href={nursingSource}>Nursing work environment</a></article>
        <article><p className="eyebrow">Traditional B2B sales</p><h4>Prospecting.<br />Quota pressure.</h4><p>Customer acquisition, sales targets, and territory travel. Many wholesale/manufacturing reps work more than 40 hours a week.</p><a href={salesSource}>Sales work environment</a></article>
        <article><p className="eyebrow">Pharma sales example</p><h4>Clinical conversations.<br />Territory ownership.</h4><p>Amgen’s specialty role combines provider relationships, performance targets, and territory travel, including occasional overnight training and meetings.</p><a href={pharmaSource}>Example pharma role</a></article>
      </div>
    </details>
    <p className="comparison-note comparison-note--footer">A career change does not guarantee higher pay, fewer hours, or less stress. Compare actual offers and schedules.</p>
  </section>;
}
