const FinanceDashboard = {
    template: `
    <div class="finance-dashboard bg-dark text-light min-vh-100 py-5">
      <div class="container">
        <div class="text-center mb-5">
          <i class="fa-solid fa-coins fa-3x mb-3" style="color:#00ffe0; filter: drop-shadow(0 0 8px #00ffe0cc);"></i>
          <h1 class="fw-bold display-5" style="letter-spacing:1px;">
            Welcome @{{ username }}
          </h1>
          <p class="lead text-secondary mx-auto" style="max-width: 700px;">
            Your personalized finance command center powered by GoodWillAI.
          </p>
        </div>

        <!-- Search Bar Section -->
        <div class="row justify-content-center mb-5">
          <div class="col-md-8">
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
                  placeholder="Ask a question about margins, costs, or financial policy..."
                  autofocus
                >
                <button type="submit" class="btn btn-primary px-4" style="border-radius: 0 2rem 2rem 0; background: linear-gradient(90deg, #00ffe0 0%, #007cf0 100%); border: none;">
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </form>
            <div v-if="searchResult" class="mt-4 p-4 bg-black rounded-4 shadow-sm border-start border-4" style="border-color:#00ffe0;">
              <div class="fw-bold mb-2 text-success">AI Agent Response</div>
              <div class="text-light">{{ searchResult }}</div>
            </div>
          </div>
        </div>

        <!-- Placeholder for future finance analytics or quick links -->
        <div class="row mt-5">
          <div class="col-md-12 text-center">
            <h4 class="fw-bold mb-3" style="color:#00ffe0;"><i class="fa-solid fa-lightbulb me-2"></i>Sample Questions</h4>
            <div class="d-inline-block text-start">
              <ul class="list-unstyled text-secondary">
                <li class="mb-2"><i class="fa-solid fa-circle-dot me-2 text-primary"></i>What is the profit margin for Q1?</li>
                <li class="mb-2"><i class="fa-solid fa-circle-dot me-2 text-primary"></i>Show me cost breakdowns by region.</li>
                <li class="mb-2"><i class="fa-solid fa-circle-dot me-2 text-primary"></i>Which products have the highest margin?</li>
                <li class="mb-2"><i class="fa-solid fa-circle-dot me-2 text-primary"></i>How do our expenses compare to last year?</li>
              </ul>
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
            searchResult: ''
        };
    },
    created() {
        // Get username from localStorage (set at login)
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            this.username = user && user.username ? user.username : 'FinanceUser';
        } catch {
            this.username = 'FinanceUser';
        }
    },
    methods: {
        onSearch() {
            // Placeholder for future AI agent integration
            if (!this.query.trim()) {
                this.searchResult = '';
                return;
            }
            // Simulate AI response for now
            this.searchResult = `🔮 (AI agent will answer: "${this.query}")`;
            this.query = '';
        }
    }
};
