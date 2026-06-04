import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { SidebarProvider } from './store/SidebarContext';
import { TenantProvider } from './store/TenantContext';
import { ContractProvider } from './store/ContractContext';
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
        <TenantProvider>
          <ContractProvider>
            <SidebarProvider>
              <PageTransitionProvider>
              <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/owner"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <OwnerDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/rooms"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <RoomManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/tenants"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <TenantManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/contracts"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <ContractManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/services"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <ServiceManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/utilities"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <UtilityManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/invoices"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <InvoiceManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <TenantDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/room"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <MyRoom />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/contracts"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <MyContracts />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/invoices"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <MyInvoices />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/notifications"
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

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
            </PageTransitionProvider>
        </SidebarProvider>
          </ContractProvider>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;