from dotenv import load_dotenv
import os
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


#import tools
from tools.budget_tools import get_budgets, set_budgets
from tools.transaction_tools import (
    get_transactions, get_transaction_by_id,
    create_transaction, update_transaction, delete_transaction,
    get_current_date_time_day
)

#load dot env
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    message: str


# === Gemini API Key ===
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not set in environment or .env file")


# === LangChain LLM (Gemini) ===
llm = ChatGoogleGenerativeAI(model="models/gemini-2.5-flash", temperature=0, google_api_key=GOOGLE_API_KEY)
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True, k=10)

# List all tools
tools = [
    get_budgets,
    set_budgets,
    get_transactions,
    get_transaction_by_id,
    create_transaction,
    update_transaction,
    delete_transaction,
    get_current_date_time_day
]

# === ✅ STEP 1: Create the Prompt Template ===
# This is the key part that was missing.
# We explicitly tell the agent about its persona, where the chat history goes,
# where the user input goes, and a placeholder for intermediate steps.
prompt = ChatPromptTemplate.from_messages([
    ("system", """
      You are a personal finance assistant. Transactions contains user's income with negative amount and user's spending/ expenses in postive amount. so dont get confuse.
      Always respond with concise explanations and you can use multiple tools to perform a task if needed.
      If the question is not related to personal finance, respond with "I'm sorry, I can only help with personal finance tasks."
    """),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])


# === ✅ STEP 2: Create the Agent ===
# Instead of initialize_agent, we use a modern constructor.
agent = create_openai_functions_agent(llm, tools, prompt)

# === ✅ STEP 3: Create the Memory and Agent Executor ===
# The AgentExecutor is what runs the agent, tools, and memory together in a loop.
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True,
    handle_parsing_errors=True # Helpful for debugging
)

@app.post("/chat")
async def chat(query: Query):
    try:
        # Pass the input in a dictionary matching the prompt's variable name
        response = agent_executor.invoke({"input": query.message})
        return {"response": response["output"]}
    except Exception as e:
        return {"error": str(e)}

def main():
    print("Starting the agent...")
    print("--- First interaction ---")
    reply = agent_executor.invoke({"input": "My name is Alex"})
    print("Agent Response:", reply["output"])
    
    print("\n--- Second interaction (testing memory) ---")
    reply = agent_executor.invoke({"input": "What is my name?"})
    print("Agent Response:", reply["output"])

if __name__ == "__main__":
    main()