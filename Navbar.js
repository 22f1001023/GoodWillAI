const Navbar = {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm" style="background: linear-gradient(90deg, #16171d 60%, #1e293b 100%);">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center fs-4" href="/">
          <i class="fa-solid fa-robot goodwill-logo me-2"></i>
          <span class="fw-bold" style="letter-spacing:1px;">GoodWillAI</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item mx-2">
              <router-link class="nav-link text-white fw-semibold" to="/">Home</router-link>
            </li>
            <li class="nav-item mx-2">
              <router-link class="nav-link text-white fw-semibold" to="/about">About</router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item mx-2">
              <router-link class="nav-link text-white fw-semibold" to="/login">Login</router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item mx-2">
              <router-link class="nav-link text-white fw-semibold" to="/register">Register</router-link>
            </li>
            <li v-if="isAuthenticated" class="nav-item mx-2">
              <button @click="logout" class="btn btn-outline-light btn-sm fw-bold px-3">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
    computed: {
        isAuthenticated() {
            // Check for token or session (adjust as per your auth logic)
            return !!localStorage.getItem('token');
        }
    },
    methods: {
        logout() {
            // Adjust endpoint if needed
            fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('token')
                }
            })
                .then(res => {
                    if (res.ok) {
                        localStorage.removeItem('token');
                        this.$router.push('/login');
                    } else {
                        alert('Logout failed!');
                    }
                })
                .catch(() => alert('Logout failed!'));
        }
    }
};
