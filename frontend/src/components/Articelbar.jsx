import { useAuth } from "../../../kb-auth-project/frontend/src/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      background: "#1e293b",
      color: "white",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ margin: 0 }}>📚 Knowledge Base</h2>
      
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <span>Welcome, <strong>{user?.name}</strong> ({user?.role})</span>
        <button 
          onClick={logout}
          style={{
            background: "#ef4444",
            padding: "8px 16px",
            fontSize: "13px"
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
