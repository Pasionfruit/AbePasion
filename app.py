from flask import Flask, render_template, request, redirect, session, url_for, make_response, abort
from functools import wraps
# from dotenv import load_dotenv
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import os
import sqlite3

# load_dotenv()

app = Flask(__name__)

# Feel free to hard code this into another key if that makes it easier for grading :)
app.secret_key = b'ytYzufM4KHMkNBjlP6ad4cmBIDpjevt4LnoL6GXvch9Y'
#app.secret_key = os.getenv('FLASK_SECRET_KEY')
encryption_key = b'yK51caT95x7n776p'
#encryption_key = os.getenv('ENCRYPTION_KEY').encode()
cipher = AES.new(encryption_key, AES.MODE_ECB)

def encrypt_data(data):
    return cipher.encrypt(pad(data.encode(), AES.block_size))

def decrypt_data(data):
    return cipher.decrypt(data).decode().rstrip()

# Function to connect to the database
def get_db_connection():
    conn = sqlite3.connect('Baking_Contest.db')
    conn.row_factory = sqlite3.Row
    return conn

def initialize_db():
    conn = get_db_connection()
    cursor = conn.cursor() 

    users_table, results_table = 'users', 'results'

    drop_users = f"DROP TABLE IF EXISTS {users_table}"
    drop_results = f"DROP TABLE IF EXISTS {results_table}"

    cursor.execute(drop_users)
    cursor.execute(drop_results) 

    # Re-create the users table if it doesn't exist
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Age INTEGER NOT NULL,
        PhoneNumber TEXT NOT NULL,
        SecurityLevel INTEGER NOT NULL,
        Password TEXT NOT NULL
    );
    """)

    # Re-create the results table if it doesn't exist
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS results (
        EntryId INTEGER PRIMARY KEY AUTOINCREMENT,
        UserId INTEGER NOT NULL,
        BakingItem TEXT NOT NULL,
        ExcellentVotes INTEGER NOT NULL,
        OkVotes INTEGER NOT NULL,
        BadVotes INTEGER NOT NULL,
        FOREIGN KEY (UserId) REFERENCES users(id)
    );
    """)

    # Insert data into `users` only if the table is empty
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    if user_count == 0:
        cursor.executemany("""
        INSERT INTO users (Name, Age, PhoneNumber, SecurityLevel, Password)
        VALUES (?, ?, ?, ?, ?)""", [
            (encrypt_data('PDiana'), 34, encrypt_data('123-675-7645'), 1, encrypt_data('test123')),
            (encrypt_data('TJones'), 68, encrypt_data('895-345-6523'), 2, encrypt_data('test123')),
            (encrypt_data('AMath'), 29, encrypt_data('428-197-3967'), 3, encrypt_data('test123')),
            (encrypt_data('BSmith'), 37, encrypt_data('239-567-3498'), 2, encrypt_data('test123')),
            (encrypt_data('Abe'), 37, encrypt_data('123-456-7890'), 3, encrypt_data('test123'))
        ])

    # Insert data into `results` only if the table is empty
    cursor.execute("SELECT COUNT(*) FROM results")
    result_count = cursor.fetchone()[0]
    if result_count == 0:
        cursor.executemany("""
        INSERT INTO results (UserId, BakingItem, ExcellentVotes, OkVotes, BadVotes)
        VALUES (?, ?, ?, ?, ?)""", [
            (1, 'Whoot Whoot Brownies', 1, 2, 4),
            (2, 'Cho Chip Cookies', 4, 1, 2),
            (3, 'Cho Cake', 2, 4, 1),
            (1, 'Sugar Cookies', 1, 2, 1),
            (5, 'Chocolate Delights', 9, 2, 0)
        ])

    conn.commit()
    conn.close()

initialize_db()

def valid_login(encrypted_username, encrypted_password):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE Name = ? AND Password = ?", (encrypted_username, encrypted_password))
    user = cursor.fetchone()
    conn.close()
    return user is not None

def require_security_level(level):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if 'username' not in session:
                return redirect(url_for('login'))  # Redirect to login if not logged in
            
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT SecurityLevel FROM users WHERE Name = ?", (session['username'],))
            user = cursor.fetchone()
            conn.close()

            if not user or user['SecurityLevel'] < level:
                abort(404)  # Show a "Not Found" page if insufficient security level
            
            return f(*args, **kwargs)
        return wrapped
    return decorator

# Login page
@app.route('/login', methods=['GET', 'POST'])
def login():
    errors = None

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        encrypted_username = encrypt_data(username)
        encrypted_password = encrypt_data(password)
        print(f"Encrypted username (input): {encrypted_username}")
        print(f"Encrypted password (input): {encrypted_password}")

        if valid_login(encrypted_username, encrypted_password):
            session['username'] = encrypted_username  # Store the logged-in user in the session
            return redirect(url_for('home'))  # Redirect to the home page after login
        else:
            errors = ["Invalid username and/or password!"]
    return render_template('Login.html', errors=errors)

# Logout page
@app.route('/logout')
def logout():
    session.clear()  # Clear all session data
    return redirect(url_for('login'))  # Redirect to the login page

# Home page
@app.route('/')
def home():
    if 'username' not in session:
        return redirect(url_for('login'))  # Redirect to login if not logged in
    
    username = session['username']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT SecurityLevel FROM users WHERE Name = ?", (username,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return redirect(url_for('login'))
    
    security = user['SecurityLevel']

    return render_template('Home.html', username=decrypt_data(username), security=security)

