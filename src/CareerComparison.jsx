const pharmaSource = "https://careers.amgen.com/en/job/new-york/specialty-representative-senior-specialty-representive-respiratory-biologic-poughkeepsie-ny/87/97936512208";
const nursingSource = "https://www.bls.gov/ooh/healthcare/registered-nurses.htm";
const salesSource = "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm";
const payDemand = [
  { name: "Pharma sales", value: 124600, demand: "Moderate time demand", tag: "First-year OTE, Med Rep College", focus: true },
  { name: "Traditional B2B sales", value: 72080, demand: "Higher time demand", tag: "BLS median" },
  { name: "Registered nursing", value: 97550, demand: "Highest time demand", tag: "BLS median" },
];
const PAY_TOP = Math.max(...payDemand.map(role => role.value));
const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function CareerComparison() {
  return <section id="career-potential" className="career-comparison section-pad" aria-labelledby="career-potential-title">
    <div className="career-comparison__heading">
      <h2 id="career-potential-title">Make more money, without sacrificing lifestyle and family.</h2>
      <p className="career-comparison__deck">That’s the goal. Compare the pay and the day-to-day demands to find a role that fits your life.</p>
    </div>
    <div className="paydemand">
      <div className="paydemand__plot">
        {payDemand.map(role => <div className={`paydemand__col${role.focus ? " paydemand__col--focus" : ""}`} key={role.name}>
          <p className="paydemand__value">{money(role.value)}</p>
          <div className="paydemand__block" style={{ "--h": role.value / PAY_TOP }} aria-hidden="true" />
        </div>)}
      </div>
      <div className="paydemand__labels">
        {payDemand.map(role => <div className={`paydemand__label${role.focus ? " paydemand__label--focus" : ""}`} key={role.name}>
          <p className="paydemand__name">{role.name}</p>
          <p className="paydemand__demand">{role.demand}</p>
          <p className="paydemand__tag">{role.tag}</p>
        </div>)}
      </div>
      <p className="paydemand__source">
        <a href={salesSource}>Wholesale and manufacturing sales</a> and <a href={nursingSource}>nursing</a> medians, BLS May 2025.
        Pharma figure is average first-year OTE reported by <a href="https://www.thepharmacoach.com/about">Med Rep College</a>.
        Time demand is ranked from each <a href={pharmaSource}>source's</a> own description.
      </p>
    </div>
  </section>;
}
