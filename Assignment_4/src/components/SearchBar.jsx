import { useState } from 'react'

function SearchBar({ onSearch }) {
    const [input, setInput] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim()) {
            onSearch(input.trim())
            setInput('')
        }
    }

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                className="search-input"
                placeholder="Enter city (e.g., London)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="search-btn">Search</button>
        </form>
    )
}

export default SearchBar
