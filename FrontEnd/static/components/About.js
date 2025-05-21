const About = {
    template: `
    <div class="about-page bg-dark text-light pb-5">
      <div class="container pt-5">
        <div class="row mb-5">
          <div class="col-12 text-center">
            <h2 class="fw-bold text-success mb-2"><i class="fa-solid fa-robot me-2"></i>About GoodWillAI Team</h2>
            <p class="lead mx-auto" style="max-width: 700px;">
              We are a passionate duo from IITM BS, building intelligent agent solutions for the Syngenta AI Agent Hackathon 2025. Our mission: empower supply chain professionals with secure, conversational AI.
            </p>
          </div>
        </div>

        <div class="row mb-5 g-4">
          <!-- Sanjay B -->
          <div class="col-md-6">
            <div class="card bg-black border-0 shadow-lg rounded-4 h-100 p-4">
              <div class="d-flex align-items-center mb-3">
                <img src="/static/sanjay-avatar.png" alt="Sanjay B" class="rounded-circle me-3" style="width:60px; height:60px; object-fit:cover; border:2px solid #00ffe0;">
                <div>
                  <h3 class="fw-bold mb-0 text-success">Sanjay B</h3>
                  <div class="text-secondary small">Chennai, Tamil Nadu</div>
                </div>
              </div>
              <p class="mb-1"><strong>Education:</strong> BSc Health Sciences (University of the People), MScFE (WorldQuant), Data Science (IITM BS)</p>
              <p class="mb-1"><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/sanjay-b-data-analyst/" target="_blank" class="text-success">linkedin.com/in/sanjay-b-data-analyst</a></p>
              <p class="mb-1"><strong>GitHub:</strong> <a href="https://github.com/22f1001023" target="_blank" class="text-success">github.com/22f1001023</a></p>
              <p class="mb-1"><strong>Emails:</strong> 
                <a href="mailto:22f3001023@ds.study.iitm.ac.in" class="text-success">22f3001023@ds.study.iitm.ac.in</a>, 
                <a href="mailto:sanjaybdatascientist@gmail.com" class="text-success">sanjaybdatascientist@gmail.com</a>
              </p>
              <div class="mt-3" style="font-size: 0.97rem;">
                Balancing dual degrees in Data Science and Health Science alongside a full-time job since 18, Sanjay has developed strong skills in data analysis, statistical modeling, and programming. With over three years in banking and finance, he excels in leadership and customer-centric sales, combining technical expertise with real-world problem-solving.
              </div>
              <div class="fst-italic text-info mt-3">"If something holds you back, burn them with your wings of fire."</div>
            </div>
          </div>

          <!-- Aditya Nupani -->
          <div class="col-md-6">
            <div class="card bg-black border-0 shadow-lg rounded-4 h-100 p-4">
              <div class="d-flex align-items-center mb-3">
                <img src="/static/aditya-avatar.png" alt="Aditya Nupani" class="rounded-circle me-3" style="width:60px; height:60px; object-fit:cover; border:2px solid #00ffe0;">
                <div>
                  <h3 class="fw-bold mb-0 text-success">Aditya Nupani</h3>
                  <div class="text-secondary small">Kolkata, West Bengal</div>
                </div>
              </div>
              <p class="mb-1"><strong>Education:</strong> BTech CSE (Other College), Data Science (IITM BS)</p>
              <p class="mb-1"><strong>Email:</strong> <a href="mailto:23f1000873@ds.study.iitm.ac.in" class="text-success">23f1000873@ds.study.iitm.ac.in</a></p>
              <div class="mt-3" style="font-size: 0.97rem;">
                Aditya is pursuing his degree at IITMBS with a background in Computer Science. He brings technical skills and fresh perspectives to the GoodWillAI project, contributing to the development of intelligent AI agents for supply chain management.
              </div>
            </div>
          </div>
        </div>

        <div class="row pt-4">
          <div class="col-12 text-center">
            <h4 class="fw-bold text-success mb-3">Our Hackathon Vision</h4>
            <p class="mx-auto" style="max-width: 700px;">
              GoodWillAI is designed for the Syngenta AI Agent Hackathon 2025. We aim to build an agent that can answer natural language queries about supply chain documents and data, enforce robust access control, and deliver actionable business insights for every user role.
            </p>
            <div class="mt-4">
              <router-link to="/register" class="btn btn-lg fw-bold" style="background: linear-gradient(90deg,#00ffe0 0%,#007cf0 100%); color:#111;">
                Join GoodWillAI
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};
