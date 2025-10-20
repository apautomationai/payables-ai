# Payables API - AWS ECS Deployment

This directory contains the Express.js TypeScript API application with AWS ECS deployment configuration.

## Quick Start

### Prerequisites

1. AWS CLI configured with appropriate permissions
2. Docker installed
3. Node.js 22+ and pnpm
4. Git

### Setup

1. **Configure AWS credentials:**
   ```bash
   export AWS_ACCOUNT_ID=your-account-id
   export AWS_REGION=us-east-1
   ```

2. **Setup infrastructure:**
   ```bash
   chmod +x scripts/setup-infrastructure.sh
   ./scripts/setup-infrastructure.sh
   ```

3. **Build and push Docker image:**
   ```bash
   chmod +x scripts/build-and-push.sh
   ./scripts/build-and-push.sh
   ```

4. **Deploy to ECS:**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

## CI/CD Pipeline

### GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-api.yml`) that:

1. Runs tests and linting on pull requests
2. Builds and pushes Docker images to ECR on push to main/dev branches
3. Deploys to ECS automatically

### Required GitHub Secrets

Add these secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### AWS CodeBuild

The `buildspec.yml` file is configured for AWS CodeBuild to:

1. Build Docker images
2. Push to ECR
3. Generate deployment artifacts

## Infrastructure Components

### ECR Repository
- **Name:** `payables-api`
- **Region:** `us-east-1`
- **Scanning:** Enabled on push

### ECS Cluster
- **Name:** `payables-cluster`
- **Capacity Provider:** FARGATE
- **Launch Type:** Fargate

### ECS Service
- **Name:** `payables-api-service`
- **Task Definition:** `payables-api`
- **Desired Count:** 2 (configurable)

### IAM Roles
- `ecsTaskExecutionRole` - For ECS task execution
- `ecsTaskRole` - For application-level AWS permissions

### CloudWatch Logs
- **Log Group:** `/ecs/payables-api`

### AWS Secrets Manager
- `payables-api/database-url`
- `payables-api/jwt-secret`
- `payables-api/aws-access-key`
- `payables-api/aws-secret-key`

## Configuration

### Environment Variables

Copy `env.example` to create your environment configuration:

```bash
cp env.example .env
```

Update the values in `.env` file or set them in AWS Secrets Manager.

### ECS Task Definition

The `ecs-task-definition.json` file contains the ECS task definition. Update the following:

1. Replace `ACCOUNT_ID` with your AWS account ID
2. Update VPC, subnet, and security group configurations
3. Adjust CPU and memory allocation as needed
4. Update environment variables and secrets

## Deployment Options

### Manual Deployment

1. **Build and push:**
   ```bash
   ./scripts/build-and-push.sh
   ```

2. **Deploy:**
   ```bash
   ./scripts/deploy.sh
   ```

### Automated Deployment

The GitHub Actions workflow automatically deploys when you push to:
- `main` branch → Production environment
- `dev` branch → Staging environment

## Monitoring

### Health Checks

The application includes health check endpoints:
- `/health` - Basic health check
- Container health check configured in ECS task definition

### Logs

Application logs are sent to CloudWatch Logs:
- **Log Group:** `/ecs/payables-api`
- **Stream Prefix:** `ecs`

### Metrics

ECS automatically provides metrics for:
- CPU utilization
- Memory utilization
- Task count
- Service events

## Troubleshooting

### Common Issues

1. **Permission Denied:**
   - Ensure IAM roles have necessary permissions
   - Check ECR repository permissions

2. **Task Fails to Start:**
   - Check CloudWatch logs
   - Verify environment variables and secrets
   - Ensure security groups allow necessary traffic

3. **Service Unstable:**
   - Check health check configuration
   - Verify load balancer configuration
   - Review task definition resource allocation

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster payables-cluster --services payables-api-service

# View task logs
aws logs tail /ecs/payables-api --follow

# List ECR images
aws ecr list-images --repository-name payables-api

# Update service
aws ecs update-service --cluster payables-cluster --service payables-api-service --force-new-deployment
```

## Security Considerations

1. **Network Security:**
   - Use VPC with private subnets for tasks
   - Configure security groups with minimal required access
   - Use Application Load Balancer for public access

2. **Secrets Management:**
   - Store sensitive data in AWS Secrets Manager
   - Use IAM roles instead of access keys where possible
   - Enable ECR image scanning

3. **Container Security:**
   - Use non-root user in containers
   - Keep base images updated
   - Scan images for vulnerabilities

## Cost Optimization

1. **Resource Allocation:**
   - Right-size CPU and memory based on actual usage
   - Use Fargate Spot for non-critical workloads
   - Implement auto-scaling based on metrics

2. **Storage:**
   - Use EFS for shared storage if needed
   - Configure log retention policies
   - Clean up unused ECR images

## Support

For issues and questions:
1. Check CloudWatch logs first
2. Review ECS service events
3. Verify AWS resource configurations
4. Consult AWS documentation for ECS best practices
