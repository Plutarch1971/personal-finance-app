interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
}

export default function AccountTable ({ accounts }: { accounts: Account[]}) {
    return (
        <>
        <div className="card">                                      {/* Card container */}
            <div className='card-body'>                             {/* Card content area with padding  */}                         
                <h5 className="card-title mb-3">Accounts</h5>       {/* Card title styling your table inside the card */}
                <table className="table table-striped">             {/* Provides alternating light and grey colors for each row for readablity*/}
                    <thead>                                         {/* Table head section containing the header row with column titles */}                                    
                        <tr>                                        {/*Table row in the head section ?*/}
                            <th>Name</th>                           {/*Column header 1*/}
                            <th>Type</th>                           {/* Column header 2*/}
                            <th className="text-end">Balance</th>   {/*  Column header 3*/}
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((a) => (
                            <tr key={a.id}>
                                <td>{a.name}</td>                               {/* Data cell 1*/}
                                <td className="text-capitalize">{a.type}</td>   {/* Data cell 2 */}
                                <td className="text-end">
                                    ${Number(a.balance).toFixed(2)}             {/* Data cell 3*/}
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