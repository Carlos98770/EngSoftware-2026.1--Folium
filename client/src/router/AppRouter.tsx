import { lazy } from "react";
import { useLocation, Routes, Route, BrowserRouter } from "react-router-dom";
import PublicRoute  from "./PublicRoute"
import LoginPage from "../pages/LoginPage"

//const MainPage = lazy(() => import("../pages/MainPage"))

export default function AppRouter() {
    return(
        <BrowserRouter>
        <Routes location={location}>
            <Route element={<PublicRoute/>}/>
            <Route path="/login" element={<LoginPage/>}></Route>
        </Routes>
        </BrowserRouter>
    )
}