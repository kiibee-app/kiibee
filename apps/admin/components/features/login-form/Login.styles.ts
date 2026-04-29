"use client";

import styled from "styled-components";

export const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg.app};
  padding: 16px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme.colors.bg.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 32px;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

export const IconWrap = styled.div`
  width: 130px;
  height: 52px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.brand.dark};
  color: ${({ theme }) => theme.colors.bg.white};
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text.main};
`;

export const Subtitle = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 14px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.text.main};
  font-size: 14px;
  font-weight: 500;
`;

export const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 42px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg.white};
  color: ${({ theme }) => theme.colors.text.main};
  padding: 0 14px;
  font-size: 14px;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.dark};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.brand.dark};
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.brand.dark};
  color: ${({ theme }) => theme.colors.bg.white};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 150ms ease;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const Form = styled.form`
  display: grid;
  gap: 20px;
`;

export const Field = styled.div``;

export const ErrorBox = styled.div`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.brand.light};
  background: ${({ theme }) => theme.colors.brand.lightest};
  color: ${({ theme }) => theme.colors.text.main};
  padding: 12px 14px;
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const ErrorText = styled.p`
  margin: 0;
`;

export const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  display: inline-block;
  animation: spin 700ms linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
