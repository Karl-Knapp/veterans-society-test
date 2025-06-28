from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import fitness

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://172.31.87.54:5173",
    "http://34.238.233.251:5173"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fitness.router) 