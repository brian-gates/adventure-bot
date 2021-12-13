import { d20 } from "../utils/dice";
import { getCharacter } from "../character/getCharacter";
import { AttackResult } from "./AttackResult";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { adjustHP } from "../character/adjustHP";
import store from "../store";
import { addCharacterQuestProgress } from "../store/slices/characters";
import { getEquipment } from "../store/selectors";

// TODO: decouple attack calculations from state side effects
export const attack = (
  attackerId: string,
  defenderId: string
): AttackResult | void => {
  const attacker = getCharacter(attackerId);
  const defender = getCharacter(defenderId);
  if (!attacker || !defender) return;

  const attackRoll = d20();
  const attackBonus = getCharacterStatModified(attacker, "attackBonus");
  const damageBonus = getCharacterStatModified(attacker, "damageBonus");
  const { weapon } = getEquipment(store.getState(), attacker.id);
  const targetDefense = weapon?.targetDefense ?? "ac";
  const defense = defender[targetDefense];
  const damageRoll = Math.ceil(
    Math.random() * getCharacterStatModified(attacker, "damageMax")
  );
  const monsterDamageRoll = defender.isMonster
    ? Math.ceil(
        Math.random() * getCharacterStatModified(attacker, "monsterDamageMax")
      )
    : 0;

  const outcome = attackRoll + attackBonus >= defense ? "hit" : "miss";
  const totalDamage = damageRoll + monsterDamageRoll + damageBonus;
  if (attackRoll + attackBonus >= getCharacterStatModified(defender, "ac")) {
    adjustHP(defender.id, -totalDamage);
    if (defender.hp - totalDamage > 0)
      store.dispatch(
        addCharacterQuestProgress({
          characterId: defenderId,
          questId: "survivor",
          amount: totalDamage,
        })
      );
  }

  return {
    outcome,
    attackRoll,
    totalDamage,
    damageRoll,
    monsterDamageRoll,
    attackerId,
    defenderId,
    attackBonus,
    defense,
    targetDefense,
  };
};
