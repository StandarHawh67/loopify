import { Player } from "./player.js";
import { ClassicShowAI } from "./ai.js";
import { Renderer } from "./renderer.js";
import { SoundEngine } from "./sound.js";

export class Game {
  constructor(refs) {
    this.refs = refs;
    this.player = new Player({ id: "player", name: "Blinky", side: "left" });
    this.opponent = new Player({
      id: "opponent",
      name: "Crooner Bot",
      side: "right",
      isAI: true,
    });
    this.ai = new ClassicShowAI();
    this.renderer = new Renderer(refs.canvas);
    this.sound = new SoundEngine();

    this.settings = {
      music: true,
      sfx: true,
      shake: true,
      grain: true,
    };

    this.state = this.createMenuState();
    this.events = [];
    this.lastFrame = 0;
    this.bindUI();
  }

  createMenuState() {
    return {
      screen: "menu",
      phase: "menu",
      round: 1,
      score: 0,
      bestScore: this.readBestScore(),
      currentTurn: "player",
      cylinder: {
        totalSlots: 6,
        remainingSlots: 6,
        dangerIndex: 0,
      },
      message: "Un teatro de tension, tinta y mala suerte.",
    };
  }

  bindUI() {
    const clickWithAudio = (handler) => async () => {
      await this.sound.resumeFromGesture();
      this.sound.playMenuTap();
      handler();
    };

    this.refs.startButton.addEventListener("click", clickWithAudio(() => this.startGame()));
    this.refs.optionsButton.addEventListener("click", clickWithAudio(() => this.showScreen("options")));
    this.refs.exitButton.addEventListener("click", clickWithAudio(() => this.showScreen("exit")));
    this.refs.optionsBackButton.addEventListener("click", clickWithAudio(() => this.showScreen("menu")));
    this.refs.retryButton.addEventListener("click", clickWithAudio(() => this.startGame()));
    this.refs.gameoverMenuButton.addEventListener("click", clickWithAudio(() => this.returnToMenu()));
    this.refs.exitReturnButton.addEventListener("click", clickWithAudio(() => this.showScreen("menu")));
    this.refs.exitCloseButton.addEventListener("click", async () => {
      await this.sound.resumeFromGesture();
      window.close();
    });

    this.refs.triggerButton.addEventListener("click", async () => {
      await this.sound.resumeFromGesture();
      this.handlePlayerTrigger();
    });

    this.refs.respinButton.addEventListener("click", async () => {
      await this.sound.resumeFromGesture();
      this.handlePlayerRespin();
    });

    this.refs.menuButton.addEventListener("click", clickWithAudio(() => this.returnToMenu()));

    this.refs.musicToggle.addEventListener("click", clickWithAudio(() => this.toggleSetting("music")));
    this.refs.sfxToggle.addEventListener("click", clickWithAudio(() => this.toggleSetting("sfx")));
    this.refs.shakeToggle.addEventListener("click", clickWithAudio(() => this.toggleSetting("shake")));
    this.refs.grainToggle.addEventListener("click", clickWithAudio(() => this.toggleSetting("grain")));

    window.addEventListener("keydown", async (event) => {
      if (["Space", "KeyR", "Enter", "Escape"].includes(event.code)) {
        event.preventDefault();
      }

      if (event.repeat) {
        return;
      }

      if (["Space", "KeyR", "Enter"].includes(event.code)) {
        await this.sound.resumeFromGesture();
      }

      if (event.code === "Enter" && this.state.screen === "menu") {
        this.startGame();
      }

      if (event.code === "Escape") {
        if (this.state.screen === "playing") {
          this.returnToMenu();
        } else if (this.state.screen === "options" || this.state.screen === "exit") {
          this.showScreen("menu");
        }
      }

      if (this.state.screen !== "playing") {
        return;
      }

      if (event.code === "Space") {
        this.handlePlayerTrigger();
      }

      if (event.code === "KeyR") {
        this.handlePlayerRespin();
      }
    });
  }

