# AI-Powered GitHub Pull Request Reviewer

An automated code review platform that plugs into GitHub. It uses AI to analyze pull requests, flag bugs, security vulnerabilities, performance issues and code quality problems, and post actionable suggestions directly in the PR.

It's built with **Spring Boot, Next.js, PostgreSQL, GitHub Apps and an LLM service**. The platform runs the whole review lifecycle, from connecting a repository to posting AI-generated review comments.

## Key Features

- **GitHub integration:** GitHub OAuth sign-in plus GitHub App installation to connect repositories.
- **Automated PR reviews:** GitHub webhooks trigger a review when a pull request is `opened`, `reopened` or `synchronize`d (updated).
- **Asynchronous job queue:** a database-backed job queue. A scheduled worker picks up queued reviews every 5 seconds and processes them in the background.
- **AI code analysis:** finds bugs, security risks, performance bottlenecks and maintainability issues in the changed code.
- **Inline GitHub comments:** posts feedback on the relevant lines through GitHub's Pull Request Review API.
- **Diff-aware validation:** checks each line the AI references against the PR diff, so no inline comment lands on an invalid line.
- **Review dashboard:** repository management, review history, job status tracking, detailed findings and AI-generated summaries.
- **Secure multi-user design:** JWT authentication in HttpOnly cookies, with user-scoped APIs.

## Architecture

```
GitHub ──webhook──▶ Spring Boot backend ──▶ PostgreSQL (review_job queue)
                          │                         │
                          │◀── scheduled worker ────┘
                          │
                          ├──▶ AI service (FastAPI + Hugging Face LLM)
                          │
                          └──▶ GitHub API (fetch PR files, post review comments)

Next.js frontend ──REST (JWT cookie)──▶ Spring Boot backend
```

| Directory | Service | Default port |
|---|---|---|
| [spring-backend/backend](spring-backend/backend) | Spring Boot API, webhooks, job worker, GitHub integration | 8080 |
| [ai-service](ai-service) | FastAPI service that runs the LLM review | 8000 |
| [frontend/frontend](frontend/frontend) | Next.js dashboard | 3000 |

## Tech Stack

Java 21, Spring Boot, Spring Security, Hibernate/JPA, PostgreSQL, Next.js, React, TypeScript, Python, FastAPI, Hugging Face Inference, GitHub REST API, GitHub Apps and webhooks.

## Getting Started

### Prerequisites

- Java 21, Node.js 20+, Python 3.10+, PostgreSQL
- A GitHub OAuth App and a GitHub App, with a webhook pointing to `<backend-url>/api/github/webhook` and **Pull requests** read & write permission
- A Hugging Face access token

### 1. Database

```bash
createdb ai_code_reviewer
```

Hibernate creates the tables on first run.

### 2. AI service

Create `ai-service/.env`:

```env
HF_TOKEN=your_hugging_face_token
HF_MODEL=Qwen/Qwen2.5-Coder-7B-Instruct   # optional, this is the default
HF_PROVIDER=nscale                         # optional, this is the default
```

```bash
cd ai-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000
```

### 3. Backend

Fill in `spring-backend/backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ai_code_reviewer
spring.datasource.username=
spring.datasource.password=
server.port=8080

ai.service.url=http://localhost:8000/review

github.app.id=
github.app.client-id=
github.app.client-secret=
github.app.private-key-path=/path/to/private-key-pkcs8.pem
github.webhook.secret=

github.oauth.client-id=
github.oauth.client-secret=
github.oauth.redirect-uri=http://localhost:8080/api/auth/github/callback

app.jwt.secret=
app.jwt.expiration-ms=
```

The GitHub App private key has to be in PKCS#8 format:

```bash
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt \
  -in private-key.pem -out private-key-pkcs8.pem
```

```bash
cd spring-backend/backend
./mvnw spring-boot:run
```

To receive webhooks locally, expose port 8080 with a tunnel such as `ngrok http 8080` and set the GitHub App webhook URL to the tunnel address.

### 4. Frontend

Create `frontend/frontend/.env`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
SPRING_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_oauth_client_id
NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:8080/api/auth/github/callback
```

```bash
cd frontend/frontend
npm install
npm run dev
```

Open http://localhost:3000, sign in with GitHub, install the GitHub App, then connect a repository. From then on, opening or pushing to a pull request in that repository triggers an AI review.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/auth/github/callback` | GitHub OAuth callback, sets the JWT cookie |
| GET | `/api/auth/me` | Current user |
| POST | `/api/auth/logout` | Clear the session |
| GET | `/api/repositories/user` | The user's connected repositories |
| GET | `/api/repositories/github/user` | Repositories the GitHub App can access |
| POST | `/api/repositories/connect` | Connect a repository after installing the app |
| GET | `/api/review-jobs/repository` | Review jobs for a repository |
| GET | `/api/review-jobs/{id}` | Review job details and findings |
| POST | `/api/github/webhook` | GitHub webhook receiver |

## Security Notes

- Never commit `.env` files, `application.properties` secrets or `.pem` keys. `.gitignore` already excludes `.env` and `*.pem`.
- Webhook payloads are verified with `github.webhook.secret`.
