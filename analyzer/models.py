# analyzer/models.py
from django.db import models

class Analysis(models.Model):
    url = models.URLField()
    source = models.CharField(max_length=10)  # 'youtube' or 'amazon'
    created_at = models.DateTimeField(auto_now_add=True)
    total_comments = models.IntegerField()
    positive_percentage = models.FloatField()
    neutral_percentage = models.FloatField()
    negative_percentage = models.FloatField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.source.title()} Analysis - {self.created_at.strftime('%Y-%m-%d %H:%M')}"