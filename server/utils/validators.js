export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^.{6,}$/;
export const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

export const isValidEmail = (email) => emailRegex.test(email);
export const isValidPassword = (password) => passwordRegex.test(password);
export const isValidUsername = (username) => usernameRegex.test(username);
