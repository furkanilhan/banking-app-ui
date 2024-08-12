import { ConfigProvider, Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import { useTheme } from "./contexts/ThemeContext";
import Login from './pages/Login';
import Register from './pages/Register';
import { HeaderComponent } from "./components/HeaderComponent/HeaderComponent";
import { Accounts } from './pages/Accounts';
import { AccountDetail } from './pages/AccountDetail';
import { AccountCreate } from './pages/AccountCreate';
import { AccountUpdate } from './pages/AccountUpdate';
import { TransferForm } from './pages/TransferForm';
import "./App.scss";

export const App = () => {
  const { theme } = useTheme();

  return (
    <ConfigProvider theme={{ token: theme, components: { Layout: theme } }}>
      <Layout className="main-layout">
        <HeaderComponent />
        <Layout className="body-layout">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/:id" element={<AccountDetail />} />
            <Route path="/accounts/create" element={<AccountCreate />} />
            <Route path="/accounts/update/:id" element={<AccountUpdate />} />
            <Route path="/transfer" element={<TransferForm />} />
          </Routes>
        </Layout>
      </Layout>
      </ConfigProvider>
  );
};
