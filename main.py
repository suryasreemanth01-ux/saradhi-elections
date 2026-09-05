from fastapi.middleware.cors import CORSMiddleware

# Add this before your routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://saradhi-elections-frontend.onrender.com",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
