const pharmaSource = "https://careers.amgen.com/en/job/new-york/specialty-representative-senior-specialty-representive-respiratory-biologic-poughkeepsie-ny/87/97936512208";
const deviceSource = "https://stryker.wd1.myworkdayjobs.com/StrykerCareers/job/Portland-Oregon/Sports-Medicine---Sales-Representative---Portland--OR_R565817";
const salaryRanges = [
  { name: "Specialty representative", low: 89880, high: 121602 },
  { name: "Senior specialty representative", low: 118091, high: 159771 },
];
const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function CareerComparison() {
  return <section id="career-potential" className="career-comparison section-pad" aria-labelledby="career-potential-title">
    <div className="career-comparison__heading">
      <p className="eyebrow">Earnings. Travel. Your next move.</p>
      <h2 id="career-potential-title">A bigger opportunity.<br />A schedule that fits your life.</h2>
      <p className="lead">Look beyond the job title. Compare the pay, the territory, and what your workweek would actually look like.</p>
    </div>
    <div className="earnings-chart">
      <div className="earnings-chart__intro"><h3>What could a pharma role pay?</h3><p>Published annual base-salary ranges from one Amgen specialty-sales posting.</p></div>
      <div className="earnings-chart__ranges">
        {salaryRanges.map((range, index) => <div className={`salary-range salary-range--${index}`} key={range.name}>
          <h4>{range.name}</h4>
          <p className="salary-range__value">{money(range.low)}<span>–</span>{money(range.high)}</p>
          <div className="salary-range__track" aria-hidden="true"><div style={{ left: `${range.low / 160000 * 100}%`, width: `${(range.high - range.low) / 160000 * 100}%` }} /></div>
        </div>)}
        <div className="earnings-chart__axis" aria-hidden="true"><span>$0</span><span>$80k</span><span>$160k</span></div>
        <p className="comparison-note">Bars show the advertised range, not average pay. Sales incentives may be additional. These are two experience levels, not a promised starting salary or promotion path. <a href={pharmaSource}>View Amgen’s posting</a>.</p>
      </div>
    </div>
    <div className="schedule-comparison">
      <div className="schedule-comparison__intro"><h3>And the time on the road?</h3><p>Pharma and medical-device sales can both involve travel. The territory and product matter more than a blanket promise of fewer hours.</p></div>
      <div className="schedule-comparison__examples">
        <article><p className="eyebrow">Pharma example · Amgen</p><h4>Territory visits.<br />Occasional overnights.</h4><p>The Poughkeepsie role describes territory travel, with occasional overnight trips for training and sales meetings.</p><a href={pharmaSource}>Read the role details</a></article>
        <article><p className="eyebrow">Device example · Stryker</p><h4>Field calls.<br />On-call coverage.</h4><p>The Portland sports-medicine role includes field calls, on-call work, and operating- or emergency-room consultation.</p><a href={deviceSource}>Read the role details</a></article>
      </div>
    </div>
    <p className="comparison-note comparison-note--footer">Employer examples reviewed September 22, 2026. Not industry averages or Jebb’s client results. Actual compensation and schedules vary; these postings do not provide comparable weekly travel hours. Ask about territory size, overnight frequency, on-call duties, and incentive targets before accepting an offer.</p>
  </section>;
}
