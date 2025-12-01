GG.fullscreen();

// Bloom for glow
GG.outputPass() @=> OutputPass output_pass;
GG.renderPass() --> BloomPass bloom_pass --> output_pass;
bloom_pass.input(GG.renderPass().colorOutput());
output_pass.input(bloom_pass.colorOutput());
[0, 2, 4, 7, 9] @=> int scale[]; 
[ 0, 2, 4, 7, 9 ] @=> int pent[];
// Ethereal bottle pad
BlowBotl bottle => JCRev rev => dac;
0.15 => rev.mix; // soft reverb
// visuals sync with pad timing
1.8 => float notePeriodSec;
now => time noteStart;

// extra flash on each click / note start
0.0 => float clickBoost;

// --- music loop as a function ---
fun void etherealPad() {
    while (true) {
        // Softer breath noise
        Math.random2f(0.05, 0.15) => bottle.noiseGain;

        // Gentle vibrato
        Math.random2f(3, 6) => bottle.vibratoFreq;
        Math.random2f(0.01, 0.05) => bottle.vibratoGain;

        // Soft volume
        Math.random2f(0.15, 0.25) => bottle.volume;

        // Pick note
        scale[Math.random2(0, scale.size()-1)] + 57 => Std.mtof => bottle.freq;

        // Play
        1 => bottle.noteOn;

// tell visuals the new note period + start time
        Math.random2f(1.2, 2.5) => float d;
        d => notePeriodSec;
        now => noteStart;

// small attack flash on each note
        1.0 => clickBoost;

// Let note breathe before changing
        (d::second) => now;


        // Let note breathe before changing
        Math.random2f(1.2, 2.5)::second => now;

        // Optional: slight overlap
        0 => bottle.noteOn;
    }
}

// run music in its own shred
spork ~ etherealPad();




// Camera
GOrbitCamera cam --> GG.scene();
GG.scene().camera(cam);
UI ui;

// Number of points
200 => int NUM;
1.5 => float size;
GText gtext[NUM];
GText gglow[NUM];

fun void makeLemniscate3D() {
    for (int i; i < NUM; ++i) {
        (i / (NUM * 1.0)) * Math.TWO_PI => float angle;
        1 + Math.pow(Math.sin(angle), 2) => float denom;

        // parametric 3D lemniscate
        (size / 2.0) * Math.cos(angle) / denom => float x;
        (size / 2.0) * Math.sin(angle) * Math.cos(angle) / denom => float y;
        (size / 2.0) * 0.13 * Math.sin(angle) => float z;

        // glow + text
        GText t --> GG.scene();
        t.text(""); t.pos(@(x, y, z)); t.sca(0.1);
        t @=> gtext[i];

        GText glow --> GG.scene();
        glow.text(""); glow.pos(@(x, y, z)); glow.sca(0.3);
        glow @=> gglow[i];
    }
}

makeLemniscate3D();
// Add shiny "number stars" above the Y-axis
200 => int NUM_STARS;
GText stars[NUM_STARS];
GText starGlow[NUM_STARS];
int digits[NUM_STARS];
new int[0] @=> int clickedIndices[];
0 => int runningSum;

GText sumText --> GG.scene();
sumText.pos(@(0, 3.5, 0));
sumText.text("Sum: 0");
sumText.sca(0.15);

fun void makeStars() {
    for (int i; i < NUM_STARS; i++) {
        // Random XZ, fixed high Y
        Math.random2f(-5, 5) => float x;
        Math.random2f(-5, 5) => float z;
        Math.random2f(1, 3.5) => float y;  // Above the main shape
        

        Math.random2(1, 10) => int digit;
        digit => digits[i];

        // Main number
        GText t --> GG.scene();
        t.text("" + digit);
        t.pos(@(x, y, z));
        t.sca(0.02);  // small size
        t @=> stars[i];

        // Glow version
        GText glow --> GG.scene();
        glow.text("" + digit);
        glow.pos(@(x, y, z));
        glow.sca(0.1);
        glow @=> starGlow[i];
    }
    sumText --> GG.scene();
    sumText.text("Sum: 0");
    sumText.pos(@(0, 3.5, 0)); // adjust if needed
    sumText.sca(0.15);
}

