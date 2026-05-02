import traceback
import logging

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer

logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        "id":       request.user.id,
        "username": request.user.username,
        "email":    request.user.email or "",
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """Create a new user account."""
    try:
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Account created successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        # Log the full traceback to the server console
        logger.error("Registration failed: %s", str(e))
        logger.error(traceback.format_exc())
        print(f"[REGISTER ERROR] {type(e).__name__}: {e}")
        print(traceback.format_exc())

        # Return the actual error to the frontend so we can debug
        return Response(
            {"error": f"{type(e).__name__}: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
