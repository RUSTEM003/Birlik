import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import './App.css';

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transfers = lazy(() => import("./pages/Transfers"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Identity = lazy(() => import("./pages/Identity"));
const Governance = lazy(() => import("./pages/Governance"));
const BirlikLive = lazy(() => import("./pages/BirlikLive"));
const GlobalEconomy = lazy(() => import("./pages/GlobalEconomy"));
const ARDashboard = lazy(() => import("./pages/ARDashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Layout = lazy(() => import("./components/layout/Layout"));

const queryClient = new QueryClient();

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="transfers" element={<Transfers />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="identity" element={<Identity />} />
                <Route path="governance" element={<Governance />} />
                <Route path="birlik-live" element={<BirlikLive />} />
                <Route path="global-economy" element={<GlobalEconomy />} />
                <Route path="ar-dashboard" element={<ARDashboard />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
