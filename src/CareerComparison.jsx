const pharmaSource = "https://careers.amgen.com/en/job/new-york/specialty-representative-senior-specialty-representive-respiratory-biologic-poughkeepsie-ny/87/97936512208";
const nursingSource = "https://www.bls.gov/ooh/healthcare/registered-nurses.htm";
const salesSource = "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm";
const salaries = [
  { name: "Nontechnical B2B sales", detail: "Wholesale and manufacturing; excludes technical/scientific products", value: 72080 },
  { name: "Registered nursing", detail: "Registered nurses across work settings", value: 97550 },
  { name: "Technical & scientific sales", detail: "Includes pharmaceuticals and other technical products, not pharma alone", value: 104920 },
];
const roles = [
  { name: "Nursing", source: nursingSource },
  { name: "Traditional B2B sales", source: salesSource },
  { name: "Pharma sales example", source: pharmaSource, focus: true },
];
const demands = [
  ["Schedule", ["Hospital shifts, including nights and weekends", "Many reps work more than 40 hours a week", "Provider visits on a territory schedule"]],
  ["Time away from home", ["On-call work can interrupt time at home", "Large territories can mean days or weeks away", "Territory travel with occasional overnights"]],
  ["Workload", ["Patient care, prolonged standing and lifting", "Prospecting and sales quotas", "Clinical knowledge and performance targets"]],
];
const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function CareerComparison() {
  return <section id="career-potential" className="career-comparison section-pad" aria-labelledby="career-potential-title">
    <div className="career-comparison__heading">
      <h2 id="career-potential-title">Make more money, without sacrificing lifestyle and family.</h2>
      <p className="career-comparison__deck">That’s the goal. Compare the pay and the day-to-day demands to find a role that fits your life.</p>
    </div>
    <div className="earnings-chart">
      <div className="earnings-chart__intro"><p>U.S. median annual wages, May 2025.</p><p className="comparison-note">Technical and scientific sales covers pharma alongside other products, so it is not a pharma-only figure.</p></div>
      <div className="earnings-chart__ranges">
        {salaries.map((salary, index) => <div className={`salary-range salary-median salary-median--${index}`} key={salary.name}>
          <h4>{salary.name}</h4>
          <p className="salary-range__value">{money(salary.value)}</p>
          <div className="salary-range__track" aria-hidden="true"><div style={{ left: 0, width: `${salary.value / 120000 * 100}%` }} /></div>
        </div>)}
        <div className="earnings-chart__axis" aria-hidden="true"><span>$0</span><span>$60k</span><span>$120k</span></div>
        <p className="comparison-note">Source: U.S. Bureau of Labor Statistics, <a href={nursingSource}>nursing</a> and <a href={salesSource}>wholesale and manufacturing sales</a>. Medians, not starting pay.</p>
      </div>
    </div>
    <section className="demands-comparison" aria-labelledby="demands-title">
      <h3 id="demands-title">What does it ask of your time?</h3>
      <p className="comparison-note">Work patterns as each source describes them. Not measured hours.</p>
      <table className="demand-matrix">
        <caption className="sr-only">Day-to-day demands compared across nursing, traditional B2B sales, and a pharma sales example</caption>
        <thead>
          <tr>
            <th scope="col"><span className="sr-only">Demand</span></th>
            {roles.map(role => <th scope="col" key={role.name} className={role.focus ? "is-focus" : undefined}><a href={role.source}>{role.name}</a></th>)}
          </tr>
        </thead>
        <tbody>
          {demands.map(([label, cells]) => <tr key={label}>
            <th scope="row">{label}</th>
            {cells.map((cell, index) => <td key={index} className={roles[index].focus ? "is-focus" : undefined}>{cell}</td>)}
          </tr>)}
        </tbody>
      </table>
    </section>
  </section>;
}
