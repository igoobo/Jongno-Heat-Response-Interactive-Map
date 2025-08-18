from pydantic import BaseModel

class Coordinates(BaseModel):
    lat: float
    lng: float

class QueryRequest(BaseModel):
    question: str