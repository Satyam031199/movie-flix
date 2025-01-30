import { MdClear } from "react-icons/md";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} />
        <MdClear className="text-white w-6 h-6 cursor-pointer" onClick={(e) => setSearchTerm("")}/>
      </div>
    </div>
  );
};

export default Search;
