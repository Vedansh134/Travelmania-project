#!/bin/bash

# ================================== Install Jenkins via shell script ==============================
# Version: 1.0
# Date: 02-11-2025
# Author: Vedansh kumar
# Description: With the help of this shell script we can automate the installation process of Jenkins
# ==================================================================================================

# for testing used set -eou pipefail
set -eou pipefail

# define variables
SUDO='sudo'

# Update ubuntu system
echo "Update ubuntu system..."
$SUDO apt update

echo " 🚀 Installation of Jenkins started"
echo ""

# Update ubuntu
echo " 🛠️ Updating and upgrading Ubuntu packages..."
$SUDO apt update
$SUDO apt -y upgrade
echo ""

# Install Java (open JDK) for Jenkins
install_java(){
  if command -v java >/dev/null 2>&1; then
    echo "Java is already installed."
    java -version
    echo ""
  else
    echo "Java is not Installed.📦 Installing JDK..."
    $SUDO apt install fontconfig openjdk-21-jre -y
    echo "Java Version : $(java -version)"
    echo ""
  fi
}

# Install Jenkins
install_jenkins(){
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

  # Update ubuntu
  $SUDO apt update

  # Install Jenkins
  if command -v jenkins >/dev/null 2>&1; then
    echo "Jenkins is already installed."
    jenkins --version
    echo ""
  else
    echo " ✅ Installing Jenkins..."
    $SUDO apt install -y jenkins
    echo ""
  fi
}

# Call the install_java and install_jenkins function
install_java
install_jenkins


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