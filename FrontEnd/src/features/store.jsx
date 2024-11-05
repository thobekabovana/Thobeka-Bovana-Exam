// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // User registration reducer
import authReducer from "./authSlice"; // Auth reducer for login
// import thunk from "redux-thunk";
import productReducer from "./AddproductSlice";
import productListReducer from '../features/ProductListSlice';

const store = configureStore({
    reducer: {
        user: userReducer,    // For user registration
        auth: authReducer,     // For authentication
        product: productReducer,
        products: productListReducer,
    },
    // middleware: [thunk],
});

export default store;



