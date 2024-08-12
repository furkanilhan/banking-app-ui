export const loginSuccess = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
        type: 'LOGIN_SUCCESS',
        payload: { token, user },
    };
};

export const logout = () => ({
    type: 'LOGOUT',
});
