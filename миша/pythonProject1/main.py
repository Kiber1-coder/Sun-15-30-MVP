from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__,
            template_folder='templates',
            static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game1')
def game1():
    return render_template('game1.html')

@app.route('/game2')
def game2():
    return render_template('game2.html')

@app.route('/game3')
def game3():
    return render_template('game3.html')

# Явный маршрут для статических файлов (на всякий случай)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)