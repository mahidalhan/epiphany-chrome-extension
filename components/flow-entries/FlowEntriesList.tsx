/**
 * FlowEntriesList - Container for flow entry items with dividers.
 *
 * Design specs from Figma:
 * - Container: gap-[10px]
 * - Divider: 1px line between entries (not after last)
 */

import { FlowEntryItem } from './FlowEntryItem';
import { Divider } from '@/components/shared/Divider';
import type { FlowEntry } from '@/types/flow';

interface FlowEntriesListProps {
  /** Array of flow entries */
  entries: FlowEntry[];
}

export function FlowEntriesList({ entries }: FlowEntriesListProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {entries.map((entry, index) => (
        <div key={entry.id}>
          <FlowEntryItem entry={entry} />
          {/* Add divider between entries (not after last) */}
          {index < entries.length - 1 && <Divider className="mt-2.5" />}
        </div>
      ))}
    </div>
  );
}

export default FlowEntriesList;
