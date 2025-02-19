document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('analysisForm');
    const results = document.getElementById('results');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const buttonText = document.getElementById('buttonText');
    const errorMessage = document.getElementById('errorMessage');
    let sentimentChart = null;

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }

    function validateResponseData(data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.statistics || !data.results) return false;
        if (typeof data.statistics.positive !== 'number') return false;
        if (!Array.isArray(data.results)) return false;
        return true;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = document.getElementById('url').value;
        const analysisUrl = form.dataset.analysisUrl;
        
        try {
            errorMessage.classList.add('hidden');
            loadingIndicator.classList.remove('hidden');
            buttonText.textContent = 'Analyzing...';
            results.classList.add('hidden');
            
            const formData = new FormData();
            formData.append('url', url);
            
            const response = await fetch(analysisUrl, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            console.log('Response data:', data);  // Debug log
            
            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed');
            }
            
            if (!validateResponseData(data)) {
                throw new Error('Invalid response data format');
            }
            
            displayResults(data);
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'An error occurred during analysis. Please try again.');
        } finally {
            loadingIndicator.classList.add('hidden');
            buttonText.textContent = 'Analyze Sentiment';
        }
    });

    function displayResults(data) {
        console.log('Displaying results:', data);  // Debug log
        results.classList.remove('hidden');
        
        // Update percentages
        document.getElementById('positivePercentage').textContent = `${data.statistics.positive}%`;
        document.getElementById('neutralPercentage').textContent = `${data.statistics.neutral}%`;
        document.getElementById('negativePercentage').textContent = `${data.statistics.negative}%`;
        
        // Update chart
        if (sentimentChart) {
            sentimentChart.destroy();
        }
        
        const ctx = document.getElementById('sentimentChart').getContext('2d');
        sentimentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [{
                    data: [
                        data.statistics.positive,
                        data.statistics.neutral,
                        data.statistics.negative
                    ],
                    backgroundColor: ['#10B981', '#6B7280', '#EF4444']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        // Display comments/reviews
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = data.results.map(result => `
            <div class="border-l-4 ${getSentimentColor(result.sentiment)} p-4 bg-gray-50 mb-4">
                <p class="text-sm text-gray-600">${result.text}</p>
                <div class="mt-2 text-xs font-semibold flex justify-between">
                    <span>${result.sentiment}</span>
                    <span>Confidence: ${result.confidence}%</span>
                </div>
            </div>
        `).join('');
    }

    function getSentimentColor(sentiment) {
        return {
            'Positive': 'border-green-500',
            'Neutral': 'border-gray-500',
            'Negative': 'border-red-500'
        }[sentiment] || 'border-gray-500';
    }
});