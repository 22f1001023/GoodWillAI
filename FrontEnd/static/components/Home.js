const Home = {
  template: `
    <div class="goodwillai-home bg-dark text-light min-vh-100">
      <div class="container py-5">
        <!-- Hero Section -->
        <div class="text-center mb-5">
          <img src="/static/logo.png" alt="GoodWillAI Logo" height="64" class="mb-3 goodwill-logo shadow-sm rounded-circle" />
          <h1 class="fw-bold display-5 mb-3" style="letter-spacing: 1px;">
            GoodWillAI: Intelligent Agents for Smarter Supply Chains
          </h1>
          <p class="lead mx-auto" style="max-width: 700px;">
            Unlock actionable insights from your documents and databases. GoodWillAI empowers supply chain professionals to ask complex business questions and get instant, secure answers—powered by advanced AI agents and robust access control.
          </p>
          <router-link to="/register" class="btn btn-lg btn-success fw-bold px-4 mt-3 shadow-sm">
            Get Started
          </router-link>
        </div>

        <!-- Key Capabilities Section -->
        <div class="row text-center mb-5">
          <div class="col-md-4 mb-4">
            <div class="card h-100 bg-secondary bg-opacity-10 border-0 shadow-sm">
              <div class="card-body">
                <i class="fa-solid fa-database feature-icon mb-3"></i>
                <h5 class="fw-bold">Data & Document Insights</h5>
                <p class="mb-0">Ask questions about your supply chain data and policies. Instantly retrieve and summarize the right information from both structured and unstructured sources.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100 bg-secondary bg-opacity-10 border-0 shadow-sm">
              <div class="card-body">
                <i class="fa-solid fa-user-shield feature-icon mb-3"></i>
                <h5 class="fw-bold">Role-Based Access Control</h5>
                <p class="mb-0">Enterprise-grade security ensures each user only accesses information relevant to their role and region. Admins manage approvals and monitor activity.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100 bg-secondary bg-opacity-10 border-0 shadow-sm">
              <div class="card-body">
                <i class="fa-solid fa-brain feature-icon mb-3"></i>
                <h5 class="fw-bold">Conversational AI Agent</h5>
                <p class="mb-0">Enjoy a seamless, chat-like interface for interacting with your data. The AI agent understands natural language and remembers context for smarter, faster answers.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Business Scenarios Section -->
        <div class="mb-5">
          <h3 class="fw-bold text-success mb-4 text-center">What Can You Ask GoodWillAI?</h3>
          <div class="row g-4">
            <div class="col-md-6">
              <div class="bg-secondary bg-opacity-10 rounded p-4 h-100 shadow-sm">
                <h5 class="fw-bold mb-2"><i class="fa-solid fa-file-lines me-2"></i>Document-Based Query</h5>
                <p class="mb-1">"What is our company policy on inventory write-offs?"</p>
                <small class="text-muted">GoodWillAI finds and summarizes the relevant policy section for you.</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="bg-secondary bg-opacity-10 rounded p-4 h-100 shadow-sm">
                <h5 class="fw-bold mb-2"><i class="fa-solid fa-database me-2"></i>Data-Based Query</h5>
                <p class="mb-1">"How much inventory do we currently have in the Southwest region?"</p>
                <small class="text-muted">GoodWillAI generates and runs the right data query, returning clear results.</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="bg-secondary bg-opacity-10 rounded p-4 h-100 shadow-sm">
                <h5 class="fw-bold mb-2"><i class="fa-solid fa-layer-group me-2"></i>Hybrid Query</h5>
                <p class="mb-1">"Which inventory items qualify as no-movers according to our policy, and how many do we currently have?"</p>
                <small class="text-muted">GoodWillAI combines document and data analysis for a complete answer.</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="bg-secondary bg-opacity-10 rounded p-4 h-100 shadow-sm">
                <h5 class="fw-bold mb-2"><i class="fa-solid fa-lock me-2"></i>Permission-Restricted Query</h5>
                <p class="mb-1">"Show me the profit margins for all products in Q1."</p>
                <small class="text-muted">Access is checked based on your role; sensitive data is protected.</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-5">
          <h4 class="fw-bold mb-3">Ready to revolutionize your supply chain intelligence?</h4>
          <router-link to="/register" class="btn btn-lg btn-success fw-bold px-4 shadow">Sign Up Now</router-link>
        </div>
      </div>
    </div>
  `
};
