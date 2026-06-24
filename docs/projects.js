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
    description: "Turbulent flow reconstruction using diffusion-based methods.",
    projectUrl: "flow-reconstruction.html"
  },
  {
    title: "Masked Conditional Reconstruction",
    description: "A conditional diffusion model reconstructs turbulent flow fields from masked observations. The preview compares the input, generated reconstruction, and ground-truth flow.",
    projectUrl: "masked-conditional-reconstruction.html",
    imageUrl: "assets/conditional-comparison-sample-17.png",
    imageAlt: "Comparison of a masked flow input, conditional reconstruction, and ground-truth flow",
    isFeatured: true
  }
];

// Function to render projects
function renderProjects() {
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = projects.map((project, index) => `
    <div class="project${project.isFeatured ? ' project-featured' : ''}">
      <h3>${project.title}</h3>
      ${project.isComingSoon ? project.description : `<p>${project.description}</p>`}
      ${project.imageUrl ? `<div class="project-preview"><img src="${project.imageUrl}" alt="${project.imageAlt || ''}" loading="lazy"></div>` : ''}
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
