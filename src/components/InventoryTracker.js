import React, { useState, useEffect } from 'react';

const InventoryTracker = () => {
  const initialInventory = {
    common: [
      { name: 'Lithium Battery', required: 3 },
      { name: 'LED Light', required: 2 },
      { name: 'Printed Circuit Board', required: 3 },
    ],
    blue: [
      { name: 'Bucket of Paint', required: 5 },
      { name: 'Basic Ammo Production Part', required: 3 },
      { name: 'Intel Recorder', required: 1 },
      { name: 'Socket Adapter', required: 3 },
      { name: 'Military Power Bank', required: 3 },
      { name: 'Medical Alcohol', required: 3 },
      { name: 'Forehead Thermometer', required: 3 },
      { name: 'Gunpowder', required: 3 },
    ],
    purple: [
      { name: 'HiFi Sound Card', required: 3 },
      { name: 'Data Military Intel', required: 3 },
      { name: 'ASUS Motherboard', required: 3 },
      { name: 'Radio', required: 3 },
      { name: 'SSD', required: 6 },
      { name: 'RAM', required: 6 },
      { name: 'Ahsarah Specialty Flask', required: 1 },
      { name: 'Antler Wall Decoration', required: 2 },
      { name: 'Sarah Guard Confidential Files', required: 4 },
      { name: 'Blood Pressure Meter', required: 2 },
      { name: 'Ahsarah Glamour Hookah', required: 2 },
    ],
    gold: [
      { name: "Saeed's Pocket Watch", required: 1 },
      { name: 'Coffee', required: 2 },
      { name: 'SLR Camera', required: 2 },
      { name: 'Graphics Card', required: 1 },
      { name: 'Olivia Champagne', required: 1 },
      { name: 'Cell Phone', required: 2 },
      { name: 'CPU', required: 6 },
      { name: 'Merit Medal', required: 4 },
      { name: 'Ahsarah Specialty Wine Glass', required: 1 },
      { name: 'Shiny Pirate Gold Coin', required: 1 },
      { name: 'Military Explosive', required: 1 },
      { name: 'Pure Gold Lighter', required: 4 },
    ],
  };

  const [inventory, setInventory] = useState(() => {
    const stored = localStorage.getItem('inventory');
    if (stored) {
      return JSON.parse(stored);
    }
    return Object.keys(initialInventory).reduce((acc, category) => {
      acc[category] = initialInventory[category].map(item => ({
        ...item,
        current: 0,
        completed: false,
      }));
      return acc;
    }, {});
  });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('inventory', JSON.stringify(data));
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 2000);
  };

  const handleCurrentChange = (category, index, value) => {
    const newInventory = { ...inventory };
    const required = newInventory[category][index].required;
    newInventory[category][index].current = Math.min(required, Math.max(0, parseInt(value) || 0));
    newInventory[category][index].completed = 
      newInventory[category][index].current >= required;
    saveToLocalStorage(newInventory);
    setInventory(newInventory);
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      const resetData = Object.keys(inventory).reduce((acc, category) => {
        acc[category] = inventory[category].map(item => ({
          ...item,
          current: 0,
          completed: false,
        }));
        return acc;
      }, {});
      saveToLocalStorage(resetData);
      setInventory(resetData);
    }
  };

  const exportProgress = () => {
    try {
      const saveData = {};
      Object.entries(inventory).forEach(([category, items]) => {
        saveData[category] = items.map(item => ({
          name: item.name,
          current: item.current || 0
        }));
      });

      const jsonString = JSON.stringify(saveData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'zerohour-save.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setShowSaveAlert(true);
      setTimeout(() => setShowSaveAlert(false), 2000);
    } catch (error) {
      alert('Failed to export save file');
    }
  };

  const importProgress = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const saveData = JSON.parse(e.target.result);
        const newInventory = { ...inventory };
        Object.entries(saveData).forEach(([category, items]) => {
          if (newInventory[category]) {
            items.forEach(savedItem => {
              const itemIndex = newInventory[category].findIndex(
                item => item.name === savedItem.name
              );
              if (itemIndex !== -1) {
                newInventory[category][itemIndex].current = savedItem.current;
                newInventory[category][itemIndex].completed = 
                  savedItem.current >= newInventory[category][itemIndex].required;
              }
            });
          }
        });
        setInventory(newInventory);
        saveToLocalStorage(newInventory);
        event.target.value = '';
      } catch (error) {
        alert('Error loading save file. Please make sure it\'s a valid Zero Hour save file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Zero Hour Inventory Tracker</h1>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search items..."
          className="flex-1 px-4 py-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">All Items</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>

        <button
          onClick={exportProgress}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Export Save
        </button>

        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={importProgress}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Import Save
          </button>
        </div>

        <button
          onClick={resetProgress}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {showSaveAlert && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Progress saved successfully!
        </div>
      )}

      {Object.entries(inventory).map(([category, items]) => {
        // Filter items based on search and completion filter
        const filteredItems = items.filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
          const matchesFilter = 
            filter === 'all' || 
            (filter === 'completed' && item.completed) || 
            (filter === 'incomplete' && !item.completed);
          return matchesSearch && matchesFilter;
        });

        // Skip rendering empty sections when filtering
        if (filteredItems.length === 0 && search) return null;

        const categoryColor = {
          common: 'bg-green-200',
          blue: 'bg-sky-200',
          purple: 'bg-purple-200',
          gold: 'bg-yellow-200'
        }[category] || 'bg-gray-100';

        return (
          <div key={category} className={`mb-6 p-4 rounded-lg ${categoryColor}`}>
            <h2 className="text-xl font-semibold mb-4 capitalize">{category} Items</h2>
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.name}
                  className={`p-4 rounded-lg bg-white/50 ${
                    item.completed ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        Required: {item.required}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={item.current || ''}
                        onChange={(e) => handleCurrentChange(category, index, e.target.value)}
                        className="w-20 px-2 py-1 border rounded"
                        min="0"
                        max={item.required}
                      />
                      <div className={item.completed ? 'text-green-600' : 'text-gray-600'}>
                        {item.current}/{item.required}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryTracker;
