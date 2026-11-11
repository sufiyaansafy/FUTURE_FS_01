// To add a live link or change a status after finishing a task,
// edit the matching entry below. Nothing else needs to change.
//
// category: 'internship' | 'course' | 'academic'
// status:   'Live' | 'Up next' | 'Planned' | 'Completed' | 'In progress'

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'internship', label: 'Future Interns' },
  { id: 'course', label: 'Courses' },
  { id: 'academic', label: 'Academic' },
]

export const projects = [
  {
    id: 'fs-01',
    category: 'internship',
    step: 'Task 1',
    when: '20 to 27 Oct 2026',
    title: 'Personal portfolio website',
    status: 'Live',
    description:
      'The site you’re on. A React portfolio pre-rendered to plain HTML so search engines can read it, with a responsive, high-contrast design and a contact form that saves messages to Supabase and emails me through an Edge Function.',
    stack: ['React', 'Vite', 'Supabase', 'Edge Functions', 'CSS'],
    links: [
      { label: 'Source code', href: 'https://github.com/sufiyaansafy/FUTURE_FS_01' },
    ],
  },
  {
    id: 'fs-02',
    category: 'internship',
    step: 'Task 2',
    when: '28 Oct to 4 Nov 2026',
    title: 'Mini CRM for an optometry practice',
    status: 'Live',
    description:
      'A lead manager for Focal Point Optometry, a demo practice. Requests from a “Book an eye test” form become leads that staff move from new to contacted to converted, with notes, follow-up dates, email alerts and a view-only demo login.',
    stack: ['React', 'Supabase Auth', 'PostgreSQL', 'Row Level Security', 'Edge Functions', 'Resend'],
    links: [
      { label: 'Live demo', href: 'https://focal-point-crm.vercel.app' },
      { label: 'Source code', href: 'https://github.com/sufiyaansafy/FUTURE_FS_02' },
    ],
  },
  {
    id: 'fs-03',
    category: 'internship',
    step: 'Task 3',
    when: '4 to 11 Nov 2026',
    title: 'Local business website and pitch',
    status: 'Live',
    description:
      'A website for Akhalwayas Signet, a takeaway in Lenasia, pitched to the owner. A 3D version of the shop’s sign, a Dagwood that comes apart layer by layer as you scroll, and the full menu with an order bag that sends orders straight to the shop on WhatsApp.',
    stack: ['React', 'Vite', 'Three.js', 'WebGL', 'CSS'],
    links: [
      { label: 'Live site', href: 'https://akhalwayas-signet.vercel.app' },
    ],
  },
  {
    id: 'fcc',
    category: 'course',
    step: 'freeCodeCamp',
    when: 'Front End Development certification',
    title: 'Front-end web applications',
    status: 'Completed',
    description:
      'A series of responsive, interactive browser apps built to earn the certification, applying semantic markup, Flexbox and Grid layouts, and DOM manipulation.',
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    links: [],
  },
  {
    id: 'ibm',
    category: 'course',
    step: 'IBM',
    when: 'AI and Model Development course',
    title: 'Machine learning model',
    status: 'Completed',
    description:
      'Designed, trained and evaluated a machine learning model as the practical component of the course, covering data preparation, model training and performance evaluation.',
    stack: ['Python', 'Machine learning'],
    links: [],
  },
  {
    id: 'scrimba',
    category: 'course',
    step: 'Scrimba',
    when: 'Full Stack Developer Career Path',
    title: 'Full stack applications',
    status: 'In progress',
    description:
      'React applications built with component-based architecture, state management and REST API integration.',
    stack: ['React', 'JavaScript', 'REST APIs'],
    links: [],
  },
  {
    id: 'academic',
    category: 'academic',
    step: 'Richfield',
    when: '2024 to present',
    title: 'Academic programming projects',
    status: 'Completed',
    description:
      'Coursework applications in four languages, spanning object-oriented design, SQL-backed data management and web front ends.',
    stack: ['Java', 'C#', 'Python', 'C++', 'SQL'],
    links: [],
  },
]
