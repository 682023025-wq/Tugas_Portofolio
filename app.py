from flask import Flask, jsonify, send_from_directory,request
from flask_cors import CORS
from config import Config
import os

# Import blueprints
from Backend.admin.login import login_bp
from Backend.admin.dashboard import dashboard_bp
from Backend.admin.akun import akun_bp
from Backend.admin.experience import experience_bp
from Backend.admin.projects import projects_bp
from Backend.admin.skills import skills_bp
from Backend.profil.profil import profil_bp

def create_app():
    # PERBAIKAN 1: template_folder harus menunjuk ke folder yang berisi .html
    # static_folder menunjuk ke root aset statis (CSS, JS, Gambar)
    app = Flask(__name__, 
                static_folder='Frontend',      # Root untuk semua aset frontend
                template_folder='.')           # '.' berarti root project (tempat index.html berada)
    
    # Konfigurasi
    app.config.from_object(Config)
    
    # Enable CORS untuk development
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(login_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api')
    app.register_blueprint(akun_bp, url_prefix='/api')
    app.register_blueprint(experience_bp, url_prefix='/api')
    app.register_blueprint(projects_bp, url_prefix='/api')
    app.register_blueprint(skills_bp, url_prefix='/api')
    app.register_blueprint(profil_bp, url_prefix='/api')
    
    # Route untuk serving frontend files
    @app.route('/')
    def index():
        # PERBAIKAN 2: Karena index.html ada di root, gunakan app.root_path
        return send_from_directory(app.root_path, 'index.html')
    
    @app.route('/admin/<path:filename>')
    def admin_pages(filename):
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'admin'), filename)
    
    @app.route('/profil/<path:filename>')
    def profil_pages(filename):
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'profil'), filename)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        # Jika request HTML (bukan API), kembalikan index.html untuk SPA routing
        if request.accept_mimetypes.best == 'text/html':
            return send_from_directory(app.root_path, 'index.html')
        return jsonify({'error': 'Route tidak ditemukan'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Terjadi kesalahan pada server'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=Config.DEBUG, host='0.0.0.0', port=5000)