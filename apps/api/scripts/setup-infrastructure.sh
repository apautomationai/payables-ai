#!/bin/bash

# Setup AWS infrastructure for ECS deployment
set -e

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
ECR_REPOSITORY=${ECR_REPOSITORY:-sledge-api}
ECS_CLUSTER=${ECS_CLUSTER:-sledge-cluster}
ECS_SERVICE=${ECS_SERVICE:-sledge-api-service}
TASK_DEFINITION=${TASK_DEFINITION:-sledge-api}
VPC_ID=${VPC_ID}
SUBNET_IDS=${SUBNET_IDS}
SECURITY_GROUP_ID=${SECURITY_GROUP_ID}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up AWS infrastructure...${NC}"

# Check prerequisites
if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo -e "${RED}Error: AWS_ACCOUNT_ID environment variable is not set${NC}"
    exit 1
fi

# Create ECR repository
echo -e "${YELLOW}Creating ECR repository...${NC}"
aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION 2>/dev/null || \
aws ecr create-repository \
    --repository-name $ECR_REPOSITORY \
    --region $AWS_REGION \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256

echo -e "${GREEN}ECR repository created/verified${NC}"

# Create CloudWatch log group
echo -e "${YELLOW}Creating CloudWatch log group...${NC}"
aws logs describe-log-groups --log-group-name-prefix "/ecs/$ECR_REPOSITORY" --region $AWS_REGION 2>/dev/null || \
aws logs create-log-group \
    --log-group-name "/ecs/$ECR_REPOSITORY" \
    --region $AWS_REGION

echo -e "${GREEN}CloudWatch log group created/verified${NC}"

# Create ECS cluster
echo -e "${YELLOW}Creating ECS cluster...${NC}"
aws ecs describe-clusters --clusters $ECS_CLUSTER --region $AWS_REGION 2>/dev/null || \
aws ecs create-cluster \
    --cluster-name $ECS_CLUSTER \
    --region $AWS_REGION \
    --capacity-providers FARGATE \
    --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1

echo -e "${GREEN}ECS cluster created/verified${NC}"

# Create IAM roles if they don't exist
echo -e "${YELLOW}Creating IAM roles...${NC}"

# ECS Task Execution Role
aws iam get-role --role-name ecsTaskExecutionRole --region $AWS_REGION 2>/dev/null || {
    echo -e "${YELLOW}Creating ECS Task Execution Role...${NC}"
    aws iam create-role \
        --role-name ecsTaskExecutionRole \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "ecs-tasks.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }'
    
    aws iam attach-role-policy \
        --role-name ecsTaskExecutionRole \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
}

# ECS Task Role
aws iam get-role --role-name ecsTaskRole --region $AWS_REGION 2>/dev/null || {
    echo -e "${YELLOW}Creating ECS Task Role...${NC}"
    aws iam create-role \
        --role-name ecsTaskRole \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "ecs-tasks.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }'
}

echo -e "${GREEN}IAM roles created/verified${NC}"

# Create secrets in AWS Secrets Manager (optional)
echo -e "${YELLOW}Creating secrets in AWS Secrets Manager...${NC}"
echo -e "${YELLOW}Note: You'll need to set the actual secret values manually${NC}"

# Database URL secret
aws secretsmanager describe-secret --secret-id "sledge-api/database-url" --region $AWS_REGION 2>/dev/null || \
aws secretsmanager create-secret \
    --name "sledge-api/database-url" \
    --description "Database connection URL for sledge API" \
    --secret-string "postgresql://username:password@hostname:5432/database" \
    --region $AWS_REGION

# JWT Secret
aws secretsmanager describe-secret --secret-id "Sledge-api/jwt-secret" --region $AWS_REGION 2>/dev/null || \
aws secretsmanager create-secret \
    --name "sledge-api/jwt-secret" \
    --description "JWT secret for Sledge API" \
    --secret-string "your-jwt-secret-here" \
    --region $AWS_REGION

echo -e "${GREEN}Secrets created/verified${NC}"

echo -e "${GREEN}Infrastructure setup completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "${YELLOW}1. Update the secret values in AWS Secrets Manager${NC}"
echo -e "${YELLOW}2. Update the ECS task definition with your VPC, subnet, and security group IDs${NC}"
echo -e "${YELLOW}3. Create an Application Load Balancer if needed${NC}"
echo -e "${YELLOW}4. Run the build and deploy scripts${NC}"
