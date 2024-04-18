import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();
const UserProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const saveUserToLocalStorage = () => {
      localStorage.setItem("user", JSON.stringify(currentUser));
    };

    saveUserToLocalStorage();

    if (currentUser && currentUser.expiryDate) {
      const currentTime = new Date().getTime();
      const expiryTime = new Date(currentUser.expiryDate).getTime();

      if (currentTime > expiryTime) {
        // Remove user data from localStorage
        localStorage.removeItem("user");
        setCurrentUser(null);
        console.log("User data removed from localStorage");
      }
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
