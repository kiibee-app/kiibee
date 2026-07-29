import styled from "styled-components";
import { ChevronDown } from "lucide-react";
import { media } from "@repo/ui/breakpoints";

export const CreatorSettingsPanel = styled.section`
  max-width: 720px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const CreatorSettingsForm = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(6)};

  ${media.mobileLg} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const CreatorSettingsTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondary.main};
  ${({ theme }) => theme.typography.H5_Medium};
`;

export const CreatorSettingsDescription = styled.p`
  margin: ${({ theme }) => `${theme.spacing(1)} 0 0`};
  color: ${({ theme }) => theme.colors.secondary.muted};
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const CreatorSettingsField = styled.div`
  display: flex;
  max-width: 360px;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(6)};

  ${media.mobileLg} {
    max-width: none;
  }
`;

export const CreatorSettingsLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.secondary.main};
  ${({ theme }) => theme.typography.Body_Medium};
`;

export const CreatorSettingsSelectWrapper = styled.div`
  position: relative;
`;

export const CreatorSettingsSelect = styled.select`
  width: 100%;
  min-height: ${({ theme }) => theme.spacing(10.5)};
  appearance: none;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 10px;
  outline: none;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.main};
  padding: ${({ theme }) => `0 ${theme.spacing(10)} 0 ${theme.spacing(3)}`};
  ${({ theme }) => theme.typography.Body_Medium};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.GREEN};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  }
`;

export const SelectChevron = styled(ChevronDown)`
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.spacing(3)};
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  pointer-events: none;
  transform: translateY(-50%);
`;

export const CreatorSettingsActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(8)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.secondary.border};
`;

export const CreatorSettingsSaveButton = styled.button`
  min-width: 96px;
  min-height: ${({ theme }) => theme.spacing(10.5)};
  border: 1px solid ${({ theme }) => theme.colors.primary.GREEN};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: ${({ theme }) => `0 ${theme.spacing(4)}`};
  ${({ theme }) => theme.typography.Body_SemiBold};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    background: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.neutral.PALE_GREEN};
    outline-offset: 2px;
  }

  ${media.mobileLg} {
    width: 100%;
  }
`;
