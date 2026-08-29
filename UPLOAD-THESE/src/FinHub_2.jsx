import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

// FINHUB — CONTENT DATA LAYER
// Content is separated from components. Every entity carries an id, a type and
// relationships, which together form the FinHub knowledge graph.

const DOMAINS = [
  { id: 'fundamentals', img: 'fundamentals', icon: 'fundamentals', name: 'Finance Fundamentals', kicker: 'Where every path begins',
    blurb: 'Money, time, interest, risk and the statements that record them.',
    categories: [
      { id: 'money-time', name: 'Money & Time', subcategories: ['Money', 'Time Value of Money', 'Interest', 'Compounding'] },
      { id: 'risk-return', name: 'Risk & Return', subcategories: ['Risk', 'Return', 'Real vs Nominal'] },
      { id: 'statements', name: 'Financial Statements', subcategories: ['Balance Sheet', 'Income Statement', 'Cash Flow', 'Ratios'] },
    ] },
  { id: 'investments', img: 'investments', icon: 'investments', name: 'Investments', kicker: 'Turning capital into claims',
    blurb: 'Asset classes, portfolios, valuation and the discipline of allocation.',
    categories: [
      { id: 'asset-classes', name: 'Asset Classes', subcategories: ['Equity', 'Fixed Income', 'Mutual Funds', 'ETFs'] },
      { id: 'portfolio', name: 'Portfolio Management', subcategories: ['Diversification', 'Asset Allocation', 'Performance Evaluation'] },
      { id: 'analysis', name: 'Analysis', subcategories: ['Fundamental Analysis', 'Technical Analysis', 'Valuation'] },
    ] },
  { id: 'markets', img: 'markets', icon: 'markets', name: 'Financial Markets', kicker: 'Where prices are discovered',
    blurb: 'Equity, debt, money, commodity and currency markets, and who moves them.',
    categories: [
      { id: 'market-types', name: 'Market Types', subcategories: ['Equity Markets', 'Debt Markets', 'Money Markets', 'Currency Markets'] },
      { id: 'mechanics', name: 'Market Mechanics', subcategories: ['Indices', 'Participants', 'Liquidity'] },
    ] },
  { id: 'corporate', icon: 'corporate', name: 'Corporate Finance', kicker: 'How firms fund and choose',
    blurb: 'Capital budgeting, capital structure, dividends and corporate valuation.',
    categories: [
      { id: 'investment-decision', name: 'Investment Decisions', subcategories: ['NPV', 'IRR', 'Payback', 'Capital Budgeting'] },
      { id: 'financing-decision', name: 'Financing Decisions', subcategories: ['Cost of Capital', 'Capital Structure', 'Leverage'] },
    ] },
  { id: 'fintech', name: 'FinTech', kicker: 'Finance rebuilt as software',
    blurb: 'Payments, lending, and infrastructure delivered without a counter.',
    icon: 'fintech',
    categories: [
      { id: 'payments', name: 'Payments & Infrastructure', subcategories: ['Payment Systems', 'Settlement', 'Digital Money'] },
      { id: 'delivery', name: 'New Delivery Models', subcategories: ['Digital Lending', 'Neobanks', 'Embedded Finance'] },
    ] },
  { id: 'banking', img: 'banking', icon: 'banking', name: 'Banking & Institutions', kicker: 'The plumbing of finance',
    blurb: 'Commercial banks, central banks, NBFCs, insurance and payment systems.',
    categories: [
      { id: 'banks', name: 'Banks', subcategories: ['Commercial Banking', 'Central Banking', 'Investment Banking'] },
      { id: 'others', name: 'Other Institutions', subcategories: ['NBFCs', 'Insurance', 'FinTech'] },
    ] },
  { id: 'derivatives', img: 'derivatives', icon: 'derivatives', name: 'Derivatives & Risk', kicker: 'Pricing the uncertain',
    blurb: 'Futures, options, swaps, hedging and the taxonomy of financial risk.',
    categories: [
      { id: 'instruments', name: 'Instruments', subcategories: ['Futures', 'Options', 'Swaps'] },
      { id: 'risk-types', name: 'Risk Types', subcategories: ['Market Risk', 'Credit Risk', 'Liquidity Risk', 'Operational Risk'] },
    ] },
  { id: 'economics', img: 'economics', icon: 'economics', name: 'Economics & Global Finance', kicker: 'The forces above the firm',
    blurb: 'Growth, inflation, policy, exchange rates and financial crises.',
    categories: [
      { id: 'macro', name: 'Macro Foundations', subcategories: ['GDP', 'Inflation', 'Interest Rates'] },
      { id: 'policy', name: 'Policy', subcategories: ['Monetary Policy', 'Fiscal Policy'] },
    ] },
  { id: 'case-studies', img: 'cases', icon: 'cases', name: 'Case Studies', kicker: 'Finance as it actually happened', blurb: 'Decisions, outcomes and the concepts that explain them.', route: '#/cases' },
  { id: 'frauds', img: 'frauds', icon: 'frauds', name: 'Financial Frauds', kicker: 'Mechanisms, not morality tales', blurb: 'How the deception worked, and which numbers gave it away.', route: '#/frauds' },
  { id: 'intelligence', icon: 'intelligence', name: 'Financial Intelligence', kicker: 'Reading the ecosystem', blurb: 'How companies, markets, institutions and policy move each other.', route: '#/graph' },
  { id: 'scenarios', img: 'scenarios', icon: 'scenarios', name: 'Scenario Analysis', kicker: 'Cause and effect, traced', blurb: 'Follow a shock from event to financial implication.', route: '#/scenarios' },
  { id: 'visualisations', icon: 'visualisations', name: 'Financial Visualisations', kicker: 'Structure made visible', blurb: 'Flows, maps and relationships you can move through.', route: '#/graph' },
  { id: 'history', icon: 'history', name: 'Financial History', kicker: 'How we got here', blurb: 'The evolution of money, banking, markets and crises.', route: '#/history' },
  { id: 'global', icon: 'global', name: 'Global Finance', kicker: 'Capital without borders', blurb: 'Currencies, cross-border flows and global institutions.' },
  { id: 'glossary', icon: 'glossary', name: 'Financial Glossary', kicker: 'Precise language', blurb: 'Definitions that link back into the deeper structure.', route: '#/glossary' },
  { id: 'tools', icon: 'tools', name: 'Financial Tools', kicker: 'Numbers you can move', blurb: 'Calculators that connect back to the concept behind them.', route: '#/tools' },
  { id: 'ai', icon: 'ai', name: 'FinHub AI', kicker: 'A guide through the structure', blurb: 'Ask where to start, what connects, and what to read next.', route: '#/ai' },
];

