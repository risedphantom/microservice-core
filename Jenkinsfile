def node_version = '10.13.0'
def job_name = env.JOB_NAME.split('/')[0]

pipeline {
    agent {
      kubernetes {
        label "${job_name}_${node_version}"
        containerTemplate {
          name 'node'
          image "node:${node_version}"
          ttyEnabled true
          command 'cat'
        }
      }
    }

    stages {
        stage('Link libraries') {
          steps {
              sh """
              [ ! -d "/var/lib/GeoIP" ] && ln -s /cache/GeoIP /var/lib/
              """
          }
        }

        stage('Install dependencies') {
            steps {
                withCredentials([string(credentialsId: 'NPM_TOKEN', variable: 'NPM_TOKEN')]) {
                    sh """
                        node -e "console.log(process.version)" > n_version
                        npm config set //npm.twiket.com/repository/ott-node-modules/:_authToken=${NPM_TOKEN}
                        npm install --loglevel error
                    """
               }
           }
        }

        stage('Test') {
            steps {
              sh """
                npm test
              """
          }
        }

        stage('Linting') {
            steps {
              sh """
                npm run lint
              """
            }
        }

        stage('Check swagger') {
            steps {
              sh """
                npm run swagger
              """
            }
        }

        stage('Check exact') {
            steps {
              sh """
                ./node_modules/.bin/check-exact package.json
              """
            }
        }

        stage('Remove test dependencies') {
            steps {
              sh """
                  npm prune --production
                  echo "Final size: " && du -sh --exclude=.git --apparent-size
              """
            }
        }

        stage('Archive') {
            steps {
                sh """
                    git rev-parse HEAD > .git/commit-id
                    touch archive.tar.gz
                    tar -czf archive.tar.gz --exclude='./.*' --exclude=archive.tar.gz --exclude=Jenkinsfile .
                """
            }
        }

        stage('Upload') {
            steps {
                script {
                    def git_commit = readFile('.git/commit-id').trim()
                    withAWS(credentials:'s3-ott-build-artefacts', region:'eu-central-1') {
                        s3Upload(file:'archive.tar.gz', bucket:'ott-build-artefacts', path:"${job_name}/${git_commit}.tar.gz")
                    }
                }
            }
        }
    }
}
