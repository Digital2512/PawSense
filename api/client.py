# from flask import Flask, request, jsonify, render_template_string
import random
import numpy as np
from datetime import datetime, timezone

# --- Available values for manual selection ---
possible_values = {
    "Neutral": {
        "size": ["Small", "Medium", "Large"],
        "age_group": (0, 15),
        "heart_rate": {"Small": (90,110), "Medium": (70,90), "Large": (60,80)},
        "tail_wag_amplitude": (30, 60),
        "tail_position": ["Neutral"],
        "tail_stiffness": ["Loose"],
        "wag_direction": ["Neutral", "Right-slight"],
        "bark_pitch": {"Small": (300,400), "Medium": (250,350), "Large": (200,300)},
        "bark_loudness": {"Small": (60,70), "Medium": (55,65), "Large": (55,65)},
        "bark_duration": (random.randint(20,50) / 100.0) + random.randint(-5,15)/100.0,
        "head_tilt": random.randint(0,500) / 100.0 + random.randint(0,200) / 100, 
        "context": ["Home", "Backyard", "Quiet Park"]
    },
    "Excited": {
        "size": ["Small", "Medium", "Large"],
        "age_group": (0, 15),
        "heart_rate": {"Small": (140,180), "Medium": (120,160), "Large": (110,150)},
        "tail_wag_amplitude": (60, 90),
        "tail_position": ["Mid, High"],
        "tail_stiffness": ["Loose"],
        "wag_direction": ["Right"],
        "bark_pitch": {"Small": (700,1000), "Medium": (500,800), "Large": (350,600)},
        "bark_loudness": {"Small": (70,90), "Medium": (70,85), "Large": (75,90)},
        "bark_duration": (random.randint(20,100) / 100.0) + random.randint(-10,10)/100.0,
        "head_tilt": random.randint(0,1500) / 100.0 + random.randint(0,300) / 100.0,
        "context": ["Home", "Backyard", "Park", "Dog Park"]
    },
    "Sad": {
        "size": ["Small", "Medium", "Large"],
        "age_group": (0, 15),
        "heart_rate": {"Small": (80,95), "Medium": (60,75), "Large": (55,70)},
        "tail_wag_amplitude": (0, 30),
        "tail_position": ["Low"],
        "tail_stiffness": ["Loose"],
        "wag_direction": ["Neutral", "Left"],
        "bark_pitch": {"Small": (400,600), "Medium": (250,400), "Large": (200,300)},
        "bark_loudness": {"Small": (50,60), "Medium": (40,60), "Large": (40,55)},
        "bark_duration": (random.randint(100,200) / 100.0) + random.randint(-50,100)/100.0,  # >1.0s
        "head_tilt": random.randint(0,500) / 100.0 + random.randint(0,200) / 100.0,
        "context": ["Alone Room", "Home", "Quiet Backyard"]
    },
    "Angry": {
        "size": ["Small", "Medium", "Large"],
        "age_group": (1, 15),
        "heart_rate": {"Small": (140,190), "Medium": (120,170), "Large": (110,160)},
        "tail_wag_amplitude": (0, 30),
        "tail_position": ["High"],
        "tail_stiffness": ["Stiff"],
        "wag_direction": ["Neutral", "Left"],
        "bark_pitch": {"Small": (250,450), "Medium": (150,350), "Large": (150,300)},
        "bark_loudness": {"Small": (85,100), "Medium": (80,95), "Large": (80,100)},
        "bark_duration": (random.randint(20,50) / 100.0) + random.randint(-10,10),  # or growl-continuous
        "head_tilt": random.randint(0,500) / 100.0 + random.randint(0,200) / 100.0,
        "context": ["Territory", "Home", "Fence"]
    },
    "Hungry": {
        "size": ["Small", "Medium", "Large"],
        "age_group": (0, 15),
        "heart_rate": {"Small": (90,115), "Medium": (80,100), "Large": (70,90)},
        "tail_wag_amplitude": (0, 60),
        "tail_position": ["Neutral-Mid"],
        "tail_stiffness": ["Loose"],
        "wag_direction": ["Right"],
        "bark_pitch": {"Small": (450,650), "Medium": (350,500), "Large": (250,400)},
        "bark_loudness": {"Small": (65,80), "Medium": (60,75), "Large": (60,75)},
        "bark_duration": (random.randint(20,50) / 100.0) + random.randint(-10,20)/100.0,
        "head_tilt": random.randint(0,1000) / 100.0 + random.randint(0,300) / 100.0,
        "context": ["Food Prep", "Location", "Kitchen", "Dining Area"]
    },
    "Scared": {
        "size": ["Small", "Medium", "Large"],
        "age_group": (0, 15),
        "heart_rate": {"Small": (130, 170), "Medium": (110,150), "Large": (100,140)},
        "tail_wag_amplitude": (0, 30),
        "tail_position": ["Tucked"],
        "tail_stiffness": ["Stiff", "Trembling"],
        "wag_direction": ["Left"],
        "bark_pitch": {"Small": (700,1000), "Medium": (600,900), "Large": (500,750)},
        "bark_loudness": {"Small": (65,85), "Medium": (60,80), "Large": (60,80)},
        "bark_duration": (random.randint(20,100) / 100.0) + random.randint(-5,20)/100.0,  # Variable
        "head_tilt": random.randint(0,1500) / 100.0 + random.randint(0,1500) / 100.0,
        "context": ["Stranger", "Loud Noise", "Vet Clinic"]
    },
    "Alert": {
        "size": ["Small", "Medium", "Large"],
        "age_group": (0, 15),
        "heart_rate": {"Small": (95,120), "Medium": (80,110), "Large": (70,100)},
        "tail_wag_amplitude": (30, 60),
        "tail_position": ["Horizontal-Mid"],
        "tail_stiffness": ["Stiff"],
        "wag_direction": ["Neutral"],
        "bark_pitch": {"Small": (450,650), "Medium": (350,500), "Large": (250,400)},
        "bark_loudness": {"Small": (70,85), "Medium": (65,80), "Large": (65,80)},
        "bark_duration": (random.randint(30,70) / 100.0) + (random.randint(-20,20)/100.0),
        "head_tilt": round(random.randint(0,1000) / 100.0 + random.randint(0,200) / 100.0, 2),
        "context": ["New Sound", "Movement", "Unknown Object"]
    }
}

