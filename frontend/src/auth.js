export const isAuthed = () => !!localStorage.getItem('token');
export const login = (t) => localStorage.setItem('token', t);
export const logout = () => localStorage.removeItem('token');
