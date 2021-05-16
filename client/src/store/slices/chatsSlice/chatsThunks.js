import {createAsyncThunk} from "@reduxjs/toolkit";
import {convertRawStartChatsData} from "../../../utils/convertRawStartChatsData";

export const setChatsData = createAsyncThunk('chats/createChatsData', async (userId) => {
  const {rawChatsInfo, lastMessages} = await (await fetch(`/user/${userId}/chatsData`)).json();
  return convertRawStartChatsData(rawChatsInfo, lastMessages);
});
