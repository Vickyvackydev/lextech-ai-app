/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

export interface GlobalState {
  open: boolean;
  chatStarted: boolean;
  searchModal: boolean;
  messages: Array<string>;
  input: string;
  darkMode: boolean;
  chats: any[];
  chatId: string | null;
  caption: boolean;
  settings: boolean;
}

const initialState: GlobalState = {
  open: false,
  chatStarted: false,
  searchModal: false,
  messages: [],
  input: "",
  darkMode: false,
  chats: [],
  chatId: null,
  caption: false,
  settings: false,
};

export const GlobalSlice = createSlice({
  initialState,
  name: "globalstate",
  reducers: {
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    setChatStarted: (state, action) => {
      state.chatStarted = action.payload;
    },
    setSearcModal: (state, action) => {
      state.searchModal = action.payload;
    },
    setMessage: (state, action) => {
      state.messages = action.payload;
    },
    setSelectedInput: (state, action) => {
      state.input = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    setLiveCaption: (state, action) => {
      state.caption = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
  },
});

export const {
  setOpen,
  setChatStarted,
  setSearcModal,
  setMessage,
  setSelectedInput,
  setDarkMode,
  setChats,
  setChatId,
  setLiveCaption,
  setSettings,
} = GlobalSlice.actions;

export const SelectOpenState = (state: RootState) => state.globalstate.open;
export const startChat = (state: RootState) => state.globalstate.chatStarted;
export const openModal = (state: RootState) => state.globalstate.searchModal;
export const getMessages = (state: RootState) => state.globalstate.messages;
export const selectInput = (state: RootState) => state.globalstate.input;
export const selectDarkmode = (state: RootState) => state.globalstate.darkMode;
export const selectChat = (state: RootState) => state.globalstate.chats;
export const selectChatId = (state: RootState) => state.globalstate.chatId;
export const showCaption = (state: RootState) => state.globalstate.caption;
export const showSettings = (state: RootState) => state.globalstate.settings;
export const GlobalReducer = GlobalSlice.reducer;
