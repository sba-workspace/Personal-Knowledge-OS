#!/usr/bin/env python3
"""
Background worker to process Redis tasks
Run this separately: python worker.py
"""

import asyncio
import logging
from src.services.redis_service import process_tasks

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    logger.info("Starting background worker...")
    try:
        await process_tasks()
    except KeyboardInterrupt:
        logger.info("Worker stopped by user")
    except Exception as e:
        logger.error(f"Worker error: {e}")

if __name__ == "__main__":
    asyncio.run(main())