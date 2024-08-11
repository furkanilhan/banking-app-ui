const initialState = {
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: (() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser != 'undefined') {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error('Failed to parse user from localStorage', error);
                return null;
            }
        }
        return null;
    })(),
};

const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                token: action.payload.token,
                user: action.payload.user,
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return initialState;
        default:
            return state;
    }
};

export default userReducer;
