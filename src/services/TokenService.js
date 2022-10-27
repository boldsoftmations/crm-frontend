export const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user.refresh;
};

export const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user.access;
};

export const updateLocalAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem("user"));
  user.access = token;
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const setUserData = (user) => {
  console.log("user", JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem("user");
};
