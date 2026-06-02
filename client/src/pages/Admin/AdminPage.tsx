import Dashboard from "../../components/Dashboards/Dashboard"
import "./AdminPage.css"

export default function AdminPage(){
    return (
        <div className="admin-page-container">
            <h1 className="admin-title">DASHBOARD</h1>

            <div className="dashboard-sunken-container">
                <Dashboard />
            </div>
        </div>
    )
}