
function Filter({ priceFilter, setPriceFilter, categoryFilter, setCategoryFilter, setNameFilter }) {
  
    const handlePriceFilter = (e) => {
        setPriceFilter(e.target.value)
    }

    const handleCategoryFilter = (e) => {
        setCategoryFilter(e.target.value)
    }

    const handleNameFilter = (e) => {
        setNameFilter(e.target.value)
    }

    return (
    <div className="search-bars">
        <h1>Search Bars</h1>
        <label>Price:</label>
        <select name="price-filter" value={priceFilter} onChange={handlePriceFilter}>
            <option value="all">All</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
            <option value="$$$$">$$$$</option>
        </select>
        <br/>
        <label>Category:</label>
        <select name="category-filter" value={categoryFilter} onChange={handleCategoryFilter}>
            <option value="all">All</option>
            <option value="tavern">Tavern</option>
            <option value="pub">Pub</option>
            <option value="cocktail bar">Cocktail Bar</option>
            <option value="wine bar">Wine Bar</option>
            <option value="dive bar">Dive Bar</option>
            <option value="hotel bar">Hotel Bar</option>
        </select>
        <br/>
        <label>Name:</label>
        <input name="name-filter" placeholder="Search bar name" onChange={handleNameFilter}/>

    </div>
  )
}

export default Filter;