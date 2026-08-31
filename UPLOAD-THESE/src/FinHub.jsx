import React, { useState, useEffect, useRef, useMemo, useContext } from "react";

// FINHUB — CONTENT DATA LAYER
// Content is separated from components. Every entity carries an id, a type and
// relationships, which together form the FinHub knowledge graph.

const DOMAINS = [
  { id: 'fundamentals', icon: 'fundamentals', img: 'fundamentals', name: 'Finance Fundamentals',
    kicker: 'Where every path begins',
    blurb: 'Money, time, interest, risk, and the statements that record them.',
    categories: [
      { id: 'money-time', name: 'Money & Time', subcategories: ['Money', 'Time Value of Money', 'Interest', 'Compounding', 'Present & Future Value', 'Annuities'] },
      { id: 'risk-return', name: 'Risk & Return', subcategories: ['Risk', 'Return', 'Real vs Nominal', 'Risk Tolerance', 'Diversification Basics'] },
      { id: 'statements', name: 'Financial Statements', subcategories: ['Balance Sheet', 'Income Statement', 'Cash Flow', 'Ratios', 'Notes & Disclosures', 'Accounting Principles'] },
      { id: 'fin-math', name: 'Financial Mathematics', subcategories: ['Percentages & Growth', 'CAGR', 'Averages & Weighting', 'Probability Basics'] },
      { id: 'decisions', name: 'Financial Decisions', subcategories: ['Budgeting', 'Saving', 'Borrowing', 'Emergency Reserves', 'Financial Goals'] },
    ] },

  { id: 'investments', icon: 'investments', img: 'investments', name: 'Investments',
    kicker: 'Turning capital into claims',
    blurb: 'Asset classes, portfolios, analysis and the discipline of allocation.',
    categories: [
      { id: 'principles', name: 'Investment Principles', subcategories: ['Investment Objectives', 'Time Horizon', 'Liquidity Needs', 'Cost of Investing'] },
      { id: 'asset-classes', name: 'Asset Classes', subcategories: ['Equity', 'Fixed Income', 'Cash & Equivalents', 'Real Assets', 'Gold & Commodities'] },
      { id: 'vehicles', name: 'Investment Vehicles', subcategories: ['Mutual Funds', 'ETFs', 'Index Funds', 'SIP', 'Direct vs Regular Plans'] },
      { id: 'portfolio', name: 'Portfolio Management', subcategories: ['Diversification', 'Asset Allocation', 'Rebalancing', 'Correlation', 'Portfolio Risk'] },
      { id: 'analysis', name: 'Analysis', subcategories: ['Fundamental Analysis', 'Technical Analysis', 'Valuation Multiples', 'Quality of Earnings'] },
      { id: 'performance', name: 'Performance Evaluation', subcategories: ['Absolute vs Relative Return', 'Benchmarking', 'Risk-Adjusted Return', 'Tracking Error'] },
      { id: 'strategies', name: 'Investment Strategies', subcategories: ['Value Investing', 'Growth Investing', 'Passive Investing', 'Dividend Investing'] },
    ] },

  { id: 'markets', icon: 'markets', img: 'markets', name: 'Financial Markets',
    kicker: 'Where prices are discovered',
    blurb: 'The markets that move capital, and the participants who move them.',
    categories: [
      { id: 'market-types', name: 'Market Types', subcategories: ['Equity Markets', 'Debt Markets', 'Money Markets', 'Capital Markets', 'Commodity Markets', 'Currency Markets'] },
      { id: 'structure', name: 'Market Structure', subcategories: ['Primary vs Secondary Market', 'Exchanges', 'Clearing & Settlement', 'Order Types', 'Lot Size'] },
      { id: 'mechanics', name: 'Market Mechanics', subcategories: ['Price Discovery', 'Liquidity', 'Bid-Ask Spread', 'Volatility', 'Market Efficiency'] },
      { id: 'indices', name: 'Indices', subcategories: ['Market Indices', 'Index Construction', 'Free Float Weighting', 'Sector Indices'] },
      { id: 'participants', name: 'Participants', subcategories: ['Retail Investors', 'Institutional Investors', 'Market Makers', 'Regulators'] },
    ] },

  { id: 'corporate', icon: 'corporate', name: 'Corporate Finance',
    kicker: 'How firms fund and choose',
    blurb: 'Investment, financing and dividend decisions inside a company.',
    categories: [
      { id: 'investment-decision', name: 'Investment Decisions', subcategories: ['NPV', 'IRR', 'Payback Period', 'Capital Budgeting', 'Project Risk'] },
      { id: 'financing-decision', name: 'Financing Decisions', subcategories: ['Cost of Capital', 'WACC', 'Capital Structure', 'Leverage', 'Debt vs Equity'] },
      { id: 'dividend', name: 'Dividend Decisions', subcategories: ['Dividend Policy', 'Payout Ratio', 'Share Buybacks', 'Retained Earnings'] },
      { id: 'working-capital', name: 'Working Capital', subcategories: ['Working Capital Cycle', 'Inventory Management', 'Receivables', 'Cash Management'] },
      { id: 'valuation', name: 'Corporate Valuation', subcategories: ['Discounted Cash Flow', 'Free Cash Flow', 'Terminal Value', 'Enterprise Value', 'Relative Valuation'] },
      { id: 'ma', name: 'Mergers & Acquisitions', subcategories: ['Types of M&A', 'Synergies', 'Due Diligence', 'Deal Financing'] },
    ] },

  { id: 'banking', icon: 'banking', img: 'banking', name: 'Banking & Institutions',
    kicker: 'The plumbing of finance',
    blurb: 'The institutions that hold, move and create money.',
    categories: [
      { id: 'commercial', name: 'Commercial Banking', subcategories: ['Deposits & Lending', 'Net Interest Margin', 'Credit Appraisal', 'Non-Performing Assets'] },
      { id: 'central', name: 'Central Banking', subcategories: ['Role of a Central Bank', 'Policy Rate', 'Reserve Requirements', 'Lender of Last Resort', 'Money Creation'] },
      { id: 'investment-banking', name: 'Investment Banking', subcategories: ['Underwriting', 'IPO Process', 'Advisory', 'Capital Raising'] },
      { id: 'nbfc', name: 'NBFCs & Insurance', subcategories: ['NBFCs', 'Insurance Principles', 'Underwriting Risk', 'Asset-Liability Management'] },
      { id: 'payments', name: 'Payment Systems', subcategories: ['Payment Rails', 'Settlement Systems', 'Digital Payments'] },
      { id: 'bank-risk', name: 'Banking Risk', subcategories: ['Capital Adequacy', 'Liquidity Risk in Banks', 'Bank Runs', 'Regulation & Supervision'] },
    ] },

  { id: 'derivatives', icon: 'derivatives', img: 'derivatives', name: 'Derivatives & Risk',
    kicker: 'Pricing the uncertain',
    blurb: 'Contracts derived from other assets, and the taxonomy of risk.',
    categories: [
      { id: 'foundations', name: 'Foundations', subcategories: ['What is a Derivative', 'Underlying Asset', 'Contract Specifications', 'Margin'] },
      { id: 'futures', name: 'Futures & Forwards', subcategories: ['Forwards', 'Futures', 'Contract Size & Lot Size', 'Mark to Market', 'Basis'] },
      { id: 'options', name: 'Options', subcategories: ['Call Options', 'Put Options', 'Strike & Premium', 'Payoff Diagrams', 'Intrinsic & Time Value', 'Option Greeks'] },
      { id: 'swaps', name: 'Swaps', subcategories: ['Interest Rate Swaps', 'Currency Swaps'] },
      { id: 'uses', name: 'Uses of Derivatives', subcategories: ['Hedging', 'Speculation', 'Arbitrage', 'Derivative Strategies'] },
      { id: 'risk-types', name: 'Risk Types', subcategories: ['Market Risk', 'Credit Risk', 'Liquidity Risk', 'Operational Risk', 'Systemic Risk'] },
      { id: 'risk-mgmt', name: 'Risk Management', subcategories: ['Risk Identification', 'Value at Risk', 'Stress Testing', 'Position Sizing'] },
    ] },

  { id: 'economics', icon: 'economics', img: 'economics', name: 'Economics & Global Finance',
    kicker: 'The forces above the firm',
    blurb: 'Growth, prices, policy and the cycles they produce.',
    categories: [
      { id: 'macro', name: 'Macro Foundations', subcategories: ['GDP', 'Inflation', 'Interest Rates', 'Unemployment', 'Business Cycle'] },
      { id: 'policy', name: 'Policy', subcategories: ['Monetary Policy', 'Fiscal Policy', 'Policy Transmission', 'Government Debt'] },
      { id: 'external', name: 'External Sector', subcategories: ['Exchange Rates', 'International Trade', 'Balance of Payments', 'Capital Flows'] },
      { id: 'cycles', name: 'Crises & Cycles', subcategories: ['Recessions', 'Financial Crises', 'Asset Bubbles', 'Contagion'] },
    ] },

  { id: 'fintech', icon: 'fintech', name: 'FinTech',
    kicker: 'Finance rebuilt as software',
    blurb: 'Payments, lending and infrastructure delivered without a counter.',
    categories: [
      { id: 'payments-infra', name: 'Payments & Infrastructure', subcategories: ['Digital Payment Systems', 'Real-Time Settlement', 'Digital Money'] },
      { id: 'delivery', name: 'New Delivery Models', subcategories: ['Digital Lending', 'Neobanks', 'Embedded Finance', 'Robo-Advisory'] },
      { id: 'data', name: 'Data & Infrastructure', subcategories: ['Credit Scoring Models', 'Open Banking', 'Financial Data Security'] },
    ] },

  { id: 'global', icon: 'global', name: 'Global Finance',
    kicker: 'Capital without borders',
    blurb: 'Currencies, cross-border flows and the institutions that govern them.',
    categories: [
      { id: 'global-markets', name: 'Global Markets', subcategories: ['Global Equity Markets', 'Global Bond Markets', 'Eurodollar Market'] },
      { id: 'currencies', name: 'Currencies', subcategories: ['Foreign Exchange', 'Reserve Currencies', 'Currency Pegs', 'Currency Risk'] },
      { id: 'institutions', name: 'Global Institutions', subcategories: ['IMF', 'World Bank', 'Bank for International Settlements'] },
      { id: 'cross-border', name: 'Cross-Border Finance', subcategories: ['Foreign Direct Investment', 'Portfolio Flows', 'Sovereign Debt'] },
    ] },

  { id: 'origins', icon: 'history', name: 'Origins of Finance',
    kicker: 'Where it began',
    blurb: 'The Indian tradition and the global one, read side by side.', route: '#/origins' },

  { id: 'history', icon: 'history', name: 'Financial History',
    kicker: 'How we got here',
    blurb: 'From certificates and trading floors to a market that fits in a pocket.',
    route: '#/history',
    categories: [
      { id: 'money-evolution', name: 'Evolution of Money', subcategories: ['Barter to Coinage', 'Paper Money', 'The Gold Standard', 'Fiat Money'] },
      { id: 'banking-evolution', name: 'Evolution of Banking', subcategories: ['Deposit Banking', 'Fractional Reserve', 'Modern Central Banking'] },
      { id: 'market-evolution', name: 'Evolution of Markets', subcategories: ['Early Exchanges', 'Joint Stock Companies', 'Modern Market Structure'] },
      { id: 'crises', name: 'Major Crises', subcategories: ['Speculative Manias', 'The Great Depression', 'The 2008 Crisis'] },
    ] },

  { id: 'case-studies', icon: 'cases', img: 'cases', name: 'Case Studies',
    kicker: 'Finance as it actually happened',
    blurb: 'Decisions, outcomes, and the concepts that explain them.', route: '#/cases' },

  { id: 'frauds', icon: 'frauds', img: 'frauds', name: 'Financial Frauds',
    kicker: 'Mechanisms, not morality tales',
    blurb: 'How the deception worked, and which numbers gave it away.', route: '#/frauds' },

  { id: 'scenarios', icon: 'scenarios', img: 'scenarios', name: 'Scenario Analysis',
    kicker: 'Cause and effect, traced',
    blurb: 'Follow a shock from event to financial implication.', route: '#/scenarios' },

  { id: 'intelligence', icon: 'intelligence', name: 'Financial Intelligence',
    kicker: 'Reading the ecosystem',
    blurb: 'How a single change moves through banks, lenders, firms and prices.', route: '#/intelligence' },

  { id: 'visualisations', icon: 'visualisations', name: 'Financial Visualisations',
    kicker: 'Structure made visible',
    blurb: 'Flows, maps and relationships you can move through.', route: '#/graph' },

  { id: 'glossary', icon: 'glossary', name: 'Financial Glossary',
    kicker: 'Precise language',
    blurb: 'Definitions that link back into the deeper structure.', route: '#/glossary' },

  { id: 'tools', icon: 'tools', name: 'Financial Tools',
    kicker: 'Numbers you can move',
    blurb: 'Calculators that connect back to the concept behind them.', route: '#/tools' },

  { id: 'simulator', icon: 'markets', name: 'Simulator',
    kicker: 'Learn by doing',
    blurb: 'An educational market simulation. No live prices, no real orders.', route: '#/floor' },
];


// ---------------------------------------------------------------------------
// CONCEPTS
// ---------------------------------------------------------------------------

const CONCEPTS = [
  {
    id: "equity-markets",
    title: "Equity Markets",
    domain: "markets",
    category: "market-types",
    subcategory: "Equity Markets",
    level: "Foundational",
    oneLine: "Where ownership in companies is issued, priced and transferred between people who have never met.",
    what: "An equity market is the system through which shares in companies are issued and traded. It has two halves. The primary market is where a company raises new capital by issuing shares for the first time. The secondary market is where those shares are subsequently bought and sold among investors, with no new money reaching the company. Both are needed: without a secondary market where shares can be sold, few investors would buy in the primary market at all.",
    simple: "One half lets companies raise money. The other half lets investors get out. Neither works without the other.",
    why: "Equity markets do two things that matter to an economy: they channel savings into productive businesses, and they price those businesses continuously. That price then guides where further capital goes, which is why market quality matters beyond the investors directly involved.",
    components: [
      {
        k: "Primary market",
        v: "New shares issued; capital reaches the company."
      },
      {
        k: "Secondary market",
        v: "Existing shares change hands; capital moves between investors."
      },
      {
        k: "Exchange",
        v: "The regulated venue where orders meet and prices form."
      },
      {
        k: "Depository",
        v: "Holds shares electronically, removing physical certificates from the process."
      }
    ],
    misconceptions: [
      {
        claim: "“When a share price rises, the company receives money.”",
        truth: "Only in the primary market does the company receive anything. Secondary market trading transfers money between investors; the company is not a party to it."
      },
      {
        claim: "“The market reflects the economy.”",
        truth: "It reflects expectations about listed companies, which are a subset of an economy and often not a representative one."
      }
    ],
    application: ["Understanding what an IPO actually is.", "Distinguishing a company raising capital from a share simply changing hands."],
    related: ["equity", "price-discovery", "market-indices", "market-participants"],
    prereq: ["equity"],
    next: ["price-discovery", "market-indices"],
  },
  {
    id: "debt-markets",
    title: "Debt Markets",
    domain: "markets",
    category: "market-types",
    subcategory: "Debt Markets",
    level: "Core",
    oneLine: "Where borrowing is issued and traded, and where the price of money across time is actually set.",
    what: "The debt market is where governments and companies borrow by issuing tradable securities, and where those securities are subsequently traded. Government securities usually form the largest and most liquid segment, and their yields become the benchmark against which every other borrowing in that currency is priced. Corporate borrowing is priced as a spread above that benchmark, reflecting credit risk.",
    simple: "Governments and companies borrow by issuing paper that promises repayment. That paper then trades, and its price tells you what borrowing costs.",
    why: "Debt markets are larger than equity markets in most economies and matter more to the transmission of policy. When a central bank changes its rate, the debt market is what translates that decision into the cost of borrowing for everyone else.",
    components: [
      {
        k: "Government securities",
        v: "Sovereign borrowing; the benchmark for the currency."
      },
      {
        k: "Corporate bonds",
        v: "Company borrowing, priced at a spread over the benchmark."
      },
      {
        k: "Yield curve",
        v: "The relationship between yield and maturity for comparable credit quality."
      },
      {
        k: "Credit spread",
        v: "The additional yield demanded for default risk."
      }
    ],
    interpretation: "The shape of the yield curve carries information. When long yields sit below short yields, the market is signalling an expectation that rates will fall, which usually means it expects weaker growth ahead.",
    misconceptions: [
      {
        claim: "“Bond markets are quiet and unimportant.”",
        truth: "They are typically several times larger than equity markets and set the discount rate used to value everything else, including equities."
      }
    ],
    application: ["Reading what the yield curve implies about expectations.", "Understanding how policy reaches household and corporate borrowing costs."],
    related: ["bond-pricing", "interest-rates", "fixed-income", "credit-risk"],
    prereq: ["bond-pricing"],
    next: ["price-discovery"],
  },
  {
    id: "money-markets",
    title: "Money Markets",
    domain: "markets",
    category: "market-types",
    subcategory: "Money Markets",
    level: "Core",
    oneLine: "Very short-term borrowing and lending, where institutions manage cash rather than invest it.",
    what: "The money market covers borrowing and lending for short periods, typically up to one year and often overnight. Instruments include treasury bills, commercial paper, certificates of deposit and repurchase agreements. Participants are mainly banks, corporates and funds managing surplus or deficit cash rather than seeking investment return.",
    simple: "Where large institutions park spare cash for a night, or borrow for a night to cover a gap.",
    why: "This is where monetary policy first takes effect. The policy rate anchors overnight rates here, and everything else in the financial system is built on that anchor. It is also where funding stress appears first, because institutions must access it daily.",
    components: [
      {
        k: "Treasury bills",
        v: "Short-term government borrowing, issued at a discount to face value."
      },
      {
        k: "Commercial paper",
        v: "Short-term unsecured corporate borrowing."
      },
      {
        k: "Repurchase agreement",
        v: "Borrowing against securities as collateral, repaid shortly after."
      },
      {
        k: "Call money",
        v: "Overnight inter-bank lending."
      }
    ],
    realWorld: "When institutions cannot roll over money market funding, failure follows quickly regardless of the strength of their long-term assets. This is the mechanism behind both the 2008 crisis and the IL&FS default.",
    caseRef: "ilfs-2018",
    application: ["Understanding where policy rate changes first bite.", "Recognising funding stress before it reaches other markets."],
    related: ["interest-rates", "liquidity-risk", "central-banking", "monetary-policy"],
    prereq: ["interest-rates"],
    next: ["liquidity-risk"],
  },
  {
    id: "currency-markets",
    title: "Currency Markets",
    domain: "markets",
    category: "market-types",
    subcategory: "Currency Markets",
    level: "Core",
    oneLine: "Where one currency is exchanged for another, and where every price is a relationship rather than a level.",
    what: "The foreign exchange market is where currencies are traded against one another. It is the largest financial market by turnover and operates continuously across time zones. Prices are always quoted as pairs, because a currency has no price by itself — it only has a value relative to another currency.",
    simple: "Nothing here has a price on its own. Everything is priced against something else.",
    why: "Exchange rates determine the cost of imports, the competitiveness of exports, the value of foreign investments and the burden of foreign currency debt. For any economy that trades, this market touches almost everything.",
    components: [
      {
        k: "Currency pair",
        v: "The two currencies being exchanged, quoted one against the other."
      },
      {
        k: "Spot rate",
        v: "The rate for immediate exchange."
      },
      {
        k: "Forward rate",
        v: "A rate agreed today for exchange at a future date."
      },
      {
        k: "Appreciation and depreciation",
        v: "A rise or fall in one currency's value against another."
      }
    ],
    example: {
      setup: "An importer owes US$50,000 in three months. The rate today is ₹83 per dollar.",
      steps: ["Cost at today's rate = 50,000 × 83 = ₹41,50,000", "If the rupee weakens to ₹87 = 50,000 × 87 = ₹43,50,000", "Additional cost from the currency move alone = ₹2,00,000"],
      result: "₹2,00,000 more, with nothing else changed",
      note: "The goods, the supplier and the quantity were identical. The entire difference is currency risk."
    },
    misconceptions: [
      {
        claim: "“A strong currency is always good for an economy.”",
        truth: "It makes imports cheaper and exports less competitive. Whether it helps depends entirely on the structure of the economy in question."
      }
    ],
    application: ["Assessing the currency exposure of a business.", "Understanding why exporters and importers respond oppositely to the same move."],
    related: ["hedging", "inflation", "interest-rates", "currency-risk"],
    prereq: [],
    next: ["currency-risk", "hedging"],
  },
  {
    id: "price-discovery",
    title: "Price Discovery",
    domain: "markets",
    category: "mechanics",
    subcategory: "Price Discovery",
    level: "Core",
    oneLine: "The process by which many separate opinions become one number.",
    what: "Price discovery is the mechanism through which the buying and selling decisions of many participants produce a single market price. Each participant acts on their own information and judgement; the price that results is the point at which willing buyers and willing sellers balance. The price is not a measurement of value — it is the outcome of a negotiation conducted at scale.",
    simple: "Nobody decides the price. It is what is left when everyone has acted on what they believe.",
    why: "Prices produced this way carry information. They aggregate the views of everyone participating, including people who know things you do not. That is why a market price deserves respect even when you disagree with it — and why understanding what it is not matters equally.",
    components: [
      {
        k: "Order flow",
        v: "The stream of buy and sell instructions arriving at the market."
      },
      {
        k: "Bid and ask",
        v: "The highest price a buyer will pay and the lowest a seller will accept."
      },
      {
        k: "Depth",
        v: "How much volume sits near the current price, and so how far a large order moves it."
      },
      {
        k: "Information",
        v: "What participants know, and how quickly it reaches the price."
      }
    ],
    misconceptions: [
      {
        claim: "“The market price is the correct value.”",
        truth: "It is the current consensus, which can be badly wrong — as any bubble demonstrates afterwards. It is the best available estimate, not a verified fact."
      },
      {
        claim: "“Prices move because of buying and selling volume.”",
        truth: "Every trade has a buyer and a seller in equal measure. Prices move when one side is more urgent than the other, not because there is more buying."
      }
    ],
    application: ["Interpreting what a price does and does not tell you.", "Understanding why illiquid assets have unreliable prices."],
    related: ["market-liquidity", "equity-markets", "market-risk"],
    prereq: [],
    next: ["market-liquidity"],
  },
  {
    id: "market-liquidity",
    title: "Liquidity",
    domain: "markets",
    category: "mechanics",
    subcategory: "Liquidity",
    level: "Core",
    oneLine: "How easily something can be sold at close to its last price.",
    what: "Liquidity describes how readily an asset can be converted into cash without materially affecting its price. It has three dimensions: the spread between buying and selling prices, the depth of orders near the current price, and how quickly the price recovers after a large trade. Liquidity is a property of the market at a moment in time, not a permanent feature of an asset.",
    simple: "Can you sell it quickly without dropping the price to do so?",
    formula: {
      main: "Bid-ask spread = Ask price − Bid price",
      others: [
        {
          label: "As a percentage",
          expr: "Spread ÷ Mid price × 100"
        }
      ],
      variables: [
        {
          sym: "Mid price",
          desc: "The midpoint between bid and ask"
        }
      ]
    },
    interpretation: "Liquidity is most abundant when it is least needed and disappears when it matters most. In a crisis every holder wants to sell the same assets at once, and the buyers who normally provide liquidity step back.",
    misconceptions: [
      {
        claim: "“A large asset is a liquid asset.”",
        truth: "Size and liquidity are different. Real estate is valuable and deeply illiquid; a small share can be worth little and trade freely."
      }
    ],
    application: ["Sizing a position to the exit you might actually need.", "Understanding why illiquid holdings carry a discount."],
    related: ["liquidity-risk", "price-discovery", "market-risk"],
    prereq: [],
    next: ["liquidity-risk"],
  },
  {
    id: "market-indices",
    title: "Market Indices",
    domain: "markets",
    category: "indices",
    subcategory: "Market Indices",
    level: "Core",
    oneLine: "A single number standing in for a market — useful, and always a simplification.",
    what: "A market index measures the aggregate movement of a defined set of securities. Constituents are selected by rules and weighted by a chosen method, most commonly by free-float market capitalisation, so larger companies influence the index more. An index is a construction, and different construction rules produce different pictures of the same market.",
    simple: "One number summarising many shares. Which shares, and how they are weighted, decides what that number actually means.",
    why: "Indices provide the benchmark against which performance is judged, and index funds mean enormous sums are invested according to their rules. That makes index construction consequential rather than academic.",
    components: [
      {
        k: "Constituents",
        v: "The securities included, chosen by defined rules."
      },
      {
        k: "Weighting method",
        v: "How much each constituent influences the index."
      },
      {
        k: "Free float",
        v: "Shares actually available for trading, excluding locked-in holdings."
      },
      {
        k: "Rebalancing",
        v: "Periodic review of constituents and weights."
      }
    ],
    example: {
      setup: "A simple index of three companies weighted by market capitalisation: ₹500 crore, ₹300 crore and ₹200 crore.",
      steps: ["Weights = 50%, 30%, 20%", "If the largest rises 10% and the others are flat: index rises 0.5 × 10% = 5%", "If the smallest rises 10% and the others are flat: index rises 0.2 × 10% = 2%"],
      result: "Same 10% move, very different index effect",
      note: "A capitalisation-weighted index says more about its largest constituents than about the average company in it."
    },
    misconceptions: [
      {
        claim: "“The index shows how the average share performed.”",
        truth: "In a capitalisation-weighted index, a handful of large companies can determine the entire movement while most constituents go the other way."
      }
    ],
    application: ["Choosing an appropriate benchmark.", "Understanding what an index fund actually holds."],
    related: ["etf", "equity-markets", "diversification"],
    prereq: ["equity-markets"],
    next: ["etf"],
  },
  {
    id: "market-participants",
    title: "Market Participants",
    domain: "markets",
    category: "participants",
    subcategory: "Institutional Investors",
    level: "Foundational",
    oneLine: "Different players with different objectives and constraints — which is why a market exists at all.",
    what: "A market functions because participants differ. Retail investors invest personal savings. Institutional investors — mutual funds, pension funds, insurers — deploy pooled money under mandates and regulatory constraints. Market makers quote continuous two-way prices and earn the spread. Regulators set and enforce the rules. Each has different objectives and horizons, which is precisely why one is willing to sell what another wants to buy.",
    simple: "If everyone wanted the same thing at the same time for the same reason, there would be no trade. Difference is what makes a market.",
    components: [
      {
        k: "Retail investors",
        v: "Individuals investing their own money, generally with the longest horizons and fewest constraints."
      },
      {
        k: "Institutional investors",
        v: "Managing pooled money under mandates, often with reporting periods that shape behaviour."
      },
      {
        k: "Market makers",
        v: "Provide continuous quotes and liquidity, earning the bid-ask spread."
      },
      {
        k: "Regulators",
        v: "Set disclosure and conduct rules, and enforce them."
      }
    ],
    interpretation: "Knowing who is on the other side explains a great deal of market behaviour. Selling at a loss in December, or buying regardless of price, often reflects a constraint rather than a view.",
    application: ["Interpreting why a market moved without any news.", "Understanding the advantages a retail investor actually has — chiefly, no reporting deadline."],
    related: ["market-liquidity", "equity-markets", "price-discovery", "mutual-funds"],
    prereq: [],
    next: ["price-discovery"],
  },
  {
    id: "capital-budgeting",
    title: "Capital Budgeting",
    domain: "corporate",
    category: "investment-decision",
    subcategory: "Capital Budgeting",
    level: "Core",
    oneLine: "The process by which a company decides which long-term investments to make.",
    what: "Capital budgeting is how a firm evaluates and selects investments in long-lived assets — a plant, a product line, an acquisition. It involves forecasting the incremental cash flows a project would produce, choosing a discount rate that reflects its risk, and applying a decision rule. Because capital is limited and these commitments are difficult to reverse, this is among the most consequential decisions a management makes.",
    simple: "Deciding what to build, buy or launch — and proving with numbers that it is worth doing.",
    components: [
      {
        k: "Incremental cash flow",
        v: "Only cash flows that change because of the decision count."
      },
      {
        k: "Sunk cost",
        v: "Money already spent, which must be excluded however large it was."
      },
      {
        k: "Opportunity cost",
        v: "What the resources would earn in their next best use, which must be included."
      },
      {
        k: "Decision rule",
        v: "NPV, IRR or payback, applied consistently."
      }
    ],
    misconceptions: [
      {
        claim: "“We have already invested so much, we should continue.”",
        truth: "Money already spent is irrecoverable and irrelevant to whether the next rupee should be committed. The only question is whether future cash flows justify future spending."
      },
      {
        claim: "“A shorter payback means a better project.”",
        truth: "Payback ignores everything after the payback date and ignores the time value of money entirely. It is a liquidity check, not a value measure."
      }
    ],
    application: ["Deciding between competing projects under a capital constraint.", "Building a defensible case for a large commitment."],
    caseRef: "capex-decision",
    related: ["discount-rate", "cost-of-capital", "time-value-of-money", "free-cash-flow"],
    prereq: ["discount-rate"],
    next: ["cost-of-capital"],
  },
  {
    id: "cost-of-capital",
    title: "Cost of Capital and WACC",
    domain: "corporate",
    category: "financing-decision",
    subcategory: "WACC",
    level: "Intermediate",
    oneLine: "What a company must earn to satisfy everyone who funded it — the bar every project has to clear.",
    what: "The cost of capital is the return a company must generate to satisfy its providers of finance. Because most firms use both debt and equity, the relevant figure is the weighted average cost of capital, combining the cost of each source in proportion to its use. Interest on debt is generally tax deductible, so the cost of debt is taken after tax.",
    simple: "Lenders want a return. Shareholders want a bigger one. The blend of the two is the minimum the business has to earn.",
    why: "WACC is the discount rate used to value the firm and to test its projects. Set it too low and value-destroying projects get approved; set it too high and good ones are rejected. It is the most consequential single assumption in corporate valuation.",
    formula: {
      main: "WACC = (E/V × Re) + (D/V × Rd × (1 − t))",
      variables: [
        {
          sym: "E",
          desc: "Market value of equity"
        },
        {
          sym: "D",
          desc: "Market value of debt"
        },
        {
          sym: "V",
          desc: "E + D, total capital"
        },
        {
          sym: "Re",
          desc: "Cost of equity"
        },
        {
          sym: "Rd",
          desc: "Cost of debt before tax"
        },
        {
          sym: "t",
          desc: "Corporate tax rate"
        }
      ]
    },
    example: {
      setup: "Equity ₹60 crore costing 14%, debt ₹40 crore costing 9%, tax rate 25%.",
      steps: ["V = 60 + 40 = ₹100 crore", "Equity component = 0.60 × 14% = 8.40%", "Debt component = 0.40 × 9% × (1 − 0.25) = 2.70%", "WACC = 8.40% + 2.70% = 11.10%"],
      result: "11.10%",
      note: "Any project earning less than 11.10% at comparable risk destroys value, however profitable it looks in absolute terms."
    },
    interpretation: "Debt appears cheaper than equity partly because it is senior and contractual, and partly because interest is tax deductible. That does not mean more debt always lowers WACC — beyond a point, the rising probability of distress raises the cost of both debt and equity.",
    limitations: ["The cost of equity is an estimate, not an observable price.", "Assumes a stable capital structure, which often does not hold.", "Using one company-wide WACC for projects of differing risk systematically misprices both."],
    application: ["Setting the hurdle rate for capital budgeting.", "Discounting cash flows in a valuation."],
    related: ["discount-rate", "leverage", "capital-budgeting", "risk-return"],
    prereq: ["discount-rate", "leverage"],
    next: ["free-cash-flow"],
    sim: "compounding",
  },
  {
    id: "capital-structure",
    title: "Capital Structure",
    domain: "corporate",
    category: "financing-decision",
    subcategory: "Capital Structure",
    level: "Intermediate",
    oneLine: "The mix of debt and equity funding a business — and the trade-off that decides it.",
    what: "Capital structure is the combination of debt and equity a company uses to finance its assets. The central trade-off is between the tax advantage of debt, since interest is deductible, and the rising costs of financial distress as leverage increases. The optimal structure is where the marginal benefit of additional debt equals the marginal cost of the distress risk it creates.",
    simple: "Debt is cheaper until it becomes dangerous. The question is where that point sits for this particular business.",
    components: [
      {
        k: "Tax shield",
        v: "The value of tax saved because interest is deductible."
      },
      {
        k: "Distress costs",
        v: "Direct and indirect costs that rise with the probability of default."
      },
      {
        k: "Financial flexibility",
        v: "Retained capacity to borrow when an opportunity or a shock arrives."
      },
      {
        k: "Asset tangibility",
        v: "Firms with pledgeable physical assets can typically support more debt."
      }
    ],
    interpretation: "There is no universal correct ratio. A utility with stable regulated cash flows and physical assets can carry leverage that would be reckless for a software company with volatile revenue and few tangible assets.",
    misconceptions: [
      {
        claim: "“Zero debt is the safest capital structure.”",
        truth: "It forgoes the tax shield and may signal an unwillingness to invest. Safe is not the same as optimal."
      }
    ],
    application: ["Judging whether a company's leverage suits its business.", "Understanding why comparable firms in different industries carry very different debt levels."],
    related: ["leverage", "cost-of-capital", "balance-sheet", "credit-risk"],
    prereq: ["leverage"],
    next: ["cost-of-capital"],
  },
  {
    id: "free-cash-flow",
    title: "Free Cash Flow and DCF",
    domain: "corporate",
    category: "valuation",
    subcategory: "Free Cash Flow",
    level: "Advanced",
    oneLine: "The cash a business genuinely has left, and the method that turns it into a valuation.",
    what: "Free cash flow is the cash generated by operations after the investment needed to maintain and grow the asset base. Discounted cash flow valuation projects those free cash flows forward, discounts them at the weighted average cost of capital, and adds a terminal value representing everything beyond the forecast horizon. The result is an estimate of what the business is worth today.",
    simple: "Work out the cash the business will actually produce, shrink each future year back to today, and add it all up.",
    formula: {
      main: "Value = Σ [ FCFₜ ÷ (1 + WACC)ᵗ ] + Terminal value ÷ (1 + WACC)ⁿ",
      others: [
        {
          label: "Free cash flow to the firm",
          expr: "FCFF = EBIT(1 − t) + Depreciation − Capex − Δ Working capital"
        },
        {
          label: "Terminal value (perpetuity growth)",
          expr: "TV = FCFₙ₊₁ ÷ (WACC − g)"
        }
      ],
      variables: [
        {
          sym: "FCF",
          desc: "Free cash flow in a period"
        },
        {
          sym: "g",
          desc: "Assumed perpetual growth rate, necessarily below long-run economic growth"
        },
        {
          sym: "n",
          desc: "Length of the explicit forecast"
        }
      ]
    },
    example: {
      setup: "A firm expects ₹50 crore of free cash flow next year, growing at 4% forever. WACC is 11%.",
      steps: ["TV = 50 ÷ (0.11 − 0.04)", "TV = 50 ÷ 0.07 = ₹714.3 crore", "If growth is assumed at 5% instead: 50 ÷ 0.06 = ₹833.3 crore"],
      result: "₹714 crore, or ₹833 crore",
      note: "One percentage point of assumed perpetual growth changed the valuation by 17%. This is why terminal assumptions deserve more scrutiny than the detailed forecast years."
    },
    interpretation: "In most DCF valuations, well over half the value sits in the terminal value — a number derived from two assumptions about the distant future. A DCF is not a precise measurement. It is a structured way of making assumptions explicit so they can be argued with.",
    limitations: ["Highly sensitive to the discount rate and the terminal growth assumption.", "Forecast cash flows carry large error beyond a few years.", "Precision in the output creates false confidence about inputs that are estimates."],
    application: ["Valuing a business or an acquisition.", "Testing what the current market price implies about future expectations."],
    caseRef: "nokia-decline",
    related: ["cost-of-capital", "discount-rate", "cash-flow-statement", "fundamental-analysis"],
    prereq: ["cost-of-capital", "cash-flow-statement"],
    next: [],
  },
  {
    id: "working-capital",
    title: "Working Capital",
    domain: "corporate",
    category: "working-capital",
    subcategory: "Working Capital Cycle",
    level: "Core",
    oneLine: "The cash tied up in day-to-day operations, and how long it stays trapped there.",
    what: "Working capital is current assets less current liabilities — the resources funding daily operations. The working capital cycle measures how long cash is tied up between paying suppliers and collecting from customers. A longer cycle means more capital is committed simply to keep operating, regardless of profitability.",
    simple: "You pay for materials today and get paid by customers in sixty days. Someone has to fund that gap, and that someone is you.",
    formula: {
      main: "Cash conversion cycle = Inventory days + Receivable days − Payable days",
      others: [
        {
          label: "Working capital",
          expr: "Current assets − Current liabilities"
        }
      ],
      variables: [
        {
          sym: "Inventory days",
          desc: "How long stock is held before sale"
        },
        {
          sym: "Receivable days",
          desc: "How long customers take to pay"
        },
        {
          sym: "Payable days",
          desc: "How long the firm takes to pay suppliers"
        }
      ]
    },
    example: {
      setup: "Inventory held 45 days, customers pay in 60 days, suppliers are paid in 30 days.",
      steps: ["Cycle = 45 + 60 − 30", "Cycle = 75 days"],
      result: "75 days of operations to fund",
      note: "A growing business with a 75-day cycle consumes cash as it grows. Rapid growth can cause a cash crisis in a perfectly profitable company."
    },
    interpretation: "Growth consumes working capital. This is why profitable companies fail: profit is recognised at the sale, but cash arrives much later, and in between the business still has to pay wages and suppliers.",
    misconceptions: [
      {
        claim: "“More working capital is better.”",
        truth: "Excess working capital is idle cash, slow-moving inventory, or customers who are not paying. It is capital earning nothing."
      }
    ],
    application: ["Diagnosing why a profitable business is short of cash.", "Understanding why fast growth can require new funding."],
    related: ["cash-flow-statement", "balance-sheet", "financial-ratios", "liquidity-risk"],
    prereq: ["balance-sheet"],
    next: ["financial-ratios"],
  },
  {
    id: "dividend-policy",
    title: "Dividend Policy",
    domain: "corporate",
    category: "dividend",
    subcategory: "Dividend Policy",
    level: "Core",
    oneLine: "Whether profits are returned to shareholders or reinvested — and what that choice signals.",
    what: "Dividend policy is a company's approach to distributing profits. Cash can be paid out as dividends, used to repurchase shares, or retained and reinvested. The decision rests on whether the company can reinvest at a return above its cost of capital. If it can, retaining serves shareholders better; if it cannot, paying out does.",
    simple: "If the company can do more with the money than you can, it should keep it. If it cannot, it should give it back.",
    formula: {
      main: "Payout ratio = Dividend per share ÷ Earnings per share",
      others: [
        {
          label: "Retention ratio",
          expr: "1 − Payout ratio"
        },
        {
          label: "Dividend yield",
          expr: "Dividend per share ÷ Share price"
        }
      ]
    },
    interpretation: "Dividend changes carry signalling value. Companies are reluctant to cut dividends because a cut is read as a statement about future prospects, so it communicates more than the amount involved.",
    misconceptions: [
      {
        claim: "“A high dividend yield means a good investment.”",
        truth: "Yield rises when the price falls. A very high yield frequently signals that the market expects the dividend to be cut."
      },
      {
        claim: "“A dividend is free money.”",
        truth: "The company's value falls by roughly the amount paid out. A dividend transfers value from the business to the shareholder rather than creating it."
      }
    ],
    application: ["Judging whether a payout policy suits a company's opportunities.", "Reading what a dividend change signals."],
    related: ["cost-of-capital", "financial-ratios", "equity", "free-cash-flow"],
    prereq: ["financial-ratios"],
    next: ["cost-of-capital"],
  },
  {
    id: "investment-banking",
    title: "Investment Banking",
    domain: "banking",
    category: "investment-banking",
    subcategory: "Underwriting",
    level: "Core",
    oneLine: "Helping companies raise capital and complete transactions — advising rather than lending.",
    what: "Investment banking covers services that help companies and governments raise capital and execute transactions. The main activities are underwriting new share and bond issues, advising on mergers and acquisitions, and arranging financing. Unlike a commercial bank, an investment bank primarily earns fees for services rather than a spread on lending.",
    simple: "A commercial bank lends you money. An investment bank helps you get money from other people, and charges a fee for arranging it.",
    components: [
      {
        k: "Underwriting",
        v: "Committing to place a new issue, sometimes guaranteeing the proceeds."
      },
      {
        k: "Book building",
        v: "Gathering investor demand at various prices to establish an issue price."
      },
      {
        k: "Advisory",
        v: "Guidance on mergers, acquisitions and restructuring, paid by fee."
      },
      {
        k: "Due diligence",
        v: "Verifying the issuer's position before investors are asked to commit."
      }
    ],
    interpretation: "Underwriting involves genuine risk. If a firm-commitment underwriter cannot place the issue at the agreed price, it holds the securities itself — which is why pricing and demand assessment matter so much.",
    misconceptions: [
      {
        claim: "“The IPO price is the fair value of the company.”",
        truth: "It is a negotiated price designed to place the issue successfully. It reflects demand at that moment, not an independent valuation."
      }
    ],
    application: ["Understanding what happens between deciding to list and the shares trading.", "Recognising where the incentives sit in a transaction."],
    related: ["equity-markets", "commercial-banking", "fundamental-analysis", "free-cash-flow"],
    prereq: ["equity-markets"],
    next: [],
  },
  {
    id: "nbfc",
    title: "NBFCs",
    domain: "banking",
    category: "nbfc",
    subcategory: "NBFCs",
    level: "Core",
    oneLine: "Institutions that lend like banks but cannot take deposits — which changes everything about their funding.",
    what: "A non-banking financial company provides credit and other financial services without holding a banking licence, and so cannot accept demand deposits from the public. It must fund itself from markets and banks instead. This makes NBFCs valuable in reaching borrowers that banks serve poorly, and structurally more fragile, because market funding can be withdrawn far faster than retail deposits.",
    simple: "They lend like a bank but cannot hold your savings account, so they borrow from markets. Markets can stop lending overnight. Depositors rarely all leave at once.",
    why: "NBFCs extend credit where banking reach is limited, which matters for financial inclusion. Their funding structure also makes them the point where a liquidity squeeze usually appears first.",
    components: [
      {
        k: "Market funding",
        v: "Commercial paper, bonds and bank borrowing rather than deposits."
      },
      {
        k: "Asset-liability management",
        v: "Matching the maturity of funding to the maturity of lending."
      },
      {
        k: "Specialised lending",
        v: "Vehicle, gold, microfinance, housing and infrastructure segments."
      },
      {
        k: "No deposit insurance",
        v: "Lenders to an NBFC carry the credit risk directly."
      }
    ],
    realWorld: "The 2018 IL&FS default showed the mechanism precisely: market funding withdrew from the sector as a whole, and NBFCs with maturity mismatches faced immediate stress regardless of their individual asset quality.",
    caseRef: "ilfs-2018",
    misconceptions: [
      {
        claim: "“An NBFC is just a smaller bank.”",
        truth: "The funding structure differs fundamentally, and funding structure is what determines behaviour under stress."
      }
    ],
    application: ["Assessing the funding risk of a lending business.", "Understanding how stress transmits across a sector rather than one firm."],
    related: ["commercial-banking", "liquidity-risk", "credit-risk", "money-markets"],
    prereq: ["commercial-banking"],
    next: ["liquidity-risk"],
  },
  {
    id: "capital-adequacy",
    title: "Capital Adequacy",
    domain: "banking",
    category: "bank-risk",
    subcategory: "Capital Adequacy",
    level: "Intermediate",
    oneLine: "The equity cushion a bank must hold against its risks, so losses fall on owners before depositors.",
    what: "Capital adequacy requirements oblige banks to hold a minimum amount of equity relative to their risk-weighted assets. Assets are weighted by riskiness, so a government security carries a low weight while an unsecured loan carries a high one. The purpose is to ensure a bank absorbs losses from its own capital rather than from depositors or public funds.",
    simple: "The bank must fund part of its lending with its own money, so that when loans go bad the owners lose before anyone else does.",
    formula: {
      main: "Capital adequacy ratio = Regulatory capital ÷ Risk-weighted assets",
      variables: [
        {
          sym: "Regulatory capital",
          desc: "Equity and qualifying instruments that absorb loss"
        },
        {
          sym: "Risk-weighted assets",
          desc: "Assets scaled by their assessed riskiness"
        }
      ]
    },
    example: {
      setup: "A bank holds ₹500 crore of government securities at 0% weight and ₹1,000 crore of corporate loans at 100% weight, with ₹120 crore of capital.",
      steps: ["Risk-weighted assets = (500 × 0) + (1,000 × 1.00) = ₹1,000 crore", "CAR = 120 ÷ 1,000 = 12%"],
      result: "12%",
      note: "Total assets are ₹1,500 crore, but only ₹1,000 crore is risk-weighted. The ratio measures capital against risk taken, not against size."
    },
    interpretation: "Because risk weights are assigned by rule, a bank can reduce its requirement by shifting toward assets with lower weights. Whether those weights correctly capture actual risk is a recurring question, and 2008 showed the consequences when they do not.",
    misconceptions: [
      {
        claim: "“Capital is money the bank keeps in reserve.”",
        truth: "Capital is not a pot of cash set aside. It is a source of funding that absorbs loss, sitting on the other side of the balance sheet."
      }
    ],
    application: ["Assessing a bank's capacity to absorb loan losses.", "Understanding why regulation focuses on capital rather than limiting lending directly."],
    related: ["commercial-banking", "balance-sheet", "leverage", "credit-risk"],
    prereq: ["commercial-banking", "balance-sheet"],
    next: [],
  },
  {
    id: "insurance",
    title: "Insurance Principles",
    domain: "banking",
    category: "nbfc",
    subcategory: "Insurance Principles",
    level: "Core",
    oneLine: "Many people paying a small certain cost so that a few are protected from a large uncertain one.",
    what: "Insurance transfers risk from an individual to a pool. Policyholders pay premiums; the insurer pays claims from that pool. It works because losses that are unpredictable for one person are statistically predictable across a large group. The insurer's role is to price risk accurately, invest the premiums held between collection and claim, and remain solvent enough to pay when claims arrive.",
    simple: "Everyone pays a little so that whoever is unlucky does not lose everything.",
    components: [
      {
        k: "Premium",
        v: "The price paid for the transfer of risk."
      },
      {
        k: "Underwriting",
        v: "Assessing and pricing the risk being accepted."
      },
      {
        k: "Risk pooling",
        v: "Combining many independent risks so aggregate losses become predictable."
      },
      {
        k: "Reserves",
        v: "Funds set aside for claims incurred but not yet settled."
      }
    ],
    interpretation: "Insurance requires risks to be largely independent. When many policyholders can suffer loss from the same event, pooling breaks down — which is why catastrophe cover is priced differently and why insurers reinsure.",
    misconceptions: [
      {
        claim: "“Insurance is an investment.”",
        truth: "Its purpose is protection against loss. Products combining insurance with investment usually deliver both less efficiently than buying each separately."
      }
    ],
    application: ["Deciding what genuinely needs insuring — large losses you could not absorb.", "Understanding why premiums vary by assessed risk."],
    related: ["risk-return", "diversification", "nbfc"],
    prereq: ["risk-return"],
    next: [],
  },
  {
    id: "digital-payments",
    title: "Digital Payment Systems",
    domain: "fintech",
    category: "payments-infra",
    subcategory: "Digital Payment Systems",
    level: "Foundational",
    oneLine: "Moving money as a message rather than an object.",
    what: "A digital payment system transfers value by updating records at financial institutions rather than moving physical currency. A payment involves initiation, authentication, clearing — determining who owes what — and settlement, the actual transfer of funds between institutions. Modern retail systems compress these steps to seconds, though the underlying stages remain.",
    simple: "No money physically moves. Two records change, and the system guarantees they change together.",
    why: "Payment infrastructure determines how easily an economy transacts. Lower payment friction expands the range of viable transactions — very small payments become practical, which changes what business models can exist.",
    components: [
      {
        k: "Initiation",
        v: "The instruction to pay, from an app, card or terminal."
      },
      {
        k: "Authentication",
        v: "Confirming the instruction genuinely comes from the account holder."
      },
      {
        k: "Clearing",
        v: "Determining net obligations between institutions."
      },
      {
        k: "Settlement",
        v: "The actual transfer of funds, usually across accounts at the central bank."
      }
    ],
    interpretation: "Instant to the user does not mean instant underneath. Many systems settle in batches while guaranteeing the transaction to the customer immediately, which means the operator carries risk in the interval.",
    misconceptions: [
      {
        claim: "“Digital payment means money moves instantly.”",
        truth: "The customer experience is instant. Interbank settlement may occur later, and that difference is where operational and credit risk sits."
      }
    ],
    application: ["Understanding what happens between tapping pay and the merchant being credited.", "Recognising where risk sits in a payment chain."],
    related: ["money", "commercial-banking", "central-banking"],
    prereq: ["money"],
    next: ["digital-lending"],
  },
  {
    id: "digital-lending",
    title: "Digital Lending",
    domain: "fintech",
    category: "delivery",
    subcategory: "Digital Lending",
    level: "Core",
    oneLine: "Credit assessed and delivered through software, which changes the cost of lending small amounts.",
    what: "Digital lending uses automated data collection and algorithmic assessment to originate and manage loans with limited human involvement. Because the marginal cost of assessing an additional borrower is very low, small loans that would be uneconomic through a branch become viable. The credit risk itself is unchanged — only the cost of assessing and servicing it falls.",
    simple: "Software does the paperwork, so lending ₹10,000 becomes worth doing. Whether the borrower repays is still the same question.",
    why: "Cost structure determines who can access credit. Lowering origination cost extends formal credit to borrowers previously served only by informal lenders at far higher rates.",
    components: [
      {
        k: "Alternative data",
        v: "Transaction, telecom or behavioural data used where formal credit history is absent."
      },
      {
        k: "Automated underwriting",
        v: "Algorithmic assessment replacing manual appraisal."
      },
      {
        k: "Digital disbursal and collection",
        v: "Funds moved and repayments collected through payment rails."
      }
    ],
    limitations: ["A model trained on past borrowers may perform poorly on a population it has not seen, and this is discovered only after losses appear.", "Speed of origination means errors scale quickly.", "Data-driven assessment raises real questions about fairness and privacy that regulation continues to address."],
    misconceptions: [
      {
        claim: "“Better technology means lower credit risk.”",
        truth: "It lowers the cost of assessment and can improve selection. It does not change a borrower's ability to repay when circumstances change."
      }
    ],
    application: ["Understanding why small-ticket credit expanded rapidly.", "Assessing where the risk in a digital lending book actually sits."],
    related: ["credit-risk", "nbfc", "digital-payments", "commercial-banking"],
    prereq: ["credit-risk"],
    next: [],
  },
  {
    id: "credit-scoring",
    title: "Credit Scoring Models",
    domain: "fintech",
    category: "data",
    subcategory: "Credit Scoring Models",
    level: "Core",
    oneLine: "Turning a borrower's history into a number that estimates the probability of repayment.",
    what: "A credit score summarises the likelihood that a borrower will repay, derived statistically from repayment history, outstanding obligations, credit age, and the mix and recency of credit. It is a probability estimate about a population, applied to an individual — a prediction, not a judgement about a person.",
    simple: "A number estimating how likely you are to repay, based on how people with similar records have behaved.",
    components: [
      {
        k: "Repayment history",
        v: "Typically the most heavily weighted factor."
      },
      {
        k: "Credit utilisation",
        v: "How much of available credit is being used."
      },
      {
        k: "Credit age",
        v: "How long a repayment record exists."
      },
      {
        k: "Recent enquiries",
        v: "Frequent applications in a short period, which can indicate stress."
      }
    ],
    interpretation: "The score prices the loan. A better score lowers the interest rate, which lowers the repayment burden, which makes repayment more likely — the mechanism is self-reinforcing in both directions.",
    misconceptions: [
      {
        claim: "“No borrowing history means a good score.”",
        truth: "Absence of history is absence of evidence. Models generally treat an unknown borrower cautiously rather than favourably."
      },
      {
        claim: "“Checking your own score damages it.”",
        truth: "Checking your own record is normally distinguished from a lender's enquiry and does not affect the score."
      }
    ],
    application: ["Understanding what actually moves a credit score.", "Seeing why the same loan is priced differently for different borrowers."],
    related: ["credit-risk", "digital-lending", "interest"],
    prereq: ["credit-risk"],
    next: [],
  },
  {
    id: "foreign-exchange",
    title: "Foreign Exchange",
    domain: "global",
    category: "currencies",
    subcategory: "Foreign Exchange",
    level: "Core",
    oneLine: "The rate at which one currency converts into another, and the forces that move it.",
    what: "The exchange rate is the price of one currency in terms of another. Under a floating regime it is set by supply and demand arising from trade, investment flows and expectations. Over long periods, differences in inflation and interest rates between two countries exert substantial influence; over short periods, capital flows and sentiment usually dominate.",
    simple: "How much of your currency it takes to buy another. Trade, investment and expectations all push on it.",
    components: [
      {
        k: "Floating rate",
        v: "Determined by market supply and demand."
      },
      {
        k: "Managed or pegged rate",
        v: "Held within a range by central bank intervention."
      },
      {
        k: "Interest rate differential",
        v: "Higher relative rates tend to attract capital and support a currency."
      },
      {
        k: "Inflation differential",
        v: "Persistently higher inflation tends to weaken a currency over time."
      }
    ],
    interpretation: "A depreciating currency is not straightforwardly bad. It makes exports more competitive and imports dearer. The consequence depends on what an economy buys and sells, and on how much of its debt is in foreign currency.",
    misconceptions: [
      {
        claim: "“A falling currency means a failing economy.”",
        truth: "It reflects relative conditions between two economies. Deliberate depreciation has been used as policy to support exports."
      }
    ],
    application: ["Assessing the effect of currency moves on a business.", "Understanding why capital flows respond to policy rate changes."],
    related: ["currency-markets", "inflation", "interest-rates", "currency-risk"],
    prereq: ["inflation"],
    next: ["currency-risk"],
  },
  {
    id: "currency-risk",
    title: "Currency Risk",
    domain: "global",
    category: "currencies",
    subcategory: "Currency Risk",
    level: "Core",
    oneLine: "The risk that exchange rate movement changes the value of a cash flow or an obligation.",
    what: "Currency risk arises whenever cash flows, assets or liabilities are denominated in a currency other than the one an entity reports in. It takes three forms: transaction exposure on specific known cash flows, translation exposure when foreign operations are consolidated into reported accounts, and economic exposure where competitive position itself shifts with the exchange rate.",
    simple: "You agreed a price in dollars. By the time you pay, the dollar costs more. Nothing about the deal changed except the currency.",
    example: {
      setup: "A company borrows US$10 million when the rate is ₹80. The rupee weakens to ₹88 before repayment.",
      steps: ["Original obligation = 10,000,000 × 80 = ₹80,00,00,000", "Obligation at repayment = 10,000,000 × 88 = ₹88,00,00,000", "Additional cost = ₹8,00,00,000"],
      result: "₹8 crore more, with no change in the debt",
      note: "The dollar amount owed never changed. Unhedged foreign currency borrowing means the size of the debt moves with the exchange rate."
    },
    interpretation: "Foreign currency debt is attractive because interest rates abroad may be lower. That saving is compensation for taking currency risk, and it can be erased entirely by a modest depreciation.",
    misconceptions: [
      {
        claim: "“Borrowing abroad is cheaper.”",
        truth: "The interest rate is lower, but the obligation is in a currency you do not earn. The differential often reflects expected depreciation, not free money."
      }
    ],
    application: ["Deciding whether foreign currency borrowing suits a business.", "Identifying which exposures need hedging."],
    related: ["foreign-exchange", "hedging", "credit-risk", "currency-markets"],
    prereq: ["foreign-exchange"],
    next: ["hedging"],
  },
  {
    id: "sovereign-debt",
    title: "Sovereign Debt",
    domain: "global",
    category: "cross-border",
    subcategory: "Sovereign Debt",
    level: "Intermediate",
    oneLine: "Government borrowing — usually the safest asset in its own currency, and not always safe in someone else's.",
    what: "Sovereign debt is borrowing by a national government through issued securities. Debt in a government's own currency carries very low default risk, because the government controls the currency it must repay in — though repaying through currency creation carries inflation consequences. Debt issued in a foreign currency is materially different: the government cannot create that currency, so genuine default risk exists.",
    simple: "A government can always produce more of its own currency. It cannot produce someone else's.",
    why: "Sovereign yields are the benchmark for every other borrower in that currency. Sovereign stress therefore raises borrowing costs across an entire economy, not just for the government.",
    components: [
      {
        k: "Domestic currency debt",
        v: "Very low default risk; the real risk is inflation and currency depreciation."
      },
      {
        k: "Foreign currency debt",
        v: "Genuine default risk, since the currency cannot be created."
      },
      {
        k: "Debt-to-GDP",
        v: "Debt relative to the size of the economy servicing it."
      },
      {
        k: "Debt service ratio",
        v: "Interest cost relative to government revenue — often more informative than the stock of debt."
      }
    ],
    interpretation: "The level of debt matters less than the cost of servicing it relative to revenue and growth. When the interest rate on debt exceeds nominal growth, the debt ratio rises even with a balanced primary budget.",
    misconceptions: [
      {
        claim: "“A government with high debt is close to default.”",
        truth: "Debt in its own currency, held largely domestically, at rates below nominal growth, can be sustained at high levels. Currency composition and service cost matter more than the ratio itself."
      }
    ],
    application: ["Reading what sovereign yields imply about perceived risk.", "Understanding why foreign currency borrowing is treated differently by markets."],
    related: ["bond-pricing", "interest-rates", "inflation", "currency-risk"],
    prereq: ["bond-pricing"],
    next: ["currency-risk"],
  },
  {
    id: "investment-objectives",
    title: "Investment Objectives",
    domain: "investments",
    category: "principles",
    subcategory: "Investment Objectives",
    level: "Foundational",
    oneLine: "What the money is actually for, which decides everything that follows.",
    what: "An investment objective is a statement of what a sum of money must achieve, by when, and with what tolerance for shortfall. It is the first decision in investing and the one most often skipped. Without it there is no basis for choosing between assets, because risk only means something relative to a purpose.",
    simple: "Money for a house deposit in two years and money for retirement in thirty years are not the same money. They should not be invested the same way.",
    why: "Every later decision follows from the objective. Asset allocation, acceptable volatility, liquidity needs and the definition of failure all derive from it. An investor without an objective is not investing, they are speculating with extra steps.",
    components: [
      {
        k: "The goal",
        v: "What the money is for, stated specifically enough to be measured."
      },
      {
        k: "The horizon",
        v: "When it is needed, which determines how much volatility can be tolerated."
      },
      {
        k: "The required return",
        v: "What growth rate reaches the goal from the starting amount and contributions."
      },
      {
        k: "The tolerance for shortfall",
        v: "What happens if the goal is missed. A retirement shortfall and a holiday shortfall are not comparable."
      }
    ],
    example: {
      setup: "A goal of ₹50,00,000 in 15 years, starting from zero, with ₹12,000 invested monthly.",
      steps: ["Total contributed = 12,000 × 180 = ₹21,60,000", "The remaining ₹28,40,000 must come from growth", "The required return is approximately 11 percent a year"],
      result: "About 11 percent a year needed",
      note: "That figure decides the asset mix. It cannot be reached by deposits alone, and it does not require an aggressive portfolio either. The objective produced the answer."
    },
    misconceptions: [
      {
        claim: "“My objective is to maximise returns.”",
        truth: "That is not an objective, because it has no horizon and no failure condition. It also implies accepting unlimited risk, which almost nobody actually means."
      }
    ],
    application: ["Deciding whether an investment suits a specific purpose.", "Judging portfolio performance against a goal rather than against a market."],
    related: ["time-horizon", "asset-allocation", "risk-return", "liquidity-needs"],
    prereq: [],
    next: ["time-horizon", "liquidity-needs"],
  },
  {
    id: "time-horizon",
    title: "Time Horizon",
    domain: "investments",
    category: "principles",
    subcategory: "Time Horizon",
    level: "Foundational",
    oneLine: "How long the money can stay invested, which determines how much volatility it can survive.",
    what: "The time horizon is the period before invested capital is needed. It matters because volatility and time interact: an asset that swings widely may be entirely unsuitable over two years and entirely suitable over twenty. Horizon does not remove risk, but it changes which risks dominate.",
    simple: "A short horizon means a market fall becomes a permanent loss, because you must sell. A long horizon means it can be a temporary one.",
    why: "Horizon is what converts volatility from a threat into a tolerable feature. It is also why the same asset can be reckless for one investor and prudent for another with an identical portfolio size.",
    components: [
      {
        k: "Short horizon",
        v: "Under three years. Capital preservation dominates; market linked assets are usually unsuitable."
      },
      {
        k: "Medium horizon",
        v: "Three to seven years. A mix, with volatility limited by the possibility of needing the money."
      },
      {
        k: "Long horizon",
        v: "Beyond seven years. Volatility can be tolerated because there is time to recover from a fall."
      },
      {
        k: "Sequence risk",
        v: "The danger of a large fall arriving just before the money is needed."
      }
    ],
    interpretation: "The horizon shortens every year. A twenty year goal becomes a three year goal eventually, and the allocation should change with it rather than staying fixed until the day of need.",
    misconceptions: [
      {
        claim: "“Equities are safe if held long enough.”",
        truth: "Long horizons historically reduce the probability of loss, they do not eliminate it. Individual companies fail permanently, and some markets have gone a decade without recovering a prior peak."
      }
    ],
    application: ["Matching an asset to a goal date.", "Reducing risk as a goal approaches rather than at the moment of need."],
    related: ["investment-objectives", "risk-return", "asset-allocation", "liquidity-needs"],
    prereq: ["investment-objectives"],
    next: ["liquidity-needs"],
  },
  {
    id: "liquidity-needs",
    title: "Liquidity Needs",
    domain: "investments",
    category: "principles",
    subcategory: "Liquidity Needs",
    level: "Foundational",
    oneLine: "How quickly money might be needed, which constrains what it can be invested in.",
    what: "Liquidity needs describe how readily an investor may have to convert holdings into cash. They are separate from the time horizon: a thirty year goal can still carry a requirement that some portion be reachable within a week. An investment that cannot be exited when needed has failed, regardless of its return.",
    simple: "It does not matter how well an investment performs if you cannot get the money out on the day you need it.",
    why: "Forced selling is the most reliable way to convert a temporary loss into a permanent one. Liquidity planning exists so that a market fall never coincides with a need to sell.",
    components: [
      {
        k: "Emergency reserve",
        v: "Funds held for unplanned needs, kept in instruments that can be accessed immediately."
      },
      {
        k: "Planned outflows",
        v: "Known future payments, which should be matched by assets maturing near that date."
      },
      {
        k: "Exit friction",
        v: "Lock-in periods, exit loads, settlement time and the price impact of selling."
      },
      {
        k: "Illiquidity premium",
        v: "The extra return demanded for accepting that money cannot be withdrawn quickly."
      }
    ],
    misconceptions: [
      {
        claim: "“I can always sell if I need to.”",
        truth: "You can always sell at some price. In stressed markets that price can be far below the last quoted one, and property or unlisted holdings may take months."
      }
    ],
    application: ["Sizing an emergency reserve before investing anything else.", "Deciding whether an illiquid holding is genuinely affordable."],
    related: ["market-liquidity", "liquidity-risk", "time-horizon", "cash-equivalents"],
    prereq: ["investment-objectives"],
    next: ["cash-equivalents"],
  },
  {
    id: "cost-of-investing",
    title: "The Cost of Investing",
    domain: "investments",
    category: "principles",
    subcategory: "Cost of Investing",
    level: "Core",
    oneLine: "The one variable an investor controls completely, and the one that compounds against them.",
    what: "The total cost of investing includes fund expense ratios, brokerage, transaction taxes, exit loads, advisory fees and the spread paid when buying and selling. Costs are certain while returns are not, which makes them the highest confidence lever available to any investor.",
    simple: "You cannot choose your returns. You can choose your costs, and over decades those costs decide a surprising share of the outcome.",
    why: "A cost difference that sounds trivial as an annual percentage compounds against the investor for the entire holding period. It is the clearest practical demonstration of compounding working in reverse.",
    formula: {
      main: "Value lost to cost = Gross value − Net value",
      others: [
        {
          label: "Net compounded value",
          expr: "A = P × (1 + r − e)ⁿ"
        }
      ],
      variables: [
        {
          sym: "r",
          desc: "Gross annual return"
        },
        {
          sym: "e",
          desc: "Annual cost as a decimal"
        },
        {
          sym: "n",
          desc: "Years"
        }
      ]
    },
    example: {
      setup: "₹10,00,000 invested for 25 years at a gross return of 11 percent. Compare total costs of 0.4 percent and 2.0 percent a year.",
      steps: ["At 10.6 percent net: 10,00,000 × (1.106)²⁵ = ₹1,20,63,000 approximately", "At 9.0 percent net: 10,00,000 × (1.09)²⁵ = ₹86,23,000 approximately", "Difference = ₹34,40,000 approximately"],
      result: "About ₹34,40,000 lost to 1.6 percent a year",
      note: "The gross return was identical in both cases. The entire gap is cost, compounding for twenty five years."
    },
    interpretation: "Cost matters most where the holding period is longest, which is exactly where investors pay least attention to it.",
    misconceptions: [
      {
        claim: "“A higher fee buys better performance.”",
        truth: "Cost is certain and performance is not. Across long periods, low cost has been a more consistent predictor of investor outcomes than manager selection."
      }
    ],
    application: ["Comparing two funds with similar mandates.", "Deciding whether frequent trading is worth its cumulative cost."],
    related: ["mutual-funds", "etf", "compounding", "index-funds"],
    prereq: ["compounding"],
    next: ["index-funds"],
    sim: "compounding",
  },
  {
    id: "cash-equivalents",
    title: "Cash and Cash Equivalents",
    domain: "investments",
    category: "asset-classes",
    subcategory: "Cash & Equivalents",
    level: "Foundational",
    oneLine: "Holdings that can become spendable money almost immediately, at close to their stated value.",
    what: "Cash equivalents are highly liquid, short maturity instruments whose value is stable and which can be converted to cash quickly. Savings deposits, short term fixed deposits, treasury bills and liquid funds are typical. They carry minimal market risk and minimal credit risk, and correspondingly low returns.",
    simple: "Money you can reach today without worrying what it will be worth.",
    why: "Cash is not an investment, it is optionality. It funds emergencies without forcing the sale of long term holdings, and it allows an investor to act when opportunities appear.",
    components: [
      {
        k: "Liquidity",
        v: "Convertible to spendable money within a day or two."
      },
      {
        k: "Capital stability",
        v: "Value does not move materially with markets."
      },
      {
        k: "Low return",
        v: "Compensation is small precisely because the risks taken are small."
      },
      {
        k: "Inflation exposure",
        v: "The one risk cash carries in full."
      }
    ],
    interpretation: "Cash has no market price risk and complete inflation risk. Over long periods it reliably loses purchasing power, which is why it is a tool for near term needs rather than a place to build wealth.",
    misconceptions: [
      {
        claim: "“Cash is the safest asset.”",
        truth: "It is the safest against market falls and the least safe against inflation. Safety depends on which risk you are asking about."
      }
    ],
    application: ["Holding an emergency reserve.", "Parking money for a known payment within a year."],
    related: ["liquidity-needs", "inflation", "real-return", "money-markets"],
    prereq: [],
    next: ["real-return"],
  },
  {
    id: "real-assets",
    title: "Real Assets",
    domain: "investments",
    category: "asset-classes",
    subcategory: "Real Assets",
    level: "Core",
    oneLine: "Physical assets with intrinsic use, whose value is not a claim on anyone else's promise.",
    what: "Real assets are tangible holdings such as property, infrastructure and land, which derive value from their physical use rather than from a contractual claim. They typically generate income through rent or usage charges and have historically shown some resilience to inflation, because replacement cost and rents tend to rise with the general price level.",
    simple: "A building is worth something because people need buildings, not because someone promised to pay you.",
    components: [
      {
        k: "Income yield",
        v: "Rent or usage charges, net of maintenance, taxes and vacancy."
      },
      {
        k: "Capital value",
        v: "What the asset would sell for, which moves slowly and is hard to observe."
      },
      {
        k: "Illiquidity",
        v: "Sales take months and carry high transaction costs."
      },
      {
        k: "Concentration",
        v: "A single property is one asset in one location, which is the opposite of diversification."
      }
    ],
    limitations: ["Valuation is infrequent and imprecise, which can make volatility appear lower than it is.", "Transaction costs, stamp duty and maintenance materially reduce the realised return.", "A single property cannot be partially sold when money is needed."],
    misconceptions: [
      {
        claim: "“Property never falls in value.”",
        truth: "It falls less visibly, because it is not priced daily. Several markets have seen extended real declines, and infrequent pricing is not the same as stability."
      }
    ],
    application: ["Assessing whether a property purchase is an investment or a consumption decision.", "Understanding why real assets behave differently from financial claims during inflation."],
    related: ["inflation", "diversification", "market-liquidity", "gold-commodities"],
    prereq: ["risk-return"],
    next: ["gold-commodities"],
  },
  {
    id: "gold-commodities",
    title: "Gold and Commodities",
    domain: "investments",
    category: "asset-classes",
    subcategory: "Gold & Commodities",
    level: "Core",
    oneLine: "Assets that produce no cash flow, whose value rests entirely on what the next buyer will pay.",
    what: "Commodities are physical goods such as metals, energy and agricultural produce. Gold occupies a particular position because it is held largely as a store of value rather than consumed industrially. The defining feature of this class is the absence of cash flow: there is no coupon, no dividend and no earnings, so return comes only from price change.",
    simple: "A share of a company earns money for you. A bar of gold sits there. Its worth is whatever someone else will pay.",
    why: "Because commodities have no cash flow, they cannot be valued by discounting. That makes them harder to assess than equities or bonds, and it means their price is driven by supply, demand and sentiment rather than by fundamentals in the usual sense.",
    components: [
      {
        k: "No yield",
        v: "No income is generated, and storage may cost money."
      },
      {
        k: "Inflation behaviour",
        v: "Gold has often, though not always, held real value during inflationary periods."
      },
      {
        k: "Currency link",
        v: "For an Indian investor, rupee weakness raises the local price even when global prices are flat."
      },
      {
        k: "Industrial demand",
        v: "Silver, copper and crude are consumed, so their prices respond to economic activity."
      }
    ],
    example: {
      setup: "Gold at ₹3,200 per 10 grams in 1990, and ₹77,913 in 2024.",
      steps: ["Total change = (77,913 − 3,200) ÷ 3,200 × 100 = 2,335 percent", "Over 34 years", "Compound annual rate = (77,913 ÷ 3,200)^(1/34) − 1 ≈ 9.9 percent"],
      result: "About 9.9 percent a year",
      note: "That headline hides long flat stretches. Gold fell from ₹31,050 in 2012 to ₹26,343 in 2015, three consecutive losing years."
    },
    misconceptions: [
      {
        claim: "“Gold always protects against inflation.”",
        truth: "It has over very long periods and failed over shorter ones. Between 2012 and 2015 the rupee price fell while inflation continued."
      }
    ],
    application: ["Deciding what role, if any, a non yielding asset plays in a portfolio.", "Understanding why commodity prices respond to currency moves."],
    related: ["inflation", "real-return", "diversification", "currency-risk"],
    prereq: ["risk-return"],
    next: ["diversification"],
  },
  {
    id: "index-funds",
    title: "Index Funds",
    domain: "investments",
    category: "vehicles",
    subcategory: "Index Funds",
    level: "Foundational",
    oneLine: "A fund that buys the whole index rather than trying to choose within it.",
    what: "An index fund holds the constituents of an index in their index weights, aiming to match its return rather than exceed it. Because no research or selection is required, costs are a fraction of an actively managed fund. Performance is judged by tracking error, meaning how closely the fund follows its benchmark, rather than by outperformance.",
    simple: "Rather than paying someone to pick winners, you buy everything in the index and keep the fee you saved.",
    why: "The cost saving is certain while manager outperformance is not. Over long periods, that certainty has produced better outcomes for most investors than manager selection has.",
    components: [
      {
        k: "Full replication",
        v: "Holding every constituent in its index weight."
      },
      {
        k: "Tracking error",
        v: "The deviation between fund return and index return. Lower is better."
      },
      {
        k: "Expense ratio",
        v: "Typically a small fraction of an active fund's charge."
      },
      {
        k: "No manager risk",
        v: "There is no possibility of a manager making a poor selection, and none of them making a good one either."
      }
    ],
    misconceptions: [
      {
        claim: "“Index funds guarantee average returns.”",
        truth: "They deliver index returns minus a very small cost. Because most active funds underperform after their higher fees, that outcome has historically beaten the majority of them."
      },
      {
        claim: "“An index fund is diversified by definition.”",
        truth: "It is as diversified as its index. A capitalisation weighted index can be dominated by a handful of very large companies."
      }
    ],
    application: ["Building a low cost core holding.", "Comparing a fund's tracking error before choosing between similar options."],
    related: ["etf", "mutual-funds", "market-indices", "cost-of-investing"],
    prereq: ["mutual-funds"],
    next: ["direct-regular"],
  },
  {
    id: "direct-regular",
    title: "Direct and Regular Plans",
    domain: "investments",
    category: "vehicles",
    subcategory: "Direct vs Regular Plans",
    level: "Core",
    oneLine: "The same fund at two prices, differing only by whether a distributor commission is embedded.",
    what: "Indian mutual funds offer two plan types. A regular plan includes a distributor commission within its expense ratio. A direct plan excludes it, and is bought without an intermediary. The portfolio, the manager and the strategy are identical. Only the cost differs, and therefore so does the net asset value over time.",
    simple: "Same fund, same manager, same holdings. One version pays a commission out of your returns and one does not.",
    formula: {
      main: "Cost difference ≈ Regular expense ratio − Direct expense ratio",
      variables: [
        {
          sym: "Difference",
          desc: "Typically between 0.5 and 1.0 percentage points a year for equity funds"
        }
      ]
    },
    example: {
      setup: "₹20,00,000 invested for 20 years at a gross return of 12 percent. The regular plan costs 1.8 percent, the direct plan 0.9 percent.",
      steps: ["Regular, net 10.2 percent: 20,00,000 × (1.102)²⁰ = ₹1,39,60,000 approximately", "Direct, net 11.1 percent: 20,00,000 × (1.111)²⁰ = ₹1,64,50,000 approximately", "Difference = ₹24,90,000 approximately"],
      result: "About ₹24,90,000",
      note: "Nothing about the investment changed. The difference is entirely the commission, compounding for twenty years."
    },
    interpretation: "The regular plan is not fraudulent. It pays for advice and service, which some investors genuinely need. The question is whether the advice received is worth what it compounds to.",
    misconceptions: [
      {
        claim: "“Direct plans are riskier.”",
        truth: "The portfolio is identical. The only difference is the expense ratio and the absence of an intermediary."
      }
    ],
    application: ["Checking which plan type an existing holding is in.", "Weighing the cost of advice against its value."],
    related: ["mutual-funds", "cost-of-investing", "index-funds", "sip"],
    prereq: ["mutual-funds"],
    next: ["cost-of-investing"],
  },
  {
    id: "rebalancing",
    title: "Rebalancing",
    domain: "investments",
    category: "portfolio",
    subcategory: "Rebalancing",
    level: "Core",
    oneLine: "Restoring a portfolio to its intended weights, which mechanically sells what rose and buys what fell.",
    what: "Rebalancing means periodically returning a portfolio to its target allocation after market movements have shifted it. Because assets grow at different rates, a portfolio left alone drifts toward whatever has performed best, quietly becoming riskier than intended. Rebalancing reverses that drift.",
    simple: "Equity rose, so it is now a bigger share of your portfolio than you planned. Selling some and buying the laggard puts you back where you meant to be.",
    why: "Its main purpose is risk control rather than return enhancement. Without it, a portfolio designed as sixty percent equity can become eighty percent equity after a strong run, exposing the investor to a fall they never agreed to take.",
    formula: {
      main: "Drift = Current weight − Target weight",
      others: [
        {
          label: "Threshold rule",
          expr: "Rebalance when |drift| exceeds a set band, commonly five percentage points"
        }
      ]
    },
    example: {
      setup: "A ₹30,00,000 portfolio targeted at 60 percent equity and 40 percent debt. Equity rises 40 percent; debt is flat.",
      steps: ["Equity: 18,00,000 × 1.40 = ₹25,20,000. Debt: ₹12,00,000", "Total = ₹37,20,000, so equity is now 67.7 percent", "Restoring 60 percent means selling ₹2,88,000 of equity into debt"],
      result: "Equity trimmed from 67.7 percent to 60 percent",
      note: "This forces selling what performed and buying what did not, which is the opposite of instinct. That is precisely why it is written as a rule in advance."
    },
    misconceptions: [
      {
        claim: "“Rebalancing increases returns.”",
        truth: "Sometimes it does and sometimes it costs return, particularly in a long trending market. Its reliable benefit is keeping risk at the intended level."
      }
    ],
    limitations: ["Each rebalance can trigger transaction costs and tax on realised gains.", "Rebalancing too frequently adds cost without meaningfully improving risk control."],
    application: ["Setting a rebalancing rule before emotions are involved.", "Checking how far a portfolio has drifted from its intended risk."],
    related: ["asset-allocation", "diversification", "portfolio-risk", "correlation"],
    prereq: ["asset-allocation"],
    next: ["correlation"],
  },
  {
    id: "correlation",
    title: "Correlation",
    domain: "investments",
    category: "portfolio",
    subcategory: "Correlation",
    level: "Core",
    oneLine: "The degree to which two assets move together, which decides whether diversification works at all.",
    what: "Correlation measures how the returns of two assets move in relation to one another, on a scale from plus one to minus one. At plus one they move identically. At zero there is no relationship. At minus one they move exactly opposite. Portfolio risk depends on correlation as much as on the risk of the individual holdings.",
    simple: "Two investments that always rise and fall together are one investment wearing two names.",
    why: "Correlation is the mechanism behind diversification. Adding holdings reduces risk only to the extent that they do not move together, which is why the number of holdings matters far less than the relationships between them.",
    formula: {
      main: "σₚ = √(w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂)",
      variables: [
        {
          sym: "σₚ",
          desc: "Portfolio volatility"
        },
        {
          sym: "w",
          desc: "Weight of each asset"
        },
        {
          sym: "σ",
          desc: "Volatility of each asset"
        },
        {
          sym: "ρ",
          desc: "Correlation between them"
        }
      ]
    },
    example: {
      setup: "Two assets with volatility of 18 and 12 percent, held equally, at different correlations.",
      steps: ["At ρ = 1.0: portfolio volatility = 15.0 percent, the simple weighted average", "At ρ = 0.3: portfolio volatility = 11.9 percent", "At ρ = −0.3: portfolio volatility = 9.3 percent"],
      result: "15.0, 11.9 or 9.3 percent from identical assets",
      note: "The assets never changed. Only their relationship did, and it cut risk by nearly forty percent."
    },
    interpretation: "Correlation is not fixed. It typically rises toward one during severe market stress, which means diversification weakens exactly when it is most needed.",
    misconceptions: [
      {
        claim: "“Low correlation means low risk.”",
        truth: "It means the combination is less risky than the parts suggest. Two highly volatile assets with low correlation still produce a volatile portfolio."
      }
    ],
    application: ["Testing whether a new holding genuinely adds diversification.", "Understanding why crisis losses appear across everything at once."],
    related: ["diversification", "portfolio-risk", "asset-allocation", "risk-return"],
    prereq: ["diversification"],
    next: ["portfolio-risk"],
    sim: "diversification",
  },
  {
    id: "portfolio-risk",
    title: "Portfolio Risk",
    domain: "investments",
    category: "portfolio",
    subcategory: "Portfolio Risk",
    level: "Intermediate",
    oneLine: "The risk of the whole, which is less than the sum of its parts whenever holdings do not move together.",
    what: "Portfolio risk is the volatility of the combined holdings rather than of any single one. It is not the weighted average of individual risks, because offsetting movements cancel. It is usually measured as standard deviation of returns, alongside maximum drawdown, which describes the worst peak to trough fall an investor would have had to endure.",
    simple: "What matters is how the whole thing behaves, not how any one holding behaves.",
    components: [
      {
        k: "Volatility",
        v: "How widely returns disperse around their average."
      },
      {
        k: "Maximum drawdown",
        v: "The largest fall from a peak. Often the number that actually determines whether an investor stays invested."
      },
      {
        k: "Concentration",
        v: "How much of the outcome depends on one holding, sector or factor."
      },
      {
        k: "Systematic exposure",
        v: "The part of risk that diversification cannot remove."
      }
    ],
    interpretation: "Volatility measures discomfort. Drawdown measures the moment of decision. A portfolio that falls 45 percent has a mathematical property and a human one, and the human one is what causes people to sell at the bottom.",
    misconceptions: [
      {
        claim: "“A diversified portfolio cannot fall much.”",
        truth: "It can. Diversification removes company specific risk, not market risk, and in 2008 nearly every risk asset fell together."
      }
    ],
    application: ["Sizing risk to what an investor can actually endure, not what they say they can.", "Comparing two portfolios with similar returns but different drawdowns."],
    related: ["correlation", "diversification", "risk-return", "asset-allocation"],
    prereq: ["correlation"],
    next: ["risk-adjusted-return"],
  },
  {
    id: "technical-analysis",
    title: "Technical Analysis",
    domain: "investments",
    category: "analysis",
    subcategory: "Technical Analysis",
    level: "Intermediate",
    oneLine: "Studying price and volume history to infer what participants are doing, rather than what a business is worth.",
    what: "Technical analysis examines past price and volume data to identify patterns believed to carry information about future movement. It does not attempt to value the underlying business. Its premises are that price reflects all available information, that prices move in identifiable tendencies, and that patterns of participant behaviour recur.",
    simple: "It ignores what the company is worth and studies what the price has been doing and how many people were involved.",
    components: [
      {
        k: "Trend",
        v: "The prevailing direction of price over a chosen period."
      },
      {
        k: "Support and resistance",
        v: "Price levels where buying or selling interest has previously appeared."
      },
      {
        k: "Volume",
        v: "How much trading accompanied a move, taken as evidence of conviction."
      },
      {
        k: "Momentum indicators",
        v: "Derived measures of the speed and persistence of price change."
      }
    ],
    limitations: ["The evidence on whether patterns reliably predict returns is contested, and results are sensitive to the period tested.", "Patterns are identified more confidently after the fact than before it.", "Frequent trading generates costs and taxes that must be overcome before any strategy adds value."],
    misconceptions: [
      {
        claim: "“Technical analysis predicts prices.”",
        truth: "At best it describes conditions and probabilities. Practitioners who treat it as prediction rather than risk management tend to be the ones who fail."
      },
      {
        claim: "“It conflicts with fundamental analysis.”",
        truth: "They answer different questions. One asks what a business is worth, the other asks what participants are currently doing."
      }
    ],
    application: ["Timing an entry into a position already justified on other grounds.", "Setting exit levels before a position is opened."],
    related: ["fundamental-analysis", "price-discovery", "market-participants", "market-risk"],
    prereq: ["price-discovery"],
    next: ["valuation-multiples"],
  },
  {
    id: "valuation-multiples",
    title: "Valuation Multiples",
    domain: "investments",
    category: "analysis",
    subcategory: "Valuation Multiples",
    level: "Intermediate",
    oneLine: "A price expressed relative to something the business produces, so that companies of different sizes can be compared.",
    what: "A valuation multiple divides a company's price or enterprise value by a financial measure such as earnings, book value, sales or cash flow. It converts an absolute price into a relative one, allowing comparison across companies and across time. A multiple is not a valuation. It is a question about why one business is priced differently from another.",
    simple: "Two companies priced at ₹500 tell you nothing. Priced at ten times earnings and forty times earnings tells you a great deal.",
    formula: {
      main: "Price to earnings = Share price ÷ Earnings per share",
      others: [
        {
          label: "Price to book",
          expr: "Share price ÷ Book value per share"
        },
        {
          label: "EV to EBITDA",
          expr: "Enterprise value ÷ EBITDA"
        }
      ],
      variables: [
        {
          sym: "EV",
          desc: "Market capitalisation plus net debt"
        },
        {
          sym: "EBITDA",
          desc: "Earnings before interest, tax, depreciation and amortisation"
        }
      ]
    },
    example: {
      setup: "Two companies each earning ₹50 per share. One trades at ₹500, the other at ₹2,000.",
      steps: ["First: P/E = 500 ÷ 50 = 10 times", "Second: P/E = 2,000 ÷ 50 = 40 times", "The market expects the second company's earnings to grow far faster, or to be far more durable"],
      result: "10 times against 40 times",
      note: "Neither is right or wrong. The multiple states what the market believes. The analyst's job is to decide whether that belief is reasonable."
    },
    interpretation: "A high multiple is an expectation, not a verdict. A low multiple often means the market expects earnings to decline, and it is frequently correct.",
    misconceptions: [
      {
        claim: "“A low P/E means the stock is cheap.”",
        truth: "It means the price is low relative to current earnings. If those earnings are about to fall, the multiple was a warning rather than a bargain."
      }
    ],
    limitations: ["Multiples depend on accounting figures that vary in quality between companies.", "They are only comparable within similar businesses. A bank and a software firm cannot be compared on the same multiple."],
    application: ["Comparing companies within one industry.", "Testing what growth a current price implies."],
    related: ["fundamental-analysis", "financial-ratios", "free-cash-flow", "quality-of-earnings"],
    prereq: ["financial-ratios"],
    next: ["quality-of-earnings"],
  },
  {
    id: "quality-of-earnings",
    title: "Quality of Earnings",
    domain: "investments",
    category: "analysis",
    subcategory: "Quality of Earnings",
    level: "Advanced",
    oneLine: "Whether reported profit reflects real, repeatable economic performance, or accounting choices.",
    what: "Quality of earnings assesses how faithfully reported profit represents the underlying business. High quality earnings are backed by cash, arise from core operations, and are likely to repeat. Low quality earnings depend on favourable estimates, one time gains, or aggressive recognition timing. The concept exists because profit is an opinion while cash is closer to a fact.",
    simple: "Two companies can report the same profit. One collected the money and can do it again next year. The other did neither.",
    why: "Every major accounting fraud in the record began as an earnings quality problem before it became a criminal one. The tools that detect deterioration are the same tools that would have raised questions at Satyam, Enron and Wirecard years before collapse.",
    components: [
      {
        k: "Cash conversion",
        v: "How much of reported profit appears as operating cash flow."
      },
      {
        k: "Recurrence",
        v: "Whether earnings come from the core business or from one off items."
      },
      {
        k: "Estimate dependence",
        v: "How much profit relies on management judgement, such as provisions and useful lives."
      },
      {
        k: "Receivables growth",
        v: "Sales growing much faster than collections suggests revenue recognised before it is earned."
      }
    ],
    formula: {
      main: "Cash conversion = Operating cash flow ÷ Net profit",
      variables: [
        {
          sym: "Ratio near or above 1",
          desc: "Profit is being collected in cash"
        },
        {
          sym: "Ratio persistently below 1",
          desc: "A widening gap between reported profit and cash, which deserves explanation"
        }
      ]
    },
    example: {
      setup: "A company reports ₹100 crore of net profit and ₹40 crore of operating cash flow, three years running.",
      steps: ["Cash conversion = 40 ÷ 100 = 0.40", "The gap is ₹60 crore each year", "Over three years, ₹180 crore of reported profit has not appeared as cash"],
      result: "Conversion of 0.40, sustained",
      note: "A single weak year can be growth in working capital. Three consecutive years is a question that requires an answer."
    },
    realWorld: "At Satyam, reported profits were not real, so they generated no cash. The gap between earnings and cash widened every year the misstatement continued, and it was visible in published statements long before the disclosure.",
    misconceptions: [
      {
        claim: "“Profit growth means the business is improving.”",
        truth: "Not if it comes from estimate changes, asset sales or receivables that are never collected. The source of growth matters more than its size."
      }
    ],
    application: ["Screening for companies where reported profit is not converting to cash.", "Assessing whether a growth record is repeatable."],
    related: ["cash-flow-statement", "income-statement", "financial-ratios", "fundamental-analysis"],
    prereq: ["cash-flow-statement"],
    next: ["fundamental-analysis"],
  },
  {
    id: "absolute-relative-return",
    title: "Absolute and Relative Return",
    domain: "investments",
    category: "performance",
    subcategory: "Absolute vs Relative Return",
    level: "Core",
    oneLine: "What you earned, and what you earned compared with what you could have earned instead.",
    what: "Absolute return is the change in the value of an investment over a period. Relative return compares that figure with an appropriate benchmark. Both are necessary. Absolute return determines whether a goal is reached. Relative return determines whether the manager or the strategy added anything beyond simply being in the market.",
    simple: "Making eight percent sounds good until the index made fourteen. Losing four percent sounds bad until the index lost twelve.",
    why: "Judging a portfolio on absolute return alone rewards luck in a rising market and punishes skill in a falling one. Judging on relative return alone can congratulate a manager for losing less than the market while the investor still cannot afford their goal.",
    formula: {
      main: "Relative return = Portfolio return − Benchmark return",
      others: [
        {
          label: "Absolute return",
          expr: "(Ending value − Beginning value) ÷ Beginning value × 100"
        }
      ]
    },
    example: {
      setup: "A fund returned 9 percent in a year in which its benchmark index returned 15 percent.",
      steps: ["Absolute return = +9 percent", "Relative return = 9 − 15 = −6 percentage points", "The investor gained money and lost ground"],
      result: "+9 percent absolute, −6 relative",
      note: "Both statements are true simultaneously. Which one matters depends on whether you are asking about the goal or about the manager."
    },
    misconceptions: [
      {
        claim: "“A positive return means the fund did well.”",
        truth: "In a year when everything rose, a positive return may represent significant underperformance."
      }
    ],
    application: ["Judging a fund against a fair comparison rather than against zero.", "Separating market movement from manager contribution."],
    related: ["benchmarking", "risk-adjusted-return", "tracking-error", "market-indices"],
    prereq: [],
    next: ["benchmarking"],
  },
  {
    id: "benchmarking",
    title: "Benchmarking",
    domain: "investments",
    category: "performance",
    subcategory: "Benchmarking",
    level: "Core",
    oneLine: "Choosing a fair comparison, without which performance cannot be judged at all.",
    what: "A benchmark is the index or reference against which a portfolio is measured. To be fair it must reflect the same asset class, market segment and risk that the portfolio actually takes. Comparing a small company fund with a large company index, or an equity portfolio with a deposit rate, produces a number that looks meaningful and is not.",
    simple: "You can make almost any fund look good or bad by choosing which index to compare it with.",
    components: [
      {
        k: "Relevance",
        v: "The benchmark must represent the same investable universe."
      },
      {
        k: "Investability",
        v: "It must be something an investor could actually have bought instead."
      },
      {
        k: "Specified in advance",
        v: "Chosen before the period, not selected afterwards from whichever looks flattering."
      },
      {
        k: "Total return basis",
        v: "Including dividends, otherwise the comparison understates what the index actually delivered."
      }
    ],
    interpretation: "A price index excludes dividends. Comparing a fund's return, which includes dividends received, against a price index overstates the fund's performance every single year.",
    misconceptions: [
      {
        claim: "“Beating the index proves skill.”",
        truth: "Over one or two years, it mostly proves the portfolio took different risks. Skill requires a long record against an appropriate benchmark, after costs."
      }
    ],
    application: ["Checking whether a fund's stated benchmark actually matches what it holds.", "Comparing on a total return basis rather than price return."],
    related: ["absolute-relative-return", "market-indices", "tracking-error", "risk-adjusted-return"],
    prereq: ["absolute-relative-return"],
    next: ["risk-adjusted-return"],
  },
  {
    id: "risk-adjusted-return",
    title: "Risk-Adjusted Return",
    domain: "investments",
    category: "performance",
    subcategory: "Risk-Adjusted Return",
    level: "Intermediate",
    oneLine: "Return measured against the risk taken to achieve it, because return alone says nothing about how it was earned.",
    what: "Risk adjusted return relates the excess return of a portfolio to the risk it accepted. The most common measure is the Sharpe ratio, which divides return above the risk free rate by the volatility of returns. Higher indicates more return earned per unit of risk. It exists because any return can be increased simply by taking more risk, which is not skill.",
    simple: "Anyone can produce a high return by taking enormous risk. The question is how much risk was required to get it.",
    formula: {
      main: "Sharpe ratio = (Rₚ − Rₑ) ÷ σₚ",
      variables: [
        {
          sym: "Rₚ",
          desc: "Portfolio return"
        },
        {
          sym: "Rₑ",
          desc: "Risk free rate"
        },
        {
          sym: "σₚ",
          desc: "Standard deviation of portfolio returns"
        }
      ]
    },
    example: {
      setup: "Two portfolios, a risk free rate of 6 percent. A returned 18 percent with 20 percent volatility. B returned 14 percent with 9 percent volatility.",
      steps: ["A: (18 − 6) ÷ 20 = 0.60", "B: (14 − 6) ÷ 9 = 0.89", "B earned less in absolute terms and considerably more per unit of risk"],
      result: "0.60 against 0.89",
      note: "An investor could hold B with borrowed money to match A's return at lower risk. That is why the ratio, not the raw return, is the fairer comparison."
    },
    limitations: ["Volatility treats upside and downside movement identically, though investors do not.", "It assumes returns are reasonably distributed, which fails for strategies with rare large losses.", "A short measurement period can flatter a strategy that has not yet met its bad environment."],
    misconceptions: [
      {
        claim: "“The fund with the highest return is the best.”",
        truth: "Not if it required double the risk. Two funds are only comparable once risk is accounted for."
      }
    ],
    application: ["Comparing funds with different volatility profiles.", "Assessing whether a strong return came from skill or from leverage."],
    related: ["portfolio-risk", "benchmarking", "risk-return", "absolute-relative-return"],
    prereq: ["portfolio-risk"],
    next: ["tracking-error"],
  },
  {
    id: "tracking-error",
    title: "Tracking Error",
    domain: "investments",
    category: "performance",
    subcategory: "Tracking Error",
    level: "Intermediate",
    oneLine: "How far a fund's returns deviate from its benchmark, which means opposite things for active and passive funds.",
    what: "Tracking error is the standard deviation of the difference between a portfolio's returns and its benchmark's returns. For an index fund, low tracking error is the objective, because the fund is meant to replicate. For an active fund, tracking error is unavoidable and necessary, because a portfolio identical to the index cannot outperform it.",
    simple: "For an index fund, deviation is a failure. For an active fund, deviation is the entire point.",
    formula: {
      main: "Tracking error = standard deviation of (Rₚ − Rᵇ)",
      others: [
        {
          label: "Information ratio",
          expr: "(Rₚ − Rᵇ) ÷ Tracking error"
        }
      ],
      variables: [
        {
          sym: "Rₚ",
          desc: "Portfolio return"
        },
        {
          sym: "Rᵇ",
          desc: "Benchmark return"
        }
      ]
    },
    interpretation: "An active fund with very low tracking error is charging active fees for something close to index performance. This is sometimes described as closet indexing, and it is the worst combination available to an investor: index returns with active costs.",
    misconceptions: [
      {
        claim: "“Lower tracking error is always better.”",
        truth: "For an index fund, yes. For an active fund it means the manager is barely doing anything different while charging as though they were."
      }
    ],
    application: ["Choosing between index funds tracking the same benchmark.", "Checking whether an active fund is genuinely active."],
    related: ["index-funds", "etf", "benchmarking", "cost-of-investing"],
    prereq: ["benchmarking"],
    next: ["cost-of-investing"],
  },
  {
    id: "value-investing",
    title: "Value Investing",
    domain: "investments",
    category: "strategies",
    subcategory: "Value Investing",
    level: "Intermediate",
    oneLine: "Buying assets for less than a considered estimate of their worth, and accepting that you may wait a long time.",
    what: "Value investing seeks securities trading below an estimate of intrinsic value, on the reasoning that price and value diverge and eventually reconverge. Its central discipline is the margin of safety: buying sufficiently below the estimate that being somewhat wrong remains survivable. It requires a valuation method, patience, and a tolerance for being unpopular.",
    simple: "Work out what it is worth. Buy it for meaningfully less. Wait, possibly for years.",
    components: [
      {
        k: "Intrinsic value",
        v: "An estimate of worth derived from the business, not from the price."
      },
      {
        k: "Margin of safety",
        v: "The gap between price paid and value estimated, which absorbs error."
      },
      {
        k: "Patience",
        v: "Reconvergence has no schedule and may take years."
      },
      {
        k: "The value trap",
        v: "A cheap asset that is cheap because the business is genuinely deteriorating."
      }
    ],
    limitations: ["A correct valuation can remain unrecognised by the market for a very long time.", "Cheapness and deterioration look identical at the moment of purchase.", "It requires disagreeing with the consensus, which is psychologically difficult to sustain."],
    misconceptions: [
      {
        claim: "“Value investing means buying low P/E stocks.”",
        truth: "A low multiple is a screening signal, not a valuation. Many low multiple companies are correctly priced for declining earnings."
      }
    ],
    application: ["Building a considered case before committing capital.", "Distinguishing a genuine discount from a deteriorating business."],
    related: ["fundamental-analysis", "valuation-multiples", "free-cash-flow", "growth-investing"],
    prereq: ["fundamental-analysis"],
    next: ["growth-investing"],
  },
  {
    id: "growth-investing",
    title: "Growth Investing",
    domain: "investments",
    category: "strategies",
    subcategory: "Growth Investing",
    level: "Intermediate",
    oneLine: "Buying businesses expected to expand rapidly, and paying a price that assumes they will.",
    what: "Growth investing targets companies whose revenue and earnings are expected to grow substantially faster than the market. Because that expectation is already reflected in the price, returns depend on growth exceeding what is already assumed. The risk is not that the company fails to grow, but that it grows more slowly than the price implied.",
    simple: "You are not paid for the company growing. You are paid for it growing faster than everyone already expects.",
    why: "Growth and value are not opposites. Both attempt to buy something for less than it is worth. They differ in where the value is assumed to sit, in current assets and earnings, or in future expansion.",
    components: [
      {
        k: "Revenue growth",
        v: "The primary driver, and the assumption most often extrapolated too far."
      },
      {
        k: "Reinvestment",
        v: "Growth requires capital, so cash flow is often negative while expanding."
      },
      {
        k: "Durability",
        v: "Whether growth can persist, which matters far more to valuation than its current rate."
      },
      {
        k: "Multiple risk",
        v: "High multiples fall sharply when growth expectations are revised."
      }
    ],
    example: {
      setup: "A company priced at 40 times earnings, where the market expects 25 percent annual growth. It delivers 15 percent.",
      steps: ["Earnings grew, so the business did not fail", "But the multiple compresses toward companies growing 15 percent, perhaps to 22 times", "Price change ≈ (1.15 × 22 ÷ 40) − 1 = −37 percent"],
      result: "A 37 percent fall despite growing 15 percent",
      note: "The company performed well. The price had already assumed better. That gap is where the loss came from."
    },
    misconceptions: [
      {
        claim: "“A growing company is a good investment.”",
        truth: "Only at a price that does not already assume more growth than it will deliver."
      }
    ],
    application: ["Testing what growth rate a current price implies.", "Understanding why strong results can be followed by falling prices."],
    related: ["valuation-multiples", "free-cash-flow", "value-investing", "discount-rate"],
    prereq: ["valuation-multiples"],
    next: ["passive-investing"],
  },
  {
    id: "passive-investing",
    title: "Passive Investing",
    domain: "investments",
    category: "strategies",
    subcategory: "Passive Investing",
    level: "Core",
    oneLine: "Declining to select, and capturing the market return at the lowest available cost.",
    what: "Passive investing holds a market or segment in its entirety through index funds or ETFs, making no attempt to select securities or time entry. Its logic is arithmetic rather than philosophical: the average actively managed rupee must earn the market return before costs, so after higher costs the average active investor must underperform the index.",
    simple: "If everyone together owns the market, everyone together earns the market return. After fees, those paying more must on average end up with less.",
    why: "This is not an opinion about whether skilled managers exist. It is a statement about what happens to the average, and about the certainty of cost against the uncertainty of outperformance.",
    components: [
      {
        k: "Market return",
        v: "What the index delivers, which the passive investor accepts."
      },
      {
        k: "Cost advantage",
        v: "Typically a large fraction of a percentage point a year, certain and permanent."
      },
      {
        k: "No manager risk",
        v: "No possibility of poor selection, and none of good selection either."
      },
      {
        k: "Full participation",
        v: "Including in falls, since there is no attempt to avoid them."
      }
    ],
    limitations: ["A capitalisation weighted index concentrates in whatever has already risen most.", "There is no mechanism to avoid a market decline.", "Index composition is decided by a committee following rules, which is a form of selection."],
    misconceptions: [
      {
        claim: "“Passive investing means settling for mediocrity.”",
        truth: "It means accepting the market return minus a very small cost. Historically that has beaten the majority of active funds over long periods."
      }
    ],
    application: ["Building a low cost core portfolio.", "Deciding where active management is worth paying for and where it is not."],
    related: ["index-funds", "etf", "cost-of-investing", "tracking-error"],
    prereq: ["index-funds"],
    next: ["dividend-investing"],
  },
  {
    id: "dividend-investing",
    title: "Dividend Investing",
    domain: "investments",
    category: "strategies",
    subcategory: "Dividend Investing",
    level: "Core",
    oneLine: "Investing for regular distributions rather than for price appreciation, with a trap built into the arithmetic.",
    what: "Dividend investing selects companies that distribute a meaningful and preferably growing share of profits as cash. The appeal is income that arrives without selling anything, and the discipline that paying cash imposes on management. The central risk is that dividend yield rises when the price falls, so the highest yields frequently signal expected trouble.",
    simple: "A company paying you cash regularly is attractive. A company with an unusually high yield is often one the market expects to cut it.",
    formula: {
      main: "Dividend yield = Dividend per share ÷ Share price × 100",
      others: [
        {
          label: "Payout ratio",
          expr: "Dividend per share ÷ Earnings per share"
        }
      ]
    },
    example: {
      setup: "A share pays ₹20 in dividends. Its price falls from ₹500 to ₹250 on poor results.",
      steps: ["Yield at ₹500 = 20 ÷ 500 = 4 percent", "Yield at ₹250 = 20 ÷ 250 = 8 percent", "The yield doubled because the price halved, not because anything improved"],
      result: "Yield rose from 4 to 8 percent",
      note: "Screening for the highest yields systematically selects for exactly this situation. The dividend is frequently cut soon afterwards."
    },
    interpretation: "A dividend is not free money. The company's value falls by roughly the amount distributed. The genuine benefits are the discipline imposed on management and the reduced need to sell holdings for income.",
    misconceptions: [
      {
        claim: "“High dividend yield means a good investment.”",
        truth: "It often means the price has fallen for a reason the market has already identified."
      },
      {
        claim: "“Dividends are additional to returns.”",
        truth: "They are part of total return, not an addition to it. A rupee paid out is a rupee no longer in the business."
      }
    ],
    application: ["Building income without needing to sell holdings.", "Checking whether a high yield is sustainable from cash flow."],
    related: ["dividend-policy", "equity", "financial-ratios", "free-cash-flow"],
    prereq: ["dividend-policy"],
    next: [],
  },
  {
    id: "underlying-asset",
    title: "The Underlying Asset",
    domain: "derivatives",
    category: "foundations",
    subcategory: "Underlying Asset",
    level: "Core",
    oneLine: "The thing a derivative refers to, which it never actually gives you.",
    what: "The underlying is the asset, rate or index from which a derivative takes its value. It may be a share, an index, a commodity, a currency or an interest rate. The derivative contract references it without conferring ownership of it, which is the entire point: exposure is separated from possession.",
    simple: "A contract on gold is not gold. It moves with gold and it is not gold.",
    why: "Every property of a derivative traces back to its underlying. Volatility, contract size, settlement method and the risks involved are all inherited from what the contract points at.",
    components: [
      {
        k: "Cash settled",
        v: "The difference in value is exchanged. No commodity or share changes hands."
      },
      {
        k: "Physically settled",
        v: "The underlying is actually delivered at expiry, common in some commodity contracts."
      },
      {
        k: "Reference rate",
        v: "For interest rate derivatives, a published rate rather than a tangible asset."
      },
      {
        k: "Basket or index",
        v: "Where the underlying is a defined group rather than a single asset."
      }
    ],
    misconceptions: [
      {
        claim: "“Buying a gold future means owning gold.”",
        truth: "It means holding a contract whose value tracks gold. Most such contracts are closed before delivery and settled in cash."
      }
    ],
    application: ["Understanding what a contract actually obliges you to do at expiry.", "Recognising why a derivative can move differently from its underlying."],
    related: ["derivative", "futures", "options", "contract-specifications"],
    prereq: ["derivative"],
    next: ["contract-specifications"],
  },
  {
    id: "contract-specifications",
    title: "Contract Specifications",
    domain: "derivatives",
    category: "foundations",
    subcategory: "Contract Specifications",
    level: "Core",
    oneLine: "The exact terms that make a contract standardised, and that decide how much money is at stake.",
    what: "Contract specifications are the exchange defined terms of a derivative: the underlying, the contract size or lot, the tick size, the expiry date, the settlement method and the trading hours. Standardisation is what allows exchange trading, because two parties who have never met can transact identical terms.",
    simple: "Everyone trading that contract is trading exactly the same thing. That is what makes it possible to trade it with a stranger.",
    why: "Specifications determine the real size of a position. A trader who thinks in points rather than in lot value routinely misjudges exposure by a factor of a hundred.",
    components: [
      {
        k: "Lot size",
        v: "Units of underlying per contract. Multiplies every price move."
      },
      {
        k: "Tick size",
        v: "The smallest permitted price increment."
      },
      {
        k: "Tick value",
        v: "Lot size multiplied by tick size, meaning the rupee value of one minimum move."
      },
      {
        k: "Expiry",
        v: "The date the contract ceases to exist."
      }
    ],
    example: {
      setup: "A gold contract with a lot of 100 and a tick of ₹1. A silver contract with a lot of 30 and a tick of ₹1.",
      steps: ["Gold: one tick = 1 × 100 = ₹100", "Silver: one tick = 1 × 30 = ₹30", "A hundred rupee move: gold ₹10,000, silver ₹3,000"],
      result: "₹100 against ₹30 per tick",
      note: "The same rupee movement in price means very different amounts of money, purely because of contract size."
    },
    misconceptions: [
      {
        claim: "“A cheaper contract is a smaller position.”",
        truth: "Position size is lot multiplied by price, not price alone. A low priced contract with a large lot can carry more exposure than a high priced one."
      }
    ],
    application: ["Calculating true position size before trading.", "Comparing risk across different contracts."],
    related: ["lot-size", "futures", "margin", "underlying-asset"],
    prereq: ["derivative"],
    next: ["lot-size", "margin"],
  },
  {
    id: "lot-size",
    title: "Contract Size and Lot Size",
    domain: "derivatives",
    category: "futures",
    subcategory: "Contract Size & Lot Size",
    level: "Core",
    oneLine: "The multiplier that turns a price movement into a rupee amount.",
    what: "Lot size is the number of units of the underlying represented by one contract. It is fixed by the exchange and cannot be varied by the trader, which means positions can only be taken in whole multiples. It is the single most important number for understanding how much money a position actually involves.",
    simple: "You are never trading one unit. You are trading a lot, and the lot decides how big your position really is.",
    formula: {
      main: "Contract value = Lot size × Price",
      others: [
        {
          label: "Profit or loss",
          expr: "(Exit price − Entry price) × Lot size × Number of lots"
        }
      ]
    },
    example: {
      setup: "An index future at 24,000 with a lot size of 75, one lot bought, and the index rises 80 points.",
      steps: ["Contract value = 24,000 × 75 = ₹18,00,000", "Profit = 80 × 75 = ₹6,000", "As a share of contract value = 0.33 percent"],
      result: "₹6,000 on a ₹18,00,000 position",
      note: "The trader may have committed only around ₹2,20,000 as margin. The same ₹6,000 is 2.7 percent of that, which is where leverage comes from."
    },
    interpretation: "Lot size is why derivatives feel larger than expected. A position that sounds modest in index points is a substantial sum in rupees, and the account moves accordingly.",
    misconceptions: [
      {
        claim: "“I only bought one contract, so my risk is small.”",
        truth: "One contract of a large lot size can carry exposure of many lakhs. Always compute contract value before deciding."
      }
    ],
    application: ["Sizing a position against the capital available.", "Comparing exposure across contracts with different lots."],
    related: ["contract-specifications", "futures", "margin", "position-sizing"],
    prereq: ["contract-specifications"],
    next: ["margin"],
  },
  {
    id: "margin",
    title: "Margin",
    domain: "derivatives",
    category: "foundations",
    subcategory: "Margin",
    level: "Core",
    oneLine: "Collateral posted against a position, not the price of it, and not a limit on what can be lost.",
    what: "Margin is money deposited with the broker or clearing house to cover potential loss on a derivative position. Initial margin is required to open the position. Maintenance margin is the level below which the account must be topped up. Because only margin is posted rather than full contract value, derivatives carry leverage by design.",
    simple: "You are not paying for the contract. You are placing a deposit against the possibility of losing on it.",
    why: "The distinction between margin and cost is where most derivative losses begin. Margin is not the maximum loss, and a position moving against you can require more money than was originally committed.",
    formula: {
      main: "Initial margin = Contract value × Margin percentage",
      others: [
        {
          label: "Leverage",
          expr: "Contract value ÷ Margin"
        },
        {
          label: "Move that exhausts margin",
          expr: "Margin ÷ (Lot size × Lots)"
        }
      ]
    },
    example: {
      setup: "An index future at 24,000, lot size 75, margin requirement 12 percent.",
      steps: ["Contract value = 24,000 × 75 = ₹18,00,000", "Margin = 18,00,000 × 0.12 = ₹2,16,000", "Leverage = 18,00,000 ÷ 2,16,000 = 8.3 times", "Margin is exhausted after a fall of 2,16,000 ÷ 75 = 2,880 points, or 12 percent"],
      result: "8.3 times leverage; 12 percent wipes out the margin",
      note: "A 12 percent adverse move removes the entire deposit. Beyond that, further money is owed rather than simply lost."
    },
    misconceptions: [
      {
        claim: "“Margin is the most I can lose.”",
        truth: "It is collateral, not a cap. If the position moves further against you, a margin call requires more funds and losses continue."
      },
      {
        claim: "“Low margin means low risk.”",
        truth: "Low margin means high leverage, which is the opposite. The risk is set by contract value, not by the deposit."
      }
    ],
    application: ["Calculating true leverage before opening a position.", "Working out the price at which a margin call arrives."],
    related: ["futures", "lot-size", "leverage", "mark-to-market"],
    prereq: ["futures"],
    next: ["mark-to-market"],
  },
  {
    id: "mark-to-market",
    title: "Mark to Market",
    domain: "derivatives",
    category: "futures",
    subcategory: "Mark to Market",
    level: "Core",
    oneLine: "Daily settlement of gains and losses in cash, so that no unpaid obligation accumulates.",
    what: "Mark to market is the daily process of revaluing open futures positions at the closing price and settling the difference in cash. Gains are credited and losses debited each day. This prevents losses building up unrecognised, and it is the mechanism that makes exchange traded futures safe for the clearing house.",
    simple: "Your losses are collected every evening rather than waiting until the end. That is why futures rarely leave anyone owing a fortune to a stranger.",
    why: "Mark to market converts credit risk into liquidity risk. The clearing house is protected because nothing goes unpaid overnight, but the trader must have cash available every single day.",
    example: {
      setup: "A futures position bought at 24,000, lot size 75, with margin of ₹2,16,000. The price closes at 23,700, then 23,500.",
      steps: ["Day one: (23,700 − 24,000) × 75 = −₹22,500 debited", "Day two: (23,500 − 23,700) × 75 = −₹15,000 debited", "Margin remaining = 2,16,000 − 37,500 = ₹1,78,500"],
      result: "₹37,500 paid out over two days",
      note: "The position is still open. That money has already left the account, and if margin falls below the maintenance level a call arrives for more."
    },
    interpretation: "This is why a trader can be right about direction and still be forced out. The market only has to move against you long enough for the daily cash demands to exceed what you have.",
    misconceptions: [
      {
        claim: "“A loss is not real until I close the position.”",
        truth: "In futures, it is settled in cash daily. The money is genuinely gone whether or not the position is closed."
      }
    ],
    application: ["Planning cash availability, not just margin, before taking a position.", "Understanding why leveraged positions fail on timing rather than on direction."],
    related: ["margin", "futures", "liquidity-risk", "basis"],
    prereq: ["margin"],
    next: ["basis"],
  },
  {
    id: "forwards",
    title: "Forwards",
    domain: "derivatives",
    category: "futures",
    subcategory: "Forwards",
    level: "Core",
    oneLine: "A private agreement to transact later at a price fixed now, with no exchange standing between the parties.",
    what: "A forward contract is a bilateral agreement to buy or sell an asset at a specified price on a future date. Unlike futures, forwards are not standardised or exchange traded. Terms are negotiated directly, which allows precise customisation and leaves each party exposed to the other's ability to perform.",
    simple: "A private deal. You get exactly the terms you want, and no one guarantees the other side will honour it.",
    components: [
      {
        k: "Customised terms",
        v: "Quantity, date and price are negotiated to fit the actual exposure."
      },
      {
        k: "Counterparty risk",
        v: "No clearing house stands between the parties."
      },
      {
        k: "No daily settlement",
        v: "Gains and losses accumulate until the settlement date."
      },
      {
        k: "Illiquidity",
        v: "There is no market to exit into. The contract is generally held to maturity."
      }
    ],
    interpretation: "Forwards and futures answer the same need differently. A forward fits the exposure exactly and carries credit risk. A future fits approximately and removes it.",
    misconceptions: [
      {
        claim: "“Forwards and futures are the same thing.”",
        truth: "Economically similar, structurally different. The absence of standardisation, daily settlement and a clearing house changes the risk entirely."
      }
    ],
    application: ["Hedging an exposure whose size and date do not match any listed contract.", "Understanding why exporters often use forwards rather than futures."],
    related: ["futures", "hedging", "credit-risk", "currency-risk"],
    prereq: ["derivative"],
    next: ["futures"],
  },
  {
    id: "basis",
    title: "Basis",
    domain: "derivatives",
    category: "futures",
    subcategory: "Basis",
    level: "Advanced",
    oneLine: "The gap between the futures price and the spot price, which must close by expiry.",
    what: "Basis is the difference between the spot price of an underlying and the price of its futures contract. It reflects the cost of carrying the asset until expiry: financing, storage and insurance, less any income the asset produces. As expiry approaches the basis narrows toward zero, because at expiry the two prices must converge.",
    simple: "A future usually costs slightly more than the thing itself, because someone has to hold the thing until then.",
    formula: {
      main: "Basis = Spot price − Futures price",
      others: [
        {
          label: "Fair futures price",
          expr: "F = S × (1 + r − y)ᵗ"
        }
      ],
      variables: [
        {
          sym: "S",
          desc: "Spot price"
        },
        {
          sym: "r",
          desc: "Financing cost"
        },
        {
          sym: "y",
          desc: "Income or convenience yield"
        },
        {
          sym: "t",
          desc: "Time to expiry in years"
        }
      ]
    },
    example: {
      setup: "Spot at 24,000, financing at 7 percent a year, dividend yield 1.4 percent, three months to expiry.",
      steps: ["Net carry = 7 − 1.4 = 5.6 percent a year, or 1.4 percent for the quarter", "Fair futures = 24,000 × 1.014 = 24,336", "Basis = 24,000 − 24,336 = −336"],
      result: "Futures trade about 336 points above spot",
      note: "If the actual futures price were 24,600, the gap would exceed carrying cost and an arbitrage would exist until the prices realigned."
    },
    interpretation: "Basis risk is what remains after hedging. A hedge using futures on a related but not identical asset leaves the hedger exposed to changes in the relationship between the two.",
    misconceptions: [
      {
        claim: "“A higher futures price means the market expects a rise.”",
        truth: "Usually it reflects carrying cost, not a forecast. Convergence at expiry is arithmetic, not prediction."
      }
    ],
    application: ["Assessing whether a futures price is fair.", "Understanding residual risk in a hedge."],
    related: ["futures", "arbitrage", "hedging", "interest-rates"],
    prereq: ["futures"],
    next: ["arbitrage"],
  },
  {
    id: "put-options",
    title: "Put Options",
    domain: "derivatives",
    category: "options",
    subcategory: "Put Options",
    level: "Core",
    oneLine: "The right to sell at a fixed price, which gains value when the underlying falls.",
    what: "A put option gives the buyer the right, but not the obligation, to sell the underlying at the strike price on or before expiry. The buyer pays a premium for that right. Puts gain value as the underlying falls, which makes them the standard instrument for protecting a holding against decline.",
    simple: "You pay a fee for the right to sell at a set price. If the price collapses, you can still sell at the level you fixed.",
    formula: {
      main: "Put payoff at expiry = max(Strike − Spot, 0) − Premium",
      others: [
        {
          label: "Breakeven",
          expr: "Strike − Premium"
        },
        {
          label: "Maximum loss for a buyer",
          expr: "The premium paid"
        }
      ]
    },
    example: {
      setup: "A put with a strike of 24,000 bought for ₹260, lot size 75. Compare expiry at 23,400 and at 24,300.",
      steps: ["At 23,400: max(24,000 − 23,400, 0) = 600. Net = 600 − 260 = ₹340 per unit, or ₹25,500", "At 24,300: max(24,000 − 24,300, 0) = 0. Loss = premium = ₹260 per unit, or ₹19,500", "Breakeven = 24,000 − 260 = 23,740"],
      result: "₹25,500 gain or ₹19,500 loss",
      note: "The put only begins to pay below 23,740. A fall to 23,900 is a fall, and still a total loss of premium."
    },
    interpretation: "A put is insurance with a stated cost. As with insurance, most policies expire unused, and the premium spent is the price of not having needed it.",
    misconceptions: [
      {
        claim: "“If the market falls, my put makes money.”",
        truth: "Only if it falls past the breakeven before expiry. Direction alone is not enough."
      }
    ],
    application: ["Protecting an existing holding against a fall over a defined period.", "Expressing a bearish view with loss limited to the premium."],
    related: ["options", "strike-premium", "payoff-diagrams", "hedging"],
    prereq: ["options"],
    next: ["strike-premium"],
    sim: "options",
  },
  {
    id: "strike-premium",
    title: "Strike and Premium",
    domain: "derivatives",
    category: "options",
    subcategory: "Strike & Premium",
    level: "Core",
    oneLine: "The price you fix, and the price you pay to fix it.",
    what: "The strike is the price at which an option may be exercised. The premium is what the buyer pays the seller for that right. The relationship between the strike and the current price of the underlying determines whether an option is in the money, at the money or out of the money, and that in turn shapes how much of the premium is intrinsic value and how much is time value.",
    simple: "The strike is the deal you are locking in. The premium is what that deal costs.",
    components: [
      {
        k: "In the money",
        v: "Exercising now would produce value. A call below spot, or a put above it."
      },
      {
        k: "At the money",
        v: "Strike is at or very near the current price."
      },
      {
        k: "Out of the money",
        v: "Exercising now would produce nothing. All of the premium is time value."
      },
      {
        k: "Moneyness",
        v: "The relationship between strike and spot, which drives the premium."
      }
    ],
    example: {
      setup: "Spot at 24,000. A call with a strike of 23,800 costs ₹340. A call with a strike of 24,400 costs ₹95.",
      steps: ["23,800 call: intrinsic = 24,000 − 23,800 = 200, time value = 340 − 200 = 140", "24,400 call: intrinsic = 0, time value = 95, the entire premium", "The cheaper option is cheaper because it needs a larger move to be worth anything"],
      result: "₹340 against ₹95",
      note: "Cheap options are not better value. They are cheap because the probability of them finishing in the money is lower."
    },
    misconceptions: [
      {
        claim: "“The cheapest option gives the best return.”",
        truth: "It requires the largest move to become profitable. Most far out of the money options expire worthless."
      }
    ],
    application: ["Choosing a strike appropriate to the move you actually expect.", "Understanding why two options on the same underlying cost very differently."],
    related: ["options", "put-options", "intrinsic-time-value", "payoff-diagrams"],
    prereq: ["options"],
    next: ["intrinsic-time-value"],
  },
  {
    id: "payoff-diagrams",
    title: "Payoff Diagrams",
    domain: "derivatives",
    category: "options",
    subcategory: "Payoff Diagrams",
    level: "Core",
    oneLine: "A picture of what a position is worth at every possible price, which reveals what words cannot.",
    what: "A payoff diagram plots the profit or loss of a position at expiry against the price of the underlying. It shows the breakeven point, the maximum gain and the maximum loss in a single view. For options, whose outcomes bend at the strike rather than moving linearly, the diagram is the clearest way to understand a position.",
    simple: "Draw what you make or lose at every price. The shape tells you everything about the position.",
    components: [
      {
        k: "The bend",
        v: "At the strike, where the payoff changes direction. Linear instruments have no bend."
      },
      {
        k: "Breakeven",
        v: "Where the line crosses zero, which is the strike adjusted for the premium."
      },
      {
        k: "Floor or ceiling",
        v: "Where the payoff stops changing, which is the maximum loss or gain."
      },
      {
        k: "Asymmetry",
        v: "Limited loss with open ended gain for a buyer, and the mirror image for a seller."
      }
    ],
    interpretation: "The bought call and the sold call are exact mirror images across the horizontal axis. Everything one side gains, the other loses. That symmetry is why sellers collect a premium and carry the larger risk.",
    misconceptions: [
      {
        claim: "“Selling options is safer because you receive money upfront.”",
        truth: "The diagram shows why not. The seller's maximum gain is the premium, while the potential loss extends far beyond it."
      }
    ],
    application: ["Understanding a position before entering it.", "Checking whether a strategy's risk is genuinely limited."],
    related: ["options", "put-options", "strike-premium", "derivative-strategies"],
    prereq: ["options"],
    next: ["intrinsic-time-value"],
    sim: "options",
  },
  {
    id: "intrinsic-time-value",
    title: "Intrinsic and Time Value",
    domain: "derivatives",
    category: "options",
    subcategory: "Intrinsic & Time Value",
    level: "Intermediate",
    oneLine: "What an option is worth now, and what is being paid for the chance that it improves.",
    what: "An option premium has two components. Intrinsic value is what the option would be worth if exercised immediately, and it can never be negative. Time value is everything else: the amount paid for the possibility of a favourable move before expiry. Time value decays toward zero as expiry approaches, and the decay accelerates near the end.",
    simple: "Part of the price is what it is worth today. The rest is what you are paying for time, and time runs out.",
    formula: {
      main: "Premium = Intrinsic value + Time value",
      others: [
        {
          label: "Call intrinsic",
          expr: "max(Spot − Strike, 0)"
        },
        {
          label: "Put intrinsic",
          expr: "max(Strike − Spot, 0)"
        }
      ]
    },
    example: {
      setup: "Spot at 24,000. A 23,800 call trades at ₹340 with 20 days to expiry, and at ₹215 with 5 days left, spot unchanged.",
      steps: ["Intrinsic = 24,000 − 23,800 = 200 in both cases", "Time value at 20 days = 340 − 200 = 140", "Time value at 5 days = 215 − 200 = 15"],
      result: "₹125 of time value lost with no price movement",
      note: "The underlying did not move at all. The option holder lost money purely because time passed."
    },
    interpretation: "This is why option buyers can be right about direction and still lose. The move must be large enough and soon enough to outrun the decay.",
    misconceptions: [
      {
        claim: "“If the price does not move, nothing happens.”",
        truth: "For an option buyer, a stationary price is a slow loss. For a seller it is the source of profit."
      }
    ],
    application: ["Choosing an expiry that gives a view enough time to work.", "Understanding why options lose value in quiet markets."],
    related: ["options", "strike-premium", "option-greeks", "put-options"],
    prereq: ["strike-premium"],
    next: ["option-greeks"],
  },
  {
    id: "option-greeks",
    title: "Option Greeks",
    domain: "derivatives",
    category: "options",
    subcategory: "Option Greeks",
    level: "Advanced",
    oneLine: "Measures of how an option's price responds to each variable that moves it.",
    what: "The Greeks quantify the sensitivity of an option's price to individual factors. Delta measures the response to a change in the underlying. Gamma measures how delta itself changes. Theta measures the loss from the passage of time. Vega measures the response to a change in expected volatility. Rho measures sensitivity to interest rates.",
    simple: "An option's price is pushed by several forces at once. The Greeks tell you how hard each one is pushing.",
    components: [
      {
        k: "Delta",
        v: "Change in option price for a one unit move in the underlying. Roughly 0 to 1 for calls, 0 to −1 for puts."
      },
      {
        k: "Gamma",
        v: "How quickly delta changes. Largest near the strike and near expiry, which is where positions become unstable."
      },
      {
        k: "Theta",
        v: "Value lost per day from time passing. Negative for buyers and positive for sellers."
      },
      {
        k: "Vega",
        v: "Change in price for a one point change in implied volatility. Both calls and puts gain when expected volatility rises."
      }
    ],
    example: {
      setup: "A call priced at ₹210 with delta 0.45, theta −₹8 per day, and the underlying rising 60 points overnight.",
      steps: ["Move from delta = 0.45 × 60 = +₹27", "Loss from theta = −₹8", "Estimated new price ≈ 210 + 27 − 8 = ₹229"],
      result: "About ₹229",
      note: "The estimate is approximate because delta itself changed as the price moved. That change is gamma."
    },
    interpretation: "Delta is often read as a rough probability of finishing in the money. A delta of 0.20 suggests the market prices roughly a one in five chance, which is a more useful way to read an option chain than the premium alone.",
    misconceptions: [
      {
        claim: "“If I am right about direction, I profit.”",
        truth: "Theta erodes value daily and a fall in implied volatility can reduce the premium even as the underlying moves your way."
      }
    ],
    application: ["Estimating how a position will respond before the move happens.", "Understanding why a correct view can still lose money."],
    related: ["intrinsic-time-value", "options", "payoff-diagrams", "market-risk"],
    prereq: ["intrinsic-time-value"],
    next: ["derivative-strategies"],
  },
  {
    id: "interest-rate-swaps",
    title: "Interest Rate Swaps",
    domain: "derivatives",
    category: "swaps",
    subcategory: "Interest Rate Swaps",
    level: "Advanced",
    oneLine: "Two parties exchanging interest obligations, so each ends up with the kind of rate it prefers.",
    what: "An interest rate swap is an agreement to exchange streams of interest payments on an agreed notional amount. Typically one party pays a fixed rate and receives a floating rate while the other does the reverse. The notional is never exchanged. Only the difference between the two payment streams changes hands on each date.",
    simple: "You have a floating rate loan and want certainty. Someone else has fixed and wants flexibility. You swap the payments, not the loans.",
    why: "A swap lets a borrower change the character of its interest obligation without renegotiating or refinancing the underlying debt. It separates the decision about how to borrow from the decision about what rate exposure to carry.",
    example: {
      setup: "A company with ₹100 crore of floating rate debt enters a swap to pay 7.4 percent fixed and receive the floating rate.",
      steps: ["It pays floating on its loan and receives floating from the swap, and the two offset", "It pays 7.4 percent fixed on the swap", "Its net cost is fixed at 7.4 percent regardless of where rates go"],
      result: "Floating exposure converted to fixed",
      note: "The loan was never touched. Only the interest character changed, and the ₹100 crore notional never moved."
    },
    components: [
      {
        k: "Notional",
        v: "The reference amount used to calculate payments. Never exchanged."
      },
      {
        k: "Fixed leg",
        v: "A rate agreed at the outset for the life of the swap."
      },
      {
        k: "Floating leg",
        v: "Reset periodically against a reference rate."
      },
      {
        k: "Net settlement",
        v: "Only the difference between the legs is paid on each date."
      }
    ],
    misconceptions: [
      {
        claim: "“A swap means borrowing money from the counterparty.”",
        truth: "No principal changes hands. The notional exists only to size the interest calculation."
      }
    ],
    application: ["Converting floating rate debt into fixed rate exposure.", "Understanding how firms manage interest rate risk without refinancing."],
    related: ["interest-rates", "currency-swaps", "hedging", "credit-risk"],
    prereq: ["interest-rates"],
    next: ["currency-swaps"],
  },
  {
    id: "currency-swaps",
    title: "Currency Swaps",
    domain: "derivatives",
    category: "swaps",
    subcategory: "Currency Swaps",
    level: "Advanced",
    oneLine: "Exchanging payment obligations in two different currencies, usually including the principal.",
    what: "A currency swap exchanges interest payments, and normally the principal, denominated in two different currencies. Unlike an interest rate swap, the principal is typically exchanged at the start and returned at the end at an agreed rate. It allows an entity to borrow where it has the best access and end up with an obligation in the currency it actually earns.",
    simple: "You can borrow cheaply in dollars but you earn in rupees. A swap turns the dollar obligation into a rupee one.",
    example: {
      setup: "An Indian company borrows US$10 million at 5 percent and swaps into rupees at ₹84, paying 8.2 percent.",
      steps: ["It receives ₹84 crore at the outset and pays back dollars through the swap", "Its obligation is now 8.2 percent in rupees rather than 5 percent in dollars", "If the rupee falls to ₹92, the unhedged cost would have risen sharply. The swap removed that"],
      result: "Currency risk transferred to the counterparty",
      note: "The apparent 3.2 percentage point saving from borrowing in dollars was compensation for currency risk. The swap converts that saving into certainty."
    },
    misconceptions: [
      {
        claim: "“Borrowing abroad is cheaper.”",
        truth: "The lower rate largely reflects expected currency movement. Once swapped into the home currency, most of the apparent advantage disappears."
      }
    ],
    application: ["Managing foreign currency debt for a company earning domestically.", "Understanding why the rate differential is not free money."],
    related: ["currency-risk", "interest-rate-swaps", "foreign-exchange", "hedging"],
    prereq: ["currency-risk"],
    next: ["hedging"],
  },
  {
    id: "speculation",
    title: "Speculation",
    domain: "derivatives",
    category: "uses",
    subcategory: "Speculation",
    level: "Core",
    oneLine: "Taking risk deliberately in pursuit of return, which is a function markets require and individuals frequently lose at.",
    what: "Speculation is taking a position to profit from an expected price movement, without an underlying exposure to offset. It is the counterpart of hedging: a hedger transfers risk and a speculator accepts it. Markets need speculators, because a hedger cannot transfer risk unless someone is willing to take the other side.",
    simple: "A hedger is protecting something they already have. A speculator is taking a position purely on a view.",
    why: "Speculation provides the liquidity that makes hedging possible. It is a legitimate market function. It is also, at an individual level, an activity where the documented outcomes are poor and the costs are certain.",
    realWorld: "Regulatory analysis of individual traders in the equity derivatives segment has found that the large majority incur net losses, and that transaction costs consume a substantial further share of both losses and profits. The disclosure appears on the FinHub simulator for that reason.",
    components: [
      {
        k: "Directional view",
        v: "A position taken on where a price will go."
      },
      {
        k: "No offsetting exposure",
        v: "Unlike a hedge, there is nothing on the other side to protect."
      },
      {
        k: "Leverage",
        v: "Derivatives allow large exposure from small capital, which magnifies both outcomes."
      },
      {
        k: "Transaction cost",
        v: "Certain, recurring, and independent of whether the view is correct."
      }
    ],
    misconceptions: [
      {
        claim: "“Speculation is gambling.”",
        truth: "It differs in that the risk being taken already exists in the economy and is being transferred rather than created. That distinction does not make individual outcomes any better."
      }
    ],
    application: ["Understanding why markets need participants willing to take risk.", "Assessing honestly whether an activity is hedging or speculation."],
    related: ["hedging", "arbitrage", "derivative", "market-risk"],
    prereq: ["derivative"],
    next: ["arbitrage"],
  },
  {
    id: "arbitrage",
    title: "Arbitrage",
    domain: "derivatives",
    category: "uses",
    subcategory: "Arbitrage",
    level: "Advanced",
    oneLine: "Profiting from the same thing being priced differently in two places, which is what keeps prices consistent.",
    what: "Arbitrage is the simultaneous purchase and sale of related assets to profit from a price discrepancy, in principle without net risk. True arbitrage is rare and short lived, because the act of exploiting it removes it. Its economic function is enforcement: arbitrage is the mechanism that keeps related prices in a consistent relationship.",
    simple: "If the same thing costs less here than there, buying here and selling there is profit until the prices meet.",
    why: "Arbitrage explains why the futures price cannot drift far from spot, why the same share cannot trade at very different prices on two exchanges, and why option prices maintain defined relationships to one another.",
    example: {
      setup: "Spot at 24,000. Financing costs 1.4 percent for the quarter, so the fair futures price is 24,336. The future actually trades at 24,600.",
      steps: ["Sell the future at 24,600 and buy the underlying at 24,000, financed at 1.4 percent", "At expiry the prices converge and the position is closed", "Locked in gain = 24,600 − 24,336 = 264 points before costs"],
      result: "264 points, less transaction costs",
      note: "In practice the gap is usually smaller than the cost of exploiting it, which is precisely why it stays small."
    },
    limitations: ["Transaction costs frequently exceed the discrepancy.", "Execution risk, where one leg fills and the other does not.", "Positions described as arbitrage often carry hidden risk, and that assumption has caused major failures."],
    misconceptions: [
      {
        claim: "“Arbitrage is risk free profit.”",
        truth: "Textbook arbitrage is. What is practised under that name usually involves financing risk, execution risk or a relationship that can widen before it converges."
      }
    ],
    application: ["Understanding why futures and spot prices stay linked.", "Recognising when a strategy described as arbitrage is not one."],
    related: ["basis", "futures", "price-discovery", "market-liquidity"],
    prereq: ["basis"],
    next: ["derivative-strategies"],
  },
  {
    id: "derivative-strategies",
    title: "Derivative Strategies",
    domain: "derivatives",
    category: "uses",
    subcategory: "Derivative Strategies",
    level: "Advanced",
    oneLine: "Combining positions so that the resulting payoff matches a specific view more precisely than any single contract.",
    what: "A derivative strategy combines two or more positions to shape a payoff. Buying one option and selling another with a different strike caps both the cost and the maximum gain. Holding the underlying while selling a call generates income and forfeits upside. Each combination expresses a more specific view than a single position can.",
    simple: "One option is a blunt instrument. Combining two lets you say exactly what you think and cap what it costs.",
    components: [
      {
        k: "Covered call",
        v: "Holding the underlying and selling a call. Income now, upside surrendered above the strike."
      },
      {
        k: "Protective put",
        v: "Holding the underlying and buying a put. A floor beneath the position, paid for with premium."
      },
      {
        k: "Spread",
        v: "Buying one option and selling another. Reduces cost and caps the gain."
      },
      {
        k: "Straddle",
        v: "Buying a call and a put at the same strike. A position on the size of a move rather than its direction."
      }
    ],
    example: {
      setup: "A call spread: buy the 24,000 call at ₹260, sell the 24,400 call at ₹105. Lot size 75.",
      steps: ["Net cost = 260 − 105 = ₹155 per unit, or ₹11,625", "Maximum gain = (24,400 − 24,000) − 155 = 245 per unit, or ₹18,375", "Maximum loss = the net premium, ₹11,625. Breakeven = 24,155"],
      result: "Risk ₹11,625 to make at most ₹18,375",
      note: "The sold call cut the cost by forty percent and capped the gain. That trade off is the entire purpose of a spread."
    },
    misconceptions: [
      {
        claim: "“More complex strategies are safer.”",
        truth: "Complexity narrows the range of outcomes, it does not remove risk. Strategies involving sold options can carry substantial or unlimited loss."
      }
    ],
    application: ["Expressing a view with a defined maximum cost.", "Generating income from a holding you are content to sell at a known level."],
    related: ["options", "payoff-diagrams", "option-greeks", "hedging"],
    prereq: ["option-greeks"],
    next: ["position-sizing"],
    sim: "options",
  },
  {
    id: "operational-risk",
    title: "Operational Risk",
    domain: "derivatives",
    category: "risk-types",
    subcategory: "Operational Risk",
    level: "Core",
    oneLine: "Loss from failed processes, systems, people or external events, rather than from any market movement.",
    what: "Operational risk is the risk of loss arising from inadequate or failed internal processes, people and systems, or from external events. It includes error, fraud, system failure, legal risk and disruption. Unlike market or credit risk, it is not taken deliberately in exchange for return. It is a cost of operating that must be controlled rather than priced.",
    simple: "Nothing moved in the market. Someone entered the wrong number, or a system stopped working.",
    why: "Some of the largest single losses in financial history were operational rather than market driven. A trader exceeding limits undetected, a settlement failure, or an order entered with an extra zero can cost more than a market crash.",
    components: [
      {
        k: "Process failure",
        v: "Reconciliation gaps, settlement errors, inadequate controls."
      },
      {
        k: "People",
        v: "Error, unauthorised activity, concentration of authority without oversight."
      },
      {
        k: "Systems",
        v: "Outages, data loss, failures in trading or risk infrastructure."
      },
      {
        k: "External events",
        v: "Disruption, legal action, third party failure."
      }
    ],
    interpretation: "Operational risk is uncompensated. Nobody earns a premium for it, which is why it is managed through controls, segregation of duties and audit rather than through pricing.",
    misconceptions: [
      {
        claim: "“Operational risk is a small technical matter.”",
        truth: "It has produced some of the largest losses ever recorded at individual institutions, several of which caused outright failure."
      }
    ],
    application: ["Assessing whether an institution's controls match the risks it takes.", "Understanding why segregation of duties exists."],
    related: ["market-risk", "credit-risk", "systemic-risk", "risk-identification"],
    prereq: ["risk-return"],
    next: ["systemic-risk"],
  },
  {
    id: "systemic-risk",
    title: "Systemic Risk",
    domain: "derivatives",
    category: "risk-types",
    subcategory: "Systemic Risk",
    level: "Advanced",
    oneLine: "The risk that a failure in one part of the financial system brings down parts that were otherwise sound.",
    what: "Systemic risk is the risk of collapse of an entire system rather than of an individual participant. It arises from interconnection, common exposures and confidence. An institution is systemically important when its failure would propagate through the system rather than being absorbed by it.",
    simple: "One institution failing is a loss. One institution failing and taking others with it is a different kind of problem.",
    components: [
      {
        k: "Interconnection",
        v: "Obligations between institutions transmit failure from one to the next."
      },
      {
        k: "Common exposure",
        v: "Many institutions holding the same risk, so they weaken simultaneously."
      },
      {
        k: "Confidence",
        v: "Funding withdraws from a category rather than a company, so sound institutions are affected too."
      },
      {
        k: "Procyclicality",
        v: "Responses that are individually sensible and collectively destabilising, such as everyone selling at once."
      }
    ],
    realWorld: "In 2018, a single infrastructure lender defaulting in India caused funding to withdraw from non banking lenders as a whole. Firms with entirely different balance sheets faced immediate stress, because lenders could not quickly distinguish between them.",
    caseRef: "ilfs-2018",
    interpretation: "Systemic risk explains why regulators intervene in cases where a private loss would otherwise be allowed to fall where it lands. The intervention is not about the firm, it is about what happens next.",
    misconceptions: [
      {
        claim: "“A well run institution is safe from systemic events.”",
        truth: "It is not, because funding withdraws from categories under stress. Being sound does not help if nobody can tell that you are."
      }
    ],
    application: ["Understanding why regulation focuses on interconnection and capital.", "Recognising why sector wide stress affects individually sound firms."],
    related: ["liquidity-risk", "credit-risk", "operational-risk", "nbfc"],
    prereq: ["liquidity-risk"],
    next: ["stress-testing"],
  },
  {
    id: "risk-identification",
    title: "Risk Identification",
    domain: "derivatives",
    category: "risk-mgmt",
    subcategory: "Risk Identification",
    level: "Core",
    oneLine: "Naming what can actually go wrong, which must happen before anything can be measured or managed.",
    what: "Risk identification is the systematic process of determining what exposures exist before attempting to quantify or control them. It precedes measurement, because a risk that has not been named cannot be measured, hedged or limited. Most large failures involve a risk that was present, unnamed and therefore unmonitored.",
    simple: "You cannot manage what you have not noticed. The first job is to write down what could actually hurt you.",
    components: [
      {
        k: "Exposure mapping",
        v: "Which positions and obligations exist, and to what they are sensitive."
      },
      {
        k: "Correlation of risks",
        v: "Whether several exposures can fail for the same underlying reason."
      },
      {
        k: "Second order effects",
        v: "What follows from the first loss, such as a funding withdrawal after a mark down."
      },
      {
        k: "Unknown exposure",
        v: "Where the institution does not know what it holds, which is itself the finding."
      }
    ],
    interpretation: "The pattern in most major failures is not that a risk was mismeasured. It is that a risk was never on the list. Mortgage securities in 2008 were measured carefully for credit risk and never assessed for the possibility that every loan depended on one national factor.",
    misconceptions: [
      {
        claim: "“We have a risk model, so risk is managed.”",
        truth: "A model quantifies the risks entered into it. It is silent about anything nobody thought to include."
      }
    ],
    application: ["Listing exposures before sizing positions.", "Testing whether apparently separate risks share a common cause."],
    related: ["value-at-risk", "stress-testing", "position-sizing", "diversification"],
    prereq: ["risk-return"],
    next: ["value-at-risk"],
  },
  {
    id: "value-at-risk",
    title: "Value at Risk",
    domain: "derivatives",
    category: "risk-mgmt",
    subcategory: "Value at Risk",
    level: "Advanced",
    oneLine: "An estimate of the loss that will not be exceeded on most days, and a measure that says nothing about the rest.",
    what: "Value at Risk estimates the maximum loss expected over a defined period at a stated confidence level. A one day 99 percent VaR of one crore means that on 99 days out of 100 the loss is expected to be smaller than one crore. It is widely used because it reduces complex exposure to a single figure, and widely criticised for exactly the same reason.",
    simple: "It tells you what a bad day looks like. It tells you nothing about what a catastrophic day looks like.",
    formula: {
      main: "VaR = Portfolio value × z × σ × √t",
      variables: [
        {
          sym: "z",
          desc: "Number of standard deviations for the confidence level, about 2.33 at 99 percent"
        },
        {
          sym: "σ",
          desc: "Daily volatility of returns"
        },
        {
          sym: "t",
          desc: "Holding period in days"
        }
      ]
    },
    example: {
      setup: "A ₹50 crore portfolio with daily volatility of 1.1 percent, one day horizon, 99 percent confidence.",
      steps: ["VaR = 50,00,00,000 × 2.33 × 0.011 × √1", "VaR = ₹1,28,15,000 approximately"],
      result: "About ₹1.28 crore",
      note: "This says nothing about the other one percent of days. The loss on those days could be far larger, and VaR does not estimate it."
    },
    limitations: ["It is silent about the size of losses beyond the confidence level, which is where failures occur.", "It usually assumes a distribution that understates the frequency of extreme moves.", "It is calculated from historical data, so it does not anticipate conditions that have not yet occurred."],
    misconceptions: [
      {
        claim: "“VaR is the maximum we can lose.”",
        truth: "It is the threshold that is not expected to be exceeded on most days. The days it is exceeded are precisely the ones that matter."
      }
    ],
    application: ["Setting position limits against a common measure.", "Understanding why VaR must be paired with stress testing."],
    related: ["stress-testing", "portfolio-risk", "market-risk", "risk-identification"],
    prereq: ["portfolio-risk"],
    next: ["stress-testing"],
  },
  {
    id: "stress-testing",
    title: "Stress Testing",
    domain: "derivatives",
    category: "risk-mgmt",
    subcategory: "Stress Testing",
    level: "Advanced",
    oneLine: "Asking what happens in a specific severe scenario, rather than what happens on a statistically normal day.",
    what: "Stress testing evaluates the effect of severe but plausible scenarios on a portfolio or institution. Unlike Value at Risk, it does not rely on a probability distribution. It asks a direct question: if this specific thing happened, what would we lose, and could we survive it. Scenarios may be historical or hypothetical.",
    simple: "Instead of asking what a normal bad day looks like, you ask what happens if a particular disaster occurs.",
    why: "Stress testing exists to cover what VaR cannot. Extreme events are rare, so historical distributions understate them. A scenario approach sidesteps probability entirely and examines survival directly.",
    components: [
      {
        k: "Historical scenario",
        v: "Applying the movements of a past crisis to the current portfolio."
      },
      {
        k: "Hypothetical scenario",
        v: "A constructed shock, such as a specified rate rise combined with currency depreciation."
      },
      {
        k: "Reverse stress test",
        v: "Starting from failure and working backwards to what would cause it."
      },
      {
        k: "Liquidity stress",
        v: "Testing whether obligations could be met, not merely whether the balance sheet survives."
      }
    ],
    interpretation: "The reverse stress test is often the most valuable. Asking what would have to happen for this institution to fail frequently produces an answer that nobody had written down before.",
    misconceptions: [
      {
        claim: "“We passed the stress test, so we are safe.”",
        truth: "You survived the scenarios chosen. The scenario nobody imagined is the one that has historically caused failure."
      }
    ],
    application: ["Testing survival rather than expected loss.", "Identifying the specific combination of events that would be fatal."],
    related: ["value-at-risk", "systemic-risk", "liquidity-risk", "risk-identification"],
    prereq: ["value-at-risk"],
    next: ["position-sizing"],
  },
  {
    id: "position-sizing",
    title: "Position Sizing",
    domain: "derivatives",
    category: "risk-mgmt",
    subcategory: "Position Sizing",
    level: "Core",
    oneLine: "Deciding how much to commit, which matters more to survival than deciding what to buy.",
    what: "Position sizing determines how much capital is exposed to a single position. It converts a view into an amount. Because losses compound against a shrinking base, sizing has a mathematical property that selection does not: a large enough loss makes recovery arithmetically difficult regardless of what follows.",
    simple: "Being right about what to buy matters. Being wrong about how much to buy is what ends accounts.",
    formula: {
      main: "Position size = Capital at risk ÷ Loss per unit at the exit level",
      others: [
        {
          label: "Recovery required after a loss",
          expr: "Gain needed = 1 ÷ (1 − loss) − 1"
        }
      ]
    },
    example: {
      setup: "What gain is needed to recover from losses of different sizes.",
      steps: ["A 20 percent loss requires a 25 percent gain to recover", "A 50 percent loss requires a 100 percent gain", "An 80 percent loss requires a 400 percent gain"],
      result: "Recovery becomes disproportionately harder",
      note: "This asymmetry is why sizing dominates selection. Avoiding the large loss matters more than capturing the large gain."
    },
    interpretation: "With leveraged instruments, sizing must be calculated from contract value rather than from margin. A position that consumes a modest share of capital as margin can represent many times that in actual exposure.",
    misconceptions: [
      {
        claim: "“If I am confident, I should commit more.”",
        truth: "Confidence is not accuracy. Sizing should reflect what a wrong outcome would cost, not how certain the view feels."
      }
    ],
    application: ["Setting a maximum loss per position before entering it.", "Sizing derivative positions from contract value rather than margin."],
    related: ["margin", "lot-size", "portfolio-risk", "risk-identification"],
    prereq: ["margin"],
    next: [],
  },
  {
    id: 'equity',
    title: 'Equity',
    domain: 'investments', category: 'asset-classes', subcategory: 'Equity',
    level: 'Foundational',
    oneLine: 'A share of ownership in a business, and a claim on whatever remains after everyone else is paid.',
    what: 'Equity represents ownership in a company. A shareholder owns a proportional share of the business, carries voting rights in most cases, and holds a residual claim — meaning they are paid only after employees, suppliers, lenders and tax authorities. Returns come from two sources: dividends distributed from profits, and capital appreciation if the market values the business more highly over time.',
    simple: 'You own a slice of the business. If it prospers you gain; if it fails, you are last in the queue.',
    why: 'Equity is the asset class with the highest long-run expected return and the widest range of outcomes. That combination is not a coincidence — the residual claim is precisely what makes it risky, and the risk is precisely what earns the premium.',
    components: [
      { k: 'Ownership stake', v: 'A proportional claim on the company\u2019s assets and future profits.' },
      { k: 'Residual claim', v: 'Paid last in both good times and bad, which is the source of both upside and risk.' },
      { k: 'Dividends', v: 'Cash distributed from profits, at the company\u2019s discretion — not a contractual obligation.' },
      { k: 'Capital appreciation', v: 'Change in market price, driven by expectations of future earnings.' },
    ],
    example: {
      setup: 'A company has 10,00,000 shares outstanding and reports a net profit of ₹5,00,00,000. You hold 1,000 shares.',
      steps: [
        'Earnings per share = 5,00,00,000 ÷ 10,00,000 = ₹50',
        'Your share of profit = 1,000 × ₹50 = ₹50,000',
        'If the company pays out 30% as dividend: 1,000 × ₹15 = ₹15,000 received in cash',
      ],
      result: '₹50,000 earned, ₹15,000 received',
      note: 'The remaining ₹35,000 stays in the business as retained earnings. It still belongs to you — it is reinvested rather than distributed.',
    },
    misconceptions: [
      { claim: '“Share price reflects what a company is worth today.”', truth: 'Price reflects the market\u2019s expectation of future earnings, discounted to the present. It is a forecast, not a measurement.' },
      { claim: '“Equity is safe over the long run.”', truth: 'Long horizons historically reduce the chance of loss, but do not eliminate it. Individual companies fail permanently.' },
    ],
    application: ['Building the growth portion of a long-horizon portfolio.', 'Understanding why equity holders demand a higher return than lenders.'],
    related: ['risk-return', 'fixed-income', 'diversification', 'financial-ratios'],
    prereq: ['risk-return'], next: ['fixed-income', 'diversification'],
  },
  {
    id: 'fixed-income',
    title: 'Fixed Income',
    domain: 'investments', category: 'asset-classes', subcategory: 'Fixed Income',
    level: 'Foundational',
    oneLine: 'Lending rather than owning — a contractual claim to defined payments on defined dates.',
    what: 'Fixed income covers instruments where an investor lends money in return for scheduled interest payments and repayment of principal at maturity. The holder is a creditor, not an owner: the payments are contractual obligations that rank ahead of any distribution to shareholders. Government securities, corporate bonds, debentures and fixed deposits all belong to this class.',
    simple: 'You lend, and you are promised a fixed schedule of payments. You are ahead of the owners in the queue, but your upside is capped at what was promised.',
    why: 'Fixed income provides predictable cash flow and ranks senior to equity, which makes it the stabilising component of most portfolios. But predictability in nominal terms is not safety in real terms — fixed payments lose purchasing power when inflation rises.',
    components: [
      { k: 'Coupon', v: 'The scheduled interest payment.' },
      { k: 'Maturity', v: 'The date principal is repaid. Longer maturity means greater price sensitivity to rates.' },
      { k: 'Credit quality', v: 'The likelihood the borrower pays. Lower quality demands a higher yield.' },
      { k: 'Seniority', v: 'Where the claim ranks if the borrower fails.' },
    ],
    misconceptions: [
      { claim: '“Fixed income means fixed returns.”', truth: 'The payments are fixed. The market value of the instrument is not — it moves inversely to yields throughout its life.' },
      { claim: '“Government bonds are risk-free.”', truth: 'They carry minimal default risk in domestic currency, but full interest rate risk and full inflation risk.' },
    ],
    application: ['Matching an investment to a known future liability.', 'Reducing portfolio volatility alongside equity.'],
    related: ['bond-pricing', 'equity', 'interest-rates', 'inflation', 'real-return'],
    prereq: ['risk-return'], next: ['bond-pricing', 'diversification'],
  },
  {
    id: 'mutual-funds',
    title: 'Mutual Funds',
    domain: 'investments', category: 'vehicles', subcategory: 'Mutual Funds',
    level: 'Foundational',
    oneLine: 'Pooled money managed collectively, giving small investors access to a diversified portfolio.',
    what: 'A mutual fund pools money from many investors and invests it according to a stated mandate. Each investor holds units representing a proportional share of the pool. The value of a unit is the net asset value — the fund\u2019s total holdings less its liabilities, divided by units outstanding. Funds charge an annual expense ratio for management and administration.',
    simple: 'Many people put money into one pot, a manager invests it under agreed rules, and everyone owns a slice of the result.',
    why: 'A single investor with a modest sum cannot buy fifty securities economically. A fund makes diversification available at small ticket sizes — but the cost of that access compounds against the investor every year.',
    formula: {
      main: 'NAV = (Total assets − Liabilities) ÷ Units outstanding',
      others: [{ label: 'Cost drag over n years', expr: 'Value lost ≈ 1 − (1 − e)ⁿ, where e is the expense ratio' }],
      variables: [{ sym: 'NAV', desc: 'Net asset value per unit' }, { sym: 'e', desc: 'Annual expense ratio' }],
    },
    example: {
      setup: '₹10,00,000 invested for 20 years at an 11% gross return. Compare a 0.5% expense ratio with a 2% expense ratio.',
      steps: [
        'At 10.5% net: 10,00,000 × (1.105)²⁰ = ₹73,66,235',
        'At 9.0% net: 10,00,000 × (1.09)²⁰ = ₹56,04,411',
        'Difference = ₹17,61,824',
      ],
      result: '₹17,61,824 lost to 1.5% a year',
      note: 'The gross return was identical. The entire difference is cost, compounding against the investor for twenty years.',
    },
    interpretation: 'Expense ratios look trivial as annual percentages and are anything but over long horizons. This is the clearest practical application of compounding working against you.',
    misconceptions: [
      { claim: '“A lower NAV means a cheaper fund.”', truth: 'NAV is an accounting figure, not a valuation. A fund at ₹15 is not cheaper than one at ₹450 — the return depends on percentage growth, not the starting number.' },
      { claim: '“Past performance indicates future returns.”', truth: 'It is one input among many, and a weak one. Cost and mandate are more persistent predictors.' },
    ],
    application: ['Gaining diversified exposure with a small amount of capital.', 'Comparing funds on cost as well as return.'],
    related: ['etf', 'sip', 'diversification', 'compounding'],
    prereq: [], next: ['etf', 'sip'],
  },
  {
    id: 'etf',
    title: 'ETFs and Index Funds',
    domain: 'investments', category: 'vehicles', subcategory: 'ETFs',
    level: 'Core',
    oneLine: 'Funds that track an index rather than trying to beat it, at a fraction of the cost.',
    what: 'An exchange-traded fund holds a portfolio designed to replicate an index and trades on an exchange like a share. An index fund does the same but is bought and sold at end-of-day NAV rather than intraday. Both are passive: the manager makes no attempt to select securities, only to match the index as closely as possible.',
    simple: 'Instead of paying someone to pick winners, you buy the whole market and keep the fee you saved.',
    why: 'Because passive funds do not need research teams, their costs are a fraction of active funds. Over long horizons, that cost difference is the most reliable source of outperformance available to an ordinary investor.',
    components: [
      { k: 'Tracking error', v: 'How far the fund\u2019s return drifts from the index it follows. Lower is better.' },
      { k: 'Expense ratio', v: 'The annual cost, typically far below an actively managed equivalent.' },
      { k: 'Liquidity', v: 'For ETFs, how easily units can be traded without moving the price.' },
    ],
    misconceptions: [
      { claim: '“Passive investing means average returns.”', truth: 'It means index returns before very low costs. After costs, that outcome beats a majority of active funds over long periods.' },
      { claim: '“An ETF is always cheaper than a mutual fund.”', truth: 'The expense ratio usually is, but ETFs add trading costs and bid-ask spreads. For small regular investments, an index fund is often cheaper overall.' },
    ],
    application: ['Building a low-cost core portfolio.', 'Gaining exposure to a market or sector without selecting individual securities.'],
    related: ['mutual-funds', 'diversification', 'equity', 'sip'],
    prereq: ['mutual-funds'], next: ['diversification'],
  },
  {
    id: 'sip',
    title: 'Systematic Investment Plan',
    domain: 'investments', category: 'vehicles', subcategory: 'SIP',
    level: 'Foundational',
    oneLine: 'Investing a fixed amount at fixed intervals, so timing decisions are removed from the process.',
    what: 'A systematic investment plan commits a fixed sum at regular intervals regardless of market level. Because the amount is constant, more units are purchased when prices are low and fewer when prices are high — a mechanical effect known as rupee cost averaging. Its main benefit is behavioural: it removes the repeated decision of when to invest.',
    simple: 'The same amount every month, whatever the market is doing. You stop trying to pick the moment.',
    why: 'Most investors underperform their own investments by buying after rises and selling after falls. A fixed schedule makes that pattern impossible to act on.',
    formula: {
      main: 'FV = P × [ ((1 + i)ⁿ − 1) ÷ i ] × (1 + i)',
      variables: [
        { sym: 'P', desc: 'Amount invested each period' }, { sym: 'i', desc: 'Return per period' },
        { sym: 'n', desc: 'Number of periods' },
      ],
    },
    example: {
      setup: '₹10,000 invested monthly for 15 years at an assumed 11% a year.',
      steps: [
        'i = 0.11 ÷ 12 = 0.009167, n = 180',
        'FV = 10,000 × [((1.009167)¹⁸⁰ − 1) ÷ 0.009167] × 1.009167',
        'FV ≈ ₹50,45,760 against ₹18,00,000 invested',
      ],
      result: '≈ ₹50,45,760',
      note: 'Roughly ₹32,45,760 of that is growth. The assumed rate is an assumption, not a promise — market returns are not constant.',
    },
    misconceptions: [
      { claim: '“A SIP guarantees profit.”', truth: 'It removes timing decisions. It does not remove market risk. A SIP into a falling market still shows a loss.' },
      { claim: '“A SIP always beats investing a lump sum.”', truth: 'In a rising market, investing everything earlier usually wins. The SIP\u2019s advantage is behavioural discipline and reduced regret, not superior arithmetic.' },
    ],
    application: ['Building long-term wealth from regular income.', 'Removing market timing from the decision entirely.'],
    sim: 'siplump',
    related: ['compounding', 'mutual-funds', 'time-value-of-money', 'etf'],
    prereq: ['compounding'], next: ['diversification'],
    tool: 'sip',
  },
  {
    id: 'diversification',
    title: 'Diversification',
    domain: 'investments', category: 'portfolio', subcategory: 'Diversification',
    level: 'Core',
    oneLine: 'Holding assets that do not move together, so that no single failure decides the outcome.',
    what: 'Diversification is the practice of spreading capital across investments whose returns are imperfectly correlated. Because they do not rise and fall in unison, the portfolio\u2019s combined volatility is lower than the weighted average volatility of its parts. It reduces unsystematic risk — the risk specific to one company, sector or country — without necessarily reducing expected return.',
    simple: 'If everything you own can fail for the same reason, you own one thing wearing several names.',
    why: 'Diversification is the only reduction in risk that does not require giving up expected return. Every other risk reduction costs something.',
    components: [
      { k: 'Correlation', v: 'How closely two assets move together, from +1 (identical) to −1 (opposite).' },
      { k: 'Unsystematic risk', v: 'Specific to one holding. Substantially removable by diversifying.' },
      { k: 'Systematic risk', v: 'Affects the whole market. Cannot be diversified away, which is why it is compensated.' },
      { k: 'Concentration', v: 'The opposite condition — where one holding or one factor dominates the outcome.' },
    ],
    interpretation: 'The benefit comes from low correlation, not from the number of holdings. Thirty companies in one sector is not a diversified portfolio; it is one bet held thirty ways.',
    misconceptions: [
      { claim: '“More holdings means more diversification.”', truth: 'Beyond roughly twenty to thirty uncorrelated securities, additional names add little. What matters is whether they share the same underlying risk.' },
      { claim: '“Diversification protects you in a crash.”', truth: 'Correlations tend to rise toward one during severe market stress. Diversification works best in ordinary conditions and least when it is most wanted.' },
    ],
    realWorld: 'In the 2008 crisis, mortgage securities were assembled from thousands of individual loans and treated as diversified. They were not — every loan depended on the same national housing market, so a single factor moved them all at once.',
    caseRef: 'lehman-2008',
    application: ['Constructing a portfolio across asset classes and geographies.', 'Testing whether apparent diversification hides a single shared risk.'],
    sim: 'diversification',
    related: ['risk-return', 'asset-allocation', 'equity', 'fixed-income'],
    prereq: ['risk-return'], next: ['asset-allocation'],
  },
  {
    id: 'asset-allocation',
    title: 'Asset Allocation',
    domain: 'investments', category: 'portfolio', subcategory: 'Asset Allocation',
    level: 'Core',
    oneLine: 'Deciding how much goes into each asset class — the decision that shapes most of the outcome.',
    what: 'Asset allocation is the division of a portfolio across asset classes such as equity, fixed income, cash and real assets. It is driven by the investor\u2019s time horizon, need for liquidity, and capacity to absorb loss. Studies of portfolio behaviour consistently find that allocation explains far more of the variation in returns over time than the selection of individual securities within each class.',
    simple: 'How much in shares, how much in bonds, how much in cash. That mix matters more than which particular shares you pick.',
    why: 'Security selection is where most attention goes and where the least difference is made. Allocation determines the risk the portfolio is actually taking, and therefore the range of outcomes the investor must be able to live with.',
    components: [
      { k: 'Time horizon', v: 'How long before the money is needed. Longer horizons can tolerate more equity.' },
      { k: 'Risk capacity', v: 'The ability to absorb a loss without altering the plan — a financial fact.' },
      { k: 'Risk tolerance', v: 'The willingness to endure volatility — a psychological one. Both bind.' },
      { k: 'Rebalancing', v: 'Restoring target weights after market moves, which mechanically sells what has risen and buys what has fallen.' },
    ],
    example: {
      setup: 'A ₹20,00,000 portfolio targeted at 60% equity and 40% debt. Equity rises 25%; debt is flat.',
      steps: [
        'Equity: 12,00,000 × 1.25 = ₹15,00,000. Debt: ₹8,00,000.',
        'Total = ₹23,00,000 → equity is now 65.2%',
        'Rebalancing back to 60% means selling ₹1,20,000 of equity into debt',
      ],
      result: 'Equity trimmed from 65.2% back to 60%',
      note: 'Rebalancing forces selling what has performed and buying what has not — the opposite of instinct, and the reason it is written as a rule in advance.',
    },
    misconceptions: [
      { claim: '“Asset allocation is a one-time decision.”', truth: 'Market moves change the weights continuously. Without rebalancing, a portfolio drifts toward whatever has risen most and quietly becomes riskier.' },
    ],
    application: ['Setting a portfolio structure that matches an actual goal and horizon.', 'Establishing rebalancing rules before emotions are involved.'],
    related: ['diversification', 'risk-return', 'equity', 'fixed-income'],
    prereq: ['diversification'], next: [],
  },
  {
    id: 'fundamental-analysis',
    title: 'Fundamental Analysis',
    domain: 'investments', category: 'analysis', subcategory: 'Fundamental Analysis',
    level: 'Intermediate',
    oneLine: 'Estimating what a business is worth from its economics, then comparing that to its price.',
    what: 'Fundamental analysis estimates the intrinsic value of a security by examining the underlying business — its financial statements, competitive position, industry conditions and management. The resulting estimate is compared with the market price to judge whether the security is attractively valued. It combines quantitative work on the statements with qualitative judgement about durability.',
    simple: 'Work out what the business is actually worth. Then look at the price and see whether the two agree.',
    components: [
      { k: 'Quantitative analysis', v: 'Statements, ratios, margins, cash generation, debt levels.' },
      { k: 'Qualitative analysis', v: 'Competitive advantage, industry structure, management quality, regulation.' },
      { k: 'Valuation', v: 'Translating that understanding into a value — by discounted cash flow, or by comparison with peers.' },
      { k: 'Margin of safety', v: 'Buying sufficiently below the estimate that being somewhat wrong is survivable.' },
    ],
    limitations: [
      'The output depends entirely on forecasts, and forecasts of distant cash flows carry large error.',
      'A correct valuation can stay unrecognised by the market for a long time.',
      'It cannot detect deliberate misstatement in the accounts, only inconsistency between them.',
    ],
    misconceptions: [
      { claim: '“A low price-to-earnings ratio means a cheap stock.”', truth: 'It may mean the market expects earnings to fall, and be right. A multiple is a question, not an answer.' },
    ],
    application: ['Deciding whether a business is worth its price.', 'Building a considered case before committing capital.'],
    related: ['financial-ratios', 'discount-rate', 'cash-flow-statement', 'equity'],
    prereq: ['financial-ratios'], next: ['discount-rate'],
  },

  {
    id: 'derivative',
    title: 'What is a Derivative',
    domain: 'derivatives', category: 'foundations', subcategory: 'What is a Derivative',
    level: 'Core',
    oneLine: 'A contract whose value comes from something else — it derives, rather than holds.',
    what: 'A derivative is a contract between two parties whose value depends on the price of an underlying asset, rate or index. The contract itself confers no ownership of the underlying. Derivatives exist to transfer specific risks from those who do not want them to those willing to carry them for a price, and they allow exposure to be taken or removed without trading the underlying asset itself.',
    simple: 'You are not buying the thing. You are buying an agreement whose worth depends on what that thing does.',
    why: 'Derivatives make risk separable from ownership. A farmer can fix a selling price without selling today; an importer can fix a currency rate months ahead. The same feature that transfers risk efficiently also allows very large exposure from very little capital, which is why they demand precision.',
    components: [
      { k: 'Underlying', v: 'The asset, rate or index the contract references.' },
      { k: 'Contract size', v: 'The quantity of underlying one contract represents — the lot size.' },
      { k: 'Expiry', v: 'The date the contract settles or ceases to exist.' },
      { k: 'Margin', v: 'Collateral posted to cover potential loss, since no full payment is made upfront.' },
    ],
    misconceptions: [
      { claim: '“Derivatives are inherently speculative.”', truth: 'They are tools. The same futures contract hedges a producer\u2019s risk and expresses a speculator\u2019s view. Purpose sits with the user, not the instrument.' },
      { claim: '“You can only lose what you paid.”', truth: 'True for a bought option. Not true for futures or sold options, where losses can exceed the amount committed.' },
    ],
    application: ['Hedging a known future exposure.', 'Understanding why small margin requirements imply large embedded leverage.'],
    related: ['futures', 'options', 'hedging', 'leverage'],
    prereq: ['risk-return'], next: ['futures', 'options'],
  },
  {
    id: 'futures',
    title: 'Futures',
    domain: 'derivatives', category: 'futures', subcategory: 'Futures',
    level: 'Core',
    oneLine: 'A binding agreement to buy or sell a fixed quantity at a fixed price on a fixed date.',
    what: 'A futures contract obliges both parties to transact a standardised quantity of an underlying asset at an agreed price on a set expiry date. Contracts are standardised and exchange-traded, and a clearing house stands between buyer and seller so neither depends on the other\u2019s creditworthiness. Positions are marked to market daily, with gains and losses settled in cash each day rather than at expiry.',
    simple: 'Both sides commit today to a trade that happens later at a price fixed now. Neither can walk away.',
    formula: {
      main: 'Profit = (Exit price − Entry price) × Lot size',
      variables: [{ sym: 'Lot size', desc: 'Units of underlying per contract, fixed by the exchange' }],
    },
    example: {
      setup: 'An index future is bought at 22,000 with a lot size of 50. Margin required is ₹1,50,000. The index rises to 22,400.',
      steps: [
        'Profit = (22,400 − 22,000) × 50 = ₹20,000',
        'Return on margin = 20,000 ÷ 1,50,000 = 13.3%',
        'Underlying move = 400 ÷ 22,000 = 1.8%',
      ],
      result: '1.8% move produced a 13.3% return',
      note: 'The same arithmetic runs in reverse. A 1.8% fall produces a 13.3% loss, and a larger fall can exceed the margin posted, requiring more to be paid in.',
    },
    interpretation: 'Futures embed leverage by design, because only margin is posted rather than full value. The multiple between the underlying move and the return on capital is the leverage, and it applies identically in both directions.',
    misconceptions: [
      { claim: '“Margin is the cost of the trade.”', truth: 'Margin is collateral, not a price. Losses are not capped at it — if the position moves against you, further margin is demanded.' },
    ],
    application: ['Locking in a price for a future purchase or sale.', 'Taking directional exposure without buying the underlying.'],
    related: ['derivative', 'options', 'hedging', 'leverage'],
    prereq: ['derivative'], next: ['options', 'hedging'],
  },
  {
    id: 'options',
    title: 'Options',
    domain: 'derivatives', category: 'options', subcategory: 'Call Options',
    level: 'Intermediate',
    oneLine: 'A right without an obligation — which is why it costs a premium to hold.',
    what: 'An option gives its buyer the right, but not the obligation, to buy (a call) or sell (a put) an underlying asset at a stated strike price on or before expiry. The buyer pays a premium for that right. The seller receives the premium and takes on the obligation to complete the transaction if the buyer exercises. This asymmetry is the defining feature: the buyer\u2019s loss is limited to the premium, while the seller\u2019s loss is not.',
    simple: 'You pay a fee for the right to act later at a price agreed now. If it turns out badly, you simply do not act — the fee is all you lose.',
    formula: {
      main: 'Call payoff at expiry = max(Spot − Strike, 0) − Premium',
      others: [
        { label: 'Put payoff at expiry', expr: 'max(Strike − Spot, 0) − Premium' },
        { label: 'Call breakeven', expr: 'Strike + Premium' },
      ],
      variables: [
        { sym: 'Spot', desc: 'Market price at expiry' }, { sym: 'Strike', desc: 'Agreed exercise price' },
        { sym: 'Premium', desc: 'Amount paid for the option' },
      ],
    },
    example: {
      setup: 'A call with a strike of 22,000 is bought for a premium of ₹200, lot size 50. Compare expiry at 22,500 and at 21,800.',
      steps: [
        'At 22,500: payoff = max(22,500 − 22,000, 0) − 200 = ₹300 per unit → ₹15,000',
        'At 21,800: max(21,800 − 22,000, 0) = 0, so loss = premium = ₹200 per unit → ₹10,000',
        'Breakeven = 22,000 + 200 = 22,200',
      ],
      result: '₹15,000 gain, or ₹10,000 loss',
      note: 'The option only begins to profit above 22,200. Being right about direction is not enough — the move must exceed the premium paid.',
    },
    components: [
      { k: 'Intrinsic value', v: 'What the option is worth if exercised immediately. Never below zero.' },
      { k: 'Time value', v: 'The premium above intrinsic value, reflecting the chance of a favourable move before expiry.' },
      { k: 'Strike', v: 'The price at which the right may be exercised.' },
      { k: 'Expiry', v: 'The date after which the right ceases to exist.' },
    ],
    interpretation: 'Time value decays toward zero as expiry approaches, and that decay accelerates near the end. An option holder is fighting the clock even when the direction is right.',
    misconceptions: [
      { claim: '“Selling options is safer because you receive money upfront.”', truth: 'The seller\u2019s maximum gain is the premium, while the potential loss is far larger. The payoff is the reverse of the buyer\u2019s.' },
      { claim: '“If the price passes the strike, I profit.”', truth: 'You profit past the breakeven, which is the strike plus the premium paid.' },
    ],
    application: ['Limiting downside while retaining upside exposure.', 'Hedging a holding against an adverse move.'],
    sim: 'options',
    related: ['derivative', 'futures', 'hedging', 'risk-return'],
    prereq: ['derivative'], next: ['hedging'],
  },
  {
    id: 'hedging',
    title: 'Hedging',
    domain: 'derivatives', category: 'uses', subcategory: 'Hedging',
    level: 'Core',
    oneLine: 'Taking an offsetting position so that an unwanted risk is reduced — at the cost of some upside.',
    what: 'Hedging means entering a position designed to move opposite to an existing exposure, so that losses on one are substantially offset by gains on the other. It does not remove risk from the world; it transfers it to a counterparty willing to hold it. A hedge is never free — it costs either a premium, or the upside that is given away.',
    simple: 'You give up some of the good outcome in exchange for protection against the bad one.',
    example: {
      setup: 'An exporter expects US$100,000 in three months. The current rate is ₹83 per dollar, and a fall to ₹80 would cost ₹3,00,000.',
      steps: [
        'A forward contract fixes the rate at ₹82.80 for the full amount.',
        'If the rupee strengthens to ₹80: the hedge protects ₹2,80,000 of revenue.',
        'If the rupee weakens to ₹86: the exporter still receives ₹82.80, forgoing ₹3,20,000 of gain.',
      ],
      result: 'Certainty at ₹82.80, in both directions',
      note: 'The hedge converted an uncertain outcome into a known one. That is its purpose — not to produce the best result, but to remove the range of results.',
    },
    misconceptions: [
      { claim: '“A good hedge makes money.”', truth: 'A hedge that profits means the underlying exposure lost. Judging a hedge by its own profit misunderstands what it is for.' },
      { claim: '“Hedging eliminates risk.”', truth: 'It reduces a specific risk and introduces others — basis risk, counterparty risk, and the cost itself.' },
    ],
    application: ['Fixing an exchange rate for a known future receipt.', 'Protecting a portfolio against a fall over a defined period.'],
    related: ['derivative', 'futures', 'options', 'risk-return'],
    prereq: ['derivative'], next: [],
  },
  {
    id: 'market-risk',
    title: 'Market Risk',
    domain: 'derivatives', category: 'risk-types', subcategory: 'Market Risk',
    level: 'Core',
    oneLine: 'The risk that the value of a position falls because market prices move.',
    what: 'Market risk is the risk of loss from movements in market variables — equity prices, interest rates, exchange rates and commodity prices. It affects positions regardless of the quality of the issuer, and unlike company-specific risk it cannot be removed by diversifying within the same market.',
    simple: 'Even a good holding falls when the whole market falls. That is the risk you are paid to carry.',
    components: [
      { k: 'Equity price risk', v: 'Loss from falling share prices.' },
      { k: 'Interest rate risk', v: 'Loss from rate changes, most visible in fixed income.' },
      { k: 'Currency risk', v: 'Loss from exchange rate movement on foreign holdings.' },
      { k: 'Commodity risk', v: 'Loss from movement in input or output prices.' },
    ],
    interpretation: 'Because market risk cannot be diversified away, it is the risk for which investors are compensated. The premium exists precisely because the risk is unavoidable.',
    misconceptions: [
      { claim: '“Holding more securities removes market risk.”', truth: 'It removes company-specific risk. Market risk affects all of them together, which is what makes it systematic.' },
    ],
    application: ['Sizing positions to a loss the portfolio can absorb.', 'Deciding whether an exposure warrants hedging.'],
    related: ['risk-return', 'credit-risk', 'diversification', 'hedging'],
    prereq: ['risk-return'], next: ['credit-risk'],
  },
  {
    id: 'credit-risk',
    title: 'Credit Risk',
    domain: 'derivatives', category: 'risk-types', subcategory: 'Credit Risk',
    level: 'Core',
    oneLine: 'The risk that a borrower or counterparty fails to pay what was contractually promised.',
    what: 'Credit risk is the risk of loss arising from a borrower\u2019s failure to meet its obligations. It applies to lenders, bondholders and any party to a contract that depends on someone else performing. It is usually decomposed into the probability of default, the exposure at the time of default, and the proportion of that exposure ultimately recovered.',
    simple: 'The risk that the other side does not pay.',
    formula: {
      main: 'Expected loss = PD × EAD × LGD',
      variables: [
        { sym: 'PD', desc: 'Probability of default over a period' },
        { sym: 'EAD', desc: 'Exposure at default — the amount at risk' },
        { sym: 'LGD', desc: 'Loss given default — the share not recovered' },
      ],
    },
    example: {
      setup: 'A ₹1,00,00,000 loan with a 2% annual default probability and an expected recovery of 40%.',
      steps: ['LGD = 1 − 0.40 = 0.60', 'Expected loss = 0.02 × 1,00,00,000 × 0.60', 'Expected loss = ₹1,20,000 a year'],
      result: '₹1,20,000 expected annual loss',
      note: 'The lender must earn at least this much in spread simply to break even on expected losses, before any profit or cost of capital.',
    },
    interpretation: 'The credit spread on a bond is the market\u2019s price for this risk. When spreads widen, the market is either raising its estimate of default or demanding more compensation for the same estimate.',
    misconceptions: [
      { claim: '“A default means the whole amount is lost.”', truth: 'Recovery is usually partial, and depends heavily on seniority and collateral. Loss given default, not exposure, is the relevant figure.' },
    ],
    application: ['Pricing a loan or bond for the risk being taken.', 'Understanding why lower-rated borrowers pay higher yields.'],
    related: ['market-risk', 'bond-pricing', 'liquidity-risk', 'fixed-income'],
    prereq: ['risk-return'], next: ['liquidity-risk'],
  },
  {
    id: 'liquidity-risk',
    title: 'Liquidity Risk',
    domain: 'derivatives', category: 'risk-types', subcategory: 'Liquidity Risk',
    level: 'Core',
    oneLine: 'The risk of being unable to sell at a fair price, or to meet obligations as they fall due.',
    what: 'Liquidity risk takes two forms. Market liquidity risk is the risk that a position cannot be sold quickly without accepting a materially worse price. Funding liquidity risk is the risk that an institution cannot meet its obligations as they come due, even while remaining solvent on paper. The two reinforce each other: forced selling into thin markets depresses prices, which worsens the funding position further.',
    simple: 'You may own something valuable and still be unable to turn it into cash when you need to.',
    components: [
      { k: 'Bid-ask spread', v: 'The immediate cost of transacting — a direct measure of market liquidity.' },
      { k: 'Market depth', v: 'How much can be traded before the price moves materially.' },
      { k: 'Maturity mismatch', v: 'Funding long-dated assets with short-dated liabilities — the classic source of funding risk.' },
    ],
    interpretation: 'Liquidity is abundant precisely when it is least needed and disappears when it matters most. This is why liquidity risk is usually the mechanism of failure even when the underlying problem was solvency.',
    realWorld: 'Institutions that funded long-dated assets with overnight borrowing in 2008 remained accounting-solvent for a time, but could not refinance. Liquidity, not the balance sheet, determined the moment of failure.',
    caseRef: 'lehman-2008',
    misconceptions: [
      { claim: '“A solvent institution cannot fail.”', truth: 'Solvency is about the balance sheet over time. Liquidity is about cash today. Firms fail on the second while the first still looks acceptable.' },
    ],
    application: ['Assessing whether an asset can be exited within a required timeframe.', 'Testing whether funding and asset maturities are aligned.'],
    related: ['market-risk', 'credit-risk', 'leverage', 'balance-sheet'],
    prereq: ['risk-return'], next: [],
  },

  {
    id: 'central-banking',
    title: 'The Role of a Central Bank',
    domain: 'banking', category: 'central', subcategory: 'Role of a Central Bank',
    level: 'Core',
    oneLine: 'The institution that issues currency, sets the policy rate, and stands behind the banking system.',
    what: 'A central bank manages a nation\u2019s currency and money supply. Its typical responsibilities include issuing currency, setting the short-term policy rate, regulating and supervising banks, holding foreign exchange reserves, operating core payment infrastructure, and acting as lender of last resort to solvent banks facing a liquidity shortage. Most modern central banks operate with an explicit mandate for price stability.',
    simple: 'It sets the price of short-term money, watches over the banks, and is the last source of cash when nobody else will lend.',
    components: [
      { k: 'Monetary authority', v: 'Sets the policy rate and manages liquidity in the system.' },
      { k: 'Regulator', v: 'Sets capital and liquidity requirements for banks and supervises compliance.' },
      { k: 'Lender of last resort', v: 'Lends against collateral to solvent institutions during a liquidity crisis.' },
      { k: 'Currency issuer', v: 'Issues legal tender and manages the monetary base.' },
    ],
    interpretation: 'The lender of last resort function exists because banking is inherently fragile: banks hold long-term assets against deposits repayable on demand. Even a healthy bank can fail if enough depositors withdraw at once, and that possibility alone can cause it.',
    misconceptions: [
      { claim: '“A central bank prints money to fund the government.”', truth: 'It manages the monetary base and conducts operations in markets. Direct monetary financing of deficits is restricted or prohibited in most modern frameworks precisely because of its inflationary consequences.' },
    ],
    application: ['Interpreting a policy decision and its likely path through the economy.', 'Understanding why bank regulation and monetary policy sit in the same institution.'],
    related: ['monetary-policy', 'interest-rates', 'money', 'commercial-banking'],
    prereq: ['money'], next: ['monetary-policy', 'commercial-banking'],
  },
  {
    id: 'commercial-banking',
    title: 'Commercial Banking',
    domain: 'banking', category: 'commercial', subcategory: 'Deposits & Lending',
    level: 'Core',
    oneLine: 'Taking deposits repayable on demand and lending them out for years — profitable, and structurally fragile.',
    what: 'A commercial bank accepts deposits from the public and lends to borrowers. Its core economics come from the difference between what it pays depositors and what it earns from borrowers, measured as net interest margin. Its structural characteristic is maturity transformation: deposits are typically withdrawable immediately while loans run for years. This is economically valuable and inherently unstable, which is why banks are capital-regulated and deposit-insured.',
    simple: 'The bank borrows short from you and lends long to someone else, keeping the difference. That mismatch is the business, and the vulnerability.',
    formula: {
      main: 'Net interest margin = (Interest earned − Interest paid) ÷ Average earning assets',
      others: [{ label: 'Capital adequacy', expr: 'Regulatory capital ÷ Risk-weighted assets' }],
      variables: [{ sym: 'NIM', desc: 'Net interest margin, the core profitability measure' }],
    },
    example: {
      setup: 'A bank holds ₹1,000 crore of loans earning 9%, funded by ₹900 crore of deposits paying 5%.',
      steps: [
        'Interest earned = 1,000 × 9% = ₹90 crore',
        'Interest paid = 900 × 5% = ₹45 crore',
        'NIM = (90 − 45) ÷ 1,000 = 4.5%',
      ],
      result: 'NIM of 4.5%',
      note: 'If 3% of the loan book becomes non-performing, ₹30 crore of interest income disappears while the ₹45 crore of deposit interest remains payable in full.',
    },
    components: [
      { k: 'Net interest margin', v: 'The spread between lending and funding rates.' },
      { k: 'Non-performing assets', v: 'Loans where repayment has stopped, directly reducing income.' },
      { k: 'Capital adequacy', v: 'The equity cushion held against risk-weighted assets.' },
      { k: 'Maturity transformation', v: 'Short-term deposits funding long-term loans.' },
    ],
    misconceptions: [
      { claim: '“Banks lend out the deposits they hold.”', truth: 'In practice, lending creates a matching deposit. Bank lending is constrained by capital, regulation and creditworthy demand rather than by a stock of deposits waiting to be lent.' },
    ],
    application: ['Reading a bank\u2019s results through margin and asset quality.', 'Understanding why bank runs are self-fulfilling.'],
    related: ['central-banking', 'money', 'liquidity-risk', 'credit-risk'],
    prereq: ['money'], next: ['central-banking'],
  },
  {
    id: 'money',
    title: 'Money',
    domain: 'fundamentals', category: 'money-time', subcategory: 'Money',
    level: 'Foundational',
    oneLine: 'Not wealth itself, but the instrument that lets wealth be measured, stored and exchanged.',
    what: 'Money is anything widely accepted in exchange for goods, services and debts. Economists define it by the three jobs it performs rather than by what it is made of: it is a medium of exchange, a unit of account, and a store of value. Modern money is fiat money — it has value because a government designates it as legal tender and because people accept it, not because it is backed by a commodity.',
    simple: 'Money is a promise everyone agrees to honour. Its value comes from that agreement, not from the paper.',
    why: 'Every other concept in finance is denominated in money, so the properties of money determine what those numbers mean. Because money is a unit of account whose own value drifts with inflation, a figure recorded today and a figure recorded in ten years are not measured with the same ruler.',
    components: [
      { k: 'Medium of exchange', v: 'Removes the need for a double coincidence of wants — you no longer have to find someone who wants exactly what you have.' },
      { k: 'Unit of account', v: 'Gives one common scale for pricing dissimilar things, which makes comparison and accounting possible.' },
      { k: 'Store of value', v: 'Holds purchasing power across time, though imperfectly — inflation erodes it.' },
      { k: 'Legal tender', v: 'A legal designation that a currency must be accepted in settlement of debts within a jurisdiction.' },
    ],
    how: [
      'A central bank issues currency and controls the monetary base.',
      'Commercial banks lend, and because a loan creates a matching deposit, most of the money circulating in a modern economy is bank deposits rather than physical cash.',
      'Central banks influence how much of this credit is created by setting the policy rate and reserve requirements.',
    ],
    interpretation: 'Because most money is created through bank lending, credit conditions and the money supply are closely linked. This is why a banking crisis is never contained to banks: when lending contracts, the quantity of money circulating in the economy contracts with it.',
    misconceptions: [
      { claim: '“Money is the same as wealth.”', truth: 'Wealth is the stock of real assets and claims a person or nation holds. Money is one form of it, and the instrument used to measure the rest. Printing more money does not create more wealth.' },
      { claim: '“Cash is the safest asset because it cannot fall in value.”', truth: 'Cash has no market price risk, but it carries full inflation risk. Its nominal value is fixed; its real value falls whenever prices rise.' },
    ],
    application: ['Understanding why central bank decisions reach every corner of an economy.', 'Recognising that a fixed nominal sum is not a fixed amount of purchasing power.'],
    related: ['inflation', 'time-value-of-money', 'interest-rates', 'real-return'],
    prereq: [], next: ['time-value-of-money', 'inflation'],
  },
  {
    id: 'interest',
    title: 'Interest',
    domain: 'fundamentals', category: 'money-time', subcategory: 'Interest',
    level: 'Foundational',
    oneLine: 'The payment made for the use of someone else\u2019s money for a period of time.',
    what: 'Interest is the amount a borrower pays a lender in return for the use of funds, expressed as a rate per period. It compensates the lender for three things: postponing their own consumption, the expected loss of purchasing power through inflation, and the risk that the borrower does not repay.',
    simple: 'If you lend money, you give up the use of it and take a chance on getting it back. Interest is what you charge for both.',
    why: 'Interest is the mechanism through which time acquires a price. Without it, there would be no reason to prefer money today over money later, and none of the machinery of valuation would exist.',
    components: [
      { k: 'Simple interest', v: 'Calculated only on the original principal, so the balance grows in a straight line.' },
      { k: 'Compound interest', v: 'Calculated on principal plus accumulated interest, so the balance grows exponentially.' },
      { k: 'Nominal rate', v: 'The stated annual rate, before accounting for compounding frequency or inflation.' },
      { k: 'Real rate', v: 'The nominal rate adjusted for inflation — the true increase in purchasing power.' },
    ],
    formula: {
      main: 'Simple interest: I = P × r × t',
      others: [{ label: 'Compound amount', expr: 'A = P × (1 + r)ᵗ' }],
      variables: [
        { sym: 'I', desc: 'Interest earned or paid' }, { sym: 'P', desc: 'Principal' },
        { sym: 'r', desc: 'Rate per period, as a decimal' }, { sym: 't', desc: 'Number of periods' },
      ],
    },
    example: {
      setup: '₹50,000 lent for 3 years at 10% a year. Compare simple and compound interest.',
      steps: [
        'Simple: I = 50,000 × 0.10 × 3 = ₹15,000 → total ₹65,000',
        'Compound: A = 50,000 × (1.10)³ = 50,000 × 1.331 = ₹66,550',
        'Difference = ₹1,550',
      ],
      result: '₹1,550 more under compounding',
      note: 'Over three years the gap is small. Over thirty years at the same rate, simple interest gives ₹2,00,000 while compounding gives about ₹8,72,470.',
    },
    interpretation: 'The difference between simple and compound interest is not a detail of arithmetic — it is the difference between linear and exponential growth, and it decides outcomes over long horizons in both saving and borrowing.',
    misconceptions: [
      { claim: '“A 12% loan costs 12% a year.”', truth: 'Only if interest is compounded annually and there are no fees. Monthly compounding at a 12% nominal rate costs 12.68% effectively.' },
    ],
    application: ['Comparing loan offers on a like-for-like basis.', 'Understanding why credit card balances escalate rather than accumulate evenly.'],
    related: ['time-value-of-money', 'compounding', 'interest-rates', 'inflation'],
    prereq: ['money'], next: ['time-value-of-money', 'compounding'],
    tool: 'compound',
  },
  {
    id: 'balance-sheet',
    title: 'The Balance Sheet',
    domain: 'fundamentals', category: 'statements', subcategory: 'Balance Sheet',
    level: 'Core',
    oneLine: 'A statement of what a business owns and owes at a single moment in time.',
    what: 'The balance sheet reports an entity\u2019s assets, liabilities and equity as at a specific date. It is a position statement, not a performance statement: it describes a stock at an instant, not a flow over a period. It must always balance, because equity is defined as the residual left after liabilities are deducted from assets.',
    simple: 'A photograph of a business on one day: everything it owns, everything it owes, and what would remain for the owners if the two were settled.',
    why: 'The balance sheet reveals how a business is financed and how much cushion it has. Two companies with identical profits can differ entirely in resilience, and the balance sheet is where that difference appears.',
    formula: {
      main: 'Assets = Liabilities + Equity',
      others: [{ label: 'Equity as residual', expr: 'Equity = Assets − Liabilities' }],
      variables: [
        { sym: 'Assets', desc: 'Resources the business controls that are expected to produce future benefit' },
        { sym: 'Liabilities', desc: 'Obligations owed to others' },
        { sym: 'Equity', desc: 'The owners\u2019 residual claim' },
      ],
    },
    components: [
      { k: 'Current assets', v: 'Expected to be converted to cash within a year — cash, receivables, inventory.' },
      { k: 'Non-current assets', v: 'Held for longer-term use — property, plant, equipment, long-term investments.' },
      { k: 'Current liabilities', v: 'Due within a year — payables, short-term borrowing, the current portion of long-term debt.' },
      { k: 'Non-current liabilities', v: 'Due beyond a year — long-term debt, deferred obligations.' },
    ],
    example: {
      setup: 'A firm holds ₹40,00,000 of assets and owes ₹25,00,000.',
      steps: ['Equity = 40,00,000 − 25,00,000', 'Equity = ₹15,00,000', 'Debt-to-equity = 25,00,000 ÷ 15,00,000 = 1.67'],
      result: 'Equity ₹15,00,000, D/E of 1.67',
      note: 'A 10% fall in asset values would erase ₹4,00,000 — over a quarter of the equity — while the debt stays fixed at ₹25,00,000.',
    },
    interpretation: 'The balance sheet answers a question the income statement cannot: if things go wrong, how much room is there before obligations exceed resources? That room is equity, and leverage is the measure of how thin it is.',
    limitations: [
      'Most assets are carried at historical cost less depreciation, not current market value, so the figures may not reflect what things are worth today.',
      'Internally generated intangibles — brand, know-how, customer relationships — are largely absent, even when they are the firm\u2019s main source of value.',
      'It describes one date only. A business can arrange its position favourably just before the reporting date.',
    ],
    misconceptions: [
      { claim: '“A balanced balance sheet means the accounts are correct.”', truth: 'It balances by construction, because equity is defined as the residual. Balancing proves arithmetic consistency, not accuracy or honesty.' },
      { claim: '“Equity is the cash available to owners.”', truth: 'Equity is an accounting residual, not a pot of money. It may be tied up entirely in factories and inventory.' },
    ],
    realWorld: 'Off-balance-sheet structures matter precisely because this statement is where leverage becomes visible. Moving obligations outside it makes a firm appear better capitalised than it is — the central mechanism in the Enron collapse.',
    caseRef: 'lehman-2008',
    sim: 'leverage',
    related: ['leverage', 'income-statement', 'cash-flow-statement', 'financial-ratios'],
    prereq: [], next: ['income-statement', 'financial-ratios'],
  },
  {
    id: 'income-statement',
    title: 'The Income Statement',
    domain: 'fundamentals', category: 'statements', subcategory: 'Income Statement',
    level: 'Core',
    oneLine: 'A record of revenue earned and costs incurred across a period, ending in profit or loss.',
    what: 'The income statement — also called the profit and loss account — reports financial performance over a period. It begins with revenue and subtracts costs in order of proximity to the core business, arriving at several intermediate measures of profit before net income. It is prepared on the accrual basis, meaning revenue is recognised when earned and costs when incurred, regardless of when cash moves.',
    simple: 'What the business earned over a period, minus what it cost to earn it.',
    why: 'It shows whether a business model works and where the money goes. The layered structure matters: a firm can have a healthy gross margin and still make a loss after interest, and knowing which layer fails tells you what is actually wrong.',
    components: [
      { k: 'Revenue', v: 'Value of goods or services delivered in the period.' },
      { k: 'Gross profit', v: 'Revenue less the direct cost of producing what was sold.' },
      { k: 'Operating profit (EBIT)', v: 'Gross profit less operating expenses — performance of the core business, before financing and tax.' },
      { k: 'Net profit', v: 'What remains after interest and tax, and the figure belonging to shareholders.' },
    ],
    formula: {
      main: 'Net profit = Revenue − COGS − Operating expenses − Interest − Tax',
      others: [
        { label: 'Gross margin', expr: 'Gross profit ÷ Revenue × 100' },
        { label: 'Operating margin', expr: 'EBIT ÷ Revenue × 100' },
      ],
      variables: [{ sym: 'COGS', desc: 'Cost of goods sold — direct production cost' }, { sym: 'EBIT', desc: 'Earnings before interest and tax' }],
    },
    example: {
      setup: 'Revenue ₹1,00,00,000; COGS ₹60,00,000; operating expenses ₹25,00,000; interest ₹6,00,000; tax ₹2,50,000.',
      steps: [
        'Gross profit = 1,00,00,000 − 60,00,000 = ₹40,00,000 (40% margin)',
        'EBIT = 40,00,000 − 25,00,000 = ₹15,00,000 (15% margin)',
        'Pre-tax = 15,00,000 − 6,00,000 = ₹9,00,000',
        'Net profit = 9,00,000 − 2,50,000 = ₹6,50,000 (6.5% margin)',
      ],
      result: '₹6,50,000 net profit',
      note: 'Interest consumed 40% of operating profit. This business is profitable, but a modest fall in EBIT would leave very little for shareholders — a leverage problem, not a trading problem.',
    },
    interpretation: 'Read the statement as a sequence of tests. Gross margin tests pricing and production. Operating margin tests overheads. The gap between operating and net profit tests the financing decision.',
    limitations: [
      'Accrual accounting means reported profit is not cash. A firm can report profit while running out of money.',
      'Several lines depend on estimates — depreciation schedules, provisions, revenue recognition timing — which allow considerable discretion.',
      'One period in isolation says little. Trends and comparison with peers carry the meaning.',
    ],
    misconceptions: [
      { claim: '“Profit means cash in the bank.”', truth: 'Profit is an accounting measure. A sale on credit adds to profit immediately and adds nothing to cash until the customer pays.' },
    ],
    realWorld: 'Where reported earnings persistently exceed operating cash flow, that divergence is one of the most reliable warning signs in financial analysis — it was present for years before the Enron restatement.',
    related: ['balance-sheet', 'cash-flow-statement', 'financial-ratios', 'leverage'],
    prereq: ['balance-sheet'], next: ['cash-flow-statement', 'financial-ratios'],
  },
  {
    id: 'cash-flow-statement',
    title: 'The Cash Flow Statement',
    domain: 'fundamentals', category: 'statements', subcategory: 'Cash Flow',
    level: 'Core',
    oneLine: 'A record of cash actually received and paid, stripped of accounting judgement.',
    what: 'The cash flow statement reports movements of cash over a period, sorted into three activities: operating, investing and financing. It reconciles the profit reported on the income statement to the change in the cash balance on the balance sheet, and in doing so removes the effect of accruals and estimates.',
    simple: 'Not what the business earned on paper — what actually went in and out of the bank.',
    why: 'Businesses fail when they run out of cash, not when they report a loss. Because cash movements are far harder to manipulate than accrual estimates, this statement is the most reliable of the three for testing whether reported performance is real.',
    components: [
      { k: 'Operating activities', v: 'Cash generated by the core business. The critical figure — a healthy company funds itself from here.' },
      { k: 'Investing activities', v: 'Cash spent on or received from long-term assets. Persistently negative in a growing firm, which is normal.' },
      { k: 'Financing activities', v: 'Cash raised from or returned to lenders and shareholders — borrowing, repayment, dividends, share issues.' },
    ],
    formula: {
      main: 'Net change in cash = Operating + Investing + Financing',
      others: [{ label: 'Free cash flow', expr: 'FCF = Operating cash flow − Capital expenditure' }],
      variables: [{ sym: 'FCF', desc: 'Cash left after maintaining and expanding the asset base' }],
    },
    example: {
      setup: 'Operating +₹18,00,000; investing −₹12,00,000; financing +₹2,00,000. Capital expenditure was ₹12,00,000.',
      steps: [
        'Net change = 18,00,000 − 12,00,000 + 2,00,000 = +₹8,00,000',
        'Free cash flow = 18,00,000 − 12,00,000 = ₹6,00,000',
      ],
      result: 'Cash up ₹8,00,000; free cash flow ₹6,00,000',
      note: 'The business funds its own investment from operations and still has ₹6,00,000 spare. The borrowing was optional, not a rescue.',
    },
    interpretation: 'Read the three sections together as a story about self-sufficiency. Operating cash covering investment is a business standing on its own. Investment funded by continuous borrowing, with weak operating cash, is a business dependent on someone else\u2019s willingness to keep lending.',
    misconceptions: [
      { claim: '“Negative cash flow means the company is failing.”', truth: 'Negative investing cash flow usually means the firm is growing. It is persistently negative *operating* cash flow that signals trouble.' },
      { claim: '“Cash flow cannot be manipulated.”', truth: 'It is harder to manipulate than profit, not impossible. Delaying supplier payments or classifying items across sections can flatter it, which is why the trend matters more than one period.' },
    ],
    application: ['Testing whether reported profit converts into cash.', 'Assessing whether a business can service its debt from operations.'],
    related: ['income-statement', 'balance-sheet', 'financial-ratios', 'discount-rate'],
    prereq: ['income-statement'], next: ['financial-ratios', 'discount-rate'],
  },
  {
    id: 'financial-ratios',
    title: 'Financial Ratios',
    domain: 'fundamentals', category: 'statements', subcategory: 'Ratios',
    level: 'Core',
    oneLine: 'Relationships between statement figures that turn raw numbers into comparisons.',
    what: 'A financial ratio expresses one figure from the financial statements as a proportion of another. Ratios exist because absolute numbers are not comparable across firms of different sizes or across time. They fall into four families: liquidity, profitability, leverage and efficiency.',
    simple: 'A profit of ₹10 crore tells you little on its own. Ten crore on ₹50 crore of sales, or on ₹5,000 crore, are entirely different businesses.',
    why: 'Ratios convert the statements into questions that can be answered comparatively: can this firm meet its short-term obligations, does it earn enough on what it uses, how much of it is borrowed, and how hard does it work its assets.',
    components: [
      { k: 'Liquidity', v: 'Can short-term obligations be met? Current ratio, quick ratio.' },
      { k: 'Profitability', v: 'How much profit per unit of sales or capital? Net margin, return on equity, return on capital employed.' },
      { k: 'Leverage', v: 'How much is financed by debt, and can the interest be covered? Debt-to-equity, interest coverage.' },
      { k: 'Efficiency', v: 'How productively are assets used? Asset turnover, inventory turnover, receivable days.' },
    ],
    formula: {
      main: 'Return on equity = Net profit ÷ Shareholders\u2019 equity × 100',
      others: [
        { label: 'Current ratio', expr: 'Current assets ÷ Current liabilities' },
        { label: 'Interest coverage', expr: 'EBIT ÷ Interest expense' },
        { label: 'Asset turnover', expr: 'Revenue ÷ Total assets' },
      ],
      variables: [{ sym: 'EBIT', desc: 'Earnings before interest and tax' }],
    },
    example: {
      setup: 'Net profit ₹6,50,000; equity ₹15,00,000; EBIT ₹15,00,000; interest ₹6,00,000; current assets ₹18,00,000; current liabilities ₹12,00,000.',
      steps: [
        'ROE = 6,50,000 ÷ 15,00,000 × 100 = 43.3%',
        'Interest coverage = 15,00,000 ÷ 6,00,000 = 2.5 times',
        'Current ratio = 18,00,000 ÷ 12,00,000 = 1.5',
      ],
      result: 'ROE 43.3%, coverage 2.5×, current ratio 1.5',
      note: 'The high ROE looks excellent until read alongside the coverage of 2.5. Much of that return comes from leverage, and operating profit could fall only 60% before interest stopped being covered.',
    },
    interpretation: 'No ratio means anything alone. ROE rises both when a business becomes more profitable and when it simply borrows more — which is why leverage ratios must be read beside profitability ratios. The skill is not calculating them but knowing which ones contradict each other.',
    limitations: [
      'Ratios inherit every weakness of the statements they come from, including historical-cost values and estimate-dependent lines.',
      'They are only comparable within an industry. A current ratio that is healthy for a manufacturer may be alarming for a bank.',
      'Year-end figures can be arranged to flatter a ratio on the reporting date.',
    ],
    misconceptions: [
      { claim: '“Higher is always better.”', truth: 'A very high current ratio can mean idle cash or unsold inventory. A very high ROE often means thin equity, not superior performance.' },
    ],
    application: ['Comparing companies of different sizes within one industry.', 'Tracking whether a single business is strengthening or weakening over time.', 'Testing whether a firm can survive a downturn in operating profit.'],
    related: ['balance-sheet', 'income-statement', 'cash-flow-statement', 'leverage', 'risk-return'],
    prereq: ['balance-sheet', 'income-statement'], next: ['leverage'],
  },
  {
    id: 'time-value-of-money',
    title: 'Time Value of Money',
    domain: 'fundamentals', category: 'money-time', subcategory: 'Time Value of Money',
    level: 'Foundational',
    oneLine: 'A rupee today is worth more than a rupee tomorrow, because today’s rupee can earn a return.',
    what: 'The time value of money (TVM) is the principle that a given amount of money has a different value depending on when it is received or paid. Money available now can be invested to earn a return, so it is worth more than the same nominal amount received later. Every valuation technique in finance — bond pricing, equity valuation, capital budgeting, loan schedules, insurance reserving — is an application of this single idea.',
    simple: 'Money can work. Money that starts working earlier does more work. So the same number, received later, is worth less to you today.',
    why: 'TVM is the reason finance can compare cash flows that arrive at different times. Without it, a ₹10 lakh payment next year and a ₹10 lakh payment in ten years would look identical. With it, every future cash flow can be translated into a single common unit — value today — and only then can two projects, two bonds or two investments be honestly compared.',
    how: [
      'Choose a rate that reflects what the money could earn elsewhere at comparable risk. This is the opportunity cost, and in valuation it is called the discount rate.',
      'Move money forward in time by compounding: multiply by (1 + r) once for each period.',
      'Move money backward in time by discounting: divide by (1 + r) once for each period.',
      'Once all cash flows sit at the same point in time, they can be added, compared or subtracted.',
    ],
    components: [
      { k: 'Present value (PV)', v: 'The value of a cash flow expressed in today’s terms.' },
      { k: 'Future value (FV)', v: 'The value of a cash flow expressed at a stated future date.' },
      { k: 'Rate (r)', v: 'The periodic return or discount rate. Must match the period length.' },
      { k: 'Periods (n)', v: 'The number of compounding periods, not necessarily years.' },
      { k: 'Cash flow timing', v: 'Whether payments occur at the end of each period (ordinary annuity) or the beginning (annuity due).' },
    ],
    formula: {
      main: 'FV = PV × (1 + r)ⁿ',
      others: [
        { label: 'Present value', expr: 'PV = FV ÷ (1 + r)ⁿ' },
        { label: 'Compounding m times a year', expr: 'FV = PV × (1 + r/m)^(m×t)' },
        { label: 'Future value of an ordinary annuity', expr: 'FV = P × [ ((1 + r)ⁿ − 1) ÷ r ]' },
      ],
      variables: [
        { sym: 'PV', desc: 'Amount today' },
        { sym: 'FV', desc: 'Amount at the end of n periods' },
        { sym: 'r', desc: 'Return per period, as a decimal' },
        { sym: 'n', desc: 'Number of periods' },
        { sym: 'P', desc: 'Recurring payment per period' },
      ],
    },
    example: {
      setup: '₹1,00,000 is invested for 5 years at 8% a year, compounded annually.',
      steps: [
        'FV = 1,00,000 × (1 + 0.08)⁵',
        '(1.08)⁵ = 1.469328',
        'FV = 1,00,000 × 1.469328 = ₹1,46,933 (rounded)',
      ],
      result: '₹1,46,933',
      note: 'Of the ₹46,933 gain, ₹40,000 is simple interest on the original amount. The remaining ₹6,933 is interest earned on interest — compounding.',
    },
    interpretation: 'The gap between ₹1,00,000 and ₹1,46,933 is not profit created by the calculation. It is the price of time at an 8% opportunity cost. Read in reverse: a promise of ₹1,46,933 in five years is worth exactly ₹1,00,000 today to someone who can otherwise earn 8%.',
    application: [
      'Discounting project cash flows to compute NPV before a firm commits capital.',
      'Pricing a bond as the present value of its coupons and principal.',
      'Building a loan amortisation schedule, where each EMI is a level annuity payment.',
      'Deciding between a lump sum today and a stream of payments later.',
    ],
    advantages: [
      'Makes cash flows arriving at different dates directly comparable.',
      'Uses one consistent logic across nearly every corner of finance.',
      'Forces an explicit statement of the assumed opportunity cost.',
    ],
    limitations: [
      'The output is only as sound as the discount rate chosen, and that rate is a judgement.',
      'Standard formulas assume a constant rate; real rates move.',
      'Cash flow forecasts far into the future carry large estimation error, which discounting reduces but does not remove.',
      'The arithmetic is nominal unless inflation is explicitly handled.',
    ],
    misconceptions: [
      { claim: '“Time value of money is just inflation.”', truth: 'Inflation is one reason money loses purchasing power over time, but TVM would still hold at zero inflation, because capital can earn a real return. Inflation and opportunity cost are separate inputs.' },
      { claim: '“A higher discount rate is more conservative, so it is safer.”', truth: 'A higher rate lowers present value, which is conservative for an inflow, but it flatters a future outflow. The rate must reflect risk, not a mood.' },
      { claim: '“Doubling the period doubles the growth.”', truth: 'Compounding is exponential. At 8%, five years multiplies capital by 1.47; ten years by 2.16, not 1.94.' },
    ],
    realWorld: 'Loan EMIs are constructed directly from this principle. A lender sets the payment so that the present value of all future EMIs, discounted at the loan’s interest rate, equals the amount disbursed today. Early EMIs are mostly interest not because of a fee, but because the outstanding balance — and therefore the time cost being charged — is largest at the start.',
    scenarioRef: 'rate-hike',
    caseRef: null,
    sim: 'compounding',
    related: ['compounding', 'inflation', 'discount-rate', 'real-return', 'interest'],
    prereq: [],
    next: ['compounding', 'discount-rate'],
    tool: 'compound',
  },
  {
    id: 'compounding',
    title: 'Compounding',
    domain: 'fundamentals', category: 'money-time', subcategory: 'Compounding',
    level: 'Foundational',
    oneLine: 'Returns earned on returns, which is why growth curves bend upward rather than climb in a straight line.',
    what: 'Compounding is the process by which returns are themselves reinvested and go on to earn further returns. Where simple interest grows a balance linearly, compound growth is exponential: the base on which the return is calculated increases every period.',
    simple: 'You earn on what you invested, and then you also earn on what you earned.',
    why: 'Compounding explains why time in the market matters more than the size of any single year’s return, why small differences in cost or rate become large over decades, and why debt left unpaid escalates rather than accumulates evenly.',
    formula: {
      main: 'A = P × (1 + r/m)^(m×t)',
      variables: [
        { sym: 'A', desc: 'Final amount' }, { sym: 'P', desc: 'Principal' },
        { sym: 'r', desc: 'Annual nominal rate' }, { sym: 'm', desc: 'Compounding periods per year' }, { sym: 't', desc: 'Years' },
      ],
      others: [{ label: 'Effective annual rate', expr: 'EAR = (1 + r/m)^m − 1' }],
    },
    example: {
      setup: '₹1,00,000 at a 12% nominal annual rate for 1 year, compounded monthly.',
      steps: ['A = 1,00,000 × (1 + 0.12/12)¹²', '(1.01)¹² = 1.126825', 'A = ₹1,12,683 (rounded)'],
      result: '₹1,12,683',
      note: 'Annual compounding at the same nominal rate would give ₹1,12,000. The effective annual rate is 12.68%, not 12%.',
    },
    misconceptions: [
      { claim: '“The stated rate is the rate you earn.”', truth: 'Only when compounding is annual. Compare products on effective annual rate, not nominal rate.' },
    ],
    limitations: ['Compound growth assumes returns are actually reinvested and that the rate persists — neither is guaranteed in market-linked assets.'],
    application: ['Comparing deposit and loan products on a like-for-like basis.', 'Understanding why fee differences of a fraction of a percent matter over long horizons.'],
    related: ['time-value-of-money', 'inflation', 'real-return'],
    prereq: ['time-value-of-money'], next: ['discount-rate'],
    sim: 'compounding',
    tool: 'sip',
  },
  {
    id: 'inflation',
    title: 'Inflation',
    domain: 'economics', category: 'macro', subcategory: 'Inflation',
    level: 'Foundational',
    oneLine: 'A sustained rise in the general price level, which reduces what each unit of currency buys.',
    what: 'Inflation is a sustained increase in the general level of prices across an economy, measured by index numbers such as a consumer price index. It is not a rise in one price, but a broad rise in the price level, and it is expressed as a rate of change over a period.',
    simple: 'The same basket of goods costs more than it used to, so the same money buys less.',
    why: 'Inflation is the hinge between the real economy and financial markets. It erodes the purchasing power of fixed cash flows, drives central bank policy, sets the floor under interest rates, and determines whether a nominal return is a real gain or a quiet loss.',
    how: [
      'Prices are collected for a representative basket of goods and services and combined into an index.',
      'The inflation rate is the percentage change in that index over a period.',
      'Persistent inflation may come from demand exceeding supply capacity, from cost shocks feeding into prices, or from expectations of future inflation becoming self-reinforcing.',
    ],
    formula: {
      main: 'Inflation rate = (Indexₜ − Indexₜ₋₁) ÷ Indexₜ₋₁ × 100',
      others: [{ label: 'Purchasing power after n years', expr: 'Real value = Nominal ÷ (1 + i)ⁿ' }],
      variables: [{ sym: 'i', desc: 'Annual inflation rate' }, { sym: 'n', desc: 'Number of years' }],
    },
    example: {
      setup: '₹1,00,000 held in cash for 10 years while inflation averages 6% a year.',
      steps: ['Real value = 1,00,000 ÷ (1.06)¹⁰', '(1.06)¹⁰ = 1.790847', 'Real value ≈ ₹55,839 in today’s purchasing power'],
      result: '≈ ₹55,839',
      note: 'The nominal balance never fell. What fell was what it could buy.',
    },
    interpretation: 'Inflation is a tax on holding money and on any asset whose cash flows are fixed in nominal terms. It is why a “safe” nominal return below the inflation rate is a guaranteed real loss.',
    misconceptions: [
      { claim: '“Falling inflation means falling prices.”', truth: 'Falling inflation (disinflation) means prices are rising more slowly. Prices actually falling is deflation, a different condition with different consequences.' },
      { claim: '“Inflation affects everyone equally.”', truth: 'It depends on what you consume, what you owe and what you own. Fixed-rate borrowers repay in cheaper currency; holders of long-dated fixed cash flows lose most.' },
    ],
    application: ['Setting a required return that preserves purchasing power.', 'Interpreting central bank policy decisions.', 'Choosing between nominal and inflation-linked instruments.'],
    realWorld: 'Central banks in many countries operate an explicit inflation target and adjust policy rates to steer inflation toward it. That single linkage is what connects a consumer price release to bond yields, loan EMIs and equity valuations within hours.',
    scenarioRef: 'rate-hike',
    related: ['interest-rates', 'real-return', 'monetary-policy', 'bond-pricing', 'time-value-of-money'],
    prereq: ['time-value-of-money'], next: ['interest-rates', 'real-return'],
  },
  {
    id: 'interest-rates',
    title: 'Interest Rates',
    domain: 'economics', category: 'macro', subcategory: 'Interest Rates',
    level: 'Core',
    oneLine: 'The price of money over time — set by policy at the short end and by markets across the curve.',
    what: 'An interest rate is the price paid for the use of money for a period. In an economy there is not one rate but a structure of rates, differing by maturity, credit quality and liquidity. The central bank sets a policy rate at the very short end; every other rate is built on top of it with premiums for time and risk.',
    simple: 'Interest is rent on money. Longer and riskier loans command higher rent.',
    why: 'Interest rates are the single most connected variable in finance. They set the discount rate used in valuation, the cost of corporate capital, the return on savings, the EMI on household debt and the relative attractiveness of currencies.',
    components: [
      { k: 'Policy rate', v: 'The rate at which the central bank lends to or borrows from banks, anchoring short-term rates.' },
      { k: 'Term premium', v: 'Extra yield demanded for lending over longer horizons.' },
      { k: 'Credit spread', v: 'Extra yield demanded for the possibility of default.' },
      { k: 'Yield curve', v: 'The set of yields across maturities for comparable credit quality.' },
    ],
    misconceptions: [
      { claim: '“The central bank sets all interest rates.”', truth: 'It sets a short-term policy rate and influences expectations. Long-term yields are set by markets pricing growth, inflation and risk.' },
    ],
    application: ['Deriving the discount rate for valuation.', 'Understanding why bond prices move inversely to yields.', 'Assessing the cost of leverage for a firm or household.'],
    scenarioRef: 'rate-hike',
    related: ['inflation', 'monetary-policy', 'bond-pricing', 'discount-rate', 'leverage'],
    prereq: ['inflation'], next: ['bond-pricing', 'monetary-policy'],
  },
  {
    id: 'real-return',
    title: 'Real Return',
    domain: 'fundamentals', category: 'risk-return', subcategory: 'Real vs Nominal',
    level: 'Core',
    oneLine: 'The return that remains after inflation is removed — the only return that changes what you can buy.',
    what: 'A nominal return measures the change in the number of currency units. A real return measures the change in purchasing power, after adjusting for inflation over the same period.',
    simple: 'If your money grew 7% and prices rose 6%, you are roughly 1% better off, not 7%.',
    formula: {
      main: 'Real return = [(1 + nominal) ÷ (1 + inflation)] − 1',
      others: [{ label: 'Common approximation', expr: 'Real ≈ Nominal − Inflation' }],
      variables: [{ sym: 'nominal', desc: 'Stated return, as a decimal' }, { sym: 'inflation', desc: 'Inflation rate over the same period' }],
    },
    example: {
      setup: 'A deposit returns 7% over a year in which inflation is 6%.',
      steps: ['Real = (1.07 ÷ 1.06) − 1', '= 0.009434', '= 0.94%'],
      result: '0.94%',
      note: 'The approximation gives 1.00%. The gap widens as rates rise, which is why the exact form matters at high inflation.',
    },
    interpretation: 'Real return is the honest scoreboard. A portfolio can post positive nominal returns for years while losing purchasing power, and only the real figure reveals it.',
    misconceptions: [{ claim: '“Subtracting inflation is exact.”', truth: 'Subtraction is an approximation that works only at low rates. The ratio form is exact.' }],
    application: ['Judging whether a fixed deposit preserves wealth.', 'Setting long-horizon goals such as retirement corpus targets.'],
    related: ['inflation', 'time-value-of-money', 'compounding', 'interest-rates'],
    prereq: ['inflation'], next: ['risk-return'],
  },
  {
    id: 'risk-return',
    title: 'Risk and Return',
    domain: 'fundamentals', category: 'risk-return', subcategory: 'Risk',
    level: 'Core',
    oneLine: 'Expected return is compensation for bearing risk that cannot be diversified away.',
    what: 'In finance, risk is the dispersion of possible outcomes around an expected value, not merely the chance of loss. Investors require a higher expected return to hold assets with greater exposure to risks they cannot eliminate by diversifying. The excess of expected return over the risk-free rate is the risk premium.',
    simple: 'If two investments offered the same expected return and one was riskier, nobody would hold the riskier one. Its price falls until the expected return is high enough to attract buyers.',
    components: [
      { k: 'Risk-free rate', v: 'Return available with negligible default risk, typically a short government security.' },
      { k: 'Risk premium', v: 'Additional expected return demanded for bearing risk.' },
      { k: 'Systematic risk', v: 'Risk common to the whole market, which diversification cannot remove.' },
      { k: 'Unsystematic risk', v: 'Risk specific to one company or sector, which diversification can substantially remove.' },
    ],
    misconceptions: [
      { claim: '“Higher risk means higher return.”', truth: 'Higher risk means higher *expected* return, and a wider range of realised outcomes. If high risk guaranteed high return it would not be risk.' },
      { claim: '“Diversification removes risk.”', truth: 'It removes company-specific risk. Market-wide risk remains, which is precisely why the market pays a premium for it.' },
    ],
    application: ['Building the cost of equity in a valuation.', 'Constructing a portfolio whose risk matches an actual time horizon.'],
    related: ['discount-rate', 'time-value-of-money', 'leverage', 'inflation'],
    prereq: ['time-value-of-money'], next: ['discount-rate'],
  },
  {
    id: 'discount-rate',
    title: 'Discount Rate and NPV',
    domain: 'corporate', category: 'investment-decision', subcategory: 'NPV',
    level: 'Intermediate',
    oneLine: 'The rate that converts future cash flows into value today, and the rule that follows from it.',
    what: 'The discount rate is the required return used to bring future cash flows to present value. Net present value (NPV) is the sum of all a project’s discounted cash flows, including the initial outlay. A positive NPV means the project is expected to earn more than the required return, and therefore adds value.',
    simple: 'Work out what all the future money is worth today, subtract what you have to spend now. If the answer is positive, it is worth doing.',
    why: 'NPV is the decision rule that connects the time value of money to actual corporate behaviour: which factory gets built, which acquisition proceeds, which product line is discontinued.',
    formula: {
      main: 'NPV = Σ [ CFₜ ÷ (1 + r)ᵗ ] − C₀',
      variables: [
        { sym: 'CFₜ', desc: 'Cash flow in period t' }, { sym: 'r', desc: 'Discount rate per period' },
        { sym: 't', desc: 'Period index' }, { sym: 'C₀', desc: 'Initial investment at t = 0' },
      ],
      others: [{ label: 'IRR', expr: 'The rate r at which NPV = 0' }],
    },
    example: {
      setup: 'A project costs ₹10,00,000 today and is expected to return ₹4,00,000 a year for 3 years. The required return is 10%.',
      steps: [
        'PV of year 1 = 4,00,000 ÷ 1.10 = 3,63,636',
        'PV of year 2 = 4,00,000 ÷ 1.21 = 3,30,579',
        'PV of year 3 = 4,00,000 ÷ 1.331 = 3,00,526',
        'Total PV = 9,94,741 → NPV = 9,94,741 − 10,00,000 = −₹5,259',
      ],
      result: '−₹5,259 — reject',
      note: 'The project returns ₹12,00,000 on a ₹10,00,000 outlay and still fails. Undiscounted totals hide the cost of time.',
    },
    interpretation: 'A negative NPV does not mean the project loses money. It means it does not clear the required return, and capital would be better deployed elsewhere at the same risk.',
    limitations: ['Highly sensitive to the discount rate and to terminal-period assumptions.', 'Assumes cash flow forecasts are unbiased, which in practice they often are not.'],
    application: ['Capital budgeting decisions.', 'Valuing a business by discounted cash flow.', 'Comparing lease versus buy alternatives.'],
    caseRef: 'capex-decision',
    related: ['time-value-of-money', 'interest-rates', 'risk-return', 'leverage'],
    prereq: ['time-value-of-money', 'risk-return'], next: ['leverage'],
  },
  {
    id: 'bond-pricing',
    title: 'Bond Pricing and Yields',
    domain: 'markets', category: 'market-types', subcategory: 'Debt Markets',
    level: 'Intermediate',
    oneLine: 'A bond’s price is the present value of its cash flows, which is why price and yield move in opposite directions.',
    what: 'A bond is a contract to pay fixed coupons and repay principal at maturity. Its price is the present value of those cash flows discounted at the yield the market currently demands. Because the cash flows are fixed, any change in the required yield must be absorbed entirely by the price.',
    simple: 'The payments are locked. If buyers now demand a higher return, the only thing left that can move is the price — so it falls.',
    formula: {
      main: 'Price = Σ [ C ÷ (1 + y)ᵗ ] + F ÷ (1 + y)ⁿ',
      variables: [
        { sym: 'C', desc: 'Coupon payment per period' }, { sym: 'F', desc: 'Face value' },
        { sym: 'y', desc: 'Yield per period' }, { sym: 'n', desc: 'Periods to maturity' },
      ],
    },
    example: {
      setup: 'A ₹1,000 face value bond pays a 6% annual coupon with 3 years left. Market yields rise to 8%.',
      steps: ['Price = 60/1.08 + 60/1.08² + 1,060/1.08³', '= 55.56 + 51.44 + 841.68', '= ₹948.68'],
      result: '₹948.68 — a discount to face value',
      note: 'The coupon never changed. The price fell so that a buyer paying today earns 8% to maturity.',
    },
    interpretation: 'Longer maturities are more sensitive to yield changes, because more of their value sits far in the future where discounting bites hardest. This sensitivity is measured by duration.',
    misconceptions: [{ claim: '“Bonds are safe, so their prices do not fall.”', truth: 'A high-quality bond held to maturity has low credit risk, but its market price fluctuates with yields throughout its life.' }],
    application: ['Understanding portfolio losses during a rate-hiking cycle.', 'Choosing bond maturity to match a liability date.'],
    scenarioRef: 'rate-hike',
    sim: 'bond',
    related: ['interest-rates', 'time-value-of-money', 'inflation', 'discount-rate'],
    prereq: ['time-value-of-money', 'interest-rates'], next: ['monetary-policy'],
  },
  {
    id: 'monetary-policy',
    title: 'Monetary Policy',
    domain: 'economics', category: 'policy', subcategory: 'Monetary Policy',
    level: 'Intermediate',
    oneLine: 'The central bank’s management of money and credit conditions, usually aimed at price stability.',
    what: 'Monetary policy is the set of actions a central bank takes to influence the availability and cost of money in an economy. The principal instrument is a short-term policy rate; central banks also use reserve requirements, open market operations and communication about the likely future path of rates.',
    simple: 'The central bank makes borrowing more expensive to cool an overheating economy, or cheaper to support a weak one.',
    how: [
      'The policy rate changes the cost at which banks fund themselves overnight.',
      'Banks pass that change into lending and deposit rates.',
      'Borrowing, spending and investment respond with a lag.',
      'Demand shifts relative to supply capacity, and inflation adjusts.',
    ],
    components: [
      { k: 'Policy rate', v: 'The headline instrument.' },
      { k: 'Open market operations', v: 'Buying or selling securities to add or drain liquidity.' },
      { k: 'Reserve requirements', v: 'The share of deposits banks must hold rather than lend.' },
      { k: 'Forward guidance', v: 'Communicating the expected path of policy to shape market expectations.' },
    ],
    limitations: ['Acts with long and variable lags.', 'Cannot fix supply-side price shocks directly.', 'Blunt: it affects the whole economy, not the sector causing the problem.'],
    scenarioRef: 'rate-hike',
    related: ['interest-rates', 'inflation', 'bond-pricing'],
    prereq: ['interest-rates'], next: ['bond-pricing'],
  },
  {
    id: 'leverage',
    title: 'Financial Leverage',
    domain: 'corporate', category: 'financing-decision', subcategory: 'Leverage',
    level: 'Intermediate',
    oneLine: 'Using borrowed money to increase the scale of an investment — which magnifies outcomes in both directions.',
    what: 'Financial leverage is the use of debt in a capital structure. Because interest is a fixed claim, any return earned above the cost of debt accrues entirely to equity holders — and any shortfall is borne entirely by them too. Leverage therefore raises the expected return on equity while widening the range of possible outcomes.',
    simple: 'Borrowing lets you control a bigger asset with the same amount of your own money. The gains get bigger. So do the losses.',
    formula: {
      main: 'Debt-to-Equity = Total Debt ÷ Shareholders’ Equity',
      others: [{ label: 'Interest coverage', expr: 'EBIT ÷ Interest expense' }],
      variables: [{ sym: 'EBIT', desc: 'Earnings before interest and tax' }],
    },
    example: {
      setup: 'An asset worth ₹1,00,00,000 rises 10%. Compare full equity funding with ₹75,00,000 of debt at 8%.',
      steps: [
        'All equity: gain ₹10,00,000 on ₹1,00,00,000 → 10% return on equity.',
        'With debt: gain ₹10,00,000 less interest ₹6,00,000 = ₹4,00,000 on ₹25,00,000 equity → 16% return on equity.',
        'If instead the asset falls 10%: −₹10,00,000 less ₹6,00,000 interest = −₹16,00,000 on ₹25,00,000 → −64%.',
      ],
      result: '16% up, −64% down',
      note: 'The same leverage that produced the higher gain produced a loss six times larger in percentage terms.',
    },
    interpretation: 'Leverage does not create value; it redistributes risk and return toward the equity holder. It also converts a solvency question into a liquidity question, because interest must be paid in cash on schedule regardless of accounting profit.',
    misconceptions: [{ claim: '“Debt is cheap, so more debt is always better.”', truth: 'Debt is cheaper than equity partly because it is senior and contractual. Beyond a point, additional debt raises the cost of both debt and equity and increases the probability of distress.' }],
    application: ['Assessing whether a company can survive a downturn.', 'Understanding margin trading and its liquidation risk.'],
    caseRef: 'lehman-2008',
    sim: 'leverage',
    related: ['risk-return', 'balance-sheet', 'financial-ratios', 'interest-rates'],
    prereq: ['risk-return'], next: ['financial-ratios'],
  },
];


/* A concept slot is "written" when a concept declares that subcategory.
   Everything else is visible structure — shown honestly, never faked. */
const conceptForSlot = (domainId, sub) =>
  CONCEPTS.find((c) => c.domain === domainId && c.subcategory === sub);

const domainStats = (d) => {
  const cats = d.categories || [];
  const slots = cats.reduce((n, c) => n + c.subcategories.length, 0);
  const written = cats.reduce((n, c) =>
    n + c.subcategories.filter((s) => conceptForSlot(d.id, s)).length, 0);
  return { slots, written };
};

const conceptById = (id) => CONCEPTS.find((c) => c.id === id);

// ---------------------------------------------------------------------------
// CASE STUDIES
// ---------------------------------------------------------------------------

const CASES = [
  {
    id: 'capex-decision', img: 'case-capital-budgeting',
    title: 'A capacity expansion that failed on the discount rate',
    type: 'Teaching case',
    tag: 'Corporate Finance',
    note: 'This is an illustrative teaching case built to demonstrate a method. The company and figures are constructed, not reported facts.',
    background: 'A mid-sized manufacturer operating at close to full capacity is considering a new production line. Demand has grown steadily and the sales team is confident.',
    situation: 'The line costs ₹10,00,000 and is expected to generate ₹4,00,000 of incremental cash flow a year for three years, after which the technology is expected to be obsolete with negligible salvage value.',
    problem: 'Management sees ₹12,00,000 of total inflow against a ₹10,00,000 outlay and reads it as a clear ₹2,00,000 gain. The finance team disagrees.',
    concepts: ['time-value-of-money', 'discount-rate', 'risk-return'],
    analysis: [
      'The firm’s required return on projects of this risk is 10%.',
      'Discounted cash flows: ₹3,63,636 + ₹3,30,579 + ₹3,00,526 = ₹9,94,741.',
      'NPV = ₹9,94,741 − ₹10,00,000 = −₹5,259.',
      'Sensitivity: at an 8% required return NPV turns positive (about ₹30,800); at 12% it falls to roughly −₹39,300. The decision hinges almost entirely on the rate.',
    ],
    decision: 'The project is rejected at a 10% hurdle rate, and management is asked to either extend the asset’s useful life through a different specification or renegotiate equipment cost.',
    outcome: 'A revised proposal with a four-year useful life at the same annual cash flow clears the hurdle comfortably, because a fourth discounted year adds roughly ₹2,73,000 of present value.',
    lessons: [
      'Summing undiscounted cash flows is not analysis. Timing is part of the number.',
      'A near-zero NPV is a signal to examine the assumptions, not to round up.',
      'The hurdle rate deserves as much scrutiny as the cash flow forecast, because the decision is more sensitive to it.',
    ],
    connected: ['discount-rate', 'time-value-of-money', 'risk-return'],
  },
  {
    id: 'lehman-2008', img: 'case-lehman',
    title: 'Lehman Brothers and the limits of leverage',
    type: 'Historical case',
    tag: 'Banking & Risk',
    note: 'Summarised at a high level from the widely documented public record of 2008.',
    background: 'Lehman Brothers was a major US investment bank with large exposure to residential mortgage-related assets built up during the housing boom of the mid-2000s.',
    situation: 'The firm operated with very high balance-sheet leverage and depended heavily on short-term wholesale funding, much of it renewed daily, to finance long-dated and increasingly illiquid assets.',
    problem: 'When US house prices turned and mortgage-related asset values became uncertain, lenders questioned the value of the collateral. A firm with thin equity relative to assets has little room to absorb write-downs, and one funded overnight has little time to find a replacement lender.',
    concepts: ['leverage', 'risk-return', 'interest-rates'],
    analysis: [
      'High leverage meant that a small percentage decline in asset values consumed a large share of equity.',
      'The maturity mismatch — long assets funded by short liabilities — converted a valuation problem into an immediate liquidity problem.',
      'Counterparties reacted to that risk by withdrawing funding, which accelerated the very outcome they feared.',
    ],
    decision: 'Efforts to raise capital or arrange a rescue acquisition over the weekend of 13–14 September 2008 did not succeed.',
    outcome: 'Lehman Brothers filed for Chapter 11 bankruptcy protection on 15 September 2008, the largest bankruptcy filing in US history at the time. Global credit markets seized, and the episode became a defining moment of the financial crisis.',
    lessons: [
      'Leverage is survivable only if funding is stable; the two risks compound each other.',
      'Liquidity, not accounting solvency, usually determines the moment of failure.',
      'Confidence is a funding input. When it goes, it goes at once.',
    ],
    connected: ['leverage', 'risk-return', 'bond-pricing'],
  },
];

const FRAUDS = [
  {
    id: 'enron', img: 'fraud-enron',
    title: 'Enron',
    tag: 'Accounting & disclosure',
    period: '1990s – 2001',
    note: 'Summarised from the widely documented public record, including subsequent US regulatory and legal proceedings.',
    background: 'Enron was a US energy company that expanded from pipelines into energy trading and a range of other businesses during the 1990s, and was for several years one of the most admired firms in the United States.',
    happened: 'Reported earnings and the balance sheet did not reflect economic reality. When the accounting was unwound in late 2001, the company restated results and collapsed, filing for bankruptcy in December 2001.',
    mechanism: [
      'Mark-to-market accounting was applied to long-term energy contracts, allowing the present value of decades of projected profit to be booked as current earnings — with the projections themselves being internal estimates.',
      'Special purpose entities were used to hold debt and underperforming assets off the consolidated balance sheet, so reported leverage appeared far lower than the group’s true obligations.',
      'Some of these entities were capitalised in ways that depended on Enron’s own share price, creating a feedback loop: a falling share price weakened the structures that were holding up the reported numbers.',
    ],
    conceptsInvolved: ['leverage', 'discount-rate', 'time-value-of-money'],
    warnings: [
      'Reported earnings persistently exceeded operating cash flow.',
      'Business complexity that even sophisticated analysts could not explain simply.',
      'Related-party transactions involving senior executives.',
      'A capital structure whose stability depended on the company’s own share price staying high.',
    ],
    impact: 'Shareholders and employees suffered severe losses, including retirement savings concentrated in company stock. Enron’s auditor, Arthur Andersen, collapsed as a firm.',
    response: 'Congressional investigations and criminal prosecutions followed. The US Sarbanes-Oxley Act was enacted in 2002, tightening requirements on internal controls, auditor independence and executive certification of financial statements.',
    lessons: [
      'Cash flow is harder to manufacture than earnings. Persistent divergence is a signal.',
      'Off-balance-sheet does not mean off-risk.',
      'If the structure cannot be explained clearly, that opacity is itself the finding.',
    ],
    connected: ['leverage', 'discount-rate'],
  },
];

// ---------------------------------------------------------------------------
// SCENARIOS
// ---------------------------------------------------------------------------

const SCENARIOS = [
  {
    id: 'rate-hike',
    title: 'The central bank raises interest rates',
    question: 'What actually happens when policy rates go up?',
    tag: 'Monetary policy',
    chain: [
      { stage: 'Event', text: 'The central bank raises its policy rate to bring inflation back toward target.', concepts: ['monetary-policy'] },
      { stage: 'Mechanism', text: 'Banks fund themselves at a higher overnight cost and reprice their lending and deposit rates. Market yields across maturities adjust as investors reprice expectations.', concepts: ['interest-rates'] },
      { stage: 'Direct effect', text: 'Existing bonds fall in price, because their fixed coupons must now compete with newly issued securities offering higher yields. Longer maturities fall the most.', concepts: ['bond-pricing'] },
      { stage: 'Secondary effect', text: 'The discount rate used to value future cash flows rises, which reduces present value. Assets whose value sits far in the future are marked down hardest.', concepts: ['discount-rate', 'time-value-of-money'] },
      { stage: 'Business effect', text: 'Borrowing becomes more expensive. Marginal projects fail the higher hurdle rate and are deferred. Leveraged firms face higher interest costs against unchanged operating profit.', concepts: ['leverage', 'discount-rate'] },
      { stage: 'Financial implication', text: 'Demand cools with a lag, easing price pressure. Savers earn more in nominal terms; borrowers pay more. Whether anyone is genuinely better off depends on where inflation settles relative to those nominal rates.', concepts: ['inflation', 'real-return'] },
    ],
    caveat: 'Direction is more reliable than magnitude or timing. Markets often move on the surprise relative to expectations rather than on the decision itself.',
  },
  {
    id: 'leverage-up',
    title: 'A company increases its leverage',
    question: 'What changes when a firm swaps equity funding for debt?',
    tag: 'Corporate finance',
    chain: [
      { stage: 'Event', text: 'A firm raises debt to fund expansion or to buy back shares, increasing its debt-to-equity ratio.', concepts: ['leverage'] },
      { stage: 'Mechanism', text: 'Interest becomes a fixed contractual claim ahead of shareholders, and in most tax systems it is deductible, lowering the after-tax cost of that capital.', concepts: ['leverage'] },
      { stage: 'Direct effect', text: 'Return on equity rises whenever the return on assets exceeds the after-tax cost of debt. Earnings per share may increase without any operational improvement.', concepts: ['leverage'] },
      { stage: 'Secondary effect', text: 'Earnings volatility increases, because a fixed cost now sits between operating profit and shareholders. Credit metrics such as interest coverage weaken.', concepts: ['risk-return'] },
      { stage: 'Business effect', text: 'Lenders may demand higher spreads or tighter covenants. Financial flexibility narrows: the firm has less capacity to borrow again in a downturn.', concepts: ['interest-rates', 'risk-return'] },
      { stage: 'Financial implication', text: 'Beyond a point, the rising probability of financial distress offsets the tax benefit, and both debt and equity become more expensive. The value gain reverses.', concepts: ['discount-rate', 'leverage'] },
    ],
    caveat: 'The optimal level of leverage differs by industry, by cash flow stability and by asset tangibility. There is no universal ratio.',
  },
];

// ---------------------------------------------------------------------------
// GLOSSARY, TOOLS, HISTORY
// ---------------------------------------------------------------------------

const GLOSSARY = [
  { term: "Bid-ask spread", def: "The difference between the highest price a buyer will pay and the lowest a seller will accept.", formula: "Ask − Bid", simple: "The immediate cost of buying and selling straight away.", link: "market-liquidity" },
  { term: "Capital adequacy ratio", def: "A bank's regulatory capital as a proportion of its risk-weighted assets.", formula: "Regulatory capital ÷ Risk-weighted assets", simple: "How much of the bank's own money stands behind its lending.", link: "capital-adequacy" },
  { term: "Cash conversion cycle", def: "The number of days between paying suppliers and collecting from customers.", formula: "Inventory days + Receivable days − Payable days", simple: "How long your cash is stuck in the business.", link: "working-capital" },
  { term: "Commercial paper", def: "Short-term unsecured borrowing issued by companies in the money market.", simple: "A company's short-term IOU.", link: "money-markets" },
  { term: "Free float", def: "The portion of a company's shares actually available for trading in the market.", simple: "Shares that can really be bought, excluding locked-in holdings.", link: "market-indices" },
  { term: "Payout ratio", def: "The proportion of earnings distributed to shareholders as dividends.", formula: "Dividend per share ÷ Earnings per share", simple: "How much of the profit is handed out rather than kept.", link: "dividend-policy" },
  { term: "Primary market", def: "Where securities are issued for the first time and capital reaches the issuer.", simple: "Where the company actually gets the money.", link: "equity-markets" },
  { term: "Repo", def: "A sale of securities with an agreement to repurchase them shortly after, functioning as secured short-term borrowing.", simple: "Borrowing overnight using securities as collateral.", link: "money-markets" },
  { term: "Risk-weighted assets", def: "A bank's assets scaled according to their assessed riskiness.", simple: "Assets counted by how dangerous they are, not by size.", link: "capital-adequacy" },
  { term: "Secondary market", def: "Where existing securities are traded between investors, with no capital reaching the issuer.", simple: "Investors trading with each other. The company is not involved.", link: "equity-markets" },
  { term: "Spot rate", def: "The exchange rate for immediate settlement.", simple: "Today's rate for exchanging currency now.", link: "foreign-exchange" },
  { term: "Terminal value", def: "The estimated value of all cash flows beyond the explicit forecast period in a valuation.", formula: "TV = FCF ÷ (WACC − g)", simple: "Everything after the years you actually forecast — usually most of the value.", link: "free-cash-flow" },
  { term: "Underwriting", def: "Committing to place a new securities issue, sometimes guaranteeing the proceeds to the issuer.", simple: "The bank promises the issue will be sold, and carries it if it is not.", link: "investment-banking" },
  { term: "WACC", def: "The weighted average cost of capital — the blended required return across a firm's debt and equity.", formula: "(E/V × Re) + (D/V × Rd × (1−t))", simple: "The minimum return the business has to earn to satisfy everyone who funded it.", link: "cost-of-capital" },
  { term: 'Annuity', def: 'A series of equal payments made at regular intervals.', simple: 'The same amount, paid on a schedule — like an EMI or a monthly SIP.', link: 'time-value-of-money' },
  { term: 'Basis point', def: 'One hundredth of one percent (0.01%).', simple: 'A rate move from 6.00% to 6.25% is 25 basis points.', link: 'interest-rates' },
  { term: 'Coupon', def: 'The fixed periodic interest payment a bond makes, stated as a percentage of face value.', simple: 'The cheque the bond pays you.', link: 'bond-pricing' },
  { term: 'Discount rate', def: 'The required rate of return used to convert future cash flows into present value.', simple: 'The rate you use to shrink future money back to today.', link: 'discount-rate' },
  { term: 'Duration', def: 'A measure of a bond price’s sensitivity to a change in yield, expressed in years.', simple: 'How hard a bond falls when rates rise.', link: 'bond-pricing' },
  { term: 'Effective annual rate', def: 'The annual rate that accounts for the effect of compounding within the year.', formula: 'EAR = (1 + r/m)^m − 1', simple: 'What you actually earn, not what the poster says.', link: 'compounding' },
  { term: 'EMI', def: 'Equated monthly instalment — a level payment covering interest and principal repayment on a loan.', formula: 'EMI = P·i·(1+i)ⁿ ÷ ((1+i)ⁿ − 1)', simple: 'One fixed monthly payment that clears the loan by the end of the term.', link: 'time-value-of-money' },
  { term: 'Face value', def: 'The principal amount a bond repays at maturity.', simple: 'The number printed on the bond.', link: 'bond-pricing' },
  { term: 'Hurdle rate', def: 'The minimum return a project must earn to be accepted.', simple: 'The bar a project has to clear.', link: 'discount-rate' },
  { term: 'Inflation', def: 'A sustained rise in the general price level, reducing the purchasing power of money.', formula: '(Indexₜ − Indexₜ₋₁) ÷ Indexₜ₋₁', simple: 'Your money buys less than it did.', link: 'inflation' },
  { term: 'Leverage', def: 'The use of borrowed capital to increase the scale of an investment.', formula: 'D/E = Total Debt ÷ Equity', simple: 'Borrowing to invest bigger — both ways.', link: 'leverage' },
  { term: 'Liquidity', def: 'The ease with which an asset can be converted to cash without materially moving its price.', simple: 'How quickly you can sell without taking a hit.', link: 'leverage' },
  { term: 'Net present value', def: 'The sum of a project’s discounted cash flows less its initial outlay.', formula: 'NPV = Σ CFₜ/(1+r)ᵗ − C₀', simple: 'Value today of doing it, minus what it costs today.', link: 'discount-rate' },
  { term: 'Nominal return', def: 'Return measured in currency units, before adjusting for inflation.', simple: 'The headline number.', link: 'real-return' },
  { term: 'Policy rate', def: 'The interest rate set by a central bank that anchors short-term rates in the economy.', simple: 'The rate the central bank actually controls.', link: 'monetary-policy' },
  { term: 'Real return', def: 'Return after adjusting for inflation, measuring the change in purchasing power.', formula: '(1+nominal)/(1+inflation) − 1', simple: 'What you actually gained in buying power.', link: 'real-return' },
  { term: 'Risk premium', def: 'The additional expected return demanded for holding a risky asset over a risk-free one.', simple: 'The extra you expect for taking the chance.', link: 'risk-return' },
  { term: 'Systematic risk', def: 'Risk affecting the entire market that cannot be removed by diversification.', simple: 'The risk you cannot spread away.', link: 'risk-return' },
  { term: 'Yield', def: 'The return a bond delivers if bought at its current price and held to maturity.', simple: 'What the bond earns you at today’s price.', link: 'bond-pricing' },
  { term: 'Accrual accounting', def: 'Recording revenue when earned and costs when incurred, regardless of when cash moves.', simple: 'The sale counts today even if the customer pays next month.', link: 'income-statement' },
  { term: 'EBIT', def: 'Earnings before interest and tax — profit from core operations before financing and tax effects.', formula: 'Revenue − COGS − Operating expenses', simple: 'What the business itself earns, before the lenders and the tax office.', link: 'income-statement' },
  { term: 'Free cash flow', def: 'Operating cash flow less capital expenditure — cash left after maintaining and growing the asset base.', formula: 'FCF = Operating cash flow − Capex', simple: 'Spare cash the business genuinely has.', link: 'cash-flow-statement' },
  { term: 'Fiat money', def: 'Currency that has value by government designation and public acceptance rather than commodity backing.', simple: 'It works because everyone agrees it does.', link: 'money' },
  { term: 'Interest coverage', def: 'How many times operating profit covers interest expense.', formula: 'EBIT ÷ Interest expense', simple: 'How much room before the interest bill cannot be paid.', link: 'financial-ratios' },
  { term: 'Return on equity', def: 'Net profit as a percentage of shareholders\u2019 equity.', formula: 'Net profit ÷ Equity × 100', simple: 'What owners earn on what they have in.', link: 'financial-ratios' },
  { term: 'Working capital', def: 'Current assets less current liabilities — the short-term resources funding day-to-day operations.', formula: 'Current assets − Current liabilities', simple: 'What is left to run the business month to month.', link: 'balance-sheet' },
  { term: 'Yield curve', def: 'The relationship between yield and maturity for bonds of comparable credit quality.', simple: 'A picture of what lending for longer pays.', link: 'interest-rates' },
];

const HISTORY = [
  { era: 'Barter to coinage', text: 'Exchange moves from direct barter to standardised metal coinage, solving the problem of finding someone who wants exactly what you have.', concepts: ['time-value-of-money'] },
  { era: 'Deposit banking', text: 'Merchants deposit coin with intermediaries and receive transferable claims. Payment separates from the physical movement of metal.', concepts: [] },
  { era: 'Public debt and bond markets', text: 'States borrow from the public through tradable securities. A market price for lending over time emerges.', concepts: ['bond-pricing'] },
  { era: 'Joint stock companies', text: 'Ownership is divided into transferable shares, allowing large ventures to raise capital from many small holders and spreading risk.', concepts: ['risk-return'] },
  { era: 'Central banking', text: 'Institutions emerge to act as lender of last resort and to manage the currency, eventually taking on explicit responsibility for price stability.', concepts: ['monetary-policy'] },
  { era: 'Modern derivatives and risk transfer', text: 'Contracts based on underlying assets allow risk to be priced and transferred separately from ownership — powerful, and capable of concentrating risk when poorly understood.', concepts: ['leverage'] },
];

const TOOLS = [
  { id: 'sip', name: 'SIP calculator', desc: 'Future value of a recurring monthly investment.', concept: 'compounding' },
  { id: 'compound', name: 'Compound interest', desc: 'Growth of a lump sum, with any compounding frequency.', concept: 'time-value-of-money' },
  { id: 'cagr', name: 'CAGR', desc: 'The constant annual growth rate implied by a start and end value.', concept: 'compounding' },
  { id: 'loan', name: 'Loan EMI', desc: 'Level monthly payment, total interest and the split.', concept: 'time-value-of-money' },
  { id: 'real', name: 'Real return', desc: 'What a nominal return is worth after inflation.', concept: 'real-return' },
];

// Knowledge graph edges derived from concept relationships
const EDGES = (() => {
  const seen = new Set(); const out = [];
  CONCEPTS.forEach((c) => (c.related || []).forEach((r) => {
    if (!conceptById(r)) return;
    const key = [c.id, r].sort().join('|');
    if (seen.has(key)) return; seen.add(key); out.push([c.id, r]);
  }));
  return out;
})();

// Unified search index
const buildIndex = () => [
  ...CONCEPTS.map((c) => ({ type: 'Concept', title: c.title, sub: c.oneLine, href: `#/concept/${c.id}`, text: `${c.title} ${c.oneLine} ${c.subcategory} ${c.what || ''}` })),
  ...DOMAINS.map((d) => ({ type: 'Domain', title: d.name, sub: d.blurb, href: d.route || `#/domain/${d.id}`, text: `${d.name} ${d.blurb} ${(d.categories || []).map((c) => c.name + ' ' + c.subcategories.join(' ')).join(' ')}` })),
  ...CASES.map((c) => ({ type: 'Case study', title: c.title, sub: c.tag, href: `#/case/${c.id}`, text: `${c.title} ${c.background} ${c.tag}` })),
  ...FRAUDS.map((f) => ({ type: 'Fraud', title: f.title, sub: f.tag, href: `#/fraud/${f.id}`, text: `${f.title} ${f.background} ${f.tag}` })),
  ...SCENARIOS.map((s) => ({ type: 'Scenario', title: s.title, sub: s.question, href: `#/scenario/${s.id}`, text: `${s.title} ${s.question} ${s.chain.map((x) => x.text).join(' ')}` })),
  ...GLOSSARY.map((g) => ({ type: 'Glossary', title: g.term, sub: g.def, href: `#/glossary?t=${encodeURIComponent(g.term)}`, text: `${g.term} ${g.def} ${g.simple}` })),
  ...TOOLS.map((t) => ({ type: 'Tool', title: t.name, sub: t.desc, href: `#/tools?t=${t.id}`, text: `${t.name} ${t.desc} calculator` })),
  // every planned slot is discoverable too, marked plainly as planned
  ...DOMAINS.flatMap((d) => (d.categories || []).flatMap((c) =>
    c.subcategories
      .filter((sub) => !CONCEPTS.some((x) => x.domain === d.id && x.subcategory === sub))
      .map((sub) => ({
        type: 'Planned', title: sub, sub: `${d.name} · ${c.name} — not written yet`,
        href: `#/domain/${d.id}`, text: `${sub} ${c.name} ${d.name}`,
      })))),
];

function search(q) {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const terms = query.split(/\s+/);
  const SEARCH_INDEX = buildIndex();
  return SEARCH_INDEX.map((item) => {
    const hay = item.text.toLowerCase(); const title = item.title.toLowerCase();
    let score = 0;
    terms.forEach((t) => {
      if (title === t) score += 100;
      else if (title.startsWith(t)) score += 60;
      else if (title.includes(t)) score += 40;
      if (hay.includes(t)) score += 10;
    });
    return { item, score };
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 12).map((r) => r.item);
}


/* ===========================================================================
   FINHUB — DESIGN SYSTEM
   Palette: deep "ink" navy ground, aqua for structure/connection,
   amber for value and money-flows, muted rose for risk.
   Type: serif display (structure, authority) + system sans body + mono utility.
   =========================================================================== */

const CSS = `
/* FINHUB — SURFACE SYSTEM
   Two surfaces, one system. Light "paper" is where you read. Dark "stage" is
   where the universe lives: maps, graphs and flows, where luminous nodes need
   darkness to read as light. The shift from stage to paper is the shift from
   exploring to understanding. */
:root{
  /* paper (default reading surface) */
  --bg:#F5F7FA; --surface:#FFFFFF; --surface-2:#EEF2F7; --line:#DCE3EC;
  --text:#080D18; --muted:#404D66; --faint:#67738C;
  --teal:#0B7B72; --teal-soft:#E2F1EF; --amber:#9A6B08; --amber-soft:#FBF2DE; --rose:#A8323F;
  --shadow:0 1px 2px rgba(11,18,32,.05),0 8px 24px -12px rgba(11,18,32,.14);
  --r:14px;
  --serif: ui-serif,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif;
  --sans: ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  --mono: ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
/* the dark stage: same variable names, re-pointed. Anything nested inside
   inherits the dark treatment without a second set of components. */
.stage{
  --bg:#070A12; --surface:#0E1422; --surface-2:#131B2C; --line:#212C45;
  --text:#F1F5FC; --muted:#AEBBD6; --faint:#7A88A6;
  --teal:#5CE1D0; --teal-soft:#0F2A2C; --amber:#F2B33D; --amber-soft:#241C0C; --rose:#E8848C;
  --shadow:none;
  background:var(--bg);color:var(--text);
}
*{box-sizing:border-box}
.fh{background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100vh;
  overflow-x:hidden;-webkit-font-smoothing:antialiased;line-height:1.62}
.fh h1,.fh h2,.fh h3,.fh h4{font-family:var(--serif);font-weight:600;line-height:1.15;letter-spacing:-.015em;margin:0;color:var(--text)}
.fh p{margin:0}
.fh a{color:inherit;text-decoration:none}
.fh button{font:inherit;color:inherit;background:none;border:none;cursor:pointer}
.fh :focus-visible{outline:2px solid var(--teal);outline-offset:3px;border-radius:4px}
.wrap{width:100%;max-width:1180px;margin:0 auto;padding:0 20px}
.wrap-n{width:100%;max-width:760px;margin:0 auto;padding:0 20px}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--faint)}
.kicker{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--teal)}
.lede{color:var(--muted);font-size:17px;line-height:1.65}
.small{font-size:14px;color:var(--muted);line-height:1.6}
.mono{font-family:var(--mono)}

.sec{padding:88px 0}
.sec-t{border-top:1px solid var(--line)}
.grid{display:grid;gap:16px}
.g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.g3{grid-template-columns:repeat(3,minmax(0,1fr))}
.g4{grid-template-columns:repeat(4,minmax(0,1fr))}
@media(max-width:900px){.g3,.g4{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:620px){.g2,.g3,.g4{grid-template-columns:minmax(0,1fr)}.sec{padding:56px 0}}

.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:22px;min-width:0;box-shadow:var(--shadow);
  transition:border-color .3s ease,transform .3s cubic-bezier(.2,.7,.3,1),box-shadow .3s}
.card h3{font-size:19px;margin-bottom:8px}
.card.link:hover{border-color:var(--teal);transform:translateY(-3px);
  box-shadow:0 2px 4px rgba(11,18,32,.06),0 16px 34px -14px rgba(11,18,32,.22)}
.stage .card.link:hover{box-shadow:none}
.card .cnum{font-family:var(--mono);font-size:11px;color:var(--faint);letter-spacing:.12em}
.sub{background:var(--surface-2);border:1px solid var(--line);border-radius:12px;padding:18px 20px}
.badge{display:inline-block;font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;
  text-transform:uppercase;padding:4px 9px;border-radius:999px;border:1px solid var(--line);color:var(--muted)}
.badge.aqua{color:var(--teal);border-color:var(--teal);background:var(--teal-soft)}
.badge.amber{color:var(--amber);border-color:var(--amber);background:var(--amber-soft)}
.badge.rose{color:var(--rose);border-color:var(--rose)}

.nav{position:sticky;top:0;z-index:60;backdrop-filter:blur(14px);
  background:rgba(245,247,250,.86);border-bottom:1px solid var(--line)}
.nav-in{display:flex;align-items:center;gap:14px;height:60px}
.brand{display:flex;align-items:center;gap:9px;font-family:var(--serif);font-size:19px;letter-spacing:-.02em}

.nav-links{display:flex;gap:2px;margin-left:auto;align-items:center}
.nav-links a{padding:8px 11px;border-radius:8px;font-size:13.5px;color:var(--muted);transition:color .2s,background .2s}
.nav-links a:hover,.nav-links a.on{color:var(--text);background:var(--surface-2)}
.searchbtn{display:flex;align-items:center;gap:10px;border:1px solid var(--line);border-radius:9px;
  padding:7px 11px;color:var(--faint);font-size:13px;background:var(--surface)}
.searchbtn:hover{border-color:var(--teal);color:var(--muted)}
.kbd{font-family:var(--mono);font-size:10px;border:1px solid var(--line);border-radius:4px;padding:1px 5px}
.burger{display:none;margin-left:auto}
@media(max-width:880px){.nav-links{display:none}.burger{display:flex;gap:10px;align-items:center}}
.sheet{border-bottom:1px solid var(--line);background:var(--surface);padding:10px 0 18px}
.sheet a{display:block;padding:11px 4px;border-bottom:1px solid var(--line);color:var(--muted);font-size:15px}

/* ---- hero: the dark stage ---- */
.hero{position:relative;min-height:min(94vh,820px);display:flex;align-items:center;overflow:hidden}
.hero canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.hero-mask{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(130% 85% at 50% 42%,transparent 12%,rgba(7,10,18,.55) 58%,rgba(7,10,18,.94) 100%)}
.hero-fade{position:absolute;left:0;right:0;bottom:-1px;height:120px;pointer-events:none;
  background:linear-gradient(180deg,transparent,#F5F7FA)}
.hero-in{position:relative;z-index:2;padding:120px 0 100px;width:100%}
.h-title{font-size:clamp(38px,7.2vw,82px);letter-spacing:-.03em}
.h-title .l2{display:block;color:var(--teal)}
.h-sub{max-width:52ch;margin-top:22px;font-size:clamp(15px,2.2vw,18.5px);color:var(--muted)}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px}
.btn{display:inline-flex;align-items:center;gap:9px;padding:12px 20px;border-radius:10px;
  font-size:14.5px;border:1px solid var(--line);transition:.25s;color:var(--text)}
.btn.primary{background:var(--teal);border-color:var(--teal);font-weight:600;color:#FFFFFF}
.stage .btn.primary{color:#04120F}
.btn.primary:hover{filter:brightness(1.08);transform:translateY(-1px)}
.btn.ghost:hover{border-color:var(--teal);color:var(--teal)}

.rv{opacity:0;transform:translateY(18px);transition:opacity .7s cubic-bezier(.2,.7,.3,1),transform .7s cubic-bezier(.2,.7,.3,1)}
.rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){
  .rv{opacity:1!important;transform:none!important;transition:none!important}
  .card.link:hover{transform:none}
  .fh *{animation-duration:.001ms!important;transition-duration:.06s!important}
}

.crumbs{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-family:var(--mono);
  font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);padding:22px 0}
.crumbs a:hover{color:var(--teal)}
.crumbs span{color:var(--line)}
.chead{padding:8px 0 34px;border-bottom:1px solid var(--line)}
.chead h1{font-size:clamp(30px,5.4vw,52px)}
.toc{position:sticky;top:76px;align-self:start;display:flex;flex-direction:column;gap:2px}
.toc a{font-size:13px;color:var(--faint);padding:6px 10px;border-left:2px solid var(--line);transition:.2s}
.toc a:hover{color:var(--text);border-color:var(--teal)}
.clay{display:grid;grid-template-columns:200px minmax(0,1fr);gap:44px;padding:36px 0 80px}
@media(max-width:900px){.clay{grid-template-columns:minmax(0,1fr);gap:0}.toc{display:none}}
.block{padding:34px 0;border-bottom:1px solid var(--line)}
.block:last-child{border-bottom:0}
.block h2{font-size:26px;margin-bottom:18px;letter-spacing:-.02em}
.block p+p{margin-top:12px}
.body{font-size:17.5px;color:var(--text);max-width:68ch;line-height:1.7;font-weight:420}
.stage .body{color:#C7D2E6}
.formula{font-family:var(--mono);font-size:clamp(16px,4vw,23px);font-weight:600;
  color:var(--text);letter-spacing:-.01em;
  background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--amber);
  border-radius:12px;padding:22px 24px;overflow-x:auto;white-space:nowrap;
  -webkit-overflow-scrolling:touch;box-shadow:var(--shadow)}
.stage .formula{color:var(--text)}
.vars{display:grid;gap:8px;margin-top:14px}
.var{display:grid;grid-template-columns:74px minmax(0,1fr);gap:14px;font-size:15.5px;align-items:baseline;padding:4px 0}
.var b{font-family:var(--mono);color:var(--text);font-weight:700;font-size:15px}
.steps{display:grid;gap:0;margin-top:6px}
.step{display:grid;grid-template-columns:28px minmax(0,1fr);gap:16px;padding:14px 0;
  border-bottom:1px dashed var(--line);font-size:16.5px;color:var(--text)}
.step:last-child{border-bottom:0}
.step i{font-style:normal;font-family:var(--mono);font-size:12px;color:var(--faint);padding-top:5px;font-weight:600}
.result{display:flex;flex-wrap:wrap;gap:14px;align-items:baseline;margin-top:20px;padding:22px 24px;
  background:var(--teal-soft);border:1px solid color-mix(in srgb,var(--teal) 34%,transparent);border-radius:12px}
.result b{font-family:var(--mono);font-size:clamp(22px,5.2vw,32px);color:var(--text);font-weight:700;letter-spacing:-.02em}
.list{display:grid;gap:10px;margin-top:6px}
.li{display:grid;grid-template-columns:16px minmax(0,1fr);gap:14px;font-size:16.5px;color:var(--text);line-height:1.62}
.li s{text-decoration:none;color:var(--teal);font-family:var(--mono);font-size:12px;padding-top:4px}
.mis{border-left:2px solid var(--rose);padding:2px 0 2px 16px}
.mis b{display:block;color:var(--rose);font-weight:700;font-size:16.5px;margin-bottom:8px;line-height:1.4}

.flow{display:grid;gap:0;margin-top:8px}
.fstep{border:1px solid var(--line);border-radius:12px;padding:18px;background:var(--surface);box-shadow:var(--shadow)}
.fconn{width:1px;height:26px;margin-left:26px;background:linear-gradient(180deg,var(--teal),transparent)}
.fstage{font-family:var(--mono);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--teal);margin-bottom:8px}
.chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
.chip{font-size:12.5px;padding:5px 11px;border-radius:999px;border:1px solid var(--line);
  color:var(--muted);background:var(--surface);transition:.2s}
.chip:hover{border-color:var(--teal);color:var(--teal);background:var(--teal-soft)}

.ov{position:fixed;inset:0;z-index:100;background:rgba(11,18,32,.42);backdrop-filter:blur(6px);
  display:flex;justify-content:center;padding:12vh 16px 16px}
.panel{width:100%;max-width:620px;background:var(--surface);border:1px solid var(--line);
  border-radius:16px;overflow:hidden;height:max-content;max-height:74vh;display:flex;flex-direction:column;
  box-shadow:0 30px 70px -20px rgba(11,18,32,.4)}
.panel input{width:100%;padding:18px 20px;background:transparent;border:0;color:var(--text);font-size:16px;outline:none}
.res{overflow-y:auto;border-top:1px solid var(--line)}
.res a{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;
  padding:13px 20px;border-bottom:1px solid var(--line)}
.res a:hover,.res a.sel{background:var(--surface-2)}
.res b{display:block;font-weight:600;font-size:15px}
.res p{font-size:13px;color:var(--faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.field{display:grid;gap:7px;margin-bottom:16px}
.field label{font-size:13px;color:var(--muted)}
.field input{background:var(--surface);border:1px solid var(--line);border-radius:9px;padding:11px 13px;
  color:var(--text);font-family:var(--mono);font-size:15px;width:100%;outline:none}
.field input:focus{border-color:var(--teal)}
.out{display:grid;gap:10px}
.outrow{display:flex;justify-content:space-between;gap:14px;padding:12px 0;border-bottom:1px dashed var(--line);font-size:14.5px}
.outrow b{font-family:var(--mono);font-weight:600}
.tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.tab{padding:8px 14px;border-radius:999px;border:1px solid var(--line);font-size:13.5px;
  color:var(--muted);background:var(--surface)}
.tab:hover{border-color:var(--teal);color:var(--teal)}
.tab.on{background:var(--teal);color:#FFFFFF;border-color:var(--teal);font-weight:600}

/* ---- scenes: one message, one visual, one interaction ---- */
.sec{padding:120px 0}
@media(max-width:820px){.sec{padding:84px 0}}
@media(max-width:520px){.sec{padding:64px 0}}
.h-scene{font-size:clamp(27px,4.6vw,44px);line-height:1.14;max-width:20ch}
.wrap-n .h-scene{margin-inline:auto}
.h-page{font-size:clamp(30px,5.2vw,50px)}
.scene-head{max-width:640px}
.grid{gap:20px}
@media(min-width:900px){.grid{gap:24px}}
.card{padding:26px}

/* ladder: a real sequence, so it is numbered */
.ladder{list-style:none;margin:44px 0 0;padding:0;display:grid;gap:0;max-width:760px}
.ladder li{display:grid;grid-template-columns:56px minmax(0,1fr);gap:18px;
  padding:22px 0;border-top:1px solid var(--line);align-items:baseline}
.ladder li:last-child{border-bottom:1px solid var(--line)}
.lnum{font-family:var(--mono);font-size:12px;color:var(--faint);letter-spacing:.12em}
.lbody{display:grid;gap:5px;min-width:0}
.lbody b{font-family:var(--serif);font-size:20px;font-weight:600}

/* mobile universe: same information, different composition */
.rail-wrap{position:absolute;left:0;right:0;bottom:0;padding-bottom:34px;z-index:3}
.rail{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;
  padding:0 20px 12px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.rail::-webkit-scrollbar{display:none}
.rail-card{flex:0 0 200px;scroll-snap-align:start;min-height:104px;display:flex;
  flex-direction:column;justify-content:flex-end;gap:8px;padding:16px;
  border:1px solid var(--line);border-radius:14px;background:var(--surface)}
.rail-card b{font-family:var(--serif);font-size:17px;font-weight:600;line-height:1.2}
.rail-card:active{border-color:var(--teal)}
.rail-more{justify-content:center;align-items:center;flex-basis:150px;color:var(--teal)}

/* relationship explorer */
.explorer{margin-top:44px}
.explorer-picker{display:flex;gap:8px;overflow-x:auto;padding-bottom:14px;
  margin-bottom:20px;scrollbar-width:none}
.explorer-picker::-webkit-scrollbar{display:none}
.explorer-picker .tab{flex:0 0 auto}
.explorer-map{padding:26px}
.explorer-foot{display:flex;flex-wrap:wrap;gap:18px;align-items:center;
  justify-content:space-between;margin-top:22px}

/* touch targets and clear states */
.btn{min-height:46px}
.tab{min-height:40px;display:inline-flex;align-items:center}
.chip{min-height:34px;display:inline-flex;align-items:center}
.nav-links a{min-height:38px;display:inline-flex;align-items:center}
.sheet a{min-height:48px;display:flex;align-items:center}
.tab.on{box-shadow:none}
@media(hover:none){.card.link:hover{transform:none;box-shadow:var(--shadow)}}
.card.link:active{border-color:var(--teal)}

/* softer surface: fewer borders and lighter shadow */
:root{--shadow:0 1px 2px rgba(11,18,32,.04),0 10px 24px -16px rgba(11,18,32,.16)}
.credit{font-family:var(--mono);font-size:11.5px;letter-spacing:.1em;color:var(--faint);
  text-transform:uppercase;margin-top:26px}

.gnode{cursor:pointer}
.gnode .gdot,.gnode text{transition:fill .2s,r .2s}
.gnode:hover .gdot,.gnode:focus-visible .gdot{r:7;fill:var(--amber)}
.gnode:hover text,.gnode:focus-visible text{fill:var(--text)}
/* ---- symbol system ---- */
.sym{display:block;color:var(--teal);flex:none}
.card-mark,.uex-mark,.dom-mark{display:inline-flex;align-items:center;justify-content:center;
  width:46px;height:46px;border-radius:12px;background:var(--teal-soft);color:var(--teal);flex:none}
.card-mark{width:44px;height:44px}

/* ---- financial signal terminal ---- */
.terminal{margin-top:48px;border:1px solid var(--line);border-radius:20px;background:var(--surface);
  padding:44px 32px 30px;display:grid;justify-items:center;gap:30px;box-shadow:var(--shadow)}
.term-stage{display:flex;align-items:center;gap:0;width:100%;max-width:420px;justify-content:center}
.term-node{display:inline-flex;align-items:center;justify-content:center;width:62px;height:62px;
  border-radius:16px;border:1px solid var(--line);background:var(--bg);color:var(--teal);flex:none}
.term-node-b{color:var(--amber);border-color:color-mix(in srgb,var(--amber) 34%,transparent)}
.term-link{position:relative;flex:1 1 auto;height:2px;min-width:60px;max-width:180px}
.term-line{position:absolute;inset:0;background:linear-gradient(90deg,var(--teal),var(--amber));opacity:.28}
.term-pulse{position:absolute;top:50%;left:0;width:8px;height:8px;margin-top:-4px;border-radius:50%;
  background:var(--amber);animation:travel 6.5s cubic-bezier(.5,0,.5,1) infinite}
@keyframes travel{0%{left:0;opacity:0}12%{opacity:1}70%{left:calc(100% - 8px);opacity:1}100%{left:calc(100% - 8px);opacity:0}}
.term-read{text-align:center;max-width:56ch;animation:fadeUp .6s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.term-pair{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:baseline;
  font-family:var(--serif);font-size:clamp(19px,3.2vw,26px);font-weight:600;line-height:1.25}
.term-arrow{color:var(--teal);font-family:var(--sans);font-size:.8em}
.term-via{margin-top:12px}
.term-read .chip{margin-top:18px}
.term-dots{display:flex;gap:10px}
.term-dot{width:34px;height:4px;border-radius:2px;background:var(--line);padding:0;
  border:0;transition:background .3s}
.term-dot.on{background:var(--teal)}
.term-dot:hover{background:var(--muted)}
@media(prefers-reduced-motion:reduce){.term-pulse{display:none}.term-read{animation:none}}
@media(max-width:560px){.terminal{padding:32px 20px 24px}.term-node{width:54px;height:54px}}

/* ---- interactive universe explorer ---- */
.uex{margin-top:44px}
.uex-picker{display:flex;gap:10px;overflow-x:auto;padding-bottom:16px;margin-bottom:22px;scrollbar-width:none}
.uex-picker::-webkit-scrollbar{display:none}
.uex-chip{flex:0 0 auto;display:inline-flex;align-items:center;gap:9px;min-height:44px;
  padding:0 16px;border:1px solid var(--line);border-radius:999px;background:var(--surface);
  color:var(--muted);font-size:14px;transition:.25s}
.uex-chip .sym{color:var(--faint);transition:color .25s}
.uex-chip:hover{border-color:var(--teal);color:var(--text)}
.uex-chip.on{background:var(--teal);border-color:var(--teal);color:#fff;font-weight:600}
.uex-chip.on .sym{color:#fff}
.uex-panel{border:1px solid var(--line);border-radius:20px;background:var(--surface);
  padding:32px;box-shadow:var(--shadow);animation:fadeUp .45s ease both}
.uex-head{display:flex;gap:18px;align-items:flex-start;padding-bottom:26px;border-bottom:1px solid var(--line)}
.uex-cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:44px;padding:26px 0}
@media(max-width:780px){.uex-cols{grid-template-columns:minmax(0,1fr);gap:32px}.uex-panel{padding:24px 20px}}
.uex-list{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:2px}
.uex-list li{display:grid;gap:4px;padding:12px 0;border-bottom:1px solid var(--line)}
.uex-list li:last-child{border-bottom:0}
.uex-list b{font-size:15.5px;font-weight:600}
.uex-link{display:grid;gap:4px;min-height:44px}
.uex-link:hover b{color:var(--teal)}
.uex-foot{padding-top:8px}
@media(prefers-reduced-motion:reduce){.uex-panel{animation:none}}

/* ---- learning paths ---- */
.paths{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:44px}
@media(max-width:860px){.paths{grid-template-columns:minmax(0,1fr)}}
.path{border:1px solid var(--line);border-radius:18px;background:var(--surface);padding:26px;height:100%}
.path-head{display:flex;gap:16px;align-items:baseline;padding-bottom:20px;border-bottom:1px solid var(--line)}
.path-step{font-family:var(--mono);font-size:12px;color:var(--faint);letter-spacing:.12em}
.path-head b{display:block;font-family:var(--serif);font-size:20px;font-weight:600}
.path-head .small{display:block;margin-top:5px}
.path-list{list-style:none;margin:6px 0 0;padding:0;counter-reset:p}
.path-list li{border-bottom:1px solid var(--line)}
.path-list li:last-child{border-bottom:0}
.path-list a{display:flex;align-items:center;min-height:52px;font-size:15.5px;gap:12px}
.path-list a::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--teal);flex:none}
.path-list a:hover{color:var(--teal)}

/* ---- signature ---- */
.sig{margin-top:26px;font-size:13px;color:var(--muted)}
.sig b{font-weight:600;color:var(--text);white-space:nowrap}
.sig a{color:var(--teal)}

/* compact section jump on small screens */
.toc-m{display:none}
@media(max-width:900px){
  .toc-m{display:flex;gap:8px;overflow-x:auto;position:sticky;top:60px;z-index:20;
    padding:12px 0;margin:0 -20px 8px;padding-inline:20px;background:var(--bg);
    border-bottom:1px solid var(--line);scrollbar-width:none}
  .toc-m::-webkit-scrollbar{display:none}
  .toc-m a{flex:0 0 auto;min-height:36px;display:inline-flex;align-items:center;
    padding:0 14px;border:1px solid var(--line);border-radius:999px;
    font-size:13px;color:var(--muted);background:var(--surface)}
  .toc-m a:active{border-color:var(--teal);color:var(--teal)}
}
/* ---- scene jump bar ---- */
.scene-nav{border-bottom:1px solid var(--line);background:var(--bg);position:sticky;top:60px;z-index:40}
.scene-nav-in{display:flex;gap:26px;overflow-x:auto;scrollbar-width:none;padding-block:0}
.scene-nav-in::-webkit-scrollbar{display:none}
.scene-nav a{flex:0 0 auto;min-height:56px;display:inline-flex;align-items:center;
  font-size:14px;color:var(--muted);border-bottom:2px solid transparent;transition:.2s}
.scene-nav a:hover{color:var(--text);border-color:var(--teal)}
@media(max-width:620px){.scene-nav-in{gap:20px}.scene-nav a{font-size:13.5px;min-height:50px}}

/* ---- scene heads ---- */
.scene-mark{display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;
  border-radius:16px;background:var(--teal-soft);color:var(--teal)}
.h-scene{max-width:18ch}
section[id]{scroll-margin-top:120px}

/* ---- everything index ---- */
.index{margin-top:44px}
.index-filters{display:flex;gap:10px;overflow-x:auto;padding-bottom:18px;
  margin-bottom:8px;scrollbar-width:none}
.index-filters::-webkit-scrollbar{display:none}
.index-filters .tab{flex:0 0 auto;gap:8px}
.tab-n{font-family:var(--mono);font-size:11px;opacity:.7}
.index-list{list-style:none;margin:0;padding:0;
  display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 44px}
@media(max-width:760px){.index-list{grid-template-columns:minmax(0,1fr);gap:0}}
.index-list li{border-bottom:1px solid var(--line)}
.index-list a{display:flex;align-items:center;justify-content:space-between;gap:18px;
  min-height:62px;padding:12px 0;transition:padding .25s}
.index-list a:hover{padding-inline:8px;color:var(--teal)}
.index-title{font-size:15.5px;min-width:0}
.index-type{font-family:var(--mono);font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;
  color:var(--faint);flex:none}

/* ---- symbol interaction states: one behaviour for the whole family ---- */
.brand-mark{display:inline-flex;color:var(--teal);flex:none}
.brand-mark .sym{transition:transform .5s cubic-bezier(.2,.7,.3,1)}
.brand:hover .brand-mark .sym{transform:rotate(45deg)}
.searchbtn .sym{color:var(--faint);transition:color .2s}
.searchbtn:hover .sym{color:var(--teal)}
.card.link .sym,.uex-chip .sym,.term-node .sym{transition:transform .3s cubic-bezier(.2,.7,.3,1)}
.card.link:hover .card-mark .sym{transform:scale(1.06)}
.scene-mark .sym,.card-mark .sym{color:currentColor}
[aria-selected="true"] .sym,[aria-current="page"] .sym{color:inherit}
button[disabled] .sym{opacity:.4}
@media(prefers-reduced-motion:reduce){
  .brand:hover .brand-mark .sym,.card.link:hover .card-mark .sym{transform:none}
}

/* ---- landing: the universe is the page ---- */
.land{padding:74px 0 40px}
.land-in{text-align:center;max-width:820px;margin-inline:auto}
.land-h{font-size:clamp(34px,6.4vw,68px);letter-spacing:-.03em;margin-top:22px;line-height:1.08}
.land-sub{margin:22px auto 0;max-width:52ch;color:var(--muted);font-size:clamp(15.5px,2vw,18px)}
@media(max-width:620px){.land{padding:52px 0 24px}}

.uni{margin-top:44px;position:relative}
.uni-svg{display:block;width:100%;height:auto;overflow:visible}
.uni-orbit{fill:none;stroke:var(--line);stroke-width:1;transition:opacity .6s ease}
.uni-link{stroke:var(--teal);stroke-width:1.2;transition:opacity .5s ease}
.uni-hit{cursor:pointer}
.uni-hit:focus{outline:none}
.uni-hit:focus-visible .uni-dom-bg,.uni-hit:focus-visible .uni-pill,.uni-hit:focus-visible .uni-node-box{stroke:var(--teal);stroke-width:2}

.uni-dom{transition:transform .75s cubic-bezier(.22,.7,.24,1),opacity .5s ease}
.uni-dom-bg{fill:var(--surface);stroke:var(--line);stroke-width:1;transition:.3s}
.uni-dom-sym{color:var(--teal);transition:color .3s}
.uni-dom-t{fill:var(--muted);font-size:14px;font-family:var(--sans);transition:.3s}
.uni-dom:hover .uni-dom-bg{stroke:var(--teal)}
.uni-dom:hover .uni-dom-t{fill:var(--text)}
.uni-dom.on .uni-dom-bg{fill:var(--teal);stroke:var(--teal)}
.uni-dom.on .uni-dom-sym{color:#fff}
.uni-dom.on .uni-dom-t{fill:var(--text);font-weight:600}
.uni-dom.dim{opacity:.28}
.uni-dom.dim:hover{opacity:.6}

.uni-core{cursor:pointer}
.uni-core-bg{fill:var(--surface);stroke:var(--line)}
.uni-core g{color:var(--teal)}
.uni-core-t{fill:var(--faint);font-size:12px;font-family:var(--mono);letter-spacing:.16em;text-transform:uppercase}
.uni-core:hover .uni-core-bg{stroke:var(--teal)}

.uni-cat,.uni-concept{animation:nodeIn .5s cubic-bezier(.2,.7,.3,1) both}
@keyframes nodeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.uni-pill{fill:var(--surface);stroke:var(--line);transition:.25s}
.uni-pill-t{fill:var(--muted);font-size:14px;font-family:var(--sans);transition:.25s}
.uni-cat:hover .uni-pill{stroke:var(--teal)}
.uni-cat:hover .uni-pill-t{fill:var(--text)}
.uni-cat.on .uni-pill{fill:var(--teal-soft);stroke:var(--teal)}
.uni-cat.on .uni-pill-t{fill:var(--teal);font-weight:600}
.uni-node-box{fill:var(--surface);stroke:var(--teal);stroke-opacity:.5;transition:.25s}
.uni-node-t{fill:var(--text);font-size:14px;font-family:var(--sans)}
.uni-concept:hover .uni-node-box{fill:var(--teal-soft);stroke-opacity:1}
.uni-empty{fill:var(--faint);font-size:13px;font-family:var(--sans)}
.uni-hint{text-align:center;margin-top:26px;font-family:var(--mono);font-size:11.5px;
  letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}

/* small screens: the same depths, as a drill-down */
.unil{margin-top:34px;border-top:1px solid var(--line)}
.unil-list{list-style:none;margin:0;padding:0}
.unil-list li{border-bottom:1px solid var(--line)}
.unil-list button,.unil-list a{display:flex;align-items:center;gap:14px;width:100%;
  min-height:62px;text-align:left;padding:10px 4px}
.unil-mark{color:var(--teal);display:inline-flex;flex:none}
.unil-name{flex:1;font-size:16px;min-width:0}
.unil-go{color:var(--faint);flex:none}
.unil-list button:active,.unil-list a:active{color:var(--teal)}
.unil-back{min-height:52px;font-family:var(--mono);font-size:11.5px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--faint)}
.unil-h{font-size:22px;margin:6px 0 14px}
.unil-empty{padding:20px 4px;color:var(--faint);font-size:14px}

/* closing statement */
.land-end{padding:120px 0 130px;border-top:1px solid var(--line);text-align:center}
.land-end-t{font-family:var(--serif);font-size:clamp(26px,4.4vw,40px);font-weight:600;
  letter-spacing:-.02em;line-height:1.15}
.land-end .cta-row{justify-content:center}
@media(max-width:620px){.land-end{padding:84px 0 90px}}

@media(prefers-reduced-motion:reduce){
  .uni-cat,.uni-concept{animation:none}
  .uni-dom{transition:none}
}

/* calculation lines read as arithmetic: ink, weighted, spaced */
.calc{font-size:16.5px;color:var(--text);font-weight:600;letter-spacing:-.005em}
.formula::-webkit-scrollbar{height:7px}
.formula::-webkit-scrollbar-thumb{background:var(--line);border-radius:4px}
/* the label above a formula, so it is never an unexplained string */
.block .eyebrow{font-size:11.5px;color:var(--muted);font-weight:600}

/* ---- image system ---- */
.fig{margin:0;display:block}
.fig-frame{position:relative;width:100%;overflow:hidden;border-radius:16px;
  background:linear-gradient(110deg,var(--surface-2) 20%,#E6EEF0 40%,var(--surface-2) 60%);
  background-size:220% 100%;animation:shimmer 2.4s ease-in-out infinite;
  border:1px solid var(--line)}
@keyframes shimmer{0%{background-position:140% 0}100%{background-position:-40% 0}}
.fig-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;
  opacity:0;transform:scale(1.05);
  transition:opacity 1s cubic-bezier(.2,.7,.3,1),transform 1.3s cubic-bezier(.2,.7,.3,1)}
.fig-img.in{opacity:1;transform:scale(1)}
.fig:has(.fig-img.in) .fig-frame{animation:none;background:var(--surface-2)}
.fig-cap{margin-top:14px;font-size:14px;color:var(--muted);line-height:1.55;max-width:60ch}

/* ---- landing backdrop ---- */
.land{position:relative;overflow:hidden}
.land-bg{position:absolute;top:-6%;left:50%;transform:translateX(-50%);
  width:min(1180px,124%);opacity:.5;pointer-events:none;z-index:0}
.land-bg .fig-frame{border:0;background:none;animation:none;border-radius:0}
.land-bg::after{content:"";position:absolute;inset:0;
  background:radial-gradient(58% 58% at 50% 42%,transparent 30%,var(--bg) 82%)}
.land-in,.land .uni{position:relative;z-index:1}
@media(max-width:700px){.land-bg{opacity:.34;width:150%}}

/* ---- section banner with parallax ---- */
.banner{position:relative;overflow:hidden;margin-bottom:8px;isolation:isolate}
.banner-img{position:absolute;inset:-8% 0;z-index:0;will-change:transform}
.banner-img .fig-frame{height:100%;border:0;border-radius:0;background:var(--surface-2)}
.banner-veil{position:absolute;inset:0;z-index:1;
  background:linear-gradient(90deg,var(--bg) 8%,rgba(245,247,250,.86) 46%,rgba(245,247,250,.55) 100%)}
.banner-in{position:relative;z-index:2;padding:76px 20px 82px}
@media(max-width:700px){
  .banner-veil{background:linear-gradient(180deg,rgba(245,247,250,.72),var(--bg) 78%)}
  .banner-in{padding:54px 20px 58px}
}

/* ---- glossary: built for reading ---- */
.gloss{display:grid;gap:0;margin-top:16px;border-top:1px solid var(--line)}
.gloss-item{display:grid;grid-template-columns:minmax(0,260px) minmax(0,1fr);gap:36px;
  padding:30px 0;border-bottom:1px solid var(--line);align-items:start}
@media(max-width:820px){.gloss-item{grid-template-columns:minmax(0,1fr);gap:14px;padding:26px 0}}
.gloss-term{font-family:var(--serif);font-size:24px;font-weight:600;letter-spacing:-.02em;
  color:var(--text);line-height:1.2}
.gloss-def{font-size:17.5px;line-height:1.68;color:var(--text);max-width:62ch}
.gloss-simple{margin-top:12px;font-size:16px;line-height:1.6;color:var(--muted);max-width:60ch}
.gloss-f{margin-top:16px;font-family:var(--mono);font-size:15.5px;font-weight:600;
  color:var(--text);background:var(--surface);border:1px solid var(--line);
  border-left:3px solid var(--amber);border-radius:10px;padding:12px 16px;
  overflow-x:auto;white-space:nowrap;display:inline-block;max-width:100%}
.gloss-link{margin-top:18px;display:inline-flex;align-items:center;min-height:40px;
  font-size:15px;color:var(--teal);font-weight:600}
.gloss-link:hover{text-decoration:underline;text-underline-offset:3px}

/* ---- concept simulators ---- */
.sim{border:1px solid var(--line);border-radius:18px;background:var(--surface);
  padding:26px;box-shadow:var(--shadow)}
@media(max-width:620px){.sim{padding:18px}}
.sim-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px;margin-bottom:26px}
.sim-controls.three{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:680px){.sim-controls,.sim-controls.three{grid-template-columns:minmax(0,1fr);gap:20px}}
.sl-top{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:10px}
.sl-top label{font-size:14.5px;color:var(--muted)}
.sl-top b{font-family:var(--mono);font-size:17px;font-weight:700;color:var(--text)}
.sl input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:4px;
  border-radius:3px;background:var(--line);outline:none;margin:0}
.sl input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;
  border-radius:50%;background:var(--teal);cursor:grab;border:3px solid var(--surface);
  box-shadow:0 1px 6px rgba(11,18,32,.28);transition:transform .18s}
.sl input[type=range]::-webkit-slider-thumb:active{transform:scale(1.15);cursor:grabbing}
.sl input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;
  background:var(--teal);border:3px solid var(--surface);cursor:grab}
.sl input[type=range]:focus-visible{outline:2px solid var(--teal);outline-offset:6px}

.sim-svg{display:block;width:100%;height:auto;overflow:visible}
.sim-axis{stroke:var(--line);stroke-width:1}
.sim-axis.dash{stroke-dasharray:4 4}
.sim-line{fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;
  transition:d .25s linear}
.sim-line.comp{stroke:var(--teal)}
.sim-line.simple{stroke:var(--faint);stroke-width:2;stroke-dasharray:5 5}
.sim-dot{transition:cx .2s ease,cy .2s ease}
.sim-dot.comp{fill:var(--teal)}
.sim-dot.simple{fill:var(--faint)}
.sim-lab{fill:var(--faint);font-size:11px;font-family:var(--mono)}

.sim-out{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:24px;
  padding-top:22px;border-top:1px solid var(--line)}
@media(max-width:620px){.sim-out{grid-template-columns:minmax(0,1fr);gap:14px}}
.sim-out div{display:grid;gap:6px;min-width:0}
.sim-out span{font-size:13.5px;color:var(--muted)}
.sim-out b{font-family:var(--mono);font-size:clamp(18px,3.6vw,23px);font-weight:700;
  color:var(--text);letter-spacing:-.02em}
.sim-out b.hi{color:var(--teal)}
.sim-out b.bad{color:var(--rose)}
.sim-note{margin-top:20px;font-size:15px;line-height:1.6;color:var(--muted);max-width:64ch}

/* leverage: the balance sheet as two columns that actually move */
.bs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px;
  max-width:440px;margin:6px auto 4px}
.bs-h{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--faint);text-align:center;margin-bottom:12px}
.bs-bar{position:relative;height:220px;border:1px solid var(--line);border-radius:10px;
  overflow:hidden;background:var(--surface-2);display:flex;flex-direction:column;justify-content:flex-end}
.bs-fill{width:100%;transition:height .55s cubic-bezier(.3,.8,.3,1);
  display:flex;align-items:center;justify-content:center;overflow:hidden}
.bs-fill span{font-size:12.5px;font-weight:600;color:#fff;white-space:nowrap}
.bs-fill.assets{background:var(--teal)}
.bs-fill.debt{background:#5A6780}
.bs-fill.equity{background:var(--amber)}
.bs-lost{position:absolute;top:0;left:0;right:0;background:repeating-linear-gradient(
  -45deg,rgba(168,50,63,.18) 0 6px,rgba(168,50,63,.06) 6px 12px);
  transition:height .55s cubic-bezier(.3,.8,.3,1);border-bottom:1px dashed var(--rose)}
.bs-v{margin-top:12px;text-align:center;font-family:var(--mono);font-size:14px;
  font-weight:600;color:var(--text)}
@media(prefers-reduced-motion:reduce){
  .bs-fill,.bs-lost,.sim-dot,.sim-line{transition:none}
}

/* ---- reading progress ---- */
.readbar{position:fixed;top:0;left:0;right:0;height:3px;z-index:80;pointer-events:none}
.readbar-fill{height:100%;width:100%;transform-origin:0 50%;transform:scaleX(0);
  background:linear-gradient(90deg,var(--teal),var(--amber));
  transition:transform .12s linear}

/* ---- learning progress ---- */
.prog{display:flex;align-items:center;gap:20px;margin-top:30px;padding:22px 24px;
  border:1px solid var(--line);border-radius:16px;background:var(--surface);box-shadow:var(--shadow)}
.prog-ring{width:64px;height:64px;flex:none}
.prog-track{fill:none;stroke:var(--line);stroke-width:5}
.prog-arc{fill:none;stroke:var(--teal);stroke-width:5;stroke-linecap:round;
  transition:stroke-dashoffset .8s cubic-bezier(.2,.7,.3,1)}
.prog-num{fill:var(--text);font-size:19px;font-weight:700;font-family:var(--mono)}
.prog-h{font-size:17px;font-weight:600;color:var(--text)}
.prog-link{color:var(--teal);font-weight:600}
.prog-link:hover{text-decoration:underline;text-underline-offset:3px}
@media(max-width:560px){.prog{gap:16px;padding:18px}}

.seen-tick{margin-left:auto;width:22px;height:22px;border-radius:50%;background:var(--teal-soft);
  color:var(--teal);font-size:12px;font-weight:700;display:inline-flex;align-items:center;
  justify-content:center;flex:none}
.card.opened{border-color:color-mix(in srgb,var(--teal) 32%,var(--line))}

/* ---- references ---- */
.refs{list-style:none;margin:0;padding:0;display:grid;gap:0}
.refs li{display:grid;grid-template-columns:34px minmax(0,1fr);gap:14px;
  padding:16px 0;border-bottom:1px solid var(--line);align-items:start}
.refs li:last-child{border-bottom:0}
.refs-n{font-family:var(--mono);font-size:12px;color:var(--faint);font-weight:600;padding-top:3px}
.refs b{display:block;font-size:16.5px;font-weight:600;color:var(--text);line-height:1.45}
.refs-link{display:inline-flex;align-items:center;min-height:38px;margin-top:4px;
  font-size:14.5px;color:var(--teal);font-weight:600}
.refs-link:hover{text-decoration:underline;text-underline-offset:3px}
@media(prefers-reduced-motion:reduce){.readbar-fill,.prog-arc{transition:none}}

/* ---- domain progress ---- */
.dstat{margin-top:26px;max-width:420px}
.dstat-bar{height:6px;border-radius:3px;background:var(--line);overflow:hidden;margin-bottom:10px}
.dstat-fill{height:100%;background:var(--teal);border-radius:3px;
  transition:width 1s cubic-bezier(.2,.7,.3,1)}
.dstat b{color:var(--text);font-weight:700}

/* ---- category and concept slots ---- */
.cat{padding-bottom:34px;margin-bottom:34px;border-bottom:1px solid var(--line)}
.cat:last-child{border-bottom:0}
.cat-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:18px}
.cat-head h2{font-size:22px}
.cat-count{font-family:var(--mono);font-size:12.5px;color:var(--faint);font-weight:600;flex:none}
.slots{list-style:none;margin:0;padding:0;display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));gap:0 32px}
@media(max-width:760px){.slots{grid-template-columns:minmax(0,1fr)}}
.slot{display:flex;align-items:center;gap:12px;min-height:54px;padding:8px 0;
  border-bottom:1px solid var(--line)}
.slot-dot{width:7px;height:7px;border-radius:50%;background:var(--teal);flex:none}
.slot-dot.planned{background:var(--line);border:1px solid var(--faint);width:6px;height:6px}
.slot-name{flex:1;font-size:16px;color:var(--text);min-width:0}
.slot .slot-name{color:var(--faint)}
.slot.live .slot-name{color:var(--text);font-weight:500}
.slot-meta{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--teal);flex:none}
.slot-meta.planned{color:var(--faint)}
.slot-go{color:var(--faint);flex:none;transition:transform .25s}
.slot.live:hover{border-color:var(--teal)}
.slot.live:hover .slot-name{color:var(--teal)}
.slot.live:hover .slot-go{transform:translateX(4px)}

/* ---- universe: planned slots read as structure, not as links ---- */
.uni-pill-n{fill:var(--faint);font-size:11px;font-family:var(--mono)}
.uni-cat.on .uni-pill-n{fill:var(--teal)}
.uni-node-box.planned{fill:none;stroke:var(--line);stroke-dasharray:4 4}
.uni-node-t.planned{fill:var(--faint)}
.unil-tag{font-family:var(--mono);font-size:11px;color:var(--faint);flex:none;letter-spacing:.08em}
.unil-planned{display:flex;align-items:center;gap:14px;min-height:58px;padding:10px 4px;opacity:.62}
.unil-planned .unil-name{color:var(--faint)}

/* ---- origins of finance ---- */
.org-key{display:flex;flex-wrap:wrap;gap:22px;margin-top:26px}
.org-key span{display:inline-flex;align-items:center;gap:9px;font-size:14px;color:var(--muted)}
.org-key i{width:12px;height:12px;border-radius:3px;flex:none}
.k-india{background:var(--amber)}
.k-world{background:var(--teal)}
.org{border-bottom:1px solid var(--line)}
.org-head{display:flex;align-items:center;gap:20px;width:100%;text-align:left;
  min-height:82px;padding:14px 0;transition:padding .25s}
.org-head:hover{padding-inline:6px}
.org-n{font-family:var(--mono);font-size:12px;color:var(--faint);font-weight:600;flex:none}
.org-t{flex:1;font-family:var(--serif);font-size:clamp(19px,3vw,25px);font-weight:600;
  color:var(--text);letter-spacing:-.02em;min-width:0}
.org-x{font-size:24px;color:var(--faint);flex:none;font-weight:300}
.org.on .org-x{color:var(--teal)}
.org-body{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;
  padding-bottom:34px;animation:fadeUp .45s ease both}
@media(max-width:840px){.org-body{grid-template-columns:minmax(0,1fr);gap:26px}}
.org-col{padding:24px 28px;border-radius:14px;min-width:0}
.org-col h3{font-size:19px;line-height:1.3}
.org-col.india{background:var(--amber-soft);border-left:3px solid var(--amber);margin-right:14px}
.org-col.world{background:var(--teal-soft);border-left:3px solid var(--teal);margin-left:14px}
@media(max-width:840px){.org-col.india,.org-col.world{margin:0}}
.org-tag{font-family:var(--mono);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;
  color:var(--muted);margin-bottom:10px}
.org-close{margin-top:56px;padding:34px;border:1px solid var(--line);border-radius:18px;
  background:var(--surface);box-shadow:var(--shadow)}
@media(prefers-reduced-motion:reduce){.org-body{animation:none}}

/* ---- mechanism visuals ---- */
.mv{margin:0}
.mv-frame{border:1px solid var(--line);border-radius:16px;background:var(--surface);
  padding:26px 22px;box-shadow:var(--shadow);overflow:hidden}
@media(max-width:560px){.mv-frame{padding:18px 12px}}
.mv-lab{fill:var(--muted);font-size:12.5px;font-family:var(--sans)}
.mv-note{fill:var(--faint);font-size:12.5px;font-family:var(--sans)}
.mv-in{fill:#fff;font-size:12.5px;font-family:var(--sans);font-weight:600}
.mv-box{fill:var(--surface-2);stroke:var(--line)}
.mv-box.dashed{fill:none;stroke:var(--rose);stroke-dasharray:5 5;stroke-opacity:.7}
.mv-fill{transition:transform 1.1s cubic-bezier(.3,.8,.3,1)}
.mv-fill.teal{fill:var(--teal)}
.mv-fill.amber{fill:var(--amber)}
.mv-fill.rose{fill:var(--rose)}
.mv-fill.grey{fill:#5A6780}
.mv-fill.amber.shrink{transform:scaleY(.34);transform-origin:inherit}
.mv-fill.grow{animation:growUp 1s cubic-bezier(.3,.8,.3,1) both}
@keyframes growUp{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.mv-loss{fill:var(--rose);opacity:0;transition:opacity .9s ease .5s}
.mv-loss.in{opacity:.22}
.mv-tick{fill:var(--line);opacity:0}
.mv-tick.in{animation:popIn .5s ease both;fill:var(--teal)}
@keyframes popIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.mv-line{stroke:var(--teal);stroke-width:1;opacity:0}
.mv-line.in{animation:fadeLine .6s ease both}
@keyframes fadeLine{from{opacity:0}to{opacity:.4}}
.mv-orbit{fill:none;stroke:var(--line)}
.mv-path{fill:none;stroke:var(--rose);stroke-width:2;stroke-dasharray:600;stroke-dashoffset:600}
.mv-path.in{animation:drawPath 1.6s cubic-bezier(.3,.7,.3,1) both}
@keyframes drawPath{to{stroke-dashoffset:0}}
.mv-dot.teal{fill:var(--teal)}
.mv-dot.rose{fill:var(--rose)}
.mv-dot.amber{fill:var(--amber)}
.mv-travel{fill:var(--amber)}
@media(prefers-reduced-motion:reduce){
  .mv-fill,.mv-loss,.mv-tick,.mv-line,.mv-path{animation:none!important;transition:none!important;
    opacity:1;stroke-dashoffset:0}
  .mv-travel{display:none}
}

/* ---- history eras ---- */
.era{border-bottom:1px solid var(--line)}
.era-head{display:flex;align-items:center;gap:16px;width:100%;text-align:left;
  min-height:86px;padding:16px 0;transition:padding .25s}
.era-head:hover{padding-inline:6px}
.era-rail{width:14px;display:flex;justify-content:center;flex:none}
.era-dot{width:11px;height:11px;border-radius:50%;background:var(--line);
  border:2px solid var(--bg);box-shadow:0 0 0 2px var(--line);transition:.3s}
.era.on .era-dot{background:var(--teal);box-shadow:0 0 0 4px var(--teal-soft)}
.era-main{flex:1;display:grid;gap:5px;min-width:0}
.era-years{font-family:var(--mono);font-size:11.5px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--faint)}
.era-title{font-family:var(--serif);font-size:clamp(19px,3vw,25px);font-weight:600;
  letter-spacing:-.02em;color:var(--text)}
.era-badge{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--teal);border:1px solid var(--teal);background:var(--teal-soft);
  padding:4px 9px;border-radius:999px;flex:none}
.era-x{font-size:24px;color:var(--faint);font-weight:300;flex:none}
.era.on .era-x{color:var(--teal)}
.era-body{padding:6px 0 38px 30px;animation:fadeUp .45s ease both}
@media(max-width:620px){.era-body{padding-left:0}}
.era-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
@media(max-width:840px){.era-cols{grid-template-columns:minmax(0,1fr)}}
.era-col{padding:22px 24px;border-radius:14px;min-width:0}
.era-col.india{background:var(--amber-soft);border-left:3px solid var(--amber)}
.era-col.world{background:var(--teal-soft);border-left:3px solid var(--teal)}
.era-point{margin-top:24px;font-family:var(--serif);font-size:19px;font-weight:600;
  line-height:1.45;color:var(--text);max-width:60ch}
.era-art{margin-top:30px}

/* ---- settlement artifact ---- */
.art-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
.settle{margin:8px 0 26px}
.settle-row{display:flex;justify-content:space-between;margin-bottom:10px}
.settle-tag{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--faint)}
.settle-track{position:relative;height:44px;background:var(--surface-2);
  border:1px solid var(--line);border-radius:10px}
.settle-gap{position:absolute;top:0;bottom:0;left:0;border-radius:9px 0 0 9px;
  background:repeating-linear-gradient(-45deg,rgba(168,50,63,.16) 0 7px,rgba(168,50,63,.05) 7px 14px);
  display:flex;align-items:center;justify-content:center;
  transition:width .7s cubic-bezier(.3,.8,.3,1)}
.settle-gap span{font-size:12.5px;color:var(--rose);font-weight:600;white-space:nowrap}
.settle-dot{position:absolute;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;
  border-radius:50%;background:var(--teal);transition:left .7s cubic-bezier(.3,.8,.3,1)}
.settle-dot.start{left:0}
.settle-dot.end{background:var(--amber)}

/* ---- order book artifact ---- */
.book{list-style:none;margin:0 0 22px;padding:0;display:grid;gap:8px}
.book-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;
  background:var(--surface-2);border:1px solid var(--line);position:relative;
  transition:border-color .35s,background .35s}
.book-row.win{border-color:var(--teal);background:var(--teal-soft)}
.book-who{font-size:14px;color:var(--muted);width:78px;flex:none}
.book-bar{height:8px;border-radius:4px;background:var(--teal);opacity:.35;
  transition:width .5s ease;min-width:20px}
.book-row.win .book-bar{opacity:.8}
.book-price{font-family:var(--mono);font-size:15px;font-weight:700;color:var(--text);
  margin-left:auto;flex:none}
.book-tag{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--teal);flex:none}

/* ---- cost artifact ---- */
.costs{display:grid;gap:20px}
.cost-head{display:flex;justify-content:space-between;gap:14px;align-items:baseline;margin-bottom:8px}
.cost-head span{font-size:15px;color:var(--text)}
.cost-head b{font-family:var(--mono);font-size:17px;font-weight:700}
.cost-head b.hi{color:var(--teal)}
.cost-head b.bad{color:var(--rose)}
.cost-bar{height:8px;background:var(--surface-2);border-radius:4px;overflow:hidden}
.cost-bar span{display:block;height:100%;background:var(--muted);border-radius:4px;
  transition:width .6s cubic-bezier(.3,.8,.3,1)}
.cost-bar span.hi{background:var(--teal)}
.cost-bar span.bad{background:var(--rose)}

/* ---- options payoff ---- */
.pay-zone.up{fill:var(--teal);opacity:.05}
.pay-zone.down{fill:var(--rose);opacity:.05}
.pay-line{fill:none;stroke:var(--teal);stroke-width:2.6;stroke-linejoin:round;stroke-linecap:round}
.pay-be{stroke:var(--amber);stroke-width:1.5;stroke-dasharray:4 4}
.pay-be-t{fill:var(--amber);font-size:11px;font-family:var(--mono)}

/* ---- diversification ---- */
.div-line{fill:none;stroke-width:2;stroke-linejoin:round}
.div-line.a{stroke:var(--muted);opacity:.75}
.div-line.b{stroke:var(--amber);opacity:.75}
.div-line.p{stroke:var(--teal);stroke-width:2.8}

/* ---- market data ---- */
.md-head{display:flex;flex-wrap:wrap;gap:18px;justify-content:space-between;align-items:flex-start}
.md-stamp{display:flex;flex-wrap:wrap;gap:8px}
.bchart{display:grid;gap:4px;margin-top:8px}
.brow{display:grid;grid-template-columns:34px 150px minmax(0,1fr) 106px 92px;gap:14px;
  align-items:center;padding:14px 10px;border-radius:10px;transition:background .25s}
.brow:hover,.brow.on{background:var(--surface-2)}
.brow.others{opacity:.62}
.brank{font-family:var(--mono);font-size:11.5px;color:var(--faint);font-weight:600}
.bname{font-size:15.5px;font-weight:600;color:var(--text);min-width:0;display:grid;gap:3px}
.bname em{font-style:normal;font-size:11.5px;font-weight:400;color:var(--faint)}
.btrack{height:12px;background:var(--surface-2);border-radius:6px;overflow:hidden}
.bfill{display:block;height:100%;background:var(--teal);border-radius:6px;
  transition:width 1.1s cubic-bezier(.25,.8,.3,1)}
.bfill.muted{background:var(--faint);opacity:.45}
.bval{font-family:var(--mono);font-size:15px;font-weight:700;color:var(--text);
  text-align:right;display:grid;gap:2px}
.bval em{font-style:normal;font-size:11.5px;font-weight:500;color:var(--teal)}
.bchg{font-family:var(--mono);font-size:12.5px;text-align:right;font-weight:600}
.bchg.up{color:var(--teal)}
.bchg.down{color:var(--rose)}
@media(max-width:820px){
  .brow{grid-template-columns:28px minmax(0,1fr) 96px;gap:10px;row-gap:8px}
  .btrack{grid-column:1 / -1;order:3}
  .bchg{grid-column:1 / -1;order:4;text-align:left;padding-left:38px}
}
.md-head code{font-family:var(--mono);font-size:13px;background:var(--surface-2);
  padding:2px 6px;border-radius:5px}

/* ---- taxation ---- */
.tax-stamp{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.tax-warn{margin-top:24px;padding:22px 24px;border-radius:14px;background:var(--amber-soft);
  border-left:3px solid var(--amber)}
.tsec{border-bottom:1px solid var(--line)}
.tsec-head{display:flex;align-items:center;gap:18px;width:100%;text-align:left;
  min-height:74px;padding:14px 0;transition:padding .25s}
.tsec-head:hover{padding-inline:6px}
.tsec-n{font-family:var(--mono);font-size:12px;color:var(--faint);font-weight:600;flex:none}
.tsec-t{flex:1;font-family:var(--serif);font-size:clamp(18px,2.7vw,23px);font-weight:600;
  letter-spacing:-.02em;color:var(--text);min-width:0}
.tsec.on .org-x{color:var(--teal)}
.tsec-body{padding:4px 0 36px 30px;animation:fadeUp .45s ease both}
@media(max-width:620px){.tsec-body{padding-left:0}}
.ttable-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;
  background:var(--surface);-webkit-overflow-scrolling:touch}
.ttable{width:100%;border-collapse:collapse;min-width:520px}
.ttable th{text-align:left;font-family:var(--mono);font-size:10.5px;letter-spacing:.13em;
  text-transform:uppercase;color:var(--muted);font-weight:600;padding:14px 16px;
  border-bottom:1px solid var(--line);background:var(--surface-2);white-space:nowrap}
.ttable td{padding:15px 16px;font-size:15px;color:var(--text);
  border-bottom:1px solid var(--line);vertical-align:top;line-height:1.55}
.ttable tr:last-child td{border-bottom:0}
.ttable td.first,.ttable th.first{font-weight:600}
.ttable tbody tr:hover td{background:var(--surface-2)}
.tax-eg{margin-top:26px;padding:22px 24px;border:1px solid var(--line);border-radius:14px;
  background:var(--surface)}
@media(prefers-reduced-motion:reduce){.tsec-body{animation:none}}

/* ---- trading floor: ambience ---- */
.floor,.floor-gate{position:relative;overflow:hidden;padding-bottom:100px}
.floor-gate{min-height:78vh;display:flex;align-items:center}
.floor-amb{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0}
.amb-graph{position:absolute;left:0;right:0;bottom:0;width:100%;height:52%;opacity:.13}
.amb-bar{fill:var(--teal);transform-origin:bottom;animation:ambRise ease-in-out infinite alternate}
@keyframes ambRise{from{transform:scaleY(.35)}to{transform:scaleY(1)}}
.amb-line{fill:none;stroke:var(--amber);stroke-width:2;opacity:.5;
  stroke-dasharray:1400;stroke-dashoffset:1400;animation:ambDraw 9s ease-in-out infinite}
@keyframes ambDraw{0%{stroke-dashoffset:1400}55%{stroke-dashoffset:0}100%{stroke-dashoffset:0;opacity:0}}
.amb-coins{position:absolute;inset:0}
.amb-coin{position:absolute;bottom:-20px;border-radius:50%;background:var(--amber);
  opacity:.22;animation:ambFloat linear infinite}
@keyframes ambFloat{
  0%{transform:translateY(0) scale(.8);opacity:0}
  12%{opacity:.28}
  100%{transform:translateY(-90vh) scale(1.1);opacity:0}}
@media(prefers-reduced-motion:reduce){.floor-amb{display:none}}

/* ---- entry gate ---- */
.gate-in,.floor-in{position:relative;z-index:1}
.gate-warn{margin-top:26px;padding:22px 24px;border-radius:14px;background:var(--amber-soft);
  border-left:3px solid var(--amber)}
.gate-form{margin-top:30px;padding:26px;border:1px solid var(--line);border-radius:18px;
  background:var(--surface);box-shadow:var(--shadow);display:grid;gap:18px;max-width:470px}
.gate-check{display:flex;gap:12px;align-items:flex-start;font-size:15px;color:var(--text);cursor:pointer}
.gate-check input{width:20px;height:20px;flex:none;accent-color:var(--teal);margin-top:2px}
.gate-form .btn.primary:disabled{opacity:.45;cursor:not-allowed;transform:none}

/* ---- phone frame ---- */
.floor-head{display:flex;flex-wrap:wrap;gap:18px;justify-content:space-between;
  align-items:center;padding:34px 0 26px}
.phone{max-width:520px;margin:0 auto;border:1px solid var(--line);border-radius:26px;
  background:var(--surface);overflow:hidden;
  box-shadow:0 3px 8px rgba(11,18,32,.06),0 40px 80px -32px rgba(11,18,32,.34)}
.phone-bar{display:flex;align-items:center;gap:10px;padding:14px 18px;
  border-bottom:1px solid var(--line);background:var(--surface-2)}
.phone-dot{width:9px;height:9px;border-radius:50%;background:var(--teal);flex:none;
  animation:pdot 2.6s ease-in-out infinite}
@keyframes pdot{0%,100%{opacity:1}50%{opacity:.3}}
.phone-title{font-size:14px;font-weight:600;color:var(--text)}
.phone-tag{margin-left:auto;font-family:var(--mono);font-size:10px;letter-spacing:.13em;
  text-transform:uppercase;color:var(--faint);border:1px solid var(--line);
  padding:3px 8px;border-radius:999px}
.phone-tabs{display:flex;border-bottom:1px solid var(--line);overflow-x:auto;scrollbar-width:none}
.phone-tabs::-webkit-scrollbar{display:none}
.ptab{flex:1 0 auto;min-height:50px;padding:0 18px;font-size:14px;color:var(--muted);
  border-bottom:2px solid transparent;transition:.25s;white-space:nowrap}
.ptab.on{color:var(--teal);border-color:var(--teal);font-weight:600;background:var(--teal-soft)}
.phone-body{padding:22px 20px;animation:fadeUp .4s ease both}
@media(max-width:520px){.phone-body{padding:18px 14px}}
.phone-foot{padding:14px 18px;border-top:1px solid var(--line);background:var(--surface-2);
  font-size:12px;color:var(--faint);text-align:center}

/* ---- ticket ---- */
.tk{display:grid;gap:18px}
.tk-toggles{display:flex;flex-wrap:wrap;gap:10px}
.seg{display:flex;background:var(--surface-2);border:1px solid var(--line);
  border-radius:10px;padding:3px;gap:3px}
.seg-b{padding:9px 16px;border-radius:8px;font-size:14px;color:var(--muted);
  min-height:40px;transition:.25s}
.seg-b.on{background:var(--text);color:var(--surface);font-weight:600}
.seg-b.buy.on{background:var(--teal);color:#fff}
.seg-b.sell.on{background:var(--rose);color:#fff}
.tk-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.tk-fields.three{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:480px){.tk-fields.three{grid-template-columns:repeat(2,minmax(0,1fr))}}
.tkf{display:grid;gap:7px}
.tkf.wide{grid-column:1/-1}
.tkf span{font-size:12.5px;color:var(--muted)}
.tkf input{background:var(--bg);border:1px solid var(--line);border-radius:9px;
  padding:12px 13px;font-family:var(--mono);font-size:16px;font-weight:600;
  color:var(--text);width:100%;outline:none;min-height:46px}
.tkf input:focus{border-color:var(--teal)}
.tk-value{display:flex;justify-content:space-between;align-items:baseline;gap:14px;
  padding:16px 18px;border-radius:12px;background:var(--surface-2)}
.tk-value span{font-size:14px;color:var(--muted)}
.tk-value b{font-family:var(--mono);font-size:21px;font-weight:700;color:var(--text)}

/* ---- charges ---- */
.chg{border:1px solid var(--line);border-radius:12px;overflow:hidden}
.chg-row{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;
  padding:13px 16px;border-bottom:1px solid var(--line);
  animation:chgIn .45s cubic-bezier(.2,.7,.3,1) both}
@keyframes chgIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
.chg-row span{font-size:14.5px;color:var(--text);display:grid;gap:3px;min-width:0}
.chg-row em{font-style:normal;font-size:12px;color:var(--faint)}
.chg-row b{font-family:var(--mono);font-size:15px;font-weight:700;white-space:nowrap}
.chg-total,.chg-net{display:flex;justify-content:space-between;gap:14px;padding:15px 16px;
  background:var(--surface-2);border-bottom:1px solid var(--line)}
.chg-net{background:var(--teal-soft);border-bottom:0}
.chg-total span,.chg-net span{font-size:14.5px;font-weight:600;color:var(--text)}
.chg-total b,.chg-net b{font-family:var(--mono);font-size:18px;font-weight:700;color:var(--text)}
.tk-be{padding:20px;border-radius:12px;background:var(--amber-soft);
  border-left:3px solid var(--amber);display:grid;gap:8px}
.tk-be b{font-family:var(--mono);font-size:26px;font-weight:700;color:var(--text)}

/* ---- grids and bars ---- */
.tk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;
  border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--line)}
.tk-grid div{background:var(--surface);padding:14px 16px;display:grid;gap:5px;min-width:0}
.tk-grid span{font-size:12.5px;color:var(--muted)}
.tk-grid b{font-family:var(--mono);font-size:17px;font-weight:700;color:var(--text)}
.tk-grid b.hi{color:var(--teal)}
.tk-grid b.bad{color:var(--rose)}
.marginbar{display:grid;gap:12px}
.mb-track{height:10px;border-radius:5px;background:var(--surface-2);overflow:hidden}
.mb-fill{height:100%;border-radius:5px;transition:width .55s cubic-bezier(.3,.8,.3,1)}
.mb-fill.up{background:var(--teal)}
.mb-fill.down{background:var(--rose)}

/* ---- risk notice ---- */
.risk{padding:16px 18px;border-radius:12px;background:var(--surface-2);
  border-left:3px solid var(--rose)}
.risk-h{font-size:13px;font-weight:700;color:var(--rose);margin-bottom:8px}
.risk-b{font-size:13.5px;line-height:1.6;color:var(--text)}

/* ---- commodities ---- */
.cmd-picker{display:flex;gap:8px;overflow-x:auto;padding-bottom:12px;scrollbar-width:none}
.cmd-picker::-webkit-scrollbar{display:none}
.cmd-picker .tab{flex:0 0 auto}
.cmd-spec{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px;
  border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--line)}
.cmd-spec div{background:var(--surface);padding:13px 14px;display:grid;gap:4px}
.cmd-spec span{font-size:11.5px;color:var(--muted)}
.cmd-spec b{font-size:15px;font-weight:700;color:var(--text)}

/* ---- telemetry ---- */
.tel-tabs{display:flex;gap:8px;overflow-x:auto;padding-bottom:16px;margin-bottom:24px;scrollbar-width:none}
.tel-tabs::-webkit-scrollbar{display:none}
.tel-tabs .tab{flex:0 0 auto}
.tel-list{display:grid;gap:30px}
.tel{border:1px solid var(--line);border-radius:20px;background:var(--surface);
  padding:26px;box-shadow:var(--shadow);overflow:hidden}
@media(max-width:600px){.tel{padding:18px 14px}}
.tel-head{display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;
  align-items:flex-start;margin-bottom:20px}
.tel-name{font-size:22px;letter-spacing:-.02em}
.tel-ctl{display:flex;gap:8px;flex-wrap:wrap}
.tbtn{min-height:38px;padding:0 15px;border:1px solid var(--line);border-radius:999px;
  font-size:13.5px;color:var(--muted);background:var(--surface);transition:.22s}
.tbtn:hover{border-color:var(--teal);color:var(--teal)}
.tbtn.on{background:var(--teal);border-color:var(--teal);color:#fff;font-weight:600}
.tel-readout{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2px;
  border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--line);margin-bottom:20px}
@media(max-width:660px){.tel-readout{grid-template-columns:repeat(2,minmax(0,1fr))}}
.tel-readout div{background:var(--surface);padding:13px 15px;display:grid;gap:4px;min-width:0}
.tel-readout span{font-size:11.5px;color:var(--muted)}
.tel-readout b{font-family:var(--mono);font-size:18px;font-weight:700;color:var(--text)}
.tel-readout b.hi{color:var(--teal)}
.tel-readout b.bad{color:var(--rose)}
.tel-plot{position:relative;border-radius:14px;overflow:hidden;background:
  linear-gradient(180deg,var(--surface-2),var(--surface))}
.tel-svg{display:block;width:100%;height:auto}
.tel-grid{stroke:var(--line);stroke-width:1}
.tel-axis{fill:var(--faint);font-size:11px;font-family:var(--mono)}
.tel-dd{fill:var(--rose);opacity:.07}
.tel-area{opacity:0;transition:opacity 1.4s ease .5s}
.tel-area.in{opacity:1}
.tel-line{fill:none;stroke:var(--teal);stroke-width:2.4;stroke-linejoin:round;stroke-linecap:round}
.tel-line.draw{animation:telDraw 2.4s cubic-bezier(.25,.7,.3,1) forwards}
@keyframes telDraw{to{stroke-dashoffset:0}}
.tel-ev line{stroke:var(--line);stroke-width:1;stroke-dasharray:3 4}
.tel-ev circle{fill:var(--line)}
.tel-ev.on line{stroke:var(--amber);stroke-opacity:.5}
.tel-ev.on circle{fill:var(--amber)}
.tel-head-line{stroke:var(--text);stroke-width:1;stroke-opacity:.28;
  transition:x1 .35s cubic-bezier(.3,.8,.3,1),x2 .35s cubic-bezier(.3,.8,.3,1)}
.tel-dot{fill:var(--teal);stroke:var(--surface);stroke-width:3;
  transition:cx .35s cubic-bezier(.3,.8,.3,1),cy .35s cubic-bezier(.3,.8,.3,1)}
.tel-scrub{display:grid;gap:14px;margin-top:20px}
.tel-scrub label{display:grid;gap:7px}
.tel-scrub input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:4px;
  border-radius:3px;background:var(--line);outline:none}
.tel-scrub input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;
  border-radius:50%;background:var(--teal);border:3px solid var(--surface);cursor:grab;
  box-shadow:0 1px 5px rgba(11,18,32,.26)}
.tel-scrub input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;
  background:var(--teal);border:3px solid var(--surface);cursor:grab}
.tel-zoom{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.tel-note{display:flex;gap:14px;align-items:flex-start;margin-top:20px;padding:15px 18px;
  border-radius:12px;background:var(--amber-soft);border-left:3px solid var(--amber);
  animation:fadeUp .4s ease both;font-size:14.5px;line-height:1.6;color:var(--text)}
.tel-note-y{font-family:var(--mono);font-size:13px;font-weight:700;color:var(--amber);flex:none}
.tel-dd-note{margin-top:14px}
.tel-src{margin-top:16px;padding-top:14px;border-top:1px solid var(--line);font-size:12.5px}
@media(prefers-reduced-motion:reduce){
  .tel-line.draw{animation:none;stroke-dashoffset:0!important}
  .tel-area{opacity:1;transition:none}
  .tel-dot,.tel-head-line,.tel-note{transition:none;animation:none}
}

/* ---- telemetry: annual movement ---- */
.tel-moves{margin-top:24px;padding-top:22px;border-top:1px solid var(--line)}
.mv-rows{display:grid;gap:3px;max-height:300px;overflow-y:auto;padding-right:4px}
.mv-rows::-webkit-scrollbar{width:6px}
.mv-rows::-webkit-scrollbar-thumb{background:var(--line);border-radius:3px}
.mv-r{display:grid;grid-template-columns:52px minmax(0,1fr) 74px;gap:12px;align-items:center;
  padding:5px 6px;border-radius:7px;transition:background .2s}
.mv-r:hover,.mv-r.on{background:var(--surface-2)}
.mv-y{font-family:var(--mono);font-size:12px;color:var(--faint)}
.mv-r.on .mv-y{color:var(--text);font-weight:700}
.mv-track{position:relative;height:14px;background:var(--surface-2);border-radius:4px;overflow:hidden}
.mv-b{position:absolute;top:0;bottom:0;border-radius:3px;
  transition:width .5s cubic-bezier(.3,.8,.3,1)}
.mv-b.up{background:var(--teal)}
.mv-b.down{background:var(--rose)}
.mv-zero{position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--line)}
.mv-v{font-family:var(--mono);font-size:12.5px;font-weight:700;text-align:right;color:var(--faint)}
.mv-v.up{color:var(--teal)}
.mv-v.down{color:var(--rose)}
.mv-extremes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;margin-top:16px;
  border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--line)}
.mv-extremes div{background:var(--surface);padding:12px 14px;display:grid;gap:4px}
.mv-extremes span{font-size:11.5px;color:var(--muted)}
.mv-extremes b{font-family:var(--mono);font-size:15px;font-weight:700}
.mv-extremes b.hi{color:var(--teal)}
.mv-extremes b.bad{color:var(--rose)}
@media(max-width:520px){.mv-r{grid-template-columns:44px minmax(0,1fr) 62px;gap:8px}}
@media(prefers-reduced-motion:reduce){.mv-b{transition:none}}

/* ---- simulator ---- */
.notice-card{margin-top:28px;padding:30px;border:1px solid var(--line);border-radius:18px;
  background:var(--surface);box-shadow:var(--shadow)}
.notice-h{font-family:var(--serif);font-size:24px;font-weight:600;letter-spacing:-.02em}
.notice-sub{font-family:var(--mono);font-size:11px;letter-spacing:.15em;text-transform:uppercase;
  color:var(--teal);margin-top:6px}
.notice-body{margin-top:20px;font-size:16px;line-height:1.7;color:var(--text)}
.notice-body ul{margin:14px 0;padding-left:20px;display:grid;gap:7px}
.notice-body p+p{margin-top:14px}

.sim{padding:0 0 90px}
.sim-top{position:sticky;top:60px;z-index:30;display:flex;flex-wrap:wrap;gap:14px;
  justify-content:space-between;align-items:center;padding:14px 20px;
  background:var(--surface);border-bottom:1px solid var(--line)}
.sim-brand{display:flex;align-items:center;gap:10px;font-size:15px}
.sim-dot{width:8px;height:8px;border-radius:50%;background:var(--teal);animation:pdot 2.4s ease-in-out infinite}
.sim-flag{font-family:var(--mono);font-size:10px;letter-spacing:.13em;text-transform:uppercase;
  color:var(--amber);border:1px solid var(--amber);padding:3px 8px;border-radius:999px}
.sim-top-r{display:flex;flex-wrap:wrap;gap:20px;align-items:center}
.sim-stat{display:grid;gap:2px}
.sim-stat span{font-size:10.5px;font-family:var(--mono);letter-spacing:.12em;
  text-transform:uppercase;color:var(--faint)}
.sim-stat b{font-family:var(--mono);font-size:16px;font-weight:700}
.sim-stat b.hi{color:var(--teal)} .sim-stat b.bad{color:var(--rose)}

.sim-grid{display:grid;grid-template-columns:230px minmax(0,1fr) 300px;gap:1px;
  background:var(--line);border-bottom:1px solid var(--line)}
@media(max-width:1080px){.sim-grid{grid-template-columns:200px minmax(0,1fr)}
  .sim-order{grid-column:1 / -1}}
@media(max-width:720px){.sim-grid{grid-template-columns:minmax(0,1fr)}}
.sim-watch,.sim-main,.sim-order{background:var(--bg);padding:18px}
.sim-h{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--faint);margin-bottom:12px}
.sim-watch{display:grid;gap:2px;align-content:start;max-height:520px;overflow-y:auto}
@media(max-width:720px){.sim-watch{max-height:none;grid-auto-flow:column;grid-auto-columns:150px;
  overflow-x:auto;gap:8px}}
.wrow{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:10px 12px;
  border-radius:9px;text-align:left;transition:background .2s;min-height:52px;border:1px solid transparent}
.wrow:hover{background:var(--surface-2)}
.wrow.on{background:var(--teal-soft);border-color:var(--teal)}
.wname{font-size:14px;font-weight:600;display:grid;gap:2px;min-width:0}
.wname em{font-style:normal;font-size:10.5px;font-weight:400;color:var(--faint);
  font-family:var(--mono);letter-spacing:.1em}
.wpx{font-family:var(--mono);font-size:14px;font-weight:700;text-align:right;display:grid;gap:2px}
.wpx em{font-style:normal;font-size:11px;font-weight:600}
.up{color:var(--teal)} .down{color:var(--rose)}

.sim-inst{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;
  align-items:flex-start;margin-bottom:16px}
.sim-inst-n{font-family:var(--serif);font-size:24px;font-weight:600;letter-spacing:-.02em}
.sim-inst-n span{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--faint);
  margin-left:10px;text-transform:uppercase}
.sim-price{text-align:right}
.sim-price b{font-family:var(--mono);font-size:clamp(24px,4vw,32px);font-weight:700;
  letter-spacing:-.02em;display:block}
.sim-price span{font-family:var(--mono);font-size:14px;font-weight:600}
.simchart{display:block;width:100%;height:auto}
.simchart-empty{height:200px}
.simchart-open{stroke:var(--line);stroke-dasharray:4 4}
.simchart-line{fill:none;stroke-width:2.2;stroke-linejoin:round}
.simchart-line.up{stroke:var(--teal)} .simchart-line.down{stroke:var(--rose)}
.simchart-area{opacity:.1}
.simchart-area.up{fill:var(--teal)} .simchart-area.down{fill:var(--rose)}
.simchart-dot.up{fill:var(--teal)} .simchart-dot.down{fill:var(--rose)}
.sim-phase-note{margin-top:14px;font-size:14px;color:var(--muted);line-height:1.6}

.sim-calc{display:grid;gap:2px;margin:16px 0;border:1px solid var(--line);
  border-radius:10px;overflow:hidden;background:var(--line)}
.sim-calc div{background:var(--surface);display:flex;justify-content:space-between;
  gap:10px;padding:11px 13px;font-size:13.5px}
.sim-calc b{font-family:var(--mono);font-weight:700;color:var(--text)}
.sim-calc b.hi{color:var(--teal)}
.sim-review{width:100%;justify-content:center}
.sim-review.sell{background:var(--rose);border-color:var(--rose)}
.sim-fine{margin-top:12px;font-size:12.5px;color:var(--faint);line-height:1.55}

.sim-book{padding:22px 20px}
.sim-tabs{display:flex;gap:0;border-bottom:1px solid var(--line);margin-bottom:18px;
  overflow-x:auto;scrollbar-width:none}
.sim-tabs::-webkit-scrollbar{display:none}
.sim-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
.sim-empty{padding:26px 0;color:var(--muted);font-size:15px}
.pill{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;
  padding:3px 9px;border-radius:999px;font-weight:700}
.pill.buy{background:var(--teal-soft);color:var(--teal)}
.pill.sell{background:#FBE9EB;color:var(--rose)}
.pill.done{background:var(--surface-2);color:var(--muted)}
.sim-port{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px;
  border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--line)}
@media(max-width:720px){.sim-port{grid-template-columns:repeat(2,minmax(0,1fr))}}
.sim-port div{background:var(--surface);padding:16px 18px;display:grid;gap:5px}
.sim-port span{font-size:12.5px;color:var(--muted)}
.sim-port b{font-family:var(--mono);font-size:19px;font-weight:700}

.sim-insight{margin:22px 20px 0;padding:20px 22px;border-radius:14px;background:var(--teal-soft);
  border-left:3px solid var(--teal);display:flex;gap:18px;align-items:flex-start;
  animation:fadeUp .45s ease both}
.sim-insight-t{font-family:var(--serif);font-size:19px;font-weight:600}

.rev{width:100%;max-width:460px;background:var(--surface);border:1px solid var(--line);
  border-radius:18px;padding:28px;height:max-content;
  box-shadow:0 30px 70px -20px rgba(11,18,32,.4);animation:fadeUp .3s ease both}
.rev.wide{max-width:540px}
.rev-h{font-family:var(--serif);font-size:22px;font-weight:600;letter-spacing:-.02em}
.rev-sub{font-size:14px;color:var(--muted);margin-top:6px}
.rev-rows{display:grid;gap:2px;margin:20px 0;border:1px solid var(--line);
  border-radius:10px;overflow:hidden;background:var(--line)}
.rev-rows div{background:var(--surface);display:flex;justify-content:space-between;
  gap:12px;padding:12px 14px;font-size:14px}
.rev-rows b{font-family:var(--mono);font-weight:700}
.rev-flag{font-size:12.5px;color:var(--faint);line-height:1.55}
.rev-btns{display:flex;gap:10px;margin-top:20px}
.rev-btns .btn{flex:1;justify-content:center}
.btn.primary.sell{background:var(--rose);border-color:var(--rose)}

.execbar{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:90;
  display:flex;align-items:center;gap:10px;padding:12px 20px;border-radius:999px;
  background:var(--text);color:var(--bg);font-size:14px;font-weight:600;
  box-shadow:0 12px 30px -8px rgba(11,18,32,.5);animation:fadeUp .3s ease both}
.execdot{width:8px;height:8px;border-radius:50%;background:var(--amber)}
.execdot.executing{animation:pdot .7s ease-in-out infinite}
.execdot.done{background:var(--teal)}

.toast{position:fixed;top:80px;right:20px;z-index:95;max-width:340px;padding:16px 18px;
  border-radius:12px;background:var(--surface);border:1px solid var(--line);
  border-left:3px solid var(--muted);box-shadow:0 16px 40px -12px rgba(11,18,32,.32);
  animation:fadeUp .3s ease both}
.toast.up{border-left-color:var(--teal)} .toast.down{border-left-color:var(--rose)}
.toast b{font-size:14.5px;display:block}
.toast p{font-size:13.5px;color:var(--muted);margin-top:5px;line-height:1.55}
@media(max-width:560px){.toast{left:14px;right:14px;max-width:none;top:70px}}
@media(prefers-reduced-motion:reduce){
  .sim-dot,.execdot.executing{animation:none}
  .toast,.execbar,.rev,.sim-insight{animation:none}
}

/* ---- financial intelligence ---- */
.fi-picker{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:34px}
@media(max-width:860px){.fi-picker{grid-template-columns:minmax(0,1fr)}}
.fi-card{text-align:left;padding:20px 22px;border:1px solid var(--line);border-radius:16px;
  background:var(--surface);display:grid;gap:8px;transition:.28s cubic-bezier(.2,.7,.3,1);
  box-shadow:var(--shadow)}
.fi-card:hover{border-color:var(--teal);transform:translateY(-2px)}
.fi-card.on{border-color:var(--teal);background:var(--teal-soft)}
.fi-card-t{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--teal)}
.fi-card-h{font-family:var(--serif);font-size:19px;font-weight:600;line-height:1.3;color:var(--text)}
.fi-card-n{font-family:var(--mono);font-size:11.5px;color:var(--faint)}

.fi-chain{border:1px solid var(--line);border-radius:20px;background:var(--surface);
  padding:28px;box-shadow:var(--shadow)}
@media(max-width:600px){.fi-chain{padding:20px 16px}}
.fi-chain-head{display:flex;flex-wrap:wrap;gap:18px;justify-content:space-between;align-items:flex-start}
.fi-ctl{display:flex;gap:8px}

.fi-map{margin:26px 0 8px;border-radius:16px;background:
  radial-gradient(120% 90% at 50% 0%,var(--surface-2),var(--surface));
  border:1px solid var(--line);overflow:hidden}
.fi-svg{display:block;width:100%;height:auto;aspect-ratio:1.9/1;overflow:visible}
@media(max-width:640px){.fi-svg{aspect-ratio:1.05/1}}
.fi-link{fill:none;stroke:var(--line);stroke-width:.45;transition:stroke .5s ease,stroke-width .5s ease}
.fi-link.on{stroke:var(--teal);stroke-width:.6}
.fi-pulse{fill:var(--amber)}
.fi-node{cursor:pointer}
.fi-node:focus{outline:none}
.fi-disc{fill:var(--surface);stroke:var(--line);stroke-width:.5;transition:.45s cubic-bezier(.2,.7,.3,1)}
.fi-node.on .fi-disc{fill:var(--teal);stroke:var(--teal)}
.fi-node.cur .fi-disc{fill:var(--amber);stroke:var(--amber)}
.fi-halo{fill:var(--amber);opacity:.14;animation:fiHalo 2s ease-in-out infinite}
@keyframes fiHalo{0%,100%{r:6.2;opacity:.14}50%{r:7.4;opacity:.05}}
.fi-label{fill:var(--faint);font-size:2.5px;font-family:var(--sans);transition:fill .4s}
.fi-node.on .fi-label{fill:var(--muted)}
.fi-node.cur .fi-label{fill:var(--text);font-weight:700}
.fi-node:hover .fi-label{fill:var(--text)}
.fi-node:focus-visible .fi-disc{stroke:var(--text);stroke-width:1}

.fi-track{display:flex;gap:6px;margin:18px 0 22px}
.fi-pip{flex:1;height:5px;border-radius:3px;background:var(--line);padding:0;
  transition:background .35s ease}
.fi-pip.on{background:var(--teal)}
.fi-pip.cur{background:var(--amber)}
.fi-pip:hover{background:var(--muted)}

.fi-step{display:grid;grid-template-columns:104px minmax(0,1fr);gap:22px;
  padding:24px;border-radius:14px;background:var(--surface-2);
  animation:fadeUp .45s cubic-bezier(.2,.7,.3,1) both}
@media(max-width:600px){.fi-step{grid-template-columns:minmax(0,1fr);gap:14px;padding:18px}}
.fi-step-meta{display:grid;gap:8px;align-content:start}
.fi-n{font-family:var(--mono);font-size:26px;font-weight:700;color:var(--teal);line-height:1}
.fi-lag{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--faint);line-height:1.4}
.fi-where{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--amber);margin-bottom:6px}
.fi-head{font-family:var(--serif);font-size:22px;font-weight:600;letter-spacing:-.02em;line-height:1.25}

/* sensitivity grid */
.fi-grid{margin-top:34px}
.fi-forces{display:flex;gap:8px;overflow-x:auto;padding-bottom:16px;margin-bottom:20px;scrollbar-width:none}
.fi-forces::-webkit-scrollbar{display:none}
.fi-forces .tab{flex:0 0 auto}
.fi-rows{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--surface)}
.fi-row{border-bottom:1px solid var(--line)}
.fi-row:last-child{border-bottom:0}
.fi-row-b{display:grid;grid-template-columns:150px minmax(0,1fr) 140px;gap:18px;align-items:center;
  width:100%;text-align:left;padding:15px 18px;min-height:62px;transition:background .2s}
.fi-row-b:hover{background:var(--surface-2)}
.fi-row.open .fi-row-b{background:var(--surface-2)}
@media(max-width:700px){.fi-row-b{grid-template-columns:minmax(0,1fr) 118px;gap:10px}
  .fi-bar{grid-column:1 / -1;order:3}}
.fi-sector{font-size:15.5px;font-weight:600;color:var(--text)}
.fi-bar{position:relative;height:16px;background:var(--surface-2);border-radius:4px;overflow:hidden}
.fi-row-b:hover .fi-bar,.fi-row.open .fi-bar{background:var(--bg)}
.fi-zero{position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--line)}
.fi-fill{position:absolute;top:2px;bottom:2px;border-radius:3px;
  transition:width .6s cubic-bezier(.3,.8,.3,1)}
.fi-fill.pos{background:var(--teal)}
.fi-fill.neg{background:var(--rose)}
.fi-fill.flat{background:var(--faint);opacity:.4}
.fi-verdict{font-family:var(--mono);font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;
  font-weight:700;text-align:right}
.fi-verdict.pos{color:var(--teal)}
.fi-verdict.neg{color:var(--rose)}
.fi-verdict.flat{color:var(--faint)}
.fi-why{padding:0 18px 18px;font-size:15.5px;line-height:1.65;color:var(--text);max-width:70ch;
  animation:fadeUp .35s ease both}
@media(prefers-reduced-motion:reduce){
  .fi-halo{animation:none}.fi-step,.fi-why{animation:none}
  .fi-fill,.fi-disc,.fi-link{transition:none}
}

.foot{border-top:1px solid var(--line);padding:44px 0 60px;color:var(--faint);font-size:13.5px}
.foot a:hover{color:var(--teal)}
`;

/* ===========================================================================
   MOTION UTILITIES
   =========================================================================== */

const useReducedMotion = () => {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setR(m.matches); f();
    m.addEventListener?.("change", f);
    return () => m.removeEventListener?.("change", f);
  }, []);
  return r;
};

function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { rootMargin: "-8% 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={"rv" + (seen ? " in" : "") + (className ? " " + className : "")}
      style={{ transitionDelay: seen ? `${delay}ms` : "0ms" }} {...rest}>
      {children}
    </Tag>
  );
}

const useHash = () => {
  const [hash, setHash] = useState(() => window.location.hash || "#/");
  useEffect(() => {
    const f = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [hash]);
  return hash;
};

const go = (href) => { window.location.hash = href.replace(/^#/, ""); };

/* ===========================================================================
   SIGNATURE ELEMENT — THE FINANCE UNIVERSE
   An orbital map of domains. It is not decoration: nodes are the navigation,
   and edges are real relationships from the knowledge graph.
   =========================================================================== */




/* ===========================================================================
   CONTENT FILES
   Each section of FinHub can be extended by dropping a JSON file into
   /fin-data. Nothing in this file has to change, ever.

     fin-data/concepts.json    → adds or replaces concepts
     fin-data/domains.json     → adds or replaces domains and their categories
     fin-data/cases.json       → adds case studies
     fin-data/frauds.json      → adds financial frauds
     fin-data/scenarios.json   → adds scenarios
     fin-data/glossary.json    → adds glossary terms
     fin-data/origins.json     → the Origins of Finance timeline
     fin-data/references.json  → sources, keyed by concept or case id

   Each file holds a plain array (an object for references). An entry whose id
   matches something already built in replaces it; anything new is added. A
   missing file is simply skipped.
   =========================================================================== */

/* Files are listed with their dated variants. A dated file never collides with
   an earlier upload, so nothing has to be deleted or renamed. Add a new dated
   name here only if you go beyond these; every listed file that is absent is
   simply skipped. */
const CONTENT_FILES = [
  ["domains.json", DOMAINS, "id"],
  ["concepts.json", CONCEPTS, "id"],
  ["concepts-aug30.json", CONCEPTS, "id"],
  ["concepts-batch2.json", CONCEPTS, "id"],
  ["concepts-batch3.json", CONCEPTS, "id"],
  ["cases.json", CASES, "id"],
  ["cases-aug30.json", CASES, "id"],
  ["frauds.json", FRAUDS, "id"],
  ["frauds-aug30.json", FRAUDS, "id"],
  ["scenarios.json", SCENARIOS, "id"],
  ["scenarios-aug30.json", SCENARIOS, "id"],
  ["glossary.json", GLOSSARY, "term"],
  ["glossary-aug30.json", GLOSSARY, "term"],
];

function mergeInto(target, incoming, key) {
  if (!Array.isArray(incoming)) return 0;
  let n = 0;
  incoming.forEach((item) => {
    if (!item || !item[key]) return;
    const i = target.findIndex((x) => x[key] === item[key]);
    if (i >= 0) target[i] = { ...target[i], ...item };
    else target.push(item);
    n++;
  });
  return n;
}

/* Loads every content file once, merges it in, then re-renders. */
function useContentFiles() {
  const [version, setVersion] = useState(0);
  const [origins, setOrigins] = useState(null);

  useEffect(() => {
    let alive = true;
    const get = (f) =>
      fetch(`fin-data/${f}`, { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

    Promise.all([...CONTENT_FILES.map(([f]) => get(f)), get("origins.json")])
      .then((results) => {
        if (!alive) return;
        let changed = 0;
        CONTENT_FILES.forEach(([, target, key], i) => {
          changed += mergeInto(target, results[i], key);
        });
        const o = results[results.length - 1];
        if (o && Array.isArray(o.eras)) setOrigins(o);
        if (changed || o) setVersion((v) => v + 1);
      });
    return () => { alive = false; };
  }, []);

  return { version, origins };
}

/* ===========================================================================
   REFERENCES — loaded at runtime, not built in
   FinHub looks for /fin-data/references.json on first load. If the file is
   absent, nothing renders and nothing breaks. When it is uploaded later, every
   concept, case study and fraud that has an entry gains a Sources section
   automatically — no change to this file is ever required.

   Expected shape:
   {
     "enron": {
       "note": "optional line about how this entry was compiled",
       "sources": [
         { "title": "SEC Litigation Release No. 17762", "publisher": "U.S. SEC",
           "year": "2002", "url": "https://..." }
       ]
     },
     "time-value-of-money": { "reading": ["Brealey, Myers & Allen — Principles of Corporate Finance"] }
   }
   =========================================================================== */

const RefsContext = React.createContext(null);

function useReferences() {
  const [refs, setRefs] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch("fin-data/references.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d && typeof d === "object") setRefs(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return refs;
}

function References({ id }) {
  const refs = useContext(RefsContext);
  const entry = refs && refs[id];
  if (!entry) return null;
  const sources = Array.isArray(entry.sources) ? entry.sources : [];
  const reading = Array.isArray(entry.reading) ? entry.reading : [];
  if (!sources.length && !reading.length && !entry.note) return null;

  return (
    <Reveal as="section" id="sources" className="block">
      <h2>Sources</h2>
      {entry.note && <p className="body" style={{ marginBottom: 18 }}>{entry.note}</p>}
      {sources.length > 0 && (
        <ol className="refs">
          {sources.map((x, i) => (
            <li key={i}>
              <span className="refs-n">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <b>{x.title}</b>
                {(x.publisher || x.year) && (
                  <span className="small"> {x.publisher}{x.publisher && x.year ? ", " : ""}{x.year}</span>
                )}
                {x.url && (
                  <a href={x.url} target="_blank" rel="noopener noreferrer" className="refs-link">
                    View source →
                  </a>
                )}
              </span>
            </li>
          ))}
        </ol>
      )}
      {reading.length > 0 && (
        <div style={{ marginTop: sources.length ? 26 : 0 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Further reading</p>
          <div className="list">
            {reading.map((r, i) => <div className="li" key={i}><s>→</s><span>{r}</span></div>)}
          </div>
        </div>
      )}
    </Reveal>
  );
}

/* ===========================================================================
   PROGRESS
   Two kinds, both honest. A reading bar showing position within the page, and
   a learning tracker counting concepts opened. The tracker holds for the
   session only — FinHub does not claim to remember you between visits.
   =========================================================================== */

const ProgressContext = React.createContext({ seen: [], mark: () => {} });

function ReadingBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        setPct(max > 40 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className="readbar" aria-hidden="true">
      <div className="readbar-fill" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  );
}

function ProgressPanel() {
  const { seen } = useContext(ProgressContext);
  const total = CONCEPTS.length;
  const done = seen.length;
  const pct = total ? (done / total) * 100 : 0;
  const R = 26, C = 2 * Math.PI * R;
  const next = CONCEPTS.find((c) => !seen.includes(c.id));

  return (
    <div className="prog">
      <svg viewBox="0 0 64 64" className="prog-ring" role="img"
        aria-label={`${done} of ${total} concepts opened`}>
        <circle cx="32" cy="32" r={R} className="prog-track" />
        <circle cx="32" cy="32" r={R} className="prog-arc"
          strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100}
          transform="rotate(-90 32 32)" />
        <text x="32" y="37" textAnchor="middle" className="prog-num">{done}</text>
      </svg>
      <div style={{ minWidth: 0 }}>
        <p className="prog-h">{done} of {total} concepts opened</p>
        <p className="small" style={{ marginTop: 4 }}>
          {done === 0 && "Nothing opened yet this session."}
          {done > 0 && done < total && next && <>Next unopened: <a href={`#/concept/${next.id}`} className="prog-link">{next.title}</a></>}
          {done === total && "Every published concept opened. "}
        </p>
      </div>
    </div>
  );
}


/* ===========================================================================
   MECHANISM VISUALS
   A case or fraud declares `visual`, and the mechanism draws itself. These are
   not illustrations of events — they are diagrams of how the thing worked,
   animated so the sequence is read in the order it happened.
   =========================================================================== */

function MechanismVisual({ type, caption }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setPlay(true); io.disconnect(); }
    }, { rootMargin: "-10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const on = play || reduced;
  const V = { width: "100%", display: "block", overflow: "visible" };

  const shapes = {
    /* leverage: a thin equity layer absorbing a fall in assets */
    collapse: (
      <svg viewBox="0 0 620 240" style={V} role="img" aria-label="A thin equity layer absorbing a fall in asset values">
        <text x="150" y="26" textAnchor="middle" className="mv-lab">Assets</text>
        <text x="450" y="26" textAnchor="middle" className="mv-lab">Funded by</text>
        <rect x="70" y="44" width="160" height="150" rx="6" className="mv-box" />
        <rect x="70" y="44" width="160" height="150" rx="6" className="mv-fill teal"
          style={{ transformOrigin: "70px 194px", transform: on ? "scaleY(0.78)" : "scaleY(1)" }} />
        <rect x="70" y="44" width="160" height="33" rx="4" className={"mv-loss" + (on ? " in" : "")} />
        <rect x="370" y="44" width="160" height="42" rx="6" className={"mv-fill amber" + (on ? " shrink" : "")} />
        <text x="450" y="70" textAnchor="middle" className="mv-in">Equity</text>
        <rect x="370" y="92" width="160" height="102" rx="6" className="mv-fill grey" />
        <text x="450" y="148" textAnchor="middle" className="mv-in">Debt (unchanged)</text>
        <text x="300" y="222" textAnchor="middle" className="mv-note">
          The debt does not move. The whole fall lands on equity.
        </text>
      </svg>
    ),
    /* maturity mismatch: short funding under long assets */
    mismatch: (
      <svg viewBox="0 0 620 220" style={V} role="img" aria-label="Long assets funded by short liabilities">
        <text x="310" y="24" textAnchor="middle" className="mv-lab">Long-dated assets</text>
        <rect x="70" y="40" width="480" height="34" rx="6" className="mv-fill teal" />
        <text x="310" y="196" textAnchor="middle" className="mv-lab">Short-dated funding, renewed constantly</text>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={70 + i * 40} y="128" width="30" height="34" rx="4"
            className={"mv-tick" + (on ? " in" : "")}
            style={{ animationDelay: `${i * 0.07}s`, opacity: on && i > 8 ? 0.25 : undefined }} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={"l" + i} x1={85 + i * 40} y1="74" x2={85 + i * 40} y2="128"
            className={"mv-line" + (on ? " in" : "")} style={{ animationDelay: `${i * 0.07}s` }} />
        ))}
        <text x="310" y="216" textAnchor="middle" className="mv-note">
          If the short funding stops being renewed, the long asset cannot be sold in time.
        </text>
      </svg>
    ),
    /* fabricated balance: reported beside real */
    hollow: (
      <svg viewBox="0 0 620 230" style={V} role="img" aria-label="A reported balance beside the real one">
        <text x="165" y="26" textAnchor="middle" className="mv-lab">Reported</text>
        <text x="455" y="26" textAnchor="middle" className="mv-lab">Actual</text>
        <rect x="70" y="44" width="190" height="150" rx="8" className={"mv-fill teal" + (on ? " grow" : "")}
          style={{ transformOrigin: "165px 194px" }} />
        <rect x="360" y="44" width="190" height="150" rx="8" className="mv-box dashed" />
        <rect x="360" y="164" width="190" height="30" rx="6" className={"mv-fill rose" + (on ? " grow" : "")}
          style={{ transformOrigin: "455px 194px", animationDelay: ".25s" }} />
        <text x="310" y="222" textAnchor="middle" className="mv-note">
          The gap between the two is not an error. It has to be created and maintained.
        </text>
      </svg>
    ),
    /* circular flow: new money paying old */
    loop: (
      <svg viewBox="0 0 620 230" style={V} role="img" aria-label="New money paying earlier investors">
        <ellipse cx="310" cy="112" rx="180" ry="72" className="mv-orbit" />
        <path d="M130 112a180 72 0 0 1 360 0" className={"mv-path" + (on ? " in" : "")} />
        <circle cx="130" cy="112" r="9" className="mv-dot teal" />
        <circle cx="490" cy="112" r="9" className="mv-dot rose" />
        <text x="130" y="94" textAnchor="middle" className="mv-lab">New investors</text>
        <text x="490" y="94" textAnchor="middle" className="mv-lab">Earlier investors</text>
        {on && <circle r="6" className="mv-travel"><animateMotion dur="3s" repeatCount="indefinite"
          path="M130 112a180 72 0 0 1 360 0" /></circle>}
        <text x="310" y="206" textAnchor="middle" className="mv-note">
          No return is produced. Money entering is money leaving, until entries stop.
        </text>
      </svg>
    ),
    /* concentration: many small exposures, one shared cause */
    concentration: (
      <svg viewBox="0 0 620 240" style={V} role="img" aria-label="Many exposures depending on one factor">
        {Array.from({ length: 30 }).map((_, i) => {
          const col = i % 10, row = Math.floor(i / 10);
          return <rect key={i} x={90 + col * 44} y={140 + row * 26} width="30" height="16" rx="3"
            className={"mv-tick" + (on ? " in" : "")} style={{ animationDelay: `${i * 0.02}s` }} />;
        })}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1={105 + i * 44} y1="140" x2="310" y2="66"
            className={"mv-line" + (on ? " in" : "")} style={{ animationDelay: `${0.3 + i * 0.05}s` }} />
        ))}
        <circle cx="310" cy="56" r="14" className="mv-dot amber" />
        <text x="310" y="32" textAnchor="middle" className="mv-lab">One shared factor</text>
        <text x="310" y="226" textAnchor="middle" className="mv-note">
          Spread across many names, but every one depends on the same thing.
        </text>
      </svg>
    ),
    /* value fading with distance in time */
    discount: (
      <svg viewBox="0 0 620 200" style={V} role="img" aria-label="Value diminishing with distance in time">
        {Array.from({ length: 7 }).map((_, i) => {
          const h = 120 * Math.pow(0.78, i);
          return (
            <g key={i}>
              <rect x={70 + i * 76} y={160 - h} width="46" height={h} rx="5"
                className={"mv-fill teal" + (on ? " grow" : "")}
                style={{ transformOrigin: `${93 + i * 76}px 160px`, animationDelay: `${i * 0.09}s` }} />
              <text x={93 + i * 76} y="180" textAnchor="middle" className="mv-lab">Y{i + 1}</text>
            </g>
          );
        })}
        <text x="310" y="198" textAnchor="middle" className="mv-note">
          The same cash flow, worth less the further away it sits.
        </text>
      </svg>
    ),
  };

  const el = shapes[type];
  if (!el) return null;

  return (
    <figure className="mv" ref={ref}>
      <div className="mv-frame">{el}</div>
      {caption && <figcaption className="fig-cap">{caption}</figcaption>}
    </figure>
  );
}

/* Sources may be declared inside a case or fraud, or supplied later through
   fin-data/references.json. Both render identically. */
function SourceList({ sources, note }) {
  if (!Array.isArray(sources) || !sources.length) return null;
  return (
    <Reveal as="section" className="block">
      <h2>Sources</h2>
      {note && <p className="body" style={{ marginBottom: 18 }}>{note}</p>}
      <ol className="refs">
        {sources.map((x, i) => (
          <li key={i}>
            <span className="refs-n">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <b>{x.title}</b>
              {(x.publisher || x.year) && (
                <span className="small"> {x.publisher}{x.publisher && x.year ? ", " : ""}{x.year}</span>
              )}
              {x.url && <a href={x.url} target="_blank" rel="noopener noreferrer" className="refs-link">View source →</a>}
            </span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/* ===========================================================================
   IMAGE SYSTEM
   Images are held in /fin. Each one is lazy-loaded, reserves its space before
   it arrives so nothing jumps, fades and settles from a slight scale as it
   enters view, and removes itself silently if the file is absent — so a
   missing image never leaves a hole in the page.
   =========================================================================== */

// Relative on purpose: the app is served from a sub-path on GitHub Pages and
// uses hash routing, so "fin/x.png" resolves correctly without any build-time
// base URL, and works in preview environments too.
const IMG_BASE = "";

function FinImage({ name, alt, caption, ratio = "16 / 9", priority = false, className = "" }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (priority) return;
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [priority]);

  if (failed) return null;

  return (
    <figure ref={ref} className={"fig " + className}>
      <div className="fig-frame" style={{ aspectRatio: ratio }}>
        {seen && (
          <img
            src={`${IMG_BASE}fin/${name}.png`}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={"fig-img" + (loaded ? " in" : "")}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      {caption && <figcaption className="fig-cap">{caption}</figcaption>}
    </figure>
  );
}

/* A section opener: image behind, title in front, with a slow parallax drift.
   Used at the top of domains, cases, frauds and scenarios. */
function ImageBanner({ name, alt, children }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [off, setOff] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let raf = 0, ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) {
            setOff(Math.max(-40, Math.min(40, (r.top / window.innerHeight) * 44)));
          }
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <div className="banner" ref={ref}>
      <div className="banner-img" style={{ transform: `translate3d(0, ${off}px, 0) scale(1.08)` }}>
        <FinImage name={name} alt={alt} ratio="21 / 9" priority />
      </div>
      <div className="banner-veil" />
      <div className="wrap banner-in">{children}</div>
    </div>
  );
}

/* ===========================================================================
   FINHUB SYMBOL LANGUAGE
   One alphabet, drawn from a single set of primitives: node, line, arc, orbit,
   grid, branch. No literal objects — no buildings, books, calculators, globes
   or charts. Shared geometry: 24px frame, 1.4 stroke, round caps, node radius
   1.7 for minor and 2.6 for primary. Every mark reads as structure.
   =========================================================================== */

const N = (cx, cy, r = 1.7, fill = true) =>
  <circle cx={cx} cy={cy} r={r} fill={fill ? "currentColor" : "none"} />;

const SYM = {
  /* CORE — the FinHub mark. A centre held by four connected nodes: knowledge
     at the centre, connection outward, discovery in the open diagonals. */
  core: <><path d="M12 5.6v12.8M5.6 12h12.8" /><path d="M12 5.6l4.5 6.4-4.5 6.4-4.5-6.4z" />{N(12, 12, 2.6)}{N(12, 4.4)}{N(12, 19.6)}{N(4.4, 12)}{N(19.6, 12)}</>,

  /* UNIVERSE — centre, orbit, nodes belonging to one system */
  universe: <><ellipse cx="12" cy="12" rx="9" ry="4.4" /><ellipse cx="12" cy="12" rx="4.4" ry="9" />{N(12, 12, 2.4)}{N(21, 12)}{N(12, 3)}{N(3, 12)}</>,

  /* FUNDAMENTALS — a grid on a foundation, with the first node placed */
  fundamentals: <><path d="M4 19.5h16" /><path d="M7 19.5V8M12 19.5V8M17 19.5V8" opacity=".55" /><path d="M4 8h16" opacity=".55" />{N(7, 8)}{N(12, 8, 2.4)}{N(17, 8)}</>,

  /* INVESTMENTS — capital allocated across nodes, rising */
  investments: <><path d="M4 18l4.5-4 4.5 2 6.5-8" />{N(4, 18)}{N(8.5, 14)}{N(13, 16)}{N(19.5, 8, 2.4)}</>,

  /* MARKETS — two pathways meeting; price is made where they cross */
  markets: <><path d="M4 6.5l16 11M4 17.5l16-11" />{N(12, 12, 2.6)}{N(4, 6.5)}{N(20, 17.5)}{N(4, 17.5)}{N(20, 6.5)}</>,

  /* CORPORATE — capital in layers, feeding one decision node */
  corporate: <><path d="M5 18.5h9M5 13.5h9M5 8.5h9" /><path d="M14 13.5h3.2" />{N(19.6, 13.5, 2.4)}{N(5, 8.5)}{N(5, 13.5)}{N(5, 18.5)}</>,

  /* BANKING — an enclosed structure standing between two sides */
  banking: <><path d="M8.6 6.4h6.8l3.4 5.6-3.4 5.6H8.6L5.2 12z" />{N(12, 12, 2.4)}{N(2.4, 12)}{N(21.6, 12)}<path d="M2.4 12h2.8M18.8 12h2.8" /></>,

  /* DERIVATIVES — a value derived from another, conditional on it */
  derivatives: <><path d="M4 12h5.2" /><path d="M12 12l6.2-4.6M12 12l6.2 4.6" />{N(4, 12)}{N(10.6, 12, 2.4)}{N(19.4, 7)}{N(19.4, 17)}</>,

  /* RISK — one position, many possible paths through it */
  risk: <><path d="M4.5 12a7.5 7.5 0 0 1 15 0" opacity=".55" /><path d="M4.5 12a7.5 7.5 0 0 0 15 0" opacity=".55" /><path d="M12 4.5v15" opacity=".55" />{N(12, 12, 2.6)}{N(12, 4.5)}{N(12, 19.5)}</>,

  /* ECONOMICS — circular flow between the parts of a system */
  economics: <><path d="M12 4.6a7.4 7.4 0 0 1 6.4 11.1" /><path d="M15.4 19.1A7.4 7.4 0 0 1 5.3 9.4" />{N(12, 4.6)}{N(18.4, 15.7)}{N(5.6, 15.7)}{N(12, 12, 2.2)}</>,

  /* GLOBAL — a spherical network, not a planet */
  global: <><circle cx="12" cy="12" r="8.4" /><path d="M12 3.6c-3.4 4.6-3.4 12.2 0 16.8M12 3.6c3.4 4.6 3.4 12.2 0 16.8" opacity=".55" />{N(12, 3.6)}{N(19.4, 8.6)}{N(4.6, 15.4)}{N(12, 20.4)}</>,

  /* FINTECH — financial pathways routed as circuitry */
  fintech: <><path d="M4 8h6l3 3h7M4 16h6l3-3" />{N(20, 11, 2.4)}{N(13, 11)}{N(4, 8)}{N(4, 16)}<path d="M20 11v5" opacity=".55" />{N(20, 16)}</>,

  /* HISTORY — layered rings marking points in time */
  history: <><path d="M5 18a9 9 0 0 1 14 0" opacity=".55" /><path d="M8 18a5 5 0 0 1 8 0" opacity=".55" />{N(5.6, 15.6)}{N(12, 9, 2.4)}{N(18.4, 15.6)}<path d="M4 20.5h16" /></>,

  /* CASES — event, decision, action, outcome */
  cases: <><path d="M4.5 12h15" />{N(4.5, 12)}{N(9.5, 12)}{N(14.5, 12)}{N(19.5, 12, 2.6)}<path d="M9.5 12V8.4M14.5 12v3.6" opacity=".55" /></>,

  /* FRAUDS — a structured network with one link broken */
  frauds: <><path d="M6 7l6 3.4M12 13.6l6 3.4" /><path d="M12 10.4l0 3.2" strokeDasharray="1.6 2.4" opacity=".6" /><path d="M6 17l3-1.7" opacity=".55" />{N(6, 7)}{N(18, 17)}{N(12, 10.4, 2.2)}{N(12, 13.6, 2.2)}</>,

  /* SCENARIOS — one start, several outcomes */
  scenarios: <><path d="M4.5 12h4" /><path d="M11 12l7-5M11 12h7M11 12l7 5" />{N(4.5, 12)}{N(9.7, 12, 2.4)}{N(19.4, 7)}{N(19.4, 12)}{N(19.4, 17)}</>,

  /* INTELLIGENCE — one analytical node reading many */
  intelligence: <><path d="M6.3 7.2l4 3.4M17.7 7.2l-4 3.4M6.3 16.8l4-3.4M17.7 16.8l-4-3.4" />{N(12, 12, 2.8)}{N(5, 6)}{N(19, 6)}{N(5, 18)}{N(19, 18)}</>,

  /* VISUALISATIONS — structure made visible */
  visualisations: <><path d="M6 17V9M12 17v-4M18 17V6" opacity=".55" /><path d="M4 20h16" />{N(6, 9)}{N(12, 13)}{N(18, 6, 2.4)}<path d="M6 9l6 4 6-7" opacity=".55" /></>,

  /* GLOSSARY — a structured collection of terms */
  glossary: <><path d="M6 7h12M6 12h12M6 17h8" opacity=".55" />{N(4, 7)}{N(4, 12)}{N(4, 17)}{N(19.6, 7, 2.2)}</>,

  /* LEARNING PATH — increasing knowledge, in order */
  path: <><path d="M12 5.5v13" opacity=".55" />{N(12, 5)}{N(12, 12, 2.2)}{N(12, 19, 2.8)}<path d="M12 12h4.5M12 5h3" opacity=".45" /></>,

  /* TOOLS — input, calculation, result */
  tools: <><path d="M6.5 12h3.4M14.1 12h3.4" />{N(4.4, 12)}{N(12, 12, 2.8, false)}{N(19.6, 12, 2.4)}<path d="M12 9.6v-3M12 17.4v-3" opacity=".5" /></>,

  /* AI — a guide across the network */
  ai: <><path d="M12 4.8v4M12 15.2v4M4.8 12h4M15.2 12h4" opacity=".55" />{N(12, 12, 3, false)}{N(12, 12, 1.4)}{N(12, 4)}{N(12, 20)}{N(4, 12)}{N(20, 12)}</>,

  /* CONNECTION — the relationship itself */
  connection: <><path d="M8.6 12h6.8" />{N(6, 12, 2.6)}{N(18, 12, 2.6)}</>,

  /* SEARCH — the one conventional mark, kept in family */
  search: <><circle cx="10.8" cy="10.8" r="6" /><path d="M15.4 15.4L20 20" /></>,
};

function Symbol({ name, size = 24, className = "" }) {
  const d = SYM[name] || SYM.connection;
  return (
    <svg className={"sym " + className} width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" focusable="false">{d}</svg>
  );
}

/* ---- Concept relationship map (SVG, used on concept pages) ---- */
function ConceptGraph({ id }) {
  const c = conceptById(id);
  const rel = (c.related || []).map(conceptById).filter(Boolean);
  const n = rel.length || 1;
  const W = 680, H = 380;
  const cx = W / 2, cy = H / 2, R = 128;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="group"
      aria-label={`Concepts related to ${c.title}`}
      style={{ display: "block", maxWidth: "100%", overflow: "visible" }}>
      {rel.map((r, i) => {
        // start at the top and space evenly, so labels never collide
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.82;
        const right = Math.cos(a) > 0.25, left = Math.cos(a) < -0.25;
        const anchor = right ? "start" : left ? "end" : "middle";
        const lx = x + (right ? 14 : left ? -14 : 0);
        const ly = y + (right || left ? 4 : Math.sin(a) > 0 ? 24 : -14);
        return (
          <g key={r.id} className="gnode" tabIndex={0} role="link"
            aria-label={`Open ${r.title}`}
            onClick={() => go(`#/concept/${r.id}`)}
            onKeyDown={(e) => { if (e.key === "Enter") go(`#/concept/${r.id}`); }}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--teal)" strokeWidth="1" opacity="0.45">
              <animate attributeName="stroke-opacity" values="0;0.45" dur="0.5s"
                begin={`${0.12 * i}s`} fill="freeze" />
            </line>
            <circle cx={x} cy={y} r="22" fill="transparent" />
            <circle cx={x} cy={y} r="5" fill="var(--teal)" className="gdot" />
            <text x={lx} y={ly} textAnchor={anchor} fill="var(--muted)"
              fontSize="13" fontFamily="var(--sans)">{r.title}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="10" fill="var(--amber)" />
      <text x={cx} y={cy + 30} textAnchor="middle" fill="var(--text)"
        fontSize="14" fontWeight="600" fontFamily="var(--serif)">{c.title}</text>
    </svg>
  );
}

/* ===========================================================================
   NAVIGATION + SEARCH
   =========================================================================== */

const NAV = [
  ["Universe", "#/universe"], ["Origins", "#/origins"], ["History", "#/history"], ["Data", "#/data"], ["Tax", "#/tax"], ["Intelligence", "#/intelligence"], ["Simulator", "#/floor"], ["Telemetry", "#/telemetry"], ["Concepts", "#/concepts"], ["Cases", "#/cases"],
  ["Scenarios", "#/scenarios"], ["Glossary", "#/glossary"], ["Tools", "#/tools"],
];

function Nav({ hash, onSearch }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [hash]);
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a href="#/" className="brand" aria-label="FinHub home">
          <span className="brand-mark"><Symbol name="core" size={22} /></span> FinHub
        </a>
        <nav className="nav-links" aria-label="Primary">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} className={hash.startsWith(h) ? "on" : ""}>{l}</a>
          ))}
          <button className="searchbtn" onClick={onSearch} aria-label="Search FinHub">
            <Symbol name="search" size={15} /> Search <span className="kbd">/</span>
          </button>
        </nav>
        <div className="burger">
          <button className="searchbtn" onClick={onSearch} aria-label="Search FinHub">Search</button>
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open}
            aria-label="Menu" style={{ padding: 8, border: "1px solid var(--line)", borderRadius: 9 }}>
            <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
              {[1, 7, 13].map((y) => <rect key={y} y={y - 1} width="18" height="1.6" fill="#93A0BC" />)}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="sheet">
          <div className="wrap">
            {NAV.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
          </div>
        </div>
      )}
    </header>
  );
}

function SearchOverlay({ onClose }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const results = useMemo(() => search(q), [q]);
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setSel(0); }, [q]);
  const onKey = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && results[sel]) { go(results[sel].href); onClose(); }
  };
  return (
    <div className="ov" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="panel" role="dialog" aria-label="Search FinHub" aria-modal="true">
        <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
          placeholder="Search concepts, cases, scenarios, terms, tools…" />
        {q && (
          <div className="res">
            {results.length === 0 && (
              <div style={{ padding: "18px 20px" }} className="small">
                Nothing matches “{q}”. Try a concept name such as inflation, leverage or bond.
              </div>
            )}
            {results.map((r, i) => (
              <a key={r.href + i} href={r.href} className={i === sel ? "sel" : ""}
                onClick={onClose} onMouseEnter={() => setSel(i)}>
                <span style={{ minWidth: 0 }}>
                  <b>{r.title}</b>
                  <p>{r.sub}</p>
                </span>
                <span className="badge">{r.type}</span>
              </a>
            ))}
          </div>
        )}
        {!q && (
          <div className="res">
            <div style={{ padding: "16px 20px" }} className="small">
              Start typing. Results show what kind of content each one is — concept, case study,
              scenario, glossary term or tool.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Crumbs({ items }) {
  return (
    <nav className="crumbs wrap" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span>/</span>}
          {it[1] ? <a href={it[1]}>{it[0]}</a> : <em style={{ fontStyle: "normal", color: "var(--muted)" }}>{it[0]}</em>}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ===========================================================================
   LANDING PAGE
   Sequence: vastness → the universe → structure → concepts → connections →
   real world → understanding.
   =========================================================================== */

/* ===========================================================================
   THE FINANCE UNIVERSE
   The landing page is this. Not a description of it.

   Three depths, one continuous object:
     FINANCE  →  DOMAIN  →  CATEGORY  →  CONCEPT
   Nothing is decorative: every node is a control, every line is a real
   relationship, and the last click leaves the map for the concept itself.
   =========================================================================== */

const ORBIT = [
  "fundamentals", "investments", "markets", "corporate",
  "banking", "derivatives", "economics", "fintech",
];

function FinanceUniverse() {
  const reduced = useReducedMotion();
  const [angle, setAngle] = useState(0);
  const [sel, setSel] = useState(null);      // domain id
  const [cat, setCat] = useState(null);      // category id
  const [hover, setHover] = useState(null);
  const [narrow, setNarrow] = useState(() => window.innerWidth < 720);

  useEffect(() => {
    const f = () => setNarrow(window.innerWidth < 720);
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  // slow drift, only while nothing is selected
  useEffect(() => {
    if (reduced || sel || hover) return;
    let raf, last = performance.now();
    const step = (t) => {
      const dt = t - last; last = t;
      setAngle((a) => a + dt * 0.000045);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, sel, hover]);

  const W = 1000, H = 640, cx = W / 2, cy = 250;
  const domains = ORBIT.map((id) => DOMAINS.find((d) => d.id === id)).filter(Boolean);
  const selDomain = sel ? DOMAINS.find((d) => d.id === sel) : null;
  const cats = selDomain?.categories || [];
  const concepts = sel ? CONCEPTS.filter((c) => c.domain === sel) : [];
  const catSlots = cat
    ? (cats.find((x) => x.id === cat)?.subcategories || []).map((name) => ({
        name, concept: conceptForSlot(sel, name),
      }))
    : [];

  // position of each orbit node
  const posOf = (i, n) => {
    const a = (i / n) * Math.PI * 2 + angle;
    return { x: cx + Math.cos(a) * 320, y: cy + Math.sin(a) * 165 };
  };
  // where a node goes once a domain is chosen: selected rises to the top axis
  const selectedPos = { x: cx, y: cy - 170 };

  const reset = () => { setSel(null); setCat(null); };

  if (narrow) {
    return (
      <UniverseList sel={sel} setSel={setSel} cat={cat} setCat={setCat}
        domains={domains} concepts={concepts} reset={reset} />
    );
  }

  return (
    <div className="uni">
      <svg viewBox={`0 0 ${W} ${H}`} className="uni-svg" role="application"
        aria-label="The finance universe: choose a domain, then a category, then a concept">
        <defs>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity=".28" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* orbit path */}
        <ellipse cx={cx} cy={cy} rx="320" ry="165" className="uni-orbit"
          style={{ opacity: sel ? 0 : 1 }} />

        {/* links from centre to each domain */}
        {domains.map((d, i) => {
          const p = d.id === sel ? selectedPos : posOf(i, domains.length);
          const dim = sel && d.id !== sel;
          return (
            <line key={"l" + d.id} x1={cx} y1={cy} x2={p.x} y2={p.y}
              className={"uni-link" + (d.id === sel ? " on" : "")} 
              style={{ opacity: dim ? 0.06 : d.id === sel ? 0.9 : 0.22 }} />
          );
        })}

        {/* categories of the selected domain */}
        {sel && cats.map((c, i) => {
          const per = Math.min(cats.length, 4);
          const row = Math.floor(i / per), col = i % per;
          const rows = Math.ceil(cats.length / per);
          const x = cx + (col - (Math.min(per, cats.length - row * per) - 1) / 2) * 218;
          const y = cy + 30 + row * 54 - (rows - 1) * 10;
          const on = cat === c.id;
          const done = c.subcategories.filter((sub) => conceptForSlot(sel, sub)).length;
          return (
            <g key={c.id} className={"uni-cat" + (on ? " on" : "")}
              style={{ animationDelay: `${0.06 * i}s` }}>
              <line x1={selectedPos.x} y1={selectedPos.y} x2={x} y2={y} className="uni-link"
                style={{ opacity: on ? .8 : .22 }} />
              <g tabIndex={0} role="button" aria-pressed={on}
                aria-label={`${c.name}, ${done} of ${c.subcategories.length} written`}
                onClick={() => setCat(on ? null : c.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCat(on ? null : c.id); } }}
                transform={`translate(${x} ${y})`} className="uni-hit">
                <rect x="-98" y="-18" width="196" height="36" rx="18" className="uni-pill" />
                <text x="-6" y="4" textAnchor="middle" className="uni-pill-t">{c.name}</text>
                <text x="80" y="4" textAnchor="end" className="uni-pill-n">{done}/{c.subcategories.length}</text>
              </g>
            </g>
          );
        })}

        {/* every concept slot in the chosen category */}
        {sel && cat && catSlots.map((slot, i) => {
          const c = slot.concept;
          const per = Math.min(catSlots.length, 4);
          const row = Math.floor(i / per), col = i % per;
          const inRow = Math.min(per, catSlots.length - row * per);
          const x = cx + (col - (inRow - 1) / 2) * 232;
          const y = cy + 150 + row * 48;
          return (
            <g key={slot.name} className="uni-concept" style={{ animationDelay: `${0.05 * i}s` }}>
              {c ? (
                <g tabIndex={0} role="link" aria-label={`Open ${c.title}`}
                  onClick={() => go(`#/concept/${c.id}`)}
                  onKeyDown={(e) => { if (e.key === "Enter") go(`#/concept/${c.id}`); }}
                  transform={`translate(${x} ${y})`} className="uni-hit">
                  <rect x="-108" y="-18" width="216" height="36" rx="9" className="uni-node-box" />
                  <text y="4" textAnchor="middle" className="uni-node-t">{slot.name} →</text>
                </g>
              ) : (
                <g transform={`translate(${x} ${y})`}>
                  <rect x="-108" y="-18" width="216" height="36" rx="9" className="uni-node-box planned" />
                  <text y="4" textAnchor="middle" className="uni-node-t planned">{slot.name}</text>
                </g>
              )}
            </g>
          );
        })}


        {/* domain nodes */}
        {domains.map((d, i) => {
          const p = d.id === sel ? selectedPos : posOf(i, domains.length);
          const on = d.id === sel, dim = sel && !on;
          return (
            <g key={d.id} transform={`translate(${p.x} ${p.y})`}
              className={"uni-dom uni-hit" + (on ? " on" : "") + (dim ? " dim" : "")}
              tabIndex={0} role="button" aria-pressed={on} aria-label={`Domain ${d.name}`}
              onClick={() => { setSel(on ? null : d.id); setCat(null); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(on ? null : d.id); setCat(null); } }}
              onMouseEnter={() => setHover(d.id)} onMouseLeave={() => setHover(null)}>
              <circle r="30" className="uni-dom-bg" />
              <g transform="translate(-11 -11)" className="uni-dom-sym">
                <Symbol name={d.icon || "connection"} size={22} />
              </g>
              <text y="52" textAnchor="middle" className="uni-dom-t">{d.name}</text>
            </g>
          );
        })}

        {/* the centre */}
        <g className="uni-core" onClick={reset} tabIndex={sel ? 0 : -1}
          role={sel ? "button" : undefined} aria-label={sel ? "Back to all domains" : undefined}>
          <circle cx={cx} cy={cy} r="90" fill="url(#coreGlow)" />
          <circle cx={cx} cy={cy} r="34" className="uni-core-bg" />
          <g transform={`translate(${cx - 13} ${cy - 13})`}>
            <Symbol name="core" size={26} />
          </g>
          <text x={cx} y={cy + 60} textAnchor="middle" className="uni-core-t">
            {sel ? "All domains" : "Finance"}
          </text>
        </g>
      </svg>

      <p className="uni-hint" aria-live="polite">
        {!sel && "Select any domain to open it"}
        {sel && !cat && `${selDomain.name} — choose a category`}
        {sel && cat && "Select a concept to read it"}
      </p>
    </div>
  );
}

/* Small screens: the same three depths as a vertical drill-down.
   Same information, same endpoints, composition rebuilt for touch. */
function UniverseList({ sel, setSel, cat, setCat, domains, concepts, reset }) {
  const d = sel ? DOMAINS.find((x) => x.id === sel) : null;
  const cats = d?.categories || [];
  const catObj = cat ? cats.find((c) => c.id === cat) : null;
  const inCat = catObj ? catObj.subcategories.map((name) => ({ name, concept: conceptForSlot(sel, name) })) : [];

  return (
    <div className="unil">
      {!sel && (
        <ul className="unil-list">
          {domains.map((x) => (
            <li key={x.id}>
              <button onClick={() => setSel(x.id)}>
                <span className="unil-mark"><Symbol name={x.icon || "connection"} size={20} /></span>
                <span className="unil-name">{x.name}</span>
                <span className="unil-go">→</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {sel && (
        <div className="unil-in">
          <button className="unil-back" onClick={() => (cat ? setCat(null) : reset())}>
            ← {cat ? d.name : "All domains"}
          </button>
          {!cat && (
            <>
              <h3 className="unil-h">{d.name}</h3>
              <ul className="unil-list">
                {cats.map((c) => {
                  const done = c.subcategories.filter((x) => conceptForSlot(sel, x)).length;
                  return (
                    <li key={c.id}>
                      <button onClick={() => setCat(c.id)}>
                        <span className="unil-name">{c.name}</span>
                        <span className="unil-tag">{done}/{c.subcategories.length}</span>
                        <span className="unil-go">→</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          {cat && (
            <>
              <h3 className="unil-h">{catObj.name}</h3>
              <ul className="unil-list">
                {inCat.map((sl) => (
                  <li key={sl.name}>
                    {sl.concept ? (
                      <a href={`#/concept/${sl.concept.id}`}>
                        <span className="unil-name">{sl.name}</span>
                        <span className="unil-go">→</span>
                      </a>
                    ) : (
                      <div className="unil-planned">
                        <span className="unil-name">{sl.name}</span>
                        <span className="unil-tag">Planned</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ===========================================================================
   LANDING
   One idea, one map, one way in.
   =========================================================================== */

function Landing() {
  return (
    <>
      <section className="land">
        <div className="land-bg" aria-hidden="true">
          <FinImage name="hero" alt="" ratio="16 / 9" priority />
        </div>
        <div className="wrap land-in">
          <Reveal><p className="kicker">The finance universe</p></Reveal>
          <Reveal delay={80}>
            <h1 className="land-h">Everything in finance is connected.</h1>
          </Reveal>
          <Reveal delay={170}>
            <p className="land-sub">
              Money has a price. That price moves everything else. Follow any thread far enough
              and it reaches all the others.
            </p>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <FinanceUniverse />
        </Reveal>
      </section>

      <section className="land-end">
        <div className="wrap-n">
          <Reveal>
            <p className="land-end-t">
              Finance is vast. It is not disordered.
            </p>
          </Reveal>
          <Reveal delay={110}>
            <p className="lede" style={{ marginTop: 20 }}>
              The difficulty is not that any one idea is hard. It is that they arrive scattered,
              and nothing tells you how they hold together. FinHub is the structure.
            </p>
          </Reveal>
          <Reveal delay={190}>
            <div className="cta-row" style={{ marginTop: 32 }}>
              <a className="btn primary" href="#/concept/time-value-of-money">Begin with one idea</a>
              <a className="btn ghost" href="#/universe">See the full structure</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ===========================================================================
   UNIVERSE + DOMAIN
   =========================================================================== */

const DOMAIN_GROUPS = [
  { label: "Learn", note: "The written body of finance.", ids: ["fundamentals", "investments", "markets", "corporate", "banking", "derivatives", "economics", "fintech", "global"] },
  { label: "Apply", note: "Where the concepts meet reality.", ids: ["case-studies", "frauds", "scenarios", "intelligence"] },
  { label: "Explore", note: "Ways through the structure.", ids: ["visualisations", "history", "glossary", "tools", "ai"] },
];

function Universe() {
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Universe"]]} />
      <div className="wrap">
        <Reveal><h1 className="h-page">The Finance Universe</h1></Reveal>
        <Reveal delay={80}>
          <p className="lede" style={{ marginTop: 18, maxWidth: "56ch" }}>
            Seventeen domains in three groups. Open one to see its categories and the concepts
            written inside it.
          </p>
        </Reveal>
      </div>
      <div className="wrap" style={{ padding: "20px 20px 110px" }}>
        {DOMAIN_GROUPS.map((g, gi) => (
          <section key={g.label} style={{ marginTop: gi === 0 ? 56 : 72 }}>
            <Reveal>
              <div className="scene-head" style={{ marginBottom: 28 }}>
                <p className="eyebrow">{g.label}</p>
                <p className="lede" style={{ marginTop: 8, fontSize: 15 }}>{g.note}</p>
              </div>
            </Reveal>
            <div className="grid g3">
              {g.ids.map((id, i) => {
                const d = DOMAINS.find((x) => x.id === id);
                if (!d) return null;
                const { slots, written } = domainStats(d);
                return (
                  <Reveal key={d.id} delay={Math.min(i * 50, 250)}>
                    <a className="card link" href={d.route || `#/domain/${d.id}`} style={{ display: "block", height: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                        <span className="card-mark"><Symbol name={d.icon || "connection"} size={24} /></span>
                        {slots > 0 && <span className="badge aqua">{written}/{slots}</span>}
                      </div>
                      <p className="kicker" style={{ marginTop: 18 }}>{d.kicker}</p>
                      <h3 style={{ marginTop: 8 }}>{d.name}</h3>
                      <p className="small" style={{ marginTop: 6 }}>{d.blurb}</p>
                    </a>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
function DomainPage({ id }) {
  const d = DOMAINS.find((x) => x.id === id);
  if (!d) return <NotFound />;
  const { slots, written } = domainStats(d);
  const cats = d.categories || [];

  const Head = (
    <>
      <Reveal><p className="kicker">{d.kicker}</p></Reveal>
      <Reveal delay={60}><h1 style={{ fontSize: "clamp(28px,5vw,46px)", marginTop: 12 }}>{d.name}</h1></Reveal>
      <Reveal delay={120}><p className="lede" style={{ marginTop: 14, maxWidth: "62ch" }}>{d.blurb}</p></Reveal>
      {slots > 0 && (
        <Reveal delay={170}>
          <div className="dstat">
            <div className="dstat-bar">
              <div className="dstat-fill" style={{ width: `${(written / slots) * 100}%` }} />
            </div>
            <p className="small">
              <b>{written}</b> of <b>{slots}</b> concepts written in this domain
            </p>
          </div>
        </Reveal>
      )}
    </>
  );

  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Universe", "#/universe"], [d.name]]} />
      {d.img
        ? <ImageBanner name={d.img} alt={`${d.name}`}>{Head}</ImageBanner>
        : <div className="wrap">{Head}</div>}

      <div className="wrap" style={{ paddingTop: 44, paddingBottom: 110 }}>
        {cats.map((cat, i) => {
          const done = cat.subcategories.filter((sub) => conceptForSlot(d.id, sub)).length;
          return (
            <Reveal key={cat.id} delay={Math.min(i * 50, 260)}>
              <section className="cat">
                <div className="cat-head">
                  <h2>{cat.name}</h2>
                  <span className="cat-count">{done}/{cat.subcategories.length}</span>
                </div>
                <ul className="slots">
                  {cat.subcategories.map((sub) => {
                    const c = conceptForSlot(d.id, sub);
                    return c ? (
                      <li key={sub}>
                        <a className="slot live" href={`#/concept/${c.id}`}>
                          <span className="slot-dot" />
                          <span className="slot-name">{sub}</span>
                          <span className="slot-meta">{c.level}</span>
                          <span className="slot-go">→</span>
                        </a>
                      </li>
                    ) : (
                      <li key={sub}>
                        <div className="slot">
                          <span className="slot-dot planned" />
                          <span className="slot-name">{sub}</span>
                          <span className="slot-meta planned">Planned</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </Reveal>
          );
        })}

        {cats.length === 0 && (
          <div className="sub">
            <p className="body">
              This area is structured as its own experience rather than as a set of concepts.
              {d.route && <> Open it <a href={d.route} style={{ color: "var(--teal)", fontWeight: 600 }}>here</a>.</>}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function ConceptCard({ c }) {
  const { seen } = useContext(ProgressContext);
  const opened = seen.includes(c.id);
  return (
    <a className={"card link" + (opened ? " opened" : "")} href={`#/concept/${c.id}`}
      style={{ display: "block", height: "100%" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span className="badge">{c.level}</span>
        {c.formula && <span className="badge amber">Formula</span>}
        {c.sim && <span className="badge aqua">Interactive</span>}
        {opened && <span className="seen-tick" title="Opened this session">✓</span>}
      </div>
      <h3 style={{ marginTop: 14 }}>{c.title}</h3>
      <p className="small">{c.oneLine}</p>
    </a>
  );
}

function ConceptIndex() {
  const [level, setLevel] = useState("All");
  const levels = ["All", ...Array.from(new Set(CONCEPTS.map((c) => c.level)))];
  const list = CONCEPTS.filter((c) => level === "All" || c.level === level);
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Concepts"]]} />
      <div className="wrap" style={{ paddingBottom: 80 }}>
        <Reveal><h1 className="h-page">Concepts</h1></Reveal>
        <Reveal delay={70}>
          <p className="lede" style={{ marginTop: 14, maxWidth: "58ch" }}>
            Each concept moves from a plain definition to the mechanism, the arithmetic, the real
            use and the limits. Filter by depth.
          </p>
        </Reveal>
        <Reveal delay={100}><ProgressPanel /></Reveal>
        <div className="tabs" style={{ marginTop: 26 }}>
          {levels.map((l) => (
            <button key={l} className={"tab" + (l === level ? " on" : "")}
              onClick={() => setLevel(l)} aria-pressed={l === level}>{l}</button>
          ))}
        </div>
        <div className="grid g2">
          {list.map((c, i) => <Reveal key={c.id} delay={i * 50}><ConceptCard c={c} /></Reveal>)}
        </div>
      </div>
    </>
  );
}

/* ===========================================================================
   CONCEPT EXPLORER — the reference template
   Sections render only when the concept actually has them.
   =========================================================================== */

function Block({ id, title, children }) {
  return (
    <Reveal as="section" id={id} className="block">
      <h2>{title}</h2>
      {children}
    </Reveal>
  );
}

function ConceptPage({ id }) {
  const c = conceptById(id);
  const { mark } = useContext(ProgressContext);
  useEffect(() => { if (c) mark(c.id); }, [c, mark]);
  if (!c) return <NotFound />;
  const d = DOMAINS.find((x) => x.id === c.domain);
  const sections = [
    c.what && ["what", "What is it?"],
    c.simple && ["simple", "Simple explanation"],
    c.why && ["why", "Why it matters"],
    c.how && ["how", "How it works"],
    c.components && ["components", "Key components"],
    c.formula && ["formula", "Formula"],
    c.example && ["example", "Worked example"],
    c.interpretation && ["interpretation", "Interpretation"],
    c.application && ["application", "Application"],
    (c.advantages || c.limitations) && ["limits", "Strengths and limits"],
    c.misconceptions && ["misconceptions", "Common misconceptions"],
    c.realWorld && ["real", "In the real world"],
    ["connections", "Connected concepts"],
  ].filter(Boolean);

  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Universe", "#/universe"], [d?.name || "Domain", `#/domain/${c.domain}`], [c.title]]} />
      <div className="wrap chead">
        <Reveal>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="badge aqua">{c.level}</span>
            <span className="badge">{c.subcategory}</span>
          </div>
        </Reveal>
        <Reveal delay={60}><h1 style={{ marginTop: 16 }}>{c.title}</h1></Reveal>
        <Reveal delay={130}>
          <p className="lede" style={{ marginTop: 16, maxWidth: "62ch", fontSize: 18 }}>{c.oneLine}</p>
        </Reveal>
        {c.prereq?.length > 0 && (
          <Reveal delay={190}>
            <div className="chips" style={{ marginTop: 20 }}>
              <span className="small" style={{ fontSize: 12.5 }}>Read first:</span>
              {c.prereq.map((p) => conceptById(p) && (
                <a className="chip" key={p} href={`#/concept/${p}`}>{conceptById(p).title}</a>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      <div className="wrap clay">
        <nav className="toc" aria-label="On this page">
          {sections.map(([sid, label]) => <a key={sid} href={`#${sid}`}>{label}</a>)}
        </nav>
        <nav className="toc-m" aria-label="Jump to a section">
          {sections.map(([sid, label]) => <a key={sid} href={`#${sid}`}>{label}</a>)}
        </nav>

        <div style={{ minWidth: 0 }}>
          {c.what && <Block id="what" title="What is it?"><p className="body">{c.what}</p></Block>}

          {c.simple && (
            <Block id="simple" title="Simple explanation">
              <div className="sub" style={{ borderLeft: "2px solid var(--aqua)" }}>
                <p className="body" style={{ fontSize: 18.5, fontWeight: 500 }}>{c.simple}</p>
              </div>
            </Block>
          )}

          {c.why && <Block id="why" title="Why it matters"><p className="body">{c.why}</p></Block>}

          {c.how && (
            <Block id="how" title="How it works">
              <div className="steps">
                {c.how.map((h, i) => (
                  <div className="step" key={i}><i>{String(i + 1).padStart(2, "0")}</i><span className="body" style={{ fontSize: 16.5 }}>{h}</span></div>
                ))}
              </div>
            </Block>
          )}

          {c.components && (
            <Block id="components" title="Key components">
              <div className="grid g2">
                {c.components.map((k) => (
                  <div className="sub" key={k.k}>
                    <p style={{ fontWeight: 700, fontSize: 16 }}>{k.k}</p>
                    <p className="small" style={{ marginTop: 6 }}>{k.v}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {c.formula && (
            <Block id="formula" title="Formula">
              <div className="formula">{c.formula.main}</div>
              {c.formula.variables && (
                <div className="vars">
                  {c.formula.variables.map((v) => (
                    <div className="var" key={v.sym}><b>{v.sym}</b><span className="small" style={{ color: "#C7D2E6" }}>{v.desc}</span></div>
                  ))}
                </div>
              )}
              {c.formula.others?.length > 0 && (
                <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
                  {c.formula.others.map((o) => (
                    <div key={o.label}>
                      <p className="eyebrow" style={{ marginBottom: 7 }}>{o.label}</p>
                      <div className="formula" style={{ fontSize: 15, padding: 14 }}>{o.expr}</div>
                    </div>
                  ))}
                </div>
              )}
              {c.tool && (
                <p className="small" style={{ marginTop: 18 }}>
                  Move the numbers yourself in the {" "}
                  <a href={`#/tools?t=${c.tool}`} style={{ color: "var(--aqua)" }}>
                    {TOOLS.find((t) => t.id === c.tool)?.name.toLowerCase()}</a>.
                </p>
              )}
            </Block>
          )}

          {c.example && (
            <Block id="example" title="Worked example">
              <p className="body" style={{ marginBottom: 14 }}>{c.example.setup}</p>
              <div className="steps">
                {c.example.steps.map((s, i) => (
                  <div className="step" key={i}><i>{String(i + 1).padStart(2, "0")}</i>
                    <span className="mono calc" style={{ overflowWrap: "anywhere" }}>{s}</span></div>
                ))}
              </div>
              <div className="result">
                <span className="eyebrow">Result</span><b>{c.example.result}</b>
              </div>
              {c.example.note && <p className="small" style={{ marginTop: 14 }}>{c.example.note}</p>}
            </Block>
          )}

          {c.sim && SIMS[c.sim] && (
            <Block id="sim" title="Try it">
              <p className="body" style={{ marginBottom: 20 }}>{SIMS[c.sim].title}.</p>
              {React.createElement(SIMS[c.sim].el)}
            </Block>
          )}

          {c.interpretation && (
            <Block id="interpretation" title="Interpretation"><p className="body">{c.interpretation}</p></Block>
          )}

          {c.application && (
            <Block id="application" title="Application">
              <div className="list">
                {c.application.map((a, i) => <div className="li" key={i}><s>→</s><span>{a}</span></div>)}
              </div>
            </Block>
          )}

          {(c.advantages || c.limitations) && (
            <Block id="limits" title="Strengths and limits">
              <div className="grid g2">
                {c.advantages && (
                  <div className="sub">
                    <p className="kicker">Strengths</p>
                    <div className="list" style={{ marginTop: 12 }}>
                      {c.advantages.map((a, i) => <div className="li" key={i}><s>+</s><span style={{ fontSize: 16 }}>{a}</span></div>)}
                    </div>
                  </div>
                )}
                {c.limitations && (
                  <div className="sub">
                    <p className="kicker" style={{ color: "var(--rose)" }}>Limits</p>
                    <div className="list" style={{ marginTop: 12 }}>
                      {c.limitations.map((a, i) => <div className="li" key={i}><s style={{ color: "var(--rose)" }}>−</s><span style={{ fontSize: 16 }}>{a}</span></div>)}
                    </div>
                  </div>
                )}
              </div>
            </Block>
          )}

          {c.misconceptions && (
            <Block id="misconceptions" title="Common misconceptions">
              <div style={{ display: "grid", gap: 22 }}>
                {c.misconceptions.map((m, i) => (
                  <div className="mis" key={i}>
                    <b>{m.claim}</b>
                    <p className="body">{m.truth}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {c.realWorld && (
            <Block id="real" title="In the real world">
              <p className="body">{c.realWorld}</p>
              <div className="chips" style={{ marginTop: 18 }}>
                {c.scenarioRef && <a className="chip" href={`#/scenario/${c.scenarioRef}`}>Scenario: {SCENARIOS.find((s) => s.id === c.scenarioRef)?.title} →</a>}
                {c.caseRef && <a className="chip" href={`#/case/${c.caseRef}`}>Case study: {CASES.find((s) => s.id === c.caseRef)?.title} →</a>}
              </div>
            </Block>
          )}

          <Block id="connections" title="Connected concepts">
            <p className="small" style={{ maxWidth: "60ch" }}>
              Every line is a relationship recorded in the FinHub knowledge graph. Select a node to move to it.
            </p>
            <div className="card stage" style={{ marginTop: 18, padding: 20, borderRadius: 14 }}>
              <ConceptGraph id={c.id} />
            </div>
            <References id={c.id} />
            {c.next?.length > 0 && (
              <div style={{ marginTop: 26 }}>
                <p className="eyebrow" style={{ marginBottom: 12 }}>Read next</p>
                <div className="grid g2">
                  {c.next.map((n) => conceptById(n) && <ConceptCard key={n} c={conceptById(n)} />)}
                </div>
              </div>
            )}
          </Block>
        </div>
      </div>
    </>
  );
}

/* ===========================================================================
   CASES, FRAUDS, SCENARIOS, HISTORY
   =========================================================================== */

function CaseIndex() {
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Case studies"]]} />
      <div className="wrap" style={{ paddingBottom: 80 }}>
        <Reveal><h1 className="h-page">Case studies</h1></Reveal>
        <Reveal delay={70}>
          <p className="lede" style={{ marginTop: 14, maxWidth: "60ch" }}>
            Each case runs from background to lessons, and names the concepts that explain the outcome.
            Constructed teaching cases are labelled as such.
          </p>
        </Reveal>
        <div className="grid g2" style={{ marginTop: 32 }}>
          {CASES.map((c, i) => (
            <Reveal key={c.id} delay={i * 70}>
              <a className="card link" href={`#/case/${c.id}`} style={{ display: "block", height: "100%" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge aqua">{c.tag}</span><span className="badge">{c.type}</span>
                </div>
                <h3 style={{ marginTop: 14 }}>{c.title}</h3>
                <p className="small">{c.problem}</p>
              </a>
            </Reveal>
          ))}
          {FRAUDS.map((f) => (
            <Reveal key={f.id} delay={140}>
              <a className="card link" href={`#/fraud/${f.id}`} style={{ display: "block", height: "100%" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge rose">Fraud</span><span className="badge">{f.period}</span>
                </div>
                <h3 style={{ marginTop: 14 }}>{f.title}</h3>
                <p className="small">{f.happened}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

const Section = ({ title, children }) => (
  <Reveal className="block"><h2>{title}</h2>{children}</Reveal>
);

function ConceptChips({ ids, label = "Concepts involved" }) {
  const list = (ids || []).map(conceptById).filter(Boolean);
  if (!list.length) return null;
  return (
    <>
      <p className="eyebrow" style={{ marginBottom: 10 }}>{label}</p>
      <div className="chips">
        {list.map((c) => <a className="chip" key={c.id} href={`#/concept/${c.id}`}>{c.title} →</a>)}
      </div>
    </>
  );
}

function CasePage({ id }) {
  const c = CASES.find((x) => x.id === id);
  if (!c) return <NotFound />;
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Case studies", "#/cases"], [c.title]]} />
      <div className="wrap chead">
        <Reveal>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="badge aqua">{c.tag}</span><span className="badge">{c.type}</span>
          </div>
        </Reveal>
        <Reveal delay={60}><h1 style={{ marginTop: 16 }}>{c.title}</h1></Reveal>
        {c.note && <Reveal delay={120}><p className="small" style={{ marginTop: 14, maxWidth: "62ch" }}>{c.note}</p></Reveal>}
      </div>
      {c.img && (
        <div className="wrap-n" style={{ paddingTop: 34 }}>
          <Reveal><FinImage name={c.img} alt={`Illustration for ${c.title}`}
            caption="An interpretation of the mechanism at the centre of this case." /></Reveal>
        </div>
      )}
      <div className="wrap-n" style={{ paddingBottom: 80 }}>
        <Section title="Background"><p className="body">{c.background}</p></Section>
        <Section title="Situation"><p className="body">{c.situation}</p></Section>
        <Section title="The financial problem"><p className="body">{c.problem}</p></Section>
        {c.visual && (
          <Reveal className="block">
            <h2>The mechanism</h2>
            <MechanismVisual type={c.visual} caption={c.visualCaption} />
          </Reveal>
        )}
        <Section title="Relevant concepts"><ConceptChips ids={c.concepts} label="" /></Section>
        <Section title="Analysis">
          <div className="steps">
            {c.analysis.map((a, i) => (
              <div className="step" key={i}><i>{String(i + 1).padStart(2, "0")}</i><span className="body" style={{ fontSize: 16.5 }}>{a}</span></div>
            ))}
          </div>
        </Section>
        <Section title="Decision"><p className="body">{c.decision}</p></Section>
        <Section title="Outcome"><p className="body">{c.outcome}</p></Section>
        <Section title="Lessons">
          <div className="list">{c.lessons.map((l, i) => <div className="li" key={i}><s>→</s><span>{l}</span></div>)}</div>
        </Section>
        <Section title="Connected concepts"><ConceptChips ids={c.connected} label="" /></Section>
        <SourceList sources={c.sources} note={c.sourceNote} />
        <References id={c.id} />
      </div>
    </>
  );
}

function FraudPage({ id }) {
  const f = FRAUDS.find((x) => x.id === id);
  if (!f) return <NotFound />;
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Case studies", "#/cases"], [f.title]]} />
      <div className="wrap chead">
        <Reveal>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="badge rose">Financial fraud</span><span className="badge">{f.period}</span>
          </div>
        </Reveal>
        <Reveal delay={60}><h1 style={{ marginTop: 16 }}>{f.title}</h1></Reveal>
        <Reveal delay={120}><p className="small" style={{ marginTop: 14, maxWidth: "62ch" }}>{f.note}</p></Reveal>
      </div>
      {f.img && (
        <div className="wrap-n" style={{ paddingTop: 34 }}>
          <Reveal><FinImage name={f.img} alt={`Illustration for ${f.title}`}
            caption="An illustration of the mechanism. Any figures shown within the artwork are illustrative only — the reported facts are in the text below." /></Reveal>
        </div>
      )}
      <div className="wrap-n" style={{ paddingBottom: 80 }}>
        <Section title="Background"><p className="body">{f.background}</p></Section>
        <Section title="What happened"><p className="body">{f.happened}</p></Section>
        <Section title="How the mechanism worked">
          <div className="steps">
            {f.mechanism.map((m, i) => (
              <div className="step" key={i}><i>{String(i + 1).padStart(2, "0")}</i><span className="body" style={{ fontSize: 16.5 }}>{m}</span></div>
            ))}
          </div>
        </Section>
        {f.visual && (
          <Reveal className="block">
            <h2>The mechanism, drawn</h2>
            <MechanismVisual type={f.visual} caption={f.visualCaption} />
          </Reveal>
        )}
        <Section title="Financial concepts involved"><ConceptChips ids={f.conceptsInvolved} label="" /></Section>
        <Section title="Warning signs">
          <div className="list">
            {f.warnings.map((w, i) => <div className="li" key={i}><s style={{ color: "var(--rose)" }}>!</s><span>{w}</span></div>)}
          </div>
        </Section>
        <Section title="Impact"><p className="body">{f.impact}</p></Section>
        <Section title="Response and investigation"><p className="body">{f.response}</p></Section>
        <Section title="Lessons">
          <div className="list">{f.lessons.map((l, i) => <div className="li" key={i}><s>→</s><span>{l}</span></div>)}</div>
        </Section>
        <SourceList sources={f.sources} note={f.sourceNote} />
        <References id={f.id} />
      </div>
    </>
  );
}

function ScenarioIndex() {
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Scenarios"]]} />
      <div className="wrap" style={{ paddingBottom: 80 }}>
        <Reveal><h1 className="h-page">Scenario analysis</h1></Reveal>
        <Reveal delay={70}>
          <p className="lede" style={{ marginTop: 14, maxWidth: "60ch" }}>
            One event, followed step by step from mechanism through to financial implication.
            Each step names the concept doing the work.
          </p>
        </Reveal>
        <div className="grid g2" style={{ marginTop: 32 }}>
          {SCENARIOS.map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <a className="card link" href={`#/scenario/${s.id}`} style={{ display: "block", height: "100%" }}>
                <span className="badge aqua">{s.tag}</span>
                <h3 style={{ marginTop: 14 }}>{s.title}</h3>
                <p className="small">{s.question}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

function ScenarioPage({ id }) {
  const s = SCENARIOS.find((x) => x.id === id);
  const [open, setOpen] = useState(0);
  if (!s) return <NotFound />;
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Scenarios", "#/scenarios"], [s.title]]} />
      <div className="wrap chead">
        <Reveal><span className="badge aqua">{s.tag}</span></Reveal>
        <Reveal delay={60}><h1 style={{ marginTop: 16 }}>{s.title}</h1></Reveal>
        <Reveal delay={120}><p className="lede" style={{ marginTop: 14 }}>{s.question}</p></Reveal>
      </div>
      <div className="wrap-n" style={{ padding: "36px 20px 80px" }}>
        <p className="small" style={{ marginBottom: 20 }}>
          Select a step to expand it. The chain reads top to bottom.
        </p>
        <div className="flow">
          {s.chain.map((step, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="fstep" style={{ borderColor: open === i ? "var(--aqua-dim)" : "var(--line)" }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
                  style={{ display: "block", width: "100%", textAlign: "left" }}>
                  <p className="fstage">{step.stage}</p>
                  <p className="body" style={{ fontSize: open === i ? 16 : 15.5, color: open === i ? "#C7D2E6" : "var(--muted)" }}>
                    {step.text}
                  </p>
                </button>
                {open === i && <div className="chips"><ConceptChips ids={step.concepts} label="" /></div>}
              </div>
              {i < s.chain.length - 1 && <div className="fconn" />}
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="sub" style={{ marginTop: 32, borderLeft: "2px solid var(--amber)" }}>
            <p className="kicker" style={{ color: "var(--amber)" }}>A caution on scenarios</p>
            <p className="small" style={{ marginTop: 8 }}>{s.caveat}</p>
          </div>
        </Reveal>
      </div>
    </>
  );
}


/* ===========================================================================
   ORIGINS OF FINANCE
   Two traditions, read side by side. The Indian record is not an appendix to
   the European one — both are shown on the same timeline, because both were
   solving the same problems at their own pace.
   Content can be extended or replaced entirely via fin-data/origins.json.
   =========================================================================== */

const ORIGINS = {
  intro: "Finance did not begin with markets. It began with the problem of trust across time and distance — how to record a debt, move value without moving goods, fund something larger than one person could afford, and hold a treasury to account. Every society that traded at scale arrived at these problems, and each built instruments to solve them.",
  eras: [
    {
      period: "Earliest records",
      india: {
        head: "Early coinage and recorded exchange",
        text: "Punch-marked silver coins circulated across the subcontinent from around the middle of the first millennium BCE, placing India among the earlier coin-using regions. Vedic and later texts refer to debt, interest and repayment obligations, indicating that lending was already a recognised social and legal matter rather than an informal practice.",
      },
      world: {
        head: "Recording debt before recording money",
        text: "In Mesopotamia, clay tablets recorded quantities owed long before coinage existed. Lydia in Asia Minor is generally credited with early standardised coinage in the same broad period. In both cases the written record of obligation preceded the coin itself.",
      },
    },
    {
      period: "Statecraft and public finance",
      india: {
        head: "The Arthashastra",
        text: "The Arthashastra, attributed to Kautilya (also known as Chanakya), is a systematic treatise on statecraft that devotes substantial attention to what we would now call public finance: the management of the treasury, principles of taxation, control of expenditure, audit of accounts, penalties for misappropriation by officials, and the state's role in regulating trade and prices. Its treatment of revenue administration and audit is among the earliest systematic writing on the subject anywhere.",
        note: "Dating is debated among historians, with estimates ranging from the 4th century BCE to the early centuries CE, and the text likely reached its present form over time.",
      },
      world: {
        head: "Temple treasuries and public revenue",
        text: "Greek and Roman practice developed public treasuries, tax farming and state contracting. Rome operated a sophisticated system of public revenue collection and state expenditure, though its theoretical treatment was less systematic than its administration.",
      },
    },
    {
      period: "Pooled capital and credit instruments",
      india: {
        head: "Śreṇi and the hundi",
        text: "Śreṇi — merchant and craft guilds — pooled capital, held recognised legal standing, could own property collectively and lent to members, functioning in some respects as corporate bodies. The hundi, an indigenous bill of exchange, allowed a merchant to deposit money in one city and have it paid out in another, moving value across long distances without moving coin. Hundis remained in wide commercial use into the modern era.",
      },
      world: {
        head: "Bills of exchange and Italian banking",
        text: "Medieval Italian banking houses developed the bill of exchange for the same reason: to settle trade across cities without transporting bullion. Double-entry bookkeeping was formalised in this period, and its description by Luca Pacioli in 1494 spread the method across Europe.",
      },
    },
    {
      period: "Trade finance across the Indian Ocean",
      india: {
        head: "Financing long-distance trade",
        text: "Indian Ocean commerce linked the subcontinent with East Africa, Arabia and Southeast Asia for centuries. Financing it required credit extended over long voyages, risk sharing between merchants and shippers, and mechanisms to settle across currencies and jurisdictions — an established commercial finance system operating well before European maritime expansion.",
      },
      world: {
        head: "Joint stock and the first exchanges",
        text: "The joint stock company allowed many investors to fund voyages too large and too risky for any one merchant, with ownership divided into transferable shares. Amsterdam developed an active secondary market in such shares in the early seventeenth century, an early instance of continuous exchange trading.",
      },
    },
    {
      period: "Banking and central authority",
      india: {
        head: "Indigenous bankers and the colonial system",
        text: "Indigenous banking families financed rulers, armies and trade across the subcontinent. Under colonial administration, European-style banking institutions were established, and the financial system was progressively reorganised around them. The Bombay Stock Exchange traces its origins to 1875, making it one of Asia's oldest exchanges. The Reserve Bank of India was established in 1935.",
      },
      world: {
        head: "Central banks and public debt",
        text: "The Bank of England was founded in 1694, initially to lend to the state, and central banking gradually acquired its modern roles — currency issue, lender of last resort, and eventually responsibility for price stability. Government bond markets grew alongside, giving lending to the state a market price.",
      },
    },
    {
      period: "The modern era",
      india: {
        head: "Nationalisation, liberalisation and digital finance",
        text: "Major banks were nationalised in 1969, extending banking into rural areas on a large scale. Economic liberalisation from 1991 opened markets to foreign investment and competition. SEBI was given statutory powers in 1992 following major market scandals. The National Stock Exchange introduced electronic screen-based trading, and dematerialisation removed physical share certificates. More recently, India has built one of the world's largest real-time retail payment systems.",
      },
      world: {
        head: "Global markets and their crises",
        text: "The twentieth century brought floating exchange rates after 1971, the growth of derivatives markets, and increasingly integrated global capital flows. It also brought repeated crises — 1929, 1987, 1997, 2008 — each reshaping regulation, and each demonstrating that connection transmits failure as efficiently as it transmits capital.",
      },
    },
  ],
  closing: "Read together, the two threads make one point. The instruments differ, but the problems are constant: how to move value safely, how to fund something larger than yourself, how to price time and risk, and how to hold those who manage other people's money to account. Every concept in FinHub is an answer to one of those four questions.",
};

function OriginsPage({ data }) {
  const d = data && Array.isArray(data.eras) ? data : ORIGINS;
  const [open, setOpen] = useState(0);
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Origins of finance"]]} />
      <div className="wrap">
        <Reveal><p className="kicker">Where it began</p></Reveal>
        <Reveal delay={60}><h1 className="h-page" style={{ marginTop: 12 }}>Origins of Finance</h1></Reveal>
        <Reveal delay={120}>
          <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>{d.intro}</p>
        </Reveal>
        <Reveal delay={180}>
          <div className="org-key">
            <span><i className="k-india" /> Indian tradition</span>
            <span><i className="k-world" /> Elsewhere in the world</span>
          </div>
        </Reveal>
      </div>

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 90 }}>
        {d.eras.map((era, i) => (
          <Reveal key={era.period} delay={Math.min(i * 60, 300)}>
            <section className={"org" + (open === i ? " on" : "")}>
              <button className="org-head" onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}>
                <span className="org-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="org-t">{era.period}</span>
                <span className="org-x">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="org-body">
                  <div className="org-col india">
                    <p className="org-tag">Indian tradition</p>
                    <h3>{era.india.head}</h3>
                    <p className="body" style={{ marginTop: 10 }}>{era.india.text}</p>
                    {era.india.note && <p className="small" style={{ marginTop: 12 }}>{era.india.note}</p>}
                  </div>
                  <div className="org-col world">
                    <p className="org-tag">Elsewhere</p>
                    <h3>{era.world.head}</h3>
                    <p className="body" style={{ marginTop: 10 }}>{era.world.text}</p>
                  </div>
                </div>
              )}
            </section>
          </Reveal>
        ))}

        <Reveal>
          <div className="org-close">
            <p className="body" style={{ fontSize: 18.5 }}>{d.closing}</p>
            <div className="chips" style={{ marginTop: 22 }}>
              <a className="chip" href="#/concept/money">Money →</a>
              <a className="chip" href="#/concept/interest">Interest →</a>
              <a className="chip" href="#/concept/central-banking">Central banking →</a>
              <a className="chip" href="#/history">Financial history →</a>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}

/* ===========================================================================
   THE HISTORY OF MARKETS
   Oldest to present, Indian and global on one timeline. Each era carries an
   artifact you operate rather than only text, because the change from two week
   settlement to two second settlement is felt, not read.
   =========================================================================== */

/* --- Artifact 1: settlement in the certificate era --------------------- */
function ArtSettlement() {
  const [era, setEra] = useState(0);
  const ERAS = [
    { name: "Certificate era", days: 14, label: "T+14", risk: "high",
      note: "Physical certificates and transfer deeds moved by hand and by post. Until settlement completed, each side carried the risk that the other would not perform." },
    { name: "Account period", days: 7, label: "T+7", risk: "high",
      note: "Trades were grouped into an account period and settled together at the end of it. Positions could be carried forward, which allowed exposure without payment." },
    { name: "Rolling settlement", days: 3, label: "T+3", risk: "medium",
      note: "Each day's trades settled on their own cycle. Carry forward ended, so a position had to be paid for or closed." },
    { name: "Electronic", days: 2, label: "T+2", risk: "low",
      note: "Dematerialised holdings and electronic funds transfer removed the physical movement of documents entirely." },
    { name: "Present", days: 1, label: "T+1", risk: "low",
      note: "Settlement completes the working day after the trade. Indian exchanges moved to this cycle in phases through 2022 and 2023." },
  ];
  const e = ERAS[era];
  const pct = (e.days / 14) * 100;

  return (
    <div className="sim">
      <div className="art-tabs" role="tablist" aria-label="Settlement era">
        {ERAS.map((x, i) => (
          <button key={x.name} role="tab" aria-selected={i === era}
            className={"tab" + (i === era ? " on" : "")} onClick={() => setEra(i)}>{x.label}</button>
        ))}
      </div>

      <div className="settle">
        <div className="settle-row">
          <span className="settle-tag">Trade agreed</span>
          <span className="settle-tag">Settlement completes</span>
        </div>
        <div className="settle-track">
          <div className="settle-gap" style={{ width: `${pct}%` }}>
            <span>{e.days} {e.days === 1 ? "day" : "days"} of open risk</span>
          </div>
          <span className="settle-dot start" />
          <span className="settle-dot end" style={{ left: `${pct}%` }} />
        </div>
      </div>

      <div className="sim-out">
        <div><span>Era</span><b>{e.name}</b></div>
        <div><span>Settlement cycle</span><b className="hi">{e.label}</b></div>
        <div><span>Counterparty risk window</span>
          <b className={e.risk === "high" ? "bad" : "hi"}>{e.days} {e.days === 1 ? "day" : "days"}</b></div>
      </div>
      <p className="sim-note">{e.note}</p>
    </div>
  );
}

/* --- Artifact 2: open outcry against an order book --------------------- */
function ArtMatching() {
  const [mode, setMode] = useState("floor");
  const orders = [
    { who: "Broker A", price: 101.5, qty: 200 },
    { who: "Broker B", price: 100.8, qty: 500 },
    { who: "Broker C", price: 100.2, qty: 300 },
    { who: "Broker D", price: 99.6, qty: 400 },
  ];
  const floorFill = orders[0];
  const bookFill = orders[3];

  return (
    <div className="sim">
      <div className="art-tabs" role="tablist" aria-label="Matching method">
        <button role="tab" aria-selected={mode === "floor"}
          className={"tab" + (mode === "floor" ? " on" : "")} onClick={() => setMode("floor")}>Open outcry</button>
        <button role="tab" aria-selected={mode === "book"}
          className={"tab" + (mode === "book" ? " on" : "")} onClick={() => setMode("book")}>Electronic order book</button>
      </div>

      <p className="small" style={{ marginBottom: 16 }}>
        You are buying 200 shares. Four brokers are willing to sell.
      </p>

      <ul className="book">
        {orders.map((o, i) => {
          const win = mode === "floor" ? i === 0 : i === 3;
          return (
            <li key={o.who} className={"book-row" + (win ? " win" : "")}>
              <span className="book-who">{o.who}</span>
              <span className="book-bar" style={{ width: `${(o.qty / 500) * 100}%` }} />
              <span className="book-price">₹{o.price.toFixed(2)}</span>
              {win && <span className="book-tag">Filled here</span>}
            </li>
          );
        })}
      </ul>

      <div className="sim-out">
        <div><span>Your fill price</span>
          <b className="hi">₹{(mode === "floor" ? floorFill.price : bookFill.price).toFixed(2)}</b></div>
        <div><span>Cost for 200 shares</span>
          <b>₹{fmt((mode === "floor" ? floorFill.price : bookFill.price) * 200, 2)}</b></div>
        <div><span>Against the best price</span>
          <b className={mode === "floor" ? "bad" : "hi"}>
            {mode === "floor" ? `₹${fmt((floorFill.price - bookFill.price) * 200, 2)} worse` : "Best available"}</b></div>
      </div>
      <p className="sim-note">
        {mode === "floor"
          ? "On a trading floor an order was filled by whoever was heard first, not necessarily by whoever offered the best price. Execution quality depended on access and proximity."
          : "An electronic book sorts every order by price, then by time. The buyer meets the lowest offer automatically, regardless of who placed it or where they are."}
      </p>
    </div>
  );
}

/* --- Artifact 3: what one trade used to cost --------------------------- */
function ArtCost() {
  const [value, setValue] = useState(50000);
  const rows = [
    { era: "Floor, full service", pct: 1.0, extra: "Stamp duty and transfer fees on physical documents", tone: "bad" },
    { era: "Early online broking", pct: 0.5, extra: "Lower, but still a percentage of value", tone: "" },
    { era: "Discount broking", pct: 0.03, extra: "Flat fee per order rather than a percentage", tone: "hi", flat: 20 },
  ];
  return (
    <div className="sim">
      <div className="sim-controls">
        <Slider label="Trade value" value={value} set={setValue} min={5000} max={500000} step={5000} suffix=" ₹" />
      </div>
      <div className="costs">
        {rows.map((r) => {
          const c = r.flat ? Math.min(r.flat, value * (r.pct / 100)) : value * (r.pct / 100);
          const w = Math.min(100, (c / (value * 0.01)) * 100);
          return (
            <div className="cost-row" key={r.era}>
              <div className="cost-head">
                <span>{r.era}</span>
                <b className={r.tone}>₹{fmt(c, 2)}</b>
              </div>
              <div className="cost-bar"><span style={{ width: `${w}%` }} className={r.tone} /></div>
              <p className="small">{r.extra}</p>
            </div>
          );
        })}
      </div>
      <p className="sim-note">
        Brokerage is illustrative of the model in each era rather than a quoted rate. What changed was the
        structure: a percentage of value became a flat fee per order, which made small trades viable for
        the first time.
      </p>
    </div>
  );
}

const HIST_ART = { settlement: ArtSettlement, matching: ArtMatching, cost: ArtCost };

const MARKET_HISTORY = {
  intro: "Markets did not become fast, cheap and open in one step. Each stage solved a problem the previous stage created, and each solution introduced a new one. Read in order, the sequence explains why a share can now be bought in seconds from a phone, and why that took several centuries to arrange.",
  eras: [
    {
      period: "Before exchanges",
      years: "Antiquity to the 1500s",
      india: "Merchant guilds pooled capital and shared the risk of long voyages. The hundi allowed value to move between cities without moving coin, functioning as a credit instrument across the trading networks of the subcontinent and the Indian Ocean.",
      world: "Merchants met at fairs and in commodity houses to trade goods, debts and shipping ventures. Bills of exchange developed in Italian banking to settle trade across cities without transporting bullion.",
      point: "Capital could already be pooled and moved. What did not yet exist was a continuous market in transferable ownership.",
    },
    {
      period: "Joint stock and the first exchanges",
      years: "1600s to 1800s",
      india: "Trade with Europe was conducted largely through chartered companies. Indigenous banking families financed rulers, armies and commerce across the subcontinent, but there was no organised exchange in transferable shares.",
      world: "The joint stock company divided ownership into transferable shares, allowing ventures too large for any single merchant. Amsterdam developed an active secondary market in such shares in the early seventeenth century. The London Stock Exchange was formally established in 1801, and the New York Stock Exchange traces its origin to an agreement among brokers in 1792.",
      point: "Once ownership could be transferred, a price for it had to exist. The exchange was the answer to that requirement.",
    },
    {
      period: "The certificate era",
      years: "1875 to the 1980s",
      india: "Brokers trading under a banyan tree in Bombay formalised their association in 1875, which became the Bombay Stock Exchange, among the oldest in Asia. Trading was conducted by open outcry and settled by the physical delivery of share certificates and transfer deeds.",
      world: "Exchanges everywhere operated the same way: a trading floor, brokers shouting prices, and clerks reconciling by hand. Ownership was proved by a piece of paper, which could be lost, forged or delayed in transfer.",
      point: "Ownership was physical, so settlement was slow and risky. The gap between agreeing a trade and completing it was where most of the risk lived.",
      artifact: "settlement",
      artifactTitle: "How long a trade stayed open",
    },
    {
      period: "The floor and its limits",
      years: "1950s to 1990s",
      india: "Access to the market ran through a broker who was physically present on the floor. Prices were not visible to the public in real time, and the quality of execution depended on the relationship rather than on the order.",
      world: "The same structure held internationally. The floor concentrated liquidity in one place, which was efficient, but it also concentrated advantage among those standing on it.",
      point: "The floor worked, and it favoured whoever was closest to it.",
      artifact: "matching",
      artifactTitle: "Who your order actually met",
    },
    {
      period: "Screens replace the floor",
      years: "1990s",
      india: "The National Stock Exchange began operations in the mid 1990s with screen based trading, extending access beyond a single city. Prices became visible to everyone at once, and orders were matched by price and time priority rather than by proximity.",
      world: "Nasdaq had operated as an electronic quotation system since 1971. Through the 1990s, exchanges across the United States, Europe and Asia moved from floors to electronic matching.",
      point: "Once matching became a computation rather than a conversation, location stopped conferring advantage.",
    },
    {
      period: "Dematerialisation",
      years: "Late 1990s to 2000s",
      india: "Depositories were established and shares moved from certificates to electronic records. The Depositories Act of 1996 provided the legal basis. Settlement moved to a rolling cycle, and carry forward trading was discontinued after the market events of 2001.",
      world: "Central securities depositories replaced physical certificates across major markets, and settlement cycles shortened steadily as reconciliation became electronic.",
      point: "Removing the paper removed the delay. Settlement risk fell because there was nothing left to physically move.",
    },
    {
      period: "The market in a pocket",
      years: "2010s to present",
      india: "Discount brokerage moved pricing from a percentage of trade value to a flat fee per order, and account opening moved online. Settlement moved to a one day cycle in phases through 2022 and 2023. The combination of low cost, quick onboarding and mobile access brought a large number of first time participants into the market.",
      world: "Zero and low commission platforms spread across the United States and Europe, and mobile first broking became the standard route for retail participation. Falling cost and falling friction changed who participates, and how often.",
      point: "The barrier stopped being cost or access, and became knowledge. That is the barrier this platform exists to address.",
      artifact: "cost",
      artifactTitle: "What one trade used to cost",
    },
  ],
  closing: "Four centuries of change reduce to one direction: the distance between an investor and a market kept shrinking. Physical certificates became electronic records, floors became matching engines, weeks became a day, and a percentage became a flat fee. Every barrier that fell was a barrier of cost, access or delay. The one that remains is understanding.",
  sources: [
    { title: "Handbook of Statistics on the Indian Securities Market", publisher: "Securities and Exchange Board of India" },
    { title: "The Depositories Act, 1996", publisher: "Government of India", year: "1996" },
    { title: "Circulars on the transition to the T+1 settlement cycle", publisher: "Securities and Exchange Board of India", year: "2021-2023" },
    { title: "Report of the Joint Parliamentary Committee on stock market scam and matters relating thereto", publisher: "Parliament of India", year: "2002" },
    { title: "Exchange histories published by the London Stock Exchange, the New York Stock Exchange and Nasdaq", publisher: "Respective exchanges" },
  ],
};

function MarketHistoryPage({ data }) {
  const d = data && Array.isArray(data.eras) ? data : MARKET_HISTORY;
  const [open, setOpen] = useState(0);
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["History of markets"]]} />
      <div className="wrap">
        <Reveal><p className="kicker">From paper to phone</p></Reveal>
        <Reveal delay={60}><h1 className="h-page" style={{ marginTop: 12 }}>The History of Markets</h1></Reveal>
        <Reveal delay={120}><p className="lede" style={{ marginTop: 18, maxWidth: "64ch" }}>{d.intro}</p></Reveal>
      </div>

      <div className="wrap" style={{ paddingTop: 44, paddingBottom: 90 }}>
        {d.eras.map((era, i) => {
          const Art = era.artifact ? HIST_ART[era.artifact] : null;
          const isOpen = open === i;
          return (
            <Reveal key={era.period} delay={Math.min(i * 50, 260)}>
              <section className={"era" + (isOpen ? " on" : "")}>
                <button className="era-head" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span className="era-rail">
                    <span className="era-dot" />
                  </span>
                  <span className="era-main">
                    <span className="era-years">{era.years}</span>
                    <span className="era-title">{era.period}</span>
                  </span>
                  {era.artifact && <span className="era-badge">Interactive</span>}
                  <span className="era-x">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="era-body">
                    <div className="era-cols">
                      <div className="era-col india">
                        <p className="org-tag">India</p>
                        <p className="body" style={{ fontSize: 16.5 }}>{era.india}</p>
                      </div>
                      <div className="era-col world">
                        <p className="org-tag">Elsewhere</p>
                        <p className="body" style={{ fontSize: 16.5 }}>{era.world}</p>
                      </div>
                    </div>
                    <p className="era-point">{era.point}</p>
                    {Art && (
                      <div className="era-art">
                        <p className="eyebrow" style={{ marginBottom: 14 }}>{era.artifactTitle}</p>
                        <Art />
                      </div>
                    )}
                  </div>
                )}
              </section>
            </Reveal>
          );
        })}

        <Reveal>
          <div className="org-close">
            <p className="body" style={{ fontSize: 18.5 }}>{d.closing}</p>
            <div className="chips" style={{ marginTop: 22 }}>
              <a className="chip" href="#/concept/equity-markets">Equity markets →</a>
              <a className="chip" href="#/concept/price-discovery">Price discovery →</a>
              <a className="chip" href="#/origins">Origins of finance →</a>
            </div>
          </div>
        </Reveal>

        {d.sources && (
          <Reveal>
            <div style={{ marginTop: 44 }}>
              <SourceList sources={d.sources}
                note="Dates and legislative references are drawn from the public record. Figures that change over time are deliberately not quoted." />
            </div>
          </Reveal>
        )}
      </div>
    </>
  );
}

function HistoryPage() {
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Financial history"]]} />
      <div className="wrap-n" style={{ paddingBottom: 80 }}>
        <Reveal><h1 className="h-page">Financial history</h1></Reveal>
        <Reveal delay={70}>
          <p className="lede" style={{ marginTop: 14 }}>
            Each stage solved a problem the previous one created. Read in order, the sequence
            explains why modern finance looks the way it does.
          </p>
        </Reveal>
        <div style={{ marginTop: 40 }}>
          {HISTORY.map((h, i) => (
            <Reveal key={h.era} delay={i * 60}>
              <div style={{ display: "grid", gridTemplateColumns: "24px minmax(0,1fr)", gap: 20, paddingBottom: 30 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--aqua)", marginTop: 8, flex: "none" }} />
                  {i < HISTORY.length - 1 && <span style={{ flex: 1, width: 1, background: "var(--line)", marginTop: 6 }} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 19 }}>{h.era}</h3>
                  <p className="body" style={{ marginTop: 8, fontSize: 15.5 }}>{h.text}</p>
                  {h.concepts.length > 0 && <div className="chips" style={{ marginTop: 12 }}><ConceptChips ids={h.concepts} label="" /></div>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---- knowledge graph page ---- */

/* One relationship explorer, used on the landing page and the graph page.
   Selecting a concept changes the map, and the map is the navigation. */
function GraphExplorer({ initial = "inflation", showOpen = true }) {
  const [focus, setFocus] = useState(initial);
  const c = conceptById(focus) || CONCEPTS[0];
  return (
    <div className="explorer">
      <div className="explorer-picker" role="tablist" aria-label="Choose a concept">
        {CONCEPTS.slice(0, 24).map((x) => (
          <button key={x.id} role="tab" aria-selected={focus === x.id}
            className={"tab" + (focus === x.id ? " on" : "")} onClick={() => setFocus(x.id)}>
            {x.title}
          </button>
        ))}
      </div>
      <div className="card stage explorer-map">
        <ConceptGraph id={c.id} key={c.id} />
      </div>
      {showOpen && (
        <div className="explorer-foot">
          <p className="small" style={{ maxWidth: "52ch" }}>{c.oneLine}</p>
          <a className="btn ghost" href={`#/concept/${c.id}`}>Open {c.title} →</a>
        </div>
      )}
    </div>
  );
}

function GraphPage() {
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Knowledge graph"]]} />
      <div className="wrap" style={{ paddingBottom: 110 }}>
        <Reveal><h1 className="h-page">The knowledge graph</h1></Reveal>
        <Reveal delay={70}>
          <p className="lede" style={{ marginTop: 18, maxWidth: "56ch" }}>
            {CONCEPTS.length} concepts and {EDGES.length} recorded relationships. Choose a concept
            to see what it touches, then select any node to move to it.
          </p>
        </Reveal>
        <div style={{ marginTop: 48 }}><GraphExplorer initial="inflation" /></div>
      </div>
    </>
  );
}

/* ===========================================================================
   GLOSSARY
   =========================================================================== */

function Glossary() {
  const [q, setQ] = useState("");
  const list = GLOSSARY.filter((g) =>
    (g.term + " " + g.def + " " + g.simple).toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Glossary"]]} />
      <div className="wrap-n" style={{ paddingBottom: 110 }}>
        <Reveal><h1 className="h-page">Glossary</h1></Reveal>
        <Reveal delay={70}>
          <p className="lede" style={{ marginTop: 18 }}>
            The precise definition, then the same idea in plain words, then the route into the
            concept behind it.
          </p>
        </Reveal>

        <div className="field" style={{ marginTop: 30, maxWidth: 440 }}>
          <label htmlFor="gq">Filter terms</label>
          <input id="gq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. duration" />
        </div>

        <p className="small" style={{ marginBottom: 10 }}>
          {list.length} {list.length === 1 ? "term" : "terms"}
        </p>

        {list.length === 0 && (
          <p className="body" style={{ paddingTop: 20 }}>No term matches “{q}”.</p>
        )}

        <div className="gloss">
          {list.map((g, i) => (
            <Reveal key={g.term} delay={Math.min(i * 30, 200)}>
              <div className="gloss-item">
                <h2 className="gloss-term">{g.term}</h2>
                <div style={{ minWidth: 0 }}>
                  <p className="gloss-def">{g.def}</p>
                  <p className="gloss-simple">{g.simple}</p>
                  {g.formula && <div className="gloss-f">{g.formula}</div>}
                  {conceptById(g.link) && (
                    <div>
                      <a className="gloss-link" href={`#/concept/${g.link}`}>
                        {conceptById(g.link).title} →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

/* ===========================================================================
   TOOLS — every calculator is real arithmetic
   =========================================================================== */

const fmt = (n, d = 0) => isFinite(n)
  ? n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d })
  : "—";

/* ===========================================================================
   CONCEPT SIMULATORS
   A concept gets one only when moving a number teaches something a sentence
   cannot. Each is real arithmetic — the same formulas printed above it — and
   redraws live as the input moves.
   =========================================================================== */

function Slider({ label, value, set, min, max, step = 1, suffix = "" }) {
  return (
    <div className="sl">
      <div className="sl-top">
        <label htmlFor={label}>{label}</label>
        <b>{value}{suffix}</b>
      </div>
      <input id={label} type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => set(Number(e.target.value))} />
    </div>
  );
}

/* 1 — COMPOUNDING: the curve against the straight line */
function SimCompounding() {
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);
  const P = 100000;
  const W = 640, H = 260, pad = 34;

  const pts = [];
  for (let t = 0; t <= years; t++) {
    pts.push({ t, comp: P * Math.pow(1 + rate / 100, t), simple: P * (1 + (rate / 100) * t) });
  }
  const maxV = Math.max(pts[pts.length - 1].comp, 1);
  const X = (t) => pad + (t / Math.max(years, 1)) * (W - pad * 2);
  const Y = (v) => H - pad - (v / maxV) * (H - pad * 2);
  const line = (k) => pts.map((p, i) => `${i ? "L" : "M"}${X(p.t).toFixed(1)} ${Y(p[k]).toFixed(1)}`).join(" ");

  const final = pts[pts.length - 1];
  const gap = final.comp - final.simple;

  return (
    <div className="sim">
      <div className="sim-controls">
        <Slider label="Annual rate" value={rate} set={setRate} min={1} max={20} suffix="%" />
        <Slider label="Years" value={years} set={setYears} min={1} max={40} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="sim-svg" role="img"
        aria-label={`Growth of one lakh at ${rate} percent over ${years} years`}>
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} className="sim-axis" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} className="sim-axis" />
        <path d={line("simple")} className="sim-line simple" />
        <path d={line("comp")} className="sim-line comp" />
        <circle cx={X(years)} cy={Y(final.comp)} r="5" className="sim-dot comp" />
        <circle cx={X(years)} cy={Y(final.simple)} r="4" className="sim-dot simple" />
      </svg>
      <div className="sim-out">
        <div><span>Simple interest</span><b>₹{fmt(final.simple)}</b></div>
        <div><span>Compounded</span><b className="hi">₹{fmt(final.comp)}</b></div>
        <div><span>Earned on interest alone</span><b className="hi">₹{fmt(gap)}</b></div>
      </div>
      <p className="sim-note">
        The straight line is interest paid only on the original ₹1,00,000. The curve adds
        interest earned on interest. The space between them is compounding.
      </p>
    </div>
  );
}

/* 2 — LEVERAGE: how far a fall in asset values eats equity */
function SimLeverage() {
  const [debtPct, setDebtPct] = useState(60);
  const [fall, setFall] = useState(10);
  const assets = 10000000;
  const debt = assets * (debtPct / 100);
  const equity0 = assets - debt;
  const assets1 = assets * (1 - fall / 100);
  const equity1 = assets1 - debt;
  const wiped = equity0 > 0 ? Math.min(100, Math.max(0, ((equity0 - equity1) / equity0) * 100)) : 100;
  const insolvent = equity1 <= 0;

  return (
    <div className="sim">
      <div className="sim-controls">
        <Slider label="Funded by debt" value={debtPct} set={setDebtPct} min={0} max={90} suffix="%" />
        <Slider label="Fall in asset values" value={fall} set={setFall} min={0} max={50} suffix="%" />
      </div>

      <div className="bs">
        <div className="bs-col">
          <p className="bs-h">Assets</p>
          <div className="bs-bar">
            <div className="bs-fill assets" style={{ height: `${(assets1 / assets) * 100}%` }} />
            <div className="bs-lost" style={{ height: `${fall}%` }} />
          </div>
          <p className="bs-v">₹{fmt(assets1)}</p>
        </div>
        <div className="bs-col">
          <p className="bs-h">Funded by</p>
          <div className="bs-bar">
            <div className="bs-fill equity" style={{ height: `${Math.max(0, (equity1 / assets) * 100)}%` }}>
              <span>Equity</span>
            </div>
            <div className="bs-fill debt" style={{ height: `${(debt / assets) * 100}%` }}>
              <span>Debt</span>
            </div>
          </div>
          <p className="bs-v">{insolvent ? "Equity exhausted" : `Equity ₹${fmt(equity1)}`}</p>
        </div>
      </div>

      <div className="sim-out">
        <div><span>Equity before</span><b>₹{fmt(equity0)}</b></div>
        <div><span>Equity after</span><b className={insolvent ? "bad" : "hi"}>{insolvent ? "₹0" : `₹${fmt(equity1)}`}</b></div>
        <div><span>Share of equity wiped out</span><b className={wiped > 60 ? "bad" : "hi"}>{fmt(wiped, 1)}%</b></div>
      </div>
      <p className="sim-note">
        Debt does not move when asset values fall. The entire loss lands on equity, which is why
        a {fall}% fall in assets removes {fmt(wiped, 1)}% of the owners’ position at this level of leverage.
      </p>
    </div>
  );
}

/* 3 — BOND PRICING: why price and yield move in opposite directions */
function SimBond() {
  const [coupon, setCoupon] = useState(6);
  const [yieldPct, setYield] = useState(8);
  const [years, setYears] = useState(5);
  const F = 1000;
  const price = (() => {
    const y = yieldPct / 100, c = F * (coupon / 100);
    let p = 0;
    for (let t = 1; t <= years; t++) p += c / Math.pow(1 + y, t);
    return p + F / Math.pow(1 + y, years);
  })();
  const pct = ((price - F) / F) * 100;
  const W = 640, H = 200, pad = 32;
  const curve = [];
  for (let yv = 1; yv <= 16; yv += 0.5) {
    const y = yv / 100, c = F * (coupon / 100);
    let p = 0;
    for (let t = 1; t <= years; t++) p += c / Math.pow(1 + y, t);
    p += F / Math.pow(1 + y, years);
    curve.push({ yv, p });
  }
  const maxP = Math.max(...curve.map((d) => d.p)), minP = Math.min(...curve.map((d) => d.p));
  const X = (yv) => pad + ((yv - 1) / 15) * (W - pad * 2);
  const Y = (p) => H - pad - ((p - minP) / Math.max(1, maxP - minP)) * (H - pad * 2);

  return (
    <div className="sim">
      <div className="sim-controls three">
        <Slider label="Coupon" value={coupon} set={setCoupon} min={0} max={15} step={0.5} suffix="%" />
        <Slider label="Market yield" value={yieldPct} set={setYield} min={1} max={16} step={0.5} suffix="%" />
        <Slider label="Years to maturity" value={years} set={setYears} min={1} max={30} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="sim-svg" role="img"
        aria-label={`Bond price against yield, ${coupon} percent coupon`}>
        <line x1={pad} y1={Y(F)} x2={W - pad} y2={Y(F)} className="sim-axis dash" />
        <text x={W - pad} y={Y(F) - 8} textAnchor="end" className="sim-lab">Face value ₹1,000</text>
        <path d={curve.map((d, i) => `${i ? "L" : "M"}${X(d.yv).toFixed(1)} ${Y(d.p).toFixed(1)}`).join(" ")}
          className="sim-line comp" />
        <circle cx={X(yieldPct)} cy={Y(price)} r="6" className="sim-dot comp" />
      </svg>
      <div className="sim-out">
        <div><span>Price today</span><b className="hi">₹{fmt(price, 2)}</b></div>
        <div><span>Against face value</span><b className={pct < 0 ? "bad" : "hi"}>{pct >= 0 ? "+" : ""}{fmt(pct, 1)}%</b></div>
        <div><span>Trading at</span><b>{price > F ? "a premium" : price < F ? "a discount" : "par"}</b></div>
      </div>
      <p className="sim-note">
        The coupon never changes. When the market demands a higher yield, the only thing that can
        move is the price — and the longer the maturity, the further it has to fall.
      </p>
    </div>
  );
}


/* --- Options payoff: the line bends at the strike ---------------------- */
function SimOptions() {
  const [kind, setKind] = useState("call");
  const [strike, setStrike] = useState(22000);
  const [premium, setPremium] = useState(200);
  const [side, setSide] = useState("buy");
  const lot = 50;
  const W = 640, H = 260, pad = 40;
  const lo = strike * 0.94, hi = strike * 1.06;

  const payoff = (spot) => {
    const intrinsic = kind === "call"
      ? Math.max(spot - strike, 0)
      : Math.max(strike - spot, 0);
    const net = intrinsic - premium;
    return side === "buy" ? net : -net;
  };

  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const spot = lo + ((hi - lo) * i) / 60;
    pts.push({ spot, p: payoff(spot) });
  }
  const maxAbs = Math.max(...pts.map((d) => Math.abs(d.p)), premium * 1.6);
  const X = (spot) => pad + ((spot - lo) / (hi - lo)) * (W - pad * 2);
  const Y = (p) => H / 2 - (p / maxAbs) * (H / 2 - pad);
  const path = pts.map((d, i) => `${i ? "L" : "M"}${X(d.spot).toFixed(1)} ${Y(d.p).toFixed(1)}`).join(" ");

  const breakeven = kind === "call" ? strike + premium : strike - premium;
  const maxLoss = side === "buy" ? premium * lot : Infinity;
  const maxGain = side === "buy"
    ? (kind === "call" ? Infinity : (strike - premium) * lot)
    : premium * lot;

  return (
    <div className="sim">
      <div className="art-tabs">
        <button className={"tab" + (kind === "call" ? " on" : "")} onClick={() => setKind("call")}>Call</button>
        <button className={"tab" + (kind === "put" ? " on" : "")} onClick={() => setKind("put")}>Put</button>
        <button className={"tab" + (side === "buy" ? " on" : "")} onClick={() => setSide("buy")}>Buy</button>
        <button className={"tab" + (side === "sell" ? " on" : "")} onClick={() => setSide("sell")}>Sell</button>
      </div>

      <div className="sim-controls">
        <Slider label="Strike" value={strike} set={setStrike} min={20000} max={24000} step={100} />
        <Slider label="Premium" value={premium} set={setPremium} min={20} max={600} step={10} suffix=" ₹" />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="sim-svg" role="img"
        aria-label={`Payoff of a ${side} ${kind} at strike ${strike}`}>
        <rect x={pad} y={pad} width={W - pad * 2} height={H / 2 - pad} className="pay-zone up" />
        <rect x={pad} y={H / 2} width={W - pad * 2} height={H / 2 - pad} className="pay-zone down" />
        <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} className="sim-axis" />
        <line x1={X(strike)} y1={pad} x2={X(strike)} y2={H - pad} className="sim-axis dash" />
        <text x={X(strike)} y={H - pad + 16} textAnchor="middle" className="mv-lab">Strike</text>
        <line x1={X(breakeven)} y1={pad} x2={X(breakeven)} y2={H - pad} className="pay-be" />
        <text x={X(breakeven)} y={pad - 8} textAnchor="middle" className="pay-be-t">Breakeven</text>
        <path d={path} className="pay-line" />
      </svg>

      <div className="sim-out">
        <div><span>Breakeven</span><b className="hi">{fmt(breakeven, 0)}</b></div>
        <div><span>Maximum loss</span>
          <b className={maxLoss === Infinity ? "bad" : ""}>{maxLoss === Infinity ? "Unlimited" : `₹${fmt(maxLoss)}`}</b></div>
        <div><span>Maximum gain</span>
          <b className="hi">{maxGain === Infinity ? "Unlimited" : `₹${fmt(maxGain)}`}</b></div>
      </div>
      <p className="sim-note">
        Lot size 50. A bought option loses only the premium at worst, which is what the premium buys.
        A sold option collects the premium and carries the obligation, so the payoff is the mirror image.
        Being right about direction is not enough: the move must clear the breakeven.
      </p>
    </div>
  );
}

/* --- Diversification: correlation is the whole story ------------------- */
function SimDiversification() {
  const [corr, setCorr] = useState(0.6);
  const [wA, setWA] = useState(60);
  const volA = 18, volB = 12;
  const w1 = wA / 100, w2 = 1 - w1;
  const port = Math.sqrt(
    w1 * w1 * volA * volA + w2 * w2 * volB * volB + 2 * w1 * w2 * corr * volA * volB
  );
  const weighted = w1 * volA + w2 * volB;
  const benefit = weighted - port;

  const W = 620, H = 190, pad = 34;
  const series = (phase, vol) =>
    Array.from({ length: 60 }, (_, i) => {
      const base = Math.sin(i / 5.5) * vol;
      const own = Math.sin(i / 3.1 + phase) * vol * 0.7;
      return base * corr + own * (1 - Math.abs(corr));
    });
  const a = series(0, volA), b = series(2.4, volB);
  const p = a.map((v, i) => w1 * v + w2 * b[i]);
  const scale = 26;
  const line = (arr, yOff) =>
    arr.map((v, i) => `${i ? "L" : "M"}${(pad + (i / 59) * (W - pad * 2)).toFixed(1)} ${(yOff - v * (scale / 18)).toFixed(1)}`).join(" ");

  return (
    <div className="sim">
      <div className="sim-controls">
        <Slider label="Correlation between the two assets" value={corr} set={setCorr} min={-1} max={1} step={0.05} />
        <Slider label="Weight in the riskier asset" value={wA} set={setWA} min={0} max={100} step={5} suffix="%" />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="sim-svg" role="img"
        aria-label="Two assets and the portfolio that combines them">
        <path d={line(a, 45)} className="div-line a" />
        <text x={pad} y={22} className="mv-lab">Asset A, 18% volatility</text>
        <path d={line(b, 105)} className="div-line b" />
        <text x={pad} y={82} className="mv-lab">Asset B, 12% volatility</text>
        <path d={line(p, 165)} className="div-line p" />
        <text x={pad} y={142} className="mv-lab">Combined portfolio</text>
      </svg>

      <div className="sim-out">
        <div><span>Weighted average volatility</span><b>{fmt(weighted, 1)}%</b></div>
        <div><span>Actual portfolio volatility</span><b className="hi">{fmt(port, 1)}%</b></div>
        <div><span>Reduction from diversification</span>
          <b className={benefit > 1 ? "hi" : ""}>{fmt(benefit, 1)} points</b></div>
      </div>
      <p className="sim-note">
        At a correlation of 1 the two assets move together and there is no benefit at all: portfolio
        volatility equals the weighted average. As correlation falls, the movements begin to cancel and the
        combined line flattens. The benefit comes from low correlation, not from the number of holdings.
      </p>
    </div>
  );
}

/* --- SIP against lumpsum, across three market paths -------------------- */
function SimSipLumpsum() {
  const [market, setMarket] = useState("rising");
  const [monthly, setMonthly] = useState(10000);
  const months = 60;
  const total = monthly * months;

  const pathOf = (kind) => {
    const out = [];
    for (let i = 0; i <= months; i++) {
      const t = i / months;
      let nav;
      if (kind === "rising") nav = 100 * (1 + 0.9 * t);
      else if (kind === "falling") nav = 100 * (1 - 0.35 * t);
      else nav = 100 * (1 + 0.25 * t + 0.32 * Math.sin(t * Math.PI * 2.2));
      out.push(nav);
    }
    return out;
  };
  const nav = pathOf(market);

  let units = 0;
  for (let i = 1; i <= months; i++) units += monthly / nav[i];
  const sipValue = units * nav[months];
  const lumpUnits = total / nav[0];
  const lumpValue = lumpUnits * nav[months];

  const W = 620, H = 170, pad = 32;
  const minN = Math.min(...nav), maxN = Math.max(...nav);
  const X = (i) => pad + (i / months) * (W - pad * 2);
  const Y = (v) => H - pad - ((v - minN) / Math.max(1, maxN - minN)) * (H - pad * 2);
  const navPath = nav.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");

  return (
    <div className="sim">
      <div className="art-tabs" role="tablist" aria-label="Market path">
        {[["rising", "Rising market"], ["falling", "Falling market"], ["choppy", "Choppy market"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={market === k}
            className={"tab" + (market === k ? " on" : "")} onClick={() => setMarket(k)}>{l}</button>
        ))}
      </div>
      <div className="sim-controls">
        <Slider label="Monthly amount" value={monthly} set={setMonthly} min={1000} max={50000} step={1000} suffix=" ₹" />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="sim-svg" role="img" aria-label="Fund value over five years">
        <path d={navPath} className="sim-line comp" />
        {[12, 24, 36, 48].map((m) => (
          <circle key={m} cx={X(m)} cy={Y(nav[m])} r="3" className="sim-dot comp" />
        ))}
      </svg>

      <div className="sim-out">
        <div><span>Total invested</span><b>₹{fmt(total)}</b></div>
        <div><span>Monthly investing</span>
          <b className={sipValue >= lumpValue ? "hi" : ""}>₹{fmt(sipValue)}</b></div>
        <div><span>All at the start</span>
          <b className={lumpValue > sipValue ? "hi" : ""}>₹{fmt(lumpValue)}</b></div>
      </div>
      <p className="sim-note">
        {market === "rising" && "In a market that rises steadily, investing everything at the start wins, because the money is exposed for longer."}
        {market === "falling" && "In a falling market, monthly investing buys more units at lower prices, so it loses less. Neither method produces a gain here."}
        {market === "choppy" && "In a market that moves sideways with large swings, monthly investing accumulates units cheaply during the falls."}
        {" "}The path is illustrative and returns are not constant in reality. What the comparison shows is that the
        advantage of each method depends on the path, and the path is not knowable in advance.
      </p>
    </div>
  );
}

const SIMS = {
  options: { title: "Move the strike and premium, and watch the payoff bend", el: SimOptions },
  diversification: { title: "Move the correlation, and watch the combined line flatten", el: SimDiversification },
  siplump: { title: "Same money, two methods, three different markets", el: SimSipLumpsum },
  compounding: { title: "Watch compounding separate from simple interest", el: SimCompounding },
  leverage: { title: "Move the leverage and watch equity absorb the loss", el: SimLeverage },
  bond: { title: "Move the yield and watch the price respond", el: SimBond },
};

function NumField({ label, value, set, suffix, step = "any", min = 0 }) {
  return (
    <div className="field">
      <label>{label}{suffix ? ` (${suffix})` : ""}</label>
      <input type="number" inputMode="decimal" step={step} min={min} value={value}
        onChange={(e) => set(e.target.value)} />
    </div>
  );
}

function Calc({ id }) {
  const [a, setA] = useState(id === "sip" ? 5000 : id === "loan" ? 2500000 : 100000);
  const [b, setB] = useState(id === "loan" ? 8.5 : id === "cagr" ? 250000 : 8);
  const [c, setC] = useState(id === "cagr" ? 5 : id === "compound" ? 5 : 10);
  const [d, setD] = useState(1); // compounding frequency / inflation

  let rows = [], note = "";
  if (id === "sip") {
    const P = +a, i = +b / 100 / 12, n = +c * 12;
    const fv = i === 0 ? P * n : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const inv = P * n;
    rows = [["Total invested", `₹${fmt(inv)}`], ["Estimated value", `₹${fmt(fv)}`], ["Growth", `₹${fmt(fv - inv)}`]];
    note = "Assumes a constant return and investment at the start of each month. Market returns are not constant.";
  } else if (id === "compound") {
    const P = +a, r = +b / 100, m = Math.max(1, +d), t = +c;
    const A = P * Math.pow(1 + r / m, m * t);
    const ear = (Math.pow(1 + r / m, m) - 1) * 100;
    rows = [["Final amount", `₹${fmt(A)}`], ["Interest earned", `₹${fmt(A - P)}`], ["Effective annual rate", `${fmt(ear, 2)}%`]];
    note = "Compounding frequency of 1 is annual, 4 quarterly, 12 monthly.";
  } else if (id === "cagr") {
    const s = +a, e = +b, y = +c;
    const g = y > 0 && s > 0 ? (Math.pow(e / s, 1 / y) - 1) * 100 : NaN;
    rows = [["CAGR", `${fmt(g, 2)}%`], ["Total change", `${fmt(((e - s) / s) * 100, 2)}%`]];
    note = "CAGR smooths the path into one constant rate. It says nothing about the volatility along the way.";
  } else if (id === "loan") {
    const P = +a, i = +b / 100 / 12, n = +c * 12;
    const emi = i === 0 ? P / n : (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = emi * n;
    rows = [["Monthly EMI", `₹${fmt(emi)}`], ["Total repayment", `₹${fmt(total)}`], ["Total interest", `₹${fmt(total - P)}`],
    ["Interest as % of principal", `${fmt(((total - P) / P) * 100, 1)}%`]];
    note = "The EMI is set so that the present value of all payments equals the amount borrowed today.";
  } else if (id === "real") {
    const nom = +b / 100, inf = +d / 100;
    const real = ((1 + nom) / (1 + inf) - 1) * 100;
    const approx = (+b - +d);
    rows = [["Real return (exact)", `${fmt(real, 2)}%`], ["Approximation (nominal − inflation)", `${fmt(approx, 2)}%`],
    ["Value of ₹1,00,000 after 10 years, in today's money", `₹${fmt(100000 * Math.pow(1 + real / 100, 10))}`]];
    note = "The approximation drifts from the exact figure as rates rise.";
  }

  const fields = {
    sip: [["Monthly investment", a, setA, "₹"], ["Expected annual return", b, setB, "%"], ["Duration", c, setC, "years"]],
    compound: [["Principal", a, setA, "₹"], ["Annual rate", b, setB, "%"], ["Years", c, setC, ""], ["Compounding per year", d, setD, ""]],
    cagr: [["Starting value", a, setA, "₹"], ["Ending value", b, setB, "₹"], ["Years", c, setC, ""]],
    loan: [["Loan amount", a, setA, "₹"], ["Annual interest rate", b, setB, "%"], ["Tenure", c, setC, "years"]],
    real: [["Nominal return", b, setB, "%"], ["Inflation", d, setD, "%"]],
  }[id];

  const tool = TOOLS.find((t) => t.id === id);
  return (
    <div className="grid g2" style={{ gap: 28 }}>
      <div>
        {fields.map(([l, v, s, suf]) => <NumField key={l} label={l} value={v} set={s} suffix={suf} />)}
      </div>
      <div className="card" style={{ height: "max-content" }}>
        <p className="kicker">Result</p>
        <div className="out" style={{ marginTop: 14 }}>
          {rows.map(([k, v]) => (
            <div className="outrow" key={k}><span className="small">{k}</span><b style={{ color: "var(--aqua)" }}>{v}</b></div>
          ))}
        </div>
        <p className="small" style={{ marginTop: 16, fontSize: 12.5 }}>{note}</p>
        {tool && conceptById(tool.concept) && (
          <a className="chip" href={`#/concept/${tool.concept}`} style={{ marginTop: 16, display: "inline-block" }}>
            The concept behind this: {conceptById(tool.concept).title} →
          </a>
        )}
      </div>
    </div>
  );
}

function ToolsPage({ query }) {
  const initial = TOOLS.some((t) => t.id === query) ? query : "compound";
  const [t, setT] = useState(initial);
  useEffect(() => { setT(initial); }, [initial]);
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Tools"]]} />
      <div className="wrap" style={{ paddingBottom: 80 }}>
        <Reveal><h1 className="h-page">Financial tools</h1></Reveal>
        <Reveal delay={70}>
          <p className="lede" style={{ marginTop: 14, maxWidth: "58ch" }}>
            Small calculators that make a formula tangible. Each one links back to the concept it comes from.
          </p>
        </Reveal>
        <div className="tabs" style={{ marginTop: 26 }}>
          {TOOLS.map((x) => (
            <button key={x.id} className={"tab" + (t === x.id ? " on" : "")} onClick={() => setT(x.id)}
              aria-pressed={t === x.id}>{x.name}</button>
          ))}
        </div>
        <p className="small" style={{ marginBottom: 22 }}>{TOOLS.find((x) => x.id === t).desc}</p>
        <Calc id={t} key={t} />
      </div>
    </>
  );
}

/* ===========================================================================
   FINHUB AI — a guide over the structure, not a chatbot pretending to know more
   =========================================================================== */

function useMarketData() {
  const [d, setD] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch("fin-data/market-data-aug30.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (alive && j) setD(j); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return d;
}

function BrokerChart({ data }) {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);
  const [active, setActive] = useState(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } },
      { rootMargin: "-8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rows = data.rows;
  const max = Math.max(...rows.map((r) => r.clients));
  const named = rows.reduce((n, r) => n + r.clients, 0);
  const others = Math.max(0, data.industryTotal - named);

  return (
    <div ref={ref}>
      <div className="bchart">
        {rows.map((r, i) => {
          const w = (r.clients / max) * 100;
          const on = active === r.name;
          return (
            <div className={"brow" + (on ? " on" : "")} key={r.name}
              onMouseEnter={() => setActive(r.name)} onMouseLeave={() => setActive(null)}>
              <span className="brank">{String(r.rank).padStart(2, "0")}</span>
              <span className="bname">
                {r.name}
                <em>{r.type}</em>
              </span>
              <span className="btrack">
                <span className="bfill" style={{ width: play ? `${w}%` : 0, transitionDelay: `${i * 90}ms` }} />
              </span>
              <span className="bval">
                {(r.clients / 10000000).toFixed(2)} cr
                {r.share != null && <em>{r.share}%</em>}
              </span>
              <span className={"bchg " + (r.change >= 0 ? "up" : "down")}>
                {r.change >= 0 ? "+" : ""}{fmt(r.change)}
              </span>
            </div>
          );
        })}
        <div className="brow others">
          <span className="brank">—</span>
          <span className="bname">All other members<em>Not individually listed</em></span>
          <span className="btrack">
            <span className="bfill muted" style={{ width: play ? `${(others / max) * 100}%` : 0, transitionDelay: `${rows.length * 90}ms` }} />
          </span>
          <span className="bval">{(others / 10000000).toFixed(2)} cr</span>
          <span className="bchg" />
        </div>
      </div>
    </div>
  );
}

function MarketDataPage() {
  const md = useMarketData();
  const b = md && md.brokers;

  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Market data"]]} />
      <div className="wrap">
        <Reveal><p className="kicker">Sourced and dated</p></Reveal>
        <Reveal delay={60}><h1 className="h-page" style={{ marginTop: 12 }}>Market Data</h1></Reveal>
        <Reveal delay={120}>
          <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>
            Everything on this page carries the month it describes and the source it came from.
            Figures that change over time are held in a data file rather than written into the
            platform, so nothing here silently goes stale.
          </p>
        </Reveal>
      </div>

      <div className="wrap" style={{ paddingTop: 44, paddingBottom: 100 }}>
        {!b && (
          <div className="sub">
            <p className="body">
              The market data file has not been uploaded yet. When
              <code> fin-data/market-data-aug30.json </code> is present, this page fills itself.
            </p>
          </div>
        )}

        {b && (
          <>
            <Reveal>
              <div className="md-head">
                <div>
                  <h2 style={{ fontSize: 26 }}>{b.title}</h2>
                  <p className="small" style={{ marginTop: 8 }}>{b.industryNote}</p>
                </div>
                <div className="md-stamp">
                  <span className="badge aqua">{b.period}</span>
                  <span className="badge">{b.quality}</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="sub" style={{ margin: "26px 0 30px", borderLeft: "2px solid var(--teal)" }}>
                <p className="eyebrow" style={{ marginBottom: 8 }}>What an active client means</p>
                <p className="body" style={{ fontSize: 16 }}>{b.definition}</p>
              </div>
            </Reveal>

            <Reveal delay={120}><BrokerChart data={b} /></Reveal>

            <Reveal delay={160}>
              <div style={{ marginTop: 36 }}>
                <p className="eyebrow" style={{ marginBottom: 14 }}>Notes on this data</p>
                <div className="list">
                  {b.notes.map((n, i) => <div className="li" key={i}><s>→</s><span style={{ fontSize: 15.5 }}>{n}</span></div>)}
                </div>
              </div>
            </Reveal>

            <div style={{ marginTop: 40 }}>
              <SourceList sources={b.sources}
                note="Where a figure could not be confirmed, it is left out rather than estimated." />
            </div>

            <Reveal>
              <div className="chips" style={{ marginTop: 30 }}>
                <a className="chip" href="#/concept/market-participants">Market participants →</a>
                <a className="chip" href="#/concept/equity-markets">Equity markets →</a>
                <a className="chip" href="#/history">History of markets →</a>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </>
  );
}


/* ===========================================================================
   TAXATION
   Tax rates change with every Budget, so none of them live in this file. The
   page reads fin-data/tax-india-aug30.json, states the year it covers and the
   date it was verified, and carries its own disclaimer. Replace the file after
   a Budget and the page is current again.
   =========================================================================== */

function useTaxData() {
  const [d, setD] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch("fin-data/tax-india-aug30.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (alive && j) setD(j); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return d;
}

function TaxTable({ t }) {
  return (
    <div className="ttable-wrap">
      <table className="ttable">
        <thead>
          <tr>{t.head.map((h, i) => <th key={i} className={i === 0 ? "first" : ""}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {t.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => <td key={j} className={j === 0 ? "first" : ""}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TaxPage() {
  const d = useTaxData();
  const [open, setOpen] = useState(0);

  if (!d) {
    return (
      <>
        <Crumbs items={[["FinHub", "#/"], ["Taxation"]]} />
        <div className="wrap" style={{ paddingBottom: 90 }}>
          <h1 className="h-page">Taxation</h1>
          <div className="sub" style={{ marginTop: 26 }}>
            <p className="body">
              The tax data file has not been uploaded yet. When
              <code> fin-data/tax-india-aug30.json </code> is present, this page fills itself.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Taxation"]]} />
      <div className="wrap">
        <Reveal><p className="kicker">{d.period}</p></Reveal>
        <Reveal delay={60}><h1 className="h-page" style={{ marginTop: 12 }}>{d.title}</h1></Reveal>
        <Reveal delay={120}>
          <div className="tax-stamp">
            <span className="badge aqua">{d.period}</span>
            <span className="badge">{d.asOf}</span>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="tax-warn">
            <p className="eyebrow" style={{ marginBottom: 8, color: "var(--amber)" }}>Read this first</p>
            <p className="body" style={{ fontSize: 16 }}>{d.disclaimer}</p>
            <p className="small" style={{ marginTop: 12 }}>{d.quality}</p>
          </div>
        </Reveal>
        {d.notice && (
          <Reveal delay={200}>
            <div className="sub" style={{ marginTop: 18, borderLeft: "2px solid var(--teal)" }}>
              <p className="body" style={{ fontSize: 16 }}>{d.notice}</p>
            </div>
          </Reveal>
        )}
      </div>

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 100 }}>
        {d.sections.map((sec, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={sec.id} delay={Math.min(i * 40, 240)}>
              <section className={"tsec" + (isOpen ? " on" : "")}>
                <button className="tsec-head" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span className="tsec-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="tsec-t">{sec.title}</span>
                  <span className="org-x">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="tsec-body">
                    {sec.intro && <p className="body" style={{ marginBottom: 22 }}>{sec.intro}</p>}
                    {sec.table && <TaxTable t={sec.table} />}
                    {sec.points && (
                      <div className="list" style={{ marginTop: sec.table ? 24 : 0 }}>
                        {sec.points.map((p, j) => (
                          <div className="li" key={j}><s>→</s><span style={{ fontSize: 16 }}>{p}</span></div>
                        ))}
                      </div>
                    )}
                    {sec.example && (
                      <div className="tax-eg">
                        <p className="eyebrow" style={{ marginBottom: 12 }}>Worked example</p>
                        <p className="body" style={{ fontSize: 16, marginBottom: 12 }}>{sec.example.setup}</p>
                        <div className="steps">
                          {sec.example.steps.map((st, j) => (
                            <div className="step" key={j}><i>{String(j + 1).padStart(2, "0")}</i>
                              <span className="mono calc">{st}</span></div>
                          ))}
                        </div>
                        <div className="result">
                          <span className="eyebrow">Result</span><b>{sec.example.result}</b>
                        </div>
                      </div>
                    )}
                    {sec.note && (
                      <div className="sub" style={{ marginTop: 22, borderLeft: "2px solid var(--amber)" }}>
                        <p className="body" style={{ fontSize: 15.5 }}>{sec.note}</p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </Reveal>
          );
        })}

        <div style={{ marginTop: 44 }}>
          <SourceList sources={d.sources}
            note="Every rate on this page should be confirmed against the Income Tax Department before it is relied upon. Rates change with each Budget." />
        </div>

        <Reveal>
          <div className="chips" style={{ marginTop: 30 }}>
            <a className="chip" href="#/concept/sip">SIP →</a>
            <a className="chip" href="#/concept/options">Options →</a>
            <a className="chip" href="#/concept/mutual-funds">Mutual funds →</a>
            <a className="chip" href="#/data">Market data →</a>
          </div>
        </Reveal>
      </div>
    </>
  );
}

/* ===========================================================================
   THE TRADING FLOOR
   A simulator, not a broker. No market connection, no real prices, no orders.
   Its single purpose is to show what a trade actually costs, because the
   charges are the part almost nobody sees until the contract note arrives.

   Charge rates are read from fin-data/tax-india-aug30.json where present, so
   they stay correct after a Budget without any change to this file.
   =========================================================================== */

const SEBI_RISK = "9 out of 10 individual traders in equity Futures and Options Segment incurred net losses. On an average, loss makers registered net trading loss close to ₹50,000. Over and above the net trading losses incurred, loss makers expended an additional 28% of net trading losses as transaction costs. Those making net trading profits incurred between 15% to 50% of such profits as transaction cost.";

const DEFAULT_RATES = {
  delivery: { brokerage: 0, sttBuy: 0.001, sttSell: 0.001, exch: 0.0000297, sebi: 0.000001, stampBuy: 0.000015, gst: 0.18, dp: 15.93 },
  intraday: { brokerageRate: 0.0003, brokerageCap: 20, sttSell: 0.00025, exch: 0.0000297, sebi: 0.000001, stampBuy: 0.00003, gst: 0.18 },
  futures: { brokerage: 20, sttSell: 0.0005, exch: 0.0000173, sebi: 0.000001, stampBuy: 0.00002, gst: 0.18 },
  options: { brokerage: 20, sttSell: 0.0015, exch: 0.0003503, sebi: 0.000001, stampBuy: 0.00003, gst: 0.18 },
  commodity: { brokerage: 20, cttSell: 0.0001, exch: 0.000026, sebi: 0.000001, stampBuy: 0.00002, gst: 0.18 },
};

const COMMODITIES = [
  { id: "gold", name: "Gold", unit: "10 grams", lot: 100, price: 72000, tick: 1, note: "The standard contract. One rupee of price movement changes the position by ₹100." },
  { id: "goldm", name: "Gold Mini", unit: "10 grams", lot: 10, price: 72000, tick: 1, note: "One tenth the size, so the margin required is far smaller." },
  { id: "goldguinea", name: "Gold Guinea", unit: "8 grams", lot: 8, price: 57600, tick: 1, note: "The smallest gold contract, designed for smaller participants." },
  { id: "silver", name: "Silver", unit: "1 kilogram", lot: 30, price: 88000, tick: 1, note: "Silver moves more sharply than gold in percentage terms." },
  { id: "silverm", name: "Silver Mini", unit: "1 kilogram", lot: 5, price: 88000, tick: 1, note: "A fifth of the standard silver contract." },
  { id: "crude", name: "Crude Oil", unit: "1 barrel", lot: 100, price: 6200, tick: 1, note: "Among the most volatile contracts traded." },
];

/* ---- ambient background: value moving through the frame ---------------- */
function FloorAmbience() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  const bars = Array.from({ length: 26 }, (_, i) => ({
    x: i * 44, h: 26 + ((i * 37) % 64), d: 7 + ((i * 13) % 9), delay: (i * 0.4) % 8,
  }));
  const coins = Array.from({ length: 14 }, (_, i) => ({
    x: 4 + ((i * 71) % 92), s: 7 + ((i * 5) % 8), d: 11 + ((i * 7) % 10), delay: (i * 1.1) % 12,
  }));
  return (
    <div className="floor-amb" aria-hidden="true">
      <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="amb-graph">
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={400 - b.h} width="18" height={b.h} rx="3"
            className="amb-bar" style={{ animationDuration: `${b.d}s`, animationDelay: `-${b.delay}s` }} />
        ))}
        <path className="amb-line"
          d={bars.map((b, i) => `${i ? "L" : "M"}${b.x + 9} ${400 - b.h - 30}`).join(" ")} />
      </svg>
      <div className="amb-coins">
        {coins.map((c, i) => (
          <span key={i} className="amb-coin"
            style={{ left: `${c.x}%`, width: c.s, height: c.s,
              animationDuration: `${c.d}s`, animationDelay: `-${c.delay}s` }} />
        ))}
      </div>
    </div>
  );
}

/* ---- a number that counts to its value --------------------------------- */
function Counter({ value, prefix = "₹", decimals = 2, className = "" }) {
  const [shown, setShown] = useState(value);
  const raf = useRef(0);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current, b = value;
    const step = (t) => {
      const k = Math.min(1, (t - start) / 420);
      const e = 1 - Math.pow(1 - k, 3);
      setShown(a + (b - a) * e);
      if (k < 1) raf.current = requestAnimationFrame(step);
      else from.current = b;
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);
  return <span className={className}>{prefix}{fmt(shown, decimals)}</span>;
}

/* ---- charge list that cascades in --------------------------------------- */
function Charges({ rows, total, netLabel, netValue }) {
  return (
    <div className="chg">
      {rows.map((r, i) => (
        <div className="chg-row" key={r.k} style={{ animationDelay: `${i * 55}ms` }}>
          <span>{r.k}<em>{r.note}</em></span>
          <b><Counter value={r.v} /></b>
        </div>
      ))}
      <div className="chg-total">
        <span>Total charges</span>
        <b><Counter value={total} className="hi" /></b>
      </div>
      {netLabel && (
        <div className="chg-net">
          <span>{netLabel}</span>
          <b><Counter value={netValue} /></b>
        </div>
      )}
    </div>
  );
}

/* ---- 1. Equity order ticket -------------------------------------------- */
function TradeEquity({ rates }) {
  const [side, setSide] = useState("buy");
  const [mode, setMode] = useState("delivery");
  const [qty, setQty] = useState(100);
  const [price, setPrice] = useState(1450);

  const value = qty * price;
  const r = mode === "delivery" ? rates.delivery : rates.intraday;
  const brokerage = mode === "delivery" ? 0 : Math.min(r.brokerageCap, value * r.brokerageRate);
  const stt = mode === "delivery"
    ? value * (side === "buy" ? r.sttBuy : r.sttSell)
    : (side === "sell" ? value * r.sttSell : 0);
  const exch = value * r.exch;
  const sebi = value * r.sebi;
  const stamp = side === "buy" ? value * r.stampBuy : 0;
  const gst = (brokerage + exch + sebi) * r.gst;
  const dp = mode === "delivery" && side === "sell" ? r.dp : 0;
  const total = brokerage + stt + exch + sebi + stamp + gst + dp;
  const breakeven = side === "buy" && qty > 0 ? (value + total * 2) / qty : price;

  const rows = [
    { k: "Brokerage", v: brokerage, note: mode === "delivery" ? "Zero on delivery with many brokers" : "0.03% or ₹20, whichever is lower" },
    { k: "Securities Transaction Tax", v: stt, note: mode === "delivery" ? "0.1% on both legs" : "0.025% on the sell leg only" },
    { k: "Exchange transaction charges", v: exch, note: "Charged by the exchange on turnover" },
    { k: "SEBI turnover fees", v: sebi, note: "₹10 per crore of turnover" },
    { k: "Stamp duty", v: stamp, note: side === "buy" ? "Payable by the buyer" : "Not payable on the sell side" },
    { k: "GST", v: gst, note: "18% on brokerage and transaction charges, not on the shares" },
    { k: "Depository charges", v: dp, note: dp ? "Flat, per scrip, on delivery sell" : "Not applicable here" },
  ];

  return (
    <div className="tk">
      <div className="tk-toggles">
        <div className="seg" role="tablist" aria-label="Side">
          <button role="tab" aria-selected={side === "buy"} className={"seg-b buy" + (side === "buy" ? " on" : "")}
            onClick={() => setSide("buy")}>Buy</button>
          <button role="tab" aria-selected={side === "sell"} className={"seg-b sell" + (side === "sell" ? " on" : "")}
            onClick={() => setSide("sell")}>Sell</button>
        </div>
        <div className="seg" role="tablist" aria-label="Product">
          <button role="tab" aria-selected={mode === "delivery"} className={"seg-b" + (mode === "delivery" ? " on" : "")}
            onClick={() => setMode("delivery")}>Delivery</button>
          <button role="tab" aria-selected={mode === "intraday"} className={"seg-b" + (mode === "intraday" ? " on" : "")}
            onClick={() => setMode("intraday")}>Intraday</button>
        </div>
      </div>

      <div className="tk-fields">
        <label className="tkf">
          <span>Quantity</span>
          <input type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(0, Number(e.target.value)))} />
        </label>
        <label className="tkf">
          <span>Price</span>
          <input type="number" min="0" step="0.05" value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} />
        </label>
      </div>

      <div className="tk-value">
        <span>Order value</span>
        <b><Counter value={value} decimals={2} /></b>
      </div>

      <Charges rows={rows} total={total}
        netLabel={side === "buy" ? "Total payable" : "Net credit"}
        netValue={side === "buy" ? value + total : value - total} />

      {side === "buy" && qty > 0 && (
        <div className="tk-be">
          <p className="eyebrow">Break-even price</p>
          <b><Counter value={breakeven} decimals={2} /></b>
          <p className="small">
            The price this share must reach before a round trip leaves you level, once the charges on
            both the buy and the sell are counted. It is not the price you paid.
          </p>
        </div>
      )}
    </div>
  );
}

/* ---- 2. Futures --------------------------------------------------------- */
function TradeFutures({ rates }) {
  const [lot, setLot] = useState(75);
  const [entry, setEntry] = useState(22000);
  const [now, setNow] = useState(22150);
  const [marginPct, setMarginPct] = useState(12);

  const value = lot * entry;
  const margin = value * (marginPct / 100);
  const pnl = (now - entry) * lot;
  const pnlPctOnMargin = margin ? (pnl / margin) * 100 : 0;
  const movePct = entry ? ((now - entry) / entry) * 100 : 0;
  const wipeout = entry - margin / lot;

  const r = rates.futures;
  const sellValue = lot * now;
  const brokerage = r.brokerage * 2;
  const stt = sellValue * r.sttSell;
  const exch = (value + sellValue) * r.exch;
  const sebi = (value + sellValue) * r.sebi;
  const stamp = value * r.stampBuy;
  const gst = (brokerage + exch + sebi) * r.gst;
  const total = brokerage + stt + exch + sebi + stamp + gst;

  return (
    <div className="tk">
      <RiskNotice />
      <div className="tk-fields three">
        <label className="tkf"><span>Lot size</span>
          <input type="number" min="1" value={lot} onChange={(e) => setLot(Math.max(1, Number(e.target.value)))} /></label>
        <label className="tkf"><span>Entry price</span>
          <input type="number" min="0" value={entry} onChange={(e) => setEntry(Math.max(0, Number(e.target.value)))} /></label>
        <label className="tkf"><span>Current price</span>
          <input type="number" min="0" value={now} onChange={(e) => setNow(Math.max(0, Number(e.target.value)))} /></label>
      </div>

      <Slider label="Margin required" value={marginPct} set={setMarginPct} min={5} max={30} suffix="%" />

      <div className="tk-grid">
        <div><span>Contract value</span><b><Counter value={value} decimals={0} /></b></div>
        <div><span>Margin blocked</span><b><Counter value={margin} decimals={0} /></b></div>
        <div><span>Price move</span>
          <b className={movePct >= 0 ? "hi" : "bad"}>{movePct >= 0 ? "+" : ""}{fmt(movePct, 2)}%</b></div>
        <div><span>Profit or loss</span>
          <b className={pnl >= 0 ? "hi" : "bad"}><Counter value={pnl} decimals={0} /></b></div>
        <div><span>Return on margin</span>
          <b className={pnlPctOnMargin >= 0 ? "hi" : "bad"}>{pnlPctOnMargin >= 0 ? "+" : ""}{fmt(pnlPctOnMargin, 1)}%</b></div>
        <div><span>Charges, round trip</span><b><Counter value={total} /></b></div>
      </div>

      <div className="marginbar">
        <div className="mb-track">
          <div className={"mb-fill " + (pnl >= 0 ? "up" : "down")}
            style={{ width: `${Math.min(100, Math.abs(pnl) / Math.max(margin, 1) * 100)}%` }} />
        </div>
        <p className="small">
          A move of {fmt(movePct, 2)}% in the underlying produced {fmt(pnlPctOnMargin, 1)}% on the margin
          committed. That multiple is the leverage, and it applies identically in the other direction.
          At an entry of {fmt(entry, 0)}, the margin would be fully consumed near {fmt(wipeout, 0)}.
        </p>
      </div>
    </div>
  );
}

/* ---- 3. Options --------------------------------------------------------- */
function TradeOptions({ rates }) {
  const [kind, setKind] = useState("call");
  const [side, setSide] = useState("buy");
  const [strike, setStrike] = useState(22000);
  const [premium, setPremium] = useState(180);
  const [lots, setLots] = useState(1);
  const [expiry, setExpiry] = useState(22400);
  const lotSize = 75;

  const qty = lots * lotSize;
  const premiumValue = premium * qty;
  const intrinsic = kind === "call" ? Math.max(expiry - strike, 0) : Math.max(strike - expiry, 0);
  const grossPerUnit = side === "buy" ? intrinsic - premium : premium - intrinsic;
  const gross = grossPerUnit * qty;
  const breakeven = kind === "call" ? strike + premium : strike - premium;

  const r = rates.options;
  const brokerage = r.brokerage * 2;
  const stt = side === "sell" ? premiumValue * r.sttSell : 0;
  const exch = premiumValue * r.exch * 2;
  const sebi = premiumValue * r.sebi * 2;
  const stamp = side === "buy" ? premiumValue * r.stampBuy : 0;
  const gst = (brokerage + exch + sebi) * r.gst;
  const total = brokerage + stt + exch + sebi + stamp + gst;
  const net = gross - total;

  const W = 560, H = 190, pad = 34;
  const lo = strike * 0.94, hi = strike * 1.06;
  const payoff = (spot) => {
    const iv = kind === "call" ? Math.max(spot - strike, 0) : Math.max(strike - spot, 0);
    const p = side === "buy" ? iv - premium : premium - iv;
    return p * qty;
  };
  const pts = Array.from({ length: 61 }, (_, i) => {
    const spot = lo + ((hi - lo) * i) / 60;
    return { spot, p: payoff(spot) };
  });
  const maxAbs = Math.max(...pts.map((d) => Math.abs(d.p)), 1);
  const X = (spot) => pad + ((spot - lo) / (hi - lo)) * (W - pad * 2);
  const Y = (p) => H / 2 - (p / maxAbs) * (H / 2 - pad);
  const path = pts.map((d, i) => `${i ? "L" : "M"}${X(d.spot).toFixed(1)} ${Y(d.p).toFixed(1)}`).join(" ");

  return (
    <div className="tk">
      <RiskNotice />
      <div className="tk-toggles">
        <div className="seg">
          <button className={"seg-b" + (kind === "call" ? " on" : "")} onClick={() => setKind("call")}>Call</button>
          <button className={"seg-b" + (kind === "put" ? " on" : "")} onClick={() => setKind("put")}>Put</button>
        </div>
        <div className="seg">
          <button className={"seg-b buy" + (side === "buy" ? " on" : "")} onClick={() => setSide("buy")}>Buy</button>
          <button className={"seg-b sell" + (side === "sell" ? " on" : "")} onClick={() => setSide("sell")}>Sell</button>
        </div>
      </div>

      <div className="tk-fields three">
        <label className="tkf"><span>Strike</span>
          <input type="number" value={strike} onChange={(e) => setStrike(Number(e.target.value))} /></label>
        <label className="tkf"><span>Premium</span>
          <input type="number" value={premium} onChange={(e) => setPremium(Math.max(0, Number(e.target.value)))} /></label>
        <label className="tkf"><span>Lots</span>
          <input type="number" min="1" value={lots} onChange={(e) => setLots(Math.max(1, Number(e.target.value)))} /></label>
      </div>

      <Slider label="Price at expiry" value={expiry} set={setExpiry} min={Math.round(strike * 0.9)} max={Math.round(strike * 1.1)} step={25} />

      <svg viewBox={`0 0 ${W} ${H}`} className="sim-svg" role="img" aria-label="Payoff at expiry">
        <rect x={pad} y={pad} width={W - pad * 2} height={H / 2 - pad} className="pay-zone up" />
        <rect x={pad} y={H / 2} width={W - pad * 2} height={H / 2 - pad} className="pay-zone down" />
        <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} className="sim-axis" />
        <line x1={X(breakeven)} y1={pad} x2={X(breakeven)} y2={H - pad} className="pay-be" />
        <text x={X(breakeven)} y={pad - 8} textAnchor="middle" className="pay-be-t">Breakeven {fmt(breakeven, 0)}</text>
        <path d={path} className="pay-line" />
        <circle cx={X(Math.min(Math.max(expiry, lo), hi))} cy={Y(payoff(expiry))} r="5" className="sim-dot comp" />
      </svg>

      <div className="tk-grid">
        <div><span>Premium paid or received</span><b><Counter value={premiumValue} decimals={0} /></b></div>
        <div><span>Quantity</span><b>{fmt(qty)} units</b></div>
        <div><span>Intrinsic value at expiry</span><b><Counter value={intrinsic * qty} decimals={0} /></b></div>
        <div><span>Gross result</span>
          <b className={gross >= 0 ? "hi" : "bad"}><Counter value={gross} decimals={0} /></b></div>
        <div><span>Charges</span><b><Counter value={total} /></b></div>
        <div><span>Net result</span>
          <b className={net >= 0 ? "hi" : "bad"}><Counter value={net} decimals={0} /></b></div>
      </div>

      <p className="small" style={{ marginTop: 16 }}>
        STT on options is charged on the premium at 0.15% on the sell side, not on the strike value.
        {intrinsic === 0 && side === "buy" && " At this expiry price the option expires worthless and the entire premium is lost."}
      </p>
    </div>
  );
}

/* ---- 4. Commodities ----------------------------------------------------- */
function TradeCommodity({ rates }) {
  const [id, setId] = useState("gold");
  const [entry, setEntry] = useState(72000);
  const [now, setNow] = useState(72400);
  const [marginPct, setMarginPct] = useState(8);
  const c = COMMODITIES.find((x) => x.id === id);

  useEffect(() => {
    const x = COMMODITIES.find((k) => k.id === id);
    setEntry(x.price);
    setNow(Math.round(x.price * 1.005));
  }, [id]);

  const value = c.lot * entry;
  const margin = value * (marginPct / 100);
  const pnl = (now - entry) * c.lot;
  const onMargin = margin ? (pnl / margin) * 100 : 0;
  const perRupee = c.lot;

  const r = rates.commodity;
  const sellValue = c.lot * now;
  const brokerage = r.brokerage * 2;
  const ctt = sellValue * r.cttSell;
  const exch = (value + sellValue) * r.exch;
  const sebi = (value + sellValue) * r.sebi;
  const gst = (brokerage + exch + sebi) * r.gst;
  const total = brokerage + ctt + exch + sebi + gst;

  return (
    <div className="tk">
      <div className="cmd-picker" role="tablist" aria-label="Commodity">
        {COMMODITIES.map((x) => (
          <button key={x.id} role="tab" aria-selected={id === x.id}
            className={"tab" + (id === x.id ? " on" : "")} onClick={() => setId(x.id)}>{x.name}</button>
        ))}
      </div>

      <div className="cmd-spec">
        <div><span>Contract unit</span><b>{c.unit}</b></div>
        <div><span>Lot size</span><b>{c.lot}</b></div>
        <div><span>One rupee of price move</span><b>₹{fmt(perRupee)}</b></div>
      </div>

      <div className="tk-fields">
        <label className="tkf"><span>Entry price</span>
          <input type="number" value={entry} onChange={(e) => setEntry(Math.max(0, Number(e.target.value)))} /></label>
        <label className="tkf"><span>Current price</span>
          <input type="number" value={now} onChange={(e) => setNow(Math.max(0, Number(e.target.value)))} /></label>
      </div>

      <Slider label="Margin required" value={marginPct} set={setMarginPct} min={4} max={20} suffix="%" />

      <div className="tk-grid">
        <div><span>Contract value</span><b><Counter value={value} decimals={0} /></b></div>
        <div><span>Margin blocked</span><b><Counter value={margin} decimals={0} /></b></div>
        <div><span>Profit or loss</span>
          <b className={pnl >= 0 ? "hi" : "bad"}><Counter value={pnl} decimals={0} /></b></div>
        <div><span>Return on margin</span>
          <b className={onMargin >= 0 ? "hi" : "bad"}>{onMargin >= 0 ? "+" : ""}{fmt(onMargin, 1)}%</b></div>
        <div><span>Charges, round trip</span><b><Counter value={total} /></b></div>
        <div><span>Commodities Transaction Tax</span><b><Counter value={ctt} /></b></div>
      </div>

      <p className="small" style={{ marginTop: 14 }}>{c.note} Prices shown are placeholders you can change, not market quotes.</p>
    </div>
  );
}

function RiskNotice() {
  return (
    <div className="risk">
      <p className="risk-h">Risk disclosure for Futures and Options</p>
      <p className="risk-b">{SEBI_RISK}</p>
    </div>
  );
}

/* ---- the floor: entry gate, phone frame, four simulators ---------------- */
const FLOOR_TABS = [
  { id: "equity", name: "Stocks", el: TradeEquity },
  { id: "futures", name: "Futures", el: TradeFutures },
  { id: "options", name: "Options", el: TradeOptions },
  { id: "commodity", name: "Commodities", el: TradeCommodity },
];

function TradingFloorPage() {
  const [name, setName] = useState("");
  const [entered, setEntered] = useState(false);
  const [adult, setAdult] = useState(false);
  const [tab, setTab] = useState("equity");
  const [rates, setRates] = useState(DEFAULT_RATES);

  useEffect(() => {
    let alive = true;
    fetch("fin-data/trade-rates.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (alive && j) setRates({ ...DEFAULT_RATES, ...j }); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const Active = FLOOR_TABS.find((t) => t.id === tab).el;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (!entered) {
    return (
      <>
        <Crumbs items={[["FinHub", "#/"], ["Trading floor"]]} />
        <div className="floor-gate">
          <FloorAmbience />
          <div className="wrap-n gate-in">
            <Reveal><p className="kicker">Simulation</p></Reveal>
            <Reveal delay={70}>
              <h1 className="h-page" style={{ marginTop: 14 }}>The Trading Floor</h1>
            </Reveal>
            <Reveal delay={130}>
              <p className="lede" style={{ marginTop: 18 }}>
                A working model of an order screen. You set every number yourself, and it shows what a
                trade actually costs once brokerage, taxes, exchange charges and duty are counted.
              </p>
            </Reveal>

            <Reveal delay={190}>
              <div className="gate-warn">
                <p className="risk-h">This is a simulator</p>
                <p className="risk-b">
                  Nothing here connects to a market. There are no live prices, no orders are placed,
                  no money moves and no account is opened. FinHub does not ask for a PAN, a bank
                  account, a UPI identifier or any payment detail, and never will. This exists to show
                  how the mechanics work, and it is not investment advice.
                </p>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="gate-form">
                <label className="tkf wide">
                  <span>What should the screen call you</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24}
                    placeholder="A first name is enough" />
                </label>
                <label className="gate-check">
                  <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
                  <span>I confirm I am 18 years of age or older.</span>
                </label>
                <button className="btn primary" disabled={!adult}
                  onClick={() => setEntered(true)}>Enter the floor</button>
                <p className="small">
                  Nothing you type is stored or sent anywhere. It stays in this browser tab and
                  disappears when you close it.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Trading floor"]]} />
      <div className="floor">
        <FloorAmbience />
        <div className="wrap floor-in">
          <div className="floor-head">
            <div>
              <p className="kicker">Simulation only</p>
              <h1 style={{ fontSize: "clamp(24px,4vw,34px)", marginTop: 10 }}>
                {greet}{name ? `, ${name}` : ""}
              </h1>
            </div>
            <button className="btn ghost" onClick={() => setEntered(false)}>Leave the floor</button>
          </div>

          <div className="phone">
            <div className="phone-bar">
              <span className="phone-dot" />
              <span className="phone-title">FinHub Simulator</span>
              <span className="phone-tag">Not a broker</span>
            </div>

            <div className="phone-tabs" role="tablist" aria-label="Segment">
              {FLOOR_TABS.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id}
                  className={"ptab" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>{t.name}</button>
              ))}
            </div>

            <div className="phone-body" key={tab}>
              <Active rates={rates} />
            </div>

            <div className="phone-foot">
              No orders are placed. No prices are live. Educational simulation only.
            </div>
          </div>

          <div className="chips" style={{ marginTop: 30, justifyContent: "center" }}>
            <a className="chip" href="#/tax">How this is taxed →</a>
            <a className="chip" href="#/concept/options">Options concept →</a>
            <a className="chip" href="#/concept/futures">Futures concept →</a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===========================================================================
   TELEMETRY
   Year by year price history, one chart per series. The line draws itself,
   a playhead sweeps the timeline, values count as it moves, drawdowns shade
   themselves and market events surface as the playhead passes them.

   Reads fin-data/index-history.json. No figure is written into this file,
   because index history is data, not code. Until the file is uploaded the
   page says so plainly rather than showing anything invented.

   Expected shape:
   {
     "asOf": "verified 30 August 2026",
     "series": [
       { "id":"sensex", "name":"BSE Sensex", "unit":"Index points",
         "base":"1978-79 = 100", "source":"BSE India",
         "points":[{"year":1979,"close":100}, ...] }
     ],
     "events": [{ "year":1992, "label":"Securities scam", "note":"..." }]
   }
   =========================================================================== */

const MARKET_EVENTS = [
  { year: 1987, label: "Black Monday", note: "A single day collapse in global equity markets in October." },
  { year: 1991, label: "Balance of payments crisis", note: "Reserves fell to weeks of cover, leading to liberalisation." },
  { year: 1992, label: "Securities scam", note: "Diverted bank funds unwound, and the market fell sharply." },
  { year: 1997, label: "Asian financial crisis", note: "Currency and banking stress across east and southeast Asia." },
  { year: 2000, label: "Dot com unwind", note: "Technology valuations corrected worldwide." },
  { year: 2001, label: "Market crisis", note: "Concentrated leveraged positions unwound; carry forward ended." },
  { year: 2004, label: "Election shock", note: "An unexpected result triggered a one day fall and trading halt." },
  { year: 2008, label: "Global financial crisis", note: "Credit markets seized after the failure of a major investment bank." },
  { year: 2011, label: "European debt stress", note: "Sovereign debt concerns across the euro area." },
  { year: 2013, label: "Taper tantrum", note: "Signals of reduced US stimulus pulled capital from emerging markets." },
  { year: 2015, label: "Global sell off", note: "Growth concerns in China and commodity weakness." },
  { year: 2016, label: "Demonetisation", note: "High value notes withdrawn from circulation at short notice." },
  { year: 2018, label: "NBFC liquidity crisis", note: "A large infrastructure lender defaulted, tightening credit broadly." },
  { year: 2020, label: "Covid crash", note: "The fastest fall into a bear market on record, followed by recovery." },
  { year: 2022, label: "Inflation and rate shock", note: "Central banks raised rates rapidly as inflation rose." },
];

function useIndexHistory() {
  const [d, setD] = useState(null);
  const [tried, setTried] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch("fin-data/index-history.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (alive) { if (j) setD(j); setTried(true); } })
      .catch(() => { if (alive) setTried(true); });
    return () => { alive = false; };
  }, []);
  return { data: d, tried };
}

/* ---- one series, one chart ------------------------------------------- */
function TelemetryChart({ s, events }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);
  const [seen, setSeen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(null);
  const [log, setLog] = useState(false);
  const [zoom, setZoom] = useState([0, 100]);
  const raf = useRef(0);

  const pts = useMemo(
    () => (s.points || []).filter((p) => p && typeof p.close === "number").sort((a, b) => a.year - b.year),
    [s.points]
  );

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { rootMargin: "-10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const from = Math.floor((zoom[0] / 100) * (pts.length - 1));
  const to = Math.ceil((zoom[1] / 100) * (pts.length - 1));
  const view = pts.slice(Math.max(0, from), Math.max(from + 2, to + 1));

  useEffect(() => {
    if (!playing || view.length < 2) return;
    let i = idx == null || idx >= view.length - 1 ? 0 : idx;
    const tick = () => {
      i += 1;
      if (i >= view.length) { setPlaying(false); setIdx(view.length - 1); return; }
      setIdx(i);
      raf.current = window.setTimeout(tick, 420);
    };
    raf.current = window.setTimeout(tick, 420);
    return () => clearTimeout(raf.current);
  }, [playing, view.length]);

  if (pts.length < 2) return null;

  const W = 760, H = 300, padL = 60, padR = 24, padT = 26, padB = 42;
  const vals = view.map((p) => p.close);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const tf = (v) => (log ? Math.log10(Math.max(v, 0.0001)) : v);
  const tlo = tf(lo), thi = tf(hi);
  const X = (i) => padL + (i / (view.length - 1)) * (W - padL - padR);
  const Y = (v) => H - padB - ((tf(v) - tlo) / Math.max(thi - tlo, 1e-9)) * (H - padT - padB);

  const line = view.map((p, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(p.close).toFixed(1)}`).join(" ");
  const area = `${line} L${X(view.length - 1).toFixed(1)} ${H - padB} L${X(0).toFixed(1)} ${H - padB} Z`;

  // peak to trough drawdown within the visible window
  let peak = -Infinity, peakI = 0, ddStart = 0, ddEnd = 0, worst = 0;
  view.forEach((p, i) => {
    if (p.close > peak) { peak = p.close; peakI = i; }
    const dd = (p.close - peak) / peak;
    if (dd < worst) { worst = dd; ddStart = peakI; ddEnd = i; }
  });

  const cur = idx == null ? view.length - 1 : idx;
  const point = view[cur];
  const first = view[0];
  const growth = first.close ? ((point.close - first.close) / first.close) * 100 : 0;
  const cagrYears = Math.max(1, point.year - first.year);
  const cagr = first.close > 0 ? (Math.pow(point.close / first.close, 1 / cagrYears) - 1) * 100 : 0;

  const evInWindow = (events || MARKET_EVENTS).filter(
    (e) => e.year >= view[0].year && e.year <= view[view.length - 1].year
  );
  const evAtOrBefore = evInWindow.filter((e) => e.year <= point.year).slice(-1)[0];

  // annual movement, computed from the price series rather than supplied
  const moves = pts.map((p, i) => ({
    year: p.year,
    close: p.close,
    move: i === 0 || !pts[i - 1].close ? null : ((p.close - pts[i - 1].close) / pts[i - 1].close) * 100,
  }));
  const withMove = moves.filter((m) => m.move != null);
  const best = withMove.length ? withMove.reduce((a, b) => (b.move > a.move ? b : a)) : null;
  const worstYr = withMove.length ? withMove.reduce((a, b) => (b.move < a.move ? b : a)) : null;
  const viewMoves = moves.filter((m) => m.year >= view[0].year && m.year <= view[view.length - 1].year);
  const maxMove = Math.max(...viewMoves.map((m) => Math.abs(m.move || 0)), 1);
  const curMove = moves.find((m) => m.year === point.year);

  const ticks = 4;
  const gridVals = Array.from({ length: ticks + 1 }, (_, i) => lo + ((hi - lo) * i) / ticks);

  return (
    <section className="tel" ref={wrapRef}>
      <header className="tel-head">
        <div>
          <h3 className="tel-name">{s.name}</h3>
          <p className="small">
            {s.unit || "Index points"}
            {s.base ? ` · ${s.base}` : ""}
            {` · ${pts[0].year} to ${pts[pts.length - 1].year}`}
          </p>
        </div>
        <div className="tel-ctl">
          <button className={"tbtn" + (playing ? " on" : "")}
            onClick={() => { if (!playing && (idx == null || idx >= view.length - 1)) setIdx(0); setPlaying(!playing); }}
            aria-label={playing ? "Pause" : "Play"}>
            {playing ? "Pause" : "Play"}
          </button>
          <button className="tbtn" onClick={() => { setPlaying(false); setIdx(null); }}>Reset</button>
          <button className={"tbtn" + (log ? " on" : "")} onClick={() => setLog(!log)}
            aria-pressed={log}>{log ? "Log" : "Linear"}</button>
        </div>
      </header>

      <div className="tel-readout">
        <div><span>Year</span><b>{point.year}</b></div>
        <div><span>Close</span><b className="hi">{fmt(point.close, 2)}</b></div>
        <div><span>Change from {first.year}</span>
          <b className={growth >= 0 ? "hi" : "bad"}>{growth >= 0 ? "+" : ""}{fmt(growth, 1)}%</b></div>
        <div><span>Move that year</span>
          <b className={curMove && curMove.move != null ? (curMove.move >= 0 ? "hi" : "bad") : ""}>
            {curMove && curMove.move != null ? `${curMove.move >= 0 ? "+" : ""}${fmt(curMove.move, 2)}%` : "—"}</b></div>
        <div><span>Compound annual rate</span>
          <b className={cagr >= 0 ? "hi" : "bad"}>{cagr >= 0 ? "+" : ""}{fmt(cagr, 2)}%</b></div>
      </div>

      <div className="tel-plot">
        <svg viewBox={`0 0 ${W} ${H}`} className="tel-svg" role="img"
          aria-label={`${s.name} yearly closing values from ${view[0].year} to ${view[view.length - 1].year}`}>
          <defs>
            <linearGradient id={`g-${s.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--teal)" stopOpacity=".22" />
              <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridVals.map((v, i) => (
            <g key={i}>
              <line x1={padL} y1={Y(v)} x2={W - padR} y2={Y(v)} className="tel-grid" />
              <text x={padL - 10} y={Y(v) + 4} textAnchor="end" className="tel-axis">
                {v >= 10000 ? `${(v / 1000).toFixed(0)}k` : fmt(v, 0)}
              </text>
            </g>
          ))}

          {worst < -0.08 && (
            <rect x={X(ddStart)} y={padT} width={Math.max(2, X(ddEnd) - X(ddStart))} height={H - padT - padB}
              className="tel-dd" />
          )}

          <path d={area} fill={`url(#g-${s.id})`} className={"tel-area" + (seen ? " in" : "")} />
          <path d={line} className={"tel-line" + (seen && !reduced ? " draw" : " in")}
            style={{ strokeDasharray: 4000, strokeDashoffset: seen || reduced ? 0 : 4000 }} />

          {evInWindow.map((e) => {
            const i = view.findIndex((p) => p.year === e.year);
            if (i < 0) return null;
            const passed = e.year <= point.year;
            return (
              <g key={e.year} className={"tel-ev" + (passed ? " on" : "")}>
                <line x1={X(i)} y1={padT} x2={X(i)} y2={H - padB} />
                <circle cx={X(i)} cy={Y(view[i].close)} r="4" />
              </g>
            );
          })}

          <line x1={X(cur)} y1={padT} x2={X(cur)} y2={H - padB} className="tel-head-line" />
          <circle cx={X(cur)} cy={Y(point.close)} r="6" className="tel-dot" />

          <text x={X(0)} y={H - 14} className="tel-axis">{view[0].year}</text>
          <text x={W - padR} y={H - 14} textAnchor="end" className="tel-axis">{view[view.length - 1].year}</text>
        </svg>
      </div>

      <div className="tel-moves">
        <p className="eyebrow" style={{ marginBottom: 10 }}>Annual movement</p>
        <div className="mv-rows">
          {viewMoves.map((m) => {
            const up = (m.move || 0) >= 0;
            const w = (Math.abs(m.move || 0) / maxMove) * 50;
            const on = m.year === point.year;
            return (
              <div className={"mv-r" + (on ? " on" : "")} key={m.year}
                title={`${m.year}: ${m.move == null ? "no prior year" : fmt(m.move, 2) + "%"}`}>
                <span className="mv-y">{m.year}</span>
                <span className="mv-track">
                  <span className={"mv-b " + (up ? "up" : "down")}
                    style={{ width: `${w}%`, [up ? "left" : "right"]: "50%" }} />
                  <span className="mv-zero" />
                </span>
                <span className={"mv-v " + (m.move == null ? "" : up ? "up" : "down")}>
                  {m.move == null ? "—" : `${up ? "+" : ""}${fmt(m.move, 1)}%`}
                </span>
              </div>
            );
          })}
        </div>
        {best && worstYr && (
          <div className="mv-extremes">
            <div><span>Best year</span><b className="hi">{best.year} · +{fmt(best.move, 1)}%</b></div>
            <div><span>Worst year</span><b className="bad">{worstYr.year} · {fmt(worstYr.move, 1)}%</b></div>
          </div>
        )}
      </div>

      <div className="tel-scrub">
        <label>
          <span className="small">Timeline</span>
          <input type="range" min="0" max={view.length - 1} value={cur}
            onChange={(e) => { setPlaying(false); setIdx(Number(e.target.value)); }} />
        </label>
        <div className="tel-zoom">
          <label><span className="small">From</span>
            <input type="range" min="0" max="90" value={zoom[0]}
              onChange={(e) => { const v = Math.min(Number(e.target.value), zoom[1] - 10); setZoom([v, zoom[1]]); setIdx(null); }} /></label>
          <label><span className="small">To</span>
            <input type="range" min="10" max="100" value={zoom[1]}
              onChange={(e) => { const v = Math.max(Number(e.target.value), zoom[0] + 10); setZoom([zoom[0], v]); setIdx(null); }} /></label>
        </div>
      </div>

      {evAtOrBefore && (
        <div className="tel-note" key={evAtOrBefore.year}>
          <span className="tel-note-y">{evAtOrBefore.year}</span>
          <span><b>{evAtOrBefore.label}</b>{evAtOrBefore.note ? ` ${evAtOrBefore.note}` : ""}</span>
        </div>
      )}

      {worst < -0.08 && (
        <p className="small tel-dd-note">
          Deepest peak to trough decline in this window: {fmt(Math.abs(worst) * 100, 1)}% between{" "}
          {view[ddStart].year} and {view[ddEnd].year}. The shaded band marks it.
        </p>
      )}

      {s.source && <p className="small tel-src">Source: {s.source}</p>}
    </section>
  );
}

function TelemetryPage() {
  const { data, tried } = useIndexHistory();
  const series = data && Array.isArray(data.series) ? data.series : [];
  const events = data && Array.isArray(data.events) && data.events.length ? data.events : MARKET_EVENTS;
  const [on, setOn] = useState(null);

  const visible = on ? series.filter((s) => s.id === on) : series;

  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Telemetry"]]} />
      <div className="wrap">
        <Reveal><p className="kicker">Year by year</p></Reveal>
        <Reveal delay={60}><h1 className="h-page" style={{ marginTop: 12 }}>Telemetry</h1></Reveal>
        <Reveal delay={120}>
          <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>
            Closing values for each series, one chart at a time. Press play and the line is walked
            year by year, with the compound rate updating as it goes and market events surfacing as
            the playhead reaches them. Zoom into any span to read it closely.
          </p>
        </Reveal>
        {data && data.asOf && (
          <Reveal delay={160}>
            <div className="tax-stamp"><span className="badge">{data.asOf}</span></div>
          </Reveal>
        )}
      </div>

      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 100 }}>
        {!data && tried && (
          <div className="sub">
            <p className="body">
              The history file has not been uploaded yet. When
              <code> fin-data/index-history.json </code> is present, every chart on this page fills
              itself. No values are written into the platform, because index history is data and it
              has to come from the exchange rather than from memory.
            </p>
            <p className="small" style={{ marginTop: 14 }}>
              Expected: yearly closing values for each series, with the source named. Sensex from BSE,
              the Nifty family from NSE Indices, gold and silver from the IBJA benchmark rates.
            </p>
          </div>
        )}

        {!tried && <div className="sub"><p className="small">Loading history.</p></div>}

        {series.length > 1 && (
          <Reveal>
            <div className="tel-tabs" role="tablist" aria-label="Series">
              <button role="tab" aria-selected={!on} className={"tab" + (!on ? " on" : "")}
                onClick={() => setOn(null)}>All</button>
              {series.map((s) => (
                <button key={s.id} role="tab" aria-selected={on === s.id}
                  className={"tab" + (on === s.id ? " on" : "")} onClick={() => setOn(s.id)}>{s.name}</button>
              ))}
            </div>
          </Reveal>
        )}

        <div className="tel-list">
          {visible.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i * 70, 300)}>
              <TelemetryChart s={s} events={events} />
            </Reveal>
          ))}
        </div>

        {series.length > 0 && (
          <Reveal>
            <div className="sub" style={{ marginTop: 34, borderLeft: "2px solid var(--amber)" }}>
              <p className="body" style={{ fontSize: 15.5 }}>
                Index values are points, not prices, and gold and silver are quoted per unit weight.
                They are shown on separate charts because they are not comparable quantities. Past
                movement describes what happened, and carries no information about what follows.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </>
  );
}

/* ===========================================================================
   FINHUB SIMULATOR
   An educational market simulation. No live prices, no real orders, no money.
   Every price is produced by an internal engine and every execution follows a
   simulated workflow, because the purpose is to teach what an action means
   rather than to imitate a broker.
   =========================================================================== */

const SIM_START_CAPITAL = 500000;

const INSTRUMENTS = [
  { id: "gold", name: "Gold", exch: "MCX", contract: "GOLD DEC", lot: 100, unit: "10 grams",
    price: 72400, vol: 0.0032, margin: 0.08, kind: "commodity", tick: 1 },
  { id: "silver", name: "Silver", exch: "MCX", contract: "SILVER DEC", lot: 30, unit: "1 kilogram",
    price: 88600, vol: 0.0058, margin: 0.09, kind: "commodity", tick: 1 },
  { id: "crude", name: "Crude Oil", exch: "MCX", contract: "CRUDEOIL SEP", lot: 100, unit: "1 barrel",
    price: 6240, vol: 0.0071, margin: 0.10, kind: "commodity", tick: 1 },
  { id: "natgas", name: "Natural Gas", exch: "MCX", contract: "NATURALGAS SEP", lot: 1250, unit: "mmBtu",
    price: 248, vol: 0.0095, margin: 0.12, kind: "commodity", tick: 0.1 },
  { id: "copper", name: "Copper", exch: "MCX", contract: "COPPER SEP", lot: 2500, unit: "1 kilogram",
    price: 842, vol: 0.0041, margin: 0.09, kind: "commodity", tick: 0.05 },
  { id: "nifty", name: "Nifty 50", exch: "NSE", contract: "NIFTY FUT", lot: 75, unit: "index point",
    price: 24180, vol: 0.0026, margin: 0.12, kind: "index", tick: 0.05 },
  { id: "banknifty", name: "Bank Nifty", exch: "NSE", contract: "BANKNIFTY FUT", lot: 35, unit: "index point",
    price: 51420, vol: 0.0036, margin: 0.13, kind: "index", tick: 0.05 },
  { id: "usdinr", name: "USD / INR", exch: "NSE", contract: "USDINR SEP", lot: 1000, unit: "US dollar",
    price: 87.4, vol: 0.0014, margin: 0.03, kind: "currency", tick: 0.0025 },
];

/* Session phases, driven by an internal clock rather than any exchange feed. */
const PHASES = [
  { id: "preopen", label: "Pre-open", from: 0, to: 15, note: "Orders are collected before the session begins. Nothing executes yet." },
  { id: "opening", label: "Opening", from: 15, to: 30, note: "The session has opened. Early prices reflect participants responding to whatever changed while the market was shut." },
  { id: "first15", label: "First 15 minutes", from: 30, to: 45, note: "The opening window. Activity is often heavier here. Observing before acting is a reasonable choice." },
  { id: "main", label: "Main session", from: 45, to: 300, note: "The steady part of the session." },
  { id: "closing", label: "Closing phase", from: 300, to: 330, note: "The session is heading toward its close. Review open positions and exposure." },
  { id: "final10", label: "Final 10 minutes", from: 330, to: 345, note: "The last stretch of the simulated session." },
  { id: "closed", label: "Closed", from: 345, to: 999, note: "The simulated session has ended. Orders cannot execute." },
];
const phaseAt = (m) => PHASES.find((p) => m >= p.from && m < p.to) || PHASES[PHASES.length - 1];
const clockOf = (m) => {
  const t = 9 * 60 + 15 + m;
  return `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

/* A controlled price path. Trend plus mean reversion plus phase-dependent
   volatility, so movement looks plausible without being random noise. */
function stepPrice(inst, state) {
  const ph = state.phase;
  const heat = ph === "opening" || ph === "first15" ? 1.9 : ph === "final10" ? 1.5 : ph === "preopen" ? 0.2 : 1;
  const drift = state.trend * inst.vol * 0.35;
  const revert = ((inst.price - state.last) / inst.price) * 0.06;
  const shock = (Math.random() - 0.5) * 2 * inst.vol * heat;
  const next = state.last * (1 + drift + revert + shock);
  const t = inst.tick;
  return Math.max(t, Math.round(next / t) * t);
}

function useSimEngine(running) {
  const [minute, setMinute] = useState(0);
  const [prices, setPrices] = useState(() => {
    const o = {};
    INSTRUMENTS.forEach((i) => { o[i.id] = { last: i.price, open: i.price, hist: [i.price], trend: (Math.random() - 0.45) * 2 }; });
    return o;
  });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setMinute((m) => (m >= 345 ? m : m + 1));
    }, 1100);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const ph = phaseAt(minute).id;
    setPrices((prev) => {
      const next = { ...prev };
      INSTRUMENTS.forEach((i) => {
        const st = prev[i.id];
        if (ph === "closed") { next[i.id] = st; return; }
        const p = stepPrice(i, { last: st.last, trend: st.trend, phase: ph });
        const trend = Math.max(-1.6, Math.min(1.6, st.trend + (Math.random() - 0.5) * 0.22));
        next[i.id] = { ...st, last: p, trend, hist: [...st.hist.slice(-179), p] };
      });
      return next;
    });
  }, [minute, running]);

  return { minute, prices, setMinute };
}

/* ---- chart ---- */
function SimChart({ hist, open }) {
  const W = 640, H = 200, pad = 8;
  if (!hist || hist.length < 2) return <div className="simchart-empty" />;
  const lo = Math.min(...hist, open), hi = Math.max(...hist, open);
  const X = (i) => pad + (i / (hist.length - 1)) * (W - pad * 2);
  const Y = (v) => H - pad - ((v - lo) / Math.max(hi - lo, 1e-9)) * (H - pad * 2);
  const line = hist.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  const up = hist[hist.length - 1] >= open;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="simchart" role="img" aria-label="Simulated price path">
      <line x1={pad} y1={Y(open)} x2={W - pad} y2={Y(open)} className="simchart-open" />
      <path d={`${line} L${X(hist.length - 1)} ${H - pad} L${X(0)} ${H - pad} Z`}
        className={"simchart-area " + (up ? "up" : "down")} />
      <path d={line} className={"simchart-line " + (up ? "up" : "down")} />
      <circle cx={X(hist.length - 1)} cy={Y(hist[hist.length - 1])} r="4"
        className={"simchart-dot " + (up ? "up" : "down")} />
    </svg>
  );
}

/* ---- the simulator ---- */
function SimulatorPage() {
  const [name, setName] = useState("");
  const [stage, setStage] = useState("gate");      // gate, notice, live
  const [adult, setAdult] = useState(false);
  const [sel, setSel] = useState("gold");
  const [side, setSide] = useState("buy");
  const [otype, setOtype] = useState("market");
  const [qty, setQty] = useState(1);
  const [limit, setLimit] = useState(0);
  const [review, setReview] = useState(null);
  const [exec, setExec] = useState(null);
  const [orders, setOrders] = useState([]);
  const [positions, setPositions] = useState([]);
  const positionsRef = useRef([]);
  useEffect(() => { positionsRef.current = positions; }, [positions]);
  const [cash, setCash] = useState(SIM_START_CAPITAL);
  const [realised, setRealised] = useState(0);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState("positions");
  const [insight, setInsight] = useState(null);
  const [seenPhase, setSeenPhase] = useState({});
  const [summary, setSummary] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const { minute, prices } = useSimEngine(stage === "live");
  const phase = phaseAt(minute);
  const inst = INSTRUMENTS.find((i) => i.id === sel);
  const px = prices[sel];
  const last = px.last;
  const chg = last - px.open;
  const chgPct = (chg / px.open) * 100;
  const tradable = ["opening", "first15", "main", "closing", "final10"].includes(phase.id);

  const notify = (title, body, tone = "") => {
    setToast({ title, body, tone, k: Date.now() });
    setTimeout(() => setToast((t) => (t && t.k ? null : t)), 3600);
  };

  useEffect(() => {
    if (stage !== "live") return;
    if (["opening", "first15", "closing", "final10", "closed"].includes(phase.id) && !seenPhase[phase.id]) {
      setSeenPhase((s) => ({ ...s, [phase.id]: true }));
      notify(phase.label, phase.note);
      if (phase.id === "closed") setSummary(true);
    }
  }, [phase.id, stage]);

  const contractValue = (i, price, q) => i.lot * price * q;
  const marginFor = (i, price, q) => contractValue(i, price, q) * i.margin;
  const chargesFor = (i, price, q) => {
    const v = contractValue(i, price, q);
    const brokerage = 20;
    const txn = v * 0.000026;
    const stt = side === "sell" ? v * 0.0001 : 0;
    const gst = (brokerage + txn) * 0.18;
    return brokerage + txn + stt + gst;
  };

  const openReview = () => {
    if (!tradable) { notify("Market closed", "This simulated session is not accepting orders in the current phase."); return; }
    if (!qty || qty < 1) { notify("Invalid quantity", "Enter a quantity of at least one lot."); return; }
    const price = otype === "market" ? last : Number(limit) || last;
    const margin = marginFor(inst, price, qty);
    const charges = chargesFor(inst, price, qty);
    if (margin + charges > cash) {
      notify("Insufficient simulated balance",
        `This order needs ₹${fmt(margin + charges)} of simulated capital. You have ₹${fmt(cash)}. Reduce the quantity or choose a smaller contract.`);
      return;
    }
    setReview({ price, margin, charges, value: contractValue(inst, price, qty) });
  };

  const confirmOrder = () => {
    const r = review;
    setReview(null);
    setExec("submitted");
    const id = `FH-20260830-${String(orders.length + 1).padStart(4, "0")}`;
    notify("Order submitted", `${id} sent to the simulator.`);
    setTimeout(() => setExec("executing"), 450);
    setTimeout(() => {
      const fill = otype === "market" ? last : r.price;
      setExec("done");
      setOrders((o) => [{ id, t: clockOf(minute), inst: inst.name, side, otype, qty, price: fill, status: "Executed" }, ...o]);
      setCash((c) => c - r.margin - r.charges);

      const ps = positionsRef.current;
      const oppIdx = ps.findIndex((p) => p.id === inst.id && p.side !== side);
      const sameIdx = ps.findIndex((p) => p.id === inst.id && p.side === side);
      if (oppIdx >= 0) {
        const p = ps[oppIdx];
        const closeQty = Math.min(p.qty, qty);
        const dir = p.side === "buy" ? 1 : -1;
        const pnl = (fill - p.avg) * dir * inst.lot * closeQty;
        const freed = p.margin * (closeQty / p.qty);
        const left = p.qty - closeQty;
        const rest = ps.filter((_, k) => k !== oppIdx);
        setPositions(left > 0 ? [...rest, { ...p, qty: left, margin: p.margin - freed }] : rest);
        setRealised((x) => x + pnl);
        setCash((c) => c + freed + pnl);
        notify("Position closed", `Realised ${pnl >= 0 ? "gain" : "loss"} of ₹${fmt(Math.abs(pnl))}.`, pnl >= 0 ? "up" : "down");
      } else if (sameIdx >= 0) {
        const p = ps[sameIdx];
        const total = p.qty + qty;
        const avg = (p.avg * p.qty + fill * qty) / total;
        const copy = [...ps];
        copy[sameIdx] = { ...p, qty: total, avg, margin: p.margin + r.margin };
        setPositions(copy);
      } else {
        setPositions([...ps, { id: inst.id, name: inst.name, lot: inst.lot, side, qty, avg: fill, margin: r.margin }]);
      }

      notify("Order executed", `${side === "buy" ? "Bought" : "Sold"} ${qty} lot${qty > 1 ? "s" : ""} of ${inst.name} at ${fmt(fill, 2)}.`, "up");
      setInsight({
        title: side === "buy" ? "You opened a long position" : "You opened a short position",
        body: side === "buy"
          ? `Simulated capital of ₹${fmt(r.margin)} is now blocked as margin. Your exposure to ${inst.name} is ₹${fmt(r.value)}, which is ${(r.value / r.margin).toFixed(1)} times the capital committed. Profit and loss will now respond to every price move, in both directions.`
          : `You have agreed to deliver at ${fmt(fill, 2)}. A fall in price now produces a gain and a rise produces a loss, which is the reverse of a long position. Margin of ₹${fmt(r.margin)} is blocked.`,
      });
      setTimeout(() => setExec(null), 900);
    }, 1250);
  };

  const closePosition = (p) => {
    if (!tradable) { notify("Market closed", "Positions cannot be closed in the current phase."); return; }
    const price = prices[p.id].last;
    const i = INSTRUMENTS.find((x) => x.id === p.id);
    const dir = p.side === "buy" ? 1 : -1;
    const pnl = (price - p.avg) * dir * i.lot * p.qty;
    const charges = 20 + contractValue(i, price, p.qty) * 0.000026;
    setRealised((x) => x + pnl);
    setCash((c) => c + p.margin + pnl - charges);
    setPositions((ps) => ps.filter((x) => !(x.id === p.id && x.side === p.side)));
    setOrders((o) => [{
      id: `FH-20260830-${String(o.length + 1).padStart(4, "0")}`, t: clockOf(minute), inst: p.name,
      side: p.side === "buy" ? "sell" : "buy", otype: "market", qty: p.qty, price, status: "Executed",
    }, ...o]);
    notify("Position closed", `Realised ${pnl >= 0 ? "gain" : "loss"} of ₹${fmt(Math.abs(pnl))}.`, pnl >= 0 ? "up" : "down");
  };

  const unreal = positions.reduce((sum, p) => {
    const i = INSTRUMENTS.find((x) => x.id === p.id);
    const dir = p.side === "buy" ? 1 : -1;
    return sum + (prices[p.id].last - p.avg) * dir * i.lot * p.qty;
  }, 0);
  const blocked = positions.reduce((s, p) => s + p.margin, 0);
  const portfolio = cash + blocked + unreal;

  const resetAll = () => {
    setOrders([]); setPositions([]); setCash(SIM_START_CAPITAL); setRealised(0);
    setInsight(null); setSummary(false); setConfirmReset(false);
    notify("Simulation reset", "Positions, orders and profit and loss have been cleared.");
  };

  /* ---- entry ---- */
  if (stage !== "live") {
    return (
      <>
        <Crumbs items={[["FinHub", "#/"], ["Simulator"]]} />
        <div className="floor-gate">
          <FloorAmbience />
          <div className="wrap-n gate-in">
            <Reveal><p className="kicker">Educational market simulation</p></Reveal>
            <Reveal delay={70}><h1 className="h-page" style={{ marginTop: 14 }}>FinHub Simulator</h1></Reveal>
            <Reveal delay={130}>
              <p className="lede" style={{ marginTop: 18 }}>
                A complete market workflow, from session open to close. Place an order, watch it
                execute, hold a position while the price moves, and see what your decision actually did.
              </p>
            </Reveal>

            {stage === "gate" && (
              <Reveal delay={200}>
                <div className="gate-form">
                  <label className="tkf wide">
                    <span>What should the screen call you</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24}
                      placeholder="A first name is enough"
                      onKeyDown={(e) => { if (e.key === "Enter" && adult) setStage("notice"); }} />
                  </label>
                  <label className="gate-check">
                    <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
                    <span>I confirm I am 18 years of age or older.</span>
                  </label>
                  <button className="btn primary" disabled={!adult} onClick={() => setStage("notice")}>
                    Continue
                  </button>
                  <p className="small">
                    Nothing you type is stored or sent anywhere. It stays in this browser tab.
                  </p>
                </div>
              </Reveal>
            )}

            {stage === "notice" && (
              <Reveal>
                <div className="notice-card">
                  <p className="notice-h">FinHub Simulator</p>
                  <p className="notice-sub">Educational market simulation</p>
                  <div className="notice-body">
                    <p>This simulator is designed for educational purposes only.</p>
                    <ul>
                      <li>No real orders are placed.</li>
                      <li>No live market prices are used.</li>
                      <li>No real money is involved.</li>
                      <li>All prices, market movements and executions are simulated.</li>
                    </ul>
                    <p>
                      It exists to help you understand how trading workflows, orders, positions, risk
                      and market behaviour work. FinHub does not ask for a PAN, a bank account, a UPI
                      identifier or any payment detail, and never will.
                    </p>
                  </div>
                  <div className="risk" style={{ marginTop: 18 }}>
                    <p className="risk-h">Risk disclosure for Futures and Options</p>
                    <p className="risk-b">{SEBI_RISK}</p>
                    <p className="risk-b" style={{ marginTop: 10, fontWeight: 600 }}>
                      No orders are placed. No prices are live. Educational simulation only.
                    </p>
                  </div>
                  <button className="btn primary" style={{ marginTop: 22 }}
                    onClick={() => setStage("live")}>Enter the simulator</button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ---- live simulator ---- */
  return (
    <>
      <div className="sim">
        <div className="sim-top">
          <div className="sim-brand">
            <span className="sim-dot" />
            <b>FinHub Simulator</b>
            <span className="sim-flag">Simulated market</span>
          </div>
          <div className="sim-top-r">
            <div className="sim-stat"><span>Session</span><b>{clockOf(minute)}</b></div>
            <div className="sim-stat"><span>Phase</span><b className={phase.id === "closed" ? "bad" : "hi"}>{phase.label}</b></div>
            <div className="sim-stat"><span>Portfolio</span><b><Counter value={portfolio} decimals={0} /></b></div>
            <button className="tbtn" onClick={() => setConfirmReset(true)}>Reset</button>
          </div>
        </div>

        <div className="sim-grid">
          <aside className="sim-watch">
            <p className="sim-h">Watchlist</p>
            {INSTRUMENTS.map((i) => {
              const p = prices[i.id];
              const d = ((p.last - p.open) / p.open) * 100;
              return (
                <button key={i.id} className={"wrow" + (sel === i.id ? " on" : "")}
                  onClick={() => { setSel(i.id); setLimit(0); }}>
                  <span className="wname">{i.name}<em>{i.exch}</em></span>
                  <span className="wpx">
                    {fmt(p.last, i.tick < 1 ? 2 : 0)}
                    <em className={d >= 0 ? "up" : "down"}>{d >= 0 ? "+" : ""}{fmt(d, 2)}%</em>
                  </span>
                </button>
              );
            })}
          </aside>

          <main className="sim-main">
            <div className="sim-inst">
              <div>
                <p className="sim-inst-n">{inst.name}<span>{inst.contract}</span></p>
                <p className="small">{inst.exch} · Lot {inst.lot} · {inst.unit}</p>
              </div>
              <div className="sim-price">
                <b><Counter value={last} prefix="" decimals={inst.tick < 1 ? 2 : 0} /></b>
                <span className={chg >= 0 ? "up" : "down"}>
                  {chg >= 0 ? "+" : ""}{fmt(chg, 2)} ({chg >= 0 ? "+" : ""}{fmt(chgPct, 2)}%)
                </span>
              </div>
            </div>
            <SimChart hist={px.hist} open={px.open} />
            <p className="sim-phase-note">{phase.note}</p>
          </main>

          <aside className="sim-order">
            <div className="seg" style={{ marginBottom: 14 }}>
              <button className={"seg-b buy" + (side === "buy" ? " on" : "")} onClick={() => setSide("buy")}>Buy</button>
              <button className={"seg-b sell" + (side === "sell" ? " on" : "")} onClick={() => setSide("sell")}>Sell</button>
            </div>
            <div className="seg" style={{ marginBottom: 16 }}>
              {[["market", "Market"], ["limit", "Limit"]].map(([k, l]) => (
                <button key={k} className={"seg-b" + (otype === k ? " on" : "")} onClick={() => setOtype(k)}>{l}</button>
              ))}
            </div>
            <label className="tkf"><span>Quantity in lots</span>
              <input type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(0, Number(e.target.value)))} /></label>
            {otype === "limit" && (
              <label className="tkf" style={{ marginTop: 12 }}><span>Limit price</span>
                <input type="number" value={limit || Math.round(last)} onChange={(e) => setLimit(Number(e.target.value))} /></label>
            )}
            <div className="sim-calc">
              <div><span>Contract value</span><b>₹{fmt(contractValue(inst, otype === "market" ? last : (limit || last), qty || 0))}</b></div>
              <div><span>Margin required</span><b className="hi">₹{fmt(marginFor(inst, otype === "market" ? last : (limit || last), qty || 0))}</b></div>
              <div><span>Estimated charges</span><b>₹{fmt(chargesFor(inst, otype === "market" ? last : (limit || last), qty || 0), 2)}</b></div>
              <div><span>Available balance</span><b>₹{fmt(cash)}</b></div>
            </div>
            <button className={"btn primary sim-review " + side} onClick={openReview}>Review order</button>
            <p className="sim-fine">
              {otype === "market"
                ? "A market order attempts simulated execution at the simulator's current price."
                : "A limit order attempts simulated execution at your price or better, under the simulator's rules."}
            </p>
          </aside>
        </div>

        <div className="sim-book">
          <div className="sim-tabs">
            {[["positions", `Positions (${positions.length})`], ["orders", `Orders (${orders.length})`], ["portfolio", "Portfolio"]].map(([k, l]) => (
              <button key={k} className={"ptab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>

          {tab === "positions" && (
            <div className="sim-table-wrap">
              {positions.length === 0
                ? <p className="sim-empty">No open positions. Place an order to create one.</p>
                : (
                  <table className="ttable">
                    <thead><tr>
                      <th className="first">Instrument</th><th>Side</th><th>Lots</th>
                      <th>Average</th><th>Current</th><th>Unrealised</th><th></th>
                    </tr></thead>
                    <tbody>
                      {positions.map((p, k) => {
                        const i = INSTRUMENTS.find((x) => x.id === p.id);
                        const cur = prices[p.id].last;
                        const dir = p.side === "buy" ? 1 : -1;
                        const pnl = (cur - p.avg) * dir * i.lot * p.qty;
                        return (
                          <tr key={k}>
                            <td className="first">{p.name}</td>
                            <td><span className={"pill " + p.side}>{p.side === "buy" ? "Long" : "Short"}</span></td>
                            <td>{p.qty}</td>
                            <td>{fmt(p.avg, 2)}</td>
                            <td>{fmt(cur, 2)}</td>
                            <td className={pnl >= 0 ? "up" : "down"}>{pnl >= 0 ? "+" : ""}₹{fmt(pnl)}</td>
                            <td><button className="tbtn" onClick={() => closePosition(p)}>Close</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
            </div>
          )}

          {tab === "orders" && (
            <div className="sim-table-wrap">
              {orders.length === 0
                ? <p className="sim-empty">No orders yet.</p>
                : (
                  <table className="ttable">
                    <thead><tr>
                      <th className="first">Order ID</th><th>Time</th><th>Instrument</th>
                      <th>Side</th><th>Type</th><th>Lots</th><th>Price</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td className="first mono">{o.id}</td><td>{o.t}</td><td>{o.inst}</td>
                          <td><span className={"pill " + o.side}>{o.side === "buy" ? "Buy" : "Sell"}</span></td>
                          <td>{o.otype === "market" ? "Market" : "Limit"}</td>
                          <td>{o.qty}</td><td>{fmt(o.price, 2)}</td>
                          <td><span className="pill done">{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          )}

          {tab === "portfolio" && (
            <div className="sim-port">
              {[
                ["Starting capital", SIM_START_CAPITAL, ""],
                ["Available cash", cash, ""],
                ["Margin blocked", blocked, ""],
                ["Unrealised profit and loss", unreal, unreal >= 0 ? "up" : "down"],
                ["Realised profit and loss", realised, realised >= 0 ? "up" : "down"],
                ["Total portfolio value", portfolio, portfolio >= SIM_START_CAPITAL ? "up" : "down"],
              ].map(([l, v, tone]) => (
                <div key={l}><span>{l}</span><b className={tone}>₹{fmt(v)}</b></div>
              ))}
            </div>
          )}
        </div>

        {insight && (
          <div className="sim-insight">
            <div>
              <p className="eyebrow" style={{ marginBottom: 8 }}>What just happened</p>
              <p className="sim-insight-t">{insight.title}</p>
              <p className="body" style={{ fontSize: 15.5, marginTop: 8 }}>{insight.body}</p>
            </div>
            <button className="tbtn" onClick={() => setInsight(null)}>Dismiss</button>
          </div>
        )}
      </div>

      {review && (
        <div className="ov" onMouseDown={(e) => { if (e.target === e.currentTarget) setReview(null); }}>
          <div className="rev" role="dialog" aria-modal="true">
            <p className="rev-h">Review order</p>
            <p className="rev-sub">{side === "buy" ? "Buy" : "Sell"} {inst.name} · {inst.contract}</p>
            <div className="rev-rows">
              <div><span>Quantity</span><b>{qty} lot{qty > 1 ? "s" : ""} · {qty * inst.lot} {inst.unit}</b></div>
              <div><span>Order type</span><b>{otype === "market" ? "Market" : "Limit"}</b></div>
              <div><span>Simulated price</span><b>{fmt(review.price, 2)}</b></div>
              <div><span>Contract value</span><b>₹{fmt(review.value)}</b></div>
              <div><span>Margin required</span><b>₹{fmt(review.margin)}</b></div>
              <div><span>Estimated charges</span><b>₹{fmt(review.charges, 2)}</b></div>
              <div><span>Balance after</span><b>₹{fmt(cash - review.margin - review.charges)}</b></div>
            </div>
            <p className="rev-flag">Simulated order. Nothing is sent to any exchange.</p>
            <div className="rev-btns">
              <button className="btn ghost" onClick={() => setReview(null)}>Cancel</button>
              <button className={"btn primary " + side} onClick={confirmOrder}>
                Confirm {side === "buy" ? "buy" : "sell"}
              </button>
            </div>
          </div>
        </div>
      )}

      {exec && (
        <div className="execbar">
          <span className={"execdot " + exec} />
          {exec === "submitted" && "Order submitted"}
          {exec === "executing" && "Simulating execution"}
          {exec === "done" && "Executed"}
        </div>
      )}

      {toast && (
        <div className={"toast " + (toast.tone || "")} key={toast.k}>
          <b>{toast.title}</b>
          <p>{toast.body}</p>
        </div>
      )}

      {confirmReset && (
        <div className="ov" onMouseDown={(e) => { if (e.target === e.currentTarget) setConfirmReset(false); }}>
          <div className="rev" role="dialog" aria-modal="true">
            <p className="rev-h">Reset simulation?</p>
            <p className="body" style={{ marginTop: 10, fontSize: 15.5 }}>
              This clears your simulated positions, orders, trade history and profit and loss.
            </p>
            <div className="rev-btns">
              <button className="btn ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
              <button className="btn primary" onClick={resetAll}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {summary && (
        <div className="ov">
          <div className="rev wide" role="dialog" aria-modal="true">
            <p className="rev-h">Simulated market closed</p>
            <p className="rev-sub">{name ? `${name}, here is your session.` : "Here is your session."}</p>
            <div className="rev-rows">
              <div><span>Starting capital</span><b>₹{fmt(SIM_START_CAPITAL)}</b></div>
              <div><span>Ending value</span><b>₹{fmt(portfolio)}</b></div>
              <div><span>Total profit and loss</span>
                <b className={portfolio - SIM_START_CAPITAL >= 0 ? "up" : "down"}>
                  {portfolio - SIM_START_CAPITAL >= 0 ? "+" : ""}₹{fmt(portfolio - SIM_START_CAPITAL)}</b></div>
              <div><span>Orders placed</span><b>{orders.length}</b></div>
              <div><span>Positions still open</span><b>{positions.length}</b></div>
              <div><span>Realised</span><b className={realised >= 0 ? "up" : "down"}>₹{fmt(realised)}</b></div>
              <div><span>Unrealised</span><b className={unreal >= 0 ? "up" : "down"}>₹{fmt(unreal)}</b></div>
            </div>
            <p className="rev-flag">
              Every figure above came from a simulated price engine. Real markets do not behave on a
              schedule, and a simulated result says nothing about what any real position would do.
            </p>
            <div className="rev-btns">
              <button className="btn ghost" onClick={() => setSummary(false)}>Close</button>
              <button className="btn primary" onClick={resetAll}>Run another session</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ===========================================================================
   FINANCIAL INTELLIGENCE
   Concepts explain what something is. Cases show what happened. This layer
   shows how force travels: which institution it reaches first, what changes
   there, how long it takes, and why the same shock helps one business and
   damages another.

   Nothing here is a forecast. Every chain is a documented transmission
   mechanism, and the direction is far more reliable than the magnitude.
   =========================================================================== */

const FI_NODES = {
  rbi:      { name: "Central bank",        sub: "Sets the policy rate",            x: 50,  y: 14 },
  markets:  { name: "Money markets",       sub: "Overnight funding",               x: 50,  y: 30 },
  banks:    { name: "Commercial banks",    sub: "Deposits and lending",            x: 22,  y: 46 },
  nbfc:     { name: "NBFCs",               sub: "Market funded lenders",           x: 50,  y: 46 },
  bonds:    { name: "Bond market",         sub: "Yields across maturities",        x: 78,  y: 46 },
  firms:    { name: "Companies",           sub: "Borrow to invest",                x: 22,  y: 64 },
  house:    { name: "Households",          sub: "Loans and deposits",              x: 50,  y: 64 },
  equity:   { name: "Equity market",       sub: "Valuations and flows",            x: 78,  y: 64 },
  economy:  { name: "Demand and prices",   sub: "Where policy is aimed",           x: 50,  y: 84 },
  fx:       { name: "Currency",            sub: "Rupee against the dollar",        x: 84,  y: 30 },
  importers:{ name: "Importers",           sub: "Pay in foreign currency",         x: 22,  y: 30 },
  exporters:{ name: "Exporters",           sub: "Earn in foreign currency",        x: 84,  y: 84 },
  oil:      { name: "Crude oil",           sub: "Imported input",                  x: 16,  y: 14 },
};

const FI_CHAINS = [
  {
    id: "rate-rise",
    title: "The central bank raises the policy rate",
    tag: "Monetary policy",
    intro: "The most studied transmission chain in finance. Every step is documented, but the lags are long and variable, and the size of each effect is far less predictable than its direction.",
    steps: [
      { node: "rbi", lag: "Day one", head: "The policy rate rises",
        text: "The rate at which banks borrow overnight from the central bank goes up. Nothing else has changed yet.",
        concept: "monetary-policy" },
      { node: "markets", lag: "Same day", head: "Overnight funding costs more",
        text: "Money market rates reprice almost immediately, because this is where the policy rate is directly enforced.",
        concept: "money-markets" },
      { node: "bonds", lag: "Same day", head: "Bond prices fall",
        text: "Existing bonds carry fixed coupons. When buyers demand a higher yield, the only thing that can move is the price. Longer maturities fall furthest.",
        concept: "bond-pricing" },
      { node: "banks", lag: "Weeks", head: "Lending rates follow",
        text: "Banks fund themselves at a higher cost and pass it into loan pricing. Floating rate borrowers feel it first; deposit rates usually lag lending rates.",
        concept: "commercial-banking" },
      { node: "nbfc", lag: "Weeks", head: "NBFCs are squeezed harder",
        text: "They cannot take deposits, so they fund themselves from exactly the market that just repriced. Their margin compresses before a bank's does.",
        concept: "nbfc" },
      { node: "firms", lag: "One to two quarters", head: "Projects are deferred",
        text: "The hurdle rate rises with the cost of capital. Projects that cleared at the old rate no longer clear, and capital spending slows.",
        concept: "cost-of-capital" },
      { node: "equity", lag: "Immediate, then gradual", head: "Valuations are marked down",
        text: "A higher discount rate reduces the present value of future cash flows. Businesses whose value sits furthest in the future fall hardest.",
        concept: "discount-rate" },
      { node: "house", lag: "One to two quarters", head: "Households pay more, spend less",
        text: "EMIs rise on floating rate loans. Discretionary spending falls, while savers eventually earn more on deposits.",
        concept: "time-value-of-money" },
      { node: "economy", lag: "Four to eight quarters", head: "Demand cools and inflation eases",
        text: "This is the intended destination, and it takes the longest to arrive. Whether anyone is better off depends on where inflation settles relative to these higher nominal rates.",
        concept: "real-return" },
    ],
    caveat: "Transmission is incomplete and uneven. Fixed rate borrowers are unaffected until refinancing. Deposit rates typically rise more slowly than lending rates. And a supply driven price shock does not respond to demand suppression at all.",
  },
  {
    id: "rupee-fall",
    title: "The rupee weakens against the dollar",
    tag: "Currency",
    intro: "A currency move is not good or bad in itself. It is a transfer, and who gains depends entirely on which side of the trade a business sits.",
    steps: [
      { node: "fx", lag: "Immediate", head: "The rupee depreciates",
        text: "More rupees are needed for each dollar. Driven by capital flows, rate differentials, trade balances or sentiment.",
        concept: "foreign-exchange" },
      { node: "oil", lag: "Immediate", head: "Imported inputs cost more",
        text: "Crude is priced in dollars. The same barrel now costs more rupees before a single price at the pump changes.",
        concept: "currency-risk" },
      { node: "importers", lag: "Weeks", head: "Import bills rise",
        text: "Anyone paying in foreign currency faces higher costs. Unhedged foreign currency debt becomes larger in rupee terms without a rupee being borrowed.",
        concept: "currency-risk" },
      { node: "exporters", lag: "Weeks to months", head: "Exporters gain",
        text: "The same dollar of revenue converts into more rupees. Margins widen for software services, pharmaceuticals and other export led sectors.",
        concept: "foreign-exchange" },
      { node: "economy", lag: "One to two quarters", head: "Imported inflation appears",
        text: "Higher input costs pass into domestic prices with a lag, most visibly through fuel and anything with imported components.",
        concept: "inflation" },
      { node: "rbi", lag: "Two to three quarters", head: "Policy may respond",
        text: "If depreciation feeds durable inflation, the central bank may tighten, which loops back into the entire rate chain.",
        concept: "monetary-policy" },
    ],
    caveat: "A weaker currency helps exporters only if their costs are domestic. An exporter with imported inputs gains far less than the headline suggests.",
  },
  {
    id: "credit-freeze",
    title: "A large lender defaults",
    tag: "Credit",
    intro: "This chain moves faster than any other, because it runs on confidence rather than on contracts. IL&FS in 2018 followed it almost exactly.",
    steps: [
      { node: "nbfc", lag: "Day one", head: "One lender fails to pay",
        text: "A default is disclosed. The immediate loss is contained, but the information is not.",
        concept: "credit-risk" },
      { node: "markets", lag: "Days", head: "Short term funding closes",
        text: "Lenders stop rolling over commercial paper, not only for the defaulter but for anything that resembles it. Funding is withdrawn from a category, not a company.",
        concept: "liquidity-risk" },
      { node: "bonds", lag: "Days", head: "Spreads widen",
        text: "The price of credit risk rises across the market. Funds holding the paper mark down their holdings, and investors who believed they held a low risk product discover otherwise.",
        concept: "credit-risk" },
      { node: "banks", lag: "Weeks", head: "Banks pull back",
        text: "Exposure limits tighten. Even sound borrowers find credit harder to obtain, because lenders cannot quickly distinguish sound from unsound.",
        concept: "commercial-banking" },
      { node: "firms", lag: "One quarter", head: "Real activity slows",
        text: "Businesses dependent on that credit defer purchases and projects. Sectors funded largely by NBFCs feel it first.",
        concept: "working-capital" },
      { node: "economy", lag: "Two to three quarters", head: "Growth is affected",
        text: "A funding problem has become an output problem, without any underlying asset ever losing its productive value.",
        concept: "liquidity-risk" },
    ],
    caveat: "The speed is the danger. A solvency question becomes a liquidity event within days, and liquidity events do not wait for analysis.",
  },
];

/* Which force helps or hurts which sector, and why. */
const FI_FORCES = [
  { id: "rates", name: "Interest rates rise" },
  { id: "rupee", name: "Rupee weakens" },
  { id: "oil", name: "Crude oil rises" },
  { id: "inflation", name: "Inflation rises" },
];

const FI_SECTORS = [
  { name: "Banks", rates: 1, rupee: 0, oil: 0, inflation: -1,
    why: { rates: "Lending rates reprice faster than deposit rates, so margins widen before funding costs catch up.",
           rupee: "Limited direct exposure, though foreign currency borrowers in the loan book become riskier.",
           oil: "No direct exposure. Indirect, through the credit quality of oil dependent borrowers.",
           inflation: "Erodes the real value of fixed rate loans already on the book." } },
  { name: "NBFCs", rates: -2, rupee: 0, oil: 0, inflation: -1,
    why: { rates: "They fund from markets that reprice immediately, while their loan book reprices slowly. Margin compresses from both ends.",
           rupee: "Only relevant where funding is raised abroad.",
           oil: "Indirect, through borrower cash flows in transport and logistics.",
           inflation: "Raises funding costs and stresses borrower repayment capacity." } },
  { name: "Information technology", rates: -1, rupee: 2, oil: 0, inflation: 0,
    why: { rates: "Valuations depend heavily on distant cash flows, so a higher discount rate marks them down sharply.",
           rupee: "Revenue is earned in dollars while most costs are in rupees. Depreciation flows almost directly to margin.",
           oil: "Negligible input exposure.",
           inflation: "Wage inflation matters more than price inflation for this sector." } },
  { name: "Oil marketing", rates: 0, rupee: -2, oil: -2, inflation: -1,
    why: { rates: "Moderate, through working capital costs on large inventories.",
           rupee: "Crude is bought in dollars and sold in rupees. Depreciation squeezes the spread directly.",
           oil: "The core input cost. Where retail prices are administered, the squeeze is absorbed rather than passed on.",
           inflation: "Raises operating costs across the distribution network." } },
  { name: "Infrastructure", rates: -2, rupee: -1, oil: -1, inflation: -1,
    why: { rates: "Highly leveraged with long gestation. Interest cost rises immediately while revenue does not.",
           rupee: "Imported equipment and any foreign currency debt become more expensive.",
           oil: "Fuel and transport are significant construction inputs.",
           inflation: "Input costs rise on fixed price contracts, compressing margins." } },
  { name: "Consumer staples", rates: 0, rupee: -1, oil: -1, inflation: -1,
    why: { rates: "Low leverage and steady demand make this sector relatively insensitive.",
           rupee: "Imported packaging and some raw materials cost more.",
           oil: "Packaging and distribution costs are linked to crude derivatives.",
           inflation: "Margins compress until price increases are passed through, which takes time." } },
  { name: "Exporters, goods", rates: -1, rupee: 2, oil: -1, inflation: 0,
    why: { rates: "Working capital costs rise for businesses with long shipping cycles.",
           rupee: "Foreign earnings convert into more rupees, provided costs remain domestic.",
           oil: "Freight costs rise with crude.",
           inflation: "Depends entirely on whether input or output prices rise faster." } },
  { name: "Real estate", rates: -2, rupee: 0, oil: 0, inflation: 1,
    why: { rates: "Buyers finance purchases with loans, and developers carry heavy debt. Demand and cost worsen together.",
           rupee: "Little direct exposure outside imported fittings.",
           oil: "Indirect, through cement, steel and transport.",
           inflation: "Physical assets have historically retained value in real terms, though not uniformly." } },
];

/* ---- the transmission map: nodes, links and a signal that travels ------ */
function TransmissionMap({ chain, step, onPick }) {
  const reduced = useReducedMotion();
  const path = chain.steps.map((s) => s.node);
  const active = path.slice(0, step + 1);
  const cur = path[step];

  const links = [];
  for (let i = 0; i < path.length - 1; i++) links.push([path[i], path[i + 1]]);

  const P = (id) => FI_NODES[id];
  const shown = Array.from(new Set(path));

  return (
    <div className="fi-map">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="fi-svg"
        role="img" aria-label={`Transmission path for ${chain.title}`}>
        <defs>
          <marker id="fi-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--teal)" opacity=".55" />
          </marker>
        </defs>

        {links.map(([a, b], i) => {
          const A = P(a), B = P(b);
          const on = i < step;
          const live = i === step - 1;
          const mx = (A.x + B.x) / 2 + (B.y - A.y) * 0.08;
          const my = (A.y + B.y) / 2 - (B.x - A.x) * 0.08;
          const d = `M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`;
          return (
            <g key={i}>
              <path d={d} className={"fi-link" + (on ? " on" : "")}
                markerEnd={on ? "url(#fi-arrow)" : undefined} />
              {live && !reduced && (
                <circle r="1.1" className="fi-pulse">
                  <animateMotion dur="1.1s" repeatCount="indefinite" path={d} />
                </circle>
              )}
            </g>
          );
        })}

        {shown.map((id) => {
          const n = P(id);
          const isActive = active.includes(id);
          const isCur = id === cur;
          const i = path.indexOf(id);
          return (
            <g key={id} transform={`translate(${n.x} ${n.y})`}
              className={"fi-node" + (isActive ? " on" : "") + (isCur ? " cur" : "")}
              tabIndex={0} role="button" aria-label={n.name}
              onClick={() => onPick(i)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(i); } }}>
              {isCur && <circle r="6.2" className="fi-halo" />}
              <circle r="3.1" className="fi-disc" />
              <text y="-4.8" textAnchor="middle" className="fi-label">{n.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TransmissionChain({ chain }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setTimeout(() => {
      setStep((s) => {
        if (s >= chain.steps.length - 1) { setPlaying(false); return s; }
        return s + 1;
      });
    }, 2100);
    return () => clearTimeout(timer.current);
  }, [playing, step, chain.steps.length]);

  useEffect(() => { setStep(0); setPlaying(false); }, [chain.id]);

  const s = chain.steps[step];
  const c = conceptById(s.concept);

  return (
    <div className="fi-chain">
      <div className="fi-chain-head">
        <div>
          <span className="badge aqua">{chain.tag}</span>
          <h3 style={{ fontSize: 24, marginTop: 12 }}>{chain.title}</h3>
          <p className="lede" style={{ marginTop: 12, fontSize: 16, maxWidth: "60ch" }}>{chain.intro}</p>
        </div>
        <div className="fi-ctl">
          <button className={"tbtn" + (playing ? " on" : "")}
            onClick={() => { if (step >= chain.steps.length - 1) setStep(0); setPlaying(!playing); }}>
            {playing ? "Pause" : "Trace it"}
          </button>
          <button className="tbtn" onClick={() => { setPlaying(false); setStep(0); }}>Reset</button>
        </div>
      </div>

      <TransmissionMap chain={chain} step={step} onPick={(i) => { setPlaying(false); setStep(i); }} />

      <div className="fi-track" role="tablist" aria-label="Steps">
        {chain.steps.map((x, i) => (
          <button key={i} role="tab" aria-selected={i === step}
            className={"fi-pip" + (i <= step ? " on" : "") + (i === step ? " cur" : "")}
            onClick={() => { setPlaying(false); setStep(i); }}
            aria-label={`Step ${i + 1}, ${x.head}`} />
        ))}
      </div>

      <div className="fi-step" key={step}>
        <div className="fi-step-meta">
          <span className="fi-n">{String(step + 1).padStart(2, "0")}</span>
          <span className="fi-lag">{s.lag}</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="fi-where">{FI_NODES[s.node].name}</p>
          <h4 className="fi-head">{s.head}</h4>
          <p className="body" style={{ marginTop: 10, fontSize: 16.5 }}>{s.text}</p>
          {c && <a className="chip" href={`#/concept/${c.id}`} style={{ marginTop: 16, display: "inline-flex" }}>
            {c.title} →</a>}
        </div>
      </div>

      <div className="sub" style={{ marginTop: 22, borderLeft: "2px solid var(--amber)" }}>
        <p className="eyebrow" style={{ marginBottom: 8, color: "var(--amber)" }}>Where this breaks down</p>
        <p className="body" style={{ fontSize: 15.5 }}>{chain.caveat}</p>
      </div>
    </div>
  );
}

/* ---- sector sensitivity grid ------------------------------------------ */
function SensitivityGrid() {
  const [force, setForce] = useState("rates");
  const [open, setOpen] = useState(null);
  const scale = (v) => ["Strongly negative", "Negative", "Broadly neutral", "Positive", "Strongly positive"][v + 2];

  const sorted = [...FI_SECTORS].sort((a, b) => b[force] - a[force]);

  return (
    <div className="fi-grid">
      <div className="fi-forces" role="tablist" aria-label="Force">
        {FI_FORCES.map((f) => (
          <button key={f.id} role="tab" aria-selected={force === f.id}
            className={"tab" + (force === f.id ? " on" : "")}
            onClick={() => { setForce(f.id); setOpen(null); }}>{f.name}</button>
        ))}
      </div>

      <div className="fi-rows">
        {sorted.map((s) => {
          const v = s[force];
          const tone = v > 0 ? "pos" : v < 0 ? "neg" : "flat";
          const w = (Math.abs(v) / 2) * 50;
          const isOpen = open === s.name;
          return (
            <div key={s.name} className={"fi-row " + tone + (isOpen ? " open" : "")}>
              <button className="fi-row-b" onClick={() => setOpen(isOpen ? null : s.name)}
                aria-expanded={isOpen}>
                <span className="fi-sector">{s.name}</span>
                <span className="fi-bar">
                  <span className="fi-zero" />
                  <span className={"fi-fill " + tone}
                    style={{ width: `${w}%`, [v >= 0 ? "left" : "right"]: "50%" }} />
                </span>
                <span className={"fi-verdict " + tone}>{scale(v)}</span>
              </button>
              {isOpen && <p className="fi-why">{s.why[force]}</p>}
            </div>
          );
        })}
      </div>

      <p className="small" style={{ marginTop: 18, maxWidth: "64ch" }}>
        Direction reflects the dominant documented mechanism for each sector, not a prediction.
        Individual companies within a sector differ, sometimes completely, depending on hedging,
        leverage and where their costs are incurred. Select any row to see the mechanism.
      </p>
    </div>
  );
}

function IntelligencePage() {
  const [chainId, setChainId] = useState(FI_CHAINS[0].id);
  const chain = FI_CHAINS.find((c) => c.id === chainId);

  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Financial intelligence"]]} />
      <div className="wrap">
        <Reveal><p className="kicker">How force travels</p></Reveal>
        <Reveal delay={60}><h1 className="h-page" style={{ marginTop: 12 }}>Financial Intelligence</h1></Reveal>
        <Reveal delay={120}>
          <p className="lede" style={{ marginTop: 18, maxWidth: "64ch" }}>
            A concept tells you what something is. A case tells you what happened. This layer shows
            how a single change moves through the system: which institution it reaches first, what
            changes there, how long it takes, and why the same shock lifts one business and damages
            another.
          </p>
        </Reveal>
      </div>

      <div className="wrap" style={{ paddingTop: 44, paddingBottom: 40 }}>
        <Reveal>
          <div className="fi-picker" role="tablist" aria-label="Transmission chain">
            {FI_CHAINS.map((c) => (
              <button key={c.id} role="tab" aria-selected={chainId === c.id}
                className={"fi-card" + (chainId === c.id ? " on" : "")}
                onClick={() => setChainId(c.id)}>
                <span className="fi-card-t">{c.tag}</span>
                <span className="fi-card-h">{c.title}</span>
                <span className="fi-card-n">{c.steps.length} steps</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}><TransmissionChain chain={chain} key={chain.id} /></Reveal>
      </div>

      <div className="wrap" style={{ paddingBottom: 100 }}>
        <Reveal>
          <div className="scene-head" style={{ marginTop: 40 }}>
            <p className="eyebrow">Sector sensitivity</p>
            <h2 className="h-scene" style={{ marginTop: 14 }}>The same force, opposite outcomes</h2>
            <p className="lede" style={{ marginTop: 16, maxWidth: "58ch" }}>
              A rate rise is not simply bad for business. It widens bank margins and squeezes NBFCs
              in the same week. Choose a force and see who stands where.
            </p>
          </div>
        </Reveal>
        <Reveal delay={90}><SensitivityGrid /></Reveal>

        <Reveal>
          <div className="chips" style={{ marginTop: 36 }}>
            <a className="chip" href="#/scenarios">Scenario analysis →</a>
            <a className="chip" href="#/graph">Knowledge graph →</a>
            <a className="chip" href="#/case/ilfs-2018">IL&amp;FS, the credit chain in reality →</a>
          </div>
        </Reveal>
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div className="wrap-n" style={{ padding: "90px 20px 120px" }}>
      <p className="eyebrow">Not found</p>
      <h1 style={{ fontSize: 34, marginTop: 12 }}>That page is not part of FinHub</h1>
      <p className="lede" style={{ marginTop: 14 }}>
        The link may be out of date. The universe map is the fastest way back in.
      </p>
      <div className="cta-row"><a className="btn primary" href="#/universe">Go to the universe</a></div>
    </div>
  );
}

/* ===========================================================================
   APP
   =========================================================================== */


/* A failure in one view should never take the whole platform down. */
class ViewBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidUpdate(prev) { if (prev.route !== this.props.route && this.state.err) this.setState({ err: null }); }
  render() {
    if (this.state.err) {
      return (
        <div className="wrap-n" style={{ padding: "80px 20px 120px" }}>
          <p className="eyebrow">Something went wrong on this page</p>
          <h1 style={{ fontSize: 32, marginTop: 12 }}>This section could not load</h1>
          <p className="lede" style={{ marginTop: 14 }}>
            The rest of FinHub is unaffected. Use the navigation above, or return to the universe map.
          </p>
          <div className="cta-row"><a className="btn primary" href="#/universe">Go to the universe</a></div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function FinHub() {
  const hash = useHash();
  const [searchOpen, setSearchOpen] = useState(false);
  const refs = useReferences();
  const { version, origins } = useContentFiles();
  const [seen, setSeen] = useState([]);
  const mark = React.useCallback((id) => {
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  }, []);
  const progress = useMemo(() => ({ seen, mark }), [seen, mark]);

  useEffect(() => {
    const onKey = (e) => {
      const typing = /input|textarea/i.test(e.target?.tagName || "");
      if (!typing && (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey)))) {
        e.preventDefault(); setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [path, qs] = hash.replace(/^#\/?/, "").split("?");
  const parts = path.split("/").filter(Boolean);
  const query = new URLSearchParams(qs || "").get("t") || "";

  let view;
  switch (parts[0]) {
    case undefined: view = <Landing />; break;
    case "universe": view = <Universe />; break;
    case "domain": view = <DomainPage id={parts[1]} />; break;
    case "concepts": view = <ConceptIndex />; break;
    case "concept": view = <ConceptPage id={parts[1]} />; break;
    case "cases": view = <CaseIndex />; break;
    case "case": view = <CasePage id={parts[1]} />; break;
    case "frauds": view = <CaseIndex />; break;
    case "fraud": view = <FraudPage id={parts[1]} />; break;
    case "scenarios": view = <ScenarioIndex />; break;
    case "scenario": view = <ScenarioPage id={parts[1]} />; break;
    case "history": view = <MarketHistoryPage />; break;
    case "origins": view = <OriginsPage data={origins} />; break;
    case "graph": view = <GraphPage />; break;
    case "intelligence": view = <IntelligencePage />; break;
    case "data": view = <MarketDataPage />; break;
    case "tax": view = <TaxPage />; break;
    case "floor": view = <SimulatorPage />; break;
    case "telemetry": view = <TelemetryPage />; break;
    case "glossary": view = <Glossary />; break;
    case "tools": view = <ToolsPage query={query} />; break;
    default: view = <NotFound />;
  }

  return (
    <RefsContext.Provider value={refs}>
    <ProgressContext.Provider value={progress}>
    <div className="fh">
      <style>{CSS}</style>
      <ReadingBar />
      <Nav hash={hash} onSearch={() => setSearchOpen(true)} />
      <main key={path + ":" + version}>
        <ViewBoundary route={path}>{view}</ViewBoundary>
      </main>
      <footer className="foot">
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between" }}>
          <div style={{ maxWidth: "34ch" }}>
            <div className="brand" style={{ fontSize: 17 }}><span className="brand-mark"><Symbol name="core" size={20} /></span> FinHub</div>
            <p style={{ marginTop: 10 }}>
              A structured financial universe. Educational content only — nothing here is investment advice.
            </p>
            <p className="sig">
              Idea &amp; design curated by <b>G.&nbsp;Hari&nbsp;Charan</b> ·{" "}
              <a href="https://www.linkedin.com/in/gharicharan/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </p>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {NAV.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
            <a href="#/history">Financial history</a>
            <a href="#/graph">Knowledge graph</a>
          </div>
        </div>
      </footer>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
    </ProgressContext.Provider>
    </RefsContext.Provider>
  );
}
