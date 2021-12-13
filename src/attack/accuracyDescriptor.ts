import { mentionCharacter } from "../character/mentionCharacter";
import { Weapon } from "../equipment/Weapon";
import { randomArrayElement } from "../monster/randomArrayElement";
import store from "../store";
import { selectCharacterById, getEquipment } from "../store/selectors";
import { AttackResult } from "./AttackResult";

export function accuracyDescriptor(result: AttackResult): string {
  const accuracy = result.attackRoll + result.attackBonus - result.defense;
  const attacker = selectCharacterById(store.getState(), result.attackerId);
  const defender = selectCharacterById(store.getState(), result.defenderId);
  const { weapon } = getEquipment(store.getState(), attacker.id);

  const descriptor = getWeaponAccuracyDescriptor(
    accuracy,
    weapon?.accuracyDescriptors
  );

  return descriptor
    .replace(/<@attacker>/g, mentionCharacter(attacker))
    .replace(/<@defender>/g, mentionCharacter(defender));
}

const defaultAccuracyDescriptors: Weapon["accuracyDescriptors"] = {
  hitDefinitely: ["<@attacker> strikes <@defender> true"],
  hitBarely: ["<@attacker> barely hits <@defender>"],
  hit: ["<@attacker> hits <@defender>"],
  missedBarely: ["<@attacker> barely misses <@defender>"],
  missed: ["<@attacker> misses <@defender>"],
  missedDefinitely: ["<@attacker> misses <@defender> utterly"],
};

function getWeaponAccuracyDescriptor(
  accuracy: number,
  accuracyDescriptors: Weapon["accuracyDescriptors"] = defaultAccuracyDescriptors
): string {
  let descriptors;
  switch (true) {
    case accuracy >= 5:
      descriptors = accuracyDescriptors.hitDefinitely;
      break;
    case accuracy >= 1:
      descriptors = accuracyDescriptors.hit;
      break;
    case accuracy === 0:
      descriptors = accuracyDescriptors.hitBarely;
      break;
    case accuracy <= 1:
      descriptors = accuracyDescriptors.missedBarely;
      break;
    case accuracy <= 2:
      descriptors = accuracyDescriptors.missed;
      break;
    default:
    case accuracy < 5:
      descriptors = accuracyDescriptors.missedDefinitely;
      break;
  }
  return randomArrayElement(descriptors);
}
