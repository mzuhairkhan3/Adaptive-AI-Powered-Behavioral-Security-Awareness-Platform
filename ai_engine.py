from langchain_google_genai import ChatGoogleGenerativeAI # type: ignore[import]
from langchain_core.prompts import ChatPromptTemplate # type: ignore[import]
from dotenv import load_dotenv # type: ignore[import]
import os

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    temperature=0.7,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

def generate_phishing_email(employee_name: str, department: str = "General", company: str = "Our Company"):
    prompt = ChatPromptTemplate.from_template("""
You are a cybersecurity expert creating a realistic phishing simulation email for training purposes.

Create a professional phishing email using these details:
- Employee Name: {employee_name}
- Department: {department}
- Company: {company}

Rules:
- Make it look like an urgent message from IT Support
- Include this fake link: https://example-security-check.com/login
- Keep it professional but create urgency
- At the very end write: [This is a simulated phishing email for security awareness training]

Return only:

Subject: ...

Body...
""")

    chain = prompt | llm
    response = chain.invoke({
        "employee_name": employee_name,
        "department": department,
        "company": company
    })
    return response.content