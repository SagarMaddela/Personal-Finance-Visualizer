from langchain_core.tools import tool
import requests
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()
VITE_BASE_URL = os.getenv("VITE_API_BASE_URL", "http://localhost:5000")
BASE_URL = f"{VITE_BASE_URL}/transactions"

#creating a tool to get current date ,time and day
@tool
def get_current_date_time_day() -> str:
    """Get the current date, time, and day."""
    try:
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    except Exception as e:
        return f"Error getting current date, time, and day: {e}"


@tool
def get_transactions() -> str:
    """Get all expenses and income. Expenses are positive and income is negative."""
    try:
        res = requests.get(BASE_URL)
        return res.text
    except Exception as e:
        return f"Error getting transactions: {e}"

@tool
def get_transaction_by_id(id: str) -> str:
    """Get expenses and income by id"""
    try:
        res = requests.get(f"{BASE_URL}/{id}")
        return res.text
    except Exception as e:
        return f"Error fetching transaction: {e}"

@tool
def create_transaction(description: str, amount: float, date: str, category: str) -> str:
    """Create a new expense or income. Expenses are positive and income is negative."""
    try:
        payload = {
            "description": description,
            "amount": amount,
            "date": date,
            "category": category
        }
        res = requests.post(BASE_URL, json=payload)
        return res.text
    except Exception as e:
        return f"Error creating transaction: {e}"

@tool
def update_transaction(id: str, description: str, amount: float, date: str, category: str) -> str:
    """Update an existing transaction by ID."""
    try:
        payload = {
            "description": description,
            "amount": amount,
            "date": date,
            "category": category
        }
        res = requests.put(f"{BASE_URL}/{id}", json=payload)
        return res.text
    except Exception as e:
        return f"Error updating transaction: {e}"

@tool
def delete_transaction(id: str) -> str:
    """Delete a transaction by its ID."""
    try:
        res = requests.delete(f"{BASE_URL}/{id}")
        return res.text
    except Exception as e:
        return f"Error deleting transaction: {e}"
