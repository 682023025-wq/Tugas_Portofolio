import mysql.connector
from mysql.connector import pooling
from config import Config

class Database:
    _instance = None
    _pool = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._pool is None:
            self._pool = pooling.MySQLConnectionPool(
                pool_name="portfolio_pool",
                pool_size=5,
                pool_reset_session=True,
                **Config.MYSQL_CONFIG
            )
    
    def get_connection(self):
        """Mengambil koneksi dari pool"""
        return self._pool.get_connection()
    
    def execute_query(self, query, params=None, fetch=False):
        """Menjalankan query dengan opsi fetch untuk SELECT"""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(query, params or ())
            if fetch:
                result = cursor.fetchall()
            else:
                conn.commit()
                result = cursor.lastrowid if cursor.lastrowid else True
            return result
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()
