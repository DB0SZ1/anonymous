from flask import Flask, render_template, request, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request
import uuid

app = Flask(__name__)

# Temporary storage for demonstration
user_links = {}
user_data = {}  # Store user info: {name: {password_hash, short_id}}
messages = {}   # Store messages

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        name = request.form['name']
        password = request.form.get('password', None)

        if password:  # Registration
            if name in user_data:
                return "Username already exists", 400

            short_id = str(uuid.uuid4())[:6]
            password_hash = generate_password_hash(password)
            user_data[name] = {"password_hash": password_hash, "short_id": short_id}
            messages[short_id] = []

            return redirect(url_for('dashboard', short_id=short_id, name=name))
        else:  # Login (simplified for home)
            if name in user_data and check_password_hash(user_data[name]["password_hash"], request.form['password']):
                short_id = user_data[name]["short_id"]
                return redirect(url_for('dashboard', short_id=short_id, name=name))
            return "Invalid credentials", 400

    return render_template('home.html')

@app.route('/dashboard/<short_id>')
def dashboard(short_id):
    name = user_links.get(short_id, "User")
    user_link = f"{request.host_url}u/{short_id}"
    return render_template('dashboard.html', user_link=user_link, short_id=short_id, name=name)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        name = request.form['name']
        password = request.form['password']
        
        if name in user_data and check_password_hash(user_data[name]["password_hash"], password):
            short_id = user_data[name]["short_id"]
            return redirect(url_for('dashboard', short_id=short_id, name=name))
        return render_template('login.html', error="Invalid credentials")
    return render_template('Login.html')

@app.route('/u/<short_id>', methods=['GET', 'POST'])
def user_page(short_id):
    name = user_links.get(short_id, "User")  # Get the username from user_links
    success_message = None  # Default to no success message

    if request.method == 'POST':
        message = request.form['message']
        if short_id in messages:
            messages[short_id].append({"message": message, "read": False})  # Add read status
        success_message = "You have successfully sent your Anonymous Message."  # Set success message to display

    return render_template('message.html', short_id=short_id, name=name, success_message=success_message)

@app.route('/messages/<short_id>')
def view_messages(short_id):
    user_messages = messages.get(short_id, [])
    if not user_messages:
        return render_template('messages.html', messages=[], status="You have 0 messages.", short_id=short_id)

    new_messages = [msg for msg in user_messages if not msg["read"]]
    if new_messages:
        for msg in new_messages:
            msg["read"] = True  # Mark as read
        return render_template('messages.html', messages=user_messages, status="Here are your messages.", short_id=short_id)
    else:
        return render_template('messages.html', messages=user_messages, status="No new messages.", short_id=short_id)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)