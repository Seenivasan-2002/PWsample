pipeline {
    agent any

    // Name must match Manage Jenkins -> Tools -> NodeJS
    tools {
        nodejs 'node-lts'
    }

    environment {
        CI = 'true'
        PLAYWRIGHT_JUNIT_OUTPUT_NAME = 'junit-results.xml'
    }

    stages {
        stage('Install') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install chromium'
            }
        }

        stage('Test') {
            steps {
                bat 'npx playwright test --reporter=html,junit'
            }
        }
    }

    post {
        always {
            junit testResults: 'junit-results.xml', allowEmptyResults: true
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
