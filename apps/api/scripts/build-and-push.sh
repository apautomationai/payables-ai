#!/bin/bash

# Build and push Docker image to ECR
set -e

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
ECR_REPOSITORY=${ECR_REPOSITORY:-payables-api}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting build and push process...${NC}"

# Check prerequisites
if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo -e "${RED}Error: AWS_ACCOUNT_ID environment variable is not set${NC}"
    exit 1
fi

# Get commit hash for tagging
COMMIT_HASH=$(git rev-parse --short HEAD)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo -e "${YELLOW}Building Docker image...${NC}"
echo -e "${YELLOW}Commit hash: $COMMIT_HASH${NC}"
echo -e "${YELLOW}Timestamp: $TIMESTAMP${NC}"

# Navigate to API directory
cd "$(dirname "$0")/.."

# Build Docker image
docker build -t $ECR_REPOSITORY:$COMMIT_HASH .
docker build -t $ECR_REPOSITORY:latest .
docker build -t $ECR_REPOSITORY:$TIMESTAMP .

echo -e "${GREEN}Docker image built successfully${NC}"

# Login to ECR
echo -e "${YELLOW}Logging in to Amazon ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Tag images for ECR
echo -e "${YELLOW}Tagging images for ECR...${NC}"
docker tag $ECR_REPOSITORY:$COMMIT_HASH $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$COMMIT_HASH
docker tag $ECR_REPOSITORY:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest
docker tag $ECR_REPOSITORY:$TIMESTAMP $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$TIMESTAMP

# Push images to ECR
echo -e "${YELLOW}Pushing images to ECR...${NC}"
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$COMMIT_HASH
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$TIMESTAMP

echo -e "${GREEN}Images pushed successfully!${NC}"
echo -e "${GREEN}Image URI: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$COMMIT_HASH${NC}"
echo -e "${GREEN}Latest URI: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest${NC}"
