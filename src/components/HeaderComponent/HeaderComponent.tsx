import "./HeaderComponent.scss";
import { useNavigate } from 'react-router-dom';
import { Button, Layout, Tooltip } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/userActions';
const { Header } = Layout;

export const HeaderComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Header className="header-container">
      <div className="page-header">
        <div className="page-title">Best Bank</div>
        <div className="page-theme">
          {localStorage.getItem('token') && (
            <Tooltip title="Logout">
              <Button 
                type="link" 
                icon={<LogoutOutlined />} 
                onClick={handleLogout} 
              />
            </Tooltip>
          )}
        </div>
      </div>
    </Header>
  );
};
