import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NhaTro } from "../../hooks/useRentalHook";
import api from "../../services/api";

interface RentalDetailState {
    rental: NhaTro | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: RentalDetailState = {
    rental: null,
    isLoading: false,
    error: null
}

export const fetchRentalDetail = createAsyncThunk(
    'rentalDetail/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/NhaTro/GetNhaTroById?id=${id}`)
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi khi tải dữ liệu!');
        }
    }
)

const rentalDetailSlice = createSlice({
    name: "rentalDetail",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchRentalDetail.pending, (state) => {
                state.isLoading = true;
                state.error = null
            })
            .addCase(fetchRentalDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rental = action.payload;
                state.error = null
            })
            .addCase(fetchRentalDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
})

export default rentalDetailSlice.reducer;