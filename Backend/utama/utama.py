from flask import Blueprint, request, jsonify
from model import Database
from Backend.admin.login import token_required
import logging

logger = logging.getLogger(__name__)
utama_bp = Blueprint('utama', __name__)


@utama_bp.route('/utama', methods=['GET'])
def get_profil():
    """Mengambil SEMUA data utama publik (tanpa auth)"""
    try:
        db = Database()
        
        # 1. Ambil data utama utama + username sekaligus
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
        
        # 2. Ambil skills, experiences, projects secara paralel
        # Menggunakan list comprehension untuk efisiensi
        skills_result = db.execute_query(
            "SELECT id, nama_skill, icon_class FROM skills WHERE user_id = %s", 
            (user_id,), fetch=True
        ) or []
        
        exp_result = db.execute_query(
            """SELECT id, posisi, perusahaan, durasi, deskripsi, created_at 
               FROM experiences WHERE user_id = %s ORDER BY created_at DESC""", 
            (user_id,), fetch=True
        ) or []
        
        proj_result = db.execute_query(
            """SELECT id, judul, deskripsi, gambar_url, link_project, created_at 
               FROM projects WHERE user_id = %s ORDER BY created_at DESC""", 
            (user_id,), fetch=True
        ) or []
        
        # Assign ke response (biarkan DB handle formatting tanggal jika perlu)
        profile_data['skills'] = [dict(s) for s in skills_result]
        profile_data['experiences'] = [dict(e) for e in exp_result]
        profile_data['projects'] = [dict(p) for p in proj_result]
        
        # Hapus field sensitif/internal dari response publik
        profile_data.pop('user_id', None)
        profile_data.pop('password_hash', None)  # Safety net jika join gagal filter
        
        return jsonify({'success': True, 'data': profile_data}), 200
        
    except Exception as e:
        logger.error(f"Error in get_profil: {str(e)}")
        return jsonify({'error': 'Gagal memuat data profil'}), 500


@utama_bp.route('/utama', methods=['PUT'])
@token_required
def update_profil(current_user):
    """Update data utama (hanya untuk admin yang login)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body harus JSON'}), 400
        
        db = Database()
        
        # Whitelist field yang boleh diupdate
        allowed_fields = [
            'nama_lengkap', 'nama_panggilan', 'tempat_lahir', 
            'tanggal_lahir', 'email', 'telepon', 'universitas', 
            'fakultas', 'prodi', 'semester', 'alamat', 'foto_url'
        ]
        
        updates = []
        values = []
        
        for field in allowed_fields:
            if field in data and data[field] is not None:
                # Sanitasi string sederhana (strip whitespace)
                value = data[field].strip() if isinstance(data[field], str) else data[field]
                updates.append(f"{field} = %s")
                values.append(value)
        
        if not updates:
            return jsonify({'error': 'Tidak ada field valid yang diupdate'}), 400
        
        # Cek eksistensi utama
        check_query = "SELECT id FROM profiles WHERE user_id = %s"
        existing = db.execute_query(check_query, (current_user,), fetch=True)
        
        if existing:
            query = f"UPDATE profiles SET {', '.join(updates)} WHERE user_id = %s"
            values.append(current_user)
        else:
            # Auto-create jika belum ada (handle mandatory relation)
            fields_str = ', '.join([f for f in allowed_fields if f in data and data[f] is not None] + ['user_id'])
            placeholders = ', '.join(['%s'] * (len(values) + 1))
            query = f"INSERT INTO profiles ({fields_str}) VALUES ({placeholders})"
            values.append(current_user)
        
        db.execute_query(query, tuple(values))
        
        return jsonify({'success': True, 'message': 'Profil berhasil diupdate'}), 200
        
    except Exception as e:
        logger.error(f"Error in update_profil: {str(e)}")
        return jsonify({'error': 'Gagal mengupdate profil'}), 500


@utama_bp.route('/utama', methods=['POST'])
@token_required
def create_profil(current_user):
    """Create utama baru"""
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
            if field not in data or not str(data[field]).strip():
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
            str(data.get('nama_lengkap', '')).strip(),
            str(data.get('nama_panggilan', '')).strip(),
            str(data.get('tempat_lahir', '')).strip(),
            data.get('tanggal_lahir'),  # Biarkan NULL jika kosong
            str(data.get('email', '')).strip(),
            str(data.get('telepon', '')).strip(),
            str(data.get('universitas', '')).strip(),
            str(data.get('fakultas', '')).strip(),
            str(data.get('prodi', '')).strip(),
            str(data.get('semester', '')).strip(),
            str(data.get('alamat', '')).strip(),
            str(data.get('foto_url', '')).strip()
        )
        
        db.execute_query(query, values)
        
        return jsonify({'success': True, 'message': 'Profil berhasil dibuat'}), 201
        
    except Exception as e:
        logger.error(f"Error in create_profil: {str(e)}")
        return jsonify({'error': 'Gagal membuat profil'}), 500