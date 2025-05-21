const Footer = {
    template: `
    <footer class="mt-5 pt-5 pb-3 bg-black text-light" style="border-top: 2px solid #00ffe0; box-shadow: 0 -2px 24px #00ffe033;">
      <div class="container">
        <div class="row align-items-start">
          <div class="col-md-4 mb-4">
            <h5 class="fw-bold mb-3" style="color:#00ffe0;">
              <i class="fa-solid fa-robot me-2"></i>GoodWillAI
            </h5>
            <p class="small text-secondary" style="max-width: 340px;">
              Futuristic AI agent platform for supply chain intelligence.<br>
              Secure, conversational, and enterprise-ready.
            </p>
          </div>
          <div class="col-md-4 mb-4">
            <h6 class="fw-semibold mb-3" style="color:#00ffe0;">Quick Links</h6>
            <ul class="list-unstyled">
              <li class="mb-2"><router-link to="/" class="text-light text-decoration-none">Home</router-link></li>
              <li class="mb-2"><router-link to="/about" class="text-light text-decoration-none">About</router-link></li>
              <li class="mb-2"><router-link to="/login" class="text-light text-decoration-none">Login</router-link></li>
              <li class="mb-2"><router-link to="/register" class="text-light text-decoration-none">Register</router-link></li>
            </ul>
          </div>
          <div class="col-md-4 mb-4">
            <h6 class="fw-semibold mb-3" style="color:#00ffe0;">Connect</h6>
            <div class="mb-2">
              <a href="mailto:22f3001023@ds.study.iitm.ac.in" class="text-light me-3" aria-label="Email 1">
                <i class="fas fa-envelope fa-lg"></i>
              </a>
              <a href="mailto:sanjaybdatascientist@gmail.com" class="text-light me-3" aria-label="Email 2">
                <i class="fas fa-envelope-open-text fa-lg"></i>
              </a>
              <a href="mailto:23f1000873@ds.study.iitm.ac.in" class="text-light me-3" aria-label="Email 3">
                <i class="fas fa-paper-plane fa-lg"></i>
              </a>
            </div>
            <div class="mb-2">
              <a href="https://github.com/22f1001023" target="_blank" class="text-light me-3" aria-label="GitHub">
                <i class="fab fa-github fa-lg"></i>
              </a>
              <a href="https://www.linkedin.com/in/sanjay-b-data-analyst/" target="_blank" class="text-light me-3" aria-label="LinkedIn">
                <i class="fab fa-linkedin fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
        <hr style="border-color: #00ffe0; opacity:0.3;">
        <div class="text-center small text-secondary mt-2">
          <span>
            Developed by <span style="color:#00ffe0;">Sanjay B</span> &middot; 
            &copy; 2025 GoodWillAI. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  `
};
