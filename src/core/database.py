from prisma import Prisma
from src.core.config import settings

prisma = Prisma(datasource={'url': settings.database_url})

async def connect_db():
    await prisma.connect()

async def disconnect_db():
    await prisma.disconnect()


