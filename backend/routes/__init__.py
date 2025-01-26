from flask import Flask
from routes.encode_route import encode_bp
from routes.dataset_routes import clear_bp, upload_bp
from routes.decode_route import decode_bp

def register_routes(app: Flask):
    app.register_blueprint(encode_bp)
    app.register_blueprint(decode_bp)
    app.register_blueprint(clear_bp)
    app.register_blueprint(upload_bp)