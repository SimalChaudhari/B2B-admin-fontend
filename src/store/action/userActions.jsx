import axiosInstance from "src/configs/axiosInstance";

export const userList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/users');
        dispatch({
            type: 'USER_LIST',
            payload: response.data?.data, // Assuming response contains the customers data
        });
        return true;
    } catch (error) {
        console.error(error); // Log the error for debugging
        return false;
    }
};

export const createUser = (userData) => async (dispatch) => {
    try {
        await axiosInstance.post('/auth/register', userData);
        return true;
    } catch (error) {
        console.error(error); // Log the error for debugging
        return false;
    }
};
