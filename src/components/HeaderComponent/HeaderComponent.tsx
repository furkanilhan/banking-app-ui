import "./HeaderComponent.scss";
import { useNavigate } from 'react-router-dom';
import { Button, Layout } from 'antd';
const { Header } = Layout;

export const HeaderComponent = () => {

  const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');

        navigate('/login');
    };

  return (
    <Header className="header-container">
      <div className="page-header">
        <div className="page-title">Best Bank</div>
        <div className="page-theme">
        {localStorage.getItem('token') && (
          <Button type="primary" onClick={handleLogout}>
              Logout
          </Button>
        )}
        </div>
      </div>
    </Header>
  );
};
