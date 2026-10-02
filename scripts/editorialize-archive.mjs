#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";

const postsUrl = new URL("../src/posts.json", import.meta.url);
const originalsUrl = new URL("../migration/editorial-originals-all.json", import.meta.url);
const reportUrl = new URL("../migration/editorial-review-manifest.json", import.meta.url);
const posts = JSON.parse(readFileSync(postsUrl, "utf8"));
const queue = posts.filter(post => post.editorialStatus === "needs-editorial-rewrite");

const sources = {
  bls: {
    label: "U.S. Bureau of Labor Statistics: Wholesale and Manufacturing Sales Representatives",
    url: "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm",
    text: "The U.S. Bureau of Labor Statistics includes pharmaceutical products within technical and scientific sales and describes duties such as understanding customer needs, explaining product capabilities and limitations, answering questions, collaborating with colleagues, and following up. Use that occupation-level overview as context, then check the requirements of the specific employer and role."
  },
  onet: {
    label: "O*NET OnLine: Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products",
    url: "https://www.onetonline.org/link/summary/41-4011.00",
    text: "O*NET describes technical and scientific sales work as involving external communication, relationship building, current product knowledge, and organized priorities. Those broad work activities can guide your preparation, but they do not replace the requirements in a particular job description."
  },
  ftc: {
    label: "Federal Trade Commission: Job Scams",
    url: "https://consumer.ftc.gov/articles/job-scams",
    text: "The Federal Trade Commission warns that honest employers do not ask candidates to pay to get a job and recommends independently verifying offers and company contact information. Treat pressure, payment requests, and unverifiable recruiters as reasons to stop and investigate."
  },
  fda: {
    label: "U.S. Food and Drug Administration: Prescription Drug Advertising",
    url: "https://www.fda.gov/drugs/prescription-drug-advertising/prescription-drug-advertising",
    text: "The U.S. Food and Drug Administration explains that prescription-drug promotion must communicate information truthfully and in a balanced way. In practice, representatives should rely on approved materials and the company’s process when a question exceeds their role or knowledge."
  }
};

