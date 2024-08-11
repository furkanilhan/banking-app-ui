import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import { HeaderComponent } from "./components/HeaderComponent/HeaderComponent";
import { Accounts } from './pages/Accounts';
import { AccountDetail } from './pages/AccountDetail';
import { AccountCreate } from './pages/AccountCreate';
import { AccountUpdate } from './pages/AccountUpdate';
import { TransferForm } from './pages/TransferForm';
import { TransactionHistory } from './pages/TransactionHistory';
import "./App.scss";

export const App = () => {

  return (
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
            <Route path="/transactions/account/:accountId" element={<TransactionHistory />} />
          </Routes>
        </Layout>
      </Layout>
  );
};
