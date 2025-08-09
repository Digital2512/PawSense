from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from behaviour_prediction.model import predict_day
from client import retrieve_client_data

app = Flask(__name__)
CORS(app)

# Predicts the next day's activity
@app.route('/predict', methods=["GET"])
def predict():
    listOfPredictions = predict_day()
    return jsonify({
        'predictionList': listOfPredictions
    })

# Returns data fromt he client as a JSON back to caller
@app.route("/data", methods=["GET"])
def get_data():
    client_data = retrieve_client_data()
    return jsonify(client_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)