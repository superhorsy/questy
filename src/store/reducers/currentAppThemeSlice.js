import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
  theme: 'standart'
}

export const currentAppThemeSlice = createSlice({
  name: 'currentAppTheme',
  initialState,
  reducers: {
    updateCurrentAppTheme(state, action) {
      state.theme = action.payload ?? "standart";
    }
  },
  
});
export const {updateCurrentAppTheme} = currentAppThemeSlice.actions;
export default currentAppThemeSlice.reducer;