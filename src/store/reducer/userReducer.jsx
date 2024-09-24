
const initialState = {
    user: []
};
const userReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case "USER_LIST":
            return {
                ...state,
                user: payload,
            };
        default:
            return state;
    }
};

export default userReducer;
