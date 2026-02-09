import { NavLink, Outlet } from "react-router-dom";
import "./organization.css";

export default function OrganizationSetup() {
  return (
    <div className="org-layout">
      <div className="org-sidebar">
        <h3>ABC Institute</h3>

        <NavLink end to="/admin-dashboard/organization">
          Organization Profile
        </NavLink>

        <NavLink to="/admin-dashboard/organization/branding">
          Logo & Branding
        </NavLink>

        <NavLink to="/admin-dashboard/organization/rules">
          Learning Rules
        </NavLink>

        <NavLink to="/admin-dashboard/organization/settings">
          System Settings
        </NavLink>
      </div>

      <div className="org-content">
        <Outlet />
      </div>
    </div>
  );
}
