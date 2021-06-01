import {createAsyncThunk} from "@reduxjs/toolkit";

export const setSearchResult = createAsyncThunk('app/setSearchResult', async (query) => {
  const { channels } = await (await fetch(`/api/chat/channels/${query}`)).json();
  return channels;
});


