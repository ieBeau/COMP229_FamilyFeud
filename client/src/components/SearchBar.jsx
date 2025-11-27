/**
 * @file SearchBar.jsx
 * @author Pierre Moreau
 * @since 2025-11-27
 * @purpose Search bar component for filtering content.
*/
export default function SearchBar({ placeholder, data, setData }) {
    return (
        <input 
            className="search-bar"
            type="text" 
            placeholder={placeholder}
            style={{
                cursor: "pointer",
                backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                paddingRight: "30px"
            }}
            onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                if (e.clientX >= rect.right - 28) {
                    e.preventDefault();
                    
                    e.currentTarget.value = '';
                    setData(data);

                    e.currentTarget.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }}
            onChange={(e) => {
                const query = e.target.value.toLowerCase();
                const filteredData = data.filter(d => 
                    d.text.toLowerCase().includes(query) ||
                    (d?.tags && d?.tags.some(tag => tag.toLowerCase().includes(query)))
                );
                setData(filteredData);
            }}
        />
    );
}
