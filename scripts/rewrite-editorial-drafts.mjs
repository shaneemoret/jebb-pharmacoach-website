#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const postsUrl = new URL("src/posts.json", root);
const firstOriginalsUrl = new URL("migration/editorial-originals.json", root);
const remainingOriginalsUrl = new URL("migration/editorial-originals-all.json", root);
const reportUrl = new URL("migration/editorial-review-manifest.json", root);

const posts = JSON.parse(readFileSync(postsUrl, "utf8"));
const originals = [
  ...JSON.parse(readFileSync(firstOriginalsUrl, "utf8")),
  ...JSON.parse(readFileSync(remainingOriginalsUrl, "utf8")),
];
const originalsBySlug = new Map(originals.map(post => [post.slug, post]));
const queue = posts.filter(post => ["editorial-draft", "editorial-review-ready"].includes(post.editorialStatus));

if (queue.length !== 395) throw new Error(`Expected 395 editorial drafts, found ${queue.length}`);
if (originalsBySlug.size !== 395) throw new Error(`Expected 395 source records, found ${originalsBySlug.size}`);

const sourceCatalog = {
  entry: {
    label: "U.S. Bureau of Labor Statistics: Wholesale and Manufacturing Sales Representatives",
    short: "the Bureau of Labor Statistics occupation profile",
    url: "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm",
    context: "describes technical and scientific sales work as learning customer needs, explaining products, answering questions, and following up",
  },
  interview: {
    label: "O*NET OnLine: Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products",
    short: "the O*NET occupation profile",
    url: "https://www.onetonline.org/link/summary/41-4011.00",
    context: "identifies communication, relationship building, product knowledge, and organized follow-through as recurring parts of technical and scientific sales work",
  },
  resume: {
    label: "O*NET OnLine: Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products",
    short: "the O*NET occupation profile",
    url: "https://www.onetonline.org/link/summary/41-4011.00",
    context: "provides concrete work activities and skills that candidates can compare with their own truthful experience",
  },
  networking: {
    label: "O*NET OnLine: Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products",
    short: "the O*NET occupation profile",
    url: "https://www.onetonline.org/link/summary/41-4011.00",
    context: "lists external communication and relationship building among the recurring activities in technical and scientific sales",
  },
  performance: {
    label: "U.S. Food and Drug Administration: Prescription Drug Advertising",
    short: "the FDA prescription-drug advertising guidance",
    url: "https://www.fda.gov/drugs/prescription-drug-advertising/prescription-drug-advertising",
    context: "explains that prescription-drug promotion must be truthful, balanced, and consistent with approved information",
  },
  credential: {
    label: "Federal Trade Commission: Job Scams",
    short: "the Federal Trade Commission job-scam guidance",
    url: "https://consumer.ftc.gov/articles/job-scams",
    context: "advises job seekers to verify employers independently and warns that honest employers do not ask candidates to pay to get a job",
  },
  compensation: {
    label: "U.S. Bureau of Labor Statistics: Wholesale and Manufacturing Sales Representatives",
    short: "the Bureau of Labor Statistics occupation profile",
    url: "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm",
    context: "reports occupation-level pay information while making clear that compensation varies by industry, employer, experience, and sales results",
  },
  age: {
    label: "U.S. Equal Employment Opportunity Commission: Age Discrimination",
    short: "the Equal Employment Opportunity Commission age-discrimination guidance",
    url: "https://www.eeoc.gov/age-discrimination",
    context: "explains the federal protections that apply to workers and applicants age 40 and older while distinguishing legal information from a prediction about any hiring decision",
  },
  texas: {
    label: "Texas Career Check: Technical and Scientific Sales Representatives",
    short: "the Texas Career Check occupation profile",
    url: "https://texascareercheck.com/OccupationInfo/OccupationSummary/41-4011.00",
    context: "reports Texas labor-market information for technical and scientific sales representatives and describes the occupation as selling products that require technical or scientific knowledge",
  },
};

