import { useNavigate } from 'react-router-dom';
import Dashboard from "../../components/Dashboards/Dashboard";
import "./AdminPage.css";

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-page-container">
      <h1 className="admin-title" onClick={() => navigate('/main')}>
        ← DASHBOARD
      </h1>
      <div className="dashboard-sunken-container">
        <Dashboard />
      </div>
    </div>
  );
}