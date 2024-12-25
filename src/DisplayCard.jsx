import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';

// Card component
const DisplayCard = ({ item }) => (
  <div className="w-[300px] h-[400px] m-4 rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="flex flex-col space-y-1.5 p-6">
      <div className="text-2xl font-semibold leading-none tracking-tight">{item.name}</div>
      <div className="text-sm text-muted-foreground">{item.price}</div>
    </div>
    <div className="p-6 pt-0 flex flex-col items-center">
      <img src={item.image} alt={item.name} className="w-32 h-32 object-contain mb-4" />
      <div className="flex items-center">
        <Star className="w-5 h-5 text-yellow-400 mr-1" />
        <span>{item.rating.average.toFixed(1)} ({item.rating.reviews} reviews)</span>
      </div>
    </div>
  </div>
);

// Main CardComponent
const CardComponent = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setfilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://api.sampleapis.com/beers/ale'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items data:', error);
        setError('Failed to fetch items data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter(items =>
      items.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'price') {
        return parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1));
      } else if (sortBy === 'rating') {
        return b.rating.average - a.rating.average;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    setfilteredItems(sorted);
  }, [searchTerm, sortBy, items]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        <span className="text-xl">Loading Items...</span>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex gap-4 justify-center">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 "
        />
        <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
        </select>
      </div>
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-500">No items found matching your search.</p>
      ) : (
        <div className="flex flex-wrap justify-center">
          {filteredItems.map(item => (
            <DisplayCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardComponent;