const topicRules = [
  ["age", /ageism|age discrimination|too old|older candidate/i],
  ["compensation", /salary|commission|compensation|how much money|income|earn/i],
  ["credential", /certificate|certification|degree|qualification|scam|pay to prove/i],
  ["resume", /resume|résumé|\bcv\b|ats|transferable skill/i],
  ["interview", /interview|star\b|hiring manager|question|offer letter/i],
  ["networking", /linkedin|network|referral|recruiter|connection/i],
  ["entry", /break into|enter|become|get hired|land a job|career change|job search|application|recent graduate|representative in|sales job in|job near me/i],
  ["performance", /quota|territory|physician|customer|product knowledge|selling|president/i],
  ["entry", /./],
];

const labels = {
  entry: "Career strategy",
  interview: "Interview preparation",
  resume: "Resume strategy",
  networking: "Networking",
  performance: "Sales performance",
  credential: "Career requirements",
  compensation: "Compensation",
  age: "Career requirements",
};

const promotional = /(?:check the comments|comment below|drop.{0,20}comments|click.{0,20}(?:profile|link)|link in (?:my |the )?bio|\bdm me\b|send me a dm|follow me|subscribe|happy selling|book (?:a )?(?:call|discovery call|strategy call)|schedule (?:a )?call|contact me|see how it works|if this article landed|i read every|average time to (?:hire|hired|placement)|average first.year ote|candidates i mentor|eliminate the years of guessing|positively affects your bank account|personalized guidance|referral (?:partner|bonus)|refer a friend|fast pass into|ready to (?:land|level up|grab)|our expertise will guide|free (?:30 minute )?(?:discovery call|interview|medical sales).{0,20}(?:guide|toolkit)?|secrets of winning|medrepcollege|thepharmacoach\.com|\$100k (?:med rep|medical sales|pharma)|\b650\+|hi[, ]+i[’']?m jebb|i[’']?m jebb|clients placed|clients have secured|professionals placed|\d+\+? placed|check if you qualify|let[’']?s get you hired|help(?:ed|ing).{0,40}\d+\+? (?:clients|professionals|candidates|people)|\d+\+? clients|are you ambitious|want in\??|go-to workout|fastest path forward|we will look at where you are|former hiring manager and|access to top-tier|ego badge|companies like|#\w+)/iu;
const riskyPromise = /(?:six[- ]figure|\b90 days\b|guaranteed?|will get you hired|earns? the offer|secure.{0,20}(?:career|job)|high[- ]paying|uncapped commission|placement rate|(?:offer|hired) in \d+ days|\$\s?\d[\d,.]*k?\+?.{0,90}(?:offer|career|salary|base|income|earning|ote|pay raise)|(?:salary|base|income|earnings?|ote|pay raise).{0,90}\$\s?\d)/iu;
const divider = /^(?:[↓↳★✦➨➜➟➡✅✓•·<>\s]|\uFE0F)+$/u;
const signature = /^(?:jebb(?: c\.? ruff)?(?:,?\s*mba)?|the pharma coach|ready to enter medical sales\??)$/iu;
const bullet = /^(?:↳+|>+|★|✦|➨|➜|➟|➡️?|✅|✓|•|-)[\s:]*/u;
const numbered = /^\s*\d+[.)]\s*/;

function clean(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\p{Extended_Pictographic}/gu, " ")
    .replace(/\uFE0F/gu, " ")
    .replace(/[⬇⤵⇢↳★✦➨➜➟➡➢✅✓•·]/gu, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const countWords = value => clean(value).split(/\s+/).filter(Boolean).length;
const sentenceParts = value => clean(value).split(/(?<=[.!?…])\s+/u).map(clean).filter(Boolean);

function cleanTitle(value) {
  return clean(value)
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

function topicFor(post) {
  const specificRules = topicRules.slice(0, -1);
  const titleMatch = specificRules.find(([, pattern]) => pattern.test(post.title));
  if (titleMatch) return titleMatch[0];
  const excerptMatch = specificRules.find(([, pattern]) => pattern.test(post.excerpt || ""));
  return excerptMatch?.[0] || "entry";
}

function subjectFor(title) {
  const subject = cleanTitle(title).replace(/[?.!]+$/, "");
  return subject.length <= 82 ? subject : subject.slice(0, 79).replace(/\s+\S*$/, "");
}

function acceptableSentence(sentence) {
  if (!sentence || promotional.test(sentence) || riskyPromise.test(sentence) || divider.test(sentence) || signature.test(sentence)) return false;
  if (/^(?:jebb c\.?|ruff,?\s*mba\b|anne salomon\b|josephciccarone\b|scostin44\b|jruff01\b)/i.test(sentence)) return false;
  if (/^(?:copyright|all rights reserved|disclaimer)\b/i.test(sentence)) return false;
  return countWords(sentence) >= 2;
}

function normalizeSource(post) {
  const blocks = [];
  let fragments = [];
  let listItems = [];
  let listOrdered = false;

  const flushFragments = () => {
    const text = clean(fragments.join(" "));
    if (countWords(text) >= 8) blocks.push({ type: "p", text });
    fragments = [];
  };
  const flushList = () => {
    const items = listItems.map(clean).filter(item => countWords(item) >= 2);
    if (items.length >= 3) blocks.push({ type: "list", items, ordered: listOrdered });
    else if (items.length) fragments.push(items.join(" "));
    listItems = [];
    listOrdered = false;
  };

  for (const block of post.body || []) {
    if (["image", "video"].includes(block.type)) {
      flushList(); flushFragments(); blocks.push(block); continue;
    }
    if (block.type === "list") {
      flushList(); flushFragments();
      const items = (block.items || []).map(clean).filter(acceptableSentence);
      if (items.length >= 3) blocks.push({ type: "list", items, ordered: Boolean(block.ordered) });
      else fragments.push(items.join(" "));
      continue;
    }
    const text = sentenceParts(block.text).filter(acceptableSentence).join(" ");
    if (!text) continue;
    if (["h2", "h3"].includes(block.type) && countWords(text) <= 15) {
      flushList(); flushFragments(); blocks.push({ type: "h2", text: text.replace(/[:.]+$/, "") }); continue;
    }
    const isBullet = bullet.test(text) || numbered.test(text);
    const stripped = text.replace(bullet, "").replace(numbered, "").trim();
    if (isBullet) {
      flushFragments();
      const ordered = numbered.test(text);
      if (listItems.length && ordered !== listOrdered) flushList();
      listOrdered = ordered;
      listItems.push(stripped);
      continue;
    }
    flushList();
    if (countWords(stripped) < 18) {
      fragments.push(stripped);
      if (countWords(fragments.join(" ")) >= 35) flushFragments();
      continue;
    }
    flushFragments();
    for (const paragraph of splitLongParagraph(stripped)) blocks.push({ type: "p", text: paragraph });
  }
  flushList(); flushFragments();

  const deduped = [];
  const seen = new Set();
  for (const block of blocks) {
    if (block.type === "p" || block.type === "h2") {
      const key = clean(block.text).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
    }
    deduped.push(block);
  }
  return deduped;
}

function splitLongParagraph(text) {
  if (countWords(text) <= 105) return [text];
  const sentences = sentenceParts(text);
  const paragraphs = [];
  let current = [];
  for (const sentence of sentences) {
    if (countWords([...current, sentence].join(" ")) > 85 && current.length) {
      paragraphs.push(clean(current.join(" "))); current = [];
    }
    current.push(sentence);
  }
  if (current.length) paragraphs.push(clean(current.join(" ")));
  return paragraphs;
}

function textBlocks(blocks) {
  return blocks.filter(block => block.type === "p" || block.type === "list");
}

function blockText(block) {
  return block.type === "list" ? block.items.join(" ") : block.text || "";
}

function uniqueExcerpt(original, normalized) {
  const candidates = [...textBlocks(normalized).map(blockText), original.excerpt]
    .flatMap(sentenceParts)
    .filter(acceptableSentence)
    .filter(sentence => countWords(sentence) >= 8);
  let excerpt = "";
  for (const sentence of candidates) {
    if (excerpt && excerpt.toLowerCase().includes(sentence.toLowerCase())) continue;
    if (`${excerpt} ${sentence}`.trim().length > 205) break;
    excerpt = clean(`${excerpt} ${sentence}`);
    if (excerpt.length >= 120) break;
  }
  return excerpt || `What ${subjectFor(original.title).toLowerCase()} requires in a real pharmaceutical or medical sales job search.`;
}

function sourceParagraph(source, subject) {
  const text = `For “${subject},” use current employer requirements as the deciding evidence. ${source.short[0].toUpperCase()}${source.short.slice(1)} ${source.context}. Compare that occupation-level context with the responsibilities and qualifications in the actual opening. The public description is context, not a promise that one background, course, or tactic will produce a job offer.`;
  const linked = source.short;
  const start = text.toLowerCase().indexOf(linked.toLowerCase());
  return {
    type: "p",
    text,
    runs: [
      { text: text.slice(0, start) },
      { text: text.slice(start, start + linked.length), url: source.url },
      { text: text.slice(start + linked.length) },
    ],
  };
}

function topicCopy(topic, subject, material) {
  const first = clean(blockText(material[0] || {}));
  const middle = clean(blockText(material[Math.floor(material.length / 2)] || material[0] || {}));
  const last = clean(blockText(material.at(-1) || material[0] || {}));
  const copy = {
    entry: {
      section: "Connect your experience to the role",
      actions: [
        `Compare ${subject.toLowerCase()} with the requirements in several current openings.`,
        `Choose one example from your own work that proves the closest relevant skill.`,
        `Name the remaining gap honestly and decide how you will address it.`,
      ],
      questions: [
        "Which experience should a candidate lead with?",
        "How can transferable experience support an application?",
        "What should be verified before applying?",
      ],
    },
    interview: {
      section: "Prepare evidence for the interview",
      actions: [
        `Mark the responsibilities the employer emphasizes for this interview.`,
        `Prepare a truthful example that shows your own action and the actual result.`,
        `Practice the order of the example without memorizing a speech.`,
      ],
      questions: [
        "What should a candidate prepare before the interview?",
        "What if the candidate lacks direct pharmaceutical sales experience?",
        "How much of an interview answer should be scripted?",
      ],
    },
    resume: {
      section: `Turn the lesson into résumé evidence`,
      actions: [
        `Compare the résumé with the exact opening connected to ${subject.toLowerCase()}.`,
        `Replace generic duties with accurate actions, context, and supportable outcomes.`,
        `Remove every keyword or number that cannot be explained in an interview.`,
      ],
      questions: [
        "What belongs on a pharmaceutical sales résumé?",
        `Should the same résumé be used for every application?`,
        `Can transferable skills replace a stated requirement?`,
      ],
    },
    networking: {
      section: `Make the networking request specific`,
      actions: [
        `Research the person and the role before raising ${subject.toLowerCase()}.`,
        `Ask one question that the job posting cannot answer.`,
        `Use the answer before requesting another favor or introduction.`,
      ],
      questions: [
        "What is a reasonable first networking request?",
        `Should the first message ask for a referral?`,
        `What should happen when a contact does not respond?`,
      ],
    },
    performance: {
      section: "Turn the lesson into a repeatable sales practice",
      actions: [
        `Set one learning objective before the next customer conversation.`,
        `Use approved information and acknowledge questions that exceed your role.`,
        `Record the commitment, unanswered question, and appropriate follow-up.`,
      ],
      questions: [
        "How can this lesson change day-to-day sales work?",
        `How should a representative handle a question they cannot answer?`,
        `What should be reviewed after the customer conversation?`,
      ],
    },
    credential: {
      section: `Verify the requirement before paying`,
      actions: [
        `Compare the credential language in several current openings related to ${subject.toLowerCase()}.`,
        `Ask the employer or an authorized recruiter when a requirement is unclear.`,
        `Evaluate training by its curriculum, evidence, total cost, and written terms.`,
      ],
      questions: [
        "Is one credential required for pharmaceutical sales?",
        `Can a course guarantee a pharmaceutical sales job?`,
        `What should be checked before paying for training?`,
      ],
    },
    compensation: {
      section: `Read compensation in context`,
      actions: [
        `Separate base pay, incentive pay, benefits, and expenses when evaluating ${subject.toLowerCase()}.`,
        `Check the employer, territory, product, quota, and plan rules behind any number.`,
        `Treat occupation-level figures as context rather than a personal earnings promise.`,
      ],
      questions: [
        "What determines pharmaceutical sales compensation?",
        `Does an industry average predict one person’s offer?`,
        `What should be verified before comparing two compensation plans?`,
      ],
    },
    age: {
      section: `Separate evidence from assumptions about age`,
      actions: [
        `Compare the role requirements with current evidence from your own work.`,
        `Document specific hiring information instead of assuming why one decision occurred.`,
        `Use qualified legal guidance for an actual discrimination concern.`,
      ],
      questions: [
        "What can an experienced candidate control?",
        `Does one rejection prove age discrimination?`,
        `Where should a candidate take a specific legal concern?`,
      ],
    },
  }[topic];

  const snippets = [first, middle, last].map((value, index) => {
    const sentences = sentenceParts(value).filter(acceptableSentence);
    const selected = sentences[index % Math.max(sentences.length, 1)] || sentences[0] || "";
    return selected.length > 260 ? `${selected.slice(0, 257).replace(/\s+\S*$/, "")}…` : selected;
  });
  const fallbackAnswers = [
    `For “${subject},” start with evidence you can explain under follow-up questions. The archived article begins from this specific point: ${snippets[0]}`,
    `Use the lesson in “${subject}” to organize truthful experience around the employer’s stated need. One useful distinction preserved in the article is: ${snippets[1]}`,
    `Before acting on “${subject},” check the current role, the source behind factual claims, and any advice that depends on individual circumstances. The article closes on this practical point: ${snippets[2]}`,
  ];
  return { ...copy, answers: fallbackAnswers };
}

function splitMaterial(material) {
  const total = material.length;
  const firstCut = Math.max(1, Math.ceil(total / 3));
  const secondCut = Math.max(firstCut + 1, Math.ceil(total * 2 / 3));
  return [material.slice(0, firstCut), material.slice(firstCut, secondCut), material.slice(secondCut)];
}

function ensureMaterial(material, subject, topic) {
  const additions = {
    entry: `A useful answer to “${subject}” has to connect a real background with a real opening. Broad enthusiasm matters less than evidence that an employer can understand and question.`,
    interview: `The value of “${subject}” is preparation that survives follow-up questions. A candidate should be able to explain the situation, personal action, actual outcome, and relevance without borrowing another person’s story.`,
    resume: `The résumé decision in “${subject}” is one of evidence and emphasis. A truthful bullet should make the candidate’s action understandable and connect it to the opening without pretending that adjacent experience is identical.`,
    networking: `The relationship question in “${subject}” is whether the request is informed and reasonable. Research, context, and a focused question give the other person a useful way to respond.`,
    performance: `The sales lesson in “${subject}” becomes useful when it changes preparation, listening, or follow-through. It should not be treated as a guarantee about a customer, quota, commission, or territory.`,
    credential: `The decision in “${subject}” belongs to the employer’s current requirements and the training provider’s written terms. A course can support learning, but it cannot create a hiring guarantee.`,
    compensation: `The number in “${subject}” needs context. Base pay, incentive design, territory, product, experience, expenses, and benefits can change what two apparently similar offers mean.`,
    age: `The concern in “${subject}” deserves specific evidence. Career positioning advice can help a candidate present current value, but it cannot determine why an employer made a decision or replace qualified legal guidance.`,
  }[topic];
  const output = [...material];
  while (output.filter(block => ["p", "list"].includes(block.type)).length < 5) {
    output.push({ type: "p", text: additions });
    if (output.filter(block => ["p", "list"].includes(block.type)).length < 5) {
      output.push({ type: "p", text: `${additions} Apply that distinction to the facts preserved in this archived article before choosing the next step.` });
    }
  }
  return output;
}

function revise(original) {
  const title = cleanTitle(original.title);
  const subject = subjectFor(title);
  const topic = topicFor({ ...original, title });
  const isTexasArticle = original.slug === "pharmaceutical-sales-representative-in-texas";
  const source = isTexasArticle ? sourceCatalog.texas : sourceCatalog[topic];
  const normalized = normalizeSource(original);
  const media = normalized.filter(block => ["image", "video"].includes(block.type));
  const preservedHeadings = normalized.filter(block => block.type === "h2");
  let material = normalized.filter(block => !["image", "video", "h2"].includes(block.type));
  if (isTexasArticle) {
    material.unshift({
      type: "p",
      text: "Texas candidates should verify the territory, travel area, product type, and employer requirements in each current posting. Texas Career Check groups comparable work under technical and scientific sales; the archived article itself focuses on application habits rather than making Texas-specific licensing or employer claims.",
    });
  }
  material = ensureMaterial(material, subject, topic);
  const [first, second, third] = splitMaterial(material);
  const topical = topicCopy(topic, subject, material);
  if (isTexasArticle) {
    topical.actions[0] = "Compare several current Texas openings by city, territory, travel expectations, product type, and stated qualifications.";
  }
  const excerpt = uniqueExcerpt(original, material);

  const body = [
    ...first,
    { type: "h2", text: "The problem this article addresses" },
    ...second,
    ...(preservedHeadings.slice(0, 1)),
    { type: "h2", text: topical.section },
    ...third,
    ...media,
    { type: "h2", text: "How to apply the lesson" },
    { type: "list", items: topical.actions, ordered: false },
    { type: "h2", text: "What to verify before acting" },
    sourceParagraph(source, subject),
    { type: "h2", text: "Frequently asked questions" },
    ...topical.questions.flatMap((question, index) => [
      { type: "h3", text: question },
      { type: "p", text: topical.answers[index] },
    ]),
  ];

  const revisedWords = body.reduce((sum, block) => sum + countWords(blockText(block)), 0);
  return {
    post: {
      ...original,
      title,
      excerpt,
      tags: [labels[topic], ...(original.tags || []).filter(tag => !/^career advice$/i.test(tag))].slice(0, 5),
      body,
      sources: [source],
      modified: "2026-10-02",
      formatVersion: "editorial-v2",
      editorialStatus: "editorial-review-ready",
      editorialNote: "Restored from the original archived article and revised with assisted editing. Employer requirements and individual outcomes vary.",
      editorialRevision: {
        originalFile: originals.slice(0, 3).some(item => item.slug === original.slug)
          ? "migration/editorial-originals.json"
          : "migration/editorial-originals-all.json",
        prepared: "2026-10-02",
        authorReview: "pending",
        method: "Source-preserving editorial rewrite; retained unique archived material, removed social-platform residue, added semantic structure, FAQs, practical actions, and a relevant primary source.",
      },
    },
    review: {
      slug: original.slug,
      originalTitle: original.title,
      revisedTitle: title,
      topic,
      source: source.url,
      originalWords: (original.body || []).reduce((sum, block) => sum + countWords(blockText(block)), 0),
      revisedWords,
      headings: body.filter(block => block.type === "h2").length,
      faqs: body.filter(block => block.type === "h3").length,
      preservedBlocks: material.length,
      checks: {
        answerFirst: ["p", "list"].includes(body[0]?.type),
        listsAtLeastThree: body.filter(block => block.type === "list").every(block => block.items.length >= 3),
        sourceLinked: body.some(block => block.runs?.some(run => run.url === source.url)),
        distinctExcerpt: !/^A practical guide to/i.test(excerpt),
        authorReview: "pending",
      },
    },
  };
}

const revisedBySlug = new Map(queue.map(current => {
  const original = originalsBySlug.get(current.slug);
  if (!original) throw new Error(`Missing source record for ${current.slug}`);
  return [current.slug, revise(original)];
}));

const revisedPosts = posts.map(post => revisedBySlug.get(post.slug)?.post || post);
const reviews = [...revisedBySlug.values()].map(item => item.review);
writeFileSync(postsUrl, `${JSON.stringify(revisedPosts, null, 2)}\n`);
writeFileSync(reportUrl, `${JSON.stringify(reviews, null, 2)}\n`);
console.log(`Rewrote ${reviews.length} editorial drafts from their archived source records.`);
