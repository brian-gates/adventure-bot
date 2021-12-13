import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../../equipment/Item";

const itemsById: Record<string, Item> = {};

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    itemsById,
  },
  reducers: {
    itemCreated(state, action: PayloadAction<Item>) {
      const item = action.payload;
      state.itemsById[item.id] = item;
    },
  },
});

export const { itemCreated } = itemsSlice.actions;

export default itemsSlice.reducer;
