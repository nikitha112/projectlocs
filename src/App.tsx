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

import { Item, ItemType, Category } from "./types";
import { findPotentialMatches } from "./utils/matching";

// Mock data
const mockItems: Item[] = [
  // ... your mock items here
];

function App() {
  // ----------------- STATE -----------------
  const [darkMode, setDarkMode] = useState(false);
  const [items, setItems] = useState<Item[]>(mockItems);
  const [filteredItems, setFilteredItems] = useState<Item[]>(mockItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ItemType>("lost");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedType, setSelectedType] = useState<ItemType | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showMapView, setShowMapView] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info" | "warning";
  } | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<Item[]>([]);

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
  const handleReportItem = (newItem: Omit<Item, "id" | "dateReported">) => {
    const item: Item = {
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

  const openModal = (type: ItemType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleItemClick = (item: Item) => {
    const matches = findPotentialMatches(item, items);
    setPotentialMatches(matches);
    setSelectedItem(item);
  };

  const handleClaimItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: "claimed" as const } : item))
    );
    setSelectedItem(null);
    setNotification({ message: "Item has been marked as claimed successfully.", type: "success" });
  };

  // ----------------- RENDER -----------------
  return (
    <Router>
      <div className={`min-h-screen transition-colors ${darkMode ? "bg-gray-900 text-gray-100" : "bg-blue-50 text-gray-900"}`}>
        <Header onReportClick={openModal} darkMode={darkMode} setDarkMode={setDarkMode} />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero onReportClick={openModal} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <SearchFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={(cat) => setSelectedCategory(cat as Category | "all")}
                    selectedType={selectedType}
                    onTypeChange={(type) => setSelectedType(type as ItemType | "all")}
                    onMapView={() => setShowMapView(!showMapView)}
                  />
                  <ItemGrid items={filteredItems} onItemClick={handleItemClick} />
                </div>
              </>
            }
          />
          <Route path="/browse-items" element={<BrowseItems items={items} onItemClick={handleItemClick} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>

        <Footer />

        {isModalOpen && <ReportModal type={modalType} onClose={() => setIsModalOpen(false)} onSubmit={handleReportItem} />}
        {selectedItem && (
          <ItemDetails
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onClaim={handleClaimItem}
            potentialMatches={potentialMatches}
          />
        )}
        {showMapView && <MapView items={filteredItems} onClose={() => setShowMapView(false)} onItemClick={handleItemClick} />}
        {notification && <NotificationToast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </div>
    </Router>
  );
}

export default App;
