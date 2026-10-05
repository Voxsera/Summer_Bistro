import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { makeLatteTexture } from './latteTexture.js';

const STEAM_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float t = uTime * 0.7 + uSeed;
    p.x += sin(uv.y * 3.2 + t) * 0.16 * uv.y;
    p.x += sin(uv.y * 7.0 - t * 1.3) * 0.04 * uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const STEAM_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uOpacity;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    float n1 = noise(vec2(vUv.x * 3.0 + uSeed, vUv.y * 2.4 - uTime * 0.45));
    float n2 = noise(vec2(vUv.x * 7.0 - uSeed, vUv.y * 5.0 - uTime * 0.8));
    float column = 1.0 - smoothstep(0.0, 0.32, abs(vUv.x - 0.5 + (n1 - 0.5) * 0.45));
    float fade = smoothstep(0.0, 0.18, vUv.y) * (1.0 - smoothstep(0.45, 1.0, vUv.y));
    float wisp = smoothstep(0.32, 0.78, n1 * 0.6 + n2 * 0.4);
    float a = column * fade * wisp * uOpacity;
    gl_FragColor = vec4(vec3(1.0, 0.98, 0.95), a * 0.6);
  }
`;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export class CupScene {
  constructor(container) {
    this.container = container;
    this.progress = 0; // driven by scroll (0 = day, 1 = night)
    this.smoothProgress = 0;
    this.intro = 0; // 0 → 1 entrance animation
    this.visible = true;
    this.mouse = new THREE.Vector2();
    this.mouseTarget = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.lookTarget = new THREE.Vector3();
    this.disposables = [];

    const { clientWidth: w, clientHeight: h } = container;

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    // scene + env
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.9;
    pmrem.dispose();
    this.envRT = envRT;
    this.scene = scene;

    this.camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);

    this.buildLights();
    this.world = new THREE.Group();
    scene.add(this.world);
    this.buildCup();
    this.buildSteam();
    this.buildBeans();
    this.buildLeaves();
    this.buildShadowCatcher();

    this.layout();

    // events
    this.onResize = this.onResize.bind(this);
    this.onPointer = this.onPointer.bind(this);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    this.io = new IntersectionObserver(([e]) => (this.visible = e.isIntersecting), { threshold: 0 });
    this.io.observe(container);

    this.tick = this.tick.bind(this);
    this.raf = requestAnimationFrame(this.tick);
  }

  track(o) {
    this.disposables.push(o);
    return o;
  }

  buildLights() {
    const s = this.scene;
    this.hemi = new THREE.HemisphereLight('#FFF1D6', '#6B3A22', 0.9);
    s.add(this.hemi);

    const key = new THREE.DirectionalLight('#FFE2B0', 2.6);
    key.position.set(3.5, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0008;
    key.shadow.radius = 6;
    s.add(key);
    this.key = key;

    const rim = new THREE.DirectionalLight('#9FD3FF', 1.4);
    rim.position.set(-4, 3, -3);
    s.add(rim);
    this.rim = rim;

    // warm "candle" that glows at night
    const candle = new THREE.PointLight('#FFB060', 0, 6, 1.6);
    candle.position.set(1.4, 1.2, 1.6);
    s.add(candle);
    this.candle = candle;

    this.dayKey = new THREE.Color('#FFE2B0');
    this.nightKey = new THREE.Color('#9FB2FF');
  }

  buildCup() {
    const cup = new THREE.Group();
    this.cup = cup;

    const ceramicBrown = this.track(
      new THREE.MeshPhysicalMaterial({ color: '#7A3E22', roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.12, side: THREE.DoubleSide })
    );
    const ceramicCream = this.track(
      new THREE.MeshPhysicalMaterial({ color: '#F7EEDF', roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.2, side: THREE.DoubleSide })
    );

    const outerPts = [
      [0, 0], [0.5, 0], [0.56, 0.03], [0.6, 0.1], [0.68, 0.24], [0.8, 0.5], [0.92, 0.85], [1.0, 1.15],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const innerPts = [
      [0, 0.12], [0.48, 0.12], [0.6, 0.3], [0.76, 0.6], [0.88, 0.95], [0.95, 1.15],
    ].map(([x, y]) => new THREE.Vector2(x, y));

    const outer = new THREE.Mesh(this.track(new THREE.LatheGeometry(outerPts, 96)), ceramicBrown);
    const inner = new THREE.Mesh(this.track(new THREE.LatheGeometry(innerPts, 96)), ceramicCream);
    outer.castShadow = true;
    outer.receiveShadow = true;

    const rim = new THREE.Mesh(this.track(new THREE.TorusGeometry(0.975, 0.028, 16, 96)), ceramicCream);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.15;

    // a cream band near the base, echoing the logo
    const band = new THREE.Mesh(this.track(new THREE.TorusGeometry(0.62, 0.022, 12, 96)), ceramicCream);
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.17;

    const handle = new THREE.Mesh(this.track(new THREE.TorusGeometry(0.3, 0.075, 24, 64, Math.PI)), ceramicBrown);
    handle.rotation.z = -Math.PI / 2;
    handle.position.set(0.78, 0.64, 0);
    handle.castShadow = true;

    // latte surface
    this.latteTex = this.track(makeLatteTexture(this.renderer));
    const latteMat = this.track(
      new THREE.MeshPhysicalMaterial({ map: this.latteTex, roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.3 })
    );
    const latte = new THREE.Mesh(this.track(new THREE.CircleGeometry(0.88, 96)), latteMat);
    latte.rotation.x = -Math.PI / 2;
    latte.position.y = 0.98;
    this.latte = latte;

    cup.add(outer, inner, rim, band, handle, latte);
    cup.position.y = 0.06;

    // saucer
    const saucerPts = [
      [0, 0], [0.9, 0], [1.2, 0.02], [1.45, 0.09], [1.62, 0.17], [1.64, 0.2], [1.58, 0.2], [1.42, 0.14], [1.15, 0.08], [0.66, 0.07], [0, 0.07],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const saucer = new THREE.Mesh(this.track(new THREE.LatheGeometry(saucerPts, 128)), ceramicCream);
    saucer.receiveShadow = true;
    saucer.castShadow = true;

    // biscoff-style cookie on the saucer
    const cookieMat = this.track(new THREE.MeshStandardMaterial({ color: '#B8722F', roughness: 0.75 }));
    const cookie = new THREE.Mesh(this.track(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 40)), cookieMat);
    cookie.position.set(1.08, 0.16, 0.62);
    cookie.rotation.set(0.12, 0.3, -0.18);
    cookie.castShadow = true;

    // little spoon
    const spoonMat = this.track(new THREE.MeshStandardMaterial({ color: '#D9D2C5', metalness: 1, roughness: 0.22 }));
    const spoon = new THREE.Group();
    const stem = new THREE.Mesh(this.track(new THREE.CylinderGeometry(0.028, 0.04, 0.9, 16)), spoonMat);
    stem.rotation.z = Math.PI / 2;
    const bowl = new THREE.Mesh(this.track(new THREE.SphereGeometry(0.12, 24, 16)), spoonMat);
    bowl.scale.set(1.4, 0.35, 1);
    bowl.position.x = 0.52;
    spoon.add(stem, bowl);
    spoon.position.set(-0.95, 0.15, 0.78);
    spoon.rotation.y = -0.65;
    spoon.traverse((o) => (o.castShadow = true));

    this.table = new THREE.Group();
    this.table.add(cup, saucer, cookie, spoon);
    this.world.add(this.table);
  }

  buildSteam() {
    this.steam = [];
    const geo = this.track(new THREE.PlaneGeometry(0.75, 2.1, 1, 32));
    geo.translate(0, 1.05, 0); // pivot at the bottom
    [-0.28, 0.05, 0.32].forEach((x, i) => {
      const mat = this.track(
        new THREE.ShaderMaterial({
          vertexShader: STEAM_VERT,
          fragmentShader: STEAM_FRAG,
          uniforms: { uTime: { value: 0 }, uSeed: { value: i * 3.7 + 1.3 }, uOpacity: { value: 1 } },
          transparent: true,
          depthWrite: false,
        })
      );
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, 1.15, 0.05 * i);
      m.renderOrder = 10;
      this.world.add(m);
      this.steam.push(m);
    });
  }

  buildBeans() {
    const geo = this.track(new THREE.SphereGeometry(0.13, 24, 16));
    geo.scale(1, 0.66, 0.52);
    const mat = this.track(new THREE.MeshPhysicalMaterial({ color: '#4A2414', roughness: 0.34, clearcoat: 0.9, clearcoatRoughness: 0.2 }));
    const count = 22;
    const beans = new THREE.InstancedMesh(geo, mat, count);
    beans.castShadow = true;

    // crease line on each bean
    const creaseGeo = this.track(new THREE.TorusGeometry(0.1, 0.012, 6, 24, Math.PI));
    creaseGeo.rotateX(Math.PI / 2);
    creaseGeo.scale(1, 1, 0.3);
    const creaseMat = this.track(new THREE.MeshBasicMaterial({ color: '#1E0D07' }));
    const creases = new THREE.InstancedMesh(creaseGeo, creaseMat, count);

    this.beanData = [];
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rnd() * 0.4;
      const radius = 2.1 + rnd() * 1.5;
      this.beanData.push({
        angle,
        radius,
        y: -0.2 + rnd() * 3.2,
        speed: 0.15 + rnd() * 0.35,
        rot: new THREE.Euler(rnd() * 6, rnd() * 6, rnd() * 6),
        spin: 0.3 + rnd() * 0.9,
        scale: 0.8 + rnd() * 0.6,
        bob: rnd() * Math.PI * 2,
      });
    }
    this.beans = beans;
    this.creases = creases;
    this.world.add(beans, creases);
    this.tmpObj = new THREE.Object3D();
  }

  buildLeaves() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.28, 0.16, 0.26, 0.6, 0, 0.86);
    shape.bezierCurveTo(-0.26, 0.6, -0.28, 0.16, 0, 0);
    const geo = this.track(new THREE.ShapeGeometry(shape, 16));
    geo.translate(0, -0.43, 0);
    const mats = ['#3F6B34', '#5B8C46', '#7FB04E'].map((c) =>
      this.track(new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, side: THREE.DoubleSide }))
    );
    this.leaves = [];
    const spots = [
      [-2.6, 2.4, -1.2], [2.8, 2.9, -1.6], [-3.1, 0.5, 0.4], [3.2, 0.9, 0.2], [-1.6, 3.4, -2.2], [1.9, -0.2, 1.8],
    ];
    spots.forEach(([x, y, z], i) => {
      const leaf = new THREE.Mesh(geo, mats[i % 3]);
      leaf.position.set(x, y, z);
      leaf.rotation.set(i * 0.7, i * 1.3, i * 0.5);
      leaf.userData = { base: leaf.position.clone(), phase: i * 1.1 };
      leaf.castShadow = true;
      this.world.add(leaf);
      this.leaves.push(leaf);
    });
  }

  buildShadowCatcher() {
    const plane = new THREE.Mesh(
      this.track(new THREE.PlaneGeometry(12, 12)),
      this.track(new THREE.ShadowMaterial({ opacity: 0.22 }))
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.002;
    plane.receiveShadow = true;
    this.world.add(plane);
  }

  layout() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.aspect = w / h;
    this.isWide = this.aspect > 1.15;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
    // place the cup to the right on wide screens, top-centre on narrow ones
    this.world.position.set(this.isWide ? 1.75 : 0, this.isWide ? -0.35 : 0.2, 0);
    this.lookY = this.isWide ? 0.3 : -1.5;
    this.baseDistance = this.isWide ? 8.4 : 11.5;
  }

  onResize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.renderer.setSize(w, h);
    this.layout();
  }

  onPointer(e) {
    this.mouseTarget.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  }

  tick() {
    this.raf = requestAnimationFrame(this.tick);
    if (!this.visible) return;

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;
    this.smoothProgress = lerp(this.smoothProgress, this.progress, 0.08);
    const p = this.smoothProgress;
    this.mouse.lerp(this.mouseTarget, 0.05);
    const intro = easeOutCubic(clamp01(this.intro));

    // camera: swings up to look into the cup mid-scroll
    const arc = Math.sin(p * Math.PI);
    const dist = this.baseDistance - arc * 1.6;
    const camY = 2.4 + arc * 3.2;
    this.camera.position.set(this.mouse.x * 0.5, camY - this.mouse.y * 0.3, dist);
    this.lookTarget.set(0, this.lookY, 0);
    this.camera.lookAt(this.lookTarget);

    // entrance + scroll motion
    const s = 0.55 + 0.45 * intro;
    this.table.scale.setScalar(s);
    this.table.position.y = (1 - intro) * -1.2 + Math.sin(t * 1.2) * 0.04;
    this.table.rotation.y = -0.5 + p * Math.PI * 1.5 + this.mouse.x * 0.25 + (1 - intro) * -1.2;
    this.table.rotation.x = this.mouse.y * 0.05;
    this.latte.rotation.z = t * 0.05;

    // steam (billboard + fade)
    this.steam.forEach((m, i) => {
      m.material.uniforms.uTime.value = t;
      m.material.uniforms.uOpacity.value = intro * (0.85 - p * 0.25);
      m.quaternion.copy(this.camera.quaternion);
      m.scale.setScalar(s);
      m.position.y = 1.15 * s + this.table.position.y;
      m.position.x = ([-0.28, 0.05, 0.32][i]) * s;
    });

    // beans orbit and scatter outward at night
    const spread = 1 + p * 0.25;
    this.beanData.forEach((b, i) => {
      const a = b.angle + t * b.speed * 0.25 + p * 1.2;
      const r = b.radius * spread * (0.3 + 0.7 * intro);
      this.tmpObj.position.set(Math.cos(a) * r, b.y + Math.sin(t * 0.9 + b.bob) * 0.18, Math.sin(a) * r - 0.6);
      this.tmpObj.rotation.set(b.rot.x + t * b.spin, b.rot.y + t * b.spin * 0.6, b.rot.z);
      this.tmpObj.scale.setScalar(b.scale * intro);
      this.tmpObj.updateMatrix();
      this.beans.setMatrixAt(i, this.tmpObj.matrix);
      this.creases.setMatrixAt(i, this.tmpObj.matrix);
    });
    this.beans.instanceMatrix.needsUpdate = true;
    this.creases.instanceMatrix.needsUpdate = true;

    this.leaves.forEach((l) => {
      const { base, phase } = l.userData;
      l.position.y = base.y + Math.sin(t * 0.8 + phase) * 0.22;
      l.position.x = base.x * (0.6 + 0.4 * intro);
      l.rotation.z += dt * 0.25;
      l.rotation.x = Math.sin(t * 0.6 + phase) * 0.6;
      l.scale.setScalar(intro);
    });

    // day → night lighting
    this.key.color.copy(this.dayKey).lerp(this.nightKey, p);
    this.key.intensity = lerp(2.6, 1.1, p);
    this.hemi.intensity = lerp(0.9, 0.35, p);
    this.rim.intensity = lerp(1.4, 2.4, p);
    this.candle.intensity = lerp(0, 9, p);
    this.scene.environmentIntensity = lerp(0.9, 0.45, p);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointer);
    this.io.disconnect();
    this.disposables.forEach((d) => d.dispose && d.dispose());
    this.envRT.dispose();
    this.beans.dispose();
    this.creases.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
