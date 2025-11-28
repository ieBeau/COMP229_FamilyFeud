/**
 * @file SearchBar.jsx
 * @author Pierre Moreau
 * @since 2025-11-27
 * @purpose Search bar component for filtering content.
*/
export const SearchType = Object.freeze({
    DEFAULT: 'default',
    ACCOUNTS: 'accounts',
    QUESTIONS: 'questions'
});

export default function SearchBar({ placeholder, type = Object.values(SearchType)[0], data = [], setData }) {
    const handleChange = (e) => {
        const query = e.target.value.trim().toLowerCase();

        if (!query) {
            setData(data);
            return;
        }

        let filteredData = data;

        switch (type) {
            case SearchType.ACCOUNTS:
                filteredData = filteredData.filter(d =>
                    d?.username?.toLowerCase().includes(query) || // Search by username
                    d?.email?.toLowerCase().includes(query) || // Search by email
                    d?._id.includes(e.target.value.trim()) // Search by ID
                );
                break;
            case SearchType.QUESTIONS:
                filteredData = filteredData.filter(d =>
                    d?.text?.toLowerCase().includes(query) || // Search by question text
                    (d?.tags && d.tags.some(tag => tag.toLowerCase().includes(query))) || // Search by tags
                    d?._id.includes(e.target.value.trim()) // Search by ID
                );
                break;
            default:
                filteredData = filteredData.filter(d =>
                    JSON.stringify(d).toLowerCase().includes(query)
                );
                break;
        }

        setData(filteredData);
    };

    return (
        <input
            className="search-bar"
            type="search"
            placeholder={placeholder}
            onChange={handleChange}
        />
    );
}
