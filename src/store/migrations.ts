import { RootReducerState } from ".";
import { createMigrate } from "redux-persist";
import { defaultEncounterWeights } from "./slices/encounters";
import { mapValues } from "remeda";
import { Item } from "../equipment/Item";

/*
 * This is the current version and should match the latest version
 */
export const persistVersion = 4;

/**
 * Here we use RootReducerState instead of ReduxState to avoid cyclical type references
 */
type PersistedReduxStateV4 = RootReducerState;

// normalization of inventories
type PersistedReduxStateV3 = Omit<PersistedReduxStateV4, "characters"> & {
  characters: Omit<
    PersistedReduxStateV4["characters"],
    "itemsById" | "charactersById"
  > & {
    charactersById: Record<
      string,
      Omit<
        PersistedReduxStateV4["characters"]["charactersById"][string],
        "inventory"
      > & {
        inventory: Item[];
      }
    >;
  };
};

// state prior to stateful encounter weights
type PersistedReduxStateV2 = Omit<PersistedReduxStateV3, "encounterWeights">;

// State prior to roaming monsters
type PersistedReduxStateV1 = Omit<PersistedReduxStateV2, "characters"> & {
  characters: Omit<PersistedReduxStateV2["characters"], "roamingMonsters">;
};

type MigrationState = PersistedReduxStateV1 | PersistedReduxStateV2;

const persistMigrations = {
  2: (state: PersistedReduxStateV1): PersistedReduxStateV2 => ({
    ...state,
    characters: {
      ...state.characters,
      roamingMonsters: [],
    },
  }),
  3: (state: PersistedReduxStateV2): PersistedReduxStateV3 => ({
    ...state,
    encounters: {
      ...state.encounters,
      encounterWeights: defaultEncounterWeights,
    },
  }),
  // normalize inventories
  4: (state: PersistedReduxStateV3): PersistedReduxStateV4 => ({
    ...state,
    characters: {
      ...state.characters,
      ...mapValues(state.characters.charactersById, (character) => ({
        ...character,
        inventory: character.inventory.map((item) => item.id),
      })),
      itemsById: {},
    },
  }),
};

export const persistMigrate = createMigrate<MigrationState>(persistMigrations);
