// Central role helper — reads from localStorage
// Role is stored as 'admin' or 'staff' in kolay_portal_role

export const getRole = () => {
    try {
        return localStorage.getItem('kolay_portal_role') || null;
    } catch { return null; }
};

export const isAdmin = () => getRole() === 'admin';
export const isStaff = () => getRole() === 'staff';

export const setRole = (role) => {
    localStorage.setItem('kolay_portal_role', role);
    window.dispatchEvent(new Event('storage'));
};

export const clearRole = () => {
    localStorage.removeItem('kolay_portal_role');
};
