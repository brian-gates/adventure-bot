import { Weapon } from "../equipment/Weapon";

export type Trap = {
  weapon: Weapon;
  active: boolean;
  cooldown: number;
};
