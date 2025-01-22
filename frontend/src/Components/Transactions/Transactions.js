import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import TransactionForm from './TransactionForm';
import IncomeItem from '../IncomeItem/IncomeItem';

function Transactions() {
    const { 
        transactions, 
        getTransactions, 
        deleteTransaction, 
        totalTransactions 
    } = useGlobalContext()

    useEffect(() => {
        getTransactions()
    }, [])

    return (
        <TransactionsStyled>
            <InnerLayout>
                <h1>Transactions</h1>
                <h2 className="total-transactions">
                    Total Transactions: <span>${totalTransactions()}</span>
                </h2>
                <div className="transactions-content">
                    <div className="form-container">
                        <TransactionForm />
                    </div>
                    <div className="transactions">
                        {transactions.map((transaction) => {
                            const {
                                _id, 
                                title, 
                                amount, 
                                date, 
                                category, 
                                description, 
                                type
                            } = transaction;
                            
                            return (
                                <IncomeItem
                                    key={_id}
                                    id={_id} 
                                    title={title} 
                                    description={description} 
                                    amount={amount} 
                                    date={date} 
                                    type={type}
                                    category={category} 
                                    indicatorColor={
                                        type === 'income' 
                                        ? 'var(--color-green)' 
                                        : 'var(--color-red)'
                                    }
                                    deleteItem={deleteTransaction}
                                />
                            )
                        })}
                    </div>
                </div>
            </InnerLayout>
        </TransactionsStyled>
    )
}

const TransactionsStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-transactions{
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span{
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }
    .transactions-content{
        display: flex;
        gap: 2rem;
        .transactions{
            flex: 1;
        }
    }
`;

export default Transactions