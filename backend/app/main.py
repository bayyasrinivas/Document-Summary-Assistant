from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF for PDF
import pytesseract
from PIL import Image
import io
import textwrap

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 Extract text from PDF
def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text("text") + "\n"
        return text.strip()
    except Exception:
        return ""

# 🧠 Extract text from image using OCR
def extract_text_from_image(image_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception:
        return ""

# 🧠 Simple text summarizer
def simple_summarizer(text: str, length: str) -> dict:
    if not text.strip():
        return {"summary": "No readable text found in the document.",
                "highlights": [], "improvement_suggestions": []}

    # Split text into sentences
    sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 0]
    total = len(sentences)

    if total == 0:
        return {"summary": text, "highlights": [], "improvement_suggestions": []}

    # Summary size logic
    if length == "short":
        n = min(3, total)
    elif length == "medium":
        n = min(6, total)
    else:
        n = min(10, total)

    summary = ". ".join(sentences[:n]) + "."
    highlights = [s for s in sentences[:min(5, total)]]
    suggestions = [
        "Ensure document has clear section headings.",
        "Add an executive summary at the start.",
        "Include visuals or tables for better clarity.",
    ]

    return {
        "summary": summary,
        "highlights": highlights,
        "improvement_suggestions": suggestions,
    }

# 📄 Upload & summarize endpoint
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), length: str = Form("short")):
    contents = await file.read()

    # Check file type
    if file.content_type == "application/pdf":
        text = extract_text_from_pdf(contents)
    elif "image" in file.content_type:
        text = extract_text_from_image(contents)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload PDF or image.")

    if not text.strip():
        raise HTTPException(status_code=400, detail="No text detected. Try a clearer document.")

    result = simple_summarizer(text, length)
    return result
