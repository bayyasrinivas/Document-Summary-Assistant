from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF for PDF
import pytesseract
from PIL import Image
import io

app = FastAPI()

# 🌐 Allow frontend requests (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 Extract text from PDF
def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        return "\n".join([page.get_text("text") for page in doc])
    except Exception:
        return ""

# 🧠 Extract text from image using OCR
def extract_text_from_image(image_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(image_bytes))
        return pytesseract.image_to_string(image)
    except Exception:
        return ""

# 🧩 Improved summarizer (supports Bullet Points)
def smart_summarizer(text: str, length: str) -> dict:
    if not text.strip():
        return {
            "summary": "❌ No readable text found in the document.",
            "highlights": [],
            "improvement_suggestions": [],
        }

    sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 0]
    total = len(sentences)

    if total == 0:
        return {
            "summary": text,
            "highlights": [],
            "improvement_suggestions": [],
        }

    # Choose summary length
    if length.lower() == "short":
        n = min(3, total)
    elif length.lower() == "medium":
        n = min(6, total)
    elif length.lower() == "long":
        n = min(10, total)
    elif length.lower() in ["bullet points", "bulletpoints"]:
        # Bullet points summary format 🟢
        bullets = "\n".join([f"• {s}" for s in sentences[:min(8, total)]])
        return {
            "summary": f"🔹 Bullet Point Summary:\n{bullets}",
            "highlights": sentences[:min(5, total)],
            "improvement_suggestions": [
                "Add subheadings for each section.",
                "Provide concise key points.",
                "Use consistent formatting throughout.",
            ],
        }
    else:
        n = min(5, total)

    # Generate text-based summary
    summary = ". ".join(sentences[:n]) + "."
    highlights = sentences[:min(5, total)]
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
async def upload_file(
    file: UploadFile = File(...),
    length: str = Form("short"),  # 👈 receives Format (Short, Medium, Long, Bullet Points)
):
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

    result = smart_summarizer(text, length)
    return result
