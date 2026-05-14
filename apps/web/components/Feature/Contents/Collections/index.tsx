"use client";

import React from "react";
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
  isCollectionContentRow,
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
} from "@/utils/sortOptions";

type TableRow = CollectionRow | CollectionContentRow;

export default function CollectionTable(props: CollectionTableProps) {
  const isCollections = props.type === COLLECTION_TABLE_TYPE.COLLECTIONS;
  const columns = isCollections
    ? COLLECTION_COLUMNS
    : COLLECTION_CONTENT_COLUMNS;

  const handleRowClick = isCollections
    ? (row: TableRow) => {
        props.onRowClick?.(row as CollectionRow);
      }
    : undefined;

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
      if (value === MOVE_UP) {
        props.onMoveUp?.(id);
        return;
      }

      if (value === MOVE_DOWN) {
        props.onMoveDown?.(id);
        return;
      }

      if (value === MOVE_SETTINGS) {
        props.onSettings?.(id);
      }
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
            options={actionOptions}
            allowNoSelection
            compact
            dropdownWidth="196px"
            maxWidth="196px"
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
    <Table<TableRow>
      headers={columns.map((c) => c.label)}
      data={props.data}
      rowsPerPage={10}
      onRowClick={handleRowClick}
      headerToKey={(header) => {
        const col = columns.find((c) => c.label === header);
        return col?.key as keyof TableRow;
      }}
      getRowKey={(row) => row.id}
      getColumnAlignment={(_header, index) =>
        index === 0 ? TABLE_ALIGN.LEFT : TABLE_ALIGN.CENTER
      }
      isHeaderSortable={() => false}
      onHeaderClick={() => {}}
      getHeaderSortDirection={() => null}
      renderCell={({ header, row }) => {
        const col = columns.find((c) => c.label === header);

        if (col?.key === columns[0].key) {
          return (
            <NameWrapper>
              {isCollections ? (
                <FolderIcon />
              ) : isCollectionContentRow(row) ? (
                getCollectionContentIcon(row.contentType)
              ) : null}

              <MonoText $use="Body_SemiBold">{row.name}</MonoText>
            </NameWrapper>
          );
        }

        if (col?.key === COLLECTION_COLUMNS[3].key) {
          return renderActions(row.id, isCollections);
        }

        const key = col?.key as keyof TableRow;

        return (
          <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY}>
            {row[key]}
          </MonoText>
        );
      }}
    />
  );
}
