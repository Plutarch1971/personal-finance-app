interface Props {
    summary: {
        income: number;
        expense: number;
        net: number;
    };
}

export default function SummaryCards({ summary }: Props){
    return (
        <div className="row mb-4">
            <div className="col-md-4">
                <div className="card text-bg-success">
                    <div className="card-body">
                        <h5 className="card-title">Income</h5>
                        <p className="card-text fs-4">
                            ${summary.income.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card text-bg-danger">
                    <div className="card-body">
                        <h5 className="card-title">Expenses</h5>
                        <p className="card-text fs-4">
                            ${summary.expense.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card text-bg-primary">
                    <div className="card-body">
                        <h5 className="card-title">Net</h5>
                        <p className="card-text fs-4">
                            ${summary.net.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}