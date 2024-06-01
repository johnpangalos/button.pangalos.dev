import { opacities } from "./opacties";
var smokeSpriteSize = 20;

export type Color = [r: number, g: number, b: number];
function floatInRange(start: number, end: number) {
  return start + Math.random() * (end - start);
}

function makeSmokeSprite(color?: Color) {
  color = color || [24, 46.8, 48.2];
  const smokeSprite = document.createElement("canvas");
  const ctx = smokeSprite.getContext("2d");
  const data = ctx?.createImageData(smokeSpriteSize, smokeSpriteSize);

  if (data === undefined) throw new Error("No data, no data! ahhh!");

  const d = data.data;

  for (var i = 0; i < d.length; i += 4) {
    d[i] = color[0];
    d[i + 1] = color[1];
    d[i + 2] = color[2];
    d[i + 3] = opacities[i / 4];
  }

  smokeSprite.width = smokeSpriteSize;
  smokeSprite.height = smokeSpriteSize;

  ctx?.putImageData(data, 0, 0);

  return smokeSprite;
}

type CreateParticleOptions = {
  minVx?: number;
  maxVx?: number;
  minVy?: number;
  maxVy?: number;
  minScale?: number;
  maxScale?: number;
  minLifetime?: number;
  maxLifetime?: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  startvy: number;
  scale: number;
  lifetime: number;
  age: number;
  finalScale: number;
  vy: number;
  sprite: HTMLCanvasElement;
};

function createParticle(
  x: number,
  y: number,
  sprite: HTMLCanvasElement,
  options?: CreateParticleOptions,
): Particle {
  options = options || {};
  const startvy = floatInRange(
    options.minVy || -4 / 10,
    options.maxVy || -1 / 10,
  );
  const scale = floatInRange(options.minScale || 0, options.maxScale || 0.5);
  return {
    x: x,
    y: y,
    vx: floatInRange(options.minVx || -4 / 100, options.maxVx || 4 / 100),
    startvy,
    scale,
    lifetime: floatInRange(
      options.minLifetime || 2000,
      options.maxLifetime || 8000,
    ),
    age: 0,
    finalScale: floatInRange(
      options.minScale || 25 + scale,
      options.maxScale || 30 + scale,
    ),
    vy: startvy,
    sprite,
  };
}

function updateParticle(particle: Particle, deltatime: number) {
  particle.x += particle.vx * deltatime;
  particle.y += particle.vy * deltatime;
  var frac = Math.sqrt(particle.age / particle.lifetime);
  particle.vy = (1 - frac) * particle.startvy;
  particle.age += deltatime;
  particle.scale = frac * particle.finalScale;
}

function drawParticle(
  particle: Particle,
  smokeParticleImage: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
) {
  context.globalAlpha =
    (1 - Math.abs(1 - (2 * particle.age) / particle.lifetime)) / 8;
  var off = (particle.scale * smokeSpriteSize) / 2;
  var xmin = particle.x - off;
  var xmax = xmin + off * 2;
  var ymin = particle.y - off;
  var ymax = ymin + off * 2;

  context.drawImage(smokeParticleImage, xmin, ymin, xmax - xmin, ymax - ymin);
}

export function SmokeMachine(context: CanvasRenderingContext2D) {
  let particles: Particle[] = [];
  let preDrawCallback: (...args: unknown[]) => void = function () {};

  function updateAndDrawParticles(deltatime: number) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    particles.forEach(function (p) {
      updateParticle(p, deltatime);
    });
    particles = particles.filter(function (p) {
      return p.age < p.lifetime;
    });

    preDrawCallback(deltatime, particles);
    particles.forEach(function (p) {
      drawParticle(p, p.sprite, context);
    });
  }

  let running = false;
  let lastframe = performance.now();

  const genFrameFunction = () => (time: number) => {
    if (!running) return;
    var dt = time - lastframe;
    lastframe = time;

    updateAndDrawParticles(dt);
    window.requestAnimationFrame(genFrameFunction());
  };

  return {
    step: function step(dt: number) {
      dt = dt || 16;
      updateAndDrawParticles(dt);
    },
    start: function start() {
      running = true;
      lastframe = performance.now();
      window.requestAnimationFrame(genFrameFunction());
    },
    setPreDrawCallback: function (f: () => void) {
      preDrawCallback = f;
    },
    stop: function stop() {
      running = false;
    },
    addSmoke: function (
      x: number,
      y: number,
      numParticles: number,
      color: Color,
      options?: CreateParticleOptions,
    ) {
      const smokeParticleImage = makeSmokeSprite(color);

      numParticles = numParticles || 10;
      if (numParticles < 1)
        return (
          Math.random() <= numParticles &&
          particles.push(createParticle(x, y, smokeParticleImage, options))
        );
      for (var i = 0; i < numParticles; i++)
        particles.push(createParticle(x, y, smokeParticleImage, options));
    },
  };
}
