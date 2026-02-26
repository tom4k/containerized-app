pipeline {
    agent any
    
    // Define environment variables if needed
    environment {
        // Use a locally downloaded docker-compose binary
        DOCKER_COMPOSE_CMD = './docker-compose'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Docker Compose') {
            steps {
                // Download docker-compose binary directly into the workspace
                sh '''
                    echo "Downloading docker-compose..."
                    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" -o docker-compose
                    chmod +x docker-compose
                    ./docker-compose version
                '''
            }
        }

        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:20-alpine'
                    // Run node container with same UID as jenkins to avoid permission issues in workspace
                    args '-v HOME=/tmp'
                }
            }
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
             agent {
                docker {
                    image 'node:20-alpine'
                    args '-v HOME=/tmp'
                }
            }
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '${DOCKER_COMPOSE_CMD} build'
            }
        }

        stage('Deploy') {
            steps {
                sh '${DOCKER_COMPOSE_CMD} up -d'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
            // Clean up workspace if necessary
            // cleanWs()
        }
        success {
            echo 'Build and Test succeeded!'
        }
        failure {
            echo 'Build or Test failed.'
        }
    }
}
