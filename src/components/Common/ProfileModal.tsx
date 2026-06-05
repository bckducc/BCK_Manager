import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useAuth } from '../../modules/auth/useAuth';
import { profileService, toUser } from '../../services/profileService';
import type { BackendProfile } from '../../services/profileService';
import { Modal } from './Modal';
import { Form, FormGroup, Input } from '../Forms/Form';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ReadonlyValue = styled.div`
  padding: 0.75rem;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.lightBg};
  min-height: 42px;
`;

const Notice = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.lightBg};
  color: ${theme.colors.textSecondary};
`;

const ErrorText = styled.div`
  color: ${theme.colors.danger};
`;

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<BackendProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
  });

  const canEdit = user?.role === 'owner';
  const isMountedRef = useRef(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    if (isOpen && !hasLoadedRef.current) {
      const loadProfile = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await profileService.getMe();
          const nextProfile = response.data?.user || (response as unknown as { user?: BackendProfile }).user;
          if (!response.success || !nextProfile) {
            throw new Error(response.message || 'Không tải được thông tin cá nhân');
          }

          if (isMountedRef.current) {
            setProfile(nextProfile);
            const nextUser = toUser(nextProfile, user);
            updateUser(nextUser);
            setFormData({
              fullName: nextUser.name || '',
              phone: nextUser.phone || '',
              bankName: nextUser.bankName || '',
              bankAccountNumber: nextUser.bankAccountNumber || '',
              bankAccountName: nextUser.bankAccountName || '',
            });
            hasLoadedRef.current = true;
          }
        } catch (err) {
          if (isMountedRef.current) {
            setError(err instanceof Error ? err.message : 'Không tải được thông tin cá nhân');
          }
        } finally {
          if (isMountedRef.current) {
            setLoading(false);
          }
        }
      };

      loadProfile();
    }

    return () => {
      isMountedRef.current = false;
      if (!isOpen) {
        hasLoadedRef.current = false;
      }
    };
  }, [isOpen, updateUser, user]);

  const handleSave = async () => {
    if (!canEdit) {
      onClose();
      return;
    }

    if (!formData.fullName.trim()) {
      setError('Họ tên là bắt buộc');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const response = await profileService.updateLandlord({
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim() || undefined,
        bank_name: formData.bankName.trim() || undefined,
        bank_account_number: formData.bankAccountNumber.trim() || undefined,
        bank_account_name: formData.bankAccountName.trim() || undefined,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Không cập nhật được thông tin cá nhân');
      }

      updateUser(toUser(response.data, user));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không cập nhật được thông tin cá nhân');
    } finally {
      setSaving(false);
    }
  };

  const displayProfile = profile ? toUser(profile, user) : user;

  return (
    <Modal
      isOpen={isOpen}
      title="Thông Tin Cá Nhân"
      onClose={onClose}
      onConfirm={canEdit ? handleSave : undefined}
      confirmText={saving ? 'Đang lưu...' : 'Lưu'}
      cancelText={canEdit ? 'Hủy' : 'Đóng'}
    >
      {loading && <Notice>Đang tải thông tin...</Notice>}
      {error && <ErrorText>{error}</ErrorText>}

      {displayProfile && (
        <Form onSubmit={(event) => event.preventDefault()}>
          <Grid>

            {canEdit ? (
              <>
                <FormGroup label="Họ tên" required>
                  <Input
                    value={formData.fullName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, fullName: event.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup label="Điện thoại">
                  <Input
                    value={formData.phone}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, phone: event.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup label="Ngân hàng">
                  <Input
                    value={formData.bankName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, bankName: event.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup label="Số tài khoản">
                  <Input
                    value={formData.bankAccountNumber}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, bankAccountNumber: event.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup label="Tên chủ tài khoản">
                  <Input
                    value={formData.bankAccountName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, bankAccountName: event.target.value })
                    }
                  />
                </FormGroup>
              </>
            ) : (
              <>
                <FormGroup label="Họ tên">
                  <ReadonlyValue>{displayProfile.name || 'N/A'}</ReadonlyValue>
                </FormGroup>
                <FormGroup label="Điện thoại">
                  <ReadonlyValue>{displayProfile.phone || 'N/A'}</ReadonlyValue>
                </FormGroup>
                <FormGroup label="Ngân hàng">
                  <ReadonlyValue>{displayProfile.bankName || 'N/A'}</ReadonlyValue>
                </FormGroup>
                <FormGroup label="Số tài khoản">
                  <ReadonlyValue>{displayProfile.bankAccountNumber || 'N/A'}</ReadonlyValue>
                </FormGroup>
                <FormGroup label="Tên chủ tài khoản">
                  <ReadonlyValue>{displayProfile.bankAccountName || 'N/A'}</ReadonlyValue>
                </FormGroup>
              </>
            )}
          </Grid>
        </Form>
      )}
    </Modal>
  );
};
