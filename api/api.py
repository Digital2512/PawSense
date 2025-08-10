from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from behaviour_prediction.model import predict_day
from client import retrieve_client_data

from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from client import retrieve_client_data

import os
current_dir = os.path.dirname(os.path.abspath(__file__))
sibling_dir = os.path.join(current_dir, '..', 'machine-learning')

# Load model + encoders
model = joblib.load(sibling_dir+'\model.joblib')
label_encoders = joblib.load(sibling_dir+'\label_encoders.joblib')
target_le = joblib.load(sibling_dir+'\\target_le.joblib')

categorical_features = ['size', 'tail_position', 'tail_stiffness', 'wag_direction']

app = Flask(__name__)
CORS(app)

# Predicts the next day's activity
@app.route('/predict_emotion', methods=['GET'])
def predict_emotion():
    try:
        data = retrieve_client_data()
        new_data = pd.DataFrame([data])
        print("Received data for prediction:", new_data)

        activity = new_data['activity'].values[0]
        new_data.drop(columns=['context', 'activity', 'steps', 'latitude', 'longitude'], inplace=True, errors='ignore')

        # Encode categorical features
        for col in categorical_features:
            new_data[col] = label_encoders[col].transform(new_data[col])
        print("Encoded data for prediction:", new_data)

        # Predict
        predicted_label_num = model.predict(new_data)[0]
        predicted_emotion = target_le.inverse_transform([predicted_label_num])[0]
        translation = predict_bark_translation(predicted_emotion, activity)
        print(f"Predicted emotion: {predicted_emotion}, Translation: {translation}")

        print(f"Predicted dog emotion: {predicted_emotion}")
        return jsonify({"predicted_emotion": predicted_emotion,
                        "bark_translation": translation})

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
def predict_bark_translation(emotion, activity):
    dog_sentences = {
    ("Neutral", "Play"): "I'm just playing like usual.",
    ("Excited", "Play"): "Yay! Playing is the best!",
    ("Sad", "Play"): "I don't feel like playing right now.",
    ("Angry", "Play"): "Stop bothering me while I play!",
    ("Hungry", "Play"): "I want to play, but my tummy is rumbling.",
    ("Scared", "Play"): "I don't want to play anymore, I'm scared.",
    ("Alert", "Play"): "I'm playing but staying alert around here.",
    
    ("Neutral", "Potty"): "Time to do my business.",
    ("Excited", "Potty"): "Potty time, yay!",
    ("Sad", "Potty"): "I don't feel good, maybe I need to potty.",
    ("Angry", "Potty"): "Why are you rushing me to potty?",
    ("Hungry", "Potty"): "I want food but I gotta potty first.",
    ("Scared", "Potty"): "Potty time but something's making me nervous.",
    ("Alert", "Potty"): "Potty but I'm watching out for anything strange.",
    
    ("Neutral", "Medication"): "Taking my medicine like a good pup.",
    ("Excited", "Medication"): "Medicine time! Hopefully it tastes good!",
    ("Sad", "Medication"): "I don't like taking medicine.",
    ("Angry", "Medication"): "No! I don't want medicine!",
    ("Hungry", "Medication"): "I’m hungry but have to take this first.",
    ("Scared", "Medication"): "Medicine time scares me a bit.",
    ("Alert", "Medication"): "I'm alert while getting my medicine.",
    
    ("Neutral", "Sleep"): "Just going to take a nap.",
    ("Excited", "Sleep"): "I’m excited for bedtime!",
    ("Sad", "Sleep"): "I feel lonely, time to sleep.",
    ("Angry", "Sleep"): "I don't want to sleep now!",
    ("Hungry", "Sleep"): "I’m hungry but sleepy too.",
    ("Scared", "Sleep"): "Sleeping but I’m still scared.",
    ("Alert", "Sleep"): "I’m resting but staying alert.",
    
    ("Neutral", "Feeding"): "Time to eat my food.",
    ("Excited", "Feeding"): "Yummy! Food time!",
    ("Sad", "Feeding"): "I don’t feel like eating.",
    ("Angry", "Feeding"): "Why is my food late?",
    ("Hungry", "Feeding"): "I’m starving, finally food!",
    ("Scared", "Feeding"): "Eating but a bit nervous.",
    ("Alert", "Feeding"): "Eating but I’m watching around.",
    
    ("Neutral", "Exercise"): "Let’s get some exercise.",
    ("Excited", "Exercise"): "I love exercising!",
    ("Sad", "Exercise"): "I don’t feel like moving today.",
    ("Angry", "Exercise"): "Exercise again? Not happy about this!",
    ("Hungry", "Exercise"): "I want food but I have to exercise.",
    ("Scared", "Exercise"): "Exercise but I’m scared of the noises.",
    ("Alert", "Exercise"): "Exercising and staying alert.",
    
    ("Neutral", "Relax"): "Time to relax.",
    ("Excited", "Relax"): "Relaxing feels great!",
    ("Sad", "Relax"): "I’m feeling down, just relaxing.",
    ("Angry", "Relax"): "I don’t want to relax, I’m annoyed!",
    ("Hungry", "Relax"): "I want food, not relaxing.",
    ("Scared", "Relax"): "Relaxing but still a bit scared.",
    ("Alert", "Relax"): "Relaxing but keeping an eye out.",
}
    return dog_sentences.get((emotion, activity), "I don't know what to say.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)