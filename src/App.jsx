
import React, { useEffect, useState } from 'react';

const monday = window.mondaySdk();

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    monday.listen("context", res => {
      console.log("Monday context:", res);
    });

    monday.api(`query {
      boards(limit: 1) {
        items {
          id
          name
          column_values {
            id
            title
            text
          }
        }
      }
    }`).then(res => {
      setItems(res?.data?.boards[0]?.items || []);
      setLoading(false);
    });
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>📦 Inventory Dashboard</h1>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
          />{' '}
          Enable Read-Only Mode
        </label>
      </div>

      <input
        type="text"
        placeholder="Search products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: 8, width: '50%', marginBottom: 16 }}
      />

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 16,
                backgroundColor: '#f9f9f9'
              }}
            >
              <h3>{item.name}</h3>
              <ul>
                {item.column_values.map(col => (
                  <li key={col.id}><strong>{col.title}</strong>: {col.text}</li>
                ))}
              </ul>
              {!readOnly && (
                <div style={{ marginTop: 10 }}>
                  <input
                    type="number"
                    placeholder="Update Stock"
                    style={{ padding: 4, marginRight: 6 }}
                  />
                  <button style={{ padding: 4 }}>Update</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
