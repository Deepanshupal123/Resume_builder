const TEMPLATES = [
  { id: 'classic', name: 'Classic', description: 'ATS-friendly traditional layout', sections: ['summary', 'experience', 'education', 'skills', 'projects'], layout: 'single-column' },
  { id: 'modern', name: 'Modern Blue', description: 'Sidebar accent with clean typography', sections: ['summary', 'skills', 'experience', 'education', 'projects'], layout: 'two-column' },
  { id: 'creative', name: 'Creative', description: 'Bold and colorful design', sections: ['summary', 'skills', 'projects', 'experience', 'education'], layout: 'creative' },
  { id: 'minimal', name: 'Minimal', description: 'Clean and elegant layout', sections: ['summary', 'experience', 'education', 'skills'], layout: 'minimal' },
  { id: 'executive', name: 'Executive', description: 'Premium professional layout', sections: ['summary', 'experience', 'education', 'skills', 'projects'], layout: 'executive' },
];

module.exports = { TEMPLATES };