  start() {
    this.updateOverlayButtons();
    this.syncHud();
    this.showScreen("menu");
    window.requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  loop(timestamp) {
    if (!this.lastFrame) {
      this.lastFrame = timestamp;
    }

    const dt = Math.min(0.033, (timestamp - this.lastFrame) / 1000);
    this.lastFrame = timestamp;
    this.processEvents(timestamp);
    this.player.update(dt);
    this.opponent.update(dt);
    this.renderer.update(dt);
    this.syncHud();
    this.renderer.render({
      ...this.state,
      settings: this.settings,
      player: this.player,
      opponent: this.opponent,
    });
    window.requestAnimationFrame((nextTimestamp) => this.loop(nextTimestamp));
  }

  processEvents(timestamp) {
    const ready = this.events.filter((event) => event.at <= timestamp);
    this.events = this.events.filter((event) => event.at > timestamp);
    ready.forEach((event) => event.action());
  }

  schedule(delay, action) {
    this.events.push({
      at: performance.now() + delay,
      action,
    });
  }

  showScreen(screen) {
    this.state.screen = screen;
    const overlays = {
      menu: this.refs.menuScreen,
      options: this.refs.optionsScreen,
      gameover: this.refs.gameoverScreen,
      exit: this.refs.exitScreen,
    };

    Object.values(overlays).forEach((overlay) => overlay.classList.remove("overlay--active"));

    if (screen !== "playing") {
      overlays[screen]?.classList.add("overlay--active");
    }

    this.syncControls();
  }

  startGame() {
    this.events = [];
    this.player.resetForGame();
    this.opponent.resetForGame();
    this.state = {
      screen: "playing",
      phase: "round-intro",
      round: 1,
      score: 0,
      bestScore: this.readBestScore(),
      currentTurn: "player",
      cylinder: {
        totalSlots: 6,
        remainingSlots: 6,
        dangerIndex: 0,
      },
      message: "Se abre el telon. La maquina decide a quien pone a prueba.",
    };
    this.showScreen("playing");
    this.beginRound("player");
  }

  returnToMenu() {
    this.events = [];
    this.state = {
      ...this.createMenuState(),
      message: "El publico aplaude mientras el telon vuelve a subir.",
    };
    this.player.resetForGame();
    this.opponent.resetForGame();
    this.showScreen("menu");
  }

  beginRound(startingTurn) {
    this.player.resetForRound();
    this.opponent.resetForRound();
    this.state.phase = "round-intro";
    this.state.currentTurn = startingTurn;
    this.state.cylinder = {
      totalSlots: 6,
      remainingSlots: 6,
      dangerIndex: this.randomInt(0, 5),
    };
    this.state.message = `Ronda ${this.state.round}. El Fortuna-o-Matic vuelve a girar.`;
    this.player.setAnimation("intro", { next: "idle" });
    this.opponent.setAnimation("intro", { next: "idle" });
    this.player.setExpression("calm");
    this.opponent.setExpression("calm");
    this.sound.playRoundStart();
    this.renderer.spinDrum(1.5);
    this.renderer.showCard(`Round ${this.state.round}`);
    if (this.settings.shake) {
      this.renderer.addShake(5);
    }

    this.schedule(950, () => this.beginTurn());
  }

  beginTurn() {
    if (this.state.screen !== "playing") {
      return;
    }

    this.state.phase = "await-action";
    const active = this.getCurrentActor();
    const other = this.getOtherActor();

    active.setAnimation("fear", { loop: true });
    active.setExpression("fear");
    other.setAnimation("idle", { loop: true });
    other.setExpression(other.health === 1 ? "smug" : "calm");

    this.state.message = `${active.name} respira hondo. Riesgo actual: 1 entre ${this.state.cylinder.remainingSlots}.`;
    this.syncControls();

    if (active.isAI) {
      this.schedule(850 + Math.random() * 420, () => this.handleAITurn());
    }
  }

  handleAITurn() {
    if (this.state.screen !== "playing" || this.state.phase !== "await-action") {
      return;
    }

    const action = this.ai.chooseAction({
      risk: 1 / this.state.cylinder.remainingSlots,
      remainingSlots: this.state.cylinder.remainingSlots,
      rerolls: this.opponent.rerolls,
      ownHealth: this.opponent.health,
      enemyHealth: this.player.health,
      round: this.state.round,
    });

    if (action === "respin") {
      this.executeRespin(this.opponent);
      return;
    }

    this.executeTrigger(this.opponent);
  }

  handlePlayerTrigger() {
    if (this.canPlayerAct()) {
      this.executeTrigger(this.player);
    }
  }

  handlePlayerRespin() {
    if (this.canPlayerAct() && this.player.rerolls > 0) {
      this.executeRespin(this.player);
    }
  }

  canPlayerAct() {
    return (
      this.state.screen === "playing" &&
      this.state.phase === "await-action" &&
      this.state.currentTurn === "player"
    );
  }

  executeRespin(actor) {
    this.state.phase = "animating";
    actor.rerolls -= 1;
    actor.setAnimation("respin", { next: "idle" });
    actor.setExpression("smug");
    this.getOtherActor(actor.id).setExpression("fear");
    this.state.message = `${actor.name} le da otra vuelta al tambor para tentar a la suerte.`;
    this.sound.playSpin();
    this.renderer.spinDrum(2.2);
    if (this.settings.shake) {
      this.renderer.addShake(7);
    }

    this.schedule(820, () => {
      this.state.cylinder.dangerIndex = this.randomInt(0, this.state.cylinder.remainingSlots - 1);
      this.passTurn();
    });
    this.syncControls();
  }

  executeTrigger(actor) {
    this.state.phase = "animating";
    actor.setAnimation("pull", { next: "idle" });
    actor.setExpression("shock");
    this.getOtherActor(actor.id).setExpression("fear");
    this.state.message = `${actor.name} baja la palanca y todo el escenario contiene la respiracion.`;
    this.sound.playTriggerPull();
    if (this.settings.shake) {
      this.renderer.addShake(5);
    }

    this.schedule(540, () => this.resolveTrigger(actor));
    this.syncControls();
  }

  resolveTrigger(actor) {
    const firedDanger = this.state.cylinder.dangerIndex === 0;
    const other = this.getOtherActor(actor.id);

    if (firedDanger) {
      actor.takeHit();
      actor.setAnimation("hit", { next: "idle" });
      actor.setExpression("dazed");
      other.setAnimation("celebrate", { next: "idle" });
      other.setExpression("smug");
      this.state.message = `BANG de tinta! ${actor.name} pierde una vida entre humo y caricatura.`;
      this.sound.playBlast();
      this.renderer.addFlash(0.92);
      this.renderer.spawnBurst({ side: actor.side, dramatic: true });
      this.renderer.showCard("BANG!");
      if (this.settings.shake) {
        this.renderer.addShake(22);
      }

      if (actor.id === "opponent") {
        this.state.score += 180 + this.state.round * 35;
      } else {
        this.state.score = Math.max(0, this.state.score - 40);
      }

      this.schedule(1320, () => {
        if (actor.health <= 0) {
          this.finishGame(actor.id === "player" ? "Crooner Bot" : "Blinky");
          return;
        }

        this.state.round += 1;
        this.beginRound(actor.id === "player" ? "opponent" : "player");
      });
      return;
    }

    this.state.cylinder.remainingSlots -= 1;
    this.state.cylinder.dangerIndex -= 1;
    actor.setAnimation("sigh", { next: "idle" });
    actor.setExpression("calm");
    other.setExpression("fear");
    this.state.message = "Click... solo un susto. La probabilidad empeora y el publico se inclina hacia delante.";
    this.sound.playBlankShot();
    this.sound.playBoing();
    this.renderer.spawnBurst({ side: actor.side, dramatic: false });
    this.renderer.showCard("Click!");
    if (this.settings.shake) {
      this.renderer.addShake(8);
    }

    if (actor.id === "player") {
      this.state.score += 30;
    }

    this.schedule(760, () => this.passTurn());
  }

  passTurn() {
    this.state.currentTurn = this.state.currentTurn === "player" ? "opponent" : "player";
    this.beginTurn();
  }

  finishGame(winnerName) {
    this.state.phase = "gameover";
    const newBest = Math.max(this.state.bestScore, this.state.score);
    this.state.bestScore = newBest;
    this.writeBestScore(newBest);
    this.refs.gameoverTitle.textContent =
      winnerName === "Blinky" ? "Victoria del artista" : "Game Over";
    this.refs.gameoverSummary.textContent = `${winnerName} se lleva el aplauso final. Puntuacion: ${this.state.score}.`;
    this.sound.playGameOver();
    this.showScreen("gameover");
  }

  toggleSetting(name) {
    this.settings[name] = !this.settings[name];
    this.sound.setOptions(this.settings);
    this.updateOverlayButtons();
  }

  updateOverlayButtons() {
    this.refs.musicToggle.textContent = `Musica: ${this.settings.music ? "ON" : "OFF"}`;
    this.refs.sfxToggle.textContent = `Efectos: ${this.settings.sfx ? "ON" : "OFF"}`;
    this.refs.shakeToggle.textContent = `Temblor: ${this.settings.shake ? "ON" : "OFF"}`;
    this.refs.grainToggle.textContent = `Grano: ${this.settings.grain ? "ON" : "OFF"}`;
  }

  syncHud() {
    this.refs.roundValue.textContent = this.state.round;
    this.refs.turnValue.textContent =
      this.state.currentTurn === "player" ? "Blinky" : "Crooner Bot";
    this.refs.riskValue.textContent = `1 / ${Math.max(1, this.state.cylinder.remainingSlots)}`;
    this.refs.scoreValue.textContent = this.state.score;
    this.refs.bestScoreValue.textContent = this.state.bestScore;
    this.refs.playerHearts.textContent = this.player.getHeartString();
    this.refs.opponentHearts.textContent = this.opponent.getHeartString();
    this.refs.messageLabel.textContent = this.state.message;
    this.syncControls();
  }

  syncControls() {
    const playerTurn = this.canPlayerAct();
    const playing = this.state.screen === "playing";
    this.refs.triggerButton.disabled = !(playing && playerTurn);
    this.refs.respinButton.disabled = !(playing && playerTurn && this.player.rerolls > 0);
    this.refs.respinButton.textContent = `Re-girar tambor [R] (${this.player.rerolls})`;
    this.refs.menuButton.disabled = !playing;
  }

  getCurrentActor() {
    return this.state.currentTurn === "player" ? this.player : this.opponent;
  }

  getOtherActor(actorId = this.state.currentTurn) {
    return actorId === "player" ? this.opponent : this.player;
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  readBestScore() {
    try {
      return Number(window.localStorage.getItem("lucky-drum-best-score") ?? 0);
    } catch {
      return 0;
    }
  }

  writeBestScore(score) {
    try {
      window.localStorage.setItem("lucky-drum-best-score", String(score));
    } catch {
      // El juego sigue funcionando aunque el navegador no permita guardar datos.
    }
  }
}
