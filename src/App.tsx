import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import { HeaderComponent } from "./components/HeaderComponent/HeaderComponent";
import { AccountPage } from './pages/AccountPage';
import { AccountDetailPage } from './pages/AccountDetailPage';
import "./App.scss";

export const App = () => {

  return (
      <Layout className="main-layout">
        <HeaderComponent />
        <Layout className="body-layout">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/accounts" element={<AccountPage />} />
            <Route path="/accounts/:id" element={<AccountDetailPage />} />
          </Routes>
        </Layout>
      </Layout>
  );
};
