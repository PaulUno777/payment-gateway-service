pipeline {
  agent any
  stages {
    stage('Checkout commit') {
      steps {
        git(url: 'https://github.com/PaulUno777/payment-gateway-service.git', branch: 'main', credentialsId: 'paulin_github')
      }
    }

    stage('Log projet contain') {
      steps {
        sh 'touch .env;'
      }
    }

    stage('Add env variables') {
      steps {
        withCredentials(bindings: [file(credentialsId: 'payment_env', variable: 'FILE')]) {
          sh 'cp $FILE .env'
          sh 'cat .env'
        }
      }
    }

    stage('Build app') {
      parallel {
        stage('Build app') {
          steps {
            sh 'docker build -t unoteck/kmx-payment-gateway .'
            sh 'ls -la'
          }
        }

        stage('Log into Dockerhub') {
          steps {
            withCredentials(bindings: [usernamePassword(credentialsId: 'paulin_dokerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
              sh 'docker login -u $DOCKER_USER -p $DOCKER_PASSWORD'
            }

          }
        }

      }
    }

    stage('Deploy App') {
      steps {
        sh 'docker push unoteck/kmx-payment-gateway:dev'
      }
    }

    stage('Start App') {
      steps {
        withCredentials(bindings: [file(credentialsId: 'payment_env', variable: 'FILE')]) {
          sh 'cp $FILE .env'
          sh 'cat .env'
          sh 'ls -la'
          sh 'docker rm --force --volumes kmx-payment-gateway'
          sh '''docker compose up --wait'''
        }
      }
    }

    stage('Get App Logs') {
      steps {
        sh 'ls -la'
        sh 'docker container logs kmx-payment-gateway'
      }
    }

  }
}
