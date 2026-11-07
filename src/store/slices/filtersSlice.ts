import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  minAperture: number;
}

const initialState: FiltersState = { minAperture: 0 };

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setMinAperture: (state, action: PayloadAction<number>) => {
      state.minAperture = action.payload;
    },
    resetFilters: (state) => {
      state.minAperture = 0;
    }
  },
});

export const { setMinAperture, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
