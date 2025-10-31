#!/bin/bash

# ============================ Jenkins installation ============================

set -eou pipefail

# defined variables
SUDO="sudo"

echo " 🚀 Installation of Jenkins started"
echo ""

# Update ubuntu
echo " 🛠️ Updating and upgrading Ubuntu packages..."
$SUDO apt update
$SUDO apt -y upgrade
echo ""

# Install Java (open JDK) for Jenkins
echo " 📦 Installing OpenJDK 21..."
$SUDO apt install fontconfig openjdk-21-jre -y
echo "Java Version:"
java -version
echo ""

# Add Jenkins repository and key
echo " 🔑 Adding Jenkins repository and key..."
$SUDO wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo ""

# Add Jenkins repository
echo " 📦 Adding Jenkins repository..."
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | $SUDO tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
echo ""

# Install Jenkins
echo " ✅ Installing Jenkins..."
$SUDO apt install -y jenkins
echo ""

# Start Jenkins service
echo " 🔄 Starting Jenkins service..."
$SUDO systemctl start jenkins
echo ""

# Enable Jenkins to start at boot
echo " 🔧 Enabling Jenkins to start at boot..."
$SUDO systemctl enable jenkins
echo ""

# Check Jenkins status
echo " 🔍 Checking Jenkins status..."
$SUDO systemctl status jenkins
echo ""

# Allow non-root users to run Jenkins commands
$SUDO chmod 777 /var/run/jenkins.sock

# Add user to the Jenkins group
$SUDO usermod -aG jenkins $USER && newgrp jenkins

echo " 🎉 Jenkins installation completed."
echo "Jenkins version:"
$SUDO jenkins --version


# For running the script

# Make the Script Executable:    chmod +x jenkins_install.sh
# Run the Script                 ./jenkins_install.sh


# ================================== end of script ===============================