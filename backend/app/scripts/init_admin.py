import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.admin import Admin
from app.core.security import get_password_hash
from app.core.config import settings

def init_admin():
    db = SessionLocal()
    try:
        # Check if admin exists
        admin = db.query(Admin).filter(Admin.email == settings.ADMIN_EMAIL).first()
        if admin:
            print("Admin already exists")
            return
        
        # Create admin
        admin = Admin(
            email=settings.ADMIN_EMAIL,
            password_hash=get_password_hash(settings.ADMIN_PASSWORD)
        )
        db.add(admin)
        db.commit()
        print(f"✅ Admin created successfully!")
        print(f"📧 Email: {settings.ADMIN_EMAIL}")
        print(f"🔑 Password: {settings.ADMIN_PASSWORD}")
        print("⚠️  Please change the password after first login!")
    finally:
        db.close()

if __name__ == "__main__":
    init_admin()
    