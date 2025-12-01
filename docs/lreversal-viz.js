// Futuristic Interactive L-Reversal Visualization
function initLReversalViz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = container.offsetWidth || 400;
  const height = 380;
  
  // Create SVG with futuristic styling
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.style.background = "radial-gradient(ellipse at center, #0a0e27 0%, #000000 100%)";
  svg.style.borderRadius = "12px";
  svg.style.border = "1px solid rgba(93, 173, 226, 0.3)";
  svg.style.boxShadow = "inset 0 0 50px rgba(93, 173, 226, 0.1), 0 0 30px rgba(93, 173, 226, 0.2)";
  svg.style.overflow = "visible";
  container.appendChild(svg);

  // DNA sequence
  const seqLength = 8;
  const basePairs = ['A', 'T', 'G', 'C', 'A', 'T', 'G', 'C'];
  const padding = 40;
  const segmentSpacing = 8;
  const segmentWidth = (width - padding * 2 - segmentSpacing * (seqLength - 1)) / seqLength;
  const originalY = 110;
  const reversedY = 250;
  const segmentHeight = 50;

  // Futuristic neon colors
  const baseColors = {
    'A': { main: '#ff0080', glow: '#ff40a0', dark: '#cc0066' },
    'T': { main: '#00ffff', glow: '#40ffff', dark: '#00cccc' },
    'G': { main: '#ffff00', glow: '#ffff40', dark: '#cccc00' },
    'C': { main: '#00ff80', glow: '#40ffa0', dark: '#00cc66' }
  };

  let segments = [];
  let isAnimating = false;
  let particles = [];

  // Create animated background particles
  function createParticles() {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 0.5;
      particle.setAttribute("cx", x);
      particle.setAttribute("cy", y);
      particle.setAttribute("r", size);
      particle.setAttribute("fill", "#5dade2");
      particle.setAttribute("opacity", "0.3");
      particle.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      svg.appendChild(particle);
      particles.push(particle);
    }
  }

  function createSegment(base, index, x, y, isReversed = false) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", `segment-${index}`);
    
    const actualIndex = isReversed ? seqLength - 1 - index : index;
    const centerX = x + segmentWidth / 2;
    const colors = baseColors[base];
    
    // Outer glow ring
    const outerGlow = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    outerGlow.setAttribute("cx", centerX);
    outerGlow.setAttribute("cy", y);
    outerGlow.setAttribute("rx", segmentWidth / 2 + 8);
    outerGlow.setAttribute("ry", segmentHeight / 2 + 8);
    outerGlow.setAttribute("fill", colors.glow);
    outerGlow.setAttribute("opacity", "0.2");
    outerGlow.setAttribute("class", "outer-glow");
    group.appendChild(outerGlow);
    
    // Inner glow
    const innerGlow = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    innerGlow.setAttribute("x", x + 3);
    innerGlow.setAttribute("y", y - segmentHeight / 2 + 3);
    innerGlow.setAttribute("width", segmentWidth - 6);
    innerGlow.setAttribute("height", segmentHeight - 6);
    innerGlow.setAttribute("fill", colors.glow);
    innerGlow.setAttribute("rx", "8");
    innerGlow.setAttribute("opacity", "0.4");
    innerGlow.setAttribute("class", "inner-glow");
    group.appendChild(innerGlow);
    
    // Main segment with gradient effect
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x + 3);
    rect.setAttribute("y", y - segmentHeight / 2);
    rect.setAttribute("width", segmentWidth - 6);
    rect.setAttribute("height", segmentHeight);
    rect.setAttribute("fill", colors.main);
    rect.setAttribute("rx", "8");
    rect.setAttribute("stroke", colors.glow);
    rect.setAttribute("stroke-width", "2");
    rect.style.cursor = "pointer";
    rect.style.filter = `drop-shadow(0 0 10px ${colors.glow}) drop-shadow(0 0 20px ${colors.glow})`;
    rect.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    group.appendChild(rect);

    // Holographic overlay effect
    const overlay = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    overlay.setAttribute("x", x + 3);
    overlay.setAttribute("y", y - segmentHeight / 2);
    overlay.setAttribute("width", segmentWidth - 6);
    overlay.setAttribute("height", segmentHeight);
    overlay.setAttribute("fill", "url(#hologram-gradient)");
    overlay.setAttribute("rx", "8");
    overlay.setAttribute("opacity", "0.3");
    overlay.setAttribute("class", "hologram-overlay");
    group.appendChild(overlay);

    // Base letter with glow
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", centerX);
    text.setAttribute("y", y + 7);
    text.setAttribute("fill", "#ffffff");
    text.setAttribute("font-size", "20");
    text.setAttribute("font-weight", "900");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-family", "'Courier New', monospace");
    text.setAttribute("filter", "url(#text-glow)");
    text.textContent = base;
    group.appendChild(text);

    // Index label with futuristic style
    const indexText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    indexText.setAttribute("x", centerX);
    indexText.setAttribute("y", y - segmentHeight / 2 - 12);
    indexText.setAttribute("fill", colors.glow);
    indexText.setAttribute("font-size", "11");
    indexText.setAttribute("font-weight", "bold");
    indexText.setAttribute("text-anchor", "middle");
    indexText.setAttribute("font-family", "'Courier New', monospace");
    indexText.setAttribute("opacity", "0.8");
    indexText.textContent = `[${actualIndex}]`;
    group.appendChild(indexText);

    // Hover effect
    group.addEventListener("mouseenter", () => {
      rect.setAttribute("transform", "scale(1.15)");
      rect.style.filter = `drop-shadow(0 0 15px ${colors.glow}) drop-shadow(0 0 30px ${colors.glow})`;
      outerGlow.setAttribute("opacity", "0.4");
    });
    group.addEventListener("mouseleave", () => {
      rect.setAttribute("transform", "scale(1)");
      rect.style.filter = `drop-shadow(0 0 10px ${colors.glow}) drop-shadow(0 0 20px ${colors.glow})`;
      outerGlow.setAttribute("opacity", "0.2");
    });

    return { group, base, index, x, y, centerX, colors };
  }

  function createDefs() {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    
    // Hologram gradient
    const holoGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    holoGradient.setAttribute("id", "hologram-gradient");
    holoGradient.setAttribute("x1", "0%");
    holoGradient.setAttribute("y1", "0%");
    holoGradient.setAttribute("x2", "100%");
    holoGradient.setAttribute("y2", "100%");
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#ffffff");
    stop1.setAttribute("stop-opacity", "0");
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "50%");
    stop2.setAttribute("stop-color", "#ffffff");
    stop2.setAttribute("stop-opacity", "0.5");
    const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop3.setAttribute("offset", "100%");
    stop3.setAttribute("stop-color", "#ffffff");
    stop3.setAttribute("stop-opacity", "0");
    holoGradient.appendChild(stop1);
    holoGradient.appendChild(stop2);
    holoGradient.appendChild(stop3);
    defs.appendChild(holoGradient);

    // Text glow filter
    const textGlow = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    textGlow.setAttribute("id", "text-glow");
    const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    feGaussianBlur.setAttribute("stdDeviation", "2");
    feGaussianBlur.setAttribute("result", "coloredBlur");
    textGlow.appendChild(feGaussianBlur);
    const feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
    const feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
    feMergeNode1.setAttribute("in", "coloredBlur");
    const feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
    feMergeNode2.setAttribute("in", "SourceGraphic");
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    textGlow.appendChild(feMerge);
    defs.appendChild(textGlow);

    // Arrow marker
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "12");
    marker.setAttribute("markerHeight", "12");
    marker.setAttribute("refX", "10");
    marker.setAttribute("refY", "6");
    marker.setAttribute("orient", "auto");
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", "0 0, 12 6, 0 12");
    polygon.setAttribute("fill", "#5dade2");
    polygon.setAttribute("filter", "url(#glow-filter)");
    marker.appendChild(polygon);
    defs.appendChild(marker);

    // Glow filter for arrow
    const glowFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    glowFilter.setAttribute("id", "glow-filter");
    const feGaussianBlur2 = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    feGaussianBlur2.setAttribute("stdDeviation", "3");
    feGaussianBlur2.setAttribute("result", "coloredBlur");
    glowFilter.appendChild(feGaussianBlur2);
    defs.appendChild(glowFilter);

    return defs;
  }

  function drawInitialState() {
    svg.innerHTML = '';
    svg.appendChild(createDefs());
    createParticles();
    
    // Futuristic title
    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", width / 2);
    title.setAttribute("y", 30);
    title.setAttribute("fill", "#5dade2");
    title.setAttribute("font-size", "16");
    title.setAttribute("font-weight", "bold");
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("font-family", "'Courier New', monospace");
    title.setAttribute("filter", "url(#text-glow)");
    title.textContent = "GENOMIC L-REVERSAL";
    svg.appendChild(title);

    // Draw labels with futuristic style
    const originalLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    originalLabel.setAttribute("x", padding);
    originalLabel.setAttribute("y", 55);
    originalLabel.setAttribute("fill", "#5dade2");
    originalLabel.setAttribute("font-size", "12");
    originalLabel.setAttribute("font-weight", "600");
    originalLabel.setAttribute("font-family", "'Courier New', monospace");
    originalLabel.setAttribute("opacity", "0.85");
    originalLabel.textContent = "> ORIGINAL_SEQUENCE";
    svg.appendChild(originalLabel);

    const reversedLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    reversedLabel.setAttribute("x", padding);
    reversedLabel.setAttribute("y", 195);
    reversedLabel.setAttribute("fill", "#5dade2");
    reversedLabel.setAttribute("font-size", "12");
    reversedLabel.setAttribute("font-weight", "600");
    reversedLabel.setAttribute("font-family", "'Courier New', monospace");
    reversedLabel.setAttribute("opacity", "0.85");
    reversedLabel.textContent = "> L_REVERSED_SEQUENCE";
    svg.appendChild(reversedLabel);

    // Draw original sequence
    segments = [];
    basePairs.forEach((base, i) => {
      const x = padding + i * (segmentWidth + segmentSpacing);
      const segment = createSegment(base, i, x, originalY, false);
      svg.appendChild(segment.group);
      segments.push(segment);
    });

    // Draw reversed sequence (initially hidden)
    const reversedGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    reversedGroup.setAttribute("id", "reversed-group");
    reversedGroup.setAttribute("opacity", "0");
    basePairs.reverse().forEach((base, i) => {
      const x = padding + i * (segmentWidth + segmentSpacing);
      const segment = createSegment(base, i, x, reversedY, true);
      reversedGroup.appendChild(segment.group);
    });
    svg.appendChild(reversedGroup);
  }

  function animateReversal() {
    if (isAnimating) return;
    isAnimating = true;

    const reversedGroup = document.getElementById("reversed-group");
    const reversedSegments = reversedGroup.querySelectorAll("g");
    
    // Create energy beam effect
    const beam = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    beam.setAttribute("x", width / 2 - 2);
    beam.setAttribute("y", originalY + segmentHeight / 2 + 10);
    beam.setAttribute("width", "4");
    beam.setAttribute("height", "0");
    beam.setAttribute("fill", "url(#energy-gradient)");
    beam.setAttribute("opacity", "0");
    beam.style.filter = "blur(2px)";
    svg.appendChild(beam);

    // Energy gradient
    const energyGrad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    energyGrad.setAttribute("id", "energy-gradient");
    energyGrad.setAttribute("x1", "0%");
    energyGrad.setAttribute("y1", "0%");
    energyGrad.setAttribute("x2", "0%");
    energyGrad.setAttribute("y2", "100%");
    const eStop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    eStop1.setAttribute("offset", "0%");
    eStop1.setAttribute("stop-color", "#5dade2");
    const eStop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    eStop2.setAttribute("offset", "100%");
    eStop2.setAttribute("stop-color", "#ff0080");
    energyGrad.appendChild(eStop1);
    energyGrad.appendChild(eStop2);
    svg.querySelector("defs").appendChild(energyGrad);

    // Animate original segments with glitch effect
    segments.forEach((seg, i) => {
      const group = seg.group;
      group.style.transition = "opacity 0.4s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(() => {
        group.setAttribute("opacity", "0");
        group.setAttribute("transform", `translateY(${reversedY - originalY + 20}px) scale(0.5) rotate(180deg)`);
      }, i * 40);
    });

    // Animate energy beam
    setTimeout(() => {
      beam.setAttribute("opacity", "0.8");
      beam.style.transition = "height 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      beam.setAttribute("height", (reversedY - originalY - segmentHeight - 20).toString());
    }, 300);

    // Fade in reversed with futuristic effect
    setTimeout(() => {
      reversedGroup.setAttribute("opacity", "1");
      reversedSegments.forEach((seg, i) => {
        seg.style.transition = "opacity 0.5s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
        seg.setAttribute("opacity", "0");
        seg.setAttribute("transform", "translateY(-30px) scale(0.3) rotate(-180deg)");
        setTimeout(() => {
          seg.setAttribute("opacity", "1");
          seg.setAttribute("transform", "translateY(0) scale(1) rotate(0deg)");
        }, i * 70);
      });
    }, 600);

    // Remove beam
    setTimeout(() => {
      beam.style.transition = "opacity 0.3s ease";
      beam.setAttribute("opacity", "0");
      setTimeout(() => beam.remove(), 300);
    }, 1200);

    // Reset after animation
    setTimeout(() => {
      isAnimating = false;
    }, 2500);
  }

  function resetAnimation() {
    if (isAnimating) return;
    
    segments.forEach((seg) => {
      const group = seg.group;
      group.setAttribute("opacity", "1");
      group.setAttribute("transform", "translateY(0) scale(1) rotate(0deg)");
    });

    const reversedGroup = document.getElementById("reversed-group");
    if (reversedGroup) {
      reversedGroup.setAttribute("opacity", "0");
      const reversedSegments = reversedGroup.querySelectorAll("g");
      reversedSegments.forEach((seg) => {
        seg.setAttribute("opacity", "0");
        seg.setAttribute("transform", "translateY(-30px) scale(0.3) rotate(-180deg)");
      });
    }
  }

  // Initial render
  drawInitialState();

  // Futuristic buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = "display: flex; gap: 10px; margin-top: 15px;";
  
  const animateButton = document.createElement("button");
  animateButton.innerHTML = "▶ INITIATE REVERSAL";
  animateButton.style.cssText = `
    flex: 1;
    padding: 12px 20px;
    background: linear-gradient(135deg, #5dade2 0%, #3498db 50%, #ff0080 100%);
    color: white;
    border: 2px solid #5dade2;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
    transition: all 0.3s;
    box-shadow: 0 0 20px rgba(93, 173, 226, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1);
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
  `;
  
  // Animated background effect
  animateButton.addEventListener("mouseenter", () => {
    animateButton.style.transform = "translateY(-2px) scale(1.02)";
    animateButton.style.boxShadow = "0 0 30px rgba(93, 173, 226, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2)";
    animateButton.style.borderColor = "#ff0080";
  });
  animateButton.addEventListener("mouseleave", () => {
    animateButton.style.transform = "translateY(0) scale(1)";
    animateButton.style.boxShadow = "0 0 20px rgba(93, 173, 226, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)";
    animateButton.style.borderColor = "#5dade2";
  });
  animateButton.addEventListener("click", animateReversal);
  
  const resetButton = document.createElement("button");
  resetButton.innerHTML = "↻ RESET";
  resetButton.style.cssText = `
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.5);
    color: #5dade2;
    border: 2px solid rgba(93, 173, 226, 0.5);
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
    transition: all 0.3s;
    text-transform: uppercase;
  `;
  resetButton.addEventListener("mouseenter", () => {
    resetButton.style.background = "rgba(93, 173, 226, 0.2)";
    resetButton.style.borderColor = "#5dade2";
    resetButton.style.boxShadow = "0 0 15px rgba(93, 173, 226, 0.5)";
  });
  resetButton.addEventListener("mouseleave", () => {
    resetButton.style.background = "rgba(0, 0, 0, 0.5)";
    resetButton.style.borderColor = "rgba(93, 173, 226, 0.5)";
    resetButton.style.boxShadow = "none";
  });
  resetButton.addEventListener("click", resetAnimation);
  
  buttonContainer.appendChild(animateButton);
  buttonContainer.appendChild(resetButton);
  container.appendChild(buttonContainer);
}

// Add futuristic CSS animations
if (!document.getElementById('lreversal-futuristic-styles')) {
  const style = document.createElement("style");
  style.id = 'lreversal-futuristic-styles';
  style.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0.3;
      }
      50% {
        transform: translateY(-20px) translateX(10px);
        opacity: 0.6;
      }
    }
    
    @keyframes pulse-glow {
      0%, 100% {
        filter: drop-shadow(0 0 10px currentColor);
      }
      50% {
        filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 30px currentColor);
      }
    }
    
    @keyframes scan {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(400%);
      }
    }
  `;
  document.head.appendChild(style);
}
