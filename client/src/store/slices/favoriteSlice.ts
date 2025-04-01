import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { NhaTro } from "../../hooks/useRentalHook";
import { Response, User } from "../../types";

export type Favorite = {
    id: number,
    userId: number,
    user: User,
    nhaTroId: number,
    nhaTro: NhaTro,
    dateSaved: Date
}

export interface FavoriteState {
    savedRentals: number[];
    savedRentalData: Favorite[];
    error: string | null;
    message: string | null;
    isLoading: boolean;
}

const initialState: FavoriteState = {
    savedRentals: [],
    savedRentalData: [],
    isLoading: false,
    error: null,
    message: null
};

type FavoriteRentalsResponse = {
    nhaTroId: number;
    isSuccess: boolean;
    message: string | null;
    data: Favorite
};

export const fetchUserFavorites = createAsyncThunk(
    "favorite/getAllFavoritesByUserId",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/Favorite/GetFavoritesByCurrentUser', {
                timeout: 5000,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                maxContentLength: 50 * 1000 * 1000 // 50MB max
            });

            // Validate response data
            if (!Array.isArray(response.data)) {
                console.log("check res dataa >>> ", response.data);
                throw new Error('Invalid response format');
            }
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
);

export const addNhaTroToSaveList = createAsyncThunk(
    "favorite/add",
    async (credentials: { id: number }, { rejectWithValue }) => {
        try {
            const response = await api.post("/Favorite/AddFavorite", credentials);
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
);

export const removeNhaTroFromSaveList = createAsyncThunk(
    "favorite/remove",
    async (credentials: { id: number }, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/Favorite/DeleteFavorite?id=${credentials.id}`)
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
)

const favoriteSlice = createSlice({
    name: "favorite",
    initialState: initialState,
    reducers: {
        addFavoriteLocally: (state, action: PayloadAction<number>) => {
            state.savedRentals = [...state.savedRentals, action.payload];
        },
        removeFavoriteLocally: (state, action: PayloadAction<number>) => {
            state.savedRentals = state.savedRentals.filter(id => id !== action.payload);
            state.savedRentalData = state.savedRentalData.filter(item => item.id != action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                addNhaTroToSaveList.pending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addCase(
                addNhaTroToSaveList.fulfilled,
                (state, action: PayloadAction<FavoriteRentalsResponse>) => {
                    state.isLoading = false;
                    state.message = action.payload.message;
                    state.savedRentals = [...state.savedRentals, action.payload.nhaTroId];
                    state.savedRentalData = [...state.savedRentalData, action.payload.data]
                }
            )
            .addCase(
                addNhaTroToSaveList.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload as string;
                }
            )


            .addCase(
                fetchUserFavorites.pending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addCase(
                fetchUserFavorites.fulfilled,
                (state, action: PayloadAction<Favorite[]>) => {
                    state.isLoading = false;
                    state.savedRentals = action.payload.map(favorite => favorite.id);
                    state.savedRentalData = action.payload;
                    state.error = null;
                }
            )
            .addCase(
                fetchUserFavorites.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload as string;
                }
            )

            .addCase(
                removeNhaTroFromSaveList.pending,
                (state) => {
                    state.isLoading = true;
                }
            )
            .addCase(
                removeNhaTroFromSaveList.fulfilled,
                (state, action: PayloadAction<Response>) => {
                    state.isLoading = false;
                    state.message = action.payload.message
                }
            )
            .addCase(
                removeNhaTroFromSaveList.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload as string;
                }
            )
    }
});

export const { addFavoriteLocally, removeFavoriteLocally } = favoriteSlice.actions;

export default favoriteSlice.reducer;