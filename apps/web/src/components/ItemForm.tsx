import { useState, type FormEvent } from 'react';
import { useCreateItem } from '../api/items';

export function ItemForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createItem = useCreateItem();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    createItem.mutate(
      { name, description: description || null },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
        },
      },
    );
  };

  return (
    <form className="item-form" onSubmit={onSubmit}>
      <input
        aria-label="Name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        aria-label="Description"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" disabled={createItem.isPending}>
        {createItem.isPending ? 'Adding…' : 'Add item'}
      </button>
      {createItem.error && (
        <p role="alert" className="error">
          {createItem.error.message}
        </p>
      )}
    </form>
  );
}
