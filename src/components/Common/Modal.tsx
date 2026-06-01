import styled from 'styled-components';
import { theme } from '../../styles/theme';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    align-items: flex-end;
    padding: ${theme.spacing.sm};
  }
`;

const ModalContent = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  max-height: 90dvh;
  overflow-y: auto;
  box-shadow: ${theme.shadow.lg};
  display: flex;
  flex-direction: column;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    max-height: calc(100vh - 16px);
    max-height: calc(100dvh - 16px);
    border-radius: ${theme.radius.md} ${theme.radius.md} ${theme.radius.sm} ${theme.radius.sm};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.borderLight};

  h2 {
    margin: 0;
    color: ${theme.colors.dark};
    font-size: ${theme.fontSize.xl};

    @media (max-width: ${theme.breakpoints.mobile}) {
      font-size: ${theme.fontSize.lg};
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const ModalCloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  padding: 0;
  line-height: 1;
  transition: color ${theme.transition.base};

  &:hover {
    color: ${theme.colors.dark};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.lg};
  flex: 1;
  overflow-y: auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.borderLight};
  background-color: ${theme.colors.lightBg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{title}</h2>
          <ModalCloseBtn onClick={onClose}>×</ModalCloseBtn>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>{cancelText}</Button>
          {onConfirm && <Button variant="primary" onClick={onConfirm}>{confirmText}</Button>}
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

import { Button as ButtonComponent } from './Button';
const Button = ButtonComponent;
