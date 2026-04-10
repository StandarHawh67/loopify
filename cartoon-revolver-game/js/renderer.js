export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.baseWidth = canvas.width;
    this.baseHeight = canvas.height;
    this.flash = 0;
    this.shake = 0;
    this.drumSpin = 0;
    this.drumVelocity = 0;
    this.particles = [];
    this.cardText = "";
    this.cardTimer = 0;
    this.scratchOffset = 0;
  }

  addShake(amount) {
    this.shake = Math.max(this.shake, amount);
  }

  addFlash(amount) {
    this.flash = Math.max(this.flash, amount);
  }

  spinDrum(force = 1) {
    this.drumVelocity += 7 * force;
  }

  spawnBurst({ side, dramatic = false }) {
    const originX = side === "left" ? 460 : 820;
    const direction = side === "left" ? -1 : 1;
    const originY = 388;
    const count = dramatic ? 36 : 14;

    for (let index = 0; index < count; index += 1) {
      const speed = dramatic ? 100 + Math.random() * 280 : 40 + Math.random() * 120;
      this.particles.push({
        x: originX,
        y: originY,
        vx: direction * (speed * 0.35 + Math.random() * 40) + (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.65) * speed,
        size: dramatic ? 8 + Math.random() * 26 : 5 + Math.random() * 12,
        life: dramatic ? 0.95 + Math.random() * 0.65 : 0.4 + Math.random() * 0.3,
        maxLife: dramatic ? 1.4 : 0.65,
        type: dramatic && Math.random() > 0.45 ? "smoke" : "ink",
      });
    }
  }

  showCard(text) {
    this.cardText = text;
    this.cardTimer = 0.9;
  }

  update(dt) {
    this.flash = Math.max(0, this.flash - dt * 1.8);
    this.shake = Math.max(0, this.shake - dt * 28);
    this.cardTimer = Math.max(0, this.cardTimer - dt);
    this.scratchOffset += dt * 28;
    this.drumSpin += this.drumVelocity * dt;
    this.drumVelocity *= Math.pow(0.08, dt);

    this.particles = this.particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx * dt,
        y: particle.y + particle.vy * dt,
        vx: particle.vx * 0.98,
        vy: particle.vy + 140 * dt,
        life: particle.life - dt,
      }))
      .filter((particle) => particle.life > 0);
  }

  render(gameState) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.baseWidth, this.baseHeight);

    const shakeX = (Math.random() - 0.5) * this.shake;
    const shakeY = (Math.random() - 0.5) * this.shake * 0.55;

    ctx.save();
    ctx.translate(shakeX, shakeY);
    this.drawBackdrop(ctx, gameState);
    this.drawStageProps(ctx);
    this.drawMachine(ctx, gameState);
    this.drawParticles(ctx);
    this.drawActor(ctx, gameState.player);
    this.drawActor(ctx, gameState.opponent);
    if (this.cardTimer > 0) {
      this.drawCard(ctx);
    }
    ctx.restore();

    this.drawVignette(ctx);
    if (gameState.settings.grain) {
      this.drawGrain(ctx);
    }
    if (this.flash > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, this.flash)})`;
      ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);
      ctx.restore();
    }
  }

  drawBackdrop(ctx, gameState) {
    const backdrop = ctx.createLinearGradient(0, 0, 0, this.baseHeight);
    backdrop.addColorStop(0, "#f1e9d4");
    backdrop.addColorStop(0.4, "#cfc6a8");
    backdrop.addColorStop(1, "#9b8e73");
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);

    ctx.save();
    const beam = ctx.createRadialGradient(640, 210, 40, 640, 210, 300);
    beam.addColorStop(0, "rgba(255,255,255,0.56)");
    beam.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.ellipse(640, 220, 360, 210, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(20,20,20,0.16)";
    ctx.fillRect(0, 0, this.baseWidth, 44);

    ctx.fillStyle = "#191919";
    ctx.beginPath();
    ctx.moveTo(0, 560);
    ctx.quadraticCurveTo(320, 526, 640, 556);
    ctx.quadraticCurveTo(960, 584, 1280, 548);
    ctx.lineTo(1280, 720);
    ctx.lineTo(0, 720);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.07)";
    for (let index = 0; index < 8; index += 1) {
      ctx.fillRect(102 + index * 150, 0, 2, 720);
    }

    [
      [0, 0, 170, 720],
      [1110, 0, 170, 720],
    ].forEach(([x, y, width, height]) => {
      ctx.save();
      ctx.fillStyle = "#131313";
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 3;
      for (let fold = 0; fold < 6; fold += 1) {
        const offset = x + 18 + fold * 24;
        ctx.beginPath();
        ctx.moveTo(offset, y);
        ctx.lineTo(offset, y + height);
        ctx.stroke();
      }
      ctx.restore();
    });

    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.ellipse(640, 580, 430, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(640, 84);
    ctx.fillStyle = "rgba(16,16,16,0.92)";
    ctx.beginPath();
    ctx.moveTo(-110, 0);
    ctx.lineTo(110, 0);
    ctx.lineTo(88, 40);
    ctx.lineTo(-88, 40);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f3ead4";
    ctx.font = "italic 22px Georgia";
    ctx.textAlign = "center";
    ctx.fillText(`Round ${gameState.round}`, 0, 28);
    ctx.restore();
  }

  drawStageProps(ctx) {
    ctx.save();
    ctx.translate(640, 510);
    ctx.fillStyle = "#151515";
    ctx.fillRect(-230, 0, 460, 26);
    ctx.fillRect(-22, -90, 44, 90);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(-190, 4, 380, 4);
    ctx.restore();
  }

  drawMachine(ctx, gameState) {
    const { currentTurn, phase, cylinder } = gameState;
    const leftLeverPull =
      currentTurn === "player" && phase === "animating" && gameState.player.animation === "pull";
    const rightLeverPull =
      currentTurn === "opponent" &&
      phase === "animating" &&
      gameState.opponent.animation === "pull";

    ctx.save();
    ctx.translate(640, 380);

    ctx.fillStyle = "#f3ead4";
    this.roundedRect(ctx, -150, -44, 300, 150, 38);
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#141414";
    ctx.stroke();

    ctx.save();
    ctx.rotate(this.drumSpin);
    ctx.fillStyle = "#1b1b1b";
    ctx.beginPath();
    ctx.arc(0, 10, 98, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#f1e9d4";
    ctx.stroke();

    for (let slot = 0; slot < 6; slot += 1) {
      const angle = (Math.PI * 2 * slot) / 6 - Math.PI / 2;
      const x = Math.cos(angle) * 52;
      const y = Math.sin(angle) * 52 + 10;
      const spent = slot >= cylinder.remainingSlots;
      ctx.fillStyle = spent ? "rgba(240,235,220,0.22)" : "#f8f4e8";
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = "#181818";
    ctx.beginPath();
    ctx.arc(0, 10, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -118);
    ctx.lineTo(18, -86);
    ctx.lineTo(-18, -86);
    ctx.closePath();
    ctx.fill();

    this.drawLever(ctx, -188, 12, leftLeverPull ? -0.7 : -0.15);
    this.drawLever(ctx, 188, 12, rightLeverPull ? 0.7 : 0.15);

    ctx.fillStyle = "#141414";
    this.roundedRect(ctx, -112, 104, 224, 42, 18);
    ctx.fill();
    ctx.fillStyle = "#efe5cf";
    ctx.font = "700 18px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText(`Riesgo ${Math.round((1 / Math.max(1, cylinder.remainingSlots)) * 100)}%`, 0, 131);
    ctx.restore();
  }

  drawLever(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.lineCap = "round";
    ctx.strokeStyle = "#141414";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -82);
    ctx.stroke();
    ctx.fillStyle = "#f6f1e2";
    ctx.beginPath();
    ctx.arc(0, -92, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#141414";
    ctx.stroke();
    ctx.restore();
  }

  drawActor(ctx, actor) {
    const pose = actor.getPoseFrame();
    const facing = actor.side === "left" ? 1 : -1;
    const baseX = actor.side === "left" ? 320 : 960;
    const baseY = 500 + pose.bounce;

    ctx.save();
    ctx.translate(baseX, baseY);
    if (actor.impact > 0) {
      ctx.translate(
        (Math.random() - 0.5) * actor.impact * 10,
        (Math.random() - 0.5) * actor.impact * 8,
      );
    }

    ctx.scale(facing, 1);
    ctx.rotate(pose.lean);

    ctx.fillStyle = "rgba(16,16,16,0.18)";
    ctx.beginPath();
    ctx.ellipse(0, 80, 66, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    this.drawLeg(ctx, -18, 16, 34, pose);
    this.drawLeg(ctx, 18, 16, -34, pose);
    this.drawBody(ctx, pose);
    this.drawArm(ctx, 34, -78, pose.armFront, true, actor.side);
    this.drawArm(ctx, -42, -74, pose.armBack, false, actor.side);
    this.drawHead(ctx, pose, actor);
    ctx.restore();
  }

  drawBody(ctx, pose) {
    ctx.save();
    ctx.translate(0, -48);
    ctx.scale(pose.stretchX, pose.stretchY);
    ctx.fillStyle = "#101010";
    ctx.beginPath();
    ctx.moveTo(-48, -34);
    ctx.quadraticCurveTo(-58, 8, -38, 72);
    ctx.quadraticCurveTo(0, 90, 38, 72);
    ctx.quadraticCurveTo(58, 8, 48, -34);
    ctx.quadraticCurveTo(0, -70, -48, -34);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f0e6d2";
    ctx.beginPath();
    ctx.ellipse(0, -4, 24, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-18, 48, 10, 0, Math.PI * 2);
    ctx.arc(18, 48, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#101010";
    ctx.fillRect(-6, -30, 12, 42);
    ctx.restore();
  }

  drawHead(ctx, pose, actor) {
    ctx.save();
    ctx.translate(0, -168);
    ctx.rotate(pose.headTilt);
    ctx.scale(pose.stretchX, pose.stretchY);
    ctx.fillStyle = "#101010";
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f0e6d2";
    ctx.beginPath();
    ctx.arc(0, 10, 40, 0, Math.PI * 2);
    ctx.fill();

    const eyeScale = Math.max(0.08, pose.eye);
    ctx.fillStyle = "#101010";
    ctx.beginPath();
    ctx.ellipse(-14, 4, 9, 12 * eyeScale, 0, 0, Math.PI * 2);
    ctx.ellipse(14, 4, 9, 12 * eyeScale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#101010";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    const browLift = actor.expression === "fear" ? -14 : actor.expression === "shock" ? -18 : -8;
    ctx.beginPath();
    ctx.moveTo(-26, browLift);
    ctx.lineTo(-4, browLift - 4);
    ctx.moveTo(26, browLift - 4);
    ctx.lineTo(4, browLift);
    ctx.stroke();

    ctx.strokeStyle = "#101010";
    ctx.lineWidth = 5;
    ctx.beginPath();
    if (actor.expression === "fear" || actor.expression === "shock") {
      ctx.ellipse(0, 28, 16, 10 + pose.mouth * 20, 0, 0, Math.PI * 2);
    } else if (actor.expression === "smug") {
      ctx.arc(0, 26, 18, 0.1, Math.PI - 0.3, false);
    } else if (actor.expression === "dazed") {
      ctx.moveTo(-12, 32);
      ctx.lineTo(12, 24);
    } else {
      ctx.arc(0, 28, 14, 0.2, Math.PI - 0.2, false);
    }
    ctx.stroke();

    ctx.fillStyle = "#101010";
    ctx.beginPath();
    ctx.arc(-40, 0, 10, 0, Math.PI * 2);
    ctx.arc(40, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawArm(ctx, x, y, angle, towardMachine, side) {
    const reachBias = towardMachine ? (side === "left" ? 1 : -1) : side === "left" ? -1 : 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle - 0.4) * reachBias);
    ctx.strokeStyle = "#101010";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(18, 32, 34, 48, 22 * reachBias, 96);
    ctx.stroke();
    ctx.fillStyle = "#f0e6d2";
    ctx.beginPath();
    ctx.arc(22 * reachBias, 96, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#101010";
    ctx.stroke();
    ctx.restore();
  }

  drawLeg(ctx, x, y, swing, pose) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(swing * 0.004 + pose.lean * 1.8);
    ctx.strokeStyle = "#101010";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(swing * 0.2, 34, swing * 0.5, 70, swing * 0.14, 126);
    ctx.stroke();
    ctx.fillStyle = "#f0e6d2";
    ctx.beginPath();
    ctx.ellipse(swing * 0.14 + 10, 128, 24, 12, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawParticles(ctx) {
    this.particles.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      if (particle.type === "smoke") {
        ctx.fillStyle = `rgba(245, 239, 226, ${alpha * 0.42})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(16, 16, 16, ${alpha * 0.72})`;
        ctx.beginPath();
        ctx.ellipse(
          particle.x,
          particle.y,
          particle.size,
          particle.size * 0.7,
          particle.vx * 0.008,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.restore();
    });
  }

  drawCard(ctx) {
    ctx.save();
    ctx.translate(640, 178);
    const scale = 1 + (0.9 - this.cardTimer) * 0.08;
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(16,16,16,0.92)";
    this.roundedRect(ctx, -124, -32, 248, 66, 18);
    ctx.fill();
    ctx.fillStyle = "#f2ead6";
    ctx.font = "italic 700 34px Georgia";
    ctx.textAlign = "center";
    ctx.fillText(this.cardText, 0, 11);
    ctx.restore();
  }

  drawVignette(ctx) {
    const vignette = ctx.createRadialGradient(640, 360, 220, 640, 360, 720);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);
  }

  drawGrain(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.045)";
    for (let index = 0; index < 220; index += 1) {
      const x = Math.random() * this.baseWidth;
      const y = Math.random() * this.baseHeight;
      const width = Math.random() * 2.2;
      const height = Math.random() * 2.2;
      ctx.fillRect(x, y, width, height);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const scratchX = (this.scratchOffset * 11) % this.baseWidth;
    ctx.moveTo(scratchX, 0);
    ctx.lineTo(scratchX + 18, this.baseHeight);
    ctx.moveTo(this.baseWidth - scratchX * 0.7, 0);
    ctx.lineTo(this.baseWidth - scratchX * 0.7 - 14, this.baseHeight);
    ctx.stroke();
    ctx.restore();
  }

  roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
