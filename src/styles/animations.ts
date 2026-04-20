import { css } from 'styled-components';

export const pageEnterAnimation = css`
  @keyframes pageEnter {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  animation: pageEnter 0.4s ease-out;
`;

export const pageExitAnimation = css`
  @keyframes pageExit {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }

  animation: pageExit 0.3s ease-in forwards;
`;

export const fadeInAnimation = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  animation: fadeIn 0.3s ease-out;
`;

export const slideInLeftAnimation = css`
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  animation: slideInLeft 0.4s ease-out;
`;

export const slideInRightAnimation = css`
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  animation: slideInRight 0.4s ease-out;
`;

export const scaleInAnimation = css`
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  animation: scaleIn 0.3s ease-out;
`;
