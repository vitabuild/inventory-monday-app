import React, { useEffect, useState } from 'react';
const monday = window.mondaySdk();

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [updatedStock, setUpdatedStock] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    monday.setToken("YOUR_API_TOKEN_IF_NEEDED");

    monday.api(`query {
      boards(limit:1) {
        id
        name
        items(limit: 1000) {
          id
          name
          board { id }
          column_values {
            id
            title
            text
          }
        }
      }
    }`).then((res) => {
      const items = res?.data?.boards[0]?.items || [];
      setItems(items);
      setLoading(false);
    });
  }, []);

  const handleStockChange = (itemId, value) => {
    setUpdatedStock({ ...updatedStock, [itemId]: value });
  };

  const submitStockUpdate = async (itemId) => {
    const newStock = updatedStock[itemId];
    if (!newStock || isNaN(newStock)) return;

    const item = items.find(i => i.id === itemId);
    const boardId = item?.board?.id;
    const itemName = item?.name || "";

    try {
      await monday.api(`mutation {
        change_column_value(
          board_id: ${boardId},
          item_id: ${itemId},
          column_id: "stock_value",
          value: "\"${newStock}\"
        ) {
          id
        }
      }`);

      await monday.api(`mutation {
        create_item(
          board_id: 1234567890,
          item_name: "Stock update for ${itemName}",
          column_values: "{\\\"item_id\\\": \\\"${itemId}\\\", \\\"new_stock\\\": \\\"${newStock}\\\", \\\"category\\\": \\\"${item.column_values.find(c => c.title === 'Tier 1 (Category)')?.text || ''}\\\", \\\"warehouse\\\": \\\"${item.column_values.find(c => c.title === 'Warehouse Location')?.text || ''}\\\", \\\"updated_at\\\": \\\"${new Date().toISOString()}\\\"}"
        ) {
          id
        }
      }`);

      setToast({ type: 'success', message: 'Stock updated and logged!' });
    } catch (error) {
      console.error("Update error", error);
      setToast({ type: 'error', message: 'Failed to update stock.' });
    }
  };

  const filteredItems = items.filter((item) => {
    const category = item.column_values.find(c => c.title === 'Tier 1 (Category)')?.text || '';
    const warehouse = item.column_values.find(c => c.title === 'Warehouse Location')?.text || '';
    const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const skuMatch = item.column_values.find(c => c.title === 'Item ID')?.text.includes(searchTerm);
    return (
      (!categoryFilter || category === categoryFilter) &&
      (!warehouseFilter || warehouse === warehouseFilter) &&
      (nameMatch || skuMatch)
    );
  });

  const uniqueCategories = [...new Set(items.map(item => item.column_values.find(c => c.title === 'Tier 1 (Category)')?.text).filter(Boolean))];
  const uniqueWarehouses = [...new Set(items.map(item => item.column_values.find(c => c.title === 'Warehouse Location')?.text).filter(Boolean))];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Dashboard</h1>

      {toast && (
        <div className={(toast.type === 'success' ? 'bg-green-600' : 'bg-red-600') + ' mb-4 p-2 rounded text-white'}>{toast.message}</div>
      )}

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Search by product name or SKU"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Categories</option>
          {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Warehouses</option>
          {uniqueWarehouses.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      {loading ? (
        <p>Loading items...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const minStock = parseInt(item.column_values.find(c => c.title === 'Minimum Stock Level')?.text || '0');
            const stockVal = parseFloat(item.column_values.find(c => c.title === 'Stock Value')?.text || '0');
            const outOfStock = stockVal <= minStock;

            return (
              <div key={item.id} className={'border p-4 rounded-xl shadow ' + (outOfStock ? 'bg-red-100' : 'bg-white')}>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <ul className="text-sm mt-2">
                  {item.column_values.map((col) => (
                    <li key={col.id}><strong>{col.title}</strong>: {col.text}</li>
                  ))}
                </ul>
                <div className="mt-2">
                  <input
                    type="number"
                    placeholder="New Stock Value"
                    value={updatedStock[item.id] || ''}
                    onChange={(e) => handleStockChange(item.id, e.target.value)}
                    className="border p-1 rounded w-2/3"
                  />
                  <button
                    onClick={() => submitStockUpdate(item.id)}
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
