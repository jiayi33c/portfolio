// Three.js 3D Background Setup
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 5;
camera.position.y = 0;

// Create text sprites for numbers
function createTextSprite(text, size = 0.1, isGlow = false) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 512;
  
  if (isGlow) {
    // Glow effect with multiple layers
    context.shadowBlur = 20;
    context.shadowColor = 'rgba(255, 255, 255, 0.7)';
    context.fillStyle = 'rgba(255, 255, 255, 0.7)';
    context.font = 'normal 180px "Helvetica Neue", Helvetica, Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.lineWidth = 1;
    context.fillText(text, 256, 256);
    
    // Add extra glow layers
    context.shadowBlur = 35;
    context.fillText(text, 256, 256);
  } else {
    context.fillStyle = 'rgba(255, 255, 255, 1.0)';
    context.font = 'normal 180px "Helvetica Neue", Helvetica, Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.lineWidth = 1;
    context.fillText(text, 256, 256);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true,
    blending: isGlow ? THREE.AdditiveBlending : THREE.NormalBlending
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(size, size, 1);
  sprite.userData = { canvas, context, texture, material: spriteMaterial, isGlow };
  return sprite;
}

// Update text on sprite
function updateTextSprite(sprite, text) {
  const { canvas, context, texture, isGlow } = sprite.userData;
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  if (isGlow) {
    context.shadowBlur = 20;
    context.shadowColor = 'rgba(255, 255, 255, 0.7)';
    context.fillStyle = 'rgba(255, 255, 255, 0.7)';
    context.font = 'normal 180px "Helvetica Neue", Helvetica, Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.lineWidth = 1;
    context.fillText(text, 256, 256);
    context.shadowBlur = 35;
    context.fillText(text, 256, 256);
  } else {
    context.fillStyle = 'rgba(255, 255, 255, 1.0)';
    context.font = 'normal 180px "Helvetica Neue", Helvetica, Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.lineWidth = 1;
    context.fillText(text, 256, 256);
  }
  texture.needsUpdate = true;
}

// Create infinity sign (lemniscate) with numbers
const NUM_LEMNISCATE = 200;
const lemniscateSprites = [];
const lemniscateGlow = [];
const size = 1.5;

for (let i = 0; i < NUM_LEMNISCATE; i++) {
  const angle = (i / NUM_LEMNISCATE) * Math.PI * 2;
  const denom = 1 + Math.pow(Math.sin(angle), 2);
  const x = (size / 2.0) * Math.cos(angle) / denom;
  const y = (size / 2.0) * Math.sin(angle) * Math.cos(angle) / denom;
  const z = (size / 2.0) * 0.13 * Math.sin(angle);

  const num = (i % 100).toString();
  const sprite = createTextSprite(num, 0.1);
  sprite.position.set(x, y, z);
  scene.add(sprite);
  lemniscateSprites.push(sprite);

  const glowSprite = createTextSprite(num, 0.4, true);
  glowSprite.position.set(x, y, z);
  scene.add(glowSprite);
  lemniscateGlow.push(glowSprite);
}

// Create random number stars
const NUM_STARS = 200;
const starSprites = [];
const starGlow = [];
const starDigits = [];

for (let i = 0; i < NUM_STARS; i++) {
  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 5 + 1;
  const z = (Math.random() - 0.5) * 10;

  const digit = Math.floor(Math.random() * 9) + 1;
  starDigits.push(digit);

  const sprite = createTextSprite(digit.toString(), 0.02);
  sprite.position.set(x, y, z);
  scene.add(sprite);
  starSprites.push(sprite);

  const glowSprite = createTextSprite(digit.toString(), 0.15, true);
  glowSprite.position.set(x, y, z);
  scene.add(glowSprite);
  starGlow.push(glowSprite);
}

// Animation loop
let frameCount = 0;
function animate() {
  requestAnimationFrame(animate);
  frameCount++;

  // Rotate camera around Y axis
  const time = frameCount * 0.01;
  camera.position.x = Math.sin(time * 0.3) * 2;
  camera.position.z = Math.cos(time * 0.3) * 2;
  camera.lookAt(0, 0, 0);

  // Animate lemniscate
  for (let i = 0; i < NUM_LEMNISCATE; i++) {
    const t = (frameCount + i * 5) * 0.01;
    const a = Math.sin(t) * 0.5 + 0.5;
    const hue = (Math.sin(t * 0.3) * 0.5 + 0.5) % 1;
    
    // Convert hue to RGB
    const h = hue * 6;
    const c = 1;
    const x = c * (1 - Math.abs((h % 2) - 1));
    let r, g, b;
    if (h < 1) { r = c; g = x; b = 0; }
    else if (h < 2) { r = x; g = c; b = 0; }
    else if (h < 3) { r = 0; g = c; b = x; }
    else if (h < 4) { r = 0; g = x; b = c; }
    else if (h < 5) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const scale = 0.1 + a * 0.05;
    const pulseGain = 0.65 + 0.35 * (Math.exp(-t * 5.0) + 0.8);
    
    lemniscateGlow[i].scale.set(scale * 1.3, scale * 1.3, 1);
    lemniscateGlow[i].material.color.setRGB(
      r * 3.0 * pulseGain,
      g * 3.0 * pulseGain,
      b * 3.0 * pulseGain
    );
    lemniscateSprites[i].material.color.setRGB(1, 1, 1);

    // Update text
    const animatedNum = (frameCount + i) % 100;
    const label = animatedNum.toString();
    updateTextSprite(lemniscateSprites[i], label);
    updateTextSprite(lemniscateGlow[i], label);
  }

  // Animate stars
  for (let i = 0; i < NUM_STARS; i++) {
    const t = (frameCount + i * 8) * 0.01;
    const a = Math.sin(t) * 0.5 + 0.5;
    const hue = (Math.sin(t * 0.5) * 0.5 + 0.5) % 1;
    
    const h = hue * 6;
    const c = 1;
    const x = c * (1 - Math.abs((h % 2) - 1));
    let r, g, b;
    if (h < 1) { r = c; g = x; b = 0; }
    else if (h < 2) { r = x; g = c; b = 0; }
    else if (h < 3) { r = 0; g = c; b = x; }
    else if (h < 4) { r = 0; g = x; b = c; }
    else if (h < 5) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const scale = 0.05 + a * 0.05;
    starGlow[i].scale.set(scale * 1.3, scale * 1.3, 1);
    starGlow[i].material.color.setRGB(r * 3.0, g * 3.0, b * 3.0);
    starSprites[i].material.color.setRGB(1, 1, 1);
  }

  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

