import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
from sklearn.metrics import accuracy_score, classification_report
from tensorflow.python.keras.callbacks import EarlyStopping
import joblib

filepath = "C:\\Users\\nabil\\OneDrive\\Desktop\\Smart Collar for Dogs\\Dataset for emotion detection\\dog_emotion_dataset_140k.csv"
df = pd.read_csv(filepath)

print(df.head())

categorical_features = ['size', 'tail_position', 'tail_stiffness', 'wag_direction']
label_encoders = {}

for col in categorical_features:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])  # fit on training data
    label_encoders[col] = le

target_le = LabelEncoder()

target_le.fit(df['emotion'])
df['emotion'] = target_le.transform(df['emotion'])


print(df.head())

X = df.drop(columns=['emotion', 'context'])
y = df['emotion']

context = df['context'].unique()

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=100, stratify=y)

#model = RandomForestClassifier(n_estimators=200, random_state=42, max_depth=5, max_features='sqrt', min_samples_split=10, min_samples_leaf=5)
model = xgb.XGBClassifier(n_estimators=1000, max_depth=5, learning_rate=0.1, random_state=42)

model.fit(X_train, y_train)

scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print("CV Accuracy: %.2f%% +/- %.2f%%" % (scores.mean()*100, scores.std()*100))

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy * 100:.2f}%")
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=target_le.classes_))

new_data = pd.DataFrame([
    {
        'size': 'Small',
        'age': 8,
        'heart_rate': 93,
        'tail_wag_speed': 0.49,
        'tail_wag_amplitude': 53,
        'tail_position': 'Neutral',
        'tail_stiffness': 'Loose',
        'wag_direction': 'Neutral',
        'bark_pitch': 400,
        'bark_loudness': 70,
        'bark_duration': 0.43,
        'head_tilt': 0,
    }
])

# Encode categorical features with the same label encoders used in training
for col in categorical_features:
    new_data[col] = target_le.inverse_transform(new_data[col]) if col == 'emotion' else label_encoders[col].transform(new_data[col])
    print(f"Encoded {col}: {new_data[col].values}")

print(new_data)
predicted_label_num = model.predict(new_data)[0]
print("Predicted label number:", predicted_label_num)
predicted_emotion = target_le.inverse_transform([predicted_label_num])[0]
print("Predicted dog emotion:", predicted_emotion)

joblib.dump(model,"C:\\Users\\nabil\\OneDrive\\Desktop\\Smart Collar for Dogs\\model.joblib")