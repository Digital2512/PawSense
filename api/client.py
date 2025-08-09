# from flask import Flask, request, jsonify, render_template_string
import random
import numpy as np
from datetime import datetime, timezone

# --- Available values for manual selection ---
possible_values = {
        "Neutral": {
            "size": ["Small", "Medium", "Large"],
            "age_group": ["Puppy", "Adult", "Senior"],
            "heart_rate": ["Small", "Medium", "Large"],
            "tail_wag_speed": (0.1, 0.5),
            "tail_wag_amplitude": (30, 60),
            "tail_position": ["Neutral"],
            "tail_stiffness": ["Loose"],
            "wag_direction": ["Neutral", "Right_Slight"],
            "bark_pitch": ["Small", "Medium", "Large"],
            "bark_loudness": ["Small", "Medium", "Large"],
            "bark_duration": (0, 0.5),
            "posture": ["Relaxed", "Standing", "Lying"],
            "head_tilt": ["None"],
            "context": ["Home", "Rest"]
        },
        "Excited": {
            "size": ["Small", "Medium", "Large"],
            "age_group": ["Puppy", "Adult", "Senior"],
            "heart_rate": ["Small: 120-160", "Medium: 120-160", "Large: 90-140 (+15 bpm for puppies)"],
            "tail_wag_speed": (2.5, 4.0),
            "tail_wag_amplitude": (60, 90),
            "tail_position": ["Mid-High"],
            "tail_stiffness": ["Loose"],
            "wag_direction": ["Right"],
            "bark_pitch": ["Small: 700-1000", "Medium: 500-800", "Large: 350-600"],
            "bark_loudness": ["Small: 70-90", "Medium: 60-75", "Large: 75-90"],
            "bark_duration": (0.0, 0.5),
            "posture": ["Forward Lean"],
            "head_tilt": ["Frequent"],
            "context": ["Play", "Greeting"]
        },
        "Sad": {
            "size": ["Small", "Medium", "Large"],
            "age_group": ["Puppy", "Adult", "Senior"],
            "heart_rate": ["Small: 80-95", "Medium: 60-75", "Large: 55-70 (seniors -10 bpm)"],
            "tail_wag_speed": (0.1, 1.0),
            "tail_wag_amplitude": (0, 30),
            "tail_position": ["Low"],
            "tail_stiffness": ["Loose"],
            "wag_direction": ["Neutral", "Left"],
            "bark_pitch": ["Small: 400-600", "Medium: 250-400", "Large: 200-300"],
            "bark_loudness": ["Small: 40-60", "Medium: 40-55", "Large: 40-55"],
            "bark_duration": (1.0, 0),  # >1.0s
            "posture": ["Low Posture", "Lying"],
            "head_tilt": ["None"],
            "context": ["Alone", "Rest"]
        },
        "Angry": {
            "size": ["Small", "Medium", "Large"],
            "age_group": ["Puppy", "Adult", "Senior"],
            "heart_rate": ["Small: 140-190", "Medium: 120-170", "Large: 110-160"],
            "tail_wag_speed": (0.1, 1.0),
            "tail_wag_amplitude": (0, 30),
            "tail_position": ["High"],
            "tail_stiffness": ["Stiff"],
            "wag_direction": ["Neutral", "Left"],
            "bark_pitch": ["Small: 250-450", "Medium: 150-350", "Large: 150-300"],
            "bark_loudness": ["Small: 75-90", "Medium: 80-100", "Large: 80-100"],
            "bark_duration": (0.0, 0.5),  # or growl-continuous
            "posture": ["Forward Stiff"],
            "head_tilt": ["None"],
            "context": ["Threat", "Territorial"]
        },
        "Hungry": {
            "size": ["Small", "Medium", "Large"],
            "age_group": ["Puppy", "Adult", "Senior"],
            "heart_rate": ["Small: 90-120", "Medium: 80-100", "Large: 70-90"],
            "tail_wag_speed": (0.1, 2.0),
            "tail_wag_amplitude": (0, 60),
            "tail_position": ["Neutral-Mid"],
            "tail_stiffness": ["Loose"],
            "wag_direction": ["Right"],
            "bark_pitch": ["Small: 450-650", "Medium: 350-500", "Large: 250-400"],
            "bark_loudness": ["Small: 60-75", "Medium: 65-75", "Large: 60-75"],
            "bark_duration": (0.0, 0.5),
            "posture": ["Alert but Relaxed"],
            "head_tilt": ["Possible"],
            "context": ["Food Prep", "Location"]
        },
        "Scared": {
            "size": ["Small", "Medium", "Large"],
            "age_group": ["Puppy", "Adult", "Senior"],
            "heart_rate": ["Small: 130-170", "Medium: 120-150", "Large: 100-140 (+15 bpm for puppies)"],
            "tail_wag_speed": (0.1, 1.0),
            "tail_wag_amplitude": (0, 30),
            "tail_position": ["Tucked"],
            "tail_stiffness": ["Stiff", "Trembling"],
            "wag_direction": ["Left"],
            "bark_pitch": ["Small: 700-1000", "Medium: 600-900", "Large: 500-750"],
            "bark_loudness": ["Small: 60-80", "Medium: 60-80", "Large: 60-80"],
            "bark_duration": (0, 0),  # Variable
            "posture": ["Low Crouch", "Backward Lean"],
            "head_tilt": ["None"],
            "context": ["Stranger", "Loud Noise"]
        },
        "Alert": {
            "size": ["Small", "Medium", "Large"],
            "age_group": ["Puppy", "Adult", "Senior"],
            "heart_rate": ["Small: 95-120", "Medium: 80-110", "Large: 70-100"],
            "tail_wag_speed": [0.1, 1.5],
            "tail_wag_amplitude": (30, 60),
            "tail_position": ["Horizontal-Mid"],
            "tail_stiffness": ["Stiff"],
            "wag_direction": ["Neutral"],
            "bark_pitch": ["Small: 450-650", "Medium: 350-500", "Large: 250-400"],
            "bark_loudness": ["Small: 65-80", "Medium: 65-85", "Large: 65-80"],
            "bark_duration": (0.3, 0.7),
            "posture": ["Upright", "Forward Stance"],
            "head_tilt": ["Minimal"],
            "context": ["New Sound", "Movement"]
    }
}

