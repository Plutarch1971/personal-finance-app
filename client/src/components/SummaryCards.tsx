interface Props {
    summary: {
        income: number;
        expense: number;
        net: number;
    };
}

export default function SummaryCards({ summary }: Props){
    return (
        <div className="row mb-4">                                  {/*Creates horizontal row container that holds columns */} 
            <div className="col-md-4">                              {/* Creates column 1: that takes up 4 out of 12 grid units (width: 33.33%)*/}  
                <div className="card text-bg-success">
                    <div className="card-body">
                        <h5 className="card-title">Income</h5>
                        <p className="card-text fs-4">
                            ${summary.income.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">                              {/* Column 2: 4/12 width (33.33%), md = medium devices or larger*/} 
                <div className="card text-bg-danger">
                    <div className="card-body">
                        <h5 className="card-title">Expenses</h5>
                        <p className="card-text fs-4">
                            ${summary.expense.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">                              {/* Column 3: 4/12 width (33.33%) */} 
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