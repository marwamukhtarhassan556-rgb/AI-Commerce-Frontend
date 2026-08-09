export const dashboardKpiCards = [
  {
    label: 'Total Active Stores',
    value: '148',
    change: '12%',
    icon: 'storefront',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    label: 'AI Conversations',
    value: '38,450',
    change: '24%',
    icon: 'forum',
    iconBg: 'bg-secondary/10 text-secondary',
  },
  {
    label: 'MRR',
    value: '$8,950',
    change: '18%',
    icon: 'payments',
    iconBg: 'bg-primary-fixed text-primary',
  },
  {
    label: 'AI Conversion Rate',
    value: '14.2%',
    badge: 'High Intent',
    icon: 'bolt',
    iconBg: 'bg-tertiary-fixed text-tertiary',
    highlight: true,
    iconFill: true,
  },
];

export const dashboardIntents = [
  { label: 'Product Query', value: 45 },
  { label: 'Order Tracking', value: 30, barClass: 'bg-primary/70' },
  { label: 'Discount Requests', value: 15, barClass: 'bg-primary/40' },
  { label: 'Returns', value: 10, barClass: 'bg-primary/20' },
];

export const dashboardSentiment = [
  { pct: '72%', height: '72%', color: 'bg-secondary', icon: 'sentiment_very_satisfied', textColor: 'text-secondary' },
  { pct: '20%', height: '20%', color: 'bg-[#cbdbf5]', icon: 'sentiment_neutral', textColor: 'text-outline' },
  { pct: '8%', height: '8%', color: 'bg-error', icon: 'sentiment_very_dissatisfied', textColor: 'text-error' },
];

export const dashboardHealthGauges = [
  { label: 'API Latency', value: '12ms', sub: '4% faster than avg', icon: 'timer', accent: 'text-primary bg-primary/10' },
  { label: 'AI Service', value: 'Online', sub: 'Gateway cluster healthy', icon: 'psychology', accent: 'text-secondary bg-secondary/10' },
  { label: 'DB Load', value: '32%', sub: 'Cluster-0: Active', icon: 'database', accent: 'text-on-surface-variant bg-[#dce9ff]', progress: 32 },
];

export const dashboardPlatformBreakdown = [
  { label: 'Shopify', color: 'bg-primary', pct: '65%' },
  { label: 'WooCommerce', color: 'bg-secondary-container', pct: '25%' },
  { label: 'Custom API', color: 'bg-tertiary-fixed', pct: '10%' },
];

export const recentStores = [
  {
    name: 'Trendy Fashion',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKdDJFeRS79YKEA40ejahDEZgSnx4MstR6iFMnvOeP4JxYNvRe7wqGUF1eannFeVu237gKEIR4w1RtPbf5112RL9BLH5fcYSnnTtvx_XL_hATWtUh6UptYgbzzGK8SgNF911NZz35G-od9iZK1CGQHnR4IRRVNvng9q7KVbinXMyeFn_3VZ8ypPqp6fiaE2Kypzdy0z2cTP4mSCAPnk9wdJNQVI5v66E-8fO7jspDNm1wI1vnE90WUKw',
    platform: 'Shopify',
    plan: { label: 'Pro Plan', className: 'bg-primary/10 text-primary' },
    status: 'active',
  },
  {
    name: 'TechEdge',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIlwePGMQKmcUmzqzKPsNOCGVLRtIxVAPK6CLmcbrvc9KLF1RU3ExLr_MbXqS77cKIxsRS97PPjCeKcmo9OMalFaFbjE0iiLiHU_H11gAZS6E93BJW5xdASrS_VVd8LAMFn-y-d5c1ZGh_XJ4mTveIPoNHsm6w5odZpqGECWtmAfWidHpdHpQnKoMgG8bne83aYWobZOWxAw3EFqpioeSYNFxZ0cYZ4UImwOrCYqgd1viOT-ORWViCsg',
    platform: 'WooCommerce',
    plan: { label: 'Essential', className: 'bg-[#dce9ff] text-on-surface-variant' },
    status: 'active',
  },
  {
    name: 'Bloom Organics',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqMpoaJ3RKy5tmoZeh9AgEc6Fu9vXLhbtJwOW4JfcI0FA-lMMhMpyX86AJualRiC1JtE73edH_gbAcSiu7ttW6RW9lKWPp4xQ5pi-yVPwzqEXC5HldGkde4JaK_Gz8GfpbMHkNs8ZcTJKtV9S3QdVohB5WQJsm47HmYWAiBli_I4Oxc7bK0KOXLsHwR5psmudOo_plqUsTSdwC5BdxKO1fdW7BSlQAPRURcyalN4uVAY0hbFNUM0St7g',
    platform: 'Shopify',
    plan: { label: 'Enterprise', className: 'bg-tertiary-fixed text-tertiary' },
    status: 'active',
  },
];

