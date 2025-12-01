// Projects data
const projects = [
  {
    title: "L-reversal in Genetics",
    description: "\"L-reversal chain\" is a mathematical model for chromosome evolution. Over time, chromosomes mutate by taking a segment of genes and reversing them (inversion).",
    projectUrl: "lreversal-project.html",
    hasVisualization: true
  },
  {
    title: "Side Projects",
    description: "A collection of small projects I worked on over the past few years.",
    projectUrl: "side-projects.html"
  },
  {
    title: "Coming soon",
    description: `<p>Upcoming projects:</p><ul style="margin: 10px 0; padding-left: 20px; color: #555;"><li>Super-resolution for turbulent flow reconstruction</li><li>Cursor hackthon project</li></ul>`,
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

