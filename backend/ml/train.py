import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
df = pd.read_csv("trainingData.csv")

# Features and label
X = df.drop("fraud", axis=1)
y = df["fraud"]

# Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model
joblib.dump(model, "fraud_model.pkl")

print("MODEL TRAINED SUCCESSFULLY")