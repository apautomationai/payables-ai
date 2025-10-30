#!/bin/bash

# Deploy script for AWS ECS
set -e

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
ECR_REPOSITORY=${ECR_REPOSITORY:-sledge-api}
ECS_CLUSTER=${ECS_CLUSTER:-sledge-cluster}
ECS_SERVICE=${ECS_SERVICE:-sledge-api-service}
TASK_DEFINITION=${TASK_DEFINITION:-sledge-api}
CONTAINER_NAME=${CONTAINER_NAME:-sledge-api}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment process...${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
if ! command_exists aws; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

# Get the latest image tag from ECR
echo -e "${YELLOW}Getting latest image tag from ECR...${NC}"
LATEST_IMAGE=$(aws ecr describe-images \
    --repository-name $ECR_REPOSITORY \
    --region $AWS_REGION \
    --query 'imageDetails[0].imageTags[0]' \
    --output text)

if [ "$LATEST_IMAGE" = "None" ] || [ -z "$LATEST_IMAGE" ]; then
    echo -e "${RED}Error: No images found in ECR repository${NC}"
    exit 1
fi

echo -e "${GREEN}Latest image tag: $LATEST_IMAGE${NC}"

# Get current task definition
echo -e "${YELLOW}Getting current task definition...${NC}"
aws ecs describe-task-definition \
    --task-definition $TASK_DEFINITION \
    --region $AWS_REGION \
    --query taskDefinition > current-task-definition.json

# Update image URI in task definition
echo -e "${YELLOW}Updating task definition with new image...${NC}"
NEW_IMAGE_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$LATEST_IMAGE"

# Update the image URI using jq
jq --arg IMAGE_URI "$NEW_IMAGE_URI" \
   --arg CONTAINER_NAME "$CONTAINER_NAME" \
   '.containerDefinitions[] |= if .name == $CONTAINER_NAME then .image = $IMAGE_URI else . end' \
   current-task-definition.json > updated-task-definition.json

# Remove unnecessary fields for new task definition
jq 'del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .placementConstraints, .compatibilities, .registeredAt, .registeredBy)' \
   updated-task-definition.json > new-task-definition.json

# Register new task definition
echo -e "${YELLOW}Registering new task definition...${NC}"
NEW_TASK_DEF_ARN=$(aws ecs register-task-definition \
    --cli-input-json file://new-task-definition.json \
    --region $AWS_REGION \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)

echo -e "${GREEN}New task definition registered: $NEW_TASK_DEF_ARN${NC}"

# Update ECS service
echo -e "${YELLOW}Updating ECS service...${NC}"
aws ecs update-service \
    --cluster $ECS_CLUSTER \
    --service $ECS_SERVICE \
    --task-definition $NEW_TASK_DEF_ARN \
    --region $AWS_REGION \
    --force-new-deployment

echo -e "${GREEN}Service update initiated${NC}"

# Wait for service to stabilize
echo -e "${YELLOW}Waiting for service to stabilize...${NC}"
aws ecs wait services-stable \
    --cluster $ECS_CLUSTER \
    --services $ECS_SERVICE \
    --region $AWS_REGION

echo -e "${GREEN}Service is stable${NC}"

# Get service status
echo -e "${YELLOW}Getting service status...${NC}"
aws ecs describe-services \
    --cluster $ECS_CLUSTER \
    --services $ECS_SERVICE \
    --region $AWS_REGION \
    --query 'services[0].deployments[0].{status:status,runningCount:runningCount,pendingCount:pendingCount,desiredCount:desiredCount}'

# Cleanup temporary files
rm -f current-task-definition.json updated-task-definition.json new-task-definition.json

echo -e "${GREEN}Deployment completed successfully!${NC}"
