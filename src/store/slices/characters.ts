import { Character } from "../../character/Character";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestId } from "../../quest/quests";
import { getCharacterStatModified } from "../../character/getCharacterStatModified";
import { Item } from "equipment/Item";
import { LootResult } from "../../character/loot/loot";
import { Monster } from "../../monster/Monster";
import { AttackResult } from "../../attack/AttackResult";
import { clamp, mapValues } from "remeda";
import { Trap } from "../../trap";

export const isStatusEffectExpired = (effect: StatusEffect): boolean =>
  effect.started
    ? Date.now() > new Date(effect.started).valueOf() + effect.duration
    : false;

const charactersById: Record<string, Character> = {};
const roamingMonsters: string[] = [];

// TODO: export this and use it in the items reducer to clean up the items
const trapDestroyed = createAction<string>("trap/destroyed");

const characterSlice = createSlice({
  name: "characters",
  initialState: {
    charactersById,
    roamingMonsters,
    isHeavyCrownInPlay: false,
  },
  reducers: {
    updateCharacter(state, action: PayloadAction<Character>) {
      const character = action.payload;
      state.charactersById[character.id] = character;
    },

    characterCreated(state, action: PayloadAction<Character>) {
      const character = action.payload;
      state.charactersById[character.id] = character;
    },

    monsterCreated(state, action: PayloadAction<Monster>) {
      const monster = action.payload;
      state.charactersById[monster.id] = monster;
      state.roamingMonsters.push(monster.id);
    },

    trapCreated(state, action: PayloadAction<Trap>) {
      const trap = action.payload;
      state.charactersById[trap.id] = trap;
    },

    characterLooted(state, action: PayloadAction<LootResult>) {
      const { targetId, looterId, itemsTaken, goldTaken } = action.payload;
      const looter = state.charactersById[looterId];
      looter.gold += goldTaken;
      looter.inventory = [...looter.inventory, ...itemsTaken];

      const target = state.charactersById[targetId];
      target.gold -= goldTaken;
      target.inventory = target.inventory.filter(
        (id) => !itemsTaken.includes(id)
      );
      target.equipment = mapValues(target.equipment, (id) =>
        id && itemsTaken.includes(id) ? undefined : id
      );
    },

    characterAttacked(state, action: PayloadAction<AttackResult>) {
      const { defenderId, totalDamage, outcome } = action.payload;
      const defender = state.charactersById[defenderId];
      if (outcome === "hit")
        defender.hp = clamp(defender.hp - totalDamage, { min: 0 });
      if (defender.hp - totalDamage > 0 && defender.quests.survivor)
        defender.quests.survivor.progress += totalDamage;
    },

    updateCharacterCooldowns(
      state,
      action: PayloadAction<{
        character: Character;
        cooldowns: Character["cooldowns"];
      }>
    ) {
      const { character, cooldowns } = action.payload;
      state.charactersById[character.id] = {
        ...character,
        cooldowns,
      };
    },

    addCharacterStatusEffect(
      state,
      action: PayloadAction<{
        character: Character;
        effect: StatusEffect;
      }>
    ) {
      const { character, effect } = action.payload;
      state.charactersById[character.id] = {
        ...character,
        statusEffects: [...(character.statusEffects || []), effect],
      };
    },

    purgeExpiredStatuses(state, action: PayloadAction<string>) {
      const characterId = action.payload;
      const character = state.charactersById[characterId];
      character.statusEffects =
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
      state.charactersById[character.id] = {
        ...character,
        maxHP: character.maxHP + 1,
        hp: character.hp + 1,
      };
    },

    adjustHP(
      state,
      action: PayloadAction<{
        characterId: string;
        amount: number;
      }>
    ) {
      const { characterId, amount } = action.payload;
      const character = state.charactersById[characterId];
      if (!character) return;
      state.charactersById[character.id] = {
        ...character,
        hp: clamp(character.hp + amount, {
          max: getCharacterStatModified(character, "maxHP"),
          min: 0,
        }),
      };
    },

    itemRemovedFromCharacter(
      state,
      action: PayloadAction<{
        characterId: string;
        itemId: string;
      }>
    ) {
      const { characterId, itemId } = action.payload;
      const character = state.charactersById[characterId];
      if (!character) return;
      state.charactersById[character.id] = {
        ...character,
        equipment: mapValues(character.equipment, (id) =>
          id === itemId ? undefined : id
        ),
        inventory: character.inventory.filter((id) => id !== itemId),
      };
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
      state.charactersById[character.id] = {
        ...character,
        inventory: [...character.inventory, item.id],
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(trapDestroyed, (state, action) => {
      const trapId = action.payload;
      delete state.charactersById[trapId];
    });
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
  adjustHP,
  addItemToInventory,
  questCompleted,
  goldGained,
  characterLooted,
  monsterCreated,
  characterAttacked,
  itemRemovedFromCharacter,
  characterCreated,
  trapCreated,
} = characterSlice.actions;

export default characterSlice.reducer;