def roundUniform(min, max):
    return round(random.uniform(min, max), 2) 

# Helper: generate random dataset
def retrieve_client_data():
    emotions = ["Neutral", "Excited", "Sad", "Angry", "Hungry", "Scared", "Alert"]
    chosen_emotion = random.choice(emotions)
    return {
        "size": random.choice(possible_values[chosen_emotion]["size"]),
        "age_group": random.choice(possible_values[chosen_emotion]["age_group"]),
        "heart_rate": random.choice(possible_values[chosen_emotion]["heart_rate"]),
        "tail_wag_speed": roundUniform(*possible_values[chosen_emotion]["tail_wag_speed"]),
        "tail_wag_amplitude": roundUniform(*possible_values[chosen_emotion]["tail_wag_amplitude"]),
        "tail_position": random.choice(possible_values[chosen_emotion]["tail_position"]),
        "tail_stiffness": random.choice(possible_values[chosen_emotion]["tail_stiffness"]),
        "wag_direction": random.choice(possible_values[chosen_emotion]["wag_direction"]),
        "bark_pitch": random.choice(possible_values[chosen_emotion]["bark_pitch"]),
        "bark_loudness": random.choice(possible_values[chosen_emotion]["bark_loudness"]),
        "bark_duration": roundUniform(*possible_values[chosen_emotion]["bark_duration"]),
        "posture": random.choice(possible_values[chosen_emotion]["posture"]),
        "head_tilt": random.choice(possible_values[chosen_emotion]["head_tilt"]),
        "context": random.choice(possible_values[chosen_emotion]["context"])
    }

# Initial page when request is detected
# @app.route("/", methods=["GET"])
# def home():
#     return render_template_string(html_form, possible_values=possible_values)

# # Returns data as a JSON back to caller
# @app.route("/data", methods=["POST"])
# def get_data_both():
#     # mode is random or manual
#     mode = request.form.get("mode")
#     current_data = generate_random_data()
#     if mode == "manual":
#         for var, values in possible_values.items():
#             val = request.form.get(var)
#             if val == "random":
#                 current_data[var] = random.choice(values)
#             else:
#                 try:
#                     current_data[var] = int(val)
#                 except ValueError:
#                     current_data[var] = val
#         current_data["timestamp"] = datetime.now(timezone.utc).isoformat()
#     return jsonify(current_data)

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", debug=True)
# if __name__ == "__main__":
#     app.run(debug=True)

