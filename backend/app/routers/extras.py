from fastapi import APIRouter

router = APIRouter(prefix="/api/extras", tags=["extras"])

@router.get("/health")
async def extras_health():
    return {"status": "ok", "message": "Extras router active"}
