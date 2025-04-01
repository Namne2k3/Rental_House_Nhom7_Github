import React, { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { fetchUserFavorites } from "../store/slices/favoriteSlice";
import { getCookie } from "../utils";
import { USER_TOKEN_NAME } from "../constants/url";

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const token = getCookie(USER_TOKEN_NAME)

    useEffect(() => {
        if (token) {
            dispatch(fetchUserFavorites())
        }
    }, [token, dispatch])

    return (
        <>
            {children}
        </>
    );
}