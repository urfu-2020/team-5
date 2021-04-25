import {combineReducers} from "redux";
import {currentDialogReducer} from "./currentDialogReducer";

export const rootReducer = combineReducers(
	{
		currentDialog: currentDialogReducer
	}
);
