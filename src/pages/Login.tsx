import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useAuth } from '../hooks';
import { AuthLayout } from '../layouts/AuthLayout';
import { Form, FormGroup, Input } from '../components/Forms/Form';
import { Button } from '../components/Common';

const LoginContainer = styled.div`
  form {
    margin: 0;
  }

  h3 {
    text-align: center;
    color: ${theme.colors.dark};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.sm};
  margin-bottom: ${theme.spacing.md};
`;

const Footer = styled.p`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: text-decoration ${theme.transition.base};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Vui lòng nhập tên tài khoản');
      return;
    }

    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    try {
      const loggedInUser = await login(username, password);
      const from = (location.state as Record<string, unknown>)?.from as Record<string, unknown> | undefined;
      
      let pathname = '/owner'; // default
      if (loggedInUser?.role === 'tenant') {
        pathname = '/tenant';
      } else if (loggedInUser?.role === 'admin') {
        pathname = '/admin';
      } else {
        pathname = (from?.pathname as string) || '/owner';
      }
      
      navigate(pathname);
    } catch (err) {
      const errorMsg = (err as Error)?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMsg);
    }
  };

  return (
    <AuthLayout>
      <LoginContainer>
        <Form onSubmit={handleSubmit} title="Đăng Nhập">
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup label="Tên Tài Khoản" required>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên tài khoản"
              required
            />
          </FormGroup>

          <FormGroup label="Mật Khẩu" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </FormGroup>

          <Button 
            type="submit" 
            loading={isLoading} 
            fullWidth
          >
            Đăng Nhập
          </Button>

          <Footer>
            Chưa có tài khoản? <a href="#">Liên hệ quản trị viên</a>
          </Footer>
        </Form>
      </LoginContainer>
    </AuthLayout>
  );
};
