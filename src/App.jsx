import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import ItemGrid from "./components/ItemGrid";
import ReportModal from "./components/ReportModal";
import SearchFilters from "./components/SearchFilters";
import Footer from "./components/Footer";
import ItemDetails from "./components/ItemDetails";
import MapView from "./components/MapView";
import NotificationToast from "./components/NotificationToast";
import BrowseItems from "./components/BrowseItems";
import Contact from "./components/Contact";
import HowItWorks from "./components/HowItWorks";

import { findPotentialMatches } from "./utils/matching";

// Mock data
const mockItems = [
  // ... your mock items here
];

function App() {
  // ----------------- STATE -----------------
  const [darkMode, setDarkMode] = useState(false);
  const [items, setItems] = useState(mockItems);
  const [filteredItems, setFilteredItems] = useState(mockItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("lost");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showMapView, setShowMapView] = useState(false);
  const [notification, setNotification] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);

  // ----------------- DARK MODE -----------------
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ----------------- FILTERING -----------------
  useEffect(() => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") filtered = filtered.filter((item) => item.category === selectedCategory);
    if (selectedType !== "all") filtered = filtered.filter((item) => item.type === selectedType);
    if (dateFrom) filtered = filtered.filter((item) => item.dateReported >= dateFrom);
    if (dateTo) filtered = filtered.filter((item) => item.dateReported <= dateTo);

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory, selectedType, dateFrom, dateTo]);

  // ----------------- HANDLERS -----------------
  const handleReportItem = (newItem) => {
    const item = {
      ...newItem,
      id: Date.now().toString(),
      dateReported: new Date().toISOString().split("T")[0],
      status: "active",
    };
    const matches = findPotentialMatches(item, items);
    setItems((prev) => [item, ...prev]);
    setIsModalOpen(false);

    setNotification(
      matches.length > 0
        ? {
            message: `Great news! We found ${matches.length} potential match${matches.length > 1 ? "es" : ""} for your ${item.type} item.`,
            type: "info",
          }
        : { message: `Your ${item.type} item has been reported successfully.`, type: "success" }
    );
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    const matches = findPotentialMatches(item, items);
    setPotentialMatches(matches);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
    setPotentialMatches([]);
  };

  const handleResolveItem = (itemId) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, status: "resolved" } : item
    ));
    setNotification({
      message: "Item marked as resolved!",
      type: "success",
    });
  };

  // ----------------- RENDER -----------------
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          onReportClick={(type) => {
            setModalType(type);
            setIsModalOpen(true);
          }}
        />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <Hero onSearch={setSearchQuery} />
                  <SearchFilters
                    onCategoryChange={setSelectedCategory}
                    onTypeChange={setSelectedType}
                    onDateFromChange={setDateFrom}
                    onDateToChange={setDateTo}
                    onViewToggle={setShowMapView}
                    showMapView={showMapView}
                  />
                  {showMapView ? (
                    <MapView items={filteredItems} onItemClick={handleItemClick} />
                  ) : (
                    <ItemGrid 
                      items={filteredItems} 
                      onItemClick={handleItemClick}
                      onResolve={handleResolveItem}
                    />
                  )}
                </>
              } 
            />
            <Route path="/browse" element={<BrowseItems />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>

          {selectedItem && (
            <ItemDetails 
              item={selectedItem} 
              onClose={handleCloseDetails}
              potentialMatches={potentialMatches}
              onResolve={handleResolveItem}
            />
          )}
        </main>

        <Footer />
      </div>

      <ReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={modalType}
        onSubmit={handleReportItem}
      />

      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </Router>

      <ReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={modalType}
        onSubmit={handleReportItem}
      />

      {notification && (
        <NotificationToast
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
        />
      )}
  );
}

}

export default App;
