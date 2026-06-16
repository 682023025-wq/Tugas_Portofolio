from flask import Blueprint, request, jsonify
from model import Database
from Backend.admin.login import token_required

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard/stats', methods=['GET'])
@token_required
def get_dashboard_stats(current_user):
    """Mengambil statistik dashboard untuk admin"""
    try:
        db = Database()
        
        # Hitung jumlah data di setiap tabel
        stats = {}
        
        # Jumlah experiences
        query = "SELECT COUNT(*) as count FROM experiences WHERE user_id = %s"
        result = db.execute_query(query, (current_user,), fetch=True)
        stats['experiences_count'] = result[0]['count'] if result else 0
        
        # Jumlah projects
        query = "SELECT COUNT(*) as count FROM projects WHERE user_id = %s"
        result = db.execute_query(query, (current_user,), fetch=True)
        stats['projects_count'] = result[0]['count'] if result else 0
        
        # Jumlah skills
        query = "SELECT COUNT(*) as count FROM skills WHERE user_id = %s"
        result = db.execute_query(query, (current_user,), fetch=True)
        stats['skills_count'] = result[0]['count'] if result else 0
        
        # Ambil data profile terbaru
        query = """
            SELECT p.nama_lengkap, p.foto_url, u.username 
            FROM profiles p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.user_id = %s 
            LIMIT 1
        """
        result = db.execute_query(query, (current_user,), fetch=True)
        if result:
            stats['profile'] = {
                'nama_lengkap': result[0]['nama_lengkap'],
                'foto_url': result[0]['foto_url'],
                'username': result[0]['username']
            }
        else:
            stats['profile'] = None
        
        return jsonify({
            'success': True,
            'data': stats
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/dashboard/recent-activity', methods=['GET'])
@token_required
def get_recent_activity(current_user):
    """Mengambil aktivitas terbaru"""
    try:
        db = Database()
        
        activities = []
        
        # Ambil 3 experiences terbaru
        query = """
            SELECT id, posisi, perusahaan, created_at, 'experience' as type 
            FROM experiences 
            WHERE user_id = %s 
            ORDER BY created_at DESC 
            LIMIT 3
        """
        result = db.execute_query(query, (current_user,), fetch=True)
        if result:
            activities.extend(result)
        
        # Ambil 3 projects terbaru
        query = """
            SELECT id, judul, NULL as perusahaan, created_at, 'project' as type 
            FROM projects 
            WHERE user_id = %s 
            ORDER BY created_at DESC 
            LIMIT 3
        """
        result = db.execute_query(query, (current_user,), fetch=True)
        if result:
            activities.extend(result)
        
        # Sort berdasarkan created_at
        activities.sort(key=lambda x: x['created_at'], reverse=True)
        
        return jsonify({
            'success': True,
            'data': activities[:5]  # Ambil 5 aktivitas terbaru
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
