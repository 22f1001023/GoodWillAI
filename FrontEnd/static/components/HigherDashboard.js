const HigherDashboard = {
  template: `
    <div class="higher-dashboard bg-dark text-light min-vh-100 py-5">
      <div class="container">
        <div class="text-center mb-5">
          <i class="fa-solid fa-user-tie fa-3x mb-3" style="color:#00ffe0; filter: drop-shadow(0 0 8px #00ffe0cc);"></i>
          <h1 class="fw-bold display-5" style="letter-spacing:1px;">
            Welcome @{{ username }}
          </h1>
          <p class="lead text-secondary mx-auto" style="max-width: 700px;">
            Ask anything about your supply chain, policies, or business data.<br>
            GoodWillAI's executive agent is ready to answer complex queries, combining documents and data for actionable insights.
          </p>
        </div>

        <!-- Dataset Summary Button -->
        <div class="row justify-content-center mb-3">
          <div class="col-md-10 text-center">
            <button @click="loadDataSummary" class="btn btn-outline-info me-3" :disabled="loadingSummary">
              <i class="fa-solid fa-chart-bar me-2"></i>
              {{ loadingSummary ? 'Loading...' : 'View Dataset Summary' }}
            </button>
            <button @click="clearResults" class="btn btn-outline-secondary">
              <i class="fa-solid fa-trash me-2"></i>Clear Results
            </button>
          </div>
        </div>

        <!-- All-purpose Query Bar -->
        <div class="row justify-content-center mb-5">
          <div class="col-md-10">
            <form @submit.prevent="onSearch">
              <div class="input-group input-group-lg shadow" style="border-radius: 2rem;">
                <span class="input-group-text bg-black border-0" style="border-radius: 2rem 0 0 2rem;">
                  <i class="fa-solid fa-magnifying-glass text-primary"></i>
                </span>
                <input
                  v-model="query"
                  type="text"
                  class="form-control bg-black text-primary border-0"
                  style="border-radius: 0 2rem 2rem 0; font-size:1.2rem; box-shadow:0 0 16px #00ffe044;"
                  placeholder="Ask about policies, data, hybrid or permission-restricted queries..."
                  :disabled="loading"
                  autofocus
                >
                <button type="submit" class="btn btn-primary px-4" :disabled="loading || !query.trim()" style="border-radius: 0 2rem 2rem 0; background: linear-gradient(90deg, #00ffe0 0%, #007cf0 100%); border: none;">
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </form>
            
            <!-- Loading State -->
            <div v-if="loading" class="mt-4 text-center">
              <div class="spinner-border text-info me-2" role="status"></div>
              <span class="text-info">AI Agent is thinking...</span>
            </div>
            
            <!-- AI Response -->
            <div v-if="searchResult" class="mt-4 p-4 bg-black rounded-4 shadow-sm border-start border-4" style="border-color:#00ffe0;">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="fw-bold text-success">
                  <i class="fa-solid fa-robot me-2"></i>AI Agent Response
                </div>
                <small class="text-muted">Query: "{{ lastQuery }}"</small>
              </div>
              <div class="text-light" style="white-space:pre-wrap; line-height: 1.6;">{{ searchResult }}</div>
            </div>
            
            <!-- Dataset Summary -->
            <div v-if="dataSummary" class="mt-4 p-4 bg-secondary bg-opacity-25 rounded-4 shadow-sm border-start border-4" style="border-color:#ffc107;">
              <div class="fw-bold text-warning mb-2">
                <i class="fa-solid fa-database me-2"></i>Dataset Summary
              </div>
              <div class="text-light" v-html="formatMarkdown(dataSummary)"></div>
            </div>
            
            <!-- Error Message -->
            <div v-if="errorMessage" class="mt-4 alert alert-danger text-center">
              <i class="fa-solid fa-exclamation-triangle me-2"></i>{{ errorMessage }}
            </div>
          </div>
        </div>

        <!-- Sample Executive/Hybrid Questions Section -->
        <div class="row mt-5">
          <div class="col-md-12 text-center">
            <h4 class="fw-bold mb-3" style="color:#00ffe0;">
              <i class="fa-solid fa-lightbulb me-2"></i>Sample Executive & Hybrid Queries
            </h4>
            <div class="row g-3">
              <div class="col-md-6" v-for="(question, index) in sampleQuestions" :key="index">
                <div class="card bg-secondary bg-opacity-25 h-100 border-0" style="cursor: pointer;" @click="useQuestion(question)">
                  <div class="card-body p-3">
                    <small class="text-light">{{ question }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      username: '',
      query: '',
      searchResult: '',
      dataSummary: '',
      lastQuery: '',
      loading: false,
      loadingSummary: false,
      errorMessage: '',
      sampleQuestions: [
        "What is our company's definition of slow-moving inventory according to the Inventory Management policy?",
        "What are the required steps for handling obsolete inventory write-offs?",
        "What sustainability practices should our logistics partners follow according to our Environmental Sustainability policy?",
        "What was the total sales amount for the Southwest region in the last quarter?",
        "Which inventory items qualify as 'no-movers' according to our policy, and what is their total current value?",
        "Are there any suppliers who don't meet our minimum ethical sourcing requirements as defined in our Supplier Code of Conduct?",
        "According to our Transportation and Logistics policy, are we using the optimal shipping modes for high-value orders?",
        "Show me the profit margins for all products in Q1."
      ]
    };
  },
  created() {
    this.loadUserInfo();
  },
  methods: {
    loadUserInfo() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        this.username = user && user.username ? user.username : 'HigherOfficial';
      } catch {
        this.username = 'HigherOfficial';
      }
    },
    
    async onSearch() {
      if (!this.query.trim()) {
        this.errorMessage = 'Please enter a query.';
        return;
      }
      
      this.clearMessages();
      this.loading = true;
      this.lastQuery = this.query;
      
      try {
        const response = await fetch('/api/agent/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('token')
          },
          body: JSON.stringify({ query: this.query })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          this.searchResult = data.result;
        } else {
          this.errorMessage = data.error || 'AI agent query failed.';
        }
      } catch (error) {
        console.error('Query error:', error);
        this.errorMessage = 'Server error. Please try again later.';
      } finally {
        this.loading = false;
        this.query = '';
      }
    },
    
    async loadDataSummary() {
      this.clearMessages();
      this.loadingSummary = true;
      
      try {
        const response = await fetch('/api/agent/summary', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('token')
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          this.dataSummary = data.summary;
        } else {
          this.errorMessage = data.error || 'Failed to load dataset summary.';
        }
      } catch (error) {
        console.error('Summary error:', error);
        this.errorMessage = 'Failed to load dataset summary.';
      } finally {
        this.loadingSummary = false;
      }
    },
    
    useQuestion(question) {
      this.query = question;
      this.onSearch();
    },
    
    clearResults() {
      this.searchResult = '';
      this.dataSummary = '';
      this.clearMessages();
    },
    
    clearMessages() {
      this.errorMessage = '';
    },
    
    formatMarkdown(text) {
      // Simple markdown formatting for display
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    }
  }
};
