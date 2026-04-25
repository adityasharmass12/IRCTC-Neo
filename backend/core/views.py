\
\
\
\
\
\
\
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
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
\
\
\
\
\
\
\
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"detail": "Account created successfully."},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
