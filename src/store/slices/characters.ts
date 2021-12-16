import { Character } from "../../character/Character";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestId } from "../../quest/quests";
import { getCharacterStatModified } from "../../character/getCharacterStatModified";
import { Item } from "equipment/Item";
import { equipmentFilter, LootResult } from "../../character/loot/loot";
import { Monster } from "../../monster/Monster";
import { isStatusEffectExpired } from "../../statusEffects/isStatusEffectExpired";

export type CharacterState = Omit<Character, "inventory"> & {
  inventory: string[];
};

const charactersById: Record<string, CharacterState> = {};
const itemsById: Record<string, Item> = {};
const roamingMonsters: string[] = [];

const characterSlice = createSlice({
  name: "characters",
  initialState: {
    charactersById,
    itemsById,
    roamingMonsters,
    isHeavyCrownInPlay: false,
  },
  reducers: {
    updateCharacter(state, action: PayloadAction<Character>) {
      const character = action.payload;

      character.inventory.forEach((item) => {
        state.itemsById[item.id] = item;
      });

      Object.assign(state.charactersById[character.id], {
        ...character,
        inventory: character.inventory.map((item) => item.id),
        statusEffects:
          character.statusEffects?.filter(
            (effect) => !isStatusEffectExpired(effect)
          ) ?? [],
      });
    },

    monsterCreated(state, action: PayloadAction<Monster>) {
      const monster = action.payload;
      Object.assign(state.charactersById[monster.id], {
        ...monster,
        inventory: monster.inventory.map((item) => item.id),
      });
      state.roamingMonsters.push(monster.id);
    },

    characterLooted(state, action: PayloadAction<LootResult>) {
      const { targetId, looterId, itemsTaken, goldTaken } = action.payload;
      const looter = state.charactersById[looterId];
      looter.gold += goldTaken;
      looter.inventory = [
        ...looter.inventory,
        ...itemsTaken.map((item) => item.id),
      ];

      const target = state.charactersById[targetId];
      target.gold -= goldTaken;
      const isTakenItem = (item: Item) =>
        itemsTaken.find((i) => i.id === item.id);
      target.inventory = target.inventory.filter(
        (id) => !itemsTaken.find((i) => i.id === id)
      );
      target.equipment = equipmentFilter(
        target.equipment,
        (item) => !isTakenItem(item)
      );
    },

    updateCharacterCooldowns(
      state,
      action: PayloadAction<{
        character: Character;
        cooldowns: Character["cooldowns"];
      }>
    ) {
      const { character, cooldowns } = action.payload;
      state.charactersById[character.id].cooldowns = cooldowns;
    },

    addCharacterStatusEffect(
      state,
      action: PayloadAction<{
        character: Character;
        effect: StatusEffect;
      }>
    ) {
      const { character, effect } = action.payload;
      if (!state.charactersById[character.id]) return;
      state.charactersById[character.id].statusEffects?.push(effect);
    },

    purgeExpiredStatuses(state, action: PayloadAction<Character>) {
      const character = action.payload;

      state.charactersById[character.id].statusEffects =
        character.statusEffects?.filter(
          (effect) => !isStatusEffectExpired(effect)
        ) ?? [];
    },

    addCharacterQuestProgress(
      state,
      action: PayloadAction<{
        characterId: string;
        questId: QuestId;
        amount: number;
      }>
    ) {
      const { questId, amount, characterId } = action.payload;
      const quest = state.charactersById[characterId].quests[questId];
      if (!quest) return;
      quest.progress += amount;
    },

    questCompleted(
      state,
      action: PayloadAction<{
        questId: QuestId;
        characterId: string;
      }>
    ) {
      const { questId, characterId } = action.payload;
      delete state.charactersById[characterId].quests[questId];
    },

    goldGained(
      state,
      action: PayloadAction<{
        characterId: string;
        amount: number;
      }>
    ) {
      const { characterId, amount } = action.payload;
      state.charactersById[characterId].gold += amount;
    },

    updateGold(
      state,
      action: PayloadAction<{
        characterId: string;
        gold: number;
      }>
    ) {
      const { characterId, gold } = action.payload;
      state.charactersById[characterId].gold = gold;
    },

    grantDivineBlessing(state, action: PayloadAction<Character>) {
      const character = action.payload;
      const characterState = state.charactersById[character.id];
      if (!characterState) return;
      characterState.hp += 1;
      characterState.maxHP += 1;
    },

    adjustCharacterHP(
      state,
      action: PayloadAction<{
        character: Character;
        amount: number;
      }>
    ) {
      const { character, amount } = action.payload;
      const maxHP = getCharacterStatModified(character, "maxHP");
      let newHp = character.hp + amount;
      if (newHp < 0) newHp = 0;
      if (newHp > maxHP) newHp = maxHP;

      const characterState = state.charactersById[character.id];
      if (!characterState) return;
      characterState.hp = newHp;
    },

    addItemToInventory(
      state,
      action: PayloadAction<{
        character: Character;
        item: Item;
      }>
    ) {
      const { character, item } = action.payload;
      if (item.name === "heavy crown") {
        state.isHeavyCrownInPlay = true;
      }
      const characterState = state.charactersById[character.id];
      if (!characterState) return;
      characterState.inventory.push(item.id);
    },
  },
});

export const {
  updateCharacter,
  updateCharacterCooldowns,
  purgeExpiredStatuses,
  updateGold,
  addCharacterStatusEffect,
  addCharacterQuestProgress,
  grantDivineBlessing,
  adjustCharacterHP,
  addItemToInventory,
  questCompleted,
  goldGained,
  characterLooted,
  monsterCreated,
} = characterSlice.actions;

export default characterSlice.reducer;
