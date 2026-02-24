#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🌊 AquaPure Backend - Quick Start Setup 🌊 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"

# Check if Python is installed
echo -e "\n${YELLOW}Checking prerequisites...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python 3 found${NC}"

# Navigate to backend directory
cd "$(dirname "$0")/backend" || exit

echo -e "\n${YELLOW}Setting up Python virtual environment...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${GREEN}✅ Virtual environment already exists${NC}"
fi

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi
echo -e "${GREEN}✅ Virtual environment activated${NC}"

# Install requirements
echo -e "\n${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Check for .env file
echo -e "\n${YELLOW}Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo -e "Please create .env file from .env.example"
    echo -e "At minimum, set MONGODB_URI"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env from .env.example${NC}"
    echo -e "${YELLOW}📝 Please edit .env with your configuration${NC}"
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

# Run health check
echo -e "\n${YELLOW}Running health check...${NC}"
python3 health_check.py

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Health check failed${NC}"
    echo -e "Please check your .env configuration"
    exit 1
fi

# Offer to seed database
echo -e "\n${YELLOW}Would you like to seed demo products? (y/n)${NC}"
read -r SEED_OPTION
if [[ "$SEED_OPTION" == "y" || "$SEED_OPTION" == "Y" ]]; then
    echo -e "${YELLOW}Seeding demo data...${NC}"
    python3 seed_products.py
    echo -e "${GREEN}✅ Database seeded successfully${NC}"
fi

# Start server
echo -e "\n${YELLOW}Starting backend server...${NC}"
echo -e "${GREEN}✅ Server running at http://localhost:5000${NC}"
echo -e "${GREEN}✅ API docs at http://localhost:5000/docs${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}\n"

python3 main.py
