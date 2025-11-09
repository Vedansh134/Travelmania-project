#!/bin/bash

# ================================== Install docker via shell script ==============================
# Version: 1.0
# Date: 30-10-2025
# Author: Vedansh kumar
# Description: With the help of this shell script we can automate the installation process of docker
# ==================================================================================================

# for testing used set -eou pipefail
set -eou pipefail

# define variables
SUDO='sudo'

# Update ubuntu system
echo "Update ubuntu system..."
$SUDO apt update

# Install Docker function
install_docker(){
    if command -v docker >/dev/null 2>&1;then
        echo "Docker is already Installed"
    else
        echo "Docker is not installed, Start Installing docker..."
        $SUDO apt-get install docker.io -y
    fi
}

# Call the install_docker function
install_docker

# Start and enable docker service
echo "Start and enable docker service..."
$SUDO systemctl start docker
$SUDO systemctl enable docker

# Allow non root to access docker command
echo "Allow non-root users to run Docker commands..."
$SUDO chmod 777 var/run/docker.sock

# Allow users to Docker group
echo "Adding user to Docker group..."
$SUDO usermod -aG docker $USER && newgrp docker

# Check docker version
$SUDO docker --version
echo "Docker installation completed successfully."

# ============================== end of script ======================================