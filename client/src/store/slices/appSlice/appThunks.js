import {createAsyncThunk} from "@reduxjs/toolkit";

export const setSearchResult = createAsyncThunk('app/setSearchResult', async (query) => {
  return (await fetch(`/api/chat/search/${query}`)).json();
});


