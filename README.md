📄 Document Summary Assistant

✨ An AI-powered web app that extracts, analyzes, and summarizes documents (PDFs or images) into concise, smart summaries with key insights and suggestions.

🚀 Overview

Document Summary Assistant is a full-stack AI application built using React + Tailwind CSS (frontend) and FastAPI (backend).
It allows users to upload PDFs or scanned documents (images), automatically extract text using OCR, and generate smart summaries with adjustable lengths — Short, Medium, or Long — along with key highlights and improvement suggestions.

🧠 Key Features

✅ Upload PDF or image (JPG, PNG)
✅ OCR support for scanned documents (via pytesseract)
✅ Smart AI summarization using NLP
✅ Adjustable summary length (Short / Medium / Long / Bullet Points)
✅ Modern and responsive UI (Tailwind CSS)
✅ Dark / Light theme toggle
✅ Backend built with FastAPI for performance and simplicity

🛠️ Tech Stack
Layer	Technology
Frontend	React, Tailwind CSS, Vite
Backend	FastAPI, Python
AI / OCR	PyMuPDF, pytesseract, transformers / OpenAI API (optional)
Hosting	Vercel (frontend), Render / Railway (backend)
⚙️ Setup Instructions
🧩 1️⃣ Clone the Repository
git clone https://github.com/bayyasrinivas/Document-Summary-Assistant.git
cd Document-Summary-Assistant

⚙️ 2️⃣ Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate        # On Windows
# source venv/bin/activate   # On Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000


✅ Backend runs at: http://127.0.0.1:8000

Check API docs here → http://127.0.0.1:8000/docs

💻 3️⃣ Frontend Setup

Open a new terminal:

cd ../frontend
npm install
npm run dev


✅ Frontend runs at: http://localhost:5173

🧩 How It Works

Upload any PDF or image document.

The backend extracts text using OCR (for images) or PDF parsing.

The AI engine summarizes the content using NLP techniques.

The frontend displays a formatted summary with key highlights and suggestions.



	
🧑‍💻 Project Structure
Document-Summary-Assistant/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── summarizer.py
│   │   └── ocr_utils.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   ├── public/
│   ├── package.json
│
└── README.md

🌐 Future Improvements

🚀 Add multi-language summarization (Telugu, Hindi, etc.)
🤖 Integrate GPT/OpenAI for better summaries
📊 Add summary analytics and keyword extraction
📱 Improve mobile UI and add file history feature

👨‍💻 Author

🧑‍💻 Srinivas Bayya
B.Tech CSE | Passionate about AI, UI/UX & Web Development
📧 Contact: srinivadbayyadev@gmail.com,6305413688

🌐 GitHub
 • LinkedIn

⭐ Support

If you like this project —
⭐ Star this repository and share it with your friends!
