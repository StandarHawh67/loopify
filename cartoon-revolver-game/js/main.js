import { Game } from "./game.js";

const refs = {
  canvas: document.getElementById("game-canvas"),
  menuScreen: document.getElementById("menu-screen"),
  optionsScreen: document.getElementById("options-screen"),
  gameoverScreen: document.getElementById("gameover-screen"),
  exitScreen: document.getElementById("exit-screen"),
  startButton: document.getElementById("start-button"),
  optionsButton: document.getElementById("options-button"),
  exitButton: document.getElementById("exit-button"),
  optionsBackButton: document.getElementById("options-back-button"),
  retryButton: document.getElementById("retry-button"),
  gameoverMenuButton: document.getElementById("gameover-menu-button"),
  exitReturnButton: document.getElementById("exit-return-button"),
  exitCloseButton: document.getElementById("exit-close-button"),
  triggerButton: document.getElementById("trigger-button"),
  respinButton: document.getElementById("respin-button"),
  menuButton: document.getElementById("menu-button"),
  musicToggle: document.getElementById("music-toggle"),
  sfxToggle: document.getElementById("sfx-toggle"),
  shakeToggle: document.getElementById("shake-toggle"),
  grainToggle: document.getElementById("grain-toggle"),
  roundValue: document.getElementById("round-value"),
  turnValue: document.getElementById("turn-value"),
  riskValue: document.getElementById("risk-value"),
  scoreValue: document.getElementById("score-value"),
  bestScoreValue: document.getElementById("best-score-value"),
  playerHearts: document.getElementById("player-hearts"),
  opponentHearts: document.getElementById("opponent-hearts"),
  messageLabel: document.getElementById("message-label"),
  gameoverTitle: document.getElementById("gameover-title"),
  gameoverSummary: document.getElementById("gameover-summary"),
};

const game = new Game(refs);
game.start();
