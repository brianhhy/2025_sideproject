import React, { useState } from "react";
import Sidebar from "./components/sidebar";

const App = () => {
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [subItems, setSubItems] = useState([]);

  const handleMenuItemClick = (menuItem, subItems) => {
    setActiveMenuItem(menuItem);
    setSubItems(subItems);
  };

  return (
    <div className="flex">
      <Sidebar onMenuItemClick={handleMenuItemClick} />
    </div>
  );
};

export default App;
