import pandas as pd
import random
from datetime import datetime, timedelta

# Parameters
pet_name = "Buddy"
start_date = datetime(2025, 5, 1)  # first day
num_days = 90  # how many days to generate

# Duration ranges in minutes for each activity
duration_ranges = {
    "breakfast": (5, 15),
    "lunch": (10, 20),
    "dinner": (10, 20),
    "play": (30, 120),
    "sleep": (360, 540),  # long rest
    "potty": (3, 10),
    "medicine": (1, 5),
    "relax": (20, 60),
    "walk": (15, 60)
}

# Helper to create an activity entry
def create_activity(day_start, hour, minute, activity):
    start_time = day_start.replace(hour=hour, minute=minute)
    duration = random.randint(*duration_ranges[activity])
    end_time = start_time + timedelta(minutes=duration)
    return {
        "pet": pet_name,
        "activity": activity.capitalize(),
        "start_time": start_time,
        "duration_min": duration,
        "end_time": end_time
    }

# Main generation
records = []
for d in range(num_days):
    day_start = start_date + timedelta(days=d)
    
    # Always start with sleep from previous night until morning
    sleep_start = day_start.replace(hour=0, minute=0)
    sleep_duration = random.randint(360, 480)  # 6–8 hrs
    sleep_end = sleep_start + timedelta(minutes=sleep_duration)
    records.append({
        "pet": pet_name,
        "activity": "Sleep",
        "start_time": sleep_start,
        "duration_min": sleep_duration,
        "end_time": sleep_end
    })
    
    # Meal times
    records.append(create_activity(day_start, random.randint(6, 8), random.randint(0, 59), "breakfast"))
    records.append(create_activity(day_start, random.randint(11, 12), random.randint(0, 59), "lunch"))
    records.append(create_activity(day_start, random.randint(17, 18), random.randint(0, 59), "dinner"))
    
    # Random other activities for the day
    for _ in range(random.randint(5, 8)):
        activity = random.choice(["play", "potty", "medicine", "relax", "walk"])
        hour = random.randint(6, 21)  # between breakfast and bedtime
        minute = random.randint(0, 59)
        records.append(create_activity(day_start, hour, minute, activity))
    
    # Evening/overnight sleep
    night_sleep_start = day_start.replace(hour=random.randint(21, 23), minute=random.randint(0, 59))
    night_sleep_duration = random.randint(360, 540)
    night_sleep_end = night_sleep_start + timedelta(minutes=night_sleep_duration)
    records.append({
        "pet": pet_name,
        "activity": "Sleep",
        "start_time": night_sleep_start,
        "duration_min": night_sleep_duration,
        "end_time": night_sleep_end
    })

# Convert to DataFrame
df = pd.DataFrame(records)
df = df.sort_values("start_time").reset_index(drop=True)

# Save to CSV
df.to_csv(r"C:\Users\ValerieAnnabella\Downloads\GitHub\PawSense\api\behaviour_prediction\pet_activity_simulation.csv", index=False)

print(df)
