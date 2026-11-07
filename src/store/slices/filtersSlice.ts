import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  minAperture: number;
  sliderPosition: number; // запоминает позицию
}

const initialState: FiltersState = {
  minAperture: 0,
  sliderPosition: 0,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSliderPosition: (state, action: PayloadAction<number>) => {
      state.sliderPosition = action.payload;
    },
    applyFilter: (state) => {
      state.minAperture = state.sliderPosition;
    },
    resetFilters: (state) => {
      state.minAperture = 0;
      state.sliderPosition = 0;
    },
  },
});

export const { setSliderPosition, applyFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
