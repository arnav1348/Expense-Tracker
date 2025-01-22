import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { InnerLayout } from '../../styles/Layouts'
import ExpenseItem from '../IncomeItem/IncomeItem'
import ExpenseForm from './ExpenseForm'

function Expenses() {
    const { addExpense, expenses, getExpenses, deleteExpense, totalExpenses } = useGlobalContext()
    
    // State for search and filters
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [sortBy, setSortBy] = useState('date-desc') // default sort by latest date
    const [isAddingExpense, setIsAddingExpense] = useState(false)

    // Unique categories from expenses
    const categories = [...new Set(expenses.map(expense => expense.category))]

    // Filtered and sorted expenses
    const filteredExpenses = expenses
        .filter(expense => 
            // Search filter (case-insensitive, searches title and description)
            (expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             expense.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            // Category filter
            (categoryFilter === '' || expense.category === categoryFilter)
        )
        .sort((a, b) => {
            // Sorting logic
            switch(sortBy) {
                case 'amount-asc':
                    return a.amount - b.amount
                case 'amount-desc':
                    return b.amount - a.amount
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date)
                case 'date-desc':
                default:
                    return new Date(b.date) - new Date(a.date)
            }
        })

    useEffect(() => {
        getExpenses()
    }, [])

    const handleAddExpense = (expense) => {
        addExpense(expense)
        setIsAddingExpense(false)
    }

    return (
        <ExpenseStyled>
            <InnerLayout>
                <div className="header">
                    <h1>Expenses</h1>
                    <button 
                        className="add-expense-btn"
                        onClick={() => setIsAddingExpense(!isAddingExpense)}
                    >
                        {isAddingExpense ? 'Cancel' : '+ Add Expense'}
                    </button>
                </div>

                {isAddingExpense && (
                    <div className="expense-form-container">
                        <ExpenseForm addExpense={handleAddExpense} />
                    </div>
                )}
                
                <div className="search-filter-container">
                    <input 
                        type="text" 
                        placeholder="Search expenses..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="category-filter"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="date-desc">Latest Date</option>
                        <option value="date-asc">Earliest Date</option>
                        <option value="amount-desc">Highest Amount</option>
                        <option value="amount-asc">Lowest Amount</option>
                    </select>
                </div>

                <div className="total-income">
                    Total Expense: <span>${totalExpenses()}</span>
                </div>

                <div className="expenses-list">
                    {filteredExpenses.map((expense) => {
                        const {_id, title, amount, date, category, description, type} = expense
                        return (
                            <ExpenseItem 
                                key={_id}
                                id={_id}
                                title={title}
                                description={description}
                                amount={amount}
                                date={date}
                                type={type}
                                category={category}
                                indicatorColor="var(--color-delete)"
                                deleteItem={deleteExpense}
                            />
                        )
                    })}
                </div>
            </InnerLayout>
        </ExpenseStyled>
    )
}

const ExpenseStyled = styled.div`
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        .add-expense-btn {
            padding: 0.5rem 1rem;
            background-color: var(--color-green);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;

            &:hover {
                background-color: #2ecc71;
            }
        }
    }

    .expense-form-container {
        margin-bottom: 1rem;
        padding: 1rem;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .search-filter-container {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        
        .search-input, 
        .category-filter, 
        .sort-select {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .search-input {
            flex-grow: 1;
        }

        .category-filter,
        .sort-select {
            min-width: 150px;
        }
    }

    .total-income {
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

        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }

    .expenses-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`

export default Expenses