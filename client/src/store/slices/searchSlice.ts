import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface AddressDTO {
    address: string,
    id: number
}


export interface SearchState {
    addresses: AddressDTO[] | null;
    priceRange: number[];
    areaRange: number[];
    search: string;
    error: string | null;
    isLoading: boolean;
}

const initialState: SearchState = {
    addresses: null,
    priceRange: [0, 10 * 1000000],
    areaRange: [0, 100],
    search: "",
    isLoading: false,
    error: null
};

export const searchRentalsAddress = createAsyncThunk(
    "search/searchAddresses",
    async (credentials: { search: string }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/Address/?search=${credentials.search}`);
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
)

const searchSlice = createSlice({
    name: "search",
    initialState: initialState,
    reducers: {
        searchRentals: (state, action: PayloadAction<{ search: string }>) => {
            state.search = action.payload.search
        },
        setPriceRange: (state, action: PayloadAction<number[]>) => {
            state.priceRange = action.payload
        },
        setAreaRange: (state, action: PayloadAction<number[]>) => {
            state.areaRange = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(
                searchRentalsAddress.pending,
                (state) => {
                    state.isLoading = true
                    state.error = null
                }
            )
            .addCase(
                searchRentalsAddress.fulfilled,
                (state, action: PayloadAction<AddressDTO[]>) => {
                    state.isLoading = false
                    state.addresses = action.payload
                    state.error = null
                }
            )
            .addCase(
                searchRentalsAddress.rejected,
                (state) => {
                    state.isLoading = false
                    state.error = "Lỗi khi tìm kiếm dữ liệu"
                }
            )
    },
})

export const { searchRentals, setPriceRange, setAreaRange } = searchSlice.actions
export default searchSlice.reducer