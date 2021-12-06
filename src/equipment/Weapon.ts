import { DefenseStat } from "../character/Stats";
import { Equippable, OnHitEffect } from "./equipment";

export type Weapon = Equippable & {
  type: "weapon";
  damageMax: number;
  targetDefense: DefenseStat;
  onHitEffects?: OnHitEffect[];
  accuracyDescriptors: {
    missedDefinitely: string[];
    missed: string[];
    missedBarely: string[];
    hitBarely: string[];
    hit: string[];
    hitDefinitely: string[];
  };
};
