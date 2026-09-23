import { useEffect, useRef, useState } from "react";
const pharmaSource = "https://careers.amgen.com/en/job/new-york/specialty-representative-senior-specialty-representive-respiratory-biologic-poughkeepsie-ny/87/97936512208";
const nursingSource = "https://www.bls.gov/ooh/healthcare/registered-nurses.htm";
const salesSource = "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm";
const DEMAND_STEPS = 3;
const payDemand = [
  { name: "Registered nursing", value: 97550, demand: "Highest", steps: 3, tag: "BLS median" },
  { name: "Traditional B2B sales", value: 72080, demand: "Higher", steps: 2, tag: "BLS median" },
  { name: "Pharma sales", value: 124600, demand: "Moderate", steps: 1, tag: "First-year OTE, Med Rep College", focus: true },
];
const PAY_TOP = Math.max(...payDemand.map(role => role.value));
const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function CareerComparison() {
  const chartRef = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = chartRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setShown(true); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <section id="career-potential" className="career-comparison section-pad" aria-labelledby="career-potential-title">
    <div className="career-comparison__heading">
      <h2 id="career-potential-title">Make more money, without sacrificing lifestyle and family.</h2>
      <p className="career-comparison__deck">That’s the goal. Compare the pay and the day-to-day demands to find a role that fits your life.</p>
    </div>
    <div className={`paydemand${shown ? " is-shown" : ""}`} ref={chartRef}>
      <div className="paydemand__row paydemand__row--pay">
        <p className="paydemand__axis">Pay</p>
        {payDemand.map((role, index) => <div className={`paydemand__col${role.focus ? " paydemand__col--focus" : ""}`} style={{ "--i": index }} key={role.name}>
          <p className="paydemand__value">{money(role.value)}</p>
          <div className="paydemand__block" style={{ "--h": role.value / PAY_TOP }} aria-hidden="true" />
        </div>)}
      </div>
      <div className="paydemand__row paydemand__row--demand">
        <p className="paydemand__axis">Time demand</p>
        {payDemand.map((role, index) => <div className={`paydemand__col${role.focus ? " paydemand__col--focus" : ""}`} style={{ "--i": index }} key={role.name}>
          <div className="paydemand__steps" aria-hidden="true">
            {Array.from({ length: DEMAND_STEPS }, (_, i) => <span key={i} style={{ "--s": i }} className={i < role.steps ? "is-on" : undefined} />)}
          </div>
          <p className="paydemand__demand">{role.demand}</p>
          <p className="paydemand__name">{role.name}</p>
          <p className="paydemand__tag">{role.tag}</p>
        </div>)}
      </div>
      <ul className="sr-only">
        {payDemand.map(role => <li key={role.name}>{role.name}: {money(role.value)} a year, {role.demand.toLowerCase()} time demand of the three.</li>)}
      </ul>
      <p className="paydemand__source">
        <a href={salesSource}>Wholesale and manufacturing sales</a> and <a href={nursingSource}>nursing</a> medians, BLS May 2025.
        Pharma figure is average first-year OTE reported by <a href="https://www.thepharmacoach.com/about">Med Rep College</a>.
        Time demand is ranked from each <a href={pharmaSource}>source's</a> own description, not measured hours.
      </p>
    </div>
  </section>;
}
