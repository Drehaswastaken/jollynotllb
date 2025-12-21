# Astra AI Court

**Your Personal Legal Strategy Team, Powered by AI.**

Astra AI Court (project code: `jollynotllb`) is a legal simulation platform that helps you understand your legal standing before you ever talk to a lawyer. We use a set of AI agents to look at your problem from different angles, telling you what you need to prove, what the other side will say, and what your chances actually are.


---

## What is this?

Legal advice is expensive and scary. Most people don't know if they even have a case worth fighting. Astra AI Court is here to fix that by giving you a free, instant second opinion.

We use a "Multi-Agent System," which basically means we have three different AIs working together to act like a real legal team:

1.  **The Legal Clerk:** This agent does the research. It figures out exactly what the law requires you to prove for your specific problem.
2.  **The Devil's Advocate:** This agent tries to poke holes in your story. It finds the weaknesses and loopholes you might have missed.
3.  **The Lead Strategist:** This agent takes all that information and gives you a final report. It tells you your odds of winning and gives you a simple, 3-step plan to improve your case.

---

## Tech Stack

We built this using standard, reliable web technologies and some powerful open-source AI.

### Frontend
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

### Backend
- **Framework:** FastAPI (Python)
- **AI Model:** Qwen 2.5 7B (via Hugging Face)
- **Architecture:** Multi-Agent Orchestration
- **Hosting:** Render

---

## Run it Locally

If you want to run this on your own computer, here is how you do it.

### Prerequisites
- Node.js & npm
- Python 3.8+
- A Hugging Face API Token (Free)

### 1. Clone the Repository
```bash
git clone https://github.com/Drehaswastaken/jollynotllb.git
cd jollynotllb
```

### 2. Set up the Backend
```bash
cd backend
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file
echo "HF_TOKEN=your_hugging_face_token_here" > .env

# Run the server
uvicorn main:app --reload
```
The backend will start at `http://localhost:8000` (or `10000` if configured).

### 3. Set up the Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Create a .env.local file (optional, defaults to localhost:10000)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run the development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## How It Works

1.  **Enter Your Case:** Just type out what happened in the text box.
2.  **System Analysis:** Watch as the agents analyze your text.
3.  **Get Results:** You'll get a breakdown of the law, the risks, and a final strategy.

---

## Contributing

We built this for a hackathon to show how useful specialized AI agents can be. If you want to add to it, feel free to fork the repo and send us a pull request!

---

*Disclaimer: This is an AI simulation for educational and entertainment purposes. It is not professional legal advice.*