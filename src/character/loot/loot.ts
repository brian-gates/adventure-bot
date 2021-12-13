import { randomUUID } from "crypto";
import { values } from "remeda";
import { looted } from "../../store/slices/loots";
import { Character } from "../Character";
import { getCharacter } from "../getCharacter";
import store from "../../store";
import { Item } from "../../equipment/Item";
import { characterLooted } from "../../store/slices/characters";
import { selectItemsById } from "../../store/selectors";

export type LootResult = {
  id: string;
  itemsTaken: string[];
  goldTaken: number;
  looterId: string;
  targetId: string;
  timestamp: string;
};

const isLootable = (item: Item): boolean => item.lootable ?? false;

export function loot({
  looterId,
  targetId,
}: {
  looterId: string;
  targetId: string;
}): LootResult | void {
  const looter = getCharacter(looterId);
  const target = getCharacter(targetId);
  if (!looter || !target) {
    console.error(`loot failed looterId:${looterId} targetId:${targetId}`);
    return;
  }
  const loot: LootResult = {
    id: randomUUID(),
    goldTaken: target.gold,
    itemsTaken: inventoryFilter(target.inventory, isLootable),
    looterId: looter.id,
    targetId: target.id,
    timestamp: new Date().toString(),
  };

  store.dispatch(looted(loot));
  store.dispatch(characterLooted(loot));
  return loot;
}

export const inventoryFilter = (
  itemIds: string[],
  predicate: (item: Item) => boolean
): string[] =>
  selectItemsById(store.getState(), itemIds)
    .filter(predicate)
    .map((item) => item.id);

export const equipmentFilter = (
  equipment: Character["equipment"],
  predicate: (item: Item) => boolean
): Character["equipment"] =>
  selectItemsById(store.getState(), values(equipment))
    .filter(predicate)
    .reduce(
      (equipment, item) => ({
        ...equipment,
        [item.type]: item,
      }),
      {}
    );
