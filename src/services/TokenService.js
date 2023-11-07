export const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Check if user exists before trying to access its properties
  return user ? user.refresh : null;
};

export const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Check if user exists before trying to access its properties
  return user ? user.access : null;
};

export const updateLocalAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem("user"));
  // If user doesn't exist, create a new object
  if (!user) {
    user = {};
  }
  user.access = token;
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  // Return the parsed user object or null if not found
  return JSON.parse(localStorage.getItem("user"));
};

export const setUserData = (user) => {
  console.log("user", JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = (navigate) => {
  localStorage.removeItem("user");
  // Check if navigate function is provided before calling it
  if (navigate) {
    navigate("/");
  }
};
