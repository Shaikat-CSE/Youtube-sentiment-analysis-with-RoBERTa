from googleapiclient.discovery import build
from urllib.parse import urlparse, parse_qs
import re

class YouTubeScraper:
    def __init__(self):
        # Replace with your actual API key
        self.api_key = 'AIzaSyBqjXMQEtsQiFbiWeTswvobEkvLffdaXQQ'
        self.youtube = build('youtube', 'v3', developerKey=self.api_key)

    def extract_video_id(self, url):
        """Extract video ID from YouTube URL"""
        # Handle different URL formats
        if 'youtu.be' in url:
            return url.split('/')[-1].split('?')[0]
        
        query = parse_qs(urlparse(url).query)
        return query.get('v', [None])[0]

    def get_comments(self, video_url, max_comments=100):
        try:
            video_id = self.extract_video_id(video_url)
            if not video_id:
                raise ValueError("Could not extract video ID from URL")

            print(f"Fetching comments for video ID: {video_id}")
            
            comments = []
            next_page_token = None
            
            while len(comments) < max_comments:
                # Get comment threads
                request = self.youtube.commentThreads().list(
                    part='snippet',
                    videoId=video_id,
                    maxResults=min(100, max_comments - len(comments)),
                    pageToken=next_page_token,
                    textFormat='plainText'
                )
                
                response = request.execute()
                
                # Extract comment texts
                for item in response['items']:
                    comment_text = item['snippet']['topLevelComment']['snippet']['textDisplay']
                    if comment_text.strip():
                        comments.append(comment_text)
                
                # Check if there are more comments
                next_page_token = response.get('nextPageToken')
                if not next_page_token or len(comments) >= max_comments:
                    break
            
            print(f"Successfully fetched {len(comments)} comments")
            return comments[:max_comments]
            
        except Exception as e:
            print(f"Error while fetching YouTube comments: {str(e)}")
            return []