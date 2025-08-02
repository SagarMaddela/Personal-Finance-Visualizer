from langchain_core.tools import tool
import requests
from dotenv import load_dotenv
import os

load_dotenv()
VITE_BASE_URL = os.getenv("VITE_API_BASE_URL", "http://localhost:5000")

BASE_URL = f"{VITE_BASE_URL}/budgets"

@tool
def get_budgets() -> str:
    """Get all budget categories and amounts."""
    try:
        res = requests.get(BASE_URL)
        return res.text
    except Exception as e:
        return f"Error getting budgets: {e}"

@tool
def set_budgets(budgets: dict) -> str:
    """Create or update budget categories. Example input: {"Food": 3000, "Travel": 5000}"""
    try:
        res = requests.post(BASE_URL, json=budgets)
        return res.text
    except Exception as e:
        return f"Error setting budgets: {e}"
