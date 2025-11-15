from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF for PDF
import pytesseract
from PIL import Image, ImageOps
import io

# 👉 Point Tesseract to correct exe path (WINDOWS)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = FastAPI()

@app.get("/")
def root():
    return {"message": "✅ Backend is working fine!"}

# 🌐 Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📌 Extract text from PDF
def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        all_text = ""

        for page in doc:
            text = page.get_text("text")
            if text.strip():
                all_text += text + "\n"

            # If PDF contains scanned images → OCR them
            images = page.get_images(full=True)
            for img_index, img in enumerate(images):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                pil_image = Image.open(io.BytesIO(image_bytes))

                # Convert to grayscale, enhance for better OCR
                pil_image = ImageOps.grayscale(pil_image)
                ocr_text = pytesseract.image_to_string(pil_image)

                all_text += ocr_text + "\n"

        return all_text.strip()

    except Exception as e:
        print("PDF Error:", e)
        return ""

# 📌 Extract text from image using OCR
def extract_text_from_image(image_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(image_bytes))

        # Auto rotate if needed
        image = ImageOps.exif_transpose(image)

        # Convert to grayscale for better OCR accuracy
        gray = ImageOps.grayscale(image)

        # Perform OCR
        text = pytesseract.image_to_string(gray)

        return text.strip()

    except Exception as e:
        print("IMAGE OCR Error:", e)
        return ""

# 🧠 Smart Summarizer
def smart_summarizer(text: str, length: str) -> dict:
    if not text.strip():
        return {
            "summary": "❌ No readable text found.",
            "highlights": [],
            "improvement_suggestions": [],
        }

    sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 3]
    total = len(sentences)

    if total == 0:
        return {
            "summary": text,
            "highlights": [],
            "improvement_suggestions": [],
        }

    # Length-based summary
    if length.lower() == "short":
        n = min(3, total)
    elif length.lower() == "medium":
        n = min(6, total)
    elif length.lower() == "long":
        n = min(10, total)
    elif length.lower() in ["bullet points", "bulletpoints"]:
        bullets = "\n".join([f"• {s}" for s in sentences[:min(10, total)]])
        return {
            "summary": f"🔹 Bullet Point Summary:\n{bullets}",
            "highlights": sentences[:min(5, total)],
            "improvement_suggestions": [
                "Use clear headings.",
                "Summaries can be shortened further.",
                "Improve clarity in key areas.",
            ],
        }
    else:
        n = min(5, total)

    summary = ". ".join(sentences[:n]) + "."
    highlights = sentences[:min(5, total)]

    suggestions = [
        "Add more structured sections.",
        "Use bullet points for clarity.",
        "Improve visual layout for easier reading.",
    ]

    return {
        "summary": summary,
        "highlights": highlights,
        "improvement_suggestions": suggestions,
    }

# 📄 Upload & Summarize API
@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    length: str = Form("short"),
):
    contents = await file.read()

    # Detect file type
    if file.content_type == "application/pdf":
        text = extract_text_from_pdf(contents)
    elif "image" in file.content_type:  
        text = extract_text_from_image(contents)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload PDF or Image.")

    if not text.strip():
        raise HTTPException(status_code=400, detail="No text detected — upload clearer document.")

    return smart_summarizer(text, length)

# Run manually
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
