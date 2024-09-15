import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/auth/Login';
import UserProfileDetails from './components/auth/UserProfileDetails';
import EmployeeForm from './components/employee/EmployeeForm';
import EmployeeList from './components/employee/EmployeeList';
import SalesApproval from './components/sale/SalesApproval';
import SalesList from './components/sale/SalesList';
import SalesForm from './components/sale/SalesForm';
import VehicleCreate from './components/vehicle/VehicleCreate';
import VehicleList from './components/vehicle/VehicleList';
import VehicleRemove from './components/vehicle/VehicleRemove';
import VehicleUpdate from './components/vehicle/VehicleUpdate';
import VehicleSelector from './components/vehicle/VehicleSelector';
import LowStock from './components/stock/LowStock';
import StockUpdate from './components/stock/StockUpdate';
import ResponsiveAppBar from './components/layout/NavSideBar';
import HeaderComponent from './components/layout/HeaderComponent';
import FooterComponent from './components/layout/FooterComponent';
import ProtectedRoute from './components/routeconfig/ProtectedRoute';
import SalesCalendar from './components/sale/SalesCalendar';
import ReportBody from './components/report/ReportBody';
import AnnualReports from './components/report/AnnualReports';
import Home from  './components/common/Home';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = user !== null;
  const location = useLocation();
  
  // Check if the current path is the login page
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="App">
      {!isLoginPage && isLoggedIn && <HeaderComponent />}
      {!isLoginPage && isLoggedIn && <ResponsiveAppBar />}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute allowedDepartments={['Admin', 'Inventory', 'Sales']} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/employeeform" element={<ProtectedRoute allowedDepartments={['Admin']} />}>
            <Route path="/employeeform" element={<EmployeeForm />} />
            <Route path="/employeeform/new" element={<EmployeeForm />} />
            <Route path="/employeeform/:id" element={<EmployeeForm />} />
          </Route>
          <Route path="/employeelist" element={<ProtectedRoute allowedDepartments={['Admin']} />}>
            <Route path="/employeelist" element={<EmployeeList />} />
          </Route>
          <Route path="/salesapproval" element={<ProtectedRoute allowedDepartments={['Admin', 'Inventory']} />}>
            <Route path="/salesapproval" element={<SalesApproval />} />
            <Route path="/salesapproval/:id" element={<SalesApproval />} />
          </Route>
          <Route path="/salesform" element={<ProtectedRoute allowedDepartments={['Sales']} />}>
            <Route path="/salesform" element={<SalesForm />} />
          </Route>
          <Route path="/saleslist" element={<ProtectedRoute allowedDepartments={['Sales']} />}>
            <Route path="/saleslist" element={<SalesList />} />
          </Route>
          <Route path="/userprofile" element={<ProtectedRoute allowedDepartments={['Admin', 'Inventory', 'Sales']} />}>
            <Route path="/userprofile" element={<UserProfileDetails />} />
          </Route>
          <Route path="/vehicle/create" element={<ProtectedRoute allowedDepartments={['Admin']} />}>
            <Route path="/vehicle/create" element={<VehicleCreate />} />
          </Route>
          <Route path="/vehicle/list" element={<ProtectedRoute allowedDepartments={['Admin', 'Inventory', 'Sales']} />}>
            <Route path="/vehicle/list" element={<VehicleList />} />
          </Route>
          <Route path="/vehicle/select" element={<ProtectedRoute allowedDepartments={['Admin', 'Inventory', 'Sales']} />}>
            <Route path="/vehicle/select" element={<VehicleSelector />} />
          </Route>
          <Route path="/vehicle/delete" element={<ProtectedRoute allowedDepartments={['Admin']} />}>
            <Route path="/vehicle/delete" element={<VehicleRemove />} />
          </Route>
          <Route path="/vehicle/update/:id" element={<ProtectedRoute allowedDepartments={['Admin']} />}>
            <Route path="/vehicle/update/:id" element={<VehicleUpdate />} />
          </Route>
          <Route path="/stock/update" element={<ProtectedRoute allowedDepartments={['Admin', 'Inventory']} />}>
            <Route path="/stock/update" element={<StockUpdate />} />
          </Route>
          <Route path="/stock/lowstock" element={<ProtectedRoute allowedDepartments={['Admin', 'Inventory']} />}>
            <Route path="/stock/lowstock" element={<LowStock />} />
          </Route>
          <Route path="/calsales" element={<ProtectedRoute allowedDepartments={['Admin', 'Inventory']} />}>
            <Route path="/calsales" element={<SalesCalendar />} />
          </Route>
          <Route path="/reports" element={<ProtectedRoute allowedDepartments={['Admin', 'Inventory', 'Sales']} />}>
            <Route path="/reports" element={<><ReportBody /><AnnualReports /></>} />
          </Route>
          
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Route>
      </Routes>

      {!isLoginPage && isLoggedIn && <FooterComponent />}
    </div>
  );
}

export default App;
