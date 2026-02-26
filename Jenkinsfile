pipeline {
    agent any
    
    // Define environment variables if needed
    environment {
        // Use standard docker compose cli instead of standalone binary 
        DOCKER_COMPOSE_CMD = 'docker-compose'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
