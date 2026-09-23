const pharmaSource = "https://careers.amgen.com/en/job/new-york/specialty-representative-senior-specialty-representive-respiratory-biologic-poughkeepsie-ny/87/97936512208";
const nursingSource = "https://www.bls.gov/ooh/healthcare/registered-nurses.htm";
const salesSource = "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm";
const salaries = [
  { name: "Nontechnical B2B sales", tag: "BLS median", value: 72080 },
  { name: "Registered nursing", tag: "BLS median", value: 97550 },
  { name: "Technical & scientific sales", tag: "BLS median", value: 104920 },
  { name: "Pharma sales first-year OTE", tag: "Med Rep College, reported across pharma and related med-sales roles", value: 124600, focus: true },
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
    <div className="cost-chart">
      <div className="cost-chart__label">
        <p>Pay comparison:</p>
        <p>U.S. median annual wages, May 2025, against reported first-year pharma sales OTE</p>
      </div>
      <div className="cost-chart__plot">
        {salaries.map(salary => <div className={`cost-col${salary.focus ? " cost-col--focus" : ""}`} key={salary.name}>
          <p className="cost-col__value">{money(salary.value)}</p>
          <div className="cost-col__block" style={{ "--h": salary.value / Math.max(...salaries.map(s => s.value)) }} aria-hidden="true" />
          <p className="cost-col__name">{salary.name}</p>
          <p className="cost-col__tag">{salary.tag}</p>
        </div>)}
      </div>
      <p className="comparison-note">The first three are U.S. Bureau of Labor Statistics medians, not starting pay: <a href={nursingSource}>nursing</a> and <a href={salesSource}>wholesale and manufacturing sales</a>. Technical and scientific sales covers pharma alongside other products, so it is not a pharma-only figure. The fourth is average first-year OTE reported by <a href="https://www.thepharmacoach.com/about">Med Rep College</a>, a different kind of figure from a BLS median.</p>
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
            {cells.map((cell, index) => <td key={index} data-role={roles[index].name} className={roles[index].focus ? "is-focus" : undefined}>{cell}</td>)}
          </tr>)}
        </tbody>
      </table>
    </section>
  </section>;
}
