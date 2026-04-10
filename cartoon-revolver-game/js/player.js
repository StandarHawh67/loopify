export class Player {
  constructor({ id, name, side, isAI = false }) {
    this.id = id;
    this.name = name;
    this.side = side;
    this.isAI = isAI;
    this.maxHealth = 3;
    this.resetForGame();
  }

  resetForGame() {
    this.health = this.maxHealth;
    this.rerolls = 1;
    this.animation = "idle";
    this.animationTime = 0;
    this.animationLoop = true;
    this.nextAnimation = "idle";
    this.expression = "calm";
    this.blinkClock = Math.random() * 2.5;
    this.impact = 0;
  }

  resetForRound() {
    this.rerolls = 1;
    this.impact = 0;
    this.setAnimation("idle", { loop: true });
    this.expression = "calm";
  }

  setAnimation(name, { loop = false, next = "idle" } = {}) {
    this.animation = name;
    this.animationTime = 0;
    this.animationLoop = loop;
    this.nextAnimation = next;
  }

  setExpression(expression) {
    this.expression = expression;
  }

  takeHit() {
    this.health = Math.max(0, this.health - 1);
    this.impact = 1;
  }

  update(dt) {
    this.animationTime += dt;
    this.blinkClock += dt;
    this.impact = Math.max(0, this.impact - dt * 1.9);

    const nonLoopingDurations = {
      pull: 0.62,
      respin: 0.88,
      hit: 1.1,
      celebrate: 0.9,
      intro: 0.8,
      sigh: 0.6,
    };

    const duration = nonLoopingDurations[this.animation];
    if (duration && !this.animationLoop && this.animationTime >= duration) {
      this.animation = this.nextAnimation;
      this.animationTime = 0;
      this.animationLoop = true;
    }
  }

  getHeartString() {
    return "O".repeat(this.health).padEnd(this.maxHealth, "-");
  }

  getPoseFrame() {
    const poses = {
      idle: [
        { bounce: -4, lean: -0.02, headTilt: -0.07, armFront: 0.58, armBack: 0.2, eye: 1, mouth: 0.1, stretchX: 1.04, stretchY: 0.97 },
        { bounce: 0, lean: 0.03, headTilt: 0.02, armFront: 0.64, armBack: 0.16, eye: 1, mouth: 0.08, stretchX: 0.98, stretchY: 1.02 },
        { bounce: 4, lean: 0.04, headTilt: 0.05, armFront: 0.54, armBack: 0.1, eye: 0.92, mouth: 0.12, stretchX: 0.97, stretchY: 1.04 },
        { bounce: 1, lean: -0.01, headTilt: -0.03, armFront: 0.62, armBack: 0.18, eye: 1, mouth: 0.09, stretchX: 1, stretchY: 1 },
      ],
      intro: [
        { bounce: 8, lean: 0.1, headTilt: -0.12, armFront: 0.34, armBack: 0.14, eye: 1, mouth: 0.18, stretchX: 0.92, stretchY: 1.12 },
        { bounce: -3, lean: -0.03, headTilt: 0.02, armFront: 0.56, armBack: 0.24, eye: 1, mouth: 0.13, stretchX: 1.06, stretchY: 0.96 },
        { bounce: 2, lean: 0, headTilt: 0, armFront: 0.62, armBack: 0.18, eye: 1, mouth: 0.1, stretchX: 1, stretchY: 1 },
      ],
      fear: [
        { bounce: 1, lean: -0.08, headTilt: -0.12, armFront: 0.74, armBack: 0.44, eye: 1.22, mouth: 0.2, stretchX: 0.94, stretchY: 1.08 },
        { bounce: -1, lean: 0.1, headTilt: 0.1, armFront: 0.78, armBack: 0.48, eye: 1.18, mouth: 0.28, stretchX: 1.06, stretchY: 0.95 },
        { bounce: 2, lean: -0.06, headTilt: -0.08, armFront: 0.72, armBack: 0.4, eye: 1.24, mouth: 0.24, stretchX: 0.96, stretchY: 1.06 },
      ],
      pull: [
        { bounce: 0, lean: 0.02, headTilt: 0.06, armFront: 0.44, armBack: 0.26, eye: 1, mouth: 0.12, stretchX: 1.02, stretchY: 0.98 },
        { bounce: -6, lean: 0.16, headTilt: -0.04, armFront: 0.9, armBack: 0.2, eye: 0.84, mouth: 0.05, stretchX: 0.94, stretchY: 1.08 },
        { bounce: 8, lean: -0.16, headTilt: -0.18, armFront: 1.18, armBack: 0.12, eye: 1.16, mouth: 0.34, stretchX: 1.1, stretchY: 0.88 },
      ],
      respin: [
        { bounce: -2, lean: 0.02, headTilt: -0.1, armFront: 0.58, armBack: 0.34, eye: 1, mouth: 0.08, stretchX: 1, stretchY: 1 },
        { bounce: 2, lean: 0.12, headTilt: 0.2, armFront: 1.1, armBack: 0.18, eye: 0.92, mouth: 0.14, stretchX: 1.08, stretchY: 0.94 },
        { bounce: -4, lean: -0.08, headTilt: -0.2, armFront: 0.86, armBack: 0.3, eye: 1, mouth: 0.18, stretchX: 0.92, stretchY: 1.08 },
        { bounce: 0, lean: 0.03, headTilt: 0.03, armFront: 0.62, armBack: 0.24, eye: 1, mouth: 0.08, stretchX: 1, stretchY: 1 },
      ],
      hit: [
        { bounce: 14, lean: -0.2, headTilt: -0.26, armFront: 1.24, armBack: 0.54, eye: 1.36, mouth: 0.42, stretchX: 1.16, stretchY: 0.82 },
        { bounce: -12, lean: 0.22, headTilt: 0.22, armFront: 0.66, armBack: 0.34, eye: 0.76, mouth: 0.18, stretchX: 0.88, stretchY: 1.18 },
        { bounce: 8, lean: -0.08, headTilt: -0.14, armFront: 0.74, armBack: 0.28, eye: 0.82, mouth: 0.16, stretchX: 1.08, stretchY: 0.92 },
      ],
      celebrate: [
        { bounce: 6, lean: 0.04, headTilt: 0.1, armFront: 0.28, armBack: 0.86, eye: 1, mouth: 0.28, stretchX: 0.96, stretchY: 1.06 },
        { bounce: -2, lean: -0.04, headTilt: -0.12, armFront: 0.22, armBack: 1.06, eye: 1, mouth: 0.36, stretchX: 1.08, stretchY: 0.94 },
        { bounce: 4, lean: 0.02, headTilt: 0.08, armFront: 0.3, armBack: 0.92, eye: 1, mouth: 0.32, stretchX: 1, stretchY: 1 },
      ],
      sigh: [
        { bounce: 0, lean: -0.04, headTilt: -0.08, armFront: 0.44, armBack: 0.16, eye: 0.9, mouth: 0.06, stretchX: 1.04, stretchY: 0.96 },
        { bounce: 3, lean: 0.02, headTilt: 0.02, armFront: 0.48, armBack: 0.14, eye: 1, mouth: 0.08, stretchX: 0.98, stretchY: 1.02 },
      ],
    };

    const animationFrames = poses[this.animation] ?? poses.idle;
    const fpsMap = {
      idle: 4,
      intro: 4,
      fear: 6,
      pull: 4,
      respin: 7,
      hit: 5,
      celebrate: 6,
      sigh: 4,
    };

    const fps = fpsMap[this.animation] ?? 5;
    const rawIndex = Math.floor(this.animationTime * fps);
    const index = this.animationLoop
      ? rawIndex % animationFrames.length
      : Math.min(animationFrames.length - 1, rawIndex);

    const blinkWindow = this.blinkClock % 3.7;
    const blinkFactor = blinkWindow > 3.52 ? 0.12 : 1;
    return {
      ...animationFrames[index],
      eye: animationFrames[index].eye * blinkFactor,
    };
  }
}