def roundUniform(min, max):
    return round(random.uniform(min, max), 2) 

# Helper: generate random dataset
def retrieve_client_data():
    emotions = ["Neutral", "Excited", "Sad", "Angry", "Hungry", "Scared", "Alert"]
    activity = ["Play", "Potty", "Medication", "Sleep", "Feeding", "Exercise"]
    chosen_emotion = random.choice(emotions)
    size = random.choice(possible_values[chosen_emotion]["size"])
    age = random.choice(possible_values[chosen_emotion]["age_group"])
    base_heart_rate = roundUniform(*possible_values[chosen_emotion]["heart_rate"][size])
    heart_rate = 60 # default value
    if age < 1:
        base_heart_rate += 15
    elif age > 7:
        base_heart_rate -= 5
    heart_rate = base_heart_rate + random.randint(-15,15)
    tail_wag_speed = {"Angry": (random.randint(0,100) / 100.0) + random.randint(0,50)/100.0, "Excited": (random.randint(250,400) / 100.0) + random.randint(-100,150) / 100.0, "Hungry": (random.randint(100,200) / 100.0) + random.randint(-20,20) / 100, "Neutral": (random.randint(50,200) / 100.0) + random.randint(-15,15)/100.0, "Sad": (random.randint(0,100) / 100.0) + random.randint(0,15) /100, "Scared": (random.randint(0,100) / 100.0) + random.randint(0,50)/100.0, "Alert": (random.randint(0,150) / 100.0) + random.randint(0, 75)/100.0}
    tail_wag_amplitude = {"Angry": random.randint(0,30) + random.randint(0,10), "Excited": random.randint(60,90) + random.randint(-10,10), "Hungry": random.randint(30,60) + random.randint(-10,10), "Neutral": random.randint(30,60) + random.randint(-15,15), "Sad": random.randint(0,30) + random.randint(0,15), "Scared": random.randint(0,30) + random.randint(0,10), "Alert": random.randint(30,60) + random.randint(-10,10)}
    bark_pitch = 0 # default value
    if size == "Large":
        if bark_pitch < 1:
            bark_pitch += 30
        elif bark_pitch > 7:
            bark_pitch -= 15
    else:
        if bark_pitch < 1:
            bark_pitch += 40
        elif bark_pitch > 7:
            bark_pitch -= 20
    bark_pitch += random.randint(-15,15)
    steps = {"Small": random.randint(0, 12000) if age < 1 else random.randint(0, 10000) if age > 7 else random.randint(0, 15000), "Medium": random.randint(0, 15000) if age < 1 else random.randint(0, 12000) if age > 7 else random.randint(0, 18000), "Large": random.randint(0, 18000) if age < 1 else random.randint(0, 12000) if age > 7 else random.randint(0, 20000)}
    latitude = random.uniform(-27.638686676839207, -27.35052525945719)
    longitude = random.uniform(152.93032865374974, 153.11524474137644)
    return {
        "size": random.choice(possible_values[chosen_emotion]["size"]),
        "age": age,
        "heart_rate": heart_rate,
        "tail_wag_speed": round(tail_wag_speed[chosen_emotion],2),
        "tail_wag_amplitude": tail_wag_amplitude[chosen_emotion],
        "tail_position": random.choice(possible_values[chosen_emotion]["tail_position"]),
        "tail_stiffness": random.choice(possible_values[chosen_emotion]["tail_stiffness"]),
        "wag_direction": random.choice(possible_values[chosen_emotion]["wag_direction"]),
        "bark_pitch": round(bark_pitch,2),
        "bark_loudness": round(roundUniform(*possible_values[chosen_emotion]["bark_loudness"][size]) + random.randint(-15,15),2),
        "bark_duration": round(possible_values[chosen_emotion]["bark_duration"],2),
        "head_tilt": round(possible_values[chosen_emotion]["head_tilt"],2),
        "context": random.choice(possible_values[chosen_emotion]["context"]),
        "activity": random.choice(activity),
        "steps": steps[size],
        "latitude": latitude,
        "longitude":longitude
    }
