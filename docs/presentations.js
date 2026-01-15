// Presentations data (grouped)
const presentationSections = [
  {
    title: "Markov Chains and Mixing Times",
    collapsible: true,
    reference:
      "Levin, D. A., Peres, Y., & Wilmer, E. L. Markov Chains and Mixing Times, 2nd ed. American Mathematical Society, 2017.",
    items: [
      {
        title: "From Shuffling Cards to Shuffling Genes",
        description: "Talk connecting card shuffling models to genome rearrangements.",
        filePath: "Markov Chains and Mixing times/From shuffling cards to shuffling genes.pdf",
      },
      {
        title: "The Symmetric Group and Shuffling Cards",
        description: "Introductory presentation on the symmetric group and shuffling.",
        filePath: "Markov Chains and Mixing times/The Symmetric Group and Shuffling Cards.pdf",
      },
    ],
  },
  {
    title: "Architecture Modifications to the Physics-Informed Diffusion Model",
    collapsible: false,
    reference:
      "Shu, D., Li, Z., & Farimani, A. B. A physics-informed diffusion model for high-fidelity flow field reconstruction. arXiv:2211.14680v2, 2023. https://doi.org/10.48550/arXiv.2211.14680",
    items: [
      {
        title: "Architecture Modifications to the Physics-Informed Diffusion Model",
        description: "Presentation outlining proposed architecture modifications.",
        filePath: "proposed methods.pdf",
      },
    ],
  },
  {
    title: "Review: SNN-PDE: Learning Dynamic PDEs from Data with Simplicial Neural Networks",
    collapsible: false,
    reference:
      "Choi, J., Chen, Y., Lee, H. K., Kim, H., & Gel, Y. R. SNN-PDE: Learning Dynamic PDEs from Data with Simplicial Neural Networks. 202* (OpenReview).",
    remark:
      "Remark. Later work showed that the proposed formulation does not fully respect the chain complex identity ∂² = 0, which affects the theoretical consistency of the method.",
    items: [
      {
        title: "Review: SNN-PDE: Learning Dynamic PDEs from Data with Simplicial Neural Networks",
        description: "Review notes and summary.",
        filePath: "An SNN-Based Framework for Hodge-Theoretic PDEs.pdf",
      },
    ],
  },
];

function renderPresentations() {
  const grid = document.querySelector(".presentations-grid");
  if (!grid) return;

  function renderReference(ref) {
    if (!ref) return "";
    // Make DOI clickable if present
    const withLinks = ref.replace(
      /(https:\/\/doi\.org\/\S+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return `<p class="presentations-reference">${withLinks}</p>`;
  }

  function renderRemark(remark) {
    if (!remark) return "";
    return `<p class="presentations-remark">${remark}</p>`;
  }

  function renderCard(p, opts = {}) {
    const encodedPath = encodeURI(p.filePath);
    return `
      <div class="project">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        ${opts.referenceInside ? renderReference(opts.referenceInside) : ""}
        ${opts.remarkInside ? renderRemark(opts.remarkInside) : ""}
        <div class="links">
          <a href="${encodedPath}" target="_blank" rel="noopener noreferrer">View</a>
        </div>
      </div>
    `;
  }

  grid.innerHTML = presentationSections
    .map((section) => {
      const content = `
        <div class="presentations-group-grid">
          ${section.items.map(renderCard).join("")}
        </div>
      `;

      if (section.collapsible) {
        return `
          <details class="presentations-accordion">
            <summary class="presentations-accordion-title">${section.title}</summary>
            <div class="presentations-accordion-content">
              ${section.reference ? renderReference(section.reference) : ""}
              ${content}
            </div>
          </details>
        `;
      }

      // Single-item section with same title: avoid duplicate heading; put reference inside the card.
      if (section.items.length === 1 && section.items[0].title === section.title) {
        return `
          <div class="presentations-group">
            ${renderCard(section.items[0], { referenceInside: section.reference, remarkInside: section.remark })}
          </div>
        `;
      }

      return `
        <div class="presentations-group">
          <h3 class="presentations-group-title">${section.title}</h3>
          ${section.reference ? renderReference(section.reference) : ""}
          ${content}
        </div>
      `;
    })
    .join("");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderPresentations);
} else {
  renderPresentations();
}

