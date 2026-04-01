import styled from 'styled-components';

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
      <LogoImg src="/logo.png" alt="CC-BCK Manager Logo" $size={size} />
      {showText && <LogoText $size={size}>CC-BCK Manager</LogoText>}
    </LogoWrapper>
  );
};
