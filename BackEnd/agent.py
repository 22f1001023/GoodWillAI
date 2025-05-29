import pandas as pd
import requests
import json
import re
from docx import Document
import os
from pathlib import Path
import PyPDF2
import fitz  # PyMuPDF for better PDF handling
import warnings
warnings.filterwarnings("ignore")

# === Load DataFrame ===
try:
    df = pd.read_csv(
        r'C:\Users\Spidey7009\OneDrive\Desktop\GoodWillAI\AI-Hackathon\DataCoSupplyChainDataset.csv',
        encoding='ISO-8859-1',
        low_memory=False
    )
    print(f"CSV loaded successfully: {df.shape[0]} rows, {df.shape[1]} columns")
except Exception as e:
    print(f"Error loading CSV: {e}")
    df = pd.DataFrame()

# === Load Policy Documents ===
def load_policy_documents():
    """Load policy text from both docx and txt files"""
    policy_text = ""
    
    # Load from docx file
    docx_path = r'C:\Users\Spidey7009\Videos\GoodWillAI\training_data\textdata.docx'
    if os.path.exists(docx_path):
        try:
            doc = Document(docx_path)
            docx_content = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
            policy_text += docx_content + "\n\n"
            print(f"Successfully loaded policy document from: {docx_path}")
        except Exception as e:
            print(f"Error loading docx file: {e}")
    
    # Load from txt file as backup
    txt_path = r'C:\Users\Spidey7009\Videos\GoodWillAI\training_data\training_text_data.txt'
    if os.path.exists(txt_path):
        try:
            with open(txt_path, 'r', encoding='utf-8') as file:
                txt_content = file.read()
                if not policy_text:  # Only use txt if docx failed
                    policy_text = txt_content
                    print(f"Successfully loaded policy document from: {txt_path}")
        except Exception as e:
            print(f"Error loading txt file: {e}")
    
    if not policy_text:
        print("Warning: No policy documents could be loaded")
    
    return policy_text

def load_pdf_documents():
    """Load and extract text from PDF documents"""
    pdf_folder = r'C:\Users\Spidey7009\OneDrive\Desktop\GoodWillAI\AI-Hackathon'
    pdf_documents = {}
    
    pdf_files = [
        "Anti-Counterfeit and Product Authenticity Policy.pdf",
        "Circular Economy.pdf",
        "COC.pdf",
        "Communication and Crisis Management Policy for DataCo Global.pdf",
        "Continuous Improvement.pdf",
        "Cost Reduction.pdf",
        "Data Security.pdf",
        "DataCo Global Capacity Planning Policy.pdf",
        "Dataco Global Change Management Policy for Supply Chain Processes.pdf",
        "DataCo Global Contract Management and Negotiation Policy.pdf",
        "Dataco Global Order Management Policy.pdf",
        "Dataco Global Transportation and Logistics Policy.pdf",
        "DataCo Global Warehouse and Storage Policy.pdf",
        "Dataco Global_ Demand Forecasting and Planning Policy.pdf",
        "Diversity and Inclusion in Supplier Base Policy for DataCo Global.pdf",
        "Environmental Sustainability.pdf",
        "Global Business Continuity.pdf",
        "Global Returns.pdf",
        "Health Safety and Environment (HSE) Policy for Supply Chain Management.pdf",
        "Inventory.pdf",
        "IOT.pdf",
        "KPI.pdf",
        "Labor Standards.pdf",
        "Obsolete Inventory Handling Policy for Dataco Global.pdf",
        "QA.pdf",
        "Risk Management.pdf",
        "Sourcing and Procurement Policy for DataCo Global.pdf",
        "SRM.pdf",
        "Supplier Selection.pdf",
        "Trade Compliance.pdf"
    ]
    
    for pdf_file in pdf_files:
        pdf_path = os.path.join(pdf_folder, pdf_file)
        if os.path.exists(pdf_path):
            try:
                # Try PyMuPDF first (better for complex PDFs)
                doc = fitz.open(pdf_path)
                text = ""
                for page in doc:
                    text += page.get_text()
                doc.close()
                
                if text.strip():
                    pdf_documents[pdf_file] = text
                    print(f"Successfully loaded PDF: {pdf_file}")
                else:
                    # Fallback to PyPDF2
                    with open(pdf_path, 'rb') as file:
                        pdf_reader = PyPDF2.PdfReader(file)
                        text = ""
                        for page in pdf_reader.pages:
                            text += page.extract_text()
                        if text.strip():
                            pdf_documents[pdf_file] = text
                            print(f"Successfully loaded PDF (fallback): {pdf_file}")
                        
            except Exception as e:
                print(f"Error loading PDF {pdf_file}: {e}")
    
    print(f"Total PDFs loaded: {len(pdf_documents)}")
    return pdf_documents

