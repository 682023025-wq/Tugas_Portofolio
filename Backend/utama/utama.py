import resend
from flask import Blueprint, request, jsonify
from model import Database
from config import Config
import logging

logger = logging.getLogger(__name__)
utama_bp = Blueprint('utama', __name__)

# Konfigurasi Resend API Key dari .env/config
resend.api_key = Config.RESEND_API_KEY 

@utama_bp.route('/main-profile', methods=['GET'])
def get_public_data():
    """Mengambil SEMUA data publik (Profil, Skills, Exp, Projects)"""
    try:
        db = Database()
        
        # 1. Ambil Data Profil Admin
        profile_query = """
            SELECT p.*, u.username 
            FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE u.role = 'admin' LIMIT 1
        """
        profile_result = db.execute_query(profile_query, fetch=True)
        
        if not profile_result:
            return jsonify({'success': True, 'data': None}), 200
        
        row = profile_result[0]
        user_id = row['user_id']
        profile_data = dict(row)
        
        # 2. Ambil Data Pendukung (Parallel Query)
        skills = db.execute_query(
            "SELECT id, nama_skill, icon_class FROM skills WHERE user_id = %s", 
            (user_id,), fetch=True
        ) or []
        
        experiences = db.execute_query(
            """SELECT id, posisi, perusahaan, durasi, deskripsi 
               FROM experiences WHERE user_id = %s ORDER BY created_at DESC""", 
            (user_id,), fetch=True
        ) or []
        
        projects = db.execute_query(
            """SELECT id, judul, deskripsi, gambar_url, link_project 
               FROM projects WHERE user_id = %s ORDER BY created_at DESC""", 
            (user_id,), fetch=True
        ) or []
        
        # Assign ke response
        profile_data['skills'] = [dict(s) for s in skills]
        profile_data['experiences'] = [dict(e) for e in experiences]
        profile_data['projects'] = [dict(p) for p in projects]
        
        # Hapus data sensitif
        profile_data.pop('user_id', None)
        
        return jsonify({'success': True, 'data': profile_data}), 200
        
    except Exception as e:
        logger.error(f"Error Get Public Data: {str(e)}")
        return jsonify({'error': 'Gagal memuat data'}), 500


@utama_bp.route('/contact', methods=['POST'])
def send_contact_email():
    """Menerima pesan dari form kontak dan kirim ke email admin"""
    try:
        data = request.get_json()
        name = str(data.get('name', '')).strip()
        email = str(data.get('email', '')).strip()
        message = str(data.get('message', '')).strip()
        
        if not all([name, email, message]):
            return jsonify({'error': 'Semua field wajib diisi'}), 400
            
        # Validasi email sederhana
        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Format email tidak valid'}), 400
        
        # Ambil email tujuan admin dari DB
        db = Database()
        result = db.execute_query(
            "SELECT email FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.role = 'admin' LIMIT 1",
            fetch=True
        )
        
        if not result:
            return jsonify({'error': 'Email penerima tidak ditemukan'}), 500
            
        to_email = result[0]['email']
        
        # Kirim via Resend
        params = {
            "from": "Portfolio Contact <onboarding@resend.dev>",
            "to": [to_email],
            "subject": f"Pesan Baru dari Portfolio: {name}",
            "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2 style="color: #2563eb;">Pesan Baru</h2>
                    <p><strong>Nama:</strong> {escape_html(name)}</p>
                    <p><strong>Email:</strong> {escape_html(email)}</p>
                    <hr>
                    <p><strong>Pesan:</strong></p>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; white-space: pre-wrap;">
                        {escape_html(message)}
                    </div>
                </div>
            """,
            "reply_to": email
        }
        
        resend.Emails.send(params)
        return jsonify({'success': True, 'message': 'Pesan berhasil dikirim!'}), 200
        
    except Exception as e:
        logger.error(f"Error Send Email: {str(e)}")
        return jsonify({'error': 'Gagal mengirim pesan'}), 500


def escape_html(text):
    if not text: return ''
    return (text.replace('&', '&amp;').replace('<', '&lt;')
            .replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#x27;'))