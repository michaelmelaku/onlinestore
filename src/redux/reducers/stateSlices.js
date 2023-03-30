import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
    name: "states",
    initialState: {
        page: localStorage.getItem('page') ? JSON.parse(localStorage.getItem('page')): 'home',
        appPage: localStorage.getItem('appPage') ? JSON.parse(localStorage.getItem('appPage')) : 'productPage',
        productDetailId: null,
        loginPlace: null,
        stripeData: null,
    },
    reducers: {
        setPage: (state, action) => {
            localStorage.setItem('page', JSON.stringify(action?.payload));
            state.page = action.payload;
        },
        setAppPage: (state, action) => {
            localStorage.setItem('appPage', JSON.stringify(action?.payload));
            state.appPage = action.payload;
        },
        setProductDetailId: (state, action) => {
            state.productDetailId = action.payload;
        },
        setLoginPlace: (state, action) => {
            state.loginPlace = action.payload;
        },
        setStripeData: (state, action) => {
            state.stripeData = action.payload;
        },
        resetStripeData: (state) => {
            state.stripeData = null;
        }
    }
});

export const {setPage, setAppPage, setProductDetailId, setLoginPlace, setStripeData, resetStripeData} = stateSlice.actions;

export default stateSlice.reducer;
