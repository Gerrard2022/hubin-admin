import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { Title, useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import routerBindings, {
    DocumentTitleHandler,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { App as AntdApp, Spin } from "antd"; // Import Spin here
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { supabaseClient } from "./utility";
import {
    ClerkProvider,
    RedirectToSignIn,
    SignIn,
    SignUp,
    useAuth,
} from "@clerk/clerk-react";
import Layout from "./components/layout";
import { Home } from "./pages";
import { resources } from "./config/resources";
import Rides from "./pages/rides";
import Drivers from "./pages/drivers/list";
import EditDriver from "./pages/drivers/edit";
import OrganizationList from "./pages/organization";
import CreateOrganization from "./pages/organization/create";
import ToPay from "./pages/toPay";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
    throw new Error("Clerk publishable key is not provided!");
}

// Custom Title Component
const CustomTitle = ({ collapsed }: { collapsed: boolean }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
        <img
            src="https://example.com/logo.png" // Replace with your logo URL
            alt="Hubin Logo"
            style={{
                width: collapsed ? "30px" : "40px",
                marginRight: collapsed ? "0" : "8px",
                transition: "width 0.2s",
            }}
        />
        {!collapsed && <h2 style={{ margin: 0 }}>Hubin</h2>}
    </div>
);

// Loader Component
const Loader = () => (
      <div
      style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", 
      }}
    >
      <Spin size="large" tip="Loading..." />
    </div>
);

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return <Loader />;
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return children;
};

// Wrapper for protected routes using Outlet
const ProtectedRoutesLayout = () => (
    <ProtectedRoute>
        <Layout>
            <Outlet />
        </Layout>
    </ProtectedRoute>
);

function App() {
    return (
        <ClerkProvider publishableKey={clerkPublishableKey}>
            <BrowserRouter>
                <RefineKbarProvider>
                    <AntdApp>
                        <DevtoolsProvider>
                            <Refine
                                dataProvider={dataProvider(supabaseClient)}
                                liveProvider={liveProvider(supabaseClient)}
                                routerProvider={routerBindings}
                                resources={resources}
                                notificationProvider={useNotificationProvider}
                                options={{
                                    syncWithLocation: true,
                                    warnWhenUnsavedChanges: true,
                                    useNewQueryKeys: true,
                                    projectId: "PtHBD5-HRaKNY-ZLhj8g",
                                }}
                                Title={CustomTitle} // Use the custom title here
                                ReadyPage={Loader} // Global loader during setup
                            >
                                <Routes>
                                    <Route path="/login" element={<SignIn />} />
                                    <Route path="/signup" element={<SignUp />} />

                                    {/* Grouped Protected Routes */}
                                    <Route element={<ProtectedRoutesLayout />}>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/rides" element={<Rides />} />
                                        <Route path="/drivers" element={<Drivers />} />
                                        <Route
                                            path="/drivers/edit/:id"
                                            element={<EditDriver />}
                                        />
                                        <Route
                                            path="/organizations"
                                            element={<OrganizationList />}
                                        />
                                        <Route
                                            path="/organizations/new"
                                            element={<CreateOrganization />}
                                        />
                                        <Route 
                                            path="/topay" 
                                            element={<ToPay />} 
                                        />
                                    </Route>
                                </Routes>

                                <RefineKbar />
                                <UnsavedChangesNotifier />
                                <DocumentTitleHandler />
                            </Refine>
                            <DevtoolsPanel />
                        </DevtoolsProvider>
                    </AntdApp>
                </RefineKbarProvider>
            </BrowserRouter>
        </ClerkProvider>
    );
}

export default App;
