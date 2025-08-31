# api/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from api.config import login_manager
from api.routers import users, posts, comments, chat, groups, fitness, overpass, donations, forms
from starlette.middleware.sessions import SessionMiddleware
import nltk


# Download all required NLTK data during startup
try:
    nltk.download('punkt')
    nltk.download('averaged_perceptron_tagger')
    nltk.download('stopwords')
    nltk.download('wordnet')
except Exception as e:
    print(f"Warning: Failed to download NLTK data: {e}")

app = FastAPI(
    title="Veterans Society API",
    description="API for user registration and other functionalities.",
    version="1.0.0"
)

# CORS configuration
origins = [
    "https://morganvalleyweb.com",
    "https://api.morganvalleyweb.com"  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.middleware("http")
async def force_https_redirects(request: Request, call_next):
    # Check if request came through HTTPS (ALB sets this header)
    if request.headers.get("x-forwarded-proto") == "https":
        request.scope["scheme"] = "https"
    response = await call_next(request)
    return response

app.include_router(users.router)
app.include_router(chat.router)
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(groups.router)
app.include_router(fitness.router)
app.include_router(overpass.router)
app.include_router(donations.router)
app.include_router(forms.router)
@app.get("/")
def read_root():
    return {"message": "Welcome to the BTH Fitness API"}
