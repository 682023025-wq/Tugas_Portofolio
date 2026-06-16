import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # TiDB Cloud Database Configuration
    DB_HOST = os.getenv('DB_HOST', 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com')
    DB_PORT = int(os.getenv('DB_PORT', 4000))
    DB_USER = os.getenv('DB_USER', 'Uh9MdmkBuB1c7tH.root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'dEmrDAa5kTRC420d')
    DB_NAME = os.getenv('DB_NAME', 'Portofolio')
    
    # MySQL Connection String for mysql.connector
    MYSQL_CONFIG = {
        'host': DB_HOST,
        'port': DB_PORT,
        'user': DB_USER,
        'password': DB_PASSWORD,
        'database': DB_NAME,
        'ssl_ca': os.getenv('DB_CA_PATH', None)
    }
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    # Cloudinary Configuration
    CLOUDINARY_URL = os.getenv('CLOUDINARY_URL', 'cloudinary://884765233771594:qOYvn2w1TsW_ipwEzhgqB8RRTKE@daknwopl3')
    
    # Resend API Configuration (untuk email)
    RESEND_API_KEY = os.getenv('RESEND_API_KEY', 're_Sk1G87rv_783KGz9c5QAaifSaZ3oxZdKs')
