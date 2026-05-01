"use client";

import React from "react";
import { MonoText } from "@/components/UI/Monotext";
import Table from "@/components/UI/Table";
import COLORS from "@repo/ui/colors";
import { ActionWrapper, IconButton, NameWrapper } from "./styles";
import {
  CollectionRow,
  CollectionsTableProps,
} from "@/utils/dummyData/collection";
import { COLLECTION_COLUMNS } from "@/utils/tableHeader";
import { TABLE_ALIGN } from "@/utils/ui";
import {
  DeleteIcon,
  EditProfileIcon,
  FolderIcon,
  ThreeDotIcon,
} from "@/assets/icons";

export default function CollectionsTable({
  data,
  onEdit,
  onDelete,
  onMore,
}: CollectionsTableProps) {
  return (
    <Table<CollectionRow>
      headers={[...COLLECTION_COLUMNS.map((c) => c.label)]}
      data={data}
      rowsPerPage={10}
      headerToKey={(header) => {
        const col = COLLECTION_COLUMNS.find((c) => c.label === header);
        return col?.key as keyof CollectionRow;
      }}
      getRowKey={(row) => row.id}
      getColumnAlignment={(_header, index) =>
        index === 0 ? TABLE_ALIGN.LEFT : TABLE_ALIGN.CENTER
      }
      getMobileTitle={(row) => row.name}
      isHeaderSortable={() => false}
      onHeaderClick={() => {}}
      getHeaderSortDirection={() => null}
      renderCell={({ header, row }) => {
        const col = COLLECTION_COLUMNS.find((c) => c.label === header);

        if (col?.key === COLLECTION_COLUMNS[0].key) {
          return (
            <NameWrapper>
              <FolderIcon />
              <MonoText $use="Body_SemiBold">{row.name}</MonoText>
            </NameWrapper>
          );
        }

        if (header === COLLECTION_COLUMNS[3].label) {
          return (
            <ActionWrapper>
              <IconButton onClick={() => onEdit?.(row.id)}>
                <EditProfileIcon color={COLORS.neutral.GRAY} />
              </IconButton>
              <IconButton onClick={() => onDelete?.(row.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => onMore?.(row.id)}>
                <ThreeDotIcon />
              </IconButton>
            </ActionWrapper>
          );
        }

        const key = col?.key as keyof CollectionRow;

        return (
          <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY}>
            {row[key]}
          </MonoText>
        );
      }}
    />
  );
}
