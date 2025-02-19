# filepath: /home/shaikat/MachineLearning/PyTorch/sentiment_analyzer_project/sentiment_analyzer/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('analyzer.urls', namespace='analyzer')),  # Ensure the namespace is included
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)