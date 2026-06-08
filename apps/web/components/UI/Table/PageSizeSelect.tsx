"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { LeftIcon } from "@/assets/icons";
import { useClickOutside } from "@/hooks/useClickOutside";
import { canUseDOM } from "@/utils/ui";
import {
  PageSizeMenu,
  PageSizeMenuItem,
  PaginationMetaSelectChevron,
  PaginationMetaSelectTrigger,
  PaginationMetaSelectWrap,
} from "./styles";

type PageSizeSelectProps = {
  value: number;
  options: readonly number[];
  onChange: (value: number) => void;
};

const MENU_GAP = 4;
const VIEWPORT_PADDING = 8;
const ESTIMATED_ITEM_HEIGHT = 36;

export default function PageSizeSelect({
  value,
  options,
  onChange,
}: PageSizeSelectProps) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight =
      menuRef.current?.offsetHeight ??
      options.length * ESTIMATED_ITEM_HEIGHT + 8;
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
    const spaceAbove = rect.top - VIEWPORT_PADDING;
    const shouldOpenUpward =
      spaceBelow < menuHeight + MENU_GAP && spaceAbove >= spaceBelow;

    const maxHeight = shouldOpenUpward
      ? Math.max(spaceAbove - MENU_GAP, 80)
      : Math.max(spaceBelow - MENU_GAP, 80);

    let top = shouldOpenUpward
      ? rect.top - menuHeight - MENU_GAP
      : rect.bottom + MENU_GAP;

    top = Math.max(
      VIEWPORT_PADDING,
      Math.min(top, window.innerHeight - menuHeight - VIEWPORT_PADDING),
    );

    setMenuStyle({
      position: "fixed",
      top,
      left: rect.left,
      minWidth: rect.width,
      maxHeight,
      overflowY: "auto",
      zIndex: 9999,
    });
  }, [options.length]);

  useLayoutEffect(() => {
    if (!open) return;

    updateMenuPosition();
    const frame = requestAnimationFrame(updateMenuPosition);
    return () => cancelAnimationFrame(frame);
  }, [open, updateMenuPosition, options]);

  useEffect(() => {
    if (!open) return;

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  useClickOutside({
    refs: [wrapRef, menuRef],
    enabled: open,
    handler: () => setOpen(false),
  });

  const menu =
    open && canUseDOM
      ? createPortal(
          <PageSizeMenu ref={menuRef} style={menuStyle} role="listbox">
            {options.map((size) => (
              <PageSizeMenuItem
                key={size}
                type="button"
                role="option"
                aria-selected={size === value}
                $active={size === value}
                onClick={() => {
                  onChange(size);
                  setOpen(false);
                }}
              >
                {size}
              </PageSizeMenuItem>
            ))}
          </PageSizeMenu>,
          document.body,
        )
      : null;

  return (
    <>
      <PaginationMetaSelectWrap ref={wrapRef}>
        <PaginationMetaSelectTrigger
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {value}
          <PaginationMetaSelectChevron $open={open}>
            <LeftIcon width={12} height={12} />
          </PaginationMetaSelectChevron>
        </PaginationMetaSelectTrigger>
      </PaginationMetaSelectWrap>
      {menu}
    </>
  );
}
