import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import PublicRoute  from "./PublicRoute"
import LoginPage from "../pages/LoginPage"
import PrivateRoute from "./PrivateRoute";
import MainPage from "../pages/MainPage";
import AdminPage from "../pages/Admin/AdminPage"
import RegistroPage from "../pages/RegistroPage";
import AdicionarPage from "../pages/AdicionarLivros/AdicionarLivros";
import EmprestimosKanban from "../pages/EmprestimosKanban/EmprestimosKanban";

//const MainPage = lazy(() => import("../pages/MainPage"))

export default function AppRouter() {
    return(
        <BrowserRouter>
        <Routes>
            <Route element={<PublicRoute />}>
                    <Route path="/registrar" element={<RegistroPage />} />
                    <Route path="/login" element={<LoginPage />} />  
            </Route>
            <Route path="/main" element={<MainPage/>}/>
            <Route element={<PrivateRoute/>}>
                    <Route path="/admin" element={<AdminPage/>}/>
                    <Route path="livro/adicionar" element={<AdicionarPage/>}/>
                    <Route path="emprestimos" element={<EmprestimosKanban/>}/>
            </Route>
            <Route path="*" element={<Navigate to="/main" replace />}/>
        </Routes>
        </BrowserRouter>
    )
}