from flask import Flask, render_template, request, jsonify, session
from functools import wraps
import json
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# Load teachers
def load_teachers():
    with open('src/teachers.json', 'r') as f:
        return json.load(f)

teachers = load_teachers()
teacher_dict = {t['username']: t['password'] for t in teachers}

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username in teacher_dict and teacher_dict[username] == password:
        session['username'] = username
        return jsonify({'success': True})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'success': True})

@app.route('/me', methods=['GET'])
def me():
    if 'username' in session:
        return jsonify({'username': session['username']})
    return jsonify({'username': None})

@app.route('/signup', methods=['POST'])
@require_auth
def signup():
    data = request.json
    return jsonify({'success': True, 'message': 'Signup successful'})

@app.route('/unregister', methods=['POST'])
@require_auth
def unregister():
    data = request.json
    return jsonify({'success': True, 'message': 'Unregister successful'})

if __name__ == '__main__':
    app.run(debug=True)
