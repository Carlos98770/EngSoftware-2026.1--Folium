import { lazy } from "react";
import { useLocation, Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import PublicRoute  from "./PublicRoute"
import LoginPage from "../pages/LoginPage"
import PrivateRoute from "./PrivateRoute";
import MainPage from "../pages/MainPage";
import AdminPage from "../pages/Admin/AdminPage"
import RegistroPage from "../pages/RegistroPage";

//const MainPage = lazy(() => import("../pages/MainPage"))

export default function AppRouter() {
    return(
        <BrowserRouter>
        <Routes location={location}>
            <Route element={<PublicRoute />}>
                    <Route path="/registrar" element={<RegistroPage />} />
                    <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route path="/main" element={<MainPage/>}/>
            <Route path="/admin" element={<AdminPage/>}/>
            <Route path="" element={<Navigate to="/main" replace />}/>
        </Routes>
        </BrowserRouter>
    )
}