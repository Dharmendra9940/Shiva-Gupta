from flask import Flask, render_template, request, redirect, url_for, flash
import pymysql

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Needed for flash messages

# MySQL Database Configuration
DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = 'your_mysql_password'  # Replace with your MySQL password
DB_NAME = 'user_db'

def get_db_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    address = request.form['address']
    email = request.form['email']
    phone = request.form['phone']
    password = request.form['password'] # In production, ensure you hash passwords using Werkzeug/Bcrypt

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Check if user already exists
            cursor.execute("SELECT * FROM users1 WHERE username = %s", (username,))
            if cursor.fetchone():
                flash('Username already exists!', 'error')
                return redirect(url_for('home'))

            # Insert new user
            sql = "INSERT INTO users1 (username, address, email, phone, password) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (username, address, email, phone, password))
            connection.commit()
        connection.close()
        flash('Registration successful! Please log in.', 'success')
    except Exception as e:
        print(e)
        flash('An error occurred during registration.', 'error')

    return redirect(url_for('home'))

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = "SELECT * FROM users WHERE username = %s AND password = %s"
        cursor.execute(sql, (username, password))
        user = cursor.fetchone()
    connection.close()

    if user:
        return render_template('dashboard.html', username=user['username'])
    else:
        flash('Invalid username or password!', 'error')
        return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)