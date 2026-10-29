pipeline {
    agent any

    // Tools: names must match Manage Jenkins -> Tools
    tools {
        nodejs 'node-lts'
    }

    // Triggers: uncomment the block and pick what you need
    // (githubPush needs the GitHub webhook set up)
    // triggers {
    //     githubPush()                 // run on every push to GitHub
    //     pollSCM('H/5 * * * *')       // fallback: check GitHub every ~5 minutes
    //     cron('H 9 * * 1-5')          // scheduled: weekdays around 9 AM
    // }

    environment {
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\pw-browsers"
        PLAYWRIGHT_JUNIT_OUTPUT_NAME = 'junit-results.xml'
    }

    options {
        skipDefaultCheckout()
        disableConcurrentBuilds()
        timeout(time: 60, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'node -v'
                bat 'npm ci'
            }
        }

        stage('Install browsers') {
            steps {
                bat 'npx playwright install chromium'
            }
        }

        stage('Run tests') {
            steps {
                bat 'npx playwright test --reporter=html,junit,allure-playwright'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**, allure-results/**', allowEmptyArchive: true

            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])

            script {
                def t = junit(testResults: 'junit-results.xml', allowEmptyResults: true)
                def total   = t?.totalCount ?: 0
                def passed  = t?.passCount  ?: 0
                def failed  = t?.failCount  ?: 0
                def skipped = t?.skipCount  ?: 0
                def status  = currentBuild.currentResult
                def colour  = (status == 'SUCCESS') ? '#1a7f37' : '#cf222e'

                emailext(
                    to: '$DEFAULT_RECIPIENTS',
                    subject: "${env.JOB_NAME} #${env.BUILD_NUMBER} - ${status} (${passed}/${total} passed)",
                    mimeType: 'text/html',
                    attachmentsPattern: 'playwright-report/index.html',
                    body: """
                        <h2 style="color:${colour}">Playwright run: ${status}</h2>
                        <table border="1" cellpadding="6" style="border-collapse:collapse">
                            <tr><th>Total</th><th>Passed</th><th>Failed</th><th>Skipped</th></tr>
                            <tr><td>${total}</td><td>${passed}</td><td>${failed}</td><td>${skipped}</td></tr>
                        </table>
                        <p>Build: <a href="${env.BUILD_URL}">${env.JOB_NAME} #${env.BUILD_NUMBER}</a></p>
                        <p>Full report (with videos): <a href="${env.BUILD_URL}Playwright_20Report/">Playwright Report</a></p>
                        <p>The HTML report is attached - download it and open it in a browser.</p>
                    """
                )
            }
        }
    }
}
