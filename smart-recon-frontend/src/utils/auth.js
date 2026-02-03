export const getUserRole = () => localStorage.getItem("role");

export const isAdmin = () => getUserRole() === "Admin";
export const isAnalyst = () => getUserRole() === "Analyst";
export const isViewer = () => getUserRole() === "Viewer";
