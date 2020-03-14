from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app, resources={r".*": {"origins": '*'}})  # boooh. fixme.


class Employees(Resource):
    def get(self):
        return {'employees': [{'id': 1, 'name': 'Balram'}, {'id': 2, 'name': 'Tom'}]}

    def post(self):
        new_path = './new_days.txt'
        new_days = open(new_path, 'w')
        new_days.write('hello there, you have just written a file via python')
        new_days.close()


api.add_resource(Employees, '/')  # Route_1

if __name__ == '__main__':
    app.run(port=5002)
