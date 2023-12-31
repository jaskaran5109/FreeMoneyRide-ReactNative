import {createReducer} from '@reduxjs/toolkit';

export const userReducer = createReducer(
  {},
  {
    loginRequest: state => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    registerRequest: state => {
      state.loading = true;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    registerFail: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    logoutRequest: state => {
      state.loading = true;
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.message = action.payload;
    },
    logoutFail: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = action.payload;
    },

    loadUserRequest: state => {
      state.loading = true;
    },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loadUserFail: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    updateUserWalletRequest: state => {
      state.loading = true;
    },
    updateUserWalletSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    updateUserWalletFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addUserFundIdRequest: state => {
      state.loading = true;
    },
    addUserFundIdSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    addUserFundIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addUserPayoutIdRequest: state => {
      state.loading = true;
    },
    addUserPayoutIdSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    addUserPayoutIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserPayoutStatusRequest: state => {
      state.loading = true;
    },
    updateUserPayoutStatusSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    updateUserPayoutStatusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: state => {
      state.loading = false;
      state.error = null;
    },
    clearMessage: state => {
      state.loading = false;
      state.message = null;
    },
    loadUserReportRequest: state => {
      state.loading = true;
    },
    loadUserReportSuccess: (state, action) => {
      state.loading = false;
      state.reports = action.payload;
    },
    loadUserReportFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    forgotPasswordRequest: state => {
      state.loading = true;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.token = action.payload.token;
    },
    forgotPasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest: state => {
      state.loading = true;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    resetPasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deviceTokenRequest: state => {
      state.loading = true;
    },
    deviceTokenSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    deviceTokenFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
);
