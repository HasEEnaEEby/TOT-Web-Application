import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { RouteWrapper } from "./RouteWrapper";
import { routeConfigs } from "./routeConfigs";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routeConfigs.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={<RouteWrapper config={config} />}
            />
          ))}
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default AppRoutes;
