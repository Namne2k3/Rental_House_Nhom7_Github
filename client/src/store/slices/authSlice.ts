import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { USER_TOKEN_NAME } from "../../constants/url";
import api from "../../services/api";
import { AuthState, Response } from "../../types";
import { removeCookie, setCookie } from "../../utils";

export const getCurrentUser = createAsyncThunk(
    "auth/getCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/Authentication/getCurrentUser");
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post("/Authentication/login", credentials);
            // console.log("check res >>> ", response);

            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
)

export const signUpUser = createAsyncThunk(
    "auth/signup",
    async (credentials: { fullName: string, email: string, password: string, phoneNumber: string }, { rejectWithValue }) => {
        try {
            const response = await api.post("/Authentication/register", credentials);
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
)

export const updateUser = createAsyncThunk(
    "auth/update",
    async (credentials: { fullName: string, email: string, phoneNumber: string, id: number }, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const response = await api.put("/User/updateUser", credentials);
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
)

export const updatePasswordUser = createAsyncThunk(
    "auth/changePassword",
    async (credentials: { newPassword: string, currentPassword: string }, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const response = await api.put("/User/changePassword", credentials);
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
)

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    message: null
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,

    // reducer sử dụng các hàm bình thường
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.message = "Đăng xuất thành công!";
            // localStorage.removeItem("token");
            removeCookie(USER_TOKEN_NAME)
        }
    },

    // extraReducers sử dụng các hàm bất đồng bộ
    extraReducers: (builder) => {
        builder
            .addCase(
                loginUser.pending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                    state.message = null;
                }
            )
            .addCase(
                loginUser.fulfilled,
                (state, action: PayloadAction<Response>) => {
                    state.isLoading = false
                    if (action.payload.isSuccess) {
                        state.user = action.payload.user
                        state.token = action.payload.message;
                        state.message = null;
                        // localStorage.setItem("token", action.payload.message);
                        setCookie(USER_TOKEN_NAME, action.payload.message)
                    }
                }
            )
            .addCase(
                loginUser.rejected,
                (state, action) => {
                    state.user = null;
                    state.message = null;
                    state.isLoading = false;
                    state.error = (action.payload as { message: string }).message;
                }
            )


            .addCase(
                signUpUser.pending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                    state.message = null;
                }
            )
            .addCase(
                signUpUser.fulfilled,
                (state, action: PayloadAction<Response>) => {
                    state.isLoading = false;
                    state.message = action.payload.message
                }
            )

            .addCase(
                signUpUser.rejected,
                (state, action) => {
                    state.user = null;
                    state.token = null;
                    state.isLoading = false;
                    state.message = null;
                    state.error = (action.payload as { message: string }).message;
                }
            )

            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.token = null;
            })

            // update user
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true
                state.message = null
                state.error = null
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.error = null
                state.message = action.payload.message
            })
            .addCase(updateUser.rejected, (state) => {
                state.isLoading = false
            })

            // update user password
            .addCase(updatePasswordUser.pending, (state) => {
                state.isLoading = true
                state.message = null
                state.error = null
            })
            .addCase(updatePasswordUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.error = null
                state.message = action.payload.message
            })
            .addCase(updatePasswordUser.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload.message
            })
    },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;