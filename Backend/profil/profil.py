from flask import Blueprint, request, jsonify
from model import Database
from Backend.admin.login import token_required
from datetime import datetime

profil_bp = Blueprint('profil', __name__)


@profil_bp.route('/profil', methods=['GET'])
def get_profil():
    """Mengambil SEMUA data profil publik (tanpa auth)"""
    try:
        db = Database()
        
        # 1. Ambil data profil utama
        profile_query = """
            SELECT p.*, u.username 
            FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE u.role = 'admin'
            LIMIT 1
        """
        profile_result = db.execute_query(profile_query, fetch=True)
        
        if not profile_result:
            return jsonify({'success': True, 'data': None}), 200
        
        row = profile_result[0]
        user_id = row['user_id']
        profile_data = dict(row)
        
        # 2. Ambil skills
        skills_query = """
            SELECT id, nama_skill, icon_class 
            FROM skills 
            WHERE user_id = %s
        """
        skills_result = db.execute_query(skills_query, (user_id,), fetch=True)
        profile_data['skills'] = [dict(s) for s in skills_result] if skills_result else []
        
        # 3. Ambil experiences
        exp_query = """
            SELECT id, posisi, perusahaan, durasi, deskripsi, 
                   DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
            FROM experiences 
            WHERE user_id = %s
            ORDER BY created_at DESC
        """
        exp_result = db.execute_query(exp_query, (user_id,), fetch=True)
        profile_data['experiences'] = [dict(e) for e in exp_result] if exp_result else []
        
        # 4. Ambil projects
        proj_query = """
            SELECT id, judul, deskripsi, gambar_url, link_project,
                   DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
            FROM projects 
            WHERE user_id = %s
            ORDER BY created_at DESC
        """
        proj_result = db.execute_query(proj_query, (user_id,), fetch=True)
        profile_data['projects'] = [dict(p) for p in proj_result] if proj_result else []
        
        # Hapus field user_id dari response jika tidak diperlukan
        if 'user_id' in profile_data:
            del profile_data['user_id']
        
        return jsonify({
            'success': True,
            'data': profile_data
        }), 200
        
    except Exception as e:
        import logging
        logging.error(f"Error in get_profil: {str(e)}")
        return jsonify({'error': str(e)}), 500


@profil_bp.route('/profil', methods=['PUT'])
@token_required
def update_profil(current_user):
    """Update data profil (hanya untuk admin yang login)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body harus JSON'}), 400
        
        db = Database()
        
        # Field yang boleh diupdate + validasi tipe
        allowed_fields = {
            'nama_lengkap': str, 'nama_panggilan': str, 
            'tempat_lahir': str, 'tanggal_lahir': str,  # Format YYYY-MM-DD
            'email': str, 'telepon': str, 'universitas': str, 
            'fakultas': str, 'prodi': str, 'semester': str, 
            'alamat': str, 'foto_url': str
        }
        
        updates = []
        values = []
        
        for field, expected_type in allowed_fields.items():
            if field in data:
                value = data[field]
                # Validasi tipe sederhana
                if value is not None and not isinstance(value, expected_type):
                    return jsonify({'error': f'Tipe data {field} tidak valid'}), 400
                updates.append(f"{field} = %s")
                values.append(value)
        
        if not updates:
            return jsonify({'error': 'Tidak ada field valid yang diupdate'}), 400
        
        # Cek eksistensi profil
        check_query = "SELECT id FROM profiles WHERE user_id = %s"
        existing = db.execute_query(check_query, (current_user,), fetch=True)
        
        if existing:
            query = f"UPDATE profiles SET {', '.join(updates)} WHERE user_id = %s"
            values.append(current_user)
        else:
            # Auto-create jika belum ada (handle mandatory relation)
            fields = ', '.join([f for f in allowed_fields if f in data] + ['user_id'])
            placeholders = ', '.join(['%s'] * (len(values) + 1))
            query = f"INSERT INTO profiles ({fields}) VALUES ({placeholders})"
            values.append(current_user)
        
        db.execute_query(query, tuple(values))
        
        return jsonify({
            'success': True,
            'message': 'Profil berhasil diupdate'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@profil_bp.route('/profil', methods=['POST'])
@token_required
def create_profil(current_user):
    """Create profil baru"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body harus JSON'}), 400
        
        db = Database()
        
        # Wajib cek dulu apakah profil sudah ada (mandatory 1:1)
        check_query = "SELECT id FROM profiles WHERE user_id = %s"
        existing = db.execute_query(check_query, (current_user,), fetch=True)
        
        if existing:
            return jsonify({'error': 'Profil sudah ada, gunakan PUT untuk update'}), 409
        
        # Validasi field wajib
        required_fields = ['nama_lengkap', 'email']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Field {field} wajib diisi'}), 400
        
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