# Show Contest Entry Page
@app.route('/Show_Entry_Result.html')
def get_entry_results():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    username = session['username']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE Name = ?", (username,))
    user = cursor.fetchone()

    if not user:
        return redirect(url_for('login'))

    user_id = user['id']

    cursor.execute("SELECT BakingItem, ExcellentVotes, OkVotes, BadVotes FROM results WHERE UserID = ?", (user_id,))
    results = cursor.fetchall()
    conn.close()

    return render_template('Show_Entry_Result.html', results=results)

# Add User Page
@app.route('/Add_Baking_Contest_User.html', methods=['GET', 'POST'])
@require_security_level(3)
def add_user():
    if request.method == 'POST':
        name = request.form['name']
        age = int(request.form['age']) if request.form['age'].isdigit() else None
        phone = request.form['phone']
        security = int(request.form['security']) if request.form['security'].isdigit() else None
        password = request.form['password'] 

        errors = []

        justSpace = True
        if name:
            for c in name:
                if c != " ":
                    justSpace = False
        if not name or justSpace:
            errors.append("You can not enter in an empty name.")

        justSpace = True
        if phone:
            for c in phone:
                if c != " ":
                    justSpace = False
        if not phone or justSpace:
            errors.append("You can not enter in an empty phone number.")
        
        if not age or int(age) != age or age < 0 or age > 121:
            errors.append("The Age must be a whole number greater than 0 and less than 121.")

        if not security or int(security) != security or security < 1 or security > 3:
            errors.append("The SecurityLevel must be a numeric between 1 and 3.")

        if not password:
            errors.append("You can not enter in an empty password.")

        if not errors:
            conn = get_db_connection()
            conn.execute('INSERT INTO users (Name, Age, PhoneNumber, SecurityLevel, Password) VALUES (?, ?, ?, ?, ?)', 
                        (encrypt_data(name), age, encrypt_data(phone), security, encrypt_data(password)))
            conn.commit()  # Commit the changes
            conn.close()  # Close the connection to ensure it's properly saved and released

            name, age, phone, security, password = None, None, None, None, None 

            return render_template('Results.html', errors=errors)
        
        else:
            return render_template('Results.html', errors=errors)
        
    return render_template('Add_Baking_Contest_User.html')

# Add Entry Page
@app.route('/Add_Baking_Contest_Entry.html', methods=['GET', 'POST'])
def add_entry():
    if request.method == 'POST':
        BakingItem = request.form['BakingItem']
        ExcellentVotes = int(request.form['ExcellentVotes']) if request.form['ExcellentVotes'].isdigit() else None
        OkVotes = int(request.form['OkVotes']) if request.form['OkVotes'].isdigit() else None
        BadVotes = int(request.form['BadVotes']) if request.form['BadVotes'].isdigit() else None

        errors = []

        justSpace = True
        if BakingItem:
            for c in BakingItem:
                if c != " ":
                    justSpace = False
        if not BakingItem or justSpace:
            errors.append("You can not enter in an empty Name for Baking Item.")

        if not ExcellentVotes or int(ExcellentVotes) != ExcellentVotes or ExcellentVotes <= 0:
            errors.append("The Number of Excellent Votes must be a whole number greater than 0.")

        if not OkVotes or int(OkVotes) != OkVotes or OkVotes <= 0:
            errors.append("The Number of Ok Votes must be a whole number greater than 0.")
        
        if not BadVotes or int(BadVotes) != BadVotes or BadVotes <= 0:
            errors.append("The the Number of Bad Votes must be a whole number greater than 0.")

        if not errors:
            if 'username' not in session:
                return redirect(url_for('login'))
            
            username = session['username']

            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE Name = ?", (username,))
            user = cursor.fetchone()

            if not user:
                return redirect(url_for('login'))

            user_id = user['id']

            conn.execute('INSERT INTO results (UserId, BakingItem, ExcellentVotes, OkVotes, BadVotes) VALUES (?, ?, ?, ?, ?)', 
                        (user_id, BakingItem, ExcellentVotes, OkVotes, BadVotes))
            conn.commit() 
            conn.close() 

            BakingItem, ExcellentVotes, OkVotes, BadVotes = None, None, None, None 

            return render_template('Results.html', errors=errors)
        
        else:
            return render_template('Results.html', errors=errors)
        
    return render_template('Add_Baking_Contest_Entry.html')

# Results Page
@app.route('/Results.html')
def printErrors():
    return render_template('Results.html')

def decrypt_user_data(encrypted_users):
    decrypted_users = []
    for user in encrypted_users:
        decrypted_user = {
            "Name": decrypt_data(user[0]),  # Decrypt Name
            "Age": user[1],                  # Age remains unchanged
            "PhoneNumber": decrypt_data(user[2]).rstrip('\x04'),  # Decrypt PhoneNumber
            "SecurityLevel": user[3],        # SecurityLevel remains unchanged
            "Password": decrypt_data(user[4])  # Decrypt Password
        }
        decrypted_users.append(decrypted_user)
    return decrypted_users

# List Baking Contest Users Page
@app.route('/List_Baking_Contest_Users.html')
@require_security_level(2)
def get_users():
    # Connect to the database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT Name, Age, PhoneNumber, SecurityLevel, Password FROM users")
    users = cursor.fetchall()
    decrypted_users = decrypt_user_data(users)
    conn.close()

    # Prevent page caching by setting response headers
    response = make_response(render_template('List_Baking_Contest_Users.html', users=decrypted_users))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response

# Baking Contest Results Page
@app.route('/Baking_Contest_Results.html')
@require_security_level(3)
def get_results():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT EntryId, UserId, BakingItem, ExcellentVotes, OkVotes, BadVotes FROM results")
    results = cursor.fetchall()
    conn.close()

    # Prevent page caching by setting response headers
    response = make_response(render_template('Baking_Contest_Results.html', results=[dict(row) for row in results]))
    response.headers['Cache-Control'] = 'no-store'
    
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=55557, debug=True)