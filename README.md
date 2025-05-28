# GoodWillAI
## GoodWill AI

**Team Members:**  
Sanjay B, Aditya Nupani

---

**Website:**  
GoodWillAI

---

## Overview

GoodWill AI is a web-based platform designed to streamline administrative and financial workflows for organizations. The system supports four user roles—Admin, Higher Officials, Finance Team, and Planning Team—each with tailored dashboards and permissions. The platform leverages advanced AI capabilities to enhance decision-making and automate information retrieval.

---

## Features

- **Role-Based Access:**  
  - **Admin:** View website statistics (total users, breakdown by role), approve or reject user registrations. Only one Admin exists; no registration for Admin.
  - **Higher Officials, Finance Team, Planning Team:** Register via a dedicated form (email, username, role selection, password & confirm password).

- **AI Integration:**  
  - Built with Langchain and Claude 3.5 Sonnet for intelligent querying and automation.

- **User Management:**  
  - Admin controls user approvals.
  - Secure registration and authentication for all non-admin roles.

- **Statistics Dashboard:**  
  - Real-time data on user activity and role distribution.

---

## Technologies Used

| Layer     | Technologies                                                                                  |
|-----------|----------------------------------------------------------------------------------------------|
| Frontend  | Vue2 (CDN only), Bootstrap, HTML, CSS, JavaScript                                            |
| Backend   | Flask (API & logic), FastAPI (where required), Flask-Security, Flask-SQLAlchemy              |
| Database  | SQLite3                                                                                      |
| AI/LLM    | Langchain, Claude 3.5 Sonnet                                                                 |

- **Note:**  
  - Only Vue2 is used (not Vue3).
  - Only Bootstrap for styling; no other CSS frameworks permitted.
  - Jinja2 templates are not used for UI.
  - No JWT tokens; Flask-Security handles authentication.
  - Only CDN-based Vue2, not CLI.

---

## Project Setup

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
venv\Scripts\activate

# Install the required dependencies
pip install -r req.txt

# Run the application
python app.py
```
[final prototype](https://youtu.be/QpoXYHmfJM0)

## Project Demo

- [prototype_3_video](https://youtu.be/k1i_r_9FjnQ)
- [prototype 2 video](https://youtu.be/ZBcQ-eYioMY)
- [prototype 1 video](https://youtu.be/SxAdyucfv6o)
---

## Additional Information

- **Source Code:** [GoodWill AI GitHub Repository](https://github.com/22f1001023/GoodWillAI)[1]
- **Rules & Constraints:**  
  - Only one admin (no registration for admin).
  - Registration form must include: email, username, role (Higher Officials, Finance Team, Planning Team), password, and confirm password.
  - All technologies and frameworks must adhere strictly to the stack listed above[1].

---

> *For questions or contributions, please refer to the repository or contact the team members directly.*
sanjaybdatascientist@gmail.com

---
Another prototype which failed due to lack of time: [Prototype](https://github.com/22f1001023/GoodwillAI_prototype/settings)



**Current Date:** Wednesday, May 28, 2025, 9:24 PM IST


