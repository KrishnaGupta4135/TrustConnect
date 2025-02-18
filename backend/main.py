import uvicorn
from fastapi.responses import RedirectResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from src.routers import users_router, qna_router, feedback_router,dashboard_route
from src.routers import users_router
from src.config import APPNAME, VERSION
from starlette.middleware.sessions import SessionMiddleware
import os
from dotenv import load_dotenv
load_dotenv()


# Defining the application
app = FastAPI(
    title=APPNAME,
    version=VERSION,
)

# Define allowed origins
origins = [
    "http://localhost:5173",  # Frontend during development
    "http://127.0.0.1:5173",  # Alternate localhost
    #"http://ec2-3-219-12-193.compute-1.amazonaws.com:5173"
    # "http://ec2-3-219-12-193.compute-1.amazonaws.com",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies and credentials
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY", "default_secret_key"))

# Including all the routes for the 'users' module
app.include_router(users_router)
# app.include_router(qna_router)
# app.include_router(feedback_router)
# app.include_router(dashboard_route)

@app.get("/")
def main_function():
    """
    Redirect to documentation (`/docs/`).
    """
    return RedirectResponse(url="/docs/")

@app.post("/token")
def forward_to_login():
    """
    Redirect to token-generation (`/auth/token`). Used to make Auth in Swagger-UI work.
    """
    return RedirectResponse(url="/token")


# @app.get("/api")
# async def read_root():
#     return {"message": "Hello from API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)