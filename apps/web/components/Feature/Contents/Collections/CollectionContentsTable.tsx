"use client";

import React from "react";
import Table from "@/components/UI/Table";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { DeleteIcon, EditProfileIcon, ThreeDotIcon } from "@/assets/icons";
import { COLLECTION_CONTENT_COLUMNS } from "@/utils/tableHeader";
import { TABLE_ALIGN } from "@/utils/ui";
import {
  CollectionContentRow,
  getCollectionContentIcon,
  NAME,
  VISIBILITY,
} from "@/utils/dummyData/collection";
import { ActionWrapper, IconButton, NameWrapper } from "./styles";

type CollectionContentsTableProps = {
  data: CollectionContentRow[];
};

export default function CollectionContentsTable({
  data,
}: CollectionContentsTableProps) {
  return (
    <Table<CollectionContentRow>
      headers={COLLECTION_CONTENT_COLUMNS.map((column) => column.label)}
      data={data}
      rowsPerPage={10}
      headerToKey={(header) => {
        const column = COLLECTION_CONTENT_COLUMNS.find(
          (item) => item.label === header,
        );
        return column?.key as keyof CollectionContentRow;
      }}
      getRowKey={(row) => row.id}
      getColumnAlignment={(_header, index) =>
        index === 0 ? TABLE_ALIGN.LEFT : TABLE_ALIGN.CENTER
      }
      isHeaderSortable={() => false}
      onHeaderClick={() => {}}
      getHeaderSortDirection={() => null}
      renderCell={({ header, row }) => {
        const column = COLLECTION_CONTENT_COLUMNS.find(
          (item) => item.label === header,
        );

        if (column?.key === NAME) {
          return (
            <NameWrapper>
              {getCollectionContentIcon(row.contentType)}
              <MonoText $use="Body_SemiBold">{row.name}</MonoText>
            </NameWrapper>
          );
        }

        if (column?.key === VISIBILITY) {
          return (
            <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY}>
              {row.visibility}
            </MonoText>
          );
        }

        if (header === COLLECTION_CONTENT_COLUMNS[3].label) {
          return (
            <ActionWrapper>
              <IconButton
                type="button"
                onClick={(event) => event.stopPropagation()}
              >
                <EditProfileIcon color={COLORS.neutral.GRAY} />
              </IconButton>
              <IconButton
                type="button"
                onClick={(event) => event.stopPropagation()}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                type="button"
                onClick={(event) => event.stopPropagation()}
              >
                <ThreeDotIcon />
              </IconButton>
            </ActionWrapper>
          );
        }

        return (
          <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY}>
            {row.createdAt}
          </MonoText>
        );
      }}
    />
  );
}
