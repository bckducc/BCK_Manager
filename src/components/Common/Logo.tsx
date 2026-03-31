import styled from 'styled-components';

const LogoImg = styled.img`
  height: 40px;
  width: auto;
  object-fit: contain;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  white-space: nowrap;
`;

interface LogoProps {
  showText?: boolean;
}

export const Logo = ({ showText = true }: LogoProps) => {
  return (
    <LogoWrapper>
      <LogoImg src="/logo.png" alt="CC-BCK Manager Logo" />
      {showText && <LogoText>CC-BCK Manager</LogoText>}
    </LogoWrapper>
  );
};
