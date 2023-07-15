import { createReducer } from "@reduxjs/toolkit";

export const offerReducer = createReducer(
  {},
  {
    offerRequest: (state) => {
      state.loading = true;
    },
    offerSuccess: (state, action) => {
      state.loading = false;
      state.offers = action.payload.Offers;
    },
    offerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.loading = false;
      state.error = null;
    },
    clearMessage: (state) => {
      state.loading = false;
      state.message = null;
    },
    getOfferRequest: (state) => {
      state.loading = true;
    },
    getOfferSuccess: (state, action) => {
      state.loading = false;
      state.offer = action.payload.Offer;
    },
    getOfferFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },


    offerAppRequest: (state) => {
      state.loading = true;
    },
    offerAppSuccess: (state, action) => {
      state.loading = false;
      state.appoffers = action.payload.appOffers;
      state.message = action.payload.message;
    },
    offerAppFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    offerShoppingRequest: (state) => {
      state.loading = true;
    },
    offerShoppingSuccess: (state, action) => {
      state.loading = false;
      state.shoppingOffers  = action.payload.shoppingOffers;
      state.message = action.payload.message;
    },
    offerShoppingFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  }
);
