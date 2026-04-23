import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../../components/common';
import { Form, FormGroup, Input } from '../../components/forms/Form';
import { useTenant } from '../../store/TenantContext';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Array<{ id: string; roomNumber: string }>;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${(p) => (p.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${theme.zIndex.modal};
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.xl};
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${theme.shadow.lg};
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  h2 {
    margin: 0 0 ${theme.spacing.lg} 0;
    color: ${theme.colors.dark};
    font-size: ${theme.fontSize.lg};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.borderLight};

  button {
    min-width: 120px;
  }
`;

const CredentialsBox = styled.div`
  background: #f0f4ff;
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.sm};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  font-family: 'Courier New', monospace;

  .credentials-title {
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.colors.dark};
    margin-bottom: ${theme.spacing.sm};
    font-size: ${theme.fontSize.sm};
  }

  .credential-item {
    display: flex;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.xs};
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.textSecondary};

    .label {
      font-weight: ${theme.fontWeight.semibold};
      min-width: 100px;
    }

    .value {
      color: ${theme.colors.dark};
      font-weight: ${theme.fontWeight.bold};
    }
  }
`;

const generateUsername = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '')
    .substring(0, 20);
};

const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const AddTenantModal: React.FC<AddTenantModalProps> = ({ isOpen, onClose, rooms }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    idNumber: '',
    gender: 'other',
    roomId: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const [error, setError] = useState('');
  const { addTenant } = useTenant();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateCredentials = () => {
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên người thuê');
      return;
    }

    const username = generateUsername(formData.name);
    const password = generatePassword();

    setGeneratedCredentials({ username, password });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.idNumber.trim() || !generatedCredentials) {
      setError('Vui lòng điền đầy đủ thông tin và tạo tài khoản');
      return;
    }

    if (!formData.roomId) {
      setError('Vui lòng chọn phòng');
      return;
    }

    try {
      addTenant(
        {
          roomId: formData.roomId,
          startDate: new Date(formData.startDate),
        },
        {
          username: generatedCredentials.username,
          name: formData.name,
          phone: formData.phone,
          idNumber: formData.idNumber,
          gender: formData.gender as 'male' | 'female' | 'other',
          address: rooms.find((r) => r.id === formData.roomId)?.roomNumber,
        }
      );

      setFormData({
        name: '',
        phone: '',
        idNumber: '',
        gender: 'other',
        roomId: '',
        startDate: new Date().toISOString().split('T')[0],
      });
      setGeneratedCredentials(null);
      onClose();
    } catch (_err) {
      setError('Có lỗi xảy ra khi thêm người thuê');
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Thêm Người Thuê Mới</h2>

        {error && (
          <div
            style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: theme.spacing.md,
              borderRadius: theme.radius.sm,
              marginBottom: theme.spacing.md,
            }}
          >
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <FullWidthField>
              <FormGroup label="Tên Người Thuê" required>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên người thuê"
                  required
                />
              </FormGroup>
            </FullWidthField>

            <FormGroup label="CMND/CCCD" required>
              <Input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                placeholder="Nhập số CMND/CCCD"
                required
              />
            </FormGroup>

            <FormGroup label="Giới Tính" required>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${theme.colors.borderLight}`,
                  fontSize: theme.fontSize.sm,
                  fontFamily: 'inherit',
                }}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </FormGroup>

            <FormGroup label="Điện Thoại">
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Nhập điện thoại"
              />
            </FormGroup>

            <FormGroup label="Phòng" required>
              <select
                name="roomId"
                value={formData.roomId}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${theme.colors.borderLight}`,
                  fontSize: theme.fontSize.sm,
                  fontFamily: 'inherit',
                }}
              >
                <option value="">-- Chọn phòng --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.roomNumber}
                  </option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Ngày Bắt Đầu" required>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FullWidthField>
              <Button
                type="button"
                onClick={handleGenerateCredentials}
                variant="primary"
                fullWidth
              >
                {generatedCredentials ? '↻ Tạo Lại Tài Khoản' : 'Tạo Tài Khoản Đăng Nhập'}
              </Button>
            </FullWidthField>

            {generatedCredentials && (
              <FullWidthField>
                <CredentialsBox>
                  <div className="credentials-title">📋 Thông tin đăng nhập tự động tạo:</div>
                  <div className="credential-item">
                    <span className="label">Tên Tài Khoản:</span>
                    <span className="value">{generatedCredentials.username}</span>
                  </div>
                  <div className="credential-item">
                    <span className="label">Mật Khẩu:</span>
                    <span className="value">{generatedCredentials.password}</span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: theme.colors.textSecondary,
                      marginTop: theme.spacing.sm,
                    }}
                  >
                    ℹ Lưu thông tin này để gửi cho người thuê
                  </div>
                </CredentialsBox>
              </FullWidthField>
            )}
          </FormGrid>

          <ModalFooter>
            <Button type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={!generatedCredentials}>
              Thêm Người Thuê
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};