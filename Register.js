const Register = {
    template: `
    <div class="container d-flex align-items-center justify-content-center min-vh-100 bg-dark">
      <div class="row w-100">
        <div class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
          <img src="/static/ai-register-hero.png" alt="AI Agent Register" class="img-fluid rounded-4 shadow-lg" style="max-height: 420px; filter: brightness(0.9) drop-shadow(0 0 30px #00ffea88);" />
        </div>
        <div class="col-lg-6 d-flex align-items-center justify-content-center">
          <div class="card p-4 bg-black text-light shadow-lg" style="width: 100%; max-width: 420px; border-radius: 18px; border: 1px solid #222;">
            <div class="text-center mb-3">
              <i class="fa-solid fa-user-plus fa-2x mb-2" style="color: #00ffe0;"></i>
              <h2 class="fw-bold mb-1" style="letter-spacing:1px;">Register for GoodWillAI</h2>
              <div class="text-secondary small mb-2">Join as a supply chain professional</div>
            </div>
            <form @submit.prevent="register" autocomplete="off">
              <div class="mb-3">
                <label for="username" class="form-label text-muted">Username</label>
                <input type="text" class="form-control bg-dark text-light border-0 border-bottom" id="username" v-model="username" placeholder="Choose a username" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label text-muted">Email</label>
                <input type="email" class="form-control bg-dark text-light border-0 border-bottom" id="email" v-model="email" placeholder="Enter your email" required>
              </div>
              <div class="mb-3">
                <label for="role" class="form-label text-muted">Register as</label>
                <select class="form-select bg-dark text-light border-0 border-bottom" id="role" v-model="role" required>
                  <option disabled value="">Select your role</option>
                  <option>Higher Officials</option>
                  <option>Finance Team</option>
                  <option>Planning Team</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label text-muted">Password</label>
                <input type="password" class="form-control bg-dark text-light border-0 border-bottom" id="password" v-model="password" placeholder="Create a password" required>
              </div>
              <div class="mb-3">
                <label for="confirm_password" class="form-label text-muted">Confirm Password</label>
                <input type="password" class="form-control bg-dark text-light border-0 border-bottom" id="confirm_password" v-model="confirm_password" placeholder="Re-enter your password" required>
              </div>
              <button type="submit" class="btn w-100 fw-bold" style="background: linear-gradient(90deg, #00ffe0 0%, #007cf0 100%); color: #111;">
                <i class="fa-solid fa-user-plus me-2"></i>Register
              </button>
            </form>
            <div v-if="successMessage" class="alert alert-success mt-3 py-2 text-center" style="font-size: 0.95rem;">
              {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="alert alert-danger mt-3 py-2 text-center" style="font-size: 0.95rem;">
              {{ errorMessage }}
            </div>
            <div class="text-center mt-4 text-secondary">
              <span>Already have an account?</span>
              <router-link to="/login" class="fw-bold" style="color:#00ffe0;">Login</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    data() {
        return {
            username: '',
            email: '',
            role: '',
            password: '',
            confirm_password: '',
            errorMessage: '',
            successMessage: ''
        };
    },
    methods: {
        async register() {
            this.errorMessage = '';
            this.successMessage = '';
            // Basic validation
            if (!this.username || !this.email || !this.role || !this.password || !this.confirm_password) {
                this.errorMessage = 'Please fill in all fields.';
                return;
            }
            if (this.password !== this.confirm_password) {
                this.errorMessage = 'Passwords do not match.';
                return;
            }
            // Allowed roles only
            const allowedRoles = ['Higher Officials', 'Finance Team', 'Planning Team'];
            if (!allowedRoles.includes(this.role)) {
                this.errorMessage = 'Invalid role selection.';
                return;
            }
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        email: this.email,
                        role: this.role,
                        password: this.password,
                        confirm_password: this.confirm_password
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    this.errorMessage = data.error || 'Registration failed. Please try again.';
                } else {
                    this.successMessage = data.message || 'Registration successful! Waiting for admin approval.';
                    // Optionally, clear form fields
                    this.username = '';
                    this.email = '';
                    this.role = '';
                    this.password = '';
                    this.confirm_password = '';
                }
            } catch (err) {
                this.errorMessage = 'Server error. Please try again later.';
            }
        }
    }
};