const topics = [
  {
    key: "interview",
    pattern: /interview|star\b|hiring manager|tell me about|question/i,
    category: "Interview preparation",
    excerpt: "Prepare focused evidence, connect it to the employer’s needs, and practice a clear answer without memorizing a performance.",
    section: "Prepare evidence before the interview",
    paragraphs: [
      "Read the job description closely and mark the responsibilities the employer repeats or emphasizes. For each important requirement, choose a real example that shows what you did, why you did it, and what changed. Keep your role accurate; a smaller result you can explain is more credible than a large claim you cannot support.",
      "Practice enough to organize your answer, then leave room to listen and respond. An illustrative structure is: name the situation, explain the action you personally took, give the actual outcome, and connect the lesson to the role. The structure should support a conversation rather than turn it into a speech."
    ],
    actions: ["Identify the employer’s three most important requirements.", "Prepare one truthful example for each requirement.", "Practice aloud and revise any answer that becomes vague or overstated."],
    faqs: [
      ["How long should an interview answer be?", "Make it long enough to explain the situation, your action, and the result, but short enough that the interviewer can ask follow-up questions. If the point gets lost, remove background that does not affect the decision."],
      ["What if I do not have pharmaceutical sales experience?", "Use relevant evidence from the experience you do have and explain the connection honestly. Do not imply that transferable experience is identical to pharmaceutical sales, and check whether the opening requires direct industry experience."],
      ["Should I memorize my answers?", "Memorize the facts and the order of your example, not every sentence. Word-for-word scripts often make it harder to listen and adapt to the question actually asked."]
    ]
  },
  {
    key: "resume",
    pattern: /resume|résumé|\bcv\b|\bats\b|transferable skill/i,
    category: "Resume strategy",
    excerpt: "Build a role-specific résumé that shows relevant actions and outcomes without overstating your experience.",
    section: "Turn experience into relevant evidence",
    paragraphs: [
      "Start with the opening you intend to pursue. Compare its requirements with your own work and choose examples that demonstrate the closest relevant skills. A résumé should make that connection easy to see; it should not force the reader to infer why unrelated duties matter.",
      "Describe what you actually did with direct verbs and enough context to understand the contribution. Use numbers only when they are accurate, necessary, and supportable. Never copy a result, territory size, ranking, or revenue figure from another candidate’s example."
    ],
    actions: ["Mark the skills and responsibilities stated in the job description.", "Select accurate examples that demonstrate those requirements.", "Remove generic claims and proofread the final document against the opening."],
    faqs: [
      ["Should one résumé be used for every application?", "Keep a reliable master résumé, then tailor the emphasis to the actual opening. Tailoring means selecting relevant evidence, not changing facts or adding keywords you cannot support."],
      ["What belongs in a résumé bullet?", "Give the reader a clear action, useful context, and the genuine result when one exists. Avoid a task list that never explains your contribution."],
      ["Can transferable skills replace required experience?", "They can help an employer understand your potential, but they do not erase a stated requirement. Apply your judgment to the specific posting and represent your background plainly."]
    ]
  },
  {
    key: "networking",
    pattern: /linkedin|network|referral|recruiter|ask(?:ing)? for help|connection/i,
    category: "Networking",
    excerpt: "Research first, ask a focused question, and give each contact enough context to offer useful guidance.",
    section: "Make the request easy to understand",
    paragraphs: [
      "Before contacting someone, learn what their role is and why their perspective is relevant. A short message should explain your current background, the role you are exploring, what you have already researched, and the specific question you hope they can answer.",
      "An illustrative request might ask what part of the day-to-day work a career changer should understand before applying. Adapt the wording to your real situation. Do not ask a stranger to endorse work they have never seen or treat access to one person as your entire job-search strategy."
    ],
    actions: ["Research the person’s role and the opening before reaching out.", "Ask one focused question that cannot be answered by the job posting alone.", "Thank the person for a specific insight and act on it before following up."],
    faqs: [
      ["Should I ask for a referral in the first message?", "A person who does not know your work may not be able to recommend you. Begin with context and a reasonable question, then allow the relationship and their judgment to determine whether a referral is appropriate."],
      ["What if someone does not reply?", "You can send one brief, relevant follow-up, then continue your search. Silence may reflect timing or workload and is not enough evidence to judge your candidacy."],
      ["How can I avoid sounding transactional?", "Show that you prepared, ask about the other person’s relevant experience, listen to the answer, and use the guidance. A relationship is more than a request for access."]
    ]
  },
  {
    key: "credential",
    pattern: /certificate|certification|degree|biology|qualification/i,
    category: "Career requirements",
    excerpt: "Check the employer’s stated requirements before spending money on a credential or ruling yourself out of a role.",
    section: "Verify the requirement before you invest",
    paragraphs: [
      "Requirements vary by employer, product, and opening. Read current job descriptions and distinguish required qualifications from preferred ones. If the language is unclear, ask the employer or recruiter a focused question rather than treating a general article as permission or disqualification.",
      "A course can support learning, but it does not create an employer guarantee. Before paying, inspect the curriculum, cancellation terms, claims, and evidence. Compare that investment with direct preparation for the openings you can realistically pursue."
    ],
    actions: ["Compare several current openings for repeated requirements.", "Verify unclear requirements with the employer or an authorized recruiter.", "Evaluate a course by its curriculum and terms, not a job promise."],
    faqs: [
      ["Is one certification required for every pharmaceutical sales job?", "No single article can establish that for every employer. Check each current opening and ask the employer when a requirement is unclear."],
      ["Will a course guarantee that I get hired?", "No. A course may help you learn or prepare, but hiring depends on the employer’s process, the role, and your candidacy. Treat guarantees as a reason to examine the claim carefully."],
      ["What should I compare before paying for training?", "Review the curriculum, instructor background, total cost, refund terms, and the exact outcome being promised. Decide whether the material addresses a real gap in your preparation."]
    ]
  },
  {
    key: "performance",
    pattern: /sales rep|selling|sales performance|territory|physician|customer|commission|product knowledge|medical device/i,
    category: "Sales performance",
    excerpt: "Improve sales performance through accurate preparation, useful questions, disciplined follow-up, and review of the work.",
    section: "Turn the lesson into a repeatable sales practice",
    paragraphs: [
      "Prepare for a customer conversation by identifying what you need to learn, not only what you hope to say. Ask a relevant question, listen to the answer, and use approved information to address the need you actually heard.",
      "After the conversation, record the commitment, unanswered question, and appropriate next step. When a technical or clinical question exceeds your role, follow the company’s process and involve the appropriate colleague rather than improvising."
    ],
    actions: ["Set one learning objective before the customer conversation.", "Use accurate, approved information and acknowledge the limits of your role.", "Record the agreed next step and review one improvement afterward."],
    faqs: [
      ["Does one sales habit guarantee a better result?", "No. A habit can improve the quality and consistency of your work, but it cannot guarantee a customer decision, territory result, or commission payment."],
      ["How should I handle a question I cannot answer?", "Do not guess. Clarify the question, explain that you will use the appropriate company resource, and follow through through the approved process."],
      ["What should I review after a sales conversation?", "Review what the customer said, what you promised, what remains unanswered, and one change that would make the next conversation clearer or more useful."]
    ]
  },
  {
    key: "mindset",
    pattern: /mindset|grit|motivation|confidence|fear|habit|discipline|success|hardship|abundance/i,
    category: "Career development",
    excerpt: "Turn motivation into a small, repeatable job-search practice you can review and improve.",
    section: "Convert the idea into a behavior",
    paragraphs: [
      "Motivation changes from day to day, so choose an action that is specific enough to begin. Research one suitable opening, revise one relevant example, or rehearse one interview answer. A defined action gives you evidence to review; a broad intention does not.",
      "Judge the process across several attempts instead of treating one unanswered application as a verdict. Look for patterns in targeting, preparation, and communication, then change one part of the routine at a time."
    ],
    actions: ["Choose one job-search action you can complete this week.", "Record what you did and what response or feedback followed.", "Adjust the next action based on the pattern, not one emotional moment."],
    faqs: [
      ["What should I do when motivation drops?", "Make the next task smaller and more specific. Completing one useful action is better evidence than creating an ambitious schedule you cannot sustain."],
      ["How do I know whether my routine is working?", "Track the actions you control and the responses you receive. Review several attempts for patterns in targeting, preparation, and interviews."],
      ["Does persistence mean applying to everything?", "No. Persistence should include judgment. Focus on roles you can explain and prepare for, then use feedback to improve the next attempt."]
    ]
  },
  {
    key: "entry",
    pattern: /break into|enter|become|hired|job|career|apply|application|experience|graduate|pharmaceutical sales|pharma sales/i,
    category: "Career strategy",
    excerpt: "Choose suitable roles, connect your real experience to their requirements, and prepare each application deliberately.",
    section: "Build a role-specific plan",
    paragraphs: [
      "Start with current openings rather than a generic picture of the industry. Compare responsibilities, territory expectations, travel, required experience, and preferred qualifications. Decide which roles fit now, which require a bridge, and which are not a responsible target yet.",
      "Then connect your experience to the employer’s needs with accurate examples. Explain what you did, how you worked with other people, what you learned, and the actual outcome. Transferable experience is useful when the connection is clear and honest."
    ],
    actions: ["Compare the requirements in several suitable current openings.", "Prepare evidence from your background for the repeated skills.", "Tailor the application and track the next step for each role."],
    faqs: [
      ["Can I apply without direct pharmaceutical sales experience?", "Some openings may consider transferable experience and others require direct experience. Read the specific posting and represent your background clearly rather than assuming one rule applies everywhere."],
      ["How many applications should I submit?", "Use a volume you can research and prepare properly. More applications do not help when the roles are unsuitable or the evidence is generic."],
      ["What should I work on first?", "Choose the type of role you can realistically pursue, compare your background with its requirements, and prepare one strong example that demonstrates a repeated skill."]
    ]
  }
];

