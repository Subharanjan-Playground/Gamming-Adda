import os
import hashlib
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./gaming_cafe.db")

engine_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def hash_pw(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# ---------------------------------------------------------
# DATABASE MODELS
# ---------------------------------------------------------
class UserModel(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    password_hash = Column(String)
    role = Column(String, default="customer") # "customer" or "admin"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Gaming Pass fields
    pass_type = Column(String, nullable=True) # "15_days" or "30_days"
    pass_start_date = Column(DateTime, nullable=True)
    pass_end_date = Column(DateTime, nullable=True)
    pass_hours_remaining = Column(Float, default=0.0)

class StationModel(Base):
    __tablename__ = "stations"
    id = Column(String, primary_key=True, index=True)
    branch_id = Column(String, index=True)
    name = Column(String)
    station_type = Column(String)
    price_per_hour = Column(Float)
    status = Column(String, default="available")
    active_game = Column(String, nullable=True)
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    duration_minutes = Column(Integer, default=0)
    session_start_time = Column(DateTime, nullable=True)
    session_end_time = Column(DateTime, nullable=True)

class GameModel(Base):
    __tablename__ = "games"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    platform = Column(String, index=True)
    genre = Column(String)
    badge = Column(String, nullable=True)

class MenuItemModel(Base):
    __tablename__ = "menu_items"
    id = Column(String, primary_key=True, index=True)
    branch_id = Column(String, index=True)
    name = Column(String)
    category = Column(String)
    price = Column(Float)
    in_stock = Column(Boolean, default=True)

class SessionBookingModel(Base):
    __tablename__ = "bookings"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True)
    branch_id = Column(String)
    station_id = Column(String)
    game_title = Column(String)
    customer_name = Column(String)
    customer_phone = Column(String)
    duration_minutes = Column(Integer)
    total_amount = Column(Float)
    used_pass = Column(Boolean, default=False)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

class OrderModel(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, index=True)
    branch_id = Column(String)
    station_id = Column(String)
    customer_name = Column(String)
    customer_phone = Column(String)
    items_summary = Column(String)
    total_amount = Column(Float)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------
# DATABASE INITIAL SEEDER (Includes the 2 Dedicated Admins)
# ---------------------------------------------------------
def seed_database():
    db = SessionLocal()
    try:
        # Seed 2 Admin Accounts
        admin_emails = ["admin1@cyberzone.com", "admin2@cyberzone.com"]
        for idx, email in enumerate(admin_emails, 1):
            if not db.query(UserModel).filter(UserModel.email == email).first():
                owner = UserModel(
                    id=f"OWNER-00{idx}",
                    name=f"Cafe Owner {idx}",
                    email=email,
                    phone="9999999999",
                    password_hash=hash_pw("Admin@9900"),
                    role="admin"
                )
                db.add(owner)

        # Seed Stations if none exist
        if db.query(StationModel).count() == 0:
            default_stations = [
                StationModel(id="A-PC-01", branch_id="shop_a", name="RTX 4080 Rig 01", station_type="pc", price_per_hour=60.0),
                StationModel(id="A-PC-02", branch_id="shop_a", name="RTX 4080 Rig 02", station_type="pc", price_per_hour=60.0),
                StationModel(id="A-PC-03", branch_id="shop_a", name="RTX 4070Ti Rig 03", station_type="pc", price_per_hour=60.0),
                StationModel(id="A-PS-01", branch_id="shop_a", name="PS5 VIP Lounge 01", station_type="ps", price_per_hour=80.0),
                StationModel(id="A-PS-02", branch_id="shop_a", name="PS5 VIP Lounge 02", station_type="ps", price_per_hour=80.0),
                StationModel(id="B-PC-01", branch_id="shop_b", name="Titan Rig 01", station_type="pc", price_per_hour=60.0),
                StationModel(id="B-PC-02", branch_id="shop_b", name="Titan Rig 02", station_type="pc", price_per_hour=60.0),
                StationModel(id="B-PS-01", branch_id="shop_b", name="PS5 Stadium Pod 01", station_type="ps", price_per_hour=80.0),
                StationModel(id="B-PS-02", branch_id="shop_b", name="PS5 Stadium Pod 02", station_type="ps", price_per_hour=80.0),
            ]
            db.add_all(default_stations)

        # Seed Games
        if db.query(GameModel).count() == 0:
            db.add_all([
                GameModel(id="ps-1", title="EA Sports FC 26", platform="PS5", genre="Sports Sim", badge="HOT"),
                GameModel(id="ps-2", title="Tekken 8", platform="PS5", genre="Fighting", badge="TOP"),
                GameModel(id="ps-3", title="Spider-Man 2", platform="PS5", genre="Action", badge="POPULAR"),
                GameModel(id="pc-1", title="Counter-Strike 2", platform="PC", genre="Tactical FPS", badge="HOT"),
                GameModel(id="pc-2", title="Valorant", platform="PC", genre="Hero Shooter", badge="TOP"),
                GameModel(id="pc-3", title="GTA V", platform="PC", genre="Open World", badge="POPULAR"),
            ])

        # Seed Menu Items
        if db.query(MenuItemModel).count() == 0:
            for b in ["shop_a", "shop_b"]:
                db.add_all([
                    MenuItemModel(id=f"{b}-m-1", branch_id=b, name="Red Bull 250ml", category="drinks", price=125.0, in_stock=True),
                    MenuItemModel(id=f"{b}-m-2", branch_id=b, name="Monster Energy 350ml", category="drinks", price=120.0, in_stock=True),
                    MenuItemModel(id=f"{b}-m-3", branch_id=b, name="Classic Maggi Masala", category="food", price=50.0, in_stock=True),
                    MenuItemModel(id=f"{b}-m-4", branch_id=b, name="Cheese Butter Maggi", category="food", price=75.0, in_stock=True),
                ])
        db.commit()
    finally:
        db.close()

seed_database()

# ---------------------------------------------------------
# FASTAPI APP
# ---------------------------------------------------------
app = FastAPI(title="CyberZone Gaming OS")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# SCHEMAS
class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class PassPurchaseRequest(BaseModel):
    user_id: str
    pass_type: str # "15_days" or "30_days"

class BookingRequest(BaseModel):
    user_id: Optional[str] = None
    station_id: str
    game_title: str
    customer_name: str
    customer_phone: str
    duration_minutes: int
    use_pass: bool = False

class StationExtendRequest(BaseModel):
    station_id: str
    additional_minutes: int

class ReleaseStationRequest(BaseModel):
    station_id: str

class CreateOrderRequest(BaseModel):
    branch_id: str
    station_id: str
    customer_name: str
    customer_phone: str
    items_summary: str
    total_amount: float

# ---------------------------------------------------------
# AUTH & PASS ROUTES
# ---------------------------------------------------------
@app.post("/api/auth/register")
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == req.email.lower().strip()).first():
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = UserModel(
        id=f"USR-{int(datetime.utcnow().timestamp())}",
        name=req.name.strip(),
        email=req.email.lower().strip(),
        phone=req.phone.strip(),
        password_hash=hash_pw(req.password),
        role="customer"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "pass_type": None,
        "days_remaining": 0,
        "hours_remaining": 0
    }

