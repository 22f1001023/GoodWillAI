import pandas as pd
import requests
import json
import re

# Load DataFrame from your local CSV file
df = pd.read_csv(
    r'C:\Users\Spidey7009\OneDrive\Desktop\GoodWillAI\AI-Hackathon\DataCoSupplyChainDataset.csv',
    encoding='ISO-8859-1',
    low_memory=False
)

CLAUDE_API_URL = "https://quchnti6xu7yzw7hfzt5yjqtvi0kafsq.lambda-url.eu-central-1.on.aws/"
API_KEY = "The_Secret_Key"

def ask_claude(prompt, model="claude-3.5-sonnet", max_tokens=1024, temperature=0.7):
    payload = {
        "api_key": API_KEY,
        "prompt": prompt,
        "model_id": model,
        "model_params": {
            "max_tokens": max_tokens,
            "temperature": temperature
        }
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(CLAUDE_API_URL, headers=headers, data=json.dumps(payload))
    response.raise_for_status()
    return response.json()["response"]["content"][0]["text"]

def extract_final_answer(ai_output):
    """
    Extracts the 'Final Answer' section from the AI output, or all text after the last code block.
    """
    match = re.search(r"Final Answer:\s*(.*)", ai_output, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    # Fallback: return everything after the last code block
    parts = re.split(r"```", ai_output)
    if len(parts) > 1:
        return parts[-1].strip()
    return ai_output.strip()

def query_agent(user_query):
    columns_info = ", ".join(df.columns)
    preview = df.head().to_markdown()
    prompt = f"""
You are a Python data expert. You have a pandas DataFrame with the following columns: {columns_info}.
Here are the first few rows:

{preview}

Convert this user query into correct Python pandas code that returns the answer: "{user_query}"

- First, write the pandas code (in a code block).
- Then, below the code, provide a clear, human-readable summary of the answer, using Markdown, starting with 'Final Answer:'.
- The summary should explain the result, mention key numbers, and list any relevant people or items.
- Do NOT make up data—base your answer only on the DataFrame. Give the answer after analysing the whole dataset 

Format:
Final Answer:
<your summary here>
"""
    ai_output = ask_claude(prompt)
    summary = extract_final_answer(ai_output)
    return summary if summary else "No summary found in AI output."
