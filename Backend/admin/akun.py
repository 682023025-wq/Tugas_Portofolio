from flask import Blueprint, request, jsonify
from model import Database
from Backend.admin.login import token_required

akun_bp = Blueprint('akun', __name__)

@akun_bp.route('/api/akun', methods=['GET'])
@token_required
def get_akun(current_user):
    """Mengambil data akun user"""
    try:
        db = Database()
        
        query = """
            SELECT id, username, role, created_at 
            FROM users 
            WHERE id = %s
        """
        result = db.execute_query(query, (current_user,), fetch=True)
        
        if not result:
            return jsonify({'error': 'User tidak ditemukan'}), 404
        
        return jsonify({
            'success': True,
            'data': result[0]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@akun_bp.route('/api/akun', methods=['PUT'])
@token_required
def update_akun(current_user):
    """Update data akun (username dan password)"""
    try:
        data = request.get_json()
        username = data.get('username')
        new_password = data.get('password')
        
        db = Database()
        
        # Update username jika ada
        if username:
            # Cek apakah username sudah digunakan user lain
            check_query = "SELECT id FROM users WHERE username = %s AND id != %s"
            existing = db.execute_query(check_query, (username, current_user), fetch=True)
            
            if existing:
                return jsonify({'error': 'Username sudah digunakan'}), 400
            
            update_query = "UPDATE users SET username = %s WHERE id = %s"
            db.execute_query(update_query, (username, current_user))
        
        # Update password jika ada
        if new_password:
            from werkzeug.security import generate_password_hash
            password_hash = generate_password_hash(new_password)
            update_query = "UPDATE users SET password_hash = %s WHERE id = %s"
            db.execute_query(update_query, (password_hash, current_user))
        
        return jsonify({
            'success': True,
            'message': 'Data akun berhasil diupdate'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@akun_bp.route('/api/akun/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    """Ganti password"""
    try:
        data = request.get_json()
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        
        if not old_password or not new_password:
            return jsonify({'error': 'Password lama dan baru wajib diisi'}), 400
        
        db = Database()
        
        # Ambil password hash saat ini
        query = "SELECT password_hash FROM users WHERE id = %s"
        result = db.execute_query(query, (current_user,), fetch=True)
        
        if not result:
            return jsonify({'error': 'User tidak ditemukan'}), 404
        
        from werkzeug.security import check_password_hash, generate_password_hash
        
        # Verifikasi password lama
        if not check_password_hash(result[0]['password_hash'], old_password):
            return jsonify({'error': 'Password lama salah'}), 401
        
        # Update password baru
        new_password_hash = generate_password_hash(new_password)
        update_query = "UPDATE users SET password_hash = %s WHERE id = %s"
        db.execute_query(update_query, (new_password_hash, current_user))
        
        return jsonify({
            'success': True,
            'message': 'Password berhasil diubah'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
