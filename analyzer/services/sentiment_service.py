# analyzer/services/sentiment_service.py
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import numpy as np

class SentimentAnalyzer:
    def __init__(self):
        try:
            self.model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
            self.model.eval()  # Set model to evaluation mode
            self.labels = ['Negative', 'Neutral', 'Positive']
        except Exception as e:
            print(f"Error initializing sentiment analyzer: {str(e)}")
            raise

    def analyze_text(self, text):
        try:
            # Handle empty or invalid text
            if not text or not isinstance(text, str):
                return {
                    'text': str(text),
                    'sentiment': 'Neutral',
                    'confidence': 0,
                    'scores': {label: 0 for label in self.labels}
                }

            # Tokenize with proper padding and truncation
            encoded_text = self.tokenizer(
                text,
                return_tensors='pt',
                padding=True,
                truncation=True,
                max_length=512
            )

            # Get model outputs
            with torch.no_grad():
                outputs = self.model(**encoded_text)
                scores = torch.nn.functional.softmax(outputs.logits, dim=1)

            # Convert to numpy for easier handling
            scores_np = scores[0].numpy()

            # Get prediction and confidence
            prediction_idx = np.argmax(scores_np)
            prediction = self.labels[prediction_idx]
            confidence = float(scores_np[prediction_idx])

            return {
                'text': text,
                'sentiment': prediction,
                'confidence': round(confidence * 100, 2),
                'scores': {
                    label: round(float(score) * 100, 2)
                    for label, score in zip(self.labels, scores_np)
                }
            }
        except Exception as e:
            print(f"Error analyzing text: {str(e)}")
            return {
                'text': text,
                'sentiment': 'Neutral',
                'confidence': 0,
                'scores': {label: 0 for label in self.labels}
            }

    def batch_analyze(self, texts):
        return [self.analyze_text(text) for text in texts if text]