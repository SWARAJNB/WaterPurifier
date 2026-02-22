import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-search">
                        <input type="text" placeholder="Search data..." />
                    </div>
                    <div className="header-actions">
                        <div className="admin-profile">
                            <img src="https://ui-avatars.com/api/?name=Admin&background=0284c7&color=fff" alt="Admin" />
                            <span>System Admin</span>
                        </div>
                    </div>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
