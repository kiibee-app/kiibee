"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/UI/Table";
import SortDropdown from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import {
  DeleteIcon,
  EditProfileIcon,
  FolderIcon,
  ThreeDotIcon,
} from "@/assets/icons";
import { TABLE_ALIGN } from "@/utils/ui";
import { BUTTON } from "@/utils/Constants";
import { ActionWrapper, IconButton, NameWrapper } from "./styles";
import {
  CollectionRow,
  CollectionContentRow,
  CollectionTableProps,
} from "@/types/collectionsType";
import {
  COLLECTION_TABLE_TYPE,
  getCollectionContentIcon,
} from "@/utils/collection";
import {
  COLLECTION_COLUMNS,
  COLLECTION_CONTENT_COLUMNS,
} from "@/utils/tableHeader";
import { SORT_DROPDOWN_VARIANT } from "@/utils/Constants";
import {
  MOVE_UP,
  MOVE_DOWN,
  MOVE_SETTINGS,
  RowAction,
  actionOptions,
  MOVE_TO_ANOTHER_COLLECTION,
  contentActionOptions,
} from "@/utils/sortOptions";
import { CONTENTS } from "@/utils/translationKeys";

type TableRowSchema = Partial<CollectionRow> &
  Partial<CollectionContentRow> & { Actions?: string };

export default function CollectionTable(props: CollectionTableProps) {
  const { t } = useTranslation();
  const isCollections = props.type === COLLECTION_TABLE_TYPE.COLLECTIONS;
  const columns = isCollections
    ? COLLECTION_COLUMNS
    : COLLECTION_CONTENT_COLUMNS;

  const isContentRow = (r: TableRowSchema): r is CollectionContentRow => {
    return "contentType" in r && r.contentType !== undefined;
  };

  const isCollectionRow = (r: TableRowSchema): r is CollectionRow => {
    return "contentsCount" in r && typeof r.contentsCount === "number";
  };

  const handleRowClick = (row: TableRowSchema) => {
    if (isCollections && isCollectionRow(row)) {
      props.onRowClick?.(row);
      return;
    }

    if (!isCollections && isContentRow(row)) {
      props.onRowClick?.(row);
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    stopPropagation(e);
    props.onEdit?.(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    stopPropagation(e);
    props.onDelete?.(id);
  };

  const handleMore = (e: React.MouseEvent, id: string) => {
    stopPropagation(e);
    props.onMore?.(id);
  };

  const renderActions = (id: string, showDropdown: boolean) => {
    const handleActionSelect = (value: RowAction) => {
      const actionHandlers: Partial<Record<RowAction, () => void>> = {
        [MOVE_UP]: () => props.onMoveUp?.(id),
        [MOVE_DOWN]: () => props.onMoveDown?.(id),
        [MOVE_SETTINGS]: () => {
          if (isCollections) {
            props.onSettings?.(id);
          }
        },
        [MOVE_TO_ANOTHER_COLLECTION]: () => props.onMore?.(id),
      };

      actionHandlers[value]?.();
    };

    return (
      <ActionWrapper>
        <IconButton type={BUTTON} onClick={(e) => handleEdit(e, id)}>
          <EditProfileIcon color={COLORS.neutral.GRAY} />
        </IconButton>

        <IconButton type={BUTTON} $danger onClick={(e) => handleDelete(e, id)}>
          <DeleteIcon />
        </IconButton>

        {showDropdown ? (
          <SortDropdown<RowAction>
            options={isCollections ? actionOptions : contentActionOptions}
            allowNoSelection
            compact
            dropdownWidth={isCollections ? "196px" : "250px"}
            maxWidth={isCollections ? "196px" : "250px"}
            variant={SORT_DROPDOWN_VARIANT.SURFACE}
            trigger={<ThreeDotIcon />}
            onChange={handleActionSelect}
          />
        ) : (
          <IconButton type={BUTTON} onClick={(e) => handleMore(e, id)}>
            <ThreeDotIcon />
          </IconButton>
        )}
      </ActionWrapper>
    );
  };

  return (
    <Table<TableRowSchema>
      headers={columns.map((c) => c.label)}
      data={props.data}
      rowsPerPage={10}
      onRowClick={handleRowClick}
      headerToKey={(header) => {
        const col = columns.find((c) => c.label === header);
        if (col) {
          const key = col.key;
          if (
            key === "name" ||
            key === "contentsCount" ||
            key === "createdAt" ||
            key === "Actions" ||
            key === "visibility"
          ) {
            return key;
          }
        }
        return "name";
      }}
      getRowKey={(row) => row.id ?? "unknown-id"}
      getColumnAlignment={(_header, index) =>
        index === 0 ? TABLE_ALIGN.LEFT : TABLE_ALIGN.CENTER
      }
      isHeaderSortable={() => false}
      onHeaderClick={() => {}}
      getHeaderSortDirection={() => null}
      renderCell={({ header, row }) => {
        const col = columns.find((c) => c.label === header);
        if (!col) return null;

        if (col.key === columns[0].key) {
          return (
            <NameWrapper>
              {isCollections ? (
                <FolderIcon />
              ) : isContentRow(row) ? (
                getCollectionContentIcon(row.contentType)
              ) : null}

              <MonoText $use="Body_SemiBold">{row.name ?? "Untitled"}</MonoText>
            </NameWrapper>
          );
        }

        if (col.key === COLLECTION_COLUMNS[3].key) {
          return renderActions(
            row.id ?? "unknown-id",
            isCollections || props.type === COLLECTION_TABLE_TYPE.CONTENTS,
          );
        }

        if (isContentRow(row)) {
          if (col.key === "visibility") {
            const vis = row.visibility.toLowerCase();
            const label =
              vis === "public"
                ? t(CONTENTS.general.public)
                : vis === "hidden" || vis === "private"
                  ? t(CONTENTS.general.private)
                  : row.visibility;

            return (
              <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY}>
                {label}
              </MonoText>
            );
          }

          if (col.key === "createdAt") {
            return (
              <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY}>
                {row.createdAt}
              </MonoText>
            );
          }
        } else if (isCollectionRow(row)) {
          if (col.key === "contentsCount") {
            return (
              <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY}>
                {row.contentsCount}
              </MonoText>
            );
          }

          if (col.key === "createdAt") {
            return (
              <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY}>
                {row.createdAt}
              </MonoText>
            );
          }
        }

        return null;
      }}
    />
  );
}
