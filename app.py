from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from uuid import uuid4

from BackEnd.models import db, User, Role
from BackEnd.config import LocalDevelopmentConfig

def create_app():
    app = Flask(__name__, template_folder='FrontEnd', static_folder='FrontEnd/static')
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)

    # Setup Flask-Security-Too
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    Security(app, user_datastore)

    # Register blueprints
    from BackEnd.routes import bp  # Use 'bp' if that's your Blueprint name
    app.register_blueprint(bp)

    return app

def initialize_roles_and_admin(app):
    with app.app_context():
        db.create_all()
        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        # Create system roles
        required_roles = {
            'Admin': 'System Administrator',
            'Higher Officials': 'Senior Management Team',
            'Finance Team': 'Financial Department Members',
            'Planning Team': 'Strategic Planning Department'
        }
        for role_name, description in required_roles.items():
            if not user_datastore.find_role(role_name):
                user_datastore.create_role(name=role_name, description=description)
        db.session.commit()
        # Create single admin user
        if not user_datastore.find_user(email='admin@goodwillai.com'):
            admin_user = user_datastore.create_user(
                username='sysadmin',
                email='admin@goodwillai.com',
                password=hash_password('SecureAdminPass123!'),
                active=True,
                fs_uniquifier=uuid4().hex
            )
            admin_role = user_datastore.find_role('Admin')
            user_datastore.add_role_to_user(admin_user, admin_role)
            db.session.commit()

app = create_app()
initialize_roles_and_admin(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
