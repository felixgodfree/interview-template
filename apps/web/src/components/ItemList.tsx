import { useDeleteItem, useItems } from '../api/items';

export function ItemList() {
  const { data: items, isPending, error } = useItems();
  const deleteItem = useDeleteItem();

  if (isPending) return <p>Loading…</p>;
  if (error)
    return (
      <p role="alert" className="error">
        Failed to load items: {error.message}
      </p>
    );
  if (items.length === 0) return <p className="muted">No items yet.</p>;

  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            <strong>{item.name}</strong>
            {item.description && <p className="muted">{item.description}</p>}
          </div>
          <button
            className="secondary"
            onClick={() => deleteItem.mutate(item.id)}
            disabled={deleteItem.isPending}
            aria-label={`Delete ${item.name}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