@app.post("/api/auth/login")
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == req.email.lower().strip()).first()
    if not user or user.password_hash != hash_pw(req.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    days_remaining = 0
    if user.pass_end_date and user.pass_end_date > datetime.utcnow():
        days_remaining = max(0, (user.pass_end_date - datetime.utcnow()).days)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "pass_type": user.pass_type if days_remaining > 0 else None,
        "days_remaining": days_remaining,
        "hours_remaining": user.pass_hours_remaining if days_remaining > 0 else 0
    }

@app.post("/api/user/buy-pass")
def buy_pass(req: PassPurchaseRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    now = datetime.utcnow()
    if req.pass_type == "15_days":
        user.pass_type = "15_days"
        user.pass_start_date = now
        user.pass_end_date = now + timedelta(days=15)
        user.pass_hours_remaining = 30.0
    elif req.pass_type == "30_days":
        user.pass_type = "30_days"
        user.pass_start_date = now
        user.pass_end_date = now + timedelta(days=30)
        user.pass_hours_remaining = 75.0
    else:
        raise HTTPException(status_code=400, detail="Invalid pass type")

    db.commit()
    days_left = (user.pass_end_date - now).days
    return {
        "message": f"Successfully activated {req.pass_type.replace('_', ' ')} pass!",
        "pass_type": user.pass_type,
        "days_remaining": days_left,
        "hours_remaining": user.pass_hours_remaining
    }

# ---------------------------------------------------------
# STATIONS, BOOKINGS & ORDERS
# ---------------------------------------------------------
@app.get("/api/stations")
def get_stations(branch_id: str = "shop_a", db: Session = Depends(get_db)):
    stations = db.query(StationModel).filter(StationModel.branch_id == branch_id).all()
    now = datetime.utcnow()
    results = []
    for s in stations:
        seconds_remaining = 0
        if s.status == "occupied" and s.session_end_time:
            seconds_remaining = max(0, int((s.session_end_time - now).total_seconds()))
        results.append({
            "id": s.id,
            "branch_id": s.branch_id,
            "name": s.name,
            "station_type": s.station_type,
            "price_per_hour": s.price_per_hour,
            "status": s.status,
            "active_game": s.active_game,
            "customer_name": s.customer_name,
            "customer_phone": s.customer_phone,
            "seconds_remaining": seconds_remaining
        })
    return results

@app.post("/api/bookings")
def book_station(req: BookingRequest, db: Session = Depends(get_db)):
    station = db.query(StationModel).filter(StationModel.id == req.station_id).first()
    if not station or station.status != "available":
        raise HTTPException(status_code=400, detail="Station not available")

    hours = req.duration_minutes / 60.0
    bill = station.price_per_hour * hours

    user = None
    if req.user_id:
        user = db.query(UserModel).filter(UserModel.id == req.user_id).first()

    if req.use_pass:
        if not user or not user.pass_end_date or user.pass_end_date < datetime.utcnow():
            raise HTTPException(status_code=400, detail="No active pass available")
        if user.pass_hours_remaining < hours:
            raise HTTPException(status_code=400, detail="Insufficient pass hours")
        user.pass_hours_remaining -= hours
        bill = 0.0

    now = datetime.utcnow()
    end_time = now + timedelta(minutes=req.duration_minutes)

    booking = SessionBookingModel(
        id=f"BK-{int(now.timestamp())}",
        user_id=req.user_id,
        branch_id=station.branch_id,
        station_id=station.id,
        game_title=req.game_title,
        customer_name=req.customer_name,
        customer_phone=req.customer_phone,
        duration_minutes=req.duration_minutes,
        total_amount=bill,
        used_pass=req.use_pass,
        status="active"
    )

    station.status = "occupied"
    station.active_game = req.game_title
    station.customer_name = req.customer_name
    station.customer_phone = req.customer_phone
    station.duration_minutes = req.duration_minutes
    station.session_start_time = now
    station.session_end_time = end_time

    db.add(booking)
    db.commit()
    return {"message": "Session Activated", "booking_id": booking.id}

@app.post("/api/stations/release")
def release_station(req: ReleaseStationRequest, db: Session = Depends(get_db)):
    st = db.query(StationModel).filter(StationModel.id == req.station_id).first()
    if not st:
        raise HTTPException(status_code=404, detail="Station not found")
    st.status = "available"
    st.active_game = None
    st.customer_name = None
    st.customer_phone = None
    st.session_start_time = None
    st.session_end_time = None
    db.commit()
    return {"message": "Station released"}

@app.post("/api/stations/extend")
def extend_station(req: StationExtendRequest, db: Session = Depends(get_db)):
    st = db.query(StationModel).filter(StationModel.id == req.station_id).first()
    if not st or st.status != "occupied":
        raise HTTPException(status_code=400, detail="Station not occupied")
    base = st.session_end_time if st.session_end_time > datetime.utcnow() else datetime.utcnow()
    st.session_end_time = base + timedelta(minutes=req.additional_minutes)
    st.duration_minutes = (st.duration_minutes or 0) + req.additional_minutes
    db.commit()
    return {"message": f"Added {req.additional_minutes} mins"}

@app.get("/api/orders")
def get_orders(branch_id: str = "shop_a", db: Session = Depends(get_db)):
    return db.query(OrderModel).filter(OrderModel.branch_id == branch_id).order_by(OrderModel.created_at.desc()).all()

@app.post("/api/orders")
def create_order(req: CreateOrderRequest, db: Session = Depends(get_db)):
    new_order = OrderModel(
        id=f"ORD-{int(datetime.utcnow().timestamp())}",
        branch_id=req.branch_id,
        station_id=req.station_id,
        customer_name=req.customer_name,
        customer_phone=req.customer_phone,
        items_summary=req.items_summary,
        total_amount=req.total_amount,
        status="pending"
    )
    db.add(new_order)
    db.commit()
    return new_order

@app.post("/api/orders/{order_id}/complete")
def complete_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = "delivered"
    db.commit()
    return {"message": "Delivered"}