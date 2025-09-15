import React from 'react'

const SearchResults = ({ query }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800">Search Results for: {query}</h2>
      {query.startsWith("0x") ? (
        <p className="text-gray-600">Looks like an Address or Transaction Hash</p>
      ) : !isNaN(query) ? (
        <p className="text-gray-600">Looks like a Block Number</p>
      ) : (
        <p className="text-gray-600">Maybe a Token or Domain Name</p>
      )}
    </div>
  )
}

export default SearchResults
