## Development & Deployment

- **Local Development:** `npm run dev`
- **Build for Production:** `npm run build`
- **Preview build:** `npm run preview`

## Developer Onboarding Guide

### Prerequisites

- Node.js v18+
- npm
- Access to `.env` and API credentials

### Setup

```bash
git clone https://github.com/CloudDreamXX/Tolu-front-end.git
cd Tolu-front-end
npm install
npm run dev
```

### Git Branching Convention

- `master` → Production-ready code
- `dev` → Active development
- `feature/*` → New features
- `fix/*` → Bug fixes

### CI/CD Pipeline

- GitHub Actions: lint → test → build → deploy
- Staging deployment auto-triggers on `dev` merge
- Production deployment auto-triggers on `master` merge

## References

- [Frontend README](../README.md)
- [Backend API Documentation](https://search.vitai.health:8000/)