export const merchants = [
  {
    initials: 'LV',
    initialsBg: 'bg-primary/5 text-primary',
    name: 'Luxe Velvet',
    platform: 'Shopify',
    platformIcon: 'shopping_cart',
    email: 'admin@luxevelvet.co',
    plan: { label: 'Enterprise AI', className: 'bg-[#4f46e5]/10 text-primary' },
    domain: 'luxe-velvet-intl.myshopify.com',
    status: 'active',
  },
  {
    initials: 'AG',
    initialsBg: 'bg-tertiary/5 text-tertiary',
    name: 'Apex Gear',
    platform: 'WooCommerce',
    platformIcon: 'shopping_bag',
    email: 'support@apex-gear.io',
    plan: { label: 'Growth Tier', className: 'bg-[#d3e4fe] text-on-surface-variant' },
    domain: 'shop.apex-gear.io',
    status: 'suspended',
  },
  {
    initials: 'NK',
    initialsBg: 'bg-secondary/5 text-secondary',
    name: 'Nordic Kitchen',
    platform: 'Magento',
    platformIcon: 'store',
    email: 'sales@nordickitchen.se',
    plan: { label: 'Enterprise AI', className: 'bg-[#4f46e5]/10 text-primary' },
    domain: 'nordic-kitchen-market.com',
    status: 'active',
  },
  {
    initials: 'ZH',
    initialsBg: 'bg-primary/5 text-primary',
    name: 'Zenith Home',
    platform: 'Shopify',
    platformIcon: 'shopping_cart',
    email: 'hello@zenithhome.com',
    plan: { label: 'Basic Tier', className: 'bg-[#d3e4fe] text-on-surface-variant' },
    domain: 'zenith-home-decor.com',
    status: 'configuring',
  },
  {
    initials: 'UC',
    initialsBg: 'bg-error/5 text-error',
    name: 'Urban Chic',
    platform: 'BigCommerce',
    platformIcon: 'local_mall',
    email: 'martha@urban-chic.store',
    plan: { label: 'Enterprise AI', className: 'bg-[#4f46e5]/10 text-primary' },
    domain: 'urban-chic.store',
    status: 'suspended',
  },
];

export const diagnosticsHealthCards = [
  { label: 'Latency', value: '12ms', sub: '4% faster than avg', icon: 'timer', iconClass: 'bg-primary/10 text-primary', border: '' },
  { label: 'DB Connection', value: 'Connected', sub: 'Cluster-0: Active', icon: 'hub', iconClass: 'bg-secondary/10 text-secondary', border: 'border-l-4 border-l-secondary' },
  { label: 'DB Load', value: '32%', icon: 'database', iconClass: 'bg-[#dce9ff] text-on-surface-variant', border: '', progress: 32 },
];

export const tokenUsage = [
  { model: 'GPT-4o', tokens: '2.4M', cost: '$1,240', trend: '+8%', pct: 85 },
  { model: 'Claude 3.5', tokens: '1.1M', cost: '$620', trend: '+12%', pct: 65 },
  { model: 'Gemini Pro', tokens: '890K', cost: '$410', trend: '+5%', pct: 52 },
  { model: 'Embeddings', tokens: '3.2M', cost: '$180', trend: '+18%', pct: 92 },
];

export const barChartData = [
  { label: 'Order Status', height: '85%', tooltip: '4.2k' },
  { label: 'Returns', height: '65%', tooltip: '3.1k' },
  { label: 'Product Info', height: '92%', tooltip: '4.8k' },
  { label: 'Tech Support', height: '40%', tooltip: '1.9k' },
  { label: 'Shipping', height: '55%', tooltip: '2.7k' },
  { label: 'Billing', height: '30%', tooltip: '1.2k' },
];

export const sentimentCategories = [
  { label: 'Electronics & Tech', positive: 78, neutral: 15, negative: 7 },
  { label: 'Fashion & Apparel', positive: 82, neutral: 12, negative: 6 },
  { label: 'Home & Decor', positive: 64, neutral: 20, negative: 16 },
];

