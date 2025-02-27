#!/usr/bin/env node

console.clear();
console.log("\n\x1b[36m", "Hi I am Pulkit 👋", "\x1b[0m\n");

const greenStr = (str) => `\x1b[32m${str}\x1b[32m`;

const info = {
  name: "Pulkit",
  status: "CS student",
  web: "https://www.pulkitxm.com",
  linkedin: "http://www.linkedin.com/in/pulkit-dce",
  gh: "https://github.com/Pulkitxm",
  twitter: "https://twitter.com/devpulkitt",
  skills: {
    langs: `['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL']`,
    frameworks: `['React', 'NextJS', 'Express', 'Fast API', 'HonoJS(Serverless)', 'Node.js', 'React Native', 'Tailwind CSS', 'Bootstrap', 'Material UI']`,
    databases: `['MongoDB', 'Postgres', 'MySQL', 'SQLAlchemy', 'Redis', 'Alembic', 'Prisma', 'Psycopg2']`,
    tools: `['Mapbox', 'Jest', 'Cypress', 'React Query', 'GraphQL', 'GitHub Actions', 'Serverless', 'ESLint', 'Redux', 'Recoil']`,
    platforms: `['AWS S3', 'AWS EC2', 'AWS CloudFront', 'Azure VM', 'Docker']`,
  },
};

console.log(greenStr(JSON.stringify(info, null, 2)));
