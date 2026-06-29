import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { SidebarProvider } from './store/SidebarContext';
import { PageTransitionProvider } from './store/PageTransitionContext';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

import { Login } from './modules/auth/Login';
import { OwnerDashboard } from './modules/room/OwnerDashboard';
import { RoomManagement } from './modules/room/RoomManagement';
import { TenantManagement } from './modules/tenant/TenantManagement';
import { ContractManagement } from './modules/contract/ContractManagement';
import { ServiceManagement } from './modules/service/ServiceManagement';
import { UtilityManagement } from './modules/utility/UtilityManagement';
import { TenantUtilities } from './modules/utility/TenantUtilities';
import { InvoiceManagement } from './modules/invoice/InvoiceManagement';
import { TenantDashboard } from './modules/tenant/TenantDashboard';
import { MyRoom } from './modules/tenant/MyRoom';
import { MyContracts } from './modules/contract/MyContracts';
import { MyInvoices } from './modules/invoice/MyInvoices';
import { Notifications } from './modules/tenant/Notifications';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <PageTransitionProvider>
            <Routes>
              <Route path="/dang-nhap" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <OwnerDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan-ly-phong"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <RoomManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan-ly-nguoi-thue"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <TenantManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan-ly-hop-dong"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <ContractManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan-ly-dich-vu"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <ServiceManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan-ly-dien-nuoc"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <UtilityManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan-ly-hoa-don"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <InvoiceManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/trang-chu"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <TenantDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/phong-dang-thue"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <MyRoom />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hop-dong-cua-toi"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <MyContracts />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hoa-don-cua-toi"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <MyInvoices />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dien-nuoc-hang-thang"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <TenantUtilities />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/thong-bao"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <Notifications />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant-preview"
            element={
              <MainLayout>
                <TenantDashboard />
              </MainLayout>
            }
          />

          <Route path="/" element={<Navigate to="/dang-nhap" replace />} />
            </Routes>
          </PageTransitionProvider>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