# Load policy text and PDFs globally
policy_text = load_policy_documents()
pdf_documents = load_pdf_documents()

# === Claude API Details ===
CLAUDE_API_URL = "https://quchnti6xu7yzw7hfzt5yjqtvi0kafsq.lambda-url.eu-central-1.on.aws/"
API_KEY = "The secret key"

def ask_claude(prompt, model="claude-3.5-sonnet", max_tokens=1024, temperature=0.7):
    """Call Claude API with error handling"""
    try:
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
    except Exception as e:
        return f"Error calling Claude API: {str(e)}"

def extract_final_answer(ai_output):
    """Extract the 'Final Answer' section from the AI output"""
    match = re.search(r"Final Answer:\s*(.*)", ai_output, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    parts = re.split(r"``````", ai_output)
    if len(parts) > 1:
        return parts[-1].strip()
    return ai_output.strip()

def classify_query_type(query):
    """Classify whether query is about policies or data analysis"""
    policy_keywords = [
        # Original keywords
        "policy", "procedure", "compliance", "regulation", "training", "audit",
        "supplier code of conduct", "data breach", "anti-counterfeit", "returns",
        "logistics", "diversity", "circular economy", "ethics", "environment",
        "disaster recovery", "documentation", "order", "warehouse", "planning",
        "security", "capacity", "negotiation", "contract", "reverse logistics",
        "dataco global", "hse", "inventory management", "risk management",
        "sourcing", "procurement", "transportation", "continuous improvement",
        "change management", "cost reduction", "cybersecurity", "communication",
        "crisis management", "business continuity", "performance measurement",
        "kpi", "technology adoption", "obsolete inventory", "quality assurance",
        "supplier relationship", "trade compliance", "environmental sustainability",
        "waste reduction", "health safety", "demand forecasting", "contract management",
        
        # Enhanced keywords from textdata.docx
        "counterfeit", "product authenticity", "authorized supplier", "suspect product",
        "approved supplier list", "asl", "supplier verification", "certificates of conformance",
        "authentication", "quarantine", "oem", "ocm", "original equipment manufacturer",
        "reusable", "recyclable", "remanufactured", "data lifecycle", "digital storage",
        "electronic waste", "e-waste", "single-use plastics", "compostable", "sustainability report",
        "crisis management team", "cmt", "business continuity plan", "incident response",
        "emergency contacts", "communication protocol", "net promoter score", "stakeholder notification",
        "multi-factor authentication", "mfa", "password protection", "data classification",
        "encryption", "tls", "aes-256", "firewall", "intrusion detection", "ids", "vpn",
        "phishing", "incident response", "data retention", "gdpr", "hipaa", "iso 27001",
        "supplier audit", "supplier scorecard", "vendor management", "procurement threshold",
        "competitive bidding", "request for proposal", "rfp", "supplier diversity",
        "minority-owned", "women-owned", "veteran-owned", "lgbtq-owned", "small business",
        "total recordable incident rate", "trir", "personal protective equipment", "ppe",
        "safety audit", "health risk assessment", "greenhouse gas emissions", "carbon footprint",
        "iso 14001", "zero waste", "energy efficiency", "quality control", "qc", "quality assurance", "qa", "iso 9001", "standard operating procedures",
        "sop", "design review", "code review", "dual-verification", "defect rate", "non-conformity",
        "working hours", "overtime compensation", "minimum wage", "forced labor", "child labor",
        "human trafficking", "freedom of association", "collective bargaining", "grievance mechanism",
        "internet of things", "iot", "blockchain", "technology steering committee", "tsc",
        "return on investment", "roi", "pilot test", "data governance", "penetration testing"
    ]
    
    data_keywords = [
        # Original keywords
        "sales", "revenue", "profit", "customer", "product", "market", "shipping",
        "order", "quantity", "price", "discount", "category", "segment", "region",
        "analysis", "trend", "performance", "top", "bottom", "average", "total",
        "count", "sum", "maximum", "minimum", "percentage", "growth", "decline",
        "compare", "analyze", "calculate", "show me", "list", "find",
        
        # Enhanced data analysis keywords
        "dashboard", "report", "metrics", "kpi", "benchmark", "variance", "correlation",
        "forecast", "prediction", "model", "algorithm", "statistics", "distribution",
        "outlier", "anomaly", "pattern", "clustering", "classification", "regression",
        "time series", "seasonal", "quarterly", "monthly", "weekly", "daily",
        "year-over-year", "yoy", "month-over-month", "mom", "quarter-over-quarter", "qoq",
        "baseline", "target", "actual", "budget", "variance analysis", "performance indicator",
        "scorecard", "ranking", "rating", "score", "index", "ratio", "margin",
        "utilization", "efficiency", "productivity", "throughput", "capacity utilization",
        "inventory turnover", "fill rate", "on-time delivery", "cycle time", "lead time",
        "cost per unit", "unit cost", "total cost", "variable cost", "fixed cost",
        "break-even", "profitability", "return on investment", "roi", "net present value", "npv",
        "customer satisfaction", "customer retention", "churn rate", "acquisition cost",
        "lifetime value", "clv", "market share", "penetration rate", "conversion rate",
        "demand pattern", "supply chain metrics", "logistics performance", "transportation cost",
        "warehouse efficiency", "storage utilization", "picking accuracy", "order accuracy",
        "supplier performance", "quality metrics", "defect rate", "compliance rate",
        "audit results", "risk score", "incident rate", "safety metrics", "environmental metrics"
    ]
    
    # Check for policy keywords first
    if any(kw.lower() in query.lower() for kw in policy_keywords):
        return "policy"
    
    # Check for data keywords
    if any(kw.lower() in query.lower() for kw in data_keywords):
        return "data"
    
    # Default to policy if unclear
    return "policy"

def identify_relevant_documents(query):
    """Identify which specific policy documents are most relevant to the query"""
    document_keywords = {
        "Anti-Counterfeit and Product Authenticity Policy.pdf": [
            "counterfeit", "product authenticity", "authorized supplier", "suspect product",
            "approved supplier list", "asl", "supplier verification", "certificates of conformance",
            "authentication", "quarantine", "oem", "ocm", "anti-counterfeit"
        ],
        "Circular Economy.pdf": [
            "circular economy", "waste reduction", "reusable", "recyclable", "remanufactured",
            "data lifecycle", "digital storage", "electronic waste", "e-waste", "single-use plastics",
            "compostable", "sustainability"
        ],
        "COC.pdf": [
            "supplier code of conduct", "coc", "ethical sourcing", "labor standards", "human rights",
            "child labor", "forced labor", "working hours", "minimum wage", "health safety"
        ],
        "Communication and Crisis Management Policy for DataCo Global.pdf": [
            "communication", "crisis management", "crisis management team", "cmt", "incident response",
            "emergency contacts", "communication protocol", "stakeholder notification", "media"
        ],
        "Continuous Improvement.pdf": [
            "continuous improvement", "innovation", "process improvement", "efficiency", "benchmarks",
            "kpi", "performance measurement", "improvement objectives", "innovation suggestion"
        ],
        "Cost Reduction.pdf": [
            "cost reduction", "efficiency", "procurement", "vendor management", "utility consumption",
            "energy saving", "automation", "overhead", "expense", "budget"
        ],
        "Data Security.pdf": [
            "data security", "cybersecurity", "multi-factor authentication", "mfa", "password",
            "encryption", "firewall", "vpn", "data breach", "incident response", "gdpr", "iso 27001"
        ],
        "DataCo Global Capacity Planning Policy.pdf": [
            "capacity planning", "resource allocation", "utilization", "demand forecasting",
            "strategic planning", "tactical planning", "operational planning", "capacity threshold"
        ],
        "Dataco Global Change Management Policy for Supply Chain Processes.pdf": [
            "change management", "change request", "change approval", "implementation",
            "change advisory board", "cab", "risk assessment", "rollback plan"
        ],
        "DataCo Global Contract Management and Negotiation Policy.pdf": [
            "contract management", "negotiation", "contract owner", "legal department",
            "pricing guidelines", "force majeure", "dispute resolution", "confidentiality"
        ],
        "Dataco Global Order Management Policy.pdf": [
            "order management", "order processing", "order fulfillment", "customer request",
            "order classification", "timeline requirements", "quality control"
        ],
        "Dataco Global Transportation and Logistics Policy.pdf": [
            "transportation", "logistics", "fleet management", "shipping", "freight",
            "carrier selection", "route optimization", "delivery", "vehicle maintenance"
        ],
        "DataCo Global Warehouse and Storage Policy.pdf": [
            "warehouse", "storage", "inventory", "picking", "packing", "receiving",
            "storage optimization", "fifo", "lifo", "warehouse management system", "wms"
        ],
        "Dataco Global_ Demand Forecasting and Planning Policy.pdf": [
            "demand forecasting", "planning", "forecast accuracy", "statistical forecasting",
            "consensus forecast", "planning horizon", "demand volatility"
        ],
        "Diversity and Inclusion in Supplier Base Policy for DataCo Global.pdf": [
            "diversity", "inclusion", "supplier diversity", "minority-owned", "women-owned",
            "veteran-owned", "lgbtq-owned", "small business", "diverse suppliers"
        ],
        "Environmental Sustainability.pdf": [
            "environmental sustainability", "green supply chain", "carbon emissions",
            "energy efficiency", "greenhouse gas", "water conservation", "environmental impact"
        ],
        "Global Business Continuity.pdf": [
            "business continuity", "disaster recovery", "risk assessment", "business impact analysis",
            "recovery time objective", "rto", "recovery point objective", "rpo", "backup"
        ],
        "Global Returns.pdf": [
            "returns", "reverse logistics", "return merchandise authorization", "rma",
            "refund", "exchange", "restocking fee", "return eligibility"
        ],
        "Health Safety and Environment (HSE) Policy for Supply Chain Management.pdf": [
            "hse", "health safety environment", "safety audit", "incident rate", "ppe",
            "personal protective equipment", "safety training", "environmental protection"
        ],
        "Inventory.pdf": [
            "inventory management", "inventory control", "stock rotation", "inventory accuracy",
            "cycle counting", "safety stock", "reorder points", "inventory turnover"
        ],
        "IOT.pdf": [
            "technology adoption", "iot", "internet of things", "blockchain", "innovation",
            "technology evaluation", "pilot test", "data governance", "penetration testing"
        ],
        "KPI.pdf": [
            "performance measurement", "kpi", "key performance indicators", "metrics",
            "financial performance", "customer satisfaction", "employee performance"
        ],
        "Labor Standards.pdf": [
            "labor standards", "fair labor practices", "working hours", "overtime",
            "minimum wage", "forced labor", "child labor", "freedom of association"
        ],
        "Obsolete Inventory Handling Policy for Dataco Global.pdf": [
            "obsolete inventory", "slow mover", "no mover", "inventory disposal",
            "write-off", "liquidation", "recycling", "destruction"
        ],
        "QA.pdf": [
            "quality assurance", "quality control", "qa", "qc", "iso 9001",
            "standard operating procedures", "sop", "defect rate", "customer satisfaction"
        ],
        "Risk Management.pdf": [
            "risk management", "risk assessment", "risk mitigation", "risk appetite",
            "risk tolerance", "risk register", "mitigation plan", "business continuity"
        ],
        "Sourcing and Procurement Policy for DataCo Global.pdf": [
            "sourcing", "procurement", "supplier selection", "competitive bidding",
            "vendor management", "procurement threshold", "ethical standards"
        ],
        "SRM.pdf": [
            "supplier relationship management", "srm", "supplier performance", "supplier evaluation",
            "supplier audit", "supplier scorecard", "performance management"
        ],
        "Supplier Selection.pdf": [
            "supplier selection", "vendor evaluation", "supplier qualification", "supplier criteria",
            "supplier assessment", "vendor selection", "procurement process"
        ],
        "Trade Compliance.pdf": [
            "trade compliance", "regulatory adherence", "export controls", "import controls",
            "sanctioned party lists", "know your customer", "kyc", "customs regulations"
        ]
    }
    
    relevant_docs = []
    query_lower = query.lower()
    
    for doc_name, keywords in document_keywords.items():
        relevance_score = sum(1 for keyword in keywords if keyword.lower() in query_lower)
        if relevance_score > 0:
            relevant_docs.append((doc_name, relevance_score))
    
    # Sort by relevance score (highest first)
    relevant_docs.sort(key=lambda x: x[1], reverse=True)
    
    # Return top 3 most relevant documents
    return [doc for doc in relevant_docs[:3]]

def get_relevant_document_content(relevant_docs):
    """Get the content of relevant documents"""
    content = ""
    
    for doc_name in relevant_docs:
        if doc_name in pdf_documents:
            content += f"\n\n=== {doc_name} ===\n"
            content += pdf_documents[doc_name][:5000]  # Limit content to avoid token limits
    
    # Also include general policy text if available
    if policy_text:
        content += f"\n\n=== General Policy Document ===\n"
        content += policy_text[:10000]
    
    return content

def create_policy_prompt(user_query):
    """Create prompt for policy-based questions"""
    # Identify relevant documents
    relevant_docs = identify_relevant_documents(user_query)
    
    # Get content from relevant documents
    relevant_content = get_relevant_document_content(relevant_docs)
    
    if not relevant_content:
        relevant_content = policy_text[:20000] if policy_text else "No policy documents available."
    
    return f"""
You are an expert in corporate policies and governance for Dataco Global. Below are the most relevant policy documents for this query:

--- Start of Relevant Policy Documents ---
{relevant_content}
--- End of Relevant Policy Documents ---

Based on the policy documents above, answer the following question: "{user_query}"

Instructions:
- Provide a detailed, structured response using the information from the policy documents
- Use bullet points, numbered lists, or sections where appropriate
- Quote specific policy requirements, percentages, timeframes, and metrics when available
- If referencing specific policies, mention the policy name
- If the information is not found in the documents, clearly state that
- Format your response in clear, professional Markdown

Final Answer:
"""

def create_data_prompt(user_query):
    """Create prompt for data analysis questions"""
    columns_info = ", ".join(df.columns) if not df.empty else "No data available"
    preview = df.head().to_markdown() if not df.empty else "No data available"
    
    return f"""
You are a Python data expert analyzing supply chain data. You have a pandas DataFrame with the following columns: {columns_info}.

Here are the first few rows:
{preview}

Convert this user query into correct Python pandas code that returns the answer: "{user_query}"

Instructions:
- First, write the pandas code (in a code block)
- Then, provide a clear, human-readable summary starting with 'Final Answer:'
- Include key numbers, trends, and insights
- Base your answer only on the DataFrame data
- Analyze the complete dataset, not just the preview

Format:
```python
# Your pandas code here
```

Final Answer:
[Your detailed analysis summary here]
"""

def create_hybrid_prompt(user_query):
    """Create prompt for questions that might involve both policy and data"""
    relevant_docs = identify_relevant_documents(user_query)
    relevant_content = get_relevant_document_content(relevant_docs)
    
    columns_info = ", ".join(df.columns) if not df.empty else "No data available"
    preview = df.head().to_markdown() if not df.empty else "No data available"
    
    return f"""
You are an expert analyst for Dataco Global with access to both policy documents and supply chain data.

POLICY DOCUMENTS:
--- Start of Relevant Policy Documents ---
{relevant_content}
--- End of Relevant Policy Documents ---

SUPPLY CHAIN DATA:
You have a pandas DataFrame with columns: {columns_info}
Here are the first few rows:
{preview}

User Query: "{user_query}"

Instructions:
- If the query relates to policies, procedures, or compliance: Use the policy documents
- If the query requires data analysis: Write pandas code and analyze the data
- If the query combines both: Address policy aspects first, then provide data analysis
- Always provide specific, actionable insights
- Use clear formatting with headers and bullet points

Final Answer:
"""

def query_agent(user_query):
    """Main function to process user queries"""
    try:
        # Classify the query type
        query_type = classify_query_type(user_query)
        
        # Check if query might need both policy and data
        has_policy_elements = any(kw in user_query.lower() for kw in ["policy", "compliance", "procedure", "regulation"])
        has_data_elements = any(kw in user_query.lower() for kw in ["analysis", "data", "sales", "revenue", "customer"])
        
        if has_policy_elements and has_data_elements:
            # Use hybrid approach
            prompt = create_hybrid_prompt(user_query)
            ai_output = ask_claude(prompt, max_tokens=2048)
            summary = extract_final_answer(ai_output)
        elif query_type == "policy":
            # Policy-focused query
            prompt = create_policy_prompt(user_query)
            ai_output = ask_claude(prompt, max_tokens=1536)
            summary = extract_final_answer(ai_output) if "Final Answer:" in ai_output else ai_output.strip()
        else:
            # Data-focused query
            prompt = create_data_prompt(user_query)
            ai_output = ask_claude(prompt, max_tokens=1536)
            summary = extract_final_answer(ai_output)
        
        return summary if summary else "No relevant information found."
        
    except Exception as e:
        return f"Error processing query: {str(e)}"

# === Additional utility functions ===
def get_policy_summary():
    """Get a summary of available policies"""
    if not pdf_documents and not policy_text:
        return "No policy documents loaded."
    
    summary = f"Loaded {len(pdf_documents)} PDF documents and general policy text.\n"
    summary += "Available PDF documents:\n"
    for doc_name in pdf_documents.keys():
        summary += f"- {doc_name}\n"
    
    return summary

def get_data_summary():
    """Get a summary of the dataset"""
    if df.empty:
        return "No dataset loaded."
    return f"Dataset contains {df.shape} rows and {df.shape[1]} columns. Columns: {', '.join(df.columns[:10])}..."

def test_system():
    """Test function to verify everything is working"""
    print("=== System Test ===")
    print(f"DataFrame loaded: {df.shape if not df.empty else 0} rows, {df.shape[1] if not df.empty else 0} columns")
    print(f"Policy text loaded: {len(policy_text)} characters")
    print(f"PDF documents loaded: {len(pdf_documents)}")
    print("System ready for queries!")

# Run test when module is imported
if __name__ == "__main__":
    test_system()
