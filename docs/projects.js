// Projects data
const projects = [
  {
    title: "L-reversal in Genetics",
    description: "\"L-reversal chain\" is a mathematical model for chromosome evolution. Over time, chromosomes mutate by taking a segment of genes and reversing them (inversion).",
    projectUrl: "lreversal-project.html",
    hasVisualization: true
  },
  {
    title: "WordWave",
    description: "A multimodal educational application that combines computer vision, real-time audio processing, and an AI agent to create an interactive environment where children learn vocabulary through motion, gesture recognition, and sound-guided exploration.<br><br>I designed it to provide a low-pressure, playful space that supports both language development and mental well-being.",
    projectUrl: "https://word-wave-five.vercel.app/",
    githubUrl: "https://github.com/jiayi33c/WordWave"
  },
  {
    title: "Side Projects",
    description: "A collection of small projects I worked on over the past few years.",
    projectUrl: "side-projects.html"
  },
  {
    title: "Flow Reconstruction",
    description: "Super-resolution for turbulent flow reconstruction using diffusion-based methods.",
    projectUrl: "flow-reconstruction.html"
  },
  {
    title: "Coming soon",
    description: `<p>Upcoming projects:</p><ul style="margin: 10px 0; padding-left: 20px; color: rgba(255, 255, 255, 0.9);"><li>Cursor hackathon project</li></ul>`,
    projectUrl: "#",
    isComingSoon: true
  }
];

// Function to render projects
function renderProjects() {
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = projects.map((project, index) => `
    <div class="project">
      <h3>${project.title}</h3>
      ${project.isComingSoon ? project.description : `<p>${project.description}</p>`}
      ${project.hasVisualization ? `<div id="lreversal-viz-${index}" class="project-viz"></div>` : ''}
      ${project.isComingSoon ? '' : `<div class="links">
        <a href="${project.projectUrl}" target="_blank">View Project</a>
        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank">View Code</a>` : ''}
      </div>`}
    </div>
  `).join('');
  
  // Initialize visualizations
  projects.forEach((project, index) => {
    if (project.hasVisualization && typeof initLReversalViz === 'function') {
      setTimeout(() => initLReversalViz(`lreversal-viz-${index}`), 100);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderProjects);
} else {
  renderProjects();
}

