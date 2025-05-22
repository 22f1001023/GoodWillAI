const Login = {
  template: `
    <div class="container d-flex align-items-center justify-content-center min-vh-100 bg-dark">
      <div class="row w-100">
        <div class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
          <img src="/static/ai-login-hero.png" alt="AI Agent Login" class="img-fluid rounded-4 shadow-lg" style="max-height: 420px; filter: brightness(0.9) drop-shadow(0 0 30px #00ffea88);" />
        </div>
        <div class="col-lg-6 d-flex align-items-center justify-content-center">
          <div class="card p-4 bg-black text-light shadow-lg" style="width: 100%; max-width: 410px; border-radius: 18px; border: 1px solid #222;">
            <div class="text-center mb-3">
              <i class="fa-solid fa-robot fa-2x mb-2" style="color:rgb(239, 246, 245);"></i>
              <h2 class="fw-bold mb-1" style="letter-spacing:1px;">GoodWillAI Login</h2>
              <div class="text-secondary small mb-2">AI Agent for Smarter Supply Chains</div>
            </div>
            <form @submit.prevent="login" autocomplete="off">
<div class="mb-3">
  <label for="email" class="form-label text-muted" style="color: #fff !important;">Email</label>
  <input
    type="email"
    class="form-control bg-dark text-light border-0 border-bottom"
    id="email"
    v-model="email"
    placeholder="Enter your email"
    required
    autofocus
    style="background-color: #222; color: #fff; border: none; border-bottom: 1px solid #444;"
  >
</div>
<div class="mb-3">
  <label for="password" class="form-label text-muted" style="color: #fff !important;">Password</label>
  <input
    type="password"
    class="form-control bg-dark text-light border-0 border-bottom"
    id="password"
    v-model="password"
    placeholder="Enter your password"
    required
    style="background-color: #222; color: #fff; border: none; border-bottom: 1px solid #444;"
  >
</div>

              <button type="submit" class="btn w-100 fw-bold" style="background: linear-gradient(90deg, #00ffe0 0%, #007cf0 100%); color: #111;">
                <i class="fa-solid fa-right-to-bracket me-2"></i>Login
              </button>
            </form>
            <div v-if="errorMessage" class="alert alert-danger mt-3 py-2 text-center" style="font-size: 0.95rem;">
              {{ errorMessage }}
            </div>
            <div class="text-center mt-4 text-secondary">
              <span>Don't have an account?</span>
              <router-link to="/register" class="fw-bold" style="color:#00ffe0;">Register</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      this.errorMessage = '';
      if (!this.email || !this.password) {
        this.errorMessage = 'Please enter both email and password.';
        return;
      }
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        });
        const data = await response.json();
        if (!response.ok) {
          this.errorMessage = data.error || 'Login failed. Please try again.';
          return;
        }
        // Store token and user info for both session and token auth
        if (data.auth_token) {
          localStorage.setItem('token', data.auth_token);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect based on backend-provided URL
        if (data.redirect_url) {
          this.$router.push(data.redirect_url);
        } else {
          this.errorMessage = 'Login succeeded, but no redirect URL provided.';
        }
      } catch (err) {
        this.errorMessage = 'Server error. Please try again later.';
      }
    }
  }
};
