const SKILL_TERMS = [
  'machine learning', 'deep learning', 'artificial intelligence', 'generative ai',
  'natural language processing', 'computer vision', 'data science', 'data analysis',
  'data visualization', 'data engineering', 'business intelligence', 'project management',
  'product management', 'stakeholder management', 'team leadership', 'customer service',
  'customer success', 'user research', 'user experience', 'content marketing',
  'digital marketing', 'email marketing', 'social media', 'search engine optimization',
  'talent acquisition', 'human resources', 'supply chain', 'business development',
  'account management', 'risk management', 'quality assurance', 'continuous integration',
  'continuous delivery', 'rest api', 'api development', 'api design', 'microservices',
  'system design', 'software development', 'software engineer', 'software engineering',
  'web development', 'frontend', 'backend', 'fullstack', 'mobile development',
  'cloud computing', 'cloud architecture', 'cloud infrastructure', 'infrastructure as code',
  'test automation', 'automated testing', 'unit testing', 'integration testing',
  'user acceptance testing', 'agile methodology', 'scrum methodology', 'problem solving',
  'critical thinking', 'strategic planning', 'business analysis', 'process improvement',
  'cross functional', 'attention to detail', 'time management', 'written communication',
  'verbal communication', 'communication', 'collaboration', 'leadership', 'sales',
  'negotiation', 'presentation', 'recruiting', 'recruitment', 'payroll', 'compliance',
  'budgeting', 'forecasting', 'inventory management', 'data entry', 'administration',
  'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'golang', 'rust', 'ruby',
  'php', 'swift', 'kotlin', 'scala', 'sql', 'html', 'css', 'react', 'angular', 'vue',
  'node.js', 'express.js', 'django', 'flask', 'spring boot', '.net', 'asp.net', 'laravel',
  'next.js', 'nestjs', 'graphql', 'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis',
  'dynamodb', 'elasticsearch', 'firebase', 'supabase', 'aws', 'azure', 'gcp', 'google cloud',
  'docker', 'kubernetes', 'terraform', 'jenkins', 'github actions', 'gitlab ci', 'linux',
  'unix', 'git', 'github', 'jira', 'figma', 'tableau', 'power bi', 'excel', 'pandas',
  'numpy', 'pytorch', 'tensorflow', 'spark', 'hadoop', 'kafka', 'airflow', 'snowflake',
  'databricks', 'etl', 'oauth', 'jwt', 'soap', 'selenium', 'cypress', 'playwright', 'jest',
  'vitest', 'postman', 'salesforce', 'hubspot', 'servicenow', 'workday', 'sap', 'oracle',
  'cybersecurity', 'network security', 'penetration testing', 'incident response',
  'information security', 'seo', 'sem', 'crm', 'adobe photoshop', 'adobe illustrator',
  'microsoft office', 'microsoft 365',
];

const STOP_WORDS = new Set(
  'a an and are as at be been being but by can did do does for from had has have he her hers him his how i in into is it its may me more most must my no nor not of on or our ours she should so some such than that the their theirs them then there these they this those to up us very was we were what when where which who will with work you your about after all also any both each here if only other over same since still through under until while within without provide provided preferred required including include role team ability strong years year new based using use used well great various related responsible responsibilities qualifications requirement knowledge skill skills experience degree bonus candidate position company job description ideal plus environment professional looking applications applicant career grow better join successful across focused passionate person take support ensure build builds building develop developing maintain maintained manage managing help organization business all'.split(
    ' '
  )
);

const TERM_ALIASES = {
  javascript: ['js'],
  typescript: ['ts'],
  'artificial intelligence': ['ai'],
  'machine learning': ['ml'],
  kubernetes: ['k8s'],
  postgresql: ['postgres'],
  mongodb: ['mongo'],
  'rest api': ['rest apis', 'restful api', 'restful apis'],
  frontend: ['front end'],
  backend: ['back end'],
  fullstack: ['full stack'],
  'google cloud': ['gcp'],
};

const canonicalize = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/node\.js|nodejs/g, 'node js')
    .replace(/react\.js|reactjs/g, 'react')
    .replace(/vue\.js|vuejs/g, 'vue')
    .replace(/next\.js|nextjs/g, 'next js')
    .replace(/express\.js|expressjs/g, 'express js')
    .replace(/asp\.net/g, 'aspnet')
    .replace(/c\+\+/g, 'cplusplus')
    .replace(/c#/g, 'csharp')
    .replace(/\.net/g, 'dotnet')
    .replace(/c[\s-]*sharp/g, 'csharp')
    .replace(/c\s*plusplus/g, 'cplusplus')
    .replace(/ci\s*\/\s*cd/g, 'cicd')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const includesTerm = (normalizedText, term) => {
  const normalizedTerm = canonicalize(term);
  if (!normalizedTerm) return false;

  const aliases = TERM_ALIASES[term] || [];
  return [normalizedTerm, ...aliases.map(canonicalize)].some((candidate) =>
    ` ${normalizedText} `.includes(` ${candidate} `)
  );
};

const extractFallbackTerms = (jobDescription) => {
  const words = canonicalize(jobDescription).split(' ');
  const counts = new Map();

  const addTerm = (term) => {
    if (!term || STOP_WORDS.has(term) || term.length < 3 || /^\d+$/.test(term)) return;
    counts.set(term, (counts.get(term) || 0) + 1);
  };

  words.forEach((word, index) => {
    addTerm(word);
    const nextWord = words[index + 1];
    if (nextWord && !STOP_WORDS.has(word) && !STOP_WORDS.has(nextWord)) {
      addTerm(`${word} ${nextWord}`);
    }
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].split(' ').length - a[0].split(' ').length || a[0].localeCompare(b[0]))
    .slice(0, 20)
    .map(([term]) => term);
};

const analyzeResumeLocally = (resumeText, jobDescription) => {
  const normalizedJobDescription = canonicalize(jobDescription);
  const normalizedResume = canonicalize(resumeText);
  const knownTerms = [...new Set(SKILL_TERMS)].filter((term) =>
    includesTerm(normalizedJobDescription, term)
  );
  const keywords = knownTerms.length >= 2 ? knownTerms.slice(0, 20) : extractFallbackTerms(jobDescription);
  const matchedKeywords = keywords.filter((term) => includesTerm(normalizedResume, term));
  const missingKeywords = keywords.filter((term) => !includesTerm(normalizedResume, term));

  return {
    score: keywords.length ? Math.round((matchedKeywords.length / keywords.length) * 100) : 0,
    matchedKeywords,
    missingKeywords,
    provider: 'local-fallback',
    analyzedAt: new Date(),
  };
};

export { analyzeResumeLocally };
