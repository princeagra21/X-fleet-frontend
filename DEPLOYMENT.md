# X-Fleet Frontend Deployment Guide

## 🚀 Automatic Deployment

This repository is configured with GitHub Actions for automatic deployment. When you push to the `main` branch, it will:

1. **Build** the Docker image
2. **Push** to Docker Hub registry
3. **Deploy** to the production server
4. **Health check** the deployment

## 🔧 Required GitHub Secrets

To enable automatic deployment, you need to configure these secrets in your GitHub repository:

### Setting up GitHub Secrets:
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add each of the following:

### Required Secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `DOCKER_USERNAME` | Your Docker Hub username | `princeagra21` |
| `DOCKER_PASSWORD` | Your Docker Hub password or access token | `your-docker-hub-password` |
| `SERVER_HOST` | Your server's IP address | `13.204.91.22` |
| `SERVER_USER` | SSH username for your server | `ubuntu` |
| `SERVER_SSH_KEY` | Private SSH key content | `-----BEGIN RSA PRIVATE KEY-----...` |

### 📝 Setting up SSH Key Secret:

For `SERVER_SSH_KEY`, you need to copy the content of your private key file:

**On Windows (PowerShell):**
```powershell
Get-Content "F:\Core Development\X-Fleet\zebrank.pem" | Out-String
```

**On Linux/Mac:**
```bash
cat ~/.ssh/your-private-key
```

Copy the entire output (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`) and paste it as the `SERVER_SSH_KEY` secret value.

## 🔄 Deployment Process

### Automatic Deployment (Recommended)
Simply push your changes to the `main` branch:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Manual Deployment
You can also trigger deployment manually:
1. Go to your GitHub repository
2. Navigate to **Actions** tab
3. Select "Deploy X-Fleet Frontend" workflow
4. Click **"Run workflow"** button

## 📊 Monitoring Deployment

After pushing to main, you can monitor the deployment:

1. Go to the **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Monitor the progress of each step:
   - ✅ Build and push Docker image
   - ✅ Deploy to server
   - ✅ Health check

## 🏗️ Architecture

```
GitHub Push → GitHub Actions → Docker Hub → Production Server
     ↓              ↓              ↓              ↓
   main branch → Build Image → Store Image → Deploy Container
```

## 🚨 Troubleshooting

### Common Issues:

1. **Docker Hub Authentication Failed**
   - Check `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
   - Ensure Docker Hub credentials are correct

2. **SSH Connection Failed**
   - Verify `SERVER_HOST`, `SERVER_USER`, and `SERVER_SSH_KEY`
   - Ensure the SSH key has proper permissions on the server

3. **Container Failed to Start**
   - Check the workflow logs for detailed error messages
   - Verify the Docker image was built successfully

4. **Health Check Failed**
   - Ensure port 80 is available on the server
   - Check if the container is running: `docker ps`

### Viewing Logs:
```bash
# On your server, view container logs:
docker logs x-fleet-frontend

# View all running containers:
docker ps
```

## 🌐 Access Your Application

After successful deployment:
- **Frontend**: http://13.204.91.22 (Port 80)
- **Backend API**: http://13.204.91.22:3001 (Port 3001)

## 📋 Manual Server Commands

If you need to manually manage the deployment on the server:

```bash
# SSH into the server
ssh -i zebrank.pem ubuntu@13.204.91.22

# Pull latest image
docker pull princeagra21/x-fleet-frontend:latest

# Stop and remove existing container
docker stop x-fleet-frontend
docker rm x-fleet-frontend

# Run new container
docker run -d --name x-fleet-frontend -p 80:3000 --restart unless-stopped princeagra21/x-fleet-frontend:latest

# Check status
docker ps
```
