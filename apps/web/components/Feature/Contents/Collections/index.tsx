"use client";

import React from "react";
import Table from "@/components/UI/Table";
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
} from "@/types/collections";
import {
  COLLECTION_TABLE_TYPE,
  getCollectionContentIcon,
} from "@/utils/collection";
import {
  COLLECTION_COLUMNS,
  COLLECTION_CONTENT_COLUMNS,
} from "@/utils/tableHeader";

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

        if (header === COLLECTION_COLUMNS[3].label) {
          return (
            <ActionWrapper>
              <IconButton
                type={BUTTON}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onEdit?.(row.id);
                }}
              >
                <EditProfileIcon color={COLORS.neutral.GRAY} />
              </IconButton>

              <IconButton
                type={BUTTON}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onDelete?.(row.id);
                }}
              >
                <DeleteIcon />
              </IconButton>

              <IconButton
                type={BUTTON}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onMore?.(row.id);
                }}
              >
                <ThreeDotIcon />
              </IconButton>
            </ActionWrapper>
          );
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
