import { createSelector } from 'reselect';

interface FavoriteState {
    savedRentals: number[];
}

interface RootState {
    favorite: FavoriteState;
}

const selectFavorite = (state: RootState) => state.favorite;

export const savedRentalsSelector = createSelector(
    [selectFavorite],
    (favorite) => favorite.savedRentals
);
