export const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Check if user exists before trying to access its properties
  return user ? user : null;
};

export const setUserData = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = (navigate) => {
  localStorage.removeItem("user");
  // Check if navigate function is provided before calling it
  if (navigate) {
    navigate("/");
  }
};
