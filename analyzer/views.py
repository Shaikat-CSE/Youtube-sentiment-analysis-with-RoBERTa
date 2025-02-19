# analyzer/views.py
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .services.sentiment_service import SentimentAnalyzer
from .services.scrapers import YouTubeScraper

def index(request):
    return render(request, 'analyzer/index.html')

@csrf_exempt
def analyze_youtube(request):
    if request.method == 'POST':
        try:
            url = request.POST.get('url')
            if not url:
                return JsonResponse({'error': 'URL is required'}, status=400)
            
            if 'youtube.com' not in url and 'youtu.be' not in url:
                return JsonResponse({'error': 'Not a valid YouTube URL'}, status=400)

            # Initialize scrapers
            scraper = YouTubeScraper()
            analyzer = SentimentAnalyzer()
            
            # Get comments using YouTube API
            print(f"Fetching YouTube comments from: {url}")
            texts = scraper.get_comments(url)
            
            if not texts:
                return JsonResponse({'error': 'No comments found'}, status=404)
            
            print(f"Found {len(texts)} comments to analyze")
            
            # Analyze sentiments
            results = analyzer.batch_analyze(texts)
            
            if not results:
                return JsonResponse({'error': 'Analysis failed'}, status=500)
            
            # Calculate statistics
            total = len(results)
            sentiments = {'Positive': 0, 'Neutral': 0, 'Negative': 0}
            
            for result in results:
                sentiments[result['sentiment']] += 1
            
            percentages = {
                'positive': round((sentiments['Positive'] / total * 100), 2) if total > 0 else 0,
                'neutral': round((sentiments['Neutral'] / total * 100), 2) if total > 0 else 0,
                'negative': round((sentiments['Negative'] / total * 100), 2) if total > 0 else 0
            }
            
            response_data = {
                'results': results[:10],
                'statistics': percentages,
                'total_analyzed': total
            }
            
            print(f"Analysis completed. Total analyzed: {total}")
            return JsonResponse(response_data)
            
        except Exception as e:
            print(f"Error during analysis: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def analyze_url(request):
    """Generic analysis endpoint for non-YouTube URLs"""
    if request.method == 'POST':
        try:
            url = request.POST.get('url')
            if not url:
                return JsonResponse({'error': 'URL is required'}, status=400)

            if 'youtube.com' in url or 'youtu.be' in url:
                return analyze_youtube(request)
                
            return JsonResponse({'error': 'Unsupported URL type'}, status=400)
            
        except Exception as e:
            print(f"Error during analysis: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)