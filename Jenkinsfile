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
                    export DOCKER_CLI_PLUGINS=~/.docker/cli-plugins
                    mkdir -p $DOCKER_CLI_PLUGINS
                    # The buildx releases are structured as buildx-v$VERSION.linux-$ARCH
                    curl -SL "https://github.com/docker/buildx/releases/download/v0.12.1/buildx-v0.12.1.linux-$(uname -m | sed 's/x86_64/amd64/')" -o $DOCKER_CLI_PLUGINS/docker-buildx
                    chmod +x $DOCKER_CLI_PLUGINS/docker-buildx
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