// ---------------------------------------------------------------------------
// CONCEPTS
// ---------------------------------------------------------------------------

const CONCEPTS = [
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
const SEARCH_INDEX = [
  ...CONCEPTS.map((c) => ({ type: 'Concept', title: c.title, sub: c.oneLine, href: `#/concept/${c.id}`, text: `${c.title} ${c.oneLine} ${c.subcategory} ${c.what || ''}` })),
  ...DOMAINS.map((d) => ({ type: 'Domain', title: d.name, sub: d.blurb, href: d.route || `#/domain/${d.id}`, text: `${d.name} ${d.blurb} ${(d.categories || []).map((c) => c.name + ' ' + c.subcategories.join(' ')).join(' ')}` })),
  ...CASES.map((c) => ({ type: 'Case study', title: c.title, sub: c.tag, href: `#/case/${c.id}`, text: `${c.title} ${c.background} ${c.tag}` })),
  ...FRAUDS.map((f) => ({ type: 'Fraud', title: f.title, sub: f.tag, href: `#/fraud/${f.id}`, text: `${f.title} ${f.background} ${f.tag}` })),
  ...SCENARIOS.map((s) => ({ type: 'Scenario', title: s.title, sub: s.question, href: `#/scenario/${s.id}`, text: `${s.title} ${s.question} ${s.chain.map((x) => x.text).join(' ')}` })),
  ...GLOSSARY.map((g) => ({ type: 'Glossary', title: g.term, sub: g.def, href: `#/glossary?t=${encodeURIComponent(g.term)}`, text: `${g.term} ${g.def} ${g.simple}` })),
  ...TOOLS.map((t) => ({ type: 'Tool', title: t.name, sub: t.desc, href: `#/tools?t=${t.id}`, text: `${t.name} ${t.desc} calculator` })),
];

function search(q) {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const terms = query.split(/\s+/);
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
  ["Universe", "#/universe"], ["Concepts", "#/concepts"], ["Cases", "#/cases"],
  ["Scenarios", "#/scenarios"], ["Glossary", "#/glossary"], ["Tools", "#/tools"], ["FinHub AI", "#/ai"],
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

  const W = 1000, H = 600, cx = W / 2, cy = H / 2;
  const domains = ORBIT.map((id) => DOMAINS.find((d) => d.id === id)).filter(Boolean);
  const selDomain = sel ? DOMAINS.find((d) => d.id === sel) : null;
  const cats = selDomain?.categories || [];
  const concepts = sel ? CONCEPTS.filter((c) => c.domain === sel) : [];
  const catConcepts = cat ? concepts.filter((c) => (selDomain.categories.find((x) => x.id === cat)?.subcategories || []).includes(c.subcategory)) : [];

  // position of each orbit node
  const posOf = (i, n) => {
    const a = (i / n) * Math.PI * 2 + angle;
    return { x: cx + Math.cos(a) * 320, y: cy + Math.sin(a) * 190 };
  };
  // where a node goes once a domain is chosen: selected rises to the top axis
  const selectedPos = { x: cx, y: cy - 190 };

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
        <ellipse cx={cx} cy={cy} rx="320" ry="190" className="uni-orbit"
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
          const spread = (i - (cats.length - 1) / 2);
          const x = cx + spread * 240, y = cy + 60;
          const on = cat === c.id;
          return (
            <g key={c.id} className={"uni-cat" + (on ? " on" : "")}
              style={{ animationDelay: `${0.08 * i}s` }}>
              <line x1={selectedPos.x} y1={selectedPos.y} x2={x} y2={y} className="uni-link" style={{ opacity: on ? .8 : .3 }} />
              <g tabIndex={0} role="button" aria-pressed={on} aria-label={`Category ${c.name}`}
                onClick={() => setCat(on ? null : c.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCat(on ? null : c.id); } }}
                transform={`translate(${x} ${y})`} className="uni-hit">
                <rect x="-105" y="-20" width="210" height="40" rx="20" className="uni-pill" />
                <text y="5" textAnchor="middle" className="uni-pill-t">{c.name}</text>
              </g>
            </g>
          );
        })}

        {/* concepts of the chosen category */}
        {sel && cat && catConcepts.map((c, i) => {
          const spread = (i - (catConcepts.length - 1) / 2);
          const x = cx + spread * 260, y = cy + 190;
          const ci = cats.findIndex((k) => k.id === cat);
          const px = cx + (ci - (cats.length - 1) / 2) * 240, py = cy + 60;
          return (
            <g key={c.id} className="uni-concept" style={{ animationDelay: `${0.06 * i}s` }}>
              <line x1={px} y1={py} x2={x} y2={y} className="uni-link" style={{ opacity: .35 }} />
              <g tabIndex={0} role="link" aria-label={`Open ${c.title}`}
                onClick={() => go(`#/concept/${c.id}`)}
                onKeyDown={(e) => { if (e.key === "Enter") go(`#/concept/${c.id}`); }}
                transform={`translate(${x} ${y})`} className="uni-hit">
                <rect x="-118" y="-21" width="236" height="42" rx="10" className="uni-node-box" />
                <text y="5" textAnchor="middle" className="uni-node-t">{c.title} →</text>
              </g>
            </g>
          );
        })}
        {sel && cat && catConcepts.length === 0 && (
          <text x={cx} y={cy + 196} textAnchor="middle" className="uni-empty">
            No concepts published in this category yet
          </text>
        )}

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
  const inCat = catObj ? concepts.filter((c) => catObj.subcategories.includes(c.subcategory)) : [];

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
                {cats.map((c) => (
                  <li key={c.id}>
                    <button onClick={() => setCat(c.id)}>
                      <span className="unil-name">{c.name}</span>
                      <span className="unil-go">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {cat && (
            <>
              <h3 className="unil-h">{catObj.name}</h3>
              <ul className="unil-list">
                {inCat.map((c) => (
                  <li key={c.id}>
                    <a href={`#/concept/${c.id}`}>
                      <span className="unil-name">{c.title}</span>
                      <span className="unil-go">→</span>
                    </a>
                  </li>
                ))}
                {inCat.length === 0 && <li className="unil-empty">No concepts published here yet</li>}
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
                const count = CONCEPTS.filter((c) => c.domain === d.id).length;
                return (
                  <Reveal key={d.id} delay={Math.min(i * 50, 250)}>
                    <a className="card link" href={d.route || `#/domain/${d.id}`} style={{ display: "block", height: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                        <span className="card-mark"><Symbol name={d.icon || "connection"} size={24} /></span>
                        {count > 0 && <span className="badge aqua">{count} concepts</span>}
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
  const concepts = CONCEPTS.filter((c) => c.domain === id);
  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["Universe", "#/universe"], [d.name]]} />
      {d.img ? (
        <ImageBanner name={d.img} alt={`${d.name} — an abstract representation`}>
          <Reveal><p className="kicker">{d.kicker}</p></Reveal>
          <Reveal delay={60}><h1 style={{ fontSize: "clamp(28px,5vw,46px)", marginTop: 12 }}>{d.name}</h1></Reveal>
          <Reveal delay={120}><p className="lede" style={{ marginTop: 14, maxWidth: "62ch" }}>{d.blurb}</p></Reveal>
        </ImageBanner>
      ) : (
        <div className="wrap">
          <Reveal><p className="kicker">{d.kicker}</p></Reveal>
          <Reveal delay={60}><h1 style={{ fontSize: "clamp(28px,5vw,46px)", marginTop: 12 }}>{d.name}</h1></Reveal>
          <Reveal delay={120}><p className="lede" style={{ marginTop: 14, maxWidth: "62ch" }}>{d.blurb}</p></Reveal>
        </div>
      )}

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {(d.categories || []).map((cat, i) => (
          <Reveal key={cat.id} delay={i * 60}>
            <div style={{ paddingBottom: 30, marginBottom: 30, borderBottom: "1px solid var(--line)" }}>
              <h2 style={{ fontSize: 22 }}>{cat.name}</h2>
              <div className="chips" style={{ marginTop: 12 }}>
                {cat.subcategories.map((s) => {
                  const c = concepts.find((x) => x.subcategory === s);
                  return c
                    ? <a className="chip" key={s} href={`#/concept/${c.id}`} style={{ borderColor: "var(--aqua-dim)", color: "var(--aqua)" }}>{s} →</a>
                    : <span className="chip" key={s} style={{ opacity: .5 }}>{s}</span>;
                })}
              </div>
            </div>
          </Reveal>
        ))}

        {concepts.length > 0 && (
          <>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Concepts written in this domain</p>
            <div className="grid g2">
              {concepts.map((c, i) => <Reveal key={c.id} delay={i * 60}><ConceptCard c={c} /></Reveal>)}
            </div>
          </>
        )}
        {concepts.length === 0 && (
          <div className="sub">
            <p className="small">
              The structure for this domain is in place; the written concepts are not published yet.
              In the meantime, {" "}
              <a href="#/concepts" style={{ color: "var(--aqua)" }}>browse the concepts that are</a>.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function ConceptCard({ c }) {
  return (
    <a className="card link" href={`#/concept/${c.id}`} style={{ display: "block", height: "100%" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span className="badge">{c.level}</span>
        {c.formula && <span className="badge amber">Formula</span>}
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

const SIMS = {
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

function AiPage() {
  const [q, setQ] = useState("");
  const [log, setLog] = useState([{
    role: "ai",
    text: "I navigate what FinHub contains. Ask me where to start, what a term means, what connects to a concept, or what to read next.",
    links: [{ label: "Where should I start?", href: null }],
  }]);

  const answer = (raw) => {
    const text = raw.trim(); if (!text) return;
    const low = text.toLowerCase();
    let reply = "", links = [];

    if (/start|begin|new|beginner|first/.test(low)) {
      reply = "Begin with the time value of money. Every valuation method in finance is built on it, and the rest of the fundamentals follow from there.";
      links = [["Time Value of Money", "#/concept/time-value-of-money"], ["Compounding", "#/concept/compounding"], ["Inflation", "#/concept/inflation"]];
    } else if (/path|learn|route|order/.test(low)) {
      reply = "A workable path through what is written: time value of money → compounding → inflation → real return → interest rates → bond pricing → discount rate and NPV → leverage.";
      links = [["Time Value of Money", "#/concept/time-value-of-money"], ["All concepts", "#/concepts"]];
    } else {
      const hits = search(text);
      if (hits.length) {
        const top = hits[0];
        reply = `${top.title} — ${top.sub}`;
        links = hits.slice(0, 5).map((h) => [`${h.title} · ${h.type}`, h.href]);
      } else {
        reply = "Nothing in FinHub matches that yet. The written concepts are listed below — I will not invent an answer outside them.";
        links = [["Browse concepts", "#/concepts"], ["Glossary", "#/glossary"]];
      }
    }
    setLog((l) => [...l, { role: "you", text }, { role: "ai", text: reply, links }]);
    setQ("");
  };

  return (
    <>
      <Crumbs items={[["FinHub", "#/"], ["FinHub AI"]]} />
      <div className="wrap-n" style={{ paddingBottom: 80 }}>
        <Reveal><h1 className="h-page">FinHub AI</h1></Reveal>
        <Reveal delay={70}>
          <p className="lede" style={{ marginTop: 14 }}>
            A guide across the FinHub structure. It answers from what is actually written here and
            points you to it — it does not generate finance content of its own.
          </p>
        </Reveal>
        <div style={{ marginTop: 30, display: "grid", gap: 14 }}>
          {log.map((m, i) => (
            <div key={i} className={m.role === "you" ? "sub" : "card"}
              style={m.role === "you" ? { marginLeft: "auto", maxWidth: "80%" } : { maxWidth: "92%" }}>
              <p className="eyebrow" style={{ marginBottom: 8 }}>{m.role === "you" ? "You" : "FinHub AI"}</p>
              <p className="body" style={{ fontSize: 15.5 }}>{m.text}</p>
              {m.links?.length > 0 && m.links[0][1] && (
                <div className="chips" style={{ marginTop: 12 }}>
                  {m.links.map(([l, h]) => <a className="chip" key={h + l} href={h}>{l} →</a>)}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
          <input value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") answer(q); }}
            placeholder="Ask about a concept, or where to start…" aria-label="Ask FinHub AI"
            style={{
              flex: "1 1 220px", minWidth: 0, background: "#0B101C", border: "1px solid var(--line)",
              borderRadius: 10, padding: "12px 14px", color: "var(--paper)", fontSize: 15, outline: "none",
            }} />
          <button className="btn primary" onClick={() => answer(q)}>Ask</button>
        </div>
        <div className="chips" style={{ marginTop: 14 }}>
          {["Where should I start?", "What connects to inflation?", "leverage", "real return"].map((s) => (
            <button className="chip" key={s} onClick={() => answer(s)}>{s}</button>
          ))}
        </div>
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

export default function FinHub() {
  const hash = useHash();
  const [searchOpen, setSearchOpen] = useState(false);

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
    case "history": view = <HistoryPage />; break;
    case "graph": view = <GraphPage />; break;
    case "glossary": view = <Glossary />; break;
    case "tools": view = <ToolsPage query={query} />; break;
    case "ai": view = <AiPage />; break;
    default: view = <NotFound />;
  }

  return (
    <div className="fh">
      <style>{CSS}</style>
      <Nav hash={hash} onSearch={() => setSearchOpen(true)} />
      <main key={path}>{view}</main>
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
  );
}
