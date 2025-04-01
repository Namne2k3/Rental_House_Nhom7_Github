import { createSlice } from "@reduxjs/toolkit"

interface GeneralSettingPageState {
    generalPage: string | null
}

const initialState: GeneralSettingPageState = {
    generalPage: "GeneralPage"
}

const generalSettingSlice = createSlice({
    name: "generalSetting",
    initialState: initialState,
    reducers: {
        setCurrentGeneralSettingPage: (state, action) => {
            state.generalPage = action.payload
        }
    }
})

export const { setCurrentGeneralSettingPage } = generalSettingSlice.actions
export default generalSettingSlice.reducer;
