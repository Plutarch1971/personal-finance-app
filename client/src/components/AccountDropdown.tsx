import { useState } from 'react';

interface Account {
    id: string;
    name: string;
}

interface Props {
    groups: Record<string, Account[]>;
    value: string;
    onChange: (id: string) => void;
}

export default function AccountDropdown({groups, value, onChange} : Props) {
    const [open, setOpen] = useState(false);

    const selected = 
    Object.values(groups).flat().find(a => a.id === value)?.name ||
    "Select account";

    return (
        <div className="position-relative">
            <button
            type="button"
            className="form-control text-start"
            onClick={() => setOpen(!open)}
            >
                {selected}
            </button>

            { open && (
                <div className="border rounded bg-white shadow mt-1 p-2 position-absolute w-100">
                    {Object.entries(groups).map(([label, accounts]) => (
                        <div key={label} className="mb-2">
                            <div className="fw-bold small text-muted">{label}</div>
                            {accounts.map(a => (
                                <div 
                                key={a.id}
                                className="p-1 dropdown-item"
                                style={{ cursor: 'pointer'}}
                                onClick={() => {
                                    onChange(a.id);
                                    setOpen(false);
                                }}
                                >
                                    {a.name}
                                </div>
                            ))}
                            </div>
                    ))}
                </div>
            )}
        </div>
    );
}