import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "./UserManagement.css";

const UserManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      loadUsers();
    }
  }, [user?.token]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await authApi.getAllUsers(); // ✅ FIXED
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    // 🚨 Prevent self-deactivation
    const loggedInUserId = user?.user?._id || user?._id;

    if (id === loggedInUserId && currentStatus) {
      alert(
        "Security Alert: You cannot deactivate your own administrative account."
      );
      return;
    }

    const action = currentStatus ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await authApi.updateUserStatus(id, !currentStatus); // ✅ FIXED
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isActive: !currentStatus } : u
        )
      );
    } catch {
      alert("System Error: Failed to update user status");
    }
  };

  return (
    <div className="um-wrapper">
      <div className="um-card">
        <div className="um-card-header">
          <div>
            <h2>User Directory</h2>
            <p className="um-subtitle">
              Manage system access and permissions
            </p>
          </div>
          <span className="um-count">
            {users.length} Active Accounts
          </span>
        </div>

        {loading ? (
          <div className="um-loader">Loading user data...</div>
        ) : (
          <table className="um-table">
            <thead>
              <tr>
                <th>NAME / EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="um-user">
                      <div className={`um-avatar role-${u.role}`}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="um-name">{u.name}</div>
                        <div className="um-email">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={`um-role ${u.role}`}>
                      {u.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`um-status ${
                        u.isActive ? "active" : "inactive"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <button
                      className={`um-btn ${
                        u.isActive ? "deactivate" : "activate"
                      }`}
                      onClick={() =>
                        toggleStatus(u._id, u.isActive)
                      }
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
