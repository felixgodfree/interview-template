import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';

export function App() {
  return (
    <main className="container">
      <h1>Items</h1>
      <ItemForm />
      <ItemList />
    </main>
  );
}
