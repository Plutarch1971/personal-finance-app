interface Props {
    summary: {
        income: number;
        expense: number;
        net: number;
    };
}

export default function SummaryCards({ summary }: Props){
    return (
        <div className="row g-2">     
     {/*----------------------INCOME-------------------*/} 
            <div className="col-12 col-lg-4">                              {/* Creates column 1: that takes up 4 out of 12 grid units (width: 33.33%)*/}  
                <div className="card text-bg-success text-white shadow h-100 rounded-4">
                    <div className="card-body">
                        <h5 className="card-title">Income</h5>
                        <h4>${summary.income.toFixed(2)}</h4>
                    </div>
                </div>
            </div>

    {/* --------------------- EXPENSE--------------------*/} 
            <div className="col-12 col-lg-4">                              
                <div className="card bg-danger text-white shadow h-100 rounded-4">
                    <div className="card-body">
                        <h5 className="card-title">Expenses</h5>
                        <h4>${summary.expense.toFixed(2)}</h4>                      
                    </div>
                </div>
            </div>
    {/*--------------------  NET. --------------------- */} 
            <div className="col-12 col-lg-4">                              
                <div className="card bg-orange text-white shadow h-100 rounded-4">
                    <div className="card-body">
                        <h5 className="card-title">Net</h5>
                        <h4>${summary.net.toFixed(2)}</h4>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}