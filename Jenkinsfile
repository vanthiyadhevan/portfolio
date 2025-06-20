pipeline {
    agent any

    environment {
        USER_NAME = 'vanthiyadevan'
        IMAGE_NAME = 'portfolio'
    }

    stages {

        stage('Install Dependencies') {
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
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                    sh '''
                        echo "${PASSWORD}" | docker login -u "${DOCKER_USER}" --password-stdin
                        docker push ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_ID}
                    '''
                }
            }
        }

        stage('Update The Image Tag in Git') {
            environment {
                GIT_USER_NAME = 'vanthiyadhevan'
                GIT_REPO_NAME = 'portfolio_k8s'
            }
            steps {
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                        rm -rf portfolio_k8s
                        git clone https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git
                        cd ${GIT_REPO_NAME}/portfolio
                        sed -i "s/tag:.*/tag: '${BUILD_ID}'/" values.yaml

                        git config user.email "jenkins@yourdomain.com"
                        git config user.name "Jenkins"
                        git add values.yaml
                        git commit -m "Updated image tag to ${BUILD_ID}"
                        git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git HEAD:main
                    '''
                }
            }
        }
    }
}
