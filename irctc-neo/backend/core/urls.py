from django.urls import path
from . import views
urlpatterns = [
    path("me/", views.me, name="me"),
    path("register/", views.register, name="register"),
]
