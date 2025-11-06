pipeline {
    // Define the agent to run the pipeline
    agent any

    // Define environment variables
    environment {
        DOCKERHUB  = "kvedansh786"
        DOCKERHUB_CREDENTIALS = credentials("dockerhub-credentials")
        AWS_CREDENTIALS = credentials("aws-credentials")
        SONAR_HOME = tool "Sonar"
        BACKEND_IMAGE = "${DOCKERHUB}/travelmania-backend:${params.BACKEND_DOCKER_TAG}"
        Projectname = "Travelmania-backend"
        ProjectKey = "Travelmania-backend"
    }

    // Define input parameters
    parameters {
        string(name: 'BACKEND_DOCKER_TAG', defaultValue: '', description: 'Setting docker image for latest push')
    }

    // Define the stages of the pipeline
    stages {
        stage("Validate parameters"){
            steps {
                script{
                    if(params.BACKEND_DOCKER_TAG == ""){
                        error("BACKEND_DOCKER_TAG must be provided!")
                    }
                }
            }
        }
        stage("Workspace cleanup"){
            steps {
                cleanWs()
            }
        }
        stage("Git : Code Checkout"){
            steps {
                echo "Cloning the repository"
                git url: "https://github.com/Vedansh134/Travelmania-project.git", branch: "main"
                echo "Repository cloned successfully"
            }
        }
        stage("Trivy : FileSystem Scan"){
            steps {
                script {
                    echo "Performing Trivy FileSystem Scan"
                    sh "trivy fs ."
                    echo "Trivy FileSystem Scan completed"
                }
            }
        }
        stage("OWASP : Dependency check"){
            steps {
                echo "Performing OWASP Dependency check"
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'OWASP'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                echo "OWASP Dependency check completed"
            }
        }
        stage("Sonarqube : Code Analysis"){
            steps {
                echo "Performing Sonarqube Code Analysis"
                withSonarQubeEnv("${SonarQubeAPI}")
                {
                    sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=${Projectname} -Dsonar.projectKey=${ProjectKey} -X"
                }
            }
        }
        stage("Sonarqube : Code quality gates"){
            steps{
                echo "Checking Sonarqube Quality Gates"
                timeout(time: 1, unit: "MINUTES")
                {
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        stage("Docker : Build Image"){
            steps {
                echo "Building the Docker image"
                // Ensure docker-compose.yml builds travelmania-backend as travelmania-backend
                sh "docker-compose -f docker-compose.yml up -d --build"
                echo "Docker image built successfully"
            }
        }
        stage("Docker : Push Image to Dockerhub"){
            steps {
                echo "Pushing Docker image to Dockerhub"
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS' )])
                {
                    // Login to Dockerhub
                    sh "echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin"

                    // Tag and push the backend image
                    sh "docker tag travelmania-backend:latest ${BACKEND_IMAGE}"
                    sh "docker push ${BACKEND_IMAGE}"

                    echo "Docker image pushed to Dockerhub successfully"
                }
            }
        }
        stage("Automatic deployment to the cloud : AWS EKS"){
            steps {
                    echo "Deploying application to AWS EKS"

                    // Use AWS credentials stored in Jenkins
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY',
                        credentialsId: 'aws-cred'
                    ]])
                    {
                        // Verify AWS credentials by getting the caller identity
                        sh 'aws sts get-caller-identity'

                        // Update kubeconfig to interact with the EKS cluster
                        sh ('aws eks update-kubeconfig --name python-flaskapp --region ap-south-1 ')

                        // Apply Kubernetes manifests to deploy the application
                        sh 'kubectl apply -f kubernetes/namespace.yaml'
                        sh 'kubectl apply -f kubernetes/backend-deployment.yaml'
                        sh 'kubectl apply -f kubernetes/backend-service.yaml'
                        sh 'kubectl apply -f kubernetes/mongodb-deployment.yaml'
                        sh 'kubectl apply -f kubernetes/mongodb-service.yaml'
                        sh 'kubectl apply -f kubernetes/mongodb-pv.yml'
                        sh 'kubectl apply -f kubernetes/mongodb-pvc.yml'

                        // Verify deployment by listing namespaces
                        sh "kubectl get ns"

                        // update the backend deployment with the new image
                        sh "kubectl set image deployment/travelmania-backend travelmania-backend=${BACKEND_IMAGE} -n travelmania"
                    }
            }
        }
    }

    // Define post actions : success and failure
    post {
        success {
            script {
                emailext attachLog: true,
                from: 'kumarvedansh134@gmail.com',
                subject: "Jenkins Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' Succeeded",
                body: """
                <html>
                    <body>
                        <div style="background-color: #FFA07A; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">Project: ${env.JOB_NAME}</p>
                        </div>
                        <div style="background-color: #90EE90; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">Build Number: ${env.BUILD_NUMBER}</p>
                        </div>
                        <div style="background-color: #87CEEB; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">URL: ${env.BUILD_URL}</p>
                        </div>
                    </body>
                    </html>
                """,
                to: 'kumarvedansh134@gmail.com',
                mimeType: 'text/html'
            }
        }
        failure {
            script {
                emailext attachLog: true,
                from: 'vedansh.kumar134@gmail.com',
                subject: "MongoShop Application build failed - '${currentBuild.result}'",
                body: """
                    <html>
                    <body>
                        <div style="background-color: #FFA07A; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">Project: ${env.JOB_NAME}</p>
                        </div>
                        <div style="background-color: #90EE90; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">Build Number: ${env.BUILD_NUMBER}</p>
                        </div>
                    </body>
                    </html>
                    """,
                    to: 'vedansh.kumar134@gmail.com',
                    mimeType: 'text/html'
            }
        }
    }
}