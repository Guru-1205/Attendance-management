import React, { useState } from 'react';

const SearchComponent = ({ data, searchKey, setSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter the data based on the search term
    const filteredResults = data.filter((item) =>
      item[searchKey].toLowerCase().includes(value.toLowerCase())
    );

    // Set the filtered results
    setSearchResults(filteredResults);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchComponent;
