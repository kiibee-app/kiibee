import styled from "styled-components";

export type BadgeTone = "blue" | "green" | "amber";
type IconTone = "blue" | "purple" | "amber";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HeroCard = styled.section`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

export const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  color: ${({ theme }) => theme.colors.secondary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 600;
`;

export const HeroIdentity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Name = styled.h1`
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const Email = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const Badge = styled.span<{ $tone?: BadgeTone }>`
  width: fit-content;
  padding: 5px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme, $tone }) =>
    $tone === "green"
      ? theme.colors.neutral.GRAY_200
      : $tone === "amber"
        ? "#fff5df"
        : "#eef2ff"};
  color: ${({ theme, $tone }) =>
    $tone === "green"
      ? theme.colors.primary.GREEN_100
      : $tone === "amber"
        ? "#b66b00"
        : theme.colors.primary.BLUE};
`;

export const HeroHint = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  text-align: right;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.section`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
`;

export const IconBubble = styled.div<{ $tone?: IconTone }>`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $tone }) =>
    $tone === "purple"
      ? "#5b4cff"
      : $tone === "amber"
        ? "#c17700"
        : theme.colors.primary.BLUE};
  background: ${({ $tone }) =>
    $tone === "purple" ? "#f1efff" : $tone === "amber" ? "#fff6e7" : "#eef3ff"};
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const CardSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-left: none;
  border-right: none;
  border-top: none;
`;

export const FieldTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Label = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const Value = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.secondary.main};
  word-break: break-word;
`;

export const IconAction = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.muted};
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const StatusText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;
