from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from model import Database
import jwt
import datetime
from functools import wraps
from config import Config

login_bp = Blueprint('login', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Cek token dari header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        # Cek token dari session (untuk web)
        if not token:
            token = session.get('token')
        
        if not token:
            return jsonify({'error': 'Token tidak ditemukan'}), 401
        
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            current_user = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token telah kadaluarsa'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token tidak valid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@login_bp.route('/api/login', methods=['POST'])
def login():
    """Endpoint untuk login admin"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username dan password wajib diisi'}), 400
        
        db = Database()
        
        # Query user berdasarkan username
        query = "SELECT id, username, password_hash, role FROM users WHERE username = %s"
        user = db.execute_query(query, (username,), fetch=True)
        
        if not user:
            return jsonify({'error': 'Username tidak ditemukan'}), 404
        
        user = user[0]
        
        # Verifikasi password (bcrypt)
        # Catatan: Di production, gunakan check_password_hash dengan bcrypt yang sebenarnya
        # Untuk sekarang kita gunakan plain comparison jika hash belum di-set dengan benar
        if not check_password_hash(user['password_hash'], password):
            # Fallback untuk testing jika password belum di-hash dengan benar
            if user['password_hash'] != password:
                return jsonify({'error': 'Password salah'}), 401
        
        # Generate JWT Token
        token = jwt.encode({
            'user_id': user['id'],
            'username': user['username'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm='HS256')
        
        # Set session untuk web-based login
        session['token'] = token
        session['user_id'] = user['id']
        session['username'] = user['username']
        
        return jsonify({
            'message': 'Login berhasil',
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'role': user['role']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@login_bp.route('/api/logout', methods=['POST'])
def logout():
    """Endpoint untuk logout"""
    session.clear()
    return jsonify({'message': 'Logout berhasil'}), 200

@login_bp.route('/api/auth/check', methods=['GET'])
def check_auth():
    """Cek status autentikasi"""
    token = session.get('token')
    
    if not token:
        return jsonify({'authenticated': False}), 401
    
    try:
        data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        return jsonify({
            'authenticated': True,
            'user': {
                'id': data['user_id'],
                'username': data['username'],
                'role': data['role']
            }
        }), 200
    except:
        return jsonify({'authenticated': False}), 401
