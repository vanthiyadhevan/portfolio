pipeline {
    angent any

    environment {
        USER_NAME = 'vanthiyadevan'
        IMAGE_NAME = 'portfolio'

    }
    stages {
        stage('Install Depentencies') {
            steps {
                sh 'npm install -g @angular/cli'
            }
        }

        stage('Build Docker image') {
            steps {
                sh "docker build -t ${USER_NAME}/${IMAGE_NAME}:${BUILD_ID} ."
            }
        }

        stage('Push Image to Repo') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'PASSWORD', usernameVariable: 'USER_NAME')]) {
                    sh 'docker push ${USER_NAME}/${IMAGE_NAME}:${BUILD_ID}'
                }
            }
        }

        stage('Update The Image Tag') {
            environment {
                GIT_USER_NAME = 'vanthiyadhevan'
                GIT_REPO_NAME = 'portfolio_k8s'
            }
            steps {
                sh '''
                git clone git@github.com:vanthiyadhevan/portfolio_k8s.git \
                cd portfolio_k8s/portfolio/ \
                sed -i "s/tag/${BUILD_ID}/g" ./values.yaml
                '''
                sh '''
                git add * \
                git commit -m "values.yaml changed ${BUILD_ID}" \
                git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main
                '''
            }
        }
    }
}