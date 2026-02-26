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

        stage('Setup Docker Tools') {
            steps {
                sh '''
                    # Install docker-compose
                    echo "Downloading docker-compose..."
                    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" -o docker-compose
                    chmod +x docker-compose
                    ./docker-compose version

                    # Install buildx plugin for docker
                    echo "Downloading docker buildx..."
                    mkdir -p ~/.docker/cli-plugins
                    curl -SL "https://github.com/docker/buildx/releases/latest/download/buildx-v0.12.1.linux-amd64" -o ~/.docker/cli-plugins/docker-buildx
                    chmod +x ~/.docker/cli-plugins/docker-buildx
                    docker buildx version
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
