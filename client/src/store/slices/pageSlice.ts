import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PageState {
    currentPage: string;
    currentPagination: number,
    currentPageSize: number
}

const initialState: PageState = {
    currentPage: '',  // mặc định là mục thuê nhà trọ == ''
    currentPagination: 1, // mặc định là trang thứ nhất
    currentPageSize: 20
};

type ActionParams = {
    currentPagination: number,
    currentPageSize: number
}

const pageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<string>) => {
            state.currentPage = action.payload;
        },
        setCurrentPagination: (state, action: PayloadAction<ActionParams>) => {
            state.currentPageSize = action.payload.currentPageSize
            state.currentPagination = action.payload.currentPagination
        }
    }
});

export const { setCurrentPage, setCurrentPagination } = pageSlice.actions;
export default pageSlice.reducer;