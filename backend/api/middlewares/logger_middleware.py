from collections.abc import Callable
from datetime import datetime
from typing import Any
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from loguru import logger

class LoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Any]
    ) -> Response:
        """
        Logs all incoming and outgoing request, response pairs. This method logs the request params,
        datetime of request, duration of execution. Logs should be printed using the custom logging module provided.
        Logs should be printed so that they are easily readable and understandable.

        :param request: Request received to this middleware from client (it is supplied by FastAPI)
        :param call_next: Endpoint or next middleware to be called (if any, this is the next middleware in the chain of middlewares, it is supplied by FastAPI)
        :return: Response from endpoint


        personal comments: 
        must override dispatch method of BaseHTTPMiddleware with custom logging 
        request -> LoggerMiddleware -> endpoint -> response
        """

        # COMPLETED:(Member) Finish implementing this method
        start_time = datetime.now()

        try:
             body = await request.json()
             
        except Exception:
             body_bytes = await request.body()
             body = body_bytes.decode("utf-8") if body_bytes else None

        logger.info(f"REQUEST: {request.method} {request.url} - PARAMS: {body}")

        response = await call_next(request)
        duration = datetime.now() - start_time
        logger.info(f"RESPONSE: {response.status_code} {request.url} ({duration.total_seconds():.2f}s)")
        return response
    
