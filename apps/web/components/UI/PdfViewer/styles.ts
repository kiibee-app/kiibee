import styled from "styled-components";

export const Reader = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  color: #343b35;
  background: #eceeed;
  iframe {
    flex: 1;
    width: 100%;
    border: 0;
  }
`;
export const Toolbar = styled.div`
  flex-shrink: 0;
  min-height: 52px;
  padding: 10px 52px 10px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-bottom: 1px solid #dce0dc;
  font-size: 13px;
  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
  }
  @media (max-width: 600px) {
    gap: 8px;
    padding-left: 12px;
    > span {
      max-width: 28%;
    }
  }
`;
export const PageControls = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  span {
    min-width: 48px;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-size: 12px;
    color: #525b53;
  }
  button,
  select {
    height: 28px;
    border: 1px solid #e1e5e1;
    border-radius: 6px;
    background: #f7f9f7;
    color: inherit;
    cursor: pointer;
  }
  button {
    width: 26px;
    font-size: 21px;
    line-height: 1;
  }
  button:disabled {
    opacity: 0.35;
    cursor: default;
  }
  button:focus-visible,
  select:focus-visible {
    outline: 2px solid #8eae7a;
    outline-offset: 2px;
  }
  select {
    padding: 0 6px;
    font-size: 12px;
    max-width: 100px;
  }
  @media (max-width: 480px) {
    gap: 4px;
    select {
      max-width: 84px;
    }
  }
`;
export const ScrollArea = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 24px 16px;
  scrollbar-width: thin;
  scrollbar-color: #a5aea6 transparent;
`;
export const Page = styled.div`
  position: relative;
  max-width: 100%;
  margin: 0 auto 24px;
  background: #fff;
  color: #222;
  box-shadow: 0 2px 12px #26352a1f;
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
  .textLayer {
    position: absolute;
    inset: 0;
  }
`;
export const PageLabel = styled.span`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  color: #667068;
  font-size: 10px;
`;
export const Status = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  text-align: center;
  button {
    cursor: pointer;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid #aaa;
  }
`;
