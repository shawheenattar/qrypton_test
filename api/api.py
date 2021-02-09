import time
from flask import Flask
from flask import make_response
from flask import request
from face.recognize_faces_image import ImageRecognizer

app = Flask(__name__)

@app.errorhandler(404)
def not_found(error):
    return make_response({'error': 'Not found'}, 404)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol', 
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web', 
        'done': False
    }
]

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return {'tasks': tasks}

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = [task for task in tasks if task['id'] == task_id]
    if len(task) == 0:
        abort(404)
    return {'task': task[0]}

@app.route('/tasks/', methods=['POST'])
def create_task():
    if not request.json or not 'title' in request.json:
        abort(400)
    task = {
        'id': tasks[-1]['id'] + 1,
        'title': request.json['title'],
        'description': request.jason.get('description', ""),
        'done': False
    }
    tasks.append(task)
    return {'task': task}, 201
    
@app.route('/face', methods=['PUT'])
def get_confirmation():
    if not request.json or not 'uri' in request.json:
        abort(400)
    data_uri = request.json['uri']
    i = ImageRecognizer
 
    recognized_faces = i.recognize_face(data_uri)
    # if (len(recognized_faces) > 0):
    #     for face in recognized_faces:
    #         print(face)
    return {'users': recognized_faces}