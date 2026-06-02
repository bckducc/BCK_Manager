import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../../components/common';
import { Form, FormGroup, Input, Select } from '../../components/Forms/Form';
import { useTenant } from '../../store/TenantContext';
import type { Tenant } from './tenant.types';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms?: Array<{ id: string; roomNumber: string }>;
  editingTenant?: Tenant;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${(p) => (p.$isOpen ? 'flex' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${theme.zIndex.modal};
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
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

  h2 {
    margin: 0 0 ${theme.spacing.lg} 0;
    color: ${theme.colors.dark};
    font-size: ${theme.fontSize.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    padding: ${theme.spacing.md};
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
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
    overflow-wrap: anywhere;

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

const ErrorBox = styled.div`
  background: ${theme.colors.dangerLight};
  color: ${theme.colors.dangerDark};
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.sm};
  margin-bottom: ${theme.spacing.md};
`;

const generateUsername = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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

export const AddTenantModal: React.FC<AddTenantModalProps> = ({ isOpen, onClose, editingTenant }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    idNumber: '',
    gender: 'other',
  });
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [error, setError] = useState('');
  const { addTenant, updateTenant } = useTenant();

  React.useEffect(() => {
    if (!isOpen) return;

    if (editingTenant?.currentUser) {
      setFormData({
        name: editingTenant.currentUser.name || '',
        phone: editingTenant.currentUser.phone || '',
        idNumber: editingTenant.currentUser.idNumber || '',
        gender: editingTenant.currentUser.gender || 'other',
      });
      setGeneratedCredentials(null);
    } else {
      setFormData({
        name: '',
        phone: '',
        idNumber: '',
        gender: 'other',
      });
      setGeneratedCredentials(null);
    }
    setError('');
  }, [isOpen, editingTenant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateCredentials = () => {
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên người thuê');
      return;
    }

    setGeneratedCredentials({
      username: generateUsername(formData.name),
      password: generatePassword(),
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.idNumber.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!editingTenant && !generatedCredentials) {
      setError('Vui lòng tạo tài khoản cho người thuê mới');
      return;
    }

    try {
      if (editingTenant) {
        await updateTenant(editingTenant.id, {
          name: formData.name,
          phone: formData.phone,
          idNumber: formData.idNumber,
          gender: formData.gender,
        });
        alert('Cập nhật người thuê thành công');
      } else {
        await addTenant(
          { roomId: '', startDate: new Date() },
          {
            username: generatedCredentials!.username,
            password: generatedCredentials!.password,
            name: formData.name,
            phone: formData.phone,
            idNumber: formData.idNumber,
            gender: formData.gender,
          }
        );
        alert('Thêm người thuê thành công');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu người thuê');
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>{editingTenant ? 'Cập Nhật Người Thuê' : 'Thêm Người Thuê Mới'}</h2>

        {error && <ErrorBox>{error}</ErrorBox>}

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
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                options={[
                  { value: 'male', label: 'Nam' },
                  { value: 'female', label: 'Nữ' },
                  { value: 'other', label: 'Khác' },
                ]}
                required
              />
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

            <FullWidthField>
              {editingTenant ? (
                <p style={{ fontSize: theme.fontSize.sm, color: theme.colors.textSecondary }}>
                  Phòng sẽ được hiển thị sau khi tạo hợp đồng cho người thuê.
                </p>
              ) : (
                <Button type="button" onClick={handleGenerateCredentials} variant="primary" fullWidth>
                  {generatedCredentials ? 'Tạo Lại Tài Khoản' : 'Tạo Tài Khoản Đăng Nhập'}
                </Button>
              )}
            </FullWidthField>

            {generatedCredentials && (
              <FullWidthField>
                <CredentialsBox>
                  <div className="credentials-title">Thông tin đăng nhập tự động tạo:</div>
                  <div className="credential-item">
                    <span className="label">Tài khoản:</span>
                    <span className="value">{generatedCredentials.username}</span>
                  </div>
                  <div className="credential-item">
                    <span className="label">Mật khẩu:</span>
                    <span className="value">{generatedCredentials.password}</span>
                  </div>
                </CredentialsBox>
              </FullWidthField>
            )}
          </FormGrid>

          <ModalFooter>
            <Button type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={editingTenant ? false : !generatedCredentials}>
              {editingTenant ? 'Cập Nhật' : 'Thêm Người Thuê'}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};
