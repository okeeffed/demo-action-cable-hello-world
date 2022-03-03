import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define a type for the slice state
interface channelsState {
  subscriptions: Array<string>;
  messages: Record<string, string[]>;
}

// Define the initial state using that type
const initialState: channelsState = {
  subscriptions: [],
  messages: {},
};

export const channelsSlice = createSlice({
  name: "channels",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addChannel: (state, action: PayloadAction<{ id: string }>) => {
      state.subscriptions.push(action.payload.id);
    },
    addMessageToChannel: (
      state,
      action: PayloadAction<{ id: string; message: string }>
    ) => {
      if (state.messages[action.payload.id] !== undefined) {
        state.messages[action.payload.id].push(action.payload.message);
      } else {
        state.messages[action.payload.id] = [action.payload.message];
      }
    },
    removeChannel: (state, action: PayloadAction<{ id: string }>) => {
      state.subscriptions = state.subscriptions.filter(
        (subscriptionId) => subscriptionId !== action.payload.id
      );
    },
  },
});

export const { addChannel, addMessageToChannel, removeChannel } =
  channelsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSubscriptionById = (state: RootState, id: string) =>
  state.channels.subscriptions[id] ?? [];

export const selectMessagesById = (state: RootState, id: string) =>
  state.channels.messages[id] ?? [];

export const channelsReducer = channelsSlice.reducer;
