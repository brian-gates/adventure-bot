import { Item } from "./Item";
import { Weapon } from "./Weapon";

export const equipSlots = [
  "weapon",
  "armor",
  "shield",
  "hat",
  "amulet",
  "ring",
] as const;

export type Equippable = Item & {
  equippable: true;
  type: typeof equipSlots[number];
};
export type Tradeable = Item & { tradeable: true };

export type Armor = Equippable & {
  type: "armor";
};
export type Shield = Equippable & {
  type: "shield";
};
export type Hat = Equippable & {
  type: "hat";
};
export type Amulet = Equippable & {
  type: "amulet";
};
export type Ring = Equippable & {
  type: "ring";
};

export type Equipment = {
  weapon?: Weapon;
  armor?: Armor;
  shield?: Shield;
  hat?: Hat;
  amulet?: Amulet;
  ring?: Ring;
};

export const isHat = (item: Item): item is Hat => item.type === "hat";
export const isAmulet = (item: Item): item is Amulet => item.type === "amulet";
export const isArmor = (item: Item): item is Armor => item.type === "armor";
export const isShield = (item: Item): item is Shield => item.type === "shield";
export const isWeapon = (item: Item): item is Weapon => item.type === "weapon";
export const isEquippable = (item: Item): item is Equippable =>
  item.equippable &&
  equipSlots.find((slot) => slot === item.type) !== undefined;
export const isTradeable = (item: Item): item is Tradeable =>
  item.tradeable ?? false;
