from flask import Blueprint, request, jsonify
from model import Database
from Backend.admin.login import token_required

profil_bp = Blueprint('profil', __name__)

@profil_bp.route('/api/profil', methods=['GET'])
def get_profil():
    """Mengambil data profil publik (tanpa auth)"""
    try:
        db = Database()
        
        # Ambil user pertama (atau bisa difilter berdasarkan parameter)
        query = """
            SELECT p.*, u.username 
            FROM profiles p 
            JOIN users u ON p.user_id = u.id 
            WHERE u.role = 'admin'
            LIMIT 1
        """
        result = db.execute_query(query, fetch=True)
        
        if not result:
            return jsonify({'success': True, 'data': None}), 200
        
        return jsonify({
            'success': True,
            'data': result[0]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@profil_bp.route('/api/profil', methods=['PUT'])
@token_required
def update_profil(current_user):
    """Update data profil (hanya untuk admin yang login)"""
    try:
        data = request.get_json()
        
        db = Database()
        
        # Field yang boleh diupdate
        allowed_fields = [
            'nama_lengkap', 'nama_panggilan', 'tempat_lahir', 
            'tanggal_lahir', 'email', 'telepon', 'universitas', 
            'fakultas', 'prodi', 'semester', 'alamat', 'foto_url'
        ]
        
        updates = []
        values = []
        
        for field in allowed_fields:
            if field in data:
                updates.append(f"{field} = %s")
                values.append(data[field])
        
        if not updates:
            return jsonify({'error': 'Tidak ada data yang diupdate'}), 400
        
        # Cek apakah profil sudah ada untuk user ini
        check_query = "SELECT id FROM profiles WHERE user_id = %s"
        existing = db.execute_query(check_query, (current_user,), fetch=True)
        
        if existing:
            # Update profil yang sudah ada
            query = f"UPDATE profiles SET {', '.join(updates)} WHERE user_id = %s"
            values.append(current_user)
            db.execute_query(query, tuple(values))
        else:
            # Insert profil baru
            values.append(current_user)
            fields = ', '.join([f for f in allowed_fields if f in data] + ['user_id'])
            placeholders = ', '.join(['%s'] * len(values))
            query = f"INSERT INTO profiles ({fields}) VALUES ({placeholders})"
            db.execute_query(query, tuple(values))
        
        return jsonify({
            'success': True,
            'message': 'Profil berhasil diupdate'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@profil_bp.route('/api/profil', methods=['POST'])
@token_required
def create_profil(current_user):
    """Create profil baru"""
    try:
        data = request.get_json()
        
        db = Database()
        
        # Cek apakah profil sudah ada
        check_query = "SELECT id FROM profiles WHERE user_id = %s"
        existing = db.execute_query(check_query, (current_user,), fetch=True)
        
        if existing:
            return jsonify({'error': 'Profil sudah ada'}), 400
        
        query = """
            INSERT INTO profiles (
                user_id, nama_lengkap, nama_panggilan, tempat_lahir, 
                tanggal_lahir, email, telepon, universitas, fakultas, 
                prodi, semester, alamat, foto_url
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            current_user,
            data.get('nama_lengkap'),
            data.get('nama_panggilan'),
            data.get('tempat_lahir'),
            data.get('tanggal_lahir'),
            data.get('email'),
            data.get('telepon'),
            data.get('universitas'),
            data.get('fakultas'),
            data.get('prodi'),
            data.get('semester'),
            data.get('alamat'),
            data.get('foto_url')
        )
        
        db.execute_query(query, values)
        
        return jsonify({
            'success': True,
            'message': 'Profil berhasil dibuat'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
