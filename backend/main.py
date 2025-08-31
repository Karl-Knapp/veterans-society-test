from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import fitness

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://morganvalleyweb.com", 
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fitness.router) 