export const JOB_PROFILES = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: 'BarChart2',
    level: 'Intermediate',
    salary: '$65K – $95K / year',
    description: 'You will be asked how you write complex SQL queries, debug weird statistical anomalies, validate business metrics, and clearly explain data trends to product managers.',
    techStack: ['SQL', 'Python (pandas)', 'Tableau', 'Power BI', 'A/B Testing', 'Excel'],
    concepts: ['Window Functions & CTEs', 'Hypothesis Testing', 'Data Cleaning', 'Dashboard Design', 'Metric Definitions', 'Business Communication'],
    interviewFocus: 'SQL query efficiency, spotting biases in experiments, data storytelling, and working with messy real-world numbers.',
    jobDescription: `We are looking for a Data Analyst who can turn raw transactional and user event data into clear business decisions. You will write complex SQL queries, build dashboards in Tableau or Power BI, analyze product experiments, and explain what the numbers mean to non-technical team leads. Requirements: Deep SQL skills, Python for pandas/numpy, solid grasp of statistics and A/B test pitfalls, and strong verbal communication.`,
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    icon: 'Database',
    level: 'Senior',
    salary: '$85K – $130K / year',
    description: 'You will be asked about streaming pipelines, data warehouse modeling, backfilling historical data without breaking downstream jobs, and keeping batch pipelines reliable.',
    techStack: ['Python', 'Apache Kafka', 'Apache Spark', 'dbt', 'Snowflake / BigQuery', 'Airflow'],
    concepts: ['Stream vs Batch Processing', 'Idempotent Pipelines', 'Data Partitioning & Clustering', 'Schema Evolution', 'Backfill Strategies', 'Data Observability'],
    interviewFocus: 'Pipeline reliability, handling out-of-order events, SQL optimization, and designing schemas that stay fast as data grows.',
    jobDescription: `We are hiring a Data Engineer to take ownership of our core event pipelines and data warehouse. You will build and monitor ETL/ELT pipelines, write dbt models, manage Kafka topics, and ensure analysts and ML models have reliable, clean data. Requirements: Production Python, solid distributed computing fundamentals (Spark/Flink), experience with Snowflake/BigQuery, and orchestration with Airflow.`,
  },
  {
    id: 'full-stack',
    title: 'Full Stack Engineer',
    icon: 'Layers',
    level: 'Intermediate / Senior',
    salary: '$90K – $140K / year',
    description: 'You will be asked about frontend performance, backend API architecture, database concurrency, state management, and debugging weird bugs across the stack.',
    techStack: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
    concepts: ['API Design & REST/GraphQL', 'Database Locking & Indexing', 'State Management & Re-renders', 'Authentication & Session Flow', 'Error Handling', 'CI/CD'],
    interviewFocus: 'Frontend rendering optimization, relational database queries, asynchronous event handling, and practical full-stack trade-offs.',
    jobDescription: `We are seeking a Full Stack Engineer to build user-facing features from database models to responsive UI components. You will build React applications in TypeScript, design backend services in Node.js, optimize PostgreSQL queries, and maintain clean REST APIs. Requirements: Deep JavaScript/TypeScript experience, React patterns, relational database knowledge, and comfort owning full features end to end.`,
  },
  {
    id: 'ai-engineer',
    title: 'AI & Machine Learning Engineer',
    icon: 'Code2',
    level: 'Advanced',
    salary: '$110K – $180K / year',
    description: 'You will be asked how you evaluate LLM outputs, reduce hallucinations, build RAG pipelines that do not choke under load, and deploy models reliably.',
    techStack: ['Python', 'PyTorch', 'FastAPI', 'LangChain / LlamaIndex', 'Pinecone / Qdrant', 'Hugging Face'],
    concepts: ['RAG & Chunking Strategies', 'Vector Similarity & Reranking', 'Prompt Engineering & Few-shot', 'Evaluation Frameworks', 'Latency & Token Optimization', 'Fine-Tuning'],
    interviewFocus: 'Retrieval accuracy, latency optimization, handling model hallucination, and structuring production AI pipelines.',
    jobDescription: `We are looking for an AI Engineer to build reliable, production-ready AI applications. You will design retrieval-augmented generation (RAG) pipelines, benchmark and evaluate model outputs, optimize embedding lookups, and integrate LLMs into live software. Requirements: Strong Python, practical experience with vector search and embeddings, knowledge of ML evaluation metrics, and API service development with FastAPI.`,
  },
]

export function getProfile(id) {
  return JOB_PROFILES.find(p => p.id === id) ?? null
}
