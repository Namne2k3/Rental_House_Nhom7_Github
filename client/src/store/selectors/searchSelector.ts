import { createSelector } from 'reselect';

interface SearchState {
    search: string;
}

interface RootState {
    search: SearchState;
}

const selectSearch = (state: RootState) => state.search;

export const searchSelector = createSelector(
    [selectSearch],
    (search) => search.search
);
