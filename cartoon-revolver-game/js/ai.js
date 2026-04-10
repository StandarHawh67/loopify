export class ClassicShowAI {
  chooseAction({ risk, remainingSlots, rerolls, ownHealth, enemyHealth, round }) {
    const caution = ownHealth === 1 ? 0.18 : ownHealth === 2 ? 0.26 : 0.34;

    if (rerolls > 0 && remainingSlots > 1 && risk >= caution) {
      return "respin";
    }

    if (rerolls > 0 && round >= 4 && risk >= 0.24 && Math.random() < 0.38) {
      return "respin";
    }

    if (enemyHealth === 1 && risk <= 0.28 && Math.random() < 0.45) {
      return "trigger";
    }

    if (remainingSlots <= 2 && rerolls > 0 && Math.random() < 0.65) {
      return "respin";
    }

    return "trigger";
  }
}
