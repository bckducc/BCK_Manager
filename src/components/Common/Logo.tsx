import styled from 'styled-components';
import logo from '../../assets/images/logo.png';

const LogoImg = styled.img<{ $size?: 'sm' | 'md' | 'lg' }>`
  height: ${(p) => {
    switch (p.$size) {
      case 'sm':
        return '40px';
      case 'lg':
        return '80px';
      default:
        return '60px';
    }
  }};
  width: auto;
  object-fit: contain;
`;

const LogoFallback = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(p) => {
    switch (p.$size) {
      case 'sm':
        return '40px';
      case 'lg':
        return '80px';
      default:
        return '60px';
    }
  }};
  width: ${(p) => {
    switch (p.$size) {
      case 'sm':
        return '40px';
      case 'lg':
        return '80px';
      default:
        return '60px';
    }
  }};
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 8px;
  color: white;
  font-weight: bold;
  font-size: ${(p) => {
    switch (p.$size) {
      case 'sm':
        return '0.7rem';
      case 'lg':
        return '1.2rem';
      default:
        return '0.9rem';
    }
  }};
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoText = styled.span<{ $size?: 'sm' | 'md' | 'lg' }>`
  font-size: ${(p) => {
    switch (p.$size) {
      case 'sm':
        return '0.9rem';
      case 'lg':
        return '1.25rem';
      default:
        return '1.1rem';
    }
  }};
  font-weight: 700;
  white-space: nowrap;
`;

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ showText = true, size = 'lg' }: LogoProps) => {
  return (
    <LogoWrapper>
      <LogoImg src={logo} alt="CC-BCK Manager Logo" $size={size} />
      {showText && <LogoText $size={size}>CC-BCK Manager</LogoText>}
    </LogoWrapper>
  );
};
