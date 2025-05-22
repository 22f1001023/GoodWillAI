const AdminDashboard = {
    template: `
    <div class="admin-dashboard bg-dark text-light min-vh-100 py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h1 class="fw-bold display-4" style="letter-spacing:1px;">
            <i class="fa-solid fa-shield-halved me-2" style="color:#00ffe0;"></i>GoodWillAI Admin Dashboard
          </h1>
          <p class="lead text-secondary mx-auto" style="max-width: 700px;">
            Manage users, monitor statistics, and keep your AI agent platform secure and efficient.
          </p>
        </div>

        <!-- Statistics Section -->
        <div class="row g-4 mb-5">
          <div class="col-md-3">
            <div class="card bg-black border-0 shadow-lg text-center p-4" style="border-top: 3px solid #00ffe0;">
              <div class="mb-2"><i class="fa-solid fa-users fa-2x" style="color:#00ffe0;"></i></div>
              <h2 class="fw-bold mb-1" style="color:#00ffe0;">{{ stats.total_active_users }}</h2>
              <div class="text-secondary">Active Users</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-black border-0 shadow-lg text-center p-4" style="border-top: 3px solid #ff2e63;">
              <div class="mb-2"><i class="fa-solid fa-user-clock fa-2x" style="color:#ff2e63;"></i></div>
              <h2 class="fw-bold mb-1" style="color:#ff2e63;">{{ stats.users_waiting_approval }}</h2>
              <div class="text-secondary">Pending Approvals</div>
            </div>
          </div>
          <div class="col-md-3" v-for="role in roleKeys" :key="role">
            <div class="card bg-black border-0 shadow-lg text-center p-4" style="border-top: 3px solid #00ffe0;">
              <div class="mb-2">
                <i v-if="role==='Finance Team'" class="fa-solid fa-coins fa-2x" style="color:#00ffe0;"></i>
                <i v-else-if="role==='Planning Team'" class="fa-solid fa-chart-line fa-2x" style="color:#00ffe0;"></i>
                <i v-else-if="role==='Higher Officials'" class="fa-solid fa-user-tie fa-2x" style="color:#00ffe0;"></i>
                <i v-else class="fa-solid fa-user fa-2x" style="color:#00ffe0;"></i>
              </div>
              <h2 class="fw-bold mb-1" style="color:#00ffe0;">{{ stats.role_statistics[role] || 0 }}</h2>
              <div class="text-secondary">{{ role }}</div>
            </div>
          </div>
        </div>

        <!-- Pending Users Table -->
        <div class="card bg-black border-0 shadow-lg mb-5" style="border-left: 4px solid #00ffe0;">
          <div class="card-header bg-transparent border-0">
            <h4 class="fw-bold mb-0" style="color:#00ffe0;"><i class="fa-solid fa-user-check me-2"></i>Users Awaiting Approval</h4>
          </div>
          <div class="card-body p-0">
            <div v-if="pendingUsers.length === 0" class="text-center text-secondary py-4">
              <i class="fa-solid fa-face-smile-beam fa-2x mb-2" style="color:#00ffe0;"></i><br>
              No users are waiting for approval.
            </div>
            <div v-else>
              <div class="table-responsive">
                <table class="table table-dark table-hover align-middle mb-0">
                  <thead>
                    <tr style="color:#00ffe0;">
                      <th>#</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th class="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(user, idx) in pendingUsers" :key="user.id">
                      <td>{{ idx + 1 }}</td>
                      <td>{{ user.username }}</td>
                      <td>{{ user.email }}</td>
                      <td>{{ user.role }}</td>
                      <td class="text-center">
                        <button class="btn btn-success btn-sm me-2" @click="approveUser(user.id)">
                          <i class="fa-solid fa-check"></i> Approve
                        </button>
                        <button class="btn btn-danger btn-sm" @click="rejectUser(user.id)">
                          <i class="fa-solid fa-times"></i> Reject
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Agent Business Scenarios Section -->
        <div class="row my-5">
          <div class="col-12">
            <h4 class="fw-bold mb-4" style="color:#00ffe0;"><i class="fa-solid fa-brain me-2"></i>What Can GoodWillAI Answer?</h4>
          </div>
          <div class="col-md-6 mb-3">
            <div class="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm">
              <div class="mb-2"><i class="fa-solid fa-file-lines fa-lg" style="color:#00ffe0;"></i></div>
              <div class="fw-bold">Document-Based Query</div>
              <div class="text-secondary small">
                "What is our company policy on inventory write-offs?"
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm">
              <div class="mb-2"><i class="fa-solid fa-database fa-lg" style="color:#00ffe0;"></i></div>
              <div class="fw-bold">Data-Based Query</div>
              <div class="text-secondary small">
                "How much inventory do we currently have in the Southwest region?"
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm">
              <div class="mb-2"><i class="fa-solid fa-layer-group fa-lg" style="color:#00ffe0;"></i></div>
              <div class="fw-bold">Hybrid Query</div>
              <div class="text-secondary small">
                "Which inventory items qualify as no-movers according to our policy, and how many do we currently have?"
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm">
              <div class="mb-2"><i class="fa-solid fa-lock fa-lg" style="color:#00ffe0;"></i></div>
              <div class="fw-bold">Permission-Restricted Query</div>
              <div class="text-secondary small">
                "Show me the profit margins for all products in Q1."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    data() {
        return {
            stats: {
                total_active_users: 0,
                users_waiting_approval: 0,
                role_statistics: {}
            },
            pendingUsers: [],
            roleKeys: ["Finance Team", "Planning Team", "Higher Officials"]
        };
    },
    created() {
        this.fetchStats();
        this.fetchPendingUsers();
    },
    methods: {
        async fetchStats() {
            try {
                const res = await fetch('/api/admin/stats', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('token')
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    this.stats = data;
                }
            } catch (err) {
                // handle error
            }
        },
        async fetchPendingUsers() {
            try {
                const res = await fetch('/api/admin/users', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('token')
                    }
                });
                if (res.ok) {
                    this.pendingUsers = await res.json();
                }
            } catch (err) {
                // handle error
            }
        },
        async approveUser(userId) {
            if (!confirm('Approve this user?')) return;
            try {
                const res = await fetch(`/api/admin/approve/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('token')
                    },
                    body: JSON.stringify({ action: 'approve' })
                });
                if (res.ok) {
                    this.fetchStats();
                    this.fetchPendingUsers();
                }
            } catch (err) {
                // handle error
            }
        },
        async rejectUser(userId) {
            if (!confirm('Reject and remove this user?')) return;
            try {
                const res = await fetch(`/api/admin/approve/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('token')
                    },
                    body: JSON.stringify({ action: 'reject' })
                });
                if (res.ok) {
                    this.fetchStats();
                    this.fetchPendingUsers();
                }
            } catch (err) {
                // handle error
            }
        }
    }
};
