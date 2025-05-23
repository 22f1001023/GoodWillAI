from flask import Blueprint, jsonify, request, render_template
from flask_security import auth_required, current_user, roles_required
from flask_security.utils import login_user, logout_user, hash_password, verify_password
from BackEnd.models import *
from uuid import uuid4
from BackEnd import agent
bp = Blueprint('auth', __name__)


@bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    role_name = data.get('role')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    # Validation
    if not all([username, email, role_name, password, confirm_password]):
        return jsonify({"error": "All fields are required"}), 400
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 400

    # Role validation
    allowed_roles = {'Higher Officials', 'Finance Team', 'Planning Team'}
    if role_name not in allowed_roles:
        return jsonify({"error": "Invalid role selection"}), 400

    # Create user
    new_user = User(
        username=username,
        email=email,
        password=hash_password(password),
        active=False,  # Requires admin approval
        fs_uniquifier=uuid4().hex
    )

    # Assign role
    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({"error": "Invalid role configuration"}), 500
    new_user.roles.append(role)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Registration successful! Waiting for admin approval."
    }), 201

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not verify_password(password, user.password):
        return jsonify({"error": "Invalid credentials"}), 401
    if not user.active:
        return jsonify({"error": "Account pending admin approval"}), 403

    login_user(user)
    role = user.roles[0].name if user.roles else None

    # If you want to return token for API clients:
    token = user.get_auth_token()

    # Determine redirect URL based on role
    if role == 'Admin':
        redirect_url = '/admin/dashboard'
    elif role == 'Higher Officials':
        redirect_url = '/higher-officials/dashboard'
    elif role == 'Finance Team':
        redirect_url = '/finance/dashboard'
    elif role == 'Planning Team':
        redirect_url = '/planning/dashboard'
    else:
        redirect_url = '/dashboard'

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "role": role
        },
        "auth_token": token,
        "redirect_url": redirect_url
    }), 200

@bp.route('/api/logout', methods=['POST'])
@auth_required('session', 'token')
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def frontend(path):
    return render_template('index.html')

#----Admin----

@bp.route('/api/admin/users', methods=['GET'])
@auth_required('session', 'token')
@roles_required('Admin')
def get_pending_users():
    pending_users = User.query.filter_by(active=False).all()
    users_data = [{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.roles[0].name if user.roles else 'No Role'
    } for user in pending_users]
    return jsonify(users_data), 200

@bp.route('/api/admin/approve/<int:user_id>', methods=['POST'])
@auth_required('session', 'token')
@roles_required('Admin')
def approve_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    action = data.get('action')
    if action not in ['approve', 'reject']:
        return jsonify({"error": "Invalid action"}), 400
    if action == 'approve':
        user.active = True
        db.session.commit()
        return jsonify({"message": f"User {user.username} approved successfully"}), 200
    else:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": f"User {user.username} rejected and removed"}), 200

@bp.route('/api/admin/stats', methods=['GET'])
@auth_required('session', 'token')
@roles_required('Admin')
def get_statistics():
    total_active = User.query.filter_by(active=True).count()
    pending_approval = User.query.filter_by(active=False).count()
    role_stats = {}
    roles = Role.query.all()
    for role in roles:
        count = User.query.join(User.roles).filter(
            User.active == True,
            Role.id == role.id
        ).count()
        role_stats[role.name] = count
    return jsonify({
        "total_active_users": total_active,
        "users_waiting_approval": pending_approval,
        "role_statistics": role_stats
    }), 200


# --- API endpoint for Higher Officials to ask questions ---
@bp.route('/api/agent/query', methods=['POST'])
@auth_required('session', 'token')
@roles_required('Higher Officials')
def agent_query():
    data = request.get_json()
    user_query = data.get('query')
    if not user_query:
        return jsonify({"error": "No query provided"}), 400
    result = agent.query_agent(user_query)
    return jsonify({"result": result})
