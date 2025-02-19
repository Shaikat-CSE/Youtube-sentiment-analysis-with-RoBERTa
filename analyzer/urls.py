from django.urls import path
from . import views

app_name = 'analyzer'

urlpatterns = [
    path('', views.index, name='index'),
    path('analyze/youtube/', views.analyze_youtube, name='analyze_youtube'),
    path('analyze/', views.analyze_url, name='analyze'),
]