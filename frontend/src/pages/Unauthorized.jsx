import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Navigate back to the previous page or dashboard
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    if (!userInfo) {
      navigate("/login");
    } else {
      // Direct them to their respective dashboard based on role
      const role = userInfo.user?.role;
      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "trainer") navigate("/trainer-dashboard");
      else navigate("/student-dashboard");
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "80vh",
      textAlign: "center",
      fontFamily: "sans-serif"
    }}>
      <div style={{ fontSize: "64px", marginBottom: "20px" }}>🚫</div>
      <h1 style={{ color: "#1e293b", fontSize: "32px", marginBottom: "10px" }}>
        Unauthorized Access
      </h1>
      <p style={{ color: "#64748b", maxWidth: "450px", marginBottom: "30px", lineHeight: "1.6" }}>
        Oops! You don't have the required permissions to view this page. 
        If you believe this is an error, please contact your administrator.
      </p>
      
      <button 
        onClick={handleGoBack}
        style={{
          background: "#2563eb",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
        onMouseOver={(e) => e.target.style.background = "#1e40af"}
        onMouseOut={(e) => e.target.style.background = "#2563eb"}
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;