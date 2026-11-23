import { ExistingCreatorsList } from "../../components/features/all-creators/ExistingCreatorsList";
import {
  ALL_CREATORS_TAB_KEYS,
  DEFAULT_ALL_CREATORS_TAB,
} from "../../utils/allCreators";

export default async function AllCreatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return (
    <ExistingCreatorsList
      initialTab={
        tab === ALL_CREATORS_TAB_KEYS.CLOSED
          ? ALL_CREATORS_TAB_KEYS.CLOSED
          : DEFAULT_ALL_CREATORS_TAB
      }
    />
  );
}
