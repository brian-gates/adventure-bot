import { Character } from "./Character";
import { Item } from "../equipment/Item";
import { Stat } from "./Stats";
import { getEquipment } from "../store/selectors";
import store from "../store";
import { values } from "remeda";

export const getEquipmentStatModifier = (
  character: Character,
  stat: Stat
): number =>
  values(getEquipment(store.getState(), character.id)).reduce(
    (acc, item: Item) => acc + (item.modifiers?.[stat] ?? 0),
    0
  );
