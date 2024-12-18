import React from "react";

const SearchMarker = ({ search, name }: { search: string; name: string }) => {
  const regex = new RegExp(`(${search})`, "gi"); // Create a regex to match the search term case-insensitively
  const parts = name.split(regex); // Split the string by the search term
  return (
    <div className="">
      {parts.map((part, index) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <span key={index} className="bg-yellow-200">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </div>
  );
};

export default SearchMarker;