export const serviceStatus = [
  { service: 'AI Gateway', status: 'Healthy', latency: '12ms', uptime: '99.98%', icon: 'psychology' },
  // { service: 'MongoDB Atlas', status: 'Healthy', latency: '8ms', uptime: '99.99%', icon: 'database' },
  { service: 'Auth Service', status: 'Healthy', latency: '24ms', uptime: '99.95%', icon: 'lock' },
  { service: 'Stripe Webhook', status: 'Degraded', latency: '156ms', uptime: '99.12%', icon: 'payments' },
];

export const auditLogs = [
  { time: 'Today, 14:23:45', source: 'MongoDB Atlas', activity: 'Cluster optimization sequence completed', status: 'Success', statusClass: 'bg-secondary/10 text-secondary' },
  { time: 'Today, 14:15:10', source: 'AI Gateway', activity: 'Rate limit threshold increased for Store #1024', status: 'Success', statusClass: 'bg-secondary/10 text-secondary' },
  { time: 'Today, 13:58:22', source: 'Auth Service', activity: 'System Admin login detected from new IP', status: 'Pending Verification', statusClass: 'bg-tertiary-fixed-dim/20 text-tertiary' },
  { time: 'Today, 13:42:01', source: 'Stripe Webhook', activity: 'Subscription update: Enterprise Plus', status: 'Processed', statusClass: 'bg-secondary/10 text-secondary' },
];

export const subscriptionMetrics = [
  {
    label: 'Total Monthly Revenue',
    value: '$142,850',
    change: '+8.4%',
    icon: 'payments',
    iconBg: 'bg-secondary-container/10 text-secondary',
    accentBar: 'bg-secondary/20 group-hover:bg-secondary',
  },
  {
    label: 'Active Subscriptions',
    value: '2,482',
    change: '+12%',
    icon: 'groups',
    iconBg: 'bg-primary-container/10 text-primary',
    accentBar: 'bg-primary/20 group-hover:bg-primary',
  },
  {
    label: 'Retention Rate',
    value: '94.2%',
    change: '+4.2%',
    icon: 'trending_up',
    iconBg: 'bg-[#dce9ff] text-on-surface-variant',
    accentBar: 'bg-primary/20 group-hover:bg-primary',
  },
];

export const aiOptimizationTip = {
  title: 'AI Forecast',
  message:
    'Retention is projected to increase by 4.2% if the "Enterprise Analytics" module is bundled into the Pro Tier.',
  highlight: '4.2%',
  actionLabel: 'View Analysis',
};

