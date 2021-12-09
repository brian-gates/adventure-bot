import { DefenseStat } from "../character/Stats";
import { StatusEffect } from "../statusEffects/StatusEffect";
import { Equippable } from "./equipment";

export type Weapon = Equippable & {
  type: "weapon";
  damageMax: number;
  targetDefense: DefenseStat;
  onHitEffects?: StatusEffect[];
  accuracyDescriptors: {
    missedDefinitely: string[];
    missed: string[];
    missedBarely: string[];
    hitBarely: string[];
    hit: string[];
    hitDefinitely: string[];
  };
};
