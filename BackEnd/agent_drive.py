import pandas as pd
import requests
import json
import re

# Load DataFrame from Google Sheets (public CSV export)
GOOGLE_SHEET_ID = "1z3KNSi0hoI2XiJgpnswhJ-NWNd4oAKvJZi1XeULt33E"
GOOGLE_SHEET_CSV_URL = f"https://docs.google.com/spreadsheets/d/{GOOGLE_SHEET_ID}/export?format=csv"

df = pd.read_csv(GOOGLE_SHEET_CSV_URL)

CLAUDE_API_URL = "https://quchnti6xu7yzw7hfzt5yjqtvi0kafsq.lambda-url.eu-central-1.on.aws/"
API_KEY = "syn-506407e2-2dff-44ac-b686-ce18e35ce114"

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
    parts = re.split(r"```[\w]*\n", ai_output)
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
- Do NOT make up data—base your answer only on the DataFrame.

Format:
Final Answer:
<your summary here>
"""
    ai_output = ask_claude(prompt)
    summary = extract_final_answer(ai_output)
    return summary if summary else "No summary found in AI output."
