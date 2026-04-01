import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './stores/AuthContext';
import { SidebarProvider } from './stores/SidebarContext';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { Login } from './pages/Login';
import {
  OwnerDashboard,
  RoomManagement,
  TenantManagement,
  ContractManagement,
  ServiceManagement,
  UtilityManagement,
  BillManagement,
  PaymentManagement,
} from './pages/Owner';
import {
  TenantDashboard,
  MyRoom,
  MyContracts,
  MyBills,
  Notifications,
} from './pages/Tenant';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Owner Routes */}
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
            path="/owner/bills"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <BillManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/payments"
            element={
              <ProtectedRoute requiredRole="owner">
                <MainLayout>
                  <PaymentManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Tenant Routes */}
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
            path="/tenant/bills"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MainLayout>
                  <MyBills />
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

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
