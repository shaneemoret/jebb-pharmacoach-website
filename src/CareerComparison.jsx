import { useEffect, useRef, useState } from "react";
const nursingSource = "https://www.bls.gov/ooh/healthcare/registered-nurses.htm";
const salesSource = "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm";
const DEMAND_STEPS = 3;
const payDemand = [
  { name: "Registered nursing", value: 97550, demand: "Highest", steps: 3, tag: "BLS median", source: nursingSource },
  { name: "Traditional B2B sales", value: 72080, demand: "Higher", steps: 2, tag: "BLS median", source: salesSource },
  { name: "Pharma sales", value: 124600, demand: "Moderate", steps: 1, tag: "First-year OTE, Med Rep College", source: `${import.meta.env.BASE_URL}about`, focus: true },
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
          <p className="paydemand__tag"><a href={role.source}>{role.tag}</a></p>
        </div>)}
      </div>
      <ul className="sr-only">
        {payDemand.map(role => <li key={role.name}>{role.name}: {money(role.value)} a year, {role.demand.toLowerCase()} time demand of the three.</li>)}
      </ul>
    </div>
  </section>;
}
