from flask import Flask, jsonify, send_from_directory
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
    app = Flask(__name__, 
                static_folder='Frontend',
                template_folder='Frontend')
    
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
        return send_from_directory('Frontend', 'index.html')
    
    @app.route('/admin/<path:filename>')
    def admin_pages(filename):
        return send_from_directory('Frontend/admin', filename)
    
    @app.route('/profil/<path:filename>')
    def profil_pages(filename):
        return send_from_directory('Frontend/profil', filename)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Route tidak ditemukan'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Terjadi kesalahan pada server'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=Config.DEBUG, host='0.0.0.0', port=5000)
