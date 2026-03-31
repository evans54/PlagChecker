import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Bundles from './pages/Bundles';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ReportDetail from './pages/ReportDetail';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path='/register' element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              <Route path='/dashboard' element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path='/upload' element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path='/bundles' element={
                <ProtectedRoute>
                  <Bundles />
                </ProtectedRoute>
              } />
              <Route path='/reports' element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path='/profile' element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path='/settings' element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path='/reports/:id' element={
                <ProtectedRoute>
                  <ReportDetail />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
