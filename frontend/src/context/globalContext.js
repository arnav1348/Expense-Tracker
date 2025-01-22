import React, { useContext, useState } from "react"
import axios from 'axios'

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [transactions, setTransactions] = useState([])
    const [error, setError] = useState(null)

    //calculate incomes
    const addIncome = async (income) => {
        const response = await axios.post(`${BASE_URL}add-income`, income,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getIncomes()
    }

    const getIncomes = async () => {
        const response = await axios.get(`${BASE_URL}get-incomes`)
        setIncomes(response.data)
        console.log(response.data)
    }

    const deleteIncome = async (id) => {
        await axios.delete(`${BASE_URL}delete-income/${id}`)
        getIncomes()
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }

    //calculate expenses
    const addExpense = async (expense) => {
        const response = await axios.post(`${BASE_URL}add-expense`, expense,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getExpenses()
    }

    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL}get-expenses`)
        setExpenses(response.data)
        console.log(response.data)
    }

    const deleteExpense = async (id) => {
        await axios.delete(`${BASE_URL}delete-expense/${id}`)
        getExpenses()
    }

    const totalExpenses = () => {
        let totalExpense = 0;
        expenses.forEach((expense) =>{
            totalExpense = totalExpense + expense.amount
        })

        return totalExpense;
    }

    // Transactions methods
    const addTransaction = async (transaction) => {
        try {
            const response = await axios.post(`${BASE_URL}add-transaction`, transaction)
            getTransactions()
        } catch (err) {
            setError(err.response.data.message)
        }
    }

    const getTransactions = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-transactions`)
            setTransactions(response.data)
            console.log(response.data)
        } catch (err) {
            console.error("Error fetching transactions:", err)
        }
    }

    const deleteTransaction = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-transaction/${id}`)
            getTransactions()
        } catch (err) {
            console.error("Error deleting transaction:", err)
        }
    }

    const totalTransactions = () => {
        let total = 0;
        transactions.forEach((transaction) => {
            total += transaction.type === 'income' 
                ? transaction.amount 
                : -transaction.amount
        })
        return total;
    }

    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses, ...transactions]
        history.sort((a, b) => {
            return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        })

        return history.slice(0, 3)
    }

    return (
        <GlobalContext.Provider value={{
            // Existing methods
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            totalIncome,

            addExpense,
            getExpenses,
            expenses,
            deleteExpense,
            totalExpenses,

            // New transaction methods
            transactions,
            addTransaction,
            getTransactions,
            deleteTransaction,
            totalTransactions,

            // Existing methods
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}