makeStars();
fun float vec3Length(vec3 v) {
    Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z) => float result;
    return result;
}

fun int arrayContains(int arr[], int val) {
    if (arr == null) return 0;       // safety
    arr.size() => int N;
    for (int i; i < N; i++) if (arr[i] == val) return 1;
    return 0;
}
// --- visual click FX ---
fun float lerp(float a, float b, float t) { return a + (b - a) * t; }

fun void clickFX(int idx) {
    0.18 => float startSca;    0.08 => float endSca;
    0.25::second => dur D;

    0::ms => dur t;
    while (t < D) {
        (t / ms) / (D / ms) => float u;
        lerp(startSca, endSca, u) => float sc;
        starGlow[idx].sca(sc);

        if (t < 60::ms) { starGlow[idx].color(@(6,6,6)); }
        else            { starGlow[idx].color(@(0,3,0)); }

        GG.nextFrame() => now;
        t + GG.dt()::second => t;
    }
    starGlow[idx].sca(endSca);
    starGlow[idx].color(@(0,2.2,0));
}

// --- click blip sound ---
// brighter, clicky blip that stands out

fun void clickBlip(int digit) {
    PulseOsc s => LPF f => ADSR e => Gain g => dac;
    0.45 => s.width;
    0.9  => s.gain;
    0.35  => g.gain;

    220.0 * Math.pow(2.0, (pent[(digit-1) % pent.size()] / 12.0)) => s.freq;

    e.set(2::ms, 70::ms, 0.0, 40::ms);
    6000 => f.freq; 1.0 => f.Q;

    e.keyOn(); 40::ms => now; 3500 => f.freq; 50::ms => now;
    e.keyOff(); 60::ms => now;

    g =< dac; e =< g; f =< e; s =< f;
}




fun void handleClick(vec3 pos) {
    int i;
    for (0 => i; i < NUM_STARS; i++) {
        vec3 p; stars[i].pos() => p;
        pos - p => vec3 d;
        Math.sqrt(d.x*d.x + d.y*d.y + d.z*d.z) => float dist;

        if (dist < 0.25 && arrayContains(clickedIndices, i) == 0) {
            clickedIndices << i;
            spork ~ clickFX(i);
            spork ~ clickBlip(digits[i]);
            0.5 => clickBoost;

            runningSum + digits[i] => runningSum;
            if (runningSum >= 10) {
                1 => runningSum;
                for (int j : clickedIndices) { starGlow[j].color(@(2,2,2)); starGlow[j].sca(0.1); }
                clickedIndices.clear();
            }
            sumText.text("Sum: " + runningSum);
            break;

        }
    }
}



// spork ~ flickerGlow();

fun vec3 getRayToPlane(vec2 mousePosPx, float planeY) {
    GG.scene().camera() @=> GCamera cam;

    // If you're using ImGui, offset by the main viewport's top-left
    UI.getMainViewport() @=> UI_Viewport vp; // or UI.mainViewport() on some builds
    vec2 sp; (mousePosPx - vp.pos()) => sp;  // NO Y flip (screen coords are top-left)

    // Build a ray using two distances from the camera
    vec3 p0; vec3 p1;
    cam.screenCoordToWorldPos(sp, 0.0) => p0; // camera position on this pixel
    cam.screenCoordToWorldPos(sp, 1.0) => p1; // 1 world unit along the ray

    (p1 - p0) @=> vec3 dir;

    // intersect with horizontal plane y = planeY
    if (Math.fabs(dir.y) < 1e-4) return p0 + dir * 100.0;

    ((planeY - p0.y) / dir.y) => float t;
    return p0 + dir * t;
}

vec2 mp;
vec3 approx3dPos;
vec3 hit;



