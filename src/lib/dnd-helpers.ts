import { arrayMove } from '@dnd-kit/sortable'

/**
 * Given the current items array and the active/over IDs from a DragEndEvent,
 * returns the reordered array and the {id, sort_order} updates for the server.
 */
export function computeReorder<T extends { id: string }>(
  items: T[],
  activeId: string,
  overId: string
): { reordered: T[]; updates: { id: string; sort_order: number }[] } {
  const oldIndex = items.findIndex((item) => item.id === activeId)
  const newIndex = items.findIndex((item) => item.id === overId)

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return { reordered: items, updates: [] }
  }

  const reordered = arrayMove(items, oldIndex, newIndex)
  const updates = reordered.map((item, index) => ({
    id: item.id,
    sort_order: index + 1,
  }))

  return { reordered, updates }
}
