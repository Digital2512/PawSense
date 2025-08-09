from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from client import retrieve_client_data

app = Flask(__name__)

# Load model + encoders
model = joblib.load('machine-learning\model.joblib')
label_encoders = joblib.load('machine-learning\label_encoders.joblib')
target_le = joblib.load('machine-learning\\target_le.joblib')

categorical_features = ['size', 'tail_position', 'tail_stiffness', 'wag_direction']

@app.route('/predict_emotion', methods=['GET'])
def predict_emotion():
    try:
        data = retrieve_client_data()
        new_data = pd.DataFrame([data])
        print("Received data for prediction:", new_data)

        # Encode categorical features
        for col in categorical_features:
            new_data[col] = label_encoders[col].transform(new_data[col])
        print("Encoded data for prediction:", new_data)

        new_data.drop(columns=['context'], inplace=True, errors='ignore')

        # Predict
        predicted_label_num = model.predict(new_data)[0]
        predicted_emotion = target_le.inverse_transform([predicted_label_num])[0]

        print(f"Predicted dog emotion: {predicted_emotion}")
        return jsonify({"predicted_emotion": predicted_emotion})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
