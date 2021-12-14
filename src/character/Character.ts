import { Equippable } from "../equipment/equipment";
import { Quest } from "../quest/Quest";
import { QuestId } from "../quest/quests";
import { StatusEffect } from "../statusEffects/StatusEffect";
import { Stats } from "./Stats";

export type Character = Stats & {
  id: string;
  name: string;
  profile: string;
  asset?: [string, string, string];
  hp: number;

  inventory: string[];
  equipment: Partial<Record<Equippable["type"], string>>;

  cooldowns: {
    attack?: string;
    adventure?: string;
    heal?: string;
    renew?: string;
  };
  statusEffects?: StatusEffect[];
  quests: {
    [id in QuestId]?: Quest;
  };

  xp: number;
  gold: number;
  xpValue: number;
  isMonster?: boolean;
};
