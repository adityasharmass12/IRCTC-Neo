"""
Build hook for Vercel: runs Django migrations against the production database.
Set as the build command in Vercel project settings.
Usage: python backend/build_and_migrate.py
"""
import os
import sys
import django

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

django.setup()

from django.core.management import call_command

print("Running migrations...")
call_command("migrate", "--no-input")
print("Migrations complete.")
