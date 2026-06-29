import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../../components/common';
import { Form, FormGroup, Input, Select } from '../../components/Forms/Form';
import { useTenant } from '../../store/TenantContext';
import type { Tenant } from './tenant.types';
import type { User } from '../../types';

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

  @media (max-width: ${theme.breakpoints.mobile}) {
    align-items: flex-end;
    padding: ${theme.spacing.sm} ${theme.spacing.sm} 0;
  }
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.xl};
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  max-height: 90dvh;
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
    padding-bottom: calc(${theme.spacing.md} + env(safe-area-inset-bottom));
    max-height: calc(100dvh - 8px);
    border-radius: ${theme.radius.lg} ${theme.radius.lg} 0 0;
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

const ErrorBox = styled.div`
  background: ${theme.colors.dangerLight};
  color: ${theme.colors.dangerDark};
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.sm};
  margin-bottom: ${theme.spacing.md};
`;

const HintText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
  margin: 0;
`;

const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

const isValidVietnamPhone = (phone: string) => /^0(3|5|7|8|9)\d{8}$/.test(phone);

const normalizeUsername = (username: string) => username.trim().toLowerCase();

const isSameTenant = (tenant: Tenant, editingTenant?: Tenant) => {
  if (!editingTenant) return false;
  return String(tenant.id) === String(editingTenant.id) || String(tenant.userId) === String(editingTenant.userId);
};

const normalizeGender = (gender: string): User['gender'] => {
  return gender === 'male' || gender === 'female' || gender === 'other' ? gender : 'other';
};

export const AddTenantModal: React.FC<AddTenantModalProps> = ({ isOpen, onClose, editingTenant }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phone: '',
    idNumber: '',
    gender: 'other',
  });
  const [error, setError] = useState('');
  const { addTenant, updateTenant, tenants } = useTenant();

  React.useEffect(() => {
    if (!isOpen) return;

    if (editingTenant?.currentUser) {
      setFormData({
        username: '',
        password: '',
        name: editingTenant.currentUser.name || '',
        phone: editingTenant.currentUser.phone || '',
        idNumber: editingTenant.currentUser.idNumber || '',
        gender: editingTenant.currentUser.gender || 'other',
      });
    } else {
      setFormData({
        username: '',
        password: '',
        name: '',
        phone: '',
        idNumber: '',
        gender: 'other',
      });
    }

    setError('');
  }, [isOpen, editingTenant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const phone = normalizePhone(formData.phone);

    if (!formData.name.trim() || !formData.idNumber.trim() || !phone) {
      return 'Vui lòng điền đầy đủ thông tin bắt buộc';
    }

    if (!isValidVietnamPhone(phone)) {
      return 'Số điện thoại phải gồm 10 số và đúng định dạng số điện thoại Việt Nam';
    }

    const duplicatedPhone = tenants.some((tenant) => {
      if (isSameTenant(tenant, editingTenant)) return false;
      return normalizePhone(tenant.currentUser?.phone || '') === phone;
    });

    if (duplicatedPhone) {
      return 'Số điện thoại này đã được sử dụng bởi người dùng khác';
    }

    if (!editingTenant && (!formData.username.trim() || !formData.password.trim())) {
      return 'Vui lòng nhập tài khoản và mật khẩu cho người thuê mới';
    }

    if (!editingTenant && /\s/.test(formData.username.trim())) {
      return 'Tài khoản không được chứa khoảng trắng';
    }

    if (!editingTenant) {
      const username = normalizeUsername(formData.username);
      const duplicatedUsername = tenants.some((tenant) => {
        if (isSameTenant(tenant, editingTenant)) return false;
        const tenantUsername =
          tenant.currentUser?.username ||
          ((tenant as unknown as Record<string, unknown>).username as string | undefined) ||
          '';
        return normalizeUsername(tenantUsername) === username;
      });

      if (duplicatedUsername) {
        return 'Tên tài khoản đã tồn tại';
      }
    }

    if (!editingTenant && formData.password.trim().length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const phone = normalizePhone(formData.phone);

    try {
      if (editingTenant) {
        await updateTenant(editingTenant.id, {
          name: formData.name.trim(),
          phone,
          idNumber: formData.idNumber.trim(),
          gender: normalizeGender(formData.gender),
        });
        alert('Cập nhật người thuê thành công');
      } else {
        await addTenant(
          { roomId: '', startDate: new Date() },
          {
            username: formData.username.trim(),
            password: formData.password,
            name: formData.name.trim(),
            phone,
            idNumber: formData.idNumber.trim(),
            gender: normalizeGender(formData.gender),
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

            {!editingTenant && (
              <>
                <FormGroup label="Tài Khoản" required>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Nhập tài khoản đăng nhập"
                    autoComplete="username"
                    required
                  />
                </FormGroup>

                <FormGroup label="Mật Khẩu" required>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu"
                    autoComplete="new-password"
                    required
                  />
                </FormGroup>
              </>
            )}

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

            <FormGroup label="Điện Thoại" required>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Ví dụ: 0912345678"
                inputMode="numeric"
                maxLength={10}
                required
              />
            </FormGroup>

            <FullWidthField>
              <HintText>Phòng sẽ được hiển thị sau khi tạo hợp đồng cho người thuê.</HintText>
            </FullWidthField>
          </FormGrid>

          <ModalFooter>
            <Button type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              {editingTenant ? 'Cập Nhật' : 'Tạo'}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};
