document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('analysisForm');
    const results = document.getElementById('results');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const buttonText = document.getElementById('buttonText');
    const errorMessage = document.getElementById('errorMessage');
    let sentimentChart = null;
    let allComments = [];  // Store all comments for filtering

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
        
        // Store all comments and display them
        allComments = data.results;
        displayFilteredComments('all');
        
        // Add animation classes
        document.querySelectorAll('.comment-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }

    function displayFilteredComments(filter) {
        const commentsList = document.getElementById('commentsList');
        const filteredComments = filter === 'all' 
            ? allComments 
            : allComments.filter(comment => comment.sentiment.toLowerCase() === filter);
        
        commentsList.innerHTML = filteredComments.map(result => `
            <div class="comment-card dark-glass rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02]">
                <div class="flex items-center justify-between mb-4">
                    <span class="px-4 py-1.5 rounded-full text-sm font-medium ${getSentimentBadgeClass(result.sentiment)}">
                        ${result.sentiment}
                    </span>
                    <div class="flex items-center">
                        <div class="h-2 w-2 ${getConfidenceColor(result.confidence)} rounded-full mr-2"></div>
                        <span class="text-sm text-gray-400">
                            ${result.confidence}% confident
                        </span>
                    </div>
                </div>
                <p class="text-gray-300 leading-relaxed">${result.text}</p>
                <div class="mt-4 pt-4 border-t border-gray-700">
                    <div class="w-full bg-gray-700 rounded-full h-1.5">
                        <div class="h-1.5 rounded-full ${getConfidenceBarColor(result.sentiment)}" 
                             style="width: ${result.confidence}%">
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function getSentimentBadgeClass(sentiment) {
        return {
            'Positive': 'bg-green-900/50 text-green-300 border border-green-500/30',
            'Neutral': 'bg-gray-900/50 text-gray-300 border border-gray-500/30',
            'Negative': 'bg-red-900/50 text-red-300 border border-red-500/30'
        }[sentiment] || 'bg-gray-900/50 text-gray-300';
    }

    function getConfidenceColor(confidence) {
        if (confidence > 90) return 'bg-green-400';
        if (confidence > 70) return 'bg-yellow-400';
        return 'bg-red-400';
    }

    function getConfidenceBarColor(sentiment) {
        return {
            'Positive': 'bg-gradient-to-r from-green-600 to-green-400',
            'Neutral': 'bg-gradient-to-r from-gray-600 to-gray-400',
            'Negative': 'bg-gradient-to-r from-red-600 to-red-400'
        }[sentiment] || 'bg-gray-600';
    }

    // Add filter button event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active button state
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active', 'ring-2', 'ring-offset-2');
            });
            e.target.classList.add('active', 'ring-2', 'ring-offset-2');
            
            // Filter comments
            displayFilteredComments(e.target.dataset.filter);
        });
    });
});