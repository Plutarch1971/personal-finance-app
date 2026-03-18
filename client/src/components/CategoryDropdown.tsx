import { useState, useRef, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
}

interface Props {
    categories: Record<string, Category []>;
    value: string;
    onChange: ( id: string ) => void; 
}

export default function CategoryDropdown ( {categories, value, onChange} : Props ) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const allCategories = Object.values(categories).flat();

    const selected =
        allCategories.find(c => c.id === value)?.name || 
    "Select a category";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="position-relative">
        <button
        type="button"
        className="form-control text-start"
        onClick={() => setOpen(!open)}
        >
            {selected}
        </button>

        { open && (
            <div
                className="border rounded bg-white shadow mt-1 p-2 position-absolute w-100"
                style={{ maxHeight: '240px', overflowY: 'auto', zIndex: 1200 }}
            >
                { Object.entries(categories).map(([label, groupCategories]) => (
                    <div key={label} className="mb-2">
                        <div className="fw-bold small text-muted">
                            {label}
                        </div>
                        {groupCategories
                            .filter(c => c.name !== label)
                            .map(c => (
                                <div
                                    key={c.id}
                                    className="p-1 dropdown-item"
                                    style={{ cursor: 'pointer'}}
                                    onClick={() => {
                                        onChange(c.id);
                                        setOpen(false);
                                    }}
                                >
                                {c.name}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}