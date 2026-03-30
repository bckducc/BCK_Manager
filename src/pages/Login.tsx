import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { Form, FormGroup, Input } from '../components/Forms/Form';
import { Button } from '../components/Common';
import styles from './Login.module.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/owner');
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <AuthLayout>
      <div className={styles.loginContainer}>
        <Form onSubmit={handleSubmit} title="Đăng Nhập">
          {error && <div className={styles.error}>{error}</div>}
          
          <FormGroup label="Email" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
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

          <p className={styles.footer}>
            Chưa có tài khoản? <a href="#">Liên hệ quản trị viên</a>
          </p>
        </Form>
      </div>
    </AuthLayout>
  );
};
