"""Точка входа FastAPI. Запуск: uvicorn main:app --reload"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data_store import DataStore
from routers import system, analytics


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Загружаем данные ОДИН раз при старте (задача 3.1)."""
    print("Загрузка DataStore...")
    DataStore.load()
    yield
    print("Остановка сервера")


app = FastAPI(
    title="Культура Analytics API",
    description="Backend для дашборда аналитики учреждений культуры",
    version="1.0.0",
    lifespan=lifespan,
)


# CORS (задача 3.13)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Подключаем роутеры
app.include_router(system.router, tags=["System"])
app.include_router(analytics.router, tags=["Analytics"])


@app.get("/")
def root():
    return {"message": "Analytics API is running", "docs": "/docs"}