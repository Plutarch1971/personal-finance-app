interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
}

export default function AccountTable ({ accounts }: { accounts: Account[]}) {
    return (
        <>
        <div className="card">
            <div className='card-body'>
                <h5 className="card-title mb-3">Accounts</h5>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th className="text-end">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((a) => (
                            <tr key={a.id}>
                                <td>{a.name}</td>
                                <td className="text-capitalize">{a.type}</td>
                                <td className="text-end">
                                    ${Number(a.balance).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}