export const subscriptionPlans = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'For growing merchants',
    price: 49,
    users: 1240,
    popular: false,
    userBadgeClass: 'bg-surface-container text-on-surface-variant',
    features: [
      { label: 'Up to 5 storefronts', included: true },
      { label: 'Basic AI Recommendations', included: true },
      { label: 'Email Support', included: true },
      { label: 'Predictive Inventory', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'The gold standard',
    price: 199,
    users: 890,
    popular: true,
    userBadgeClass: 'bg-secondary-container/20 text-on-secondary-container',
    features: [
      { label: 'Unlimited storefronts', included: true },
      { label: 'Advanced AI Forecasting', included: true },
      { label: 'Priority Support (24/7)', included: true },
      { label: 'Custom AI Training', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Bespoke solutions',
    price: 999,
    users: 352,
    popular: false,
    userBadgeClass: 'bg-surface-container text-on-surface-variant',
    features: [
      { label: 'Dedicated Instance', included: true },
      { label: 'Enterprise API Access', included: true },
      { label: 'White-labeling Options', included: true },
      { label: 'Dedicated Account Manager', included: true },
    ],
  },
];

export const billingHistory = [
  {
    id: 'bh-1',
    merchant: { name: 'Starlight Global', initial: 'S', initialBg: 'bg-primary-container/20 text-primary' },
    plan: 'Pro Tier',
    status: 'successful',
    date: 'Oct 24, 2023',
    amount: '$199.00',
    actionIcon: 'receipt',
  },
  {
    id: 'bh-2',
    merchant: { name: 'Nova Retail', initial: 'N', initialBg: 'bg-tertiary-container/20 text-tertiary' },
    plan: 'Enterprise',
    status: 'successful',
    date: 'Oct 23, 2023',
    amount: '$999.00',
    actionIcon: 'receipt',
  },
  {
    id: 'bh-3',
    merchant: { name: 'Pulse Commerce', initial: 'P', initialBg: 'bg-error-container/20 text-error' },
    plan: 'Standard',
    status: 'failed',
    date: 'Oct 22, 2023',
    amount: '$49.00',
    actionIcon: 'priority_high',
  },
  {
    id: 'bh-4',
    merchant: { name: 'OmniWare', initial: 'O', initialBg: 'bg-secondary-container/20 text-on-secondary-container' },
    plan: 'Pro Tier',
    status: 'successful',
    date: 'Oct 21, 2023',
    amount: '$199.00',
    actionIcon: 'receipt',
  },
];

export const planDetailsById = {
  standard: {
    id: 'standard',
    name: 'Standard Plan',
    shortName: 'Standard Plan',
    price: 49,
    description: 'Essential tools for growing merchants starting their AI commerce journey.',
    metrics: {
      subscribers: { value: '1,240', change: '+8.2%', positive: true },
      churn: { value: '3.8%', change: '-0.2%', positive: true },
      mrr: { value: '$60,760', suffix: '/mo' },
    },
    includedFeatures: [
      { id: 'storefronts', label: 'Up to 5 Storefronts', enabled: true },
      { id: 'ai-recs', label: 'Basic AI Recommendations', enabled: true },
      { id: 'email-support', label: 'Email Support', enabled: true },
      { id: 'stock-sync', label: 'Real-time Stock Sync', enabled: false },
      { id: 'webhooks', label: 'Unlimited Webhook Calls', enabled: false },
      { id: 'custom-css', label: 'Custom CSS Theme Support', enabled: false },
    ],
    aiRecommendation:
      'Standard Plan users frequently upgrade after enabling AI Recommendations. Consider bundling a 14-day Pro trial to increase conversion by an estimated 8%.',
    performanceData: [20, 35, 25, 50, 45, 60, 55, 75, 85, 80],
    accessLogs: [
      { icon: 'person', message: 'Admin: Jessica S. updated pricing', time: '2h ago' },
      { icon: 'settings', message: 'System: Auto-backup complete', time: '5h ago' },
      { icon: 'security', message: 'Admin: Mike R. modified features', time: 'Yesterday' },
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    shortName: 'Pro Plan',
    price: 199,
    description: 'Advanced features for growing merchants and automated scaling operations.',
    metrics: {
      subscribers: { value: '12,842', change: '+12.4%', positive: true },
      churn: { value: '2.1%', change: '-0.4%', positive: true },
      mrr: { value: '$127,450', suffix: '/mo' },
    },
    includedFeatures: [
      { id: 'personalization', label: 'AI Product Personalization', enabled: true },
      { id: 'stock-sync', label: 'Real-time Stock Sync', enabled: true },
      { id: 'analytics', label: 'Advanced Sales Analytics', enabled: true },
      { id: 'kam', label: 'Dedicated Key Account Manager', enabled: false },
      { id: 'webhooks', label: 'Unlimited Webhook Calls', enabled: true },
      { id: 'custom-css', label: 'Custom CSS Theme Support', enabled: false },
    ],
    aiRecommendation:
      'Based on current usage patterns, subscribers to the Pro Plan are 45% more likely to request "Multi-Warehouse Routing". Consider adding this feature to increase plan retention by an estimated 12%.',
    performanceData: [20, 35, 25, 50, 45, 60, 55, 75, 85, 80],
    accessLogs: [
      { icon: 'person', message: 'Admin: Jessica S. updated pricing', time: '2h ago' },
      { icon: 'settings', message: 'System: Auto-backup complete', time: '5h ago' },
      { icon: 'security', message: 'Admin: Mike R. modified features', time: 'Yesterday' },
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    shortName: 'Enterprise Plan',
    price: 999,
    description: 'Bespoke AI commerce infrastructure for large-scale enterprise operations.',
    metrics: {
      subscribers: { value: '352', change: '+5.1%', positive: true },
      churn: { value: '1.2%', change: '-0.1%', positive: true },
      mrr: { value: '$351,648', suffix: '/mo' },
    },
    includedFeatures: [
      { id: 'dedicated', label: 'Dedicated Instance', enabled: true },
      { id: 'api', label: 'Enterprise API Access', enabled: true },
      { id: 'whitelabel', label: 'White-labeling Options', enabled: true },
      { id: 'kam', label: 'Dedicated Account Manager', enabled: true },
      { id: 'webhooks', label: 'Unlimited Webhook Calls', enabled: true },
      { id: 'custom-css', label: 'Custom CSS Theme Support', enabled: true },
    ],
    aiRecommendation:
      'Enterprise clients show 62% higher engagement with white-labeling features. Highlight this capability during renewal cycles to reduce churn.',
    performanceData: [30, 40, 35, 55, 50, 65, 60, 80, 90, 85],
    accessLogs: [
      { icon: 'person', message: 'Admin: Sarah L. updated SLA terms', time: '1h ago' },
      { icon: 'settings', message: 'System: Dedicated instance scaled', time: '4h ago' },
      { icon: 'security', message: 'Admin: Mike R. modified API access', time: 'Yesterday' },
    ],
  },
};

export const featureMetrics = [
  {
    label: 'Total Features',
    value: '42',
    icon: 'featured_play_list',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    label: 'Active Beta',
    value: '12',
    icon: 'rocket_launch',
    iconBg: 'bg-secondary-container/20 text-secondary',
  },
  {
    label: 'AI Components',
    value: '28',
    icon: 'auto_awesome',
    iconBg: 'bg-tertiary-fixed-dim/20 text-tertiary',
  },
];

export const platformFeatures = [
  {
    id: 'feature-1',
    name: 'AI Sentiment Analysis',
    subtitle: 'Real-time tone detection',
    icon: 'psychology',
    iconBg: 'bg-primary/5 text-primary',
    category: 'AI',
    status: 'active',
    linkedPlans: ['E', 'P'],
    description:
      'Our state-of-the-art NLP engine analyzes incoming customer messages to detect emotional tone, urgency, and intent. This allows support teams to prioritize frustrated customers and automate responses based on sentiment.',
    docsUrl: '#',
    planAvailability: { starter: false, pro: true, enterprise: true },
  },
  {
    id: 'feature-2',
    name: 'Custom Webhooks',
    subtitle: 'Event-driven integrations',
    icon: 'webhook',
    iconBg: 'bg-secondary-container/20 text-secondary',
    category: 'API',
    status: 'beta',
    linkedPlans: ['E'],
    description:
      'Configure custom webhook endpoints to receive real-time event notifications for orders, inventory changes, and AI conversation triggers across your commerce stack.',
    docsUrl: '#',
    planAvailability: { starter: false, pro: false, enterprise: true },
  },
  {
    id: 'feature-3',
    name: 'Priority Support',
    subtitle: 'Under 1-hour response time',
    icon: 'support_agent',
    iconBg: 'bg-tertiary-fixed/30 text-tertiary',
    category: 'SUPPORT',
    status: 'active',
    linkedPlans: ['E', 'P'],
    description:
      'Guaranteed under 1-hour response times with dedicated support engineers. Includes priority escalation paths and direct Slack channel access for Pro and Enterprise subscribers.',
    docsUrl: '#',
    planAvailability: { starter: false, pro: true, enterprise: true },
  },
  {
    id: 'feature-4',
    name: 'Predictive Inventory',
    subtitle: 'AI-driven stock forecasting',
    icon: 'inventory_2',
    iconBg: 'bg-primary/5 text-primary',
    category: 'AI',
    status: 'beta',
    linkedPlans: ['E'],
    description:
      'Machine learning models analyze sales velocity, seasonality, and supplier lead times to predict optimal inventory levels and prevent stockouts.',
    docsUrl: '#',
    planAvailability: { starter: false, pro: false, enterprise: true },
  },
  {
    id: 'feature-5',
    name: 'Multi-Warehouse Routing',
    subtitle: 'Intelligent fulfillment routing',
    icon: 'local_shipping',
    iconBg: 'bg-secondary-container/20 text-secondary',
    category: 'API',
    status: 'active',
    linkedPlans: ['E', 'P', 'S'],
    description:
      'Automatically route orders to the nearest warehouse with available stock, reducing shipping costs and delivery times across multi-location operations.',
    docsUrl: '#',
    planAvailability: { starter: true, pro: true, enterprise: true },
  },
];

export const featuresAiInsight = {
  title: 'AI Insight',
  message:
    '"AI Sentiment Analysis" is the most requested feature by "Pro Plan" users in the last 30 days. Consider moving it from Enterprise-only to Pro to drive upgrades.',
  actionLabel: 'View Report',
};