while (true) {
    GG.nextFrame() => now;
    (((now - noteStart) / second) / notePeriodSec) => float u;
    if (u > 1.0) 1.0 => u;

    // fast attack + gentle decay + a little wobble
    (9 * Math.exp(-u * 5.0)
     + 8 * (0.5 + 0.5 * Math.sin(Math.TWO_PI * u)))
     => float baseBeat;

    // decay any click/note flash
    clickBoost * 0.90 => clickBoost;

    // final brightness you’ll use for the infinity glow
    0.65 + 0.35 * (baseBeat + 0.8 * clickBoost) => float pulseGain;
    if (!UI.wantCaptureMouse() && UI.isMouseClicked(0)) {
    vec2 mp; UI.getMousePos() => mp;

    // ray from screen coords
    vec3 p0, p1, dir;
    cam.screenCoordToWorldPos(mp, 0.0) => p0;   // camera position at that pixel
    cam.screenCoordToWorldPos(mp, 1.0)  => p1;  // 1 world unit along the ray
    (p1 - p0) @=> dir;

    // test against each star (plane y = star.y)
    for (int i; i < NUM_STARS; i++) {
        vec3 starP; stars[i].pos() => starP;
        if (Math.fabs(dir.y) < 1e-6) continue;

        ((starP.y - p0.y) / dir.y) => float t;
        if (t < 0) continue;

        (p0 + dir * t) => vec3 hitAtStarY;
        (hitAtStarY - starP) => vec3 d;
        Math.sqrt(d.x*d.x + d.y*d.y + d.z*d.z) => float dist;

        if (dist < 0.25 && arrayContains(clickedIndices, i) == 0) {
            clickedIndices << i;
            spork ~ clickFX(i);
            spork ~ clickBlip(digits[i]);
            starGlow[i].color(@(0,3,0));
            starGlow[i].sca(0.15);

            runningSum + digits[i] => runningSum;
            if (runningSum >= 10) {
                1 => runningSum;
                for (int j : clickedIndices) { starGlow[j].color(@(2,2,2)); starGlow[j].sca(0.1); }
                clickedIndices.clear();
            }
            sumText.text("Sum: " + runningSum);
            break; // one pick per click
        }
    }
    }



    for (int i; i < NUM; ++i) {
        ((GG.fc() + i) % 100) => int animatedNum;
        "" + animatedNum => string label;

        gtext[i].text(label);
        gglow[i].text(label);

        (GG.fc() + i * 5) * 0.01 => float t;
        Math.sin(t) * 0.5 + 0.5 => float a;
        Math.sin(t * 0.3) * 0.5 + 0.5 => float hue;

        float rgb[];
        hueToRGB(hue) @=> rgb;

        gglow[i].sca(0.1 + a * 0.05);
        gglow[i].color(@(
        rgb[0] * 2.5 * pulseGain,
        rgb[1] * 2.5 * pulseGain,
        rgb[2] * 2.5 * pulseGain
        ));

    }
    for (int i; i < NUM_STARS; ++i) {
        (GG.fc() + i * 8) * 0.01 => float t;
        Math.sin(t) * 0.5 + 0.5 => float a;
        Math.sin(t * 0.5) * 0.5 + 0.5 => float hue;

        float rgb[];
        hueToRGB(hue) @=> rgb;

        starGlow[i].sca(0.05 + a * 0.05); // slight pulsation
        starGlow[i].color(@(rgb[0] * 2.5, rgb[1] * 2.5, rgb[2] * 2.5));
    }

    cam.rotateY(0.3 * GG.dt());
}

// Glow flicker
fun void flickerGlow() {
    while (true) {
        for (int i; i < NUM; i++) {
            gglow[i].color(@(10,10,10));
        }
        0.5::second => now;
        for (int i; i < NUM; i++) {
            gglow[i].color(@(10,10,10));
        }
        0.5::second => now;
    }
}


// Hue to RGB conversion
fun float[] hueToRGB(float h) {
    float r, g, b;
    h * 6.0 => h;
    Math.floor(h) $ int => int i;
    h - i => float f;
    1 - f => float q;

    if (i == 0) { 1.0 => r; f => g; 0.0 => b; }
    else if (i == 1) { q => r; 1.0 => g; 0.0 => b; }
    else if (i == 2) { 0.0 => r; 1.0 => g; f => b; }
    else if (i == 3) { 0.0 => r; q => g; 1.0 => b; }
    else if (i == 4) { f => r; 0.0 => g; 1.0 => b; }
    else            { 1.0 => r; 0.0 => g; q => b; }

    [ r, g, b ] @=> float out[];
    return out;
}