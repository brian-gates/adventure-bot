import { d20 } from "../utils/dice";
import { AttackResult } from "./AttackResult";
import store from "../store";
import { characterAttacked } from "../store/slices/characters";
import { getCharacter, getCharacterStatModified } from "../character";

export const characterAttack = (
  attackerId: string,
  defenderId: string
): AttackResult | { outcome: "targetNotFound" } => {
  const attacker = getCharacter(attackerId);
  const defender = getCharacter(defenderId);
  if (!attacker || !defender)
    return {
      outcome: "targetNotFound",
    };

  const attackRoll = d20();
  const attackBonus = getCharacterStatModified(attacker, "attackBonus");
  const damageBonus = getCharacterStatModified(attacker, "damageBonus");
  const targetDefense = attacker.equipment.weapon?.targetDefense ?? "ac";
  const defense = getCharacterStatModified(defender, targetDefense);
  const damageRoll = Math.ceil(
    Math.random() * getCharacterStatModified(attacker, "damageMax")
  );
  const monsterDamageRoll = defender.isMonster
    ? Math.ceil(
        Math.random() * getCharacterStatModified(attacker, "monsterDamageMax")
      )
    : 0;

  const totalDamage = damageRoll + monsterDamageRoll + damageBonus;

  const result: AttackResult = {
    outcome: attackRoll + attackBonus >= defense ? "hit" : "miss",
    defense,
    targetDefense,
    attackRoll,
    attackBonus,
    totalDamage,
    damageRoll,
    monsterDamageRoll,
    attackerId: attacker.id,
    defenderId: defender.id,
  };
  store.dispatch(characterAttacked(result));
  return result;
};