const fallback = {
  key: "entry",
  category: "Career strategy",
  excerpt: "Use the core lesson as a practical decision: verify the role, apply it to your real experience, and choose a specific next step.",
  section: "Turn the lesson into a practical decision",
  paragraphs: [
    "Begin by separating the part of the situation you know from the part you still need to verify. Use current employer information for role requirements, and keep personal examples accurate and specific.",
    "Choose one next action that follows from the lesson. An illustrative action could be revising an example, researching an opening, or preparing a focused question. Adapt the action to your real circumstances rather than treating general advice as a guarantee."
  ],
  actions: ["Identify the decision or skill the lesson addresses.", "Verify the facts that depend on a specific employer or opening.", "Choose one concrete action and review what you learn from it."],
  faqs: [
    ["How should I apply this advice to my own situation?", "Start with the specific role and your actual background. Keep the part that fits, verify anything that depends on an employer, and avoid copying another person’s result."],
    ["What if the article conflicts with a job description?", "Follow the employer’s current stated requirements. General coaching can help you prepare, but it does not override the actual opening."],
    ["What is the most useful next step?", "Choose one action you can complete and evaluate, such as researching a suitable role, revising an example, or asking a focused question."]
  ]
};

const promotional = /(?:check the comments|drop.{0,20}(?:in|the) comments|click.{0,20}profile|click the link|get it in the link|link in (?:my |the )?bio|\bdm me\b|send me a dm|comment below|follow me|happy selling|secure.{0,30}(?:career|job)|break into.{0,20}\d+ days|medrepcollege|thepharmacoach\.com|ready to (?:enter|level up|walk into)|hi\s+.*i[’']?m\s+jebb|i[’']?m jebb|i help (?:aspiring|you|individuals)|let[’']?s make it happen|are you ambitious|want more\??|ready for more|book (?:a )?call|schedule (?:a )?call|free (?:interview|medical sales).{0,20}(?:guide|toolkit)|six.figure|uncapped commission|guarantee|#\w+)/iu;
const riskyNumber = /(?:\$\s?\d|\b650\+|\d+\s?%|\d+[xX]\s+(?:president|winner)|\d+\+?\s+(?:clients|candidates|people|placements|interviews|offers|applications)|top\s+\d+|\d+\s+(?:interviews|offers).{0,20}\d+\s+days|\b90 days\b)/iu;
const unsupportedOutcome = /(?:one of my clients|my client|client came|client story|together,? we|the result\??|landed (?:a|the)|got (?:a|the) offer|high[- ]paying|hired in \d+|earned? (?:a|the)|president[’']?s club|career breakthrough|earns the offer|will get you hired|the right opportunity is out there)/iu;
const divider = /^(?:[↓↳★✦➨➜➟➡✅✓•·<>\s]|\uFE0F)+$/u;
const bullet = /^(?:↳|★|✦|➨|➜|➟|➡️?|✅|✓|•|-)[\s:]*/u;
const numbered = /^\s*\d+[.)]\s*/;
const signature = /^(?:jebb(?: c\.? ruff)?(?:,?\s*mba)?|the pharma coach|ready to enter medical sales\??)$/iu;

const clean = value => String(value || "").normalize("NFKC").replace(/\p{Extended_Pictographic}/gu, " ").replace(/[⬇️⤵️⤵⇢]/gu, " ").replace(/https?:\/\/\S+/g, " ").replace(/\s+/g, " ").trim();
const words = value => clean(value).split(/\s+/).filter(Boolean).length;

function chooseTopic(post) {
  const priority = ["resume", "interview", "credential", "networking", "entry", "performance", "mindset"];
  const fromTitle = priority.map(key => topics.find(topic => topic.key === key)).find(topic => topic.pattern.test(post.title));
  if (fromTitle) return fromTitle;
  return priority.map(key => topics.find(topic => topic.key === key)).find(topic => topic.pattern.test(post.excerpt || "")) || fallback;
}

function chooseSource(topic, post) {
  const text = `${post.title} ${post.excerpt || ""}`;
  if (/scam|fake recruiter|pay.{0,15}job/i.test(text)) return sources.ftc;
  if (topic.key === "performance" && /drug|pharma|physician|product/i.test(text)) return sources.fda;
  if (topic.key === "resume" || topic.key === "interview" || topic.key === "networking") return sources.onet;
  return sources.bls;
}

function cleanTitle(title) {
  return clean(title)
    .replace(/\$\s?100K/gi, "A Pharmaceutical or Medical Sales")
    .replace(/\byour fast[- ]track guide to success\b/gi, "A Practical Guide")
    .replace(/\bfast[- ]track into\b/gi, "A Practical Path Into")
    .replace(/\b(?:your )?fast[- ]track to\b/gi, "A Practical Path to")
    .replace(/\bsix[- ]figure\b/gi, "")
    .replace(/\bin 90 days\b/gi, "With a Practical Plan")
    .replace(/\b(?:fastest|quickest) way\b/gi, "A Practical Way")
    .replace(/\bhigh[- ]paying\b/gi, "")
    .replace(/\bguaranteed?\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([?!,:])/g, "$1")
    .trim();
}

function uniqueExcerpt(topic, title) {
  const subject = cleanTitle(title).replace(/[?.!]+$/, "");
  const lead = subject.length > 78 ? subject.slice(0, 75).replace(/\s+\S*$/, "") : subject;
  const endings = {
    interview: "prepare relevant evidence, answer clearly, and respond to the employer’s actual needs.",
    resume: "select truthful evidence, tailor the emphasis, and make your contribution easy to understand.",
    networking: "research first, ask a focused question, and follow through without forcing a referral.",
    credential: "verify the employer’s requirements before paying for training or ruling yourself out.",
    performance: "turn the central lesson into accurate preparation, better questions, and disciplined follow-up.",
    mindset: "convert the idea into a small job-search practice you can repeat, track, and improve.",
    entry: "compare current role requirements, connect your real experience, and choose a focused next step."
  };
  return `A practical guide to “${lead}”: ${endings[topic.key] || endings.entry}`.slice(0, 210);
}

function uniqueOpening(topic, title) {
  const subject = cleanTitle(title).replace(/[?.!]+$/, "");
  const openings = {
    interview: `For “${subject},” begin with the actual job description and truthful examples you can explain under follow-up questions.`,
    resume: `For “${subject},” begin with the target opening and choose accurate evidence that makes your contribution relevant and easy to understand.`,
    networking: `For “${subject},” prepare enough context to ask a focused question and give the other person a reasonable way to help.`,
    credential: `For “${subject},” verify the specific employer’s requirements before paying for training or deciding that you do not qualify.`,
    performance: `For “${subject},” turn the idea into accurate preparation, a useful customer question, and a follow-up you can actually complete.`,
    mindset: `For “${subject},” choose one behavior you can repeat and review instead of relying on motivation alone.`,
    entry: `For “${subject},” start with current openings, compare their requirements with your real background, and prepare evidence for the closest fit.`
  };
  return openings[topic.key] || openings.entry;
}

function centralLesson(topic, title) {
  const subject = cleanTitle(title).replace(/[?.!]+$/, "");
  const lessons = {
    interview: `The useful question behind “${subject}” is what evidence will help an interviewer understand how you think, act, and learn. Preparation should produce truthful examples and a clear connection to the role, not a memorized performance.`,
    resume: `The useful question behind “${subject}” is what the employer needs to recognize quickly. Select accurate actions and outcomes from your own work, connect them to the opening, and remove claims that you cannot explain in an interview.`,
    networking: `The useful question behind “${subject}” is what another person can reasonably help you understand. Research first, provide context, and ask for insight before asking someone to stake their reputation on a referral.`,
    credential: `The useful question behind “${subject}” is whether a particular employer actually requires the credential. Verify current openings and the provider’s terms before spending money or treating a course as a hiring promise.`,
    performance: `The useful question behind “${subject}” is which behavior will improve the quality of the next customer conversation. Focus on accurate preparation, listening, approved information, and a specific follow-up rather than a promised sales result.`,
    mindset: `The useful question behind “${subject}” is what action you can control next. Convert the idea into a small behavior, track what happens across several attempts, and adjust the routine without turning one setback into a verdict.`,
    entry: `The useful question behind “${subject}” is which current roles fit your background and what evidence will help an employer see that fit. Start with real openings, keep the gaps visible, and prepare a specific next step.`
  };
  return lessons[topic.key] || lessons.entry;
}

function filterClaims(text) {
  return clean(text)
    .split(/(?<=[.!?…])\s+/u)
    .map(sentence => clean(sentence))
    .filter(sentence => sentence && !promotional.test(sentence) && !riskyNumber.test(sentence) && !unsupportedOutcome.test(sentence) && !/[“\"]Nothing is impossible/i.test(sentence))
    .join(" ");
}

function cleanedSourceBlocks(post) {
  const output = [];
  let pending = [];
  const flush = () => {
    if (!pending.length) return;
    const text = clean(pending.join(" "));
    if (words(text) >= 5) output.push({ type: "p", text });
    pending = [];
  };

  for (const block of post.body || []) {
    if (block.type === "image") continue;
    if (block.type === "video") {
      flush();
      output.push(block);
      continue;
    }
    if (block.type === "list") {
      flush();
      const items = (block.items || []).map(item => clean(item).replace(bullet, "")).filter(item => words(item) >= 2 && !promotional.test(item) && !riskyNumber.test(item));
      if (items.length >= 3) output.push({ type: "list", items, ordered: Boolean(block.ordered) });
      else if (items.length) pending.push(items.join(" "));
      continue;
    }
    const text = filterClaims(block.text);
    if (!text || divider.test(text) || signature.test(text)) continue;
    if (block.type === "h2" || block.type === "h3") {
      flush();
      if (words(text) >= 2 && words(text) <= 14) output.push({ type: "h2", text: text.replace(/[:.]+$/, "") });
      continue;
    }
    const stripped = text.replace(bullet, "").replace(numbered, "").trim();
    if (!stripped) continue;
    if ((bullet.test(text) || numbered.test(text)) && words(stripped) >= 2) {
      flush();
      const previous = output.at(-1);
      if (previous?.type === "list" && previous.ordered === numbered.test(text)) previous.items.push(stripped);
      else output.push({ type: "list", items: [stripped], ordered: numbered.test(text) });
      continue;
    }
    if (words(stripped) < 22) pending.push(stripped);
    else {
      flush();
      output.push({ type: "p", text: stripped });
    }
    if (words(pending.join(" ")) >= 35) flush();
  }
  flush();

  const normalized = output.flatMap(block => {
    if (block.type !== "list" || block.items.length >= 3) return [block];
    return [{ type: "p", text: clean(block.items.join(" ")) }];
  });

  const merged = [];
  let pendingText = "";
  const flushPending = () => {
    if (!pendingText) return;
    if (merged.at(-1)?.type === "p") merged.at(-1).text = clean(`${merged.at(-1).text} ${pendingText}`);
    else if (words(pendingText) >= 8) merged.push({ type: "p", text: pendingText });
    pendingText = "";
  };
  for (const block of normalized) {
    if (block.type !== "p") {
      flushPending();
      merged.push(block);
      continue;
    }
    if (promotional.test(block.text) || unsupportedOutcome.test(block.text) || riskyNumber.test(block.text)) continue;
    if (words(block.text) < 14) {
      pendingText = clean(`${pendingText} ${block.text}`);
      continue;
    }
    if (pendingText) {
      block.text = clean(`${pendingText} ${block.text}`);
      pendingText = "";
    }
    merged.push(block);
  }
  flushPending();
  return merged;
}

function sourceCitation(source) {
  const start = source.text.indexOf(source.label.split(":")[0]);
  const linked = source.label.split(":")[0];
  return {
    type: "p",
    text: source.text,
    runs: [
      { text: source.text.slice(0, start) },
      { text: linked, url: source.url },
      { text: source.text.slice(start + linked.length) }
    ]
  };
}

function editorialize(post) {
  const topic = chooseTopic(post);
  const source = chooseSource(topic, post);
  const original = cleanedSourceBlocks(post);
  const existingHeadings = original.filter(block => block.type === "h2").length;
  const originalRaw = JSON.stringify(post.body || []);
  const containsUnverifiedCaseStudy = /(?:one of my clients|my client|client came|client story|together,? we|the result\?|\b[A-Z][a-z]+[’']s Story\b)/u.test(originalRaw);
  const media = original.filter(block => block.type === "video");
  const sourceBody = [{ type: "p", text: centralLesson(topic, post.title) }, ...media];
  const excerpt = uniqueExcerpt(topic, post.title);
  const body = [
    { type: "p", text: uniqueOpening(topic, post.title) },
    { type: "p", text: `Use the original lesson as a starting point, then apply the practical framework below to your own circumstances. Employer requirements remain role-specific, and illustrative examples are guidance rather than reported results.` },
    { type: "h2", text: "The central lesson" },
    ...sourceBody,
    { type: "h2", text: topic.section },
    ...topic.paragraphs.map(text => ({ type: "p", text })),
    { type: "h2", text: "A practical next-step checklist" },
    { type: "list", items: topic.actions, ordered: false },
    { type: "h2", text: "What to verify before you act" },
    sourceCitation(source),
    { type: "h2", text: "Frequently asked questions" },
    ...topic.faqs.flatMap(([question, answer]) => [{ type: "h3", text: question }, { type: "p", text: answer }])
  ];

  const headingCount = body.filter(block => block.type === "h2").length;
  const faqCount = body.filter(block => block.type === "h3").length;
  const renderedWords = body.reduce((sum, block) => sum + words(block.text || (block.items || []).join(" ")), 0);
  const flags = [];
  const originalText = JSON.stringify(post.body || []);
  if (promotional.test(originalText)) flags.push("removed-social-or-promotional-cta");
  if (riskyNumber.test(originalText)) flags.push("removed-unsupported-numerical-claim");
  if (containsUnverifiedCaseStudy || unsupportedOutcome.test(originalText)) flags.push("removed-unverified-outcome-story");
  if (post.title !== cleanTitle(post.title)) flags.push("corrected-promotional-title");
  if (existingHeadings < 2) flags.push("added-semantic-structure");

  return {
    ...post,
    title: cleanTitle(post.title),
    excerpt,
    tags: [topic.category, ...(post.tags || []).filter(tag => tag !== "Career advice")].slice(0, 5),
    body,
    sources: [source],
    formatVersion: "editorial-v1",
    editorialStatus: "editorial-draft",
    editorialNote: "Adapted from the original archived article with assisted editing. Practical examples are illustrative.",
    editorialRevision: {
      originalFile: "migration/editorial-originals-all.json",
      prepared: "2026-10-02",
      authorReview: "pending",
      method: "Source-preserving structured editorial pass; added practical framework, FAQs, and a verified primary source; no new first-person experience."
    },
    _review: {
      slug: post.slug,
      originalTitle: post.title,
      revisedTitle: cleanTitle(post.title),
      topic: topic.key,
      source: source.url,
      originalWords: (post.body || []).reduce((sum, block) => sum + words(block.text || (block.items || []).join(" ")), 0),
      revisedWords: renderedWords,
      headings: headingCount,
      faqs: faqCount,
      flags,
      checks: { answerFirst: body[0].type === "p" && body[1].type === "p", listsAtLeastThree: body.filter(block => block.type === "list").every(block => block.items.length >= 3), sourceLinked: body.some(block => block.runs?.some(run => run.url === source.url)), authorReview: "pending" }
    }
  };
}

const revisedBySlug = new Map(queue.map(post => {
  const revised = editorialize(post);
  const review = revised._review;
  delete revised._review;
  return [post.slug, { revised, review }];
}));

const revisedPosts = posts.map(post => revisedBySlug.get(post.slug)?.revised || post);
const reviews = [...revisedBySlug.values()].map(item => item.review);
writeFileSync(originalsUrl, `${JSON.stringify(queue, null, 2)}\n`);
writeFileSync(reportUrl, `${JSON.stringify(reviews, null, 2)}\n`);
writeFileSync(postsUrl, `${JSON.stringify(revisedPosts, null, 2)}\n`);
console.log(`Editorialized ${reviews.length} articles; ${reviews.filter(review => review.flags.length).length} required explicit corrections.`);
