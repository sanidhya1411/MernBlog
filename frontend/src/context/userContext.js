import { createContext, useState, useEffect, useRef } from "react";

export const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const intervalIdRef = useRef(null);

  useEffect(() => {
    const saveUserToLocalStorage = () => {
      localStorage.setItem("user", JSON.stringify(currentUser));
    };

    saveUserToLocalStorage();

    if (currentUser) {
      intervalIdRef.current = setInterval(() => {
        localStorage.removeItem("user");
        console.log("User data removed from localStorage");
      }, 24 * 60 * 60 * 1000);

      return () => clearInterval(intervalIdRef.current);
    } else {
      clearInterval(intervalIdRef.current);
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
