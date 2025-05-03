import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        currentUser: null,
        users: [],
    },
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
    },
});

export const { setUser, setUsers } = userSlice.actions;
export default userSlice.reducer;