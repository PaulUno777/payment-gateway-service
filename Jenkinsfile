
pipeline {
  agent any
  stages {
    stage('Checkout commit') {
      steps {
        git(url: 'https://github.com/PaulUno777/payment-gateway-service.git', branch: 'main')
      }
    }

    stage('Log projet contain') {
      steps {
        sh 'touch .env; ls -la'
      }
    }

    stage('Add env variables') {
      steps {
        withCredentials([file(credentialsId: 'payment_env', variable: 'FILE')]) {
          sh '''cp $FILE .env'''
          sh 'cat .env'
        }
      }
    }

    stage('Build app') {
      parallel {
        
        stage('Build app') {
          steps {
            sh 'docker build -t unoteck/kmx-payment-gateway .'
          }
        }
        
        stage('Log into Dockerhub') { 
          steps {
            withCredentials([usernamePassword(credentialsId: 'paulin_docker', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
               sh 'docker login -u $DOCKER_USER -p $DOCKER_PASSWORD'
            }
          }
        }
      }
    }

    stage('Deploy App') {
      steps {
        sh 'docker push unoteck/kmx-payment-gateway:latest'
      }
    }

    stage('Start App') {
      steps {
        sh 'docker rm --force --volumes kmx-payment-gateway'
        sh '''docker compose up --wait
'''
      }
    }

    stage('Get App Logs') {
      steps {
        sh 'docker container logs kmx-payment-gateway'
      }
    }

  }
}
