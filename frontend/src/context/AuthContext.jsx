import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD AUTH STATE ON APP START
  ================================ */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userInfo");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser({
          ...JSON.parse(storedUser),
          token,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth init error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ===============================
     LOGIN (FIXED)
  ================================ */
  const login = (data) => {
    // ✅ SUPPORT BOTH API RESPONSE TYPES
    const token = data.token;
    const userData = data.user ? data.user : { ...data, token: undefined };

    if (!token || !userData) {
      console.error("Invalid login payload:", data);
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(userData));

    setUser({
      ...userData,
      token,
    });
  };

  /* ===============================
     LOGOUT
  ================================ */
  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
