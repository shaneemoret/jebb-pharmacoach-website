const pharmaSource = "https://careers.amgen.com/en/job/new-york/specialty-representative-senior-specialty-representive-respiratory-biologic-poughkeepsie-ny/87/97936512208";
const nursingSource = "https://www.bls.gov/ooh/healthcare/registered-nurses.htm";
const salesSource = "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm";
const salaries = [
  { name: "Traditional B2B sales", tag: "BLS median", value: 72080 },
  { name: "Registered nursing", tag: "BLS median", value: 97550 },
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
const PAY_MIN = 60000, PAY_MAX = 132000;
const DEMAND_X = { Moderate: 17, Higher: 51, Highest: 84 };
const positions = [
  { name: "Registered nursing", pay: 97550, demand: "Highest", basis: "Shifts including nights, weekends and holidays, plus on-call", source: nursingSource },
  { name: "Traditional B2B sales", pay: 72080, demand: "Higher", basis: "Often more than 40 hours a week; territories can mean days or weeks away", source: salesSource },
  { name: "Pharma sales", pay: 124600, demand: "Moderate", basis: "Territory schedule with occasional overnights", source: pharmaSource, focus: true },
];
const payY = pay => (pay - PAY_MIN) / (PAY_MAX - PAY_MIN) * 100;
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
      <p className="comparison-note">The first two are U.S. Bureau of Labor Statistics medians, not starting pay: <a href={salesSource}>wholesale and manufacturing sales</a> and <a href={nursingSource}>nursing</a>. The third is average first-year OTE reported by <a href="https://www.thepharmacoach.com/about">Med Rep College</a> across pharma and related med-sales roles, which is a different kind of figure from a BLS median.</p>
    </div>
    <div className="tradeoff-chart">
      <div className="cost-chart__label">
        <p>Pay against time demand:</p>
        <p>Higher pay does not have to mean more of your life</p>
      </div>
      <div className="tradeoff-plot">
        <div className="tradeoff-plot__axis-y" aria-hidden="true">
          <span>$130k</span><span>$100k</span><span>$70k</span>
        </div>
        <div className="tradeoff-plot__area">
          {positions.map(point => <div
            className={`tradeoff-point${point.focus ? " tradeoff-point--focus" : ""}`}
            key={point.name}
            style={{ left: `${DEMAND_X[point.demand]}%`, bottom: `${payY(point.pay)}%` }}
          >
            <span className="tradeoff-point__dot" aria-hidden="true" />
            <span className="tradeoff-point__label">
              <b>{point.name}</b>
              <i>{money(point.pay)} · {point.demand.toLowerCase()} time demand</i>
            </span>
          </div>)}
        </div>
        <div className="tradeoff-plot__axis-x" aria-hidden="true">
          <span>Moderate</span><span>Higher</span><span>Highest</span>
        </div>
        <p className="tradeoff-plot__axis-title" aria-hidden="true">Time demand</p>
      </div>
      <ul className="sr-only">
        {positions.map(point => <li key={point.name}>{point.name}: {money(point.pay)} a year, {point.demand.toLowerCase()} time demand. {point.basis}.</li>)}
      </ul>
      <p className="comparison-note">Pay is the sourced figure from the chart above. The horizontal position is ordinal, ranked from how each source describes the role, not a measured score: <a href={nursingSource}>nursing</a> lists nights, weekends, holidays and on-call; <a href={salesSource}>wholesale and manufacturing sales</a> lists 40-plus hours and territories that can mean days or weeks away; the <a href={pharmaSource}>pharma listing</a> lists a territory schedule with occasional overnights.</p>
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
