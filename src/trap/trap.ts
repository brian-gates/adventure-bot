import { Weapon } from "../equipment/equipment";

export type Trap = {
  weapon: Weapon;
  active: boolean;
  cooldown: number;
};
