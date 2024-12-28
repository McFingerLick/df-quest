// Remove the import statements at the top
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

  const [inventory, setInventory] = React.useState(() => {
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

  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [showSaveAlert, setShowSaveAlert] = React.useState(false);

  // ... [rest of the component code remains the same] ...

  return (
    // ... [JSX remains the same] ...
  );
};

// Render the component
ReactDOM.render(
  <InventoryTracker />,
  document.getElementById('root')
);
