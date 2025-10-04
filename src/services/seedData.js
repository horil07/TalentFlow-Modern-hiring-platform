import { db } from './database.js';

export const seedInitialData = async () => {
  const jobsCount = await db.jobs.count();
  if (jobsCount > 0) return; // Already seeded

  // Seed Jobs
  const jobTitles = [
    'Senior React Developer', 'Frontend Engineer', 'Full Stack Developer', 
    'Backend Engineer', 'DevOps Specialist', 'Product Manager',
    'UX Designer', 'Data Scientist', 'Mobile Developer', 'QA Engineer',
    'Technical Lead', 'Software Architect', 'Cloud Engineer', 'Security Analyst',
    'Database Administrator', 'Machine Learning Engineer', 'Systems Analyst',
    'Network Engineer', 'Scrum Master', 'Business Analyst', 'Product Designer',
    'Content Strategist', 'Growth Marketer', 'Data Engineer', 'Site Reliability Engineer'
  ];

  const jobTags = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'AWS',
    'Docker', 'Kubernetes', 'SQL', 'NoSQL', 'GraphQL', 'REST', 'Agile',
    'CI/CD', 'Testing', 'UI/UX', 'Mobile', 'Cloud', 'Security', 'Data'
  ];

  const jobs = jobTitles.map((title, index) => ({
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    status: index % 5 === 0 ? 'archived' : 'active',
    tags: jobTags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2),
    order: index + 1,
    description: `We are looking for a talented ${title} to join our team. This role requires strong technical skills and excellent collaboration abilities.`,
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of professional experience',
      'Strong problem-solving skills',
      'Excellent communication abilities'
    ],
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }));

  await db.jobs.bulkAdd(jobs);

  // Seed Candidates
  const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
  const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Chris', 'Amy'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];

  const candidates = Array.from({ length: 1000 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    return {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domain}`,
      stage: stages[Math.floor(Math.random() * stages.length)],
      jobId: Math.floor(Math.random() * jobTitles.length) + 1,
      phone: `+1-555-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      notes: [],
      updatedAt: new Date()
    };
  });

  await db.candidates.bulkAdd(candidates);

  // Seed Assessments
  const assessments = [
    {
      jobId: 1, // Senior React Developer
      title: 'React Technical Assessment',
      description: 'Technical assessment for React developer position',
      questions: [
        {
          id: 1,
          type: 'single',
          text: 'What is the virtual DOM in React?',
          required: true,
          options: [
            'A direct representation of the actual DOM',
            'A lightweight copy of the actual DOM',
            'A database for storing React components',
            'A testing environment for React'
          ]
        },
        {
          id: 2,
          type: 'multiple',
          text: 'Which of the following are React hooks?',
          required: true,
          options: ['useState', 'useEffect', 'useComponent', 'useRender', 'useContext']
        },
        {
          id: 3,
          type: 'text',
          text: 'Explain the difference between state and props in React.',
          required: true,
          maxLength: 500
        },
        {
          id: 4,
          type: 'number',
          text: 'How many years of React experience do you have?',
          required: true,
          min: 0,
          max: 20
        },
        {
          id: 5,
          type: 'textarea',
          text: 'Describe a challenging React project you worked on and how you solved the challenges.',
          required: false,
          maxLength: 1000
        }
      ],
      settings: {
        timeLimit: 60, // minutes
        passingScore: 70
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.assessments.bulkAdd(assessments);

  console.log('Database seeded successfully!');
};