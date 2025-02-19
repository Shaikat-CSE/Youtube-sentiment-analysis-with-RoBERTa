
# YouTube Sentiment Analysis App 🎥💬

This web app analyzes YouTube comments and reviews to perform **sentiment analysis**. It fetches comments using the **YouTube API** (instead of scraping), ensuring real-time, authorized data. The app classifies the sentiment of the comments into **Positive**, **Neutral**, or **Negative** using a **fine-tuned RoBERTa model** for sentiment classification.

## Features ✨
- **Real-time Sentiment Analysis**: Analyzes YouTube comments for sentiment using AI.
- **Sentiment Classification**: Classifies sentiment into **Positive**, **Neutral**, or **Negative**.
- **Comprehensive Reports**: Displays detailed sentiment analysis for each video.
- **No Scraping**: Uses the YouTube API to fetch data in a reliable and authorized manner.
- **Interactive UI**: Modern, responsive frontend with real-time updates.

## Tech Stack 🔧
- **Backend**: Django (Python) for server-side logic and API handling.
- **Sentiment Analysis Model**: RoBERTa fine-tuned for sentiment classification, utilizing **PyTorch ROCm** for optimized performance.
- **Frontend**: Tailwind CSS & JavaScript for a sleek and responsive user interface.
- **Data Fetching**: YouTube API for fetching comments and reviews from videos.
  
## Getting Started 🚀

### Prerequisites
- Python 3.x
- Django
- PyTorch ROCm (for optimized model execution)
- Tailwind CSS
- YouTube API key (for fetching comments)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shaikat-CSE/Youtube-sentiment-analysis-with-RoBERTa.git
   cd youtube-sentiment-analysis
   ```

2. **Set up a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows, use `venv\Scriptsctivate`
   ```

3. **Install the required dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the YouTube API key**:
   - Go to [Google Developer Console](https://console.developers.google.com/).
   - Create a project and enable the **YouTube Data API v3**.
   - Generate an API key and add it to your `settings.py` in the project.

5. **Run the Django server**:
   ```bash
   python manage.py runserver
   ```

6. **Open the app**:
   - Navigate to `http://127.0.0.1:8000/` in your browser to see the app in action.

## Usage 📊
- **Enter a YouTube video URL**: Paste a YouTube video URL to analyze its comments.
- **View Sentiment**: Get a comprehensive report with **positive**, **neutral**, and **negative** sentiment breakdowns.

## Contributing 🤝
If you have suggestions or improvements for this project, feel free to fork it and submit a pull request! Contributions are welcome.

### Bug Reports & Feature Requests
If you encounter any bugs or would like to request new features, please create an issue in the [Issues section](https://github.com/Shaikat-CSE/Youtube-sentiment-analysis-with-RoBERTa.git/issues).

## License 📝
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements 👏
- **RoBERTa** for sentiment analysis.
- **PyTorch ROCm** for optimized execution.
- **Django** for backend development.
- **Tailwind CSS** for a modern UI design.

---

### Let's Connect! 🌐
Feel free to follow me on [LinkedIn](https://www.linkedin.com/in/shaikatsk) for more updates on AI projects!

#AI #MachineLearning #SentimentAnalysis #Django #RoBERTa #PyTorch #YouTubeAPI #TailwindCSS #TechForGood #WebDevelopment
