import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar, trend, wallet, calendar } from '../../utils/Icons';
import Chart from '../Chart/Chart';

function Dashboard() {
    const {
        totalExpenses, 
        incomes, 
        expenses, 
        transactions,
        totalIncome, 
        totalBalance, 
        getIncomes, 
        getExpenses,
        getTransactions
    } = useGlobalContext()

    useEffect(() => {
        getIncomes()
        getExpenses()
        getTransactions()
    }, [])

    // Helper function to calculate min and max
    const calculateMinMax = (items) => {
        if (items.length === 0) return { min: 0, max: 0 }
        return {
            min: Math.min(...items.map(item => item.amount)),
            max: Math.max(...items.map(item => item.amount))
        }
    }

    const incomeMinMax = calculateMinMax(incomes)
    const expenseMinMax = calculateMinMax(expenses)

    return (
        <DashboardStyled>
            <InnerLayout>
                <div className="dashboard-title">
                    <h1>Financial Dashboard</h1>
                </div>
                <div className="stats-con">
                    <div className="financial-summary">
                        <div className="summary-card income-card">
                            <div className="card-icon">{trend}</div>
                            <div className="card-content">
                                <h3>Total Income</h3>
                                <p>{dollar} {totalIncome().toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="summary-card expense-card">
                            <div className="card-icon">{wallet}</div>
                            <div className="card-content">
                                <h3>Total Expense</h3>
                                <p>{dollar} {totalExpenses().toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="summary-card balance-card">
                            <div className="card-icon">{calendar}</div>
                            <div className="card-content">
                                <h3>Total Balance</h3>
                                <p>{dollar} {totalBalance().toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="chart-con">
                        <Chart />
                    </div>

                    <div className="financial-details">
                        <div className="income-details">
                            <h2>Income Overview</h2>
                            <div className="detail-card">
                                <div className="detail-item">
                                    <span>Minimum Income</span>
                                    <p>{dollar} {incomeMinMax.min.toFixed(2)}</p>
                                </div>
                                <div className="detail-item">
                                    <span>Maximum Income</span>
                                    <p>{dollar} {incomeMinMax.max.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="expense-details">
                            <h2>Expense Overview</h2>
                            <div className="detail-card">
                                <div className="detail-item">
                                    <span>Minimum Expense</span>
                                    <p>{dollar} {expenseMinMax.min.toFixed(2)}</p>
                                </div>
                                <div className="detail-item">
                                    <span>Maximum Expense</span>
                                    <p>{dollar} {expenseMinMax.max.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="history-con">
                        <History />
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    .dashboard-title {
        text-align: center;
        margin-bottom: 2rem;
        h1 {
            font-size: 2.5rem;
            color: white;
            font-weight: 700;
        }
    }

    .stats-con {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;

        .financial-summary {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;

            .summary-card {
                display: flex;
                align-items: center;
                background: #FCF6F9;
                border-radius: 20px;
                padding: 1.5rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;

                &:hover {
                    transform: translateY(-5px);
                }

                .card-icon {
                    font-size: 3rem;
                    margin-right: 1.5rem;
                    color: black;
                }

                .card-content {
                    h3 {
                        font-size: 1.2rem;
                        color: black;
                        margin-bottom: 0.5rem;
                    }

                    p {
                        font-size: 2rem;
                        font-weight: 700;
                        color: black;
                    }
                }
            }

            .income-card { border-left: 5px solid var(--color-green); }
            .expense-card { border-left: 5px solid var(--color-red); }
            .balance-card { border-left: 5px solid var(--color-blue); }
        }

        .chart-con {
            background: #FCF6F9;
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .financial-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;

            .income-details, .expense-details {
                background: #FCF6F9;
                border-radius: 20px;
                padding: 1.5rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);

                h2 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: var(--color-primary);
                }

                .detail-card {
                    display: flex;
                    justify-content: space-between;

                    .detail-item {
                        text-align: center;
                        
                        span {
                            display: block;
                            font-size: 1rem;
                            color: rgba(34, 34, 96, 0.6);
                            margin-bottom: 0.5rem;
                        }

                        p {
                            font-size: 1.5rem;
                            font-weight: 700;
                            color: var(--color-primary);
                        }
                    }
                }
            }
        }

        .history-con {
            background: #FCF6F9;
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    }

    @media screen and (max-width: 1200px) {
        .stats-con {
            .financial-summary {
                grid-template-columns: 1fr;
            }

            .financial-details {
                grid-template-columns: 1fr;
            }
        }
    }
`;

export default Dashboard