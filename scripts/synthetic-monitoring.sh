#!/bin/bash

set -euo pipefail

NAMESPACE=${NAMESPACE:-"observability"}
MONITORING_NAMESPACE=${MONITORING_NAMESPACE:-"monitoring"}

install_k6_operator() {
    echo "Installing k6 Operator..."
    
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
    
    kubectl apply -f https://github.com/grafana/k6-operator/releases/latest/download/bundle.yaml
    
    echo "k6 Operator installed successfully"
}

create_synthetic_tests() {
    echo "Creating synthetic monitoring tests..."
    
    cat << EOF | kubectl apply -f -
apiVersion: k6.io/v1alpha1
kind: K6
metadata:
  name: agi-portal-api-test
  namespace: ${NAMESPACE}
spec:
  parallelism: 2
  script:
    configMap:
      name: agi-portal-api-test
      file: test.js
  arguments: --out influxdb=http://influxdb:8086/k6
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: agi-portal-api-test
  namespace: ${NAMESPACE}
data:
  test.js: |
    import http from 'k6/http';
    import { check, sleep } from 'k6';
    import { Rate } from 'k6/metrics';

    export let errorRate = new Rate('errors');

    export let options = {
      stages: [
        { duration: '2m', target: 10 },
        { duration: '5m', target: 10 },
        { duration: '2m', target: 20 },
        { duration: '5m', target: 20 },
        { duration: '2m', target: 0 },
      ],
      thresholds: {
        http_req_duration: ['p(99)<1500'],
        errors: ['rate<0.1'],
      },
    };

    const BASE_URL = 'http://agi-portal-backend.agi-portal.svc.cluster.local:8000';

    export default function () {
      let response = http.get(\`\${BASE_URL}/health\`);
      check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
      }) || errorRate.add(1);

      response = http.get(\`\${BASE_URL}/api/agi-portal/capabilities\`);
      check(response, {
        'capabilities endpoint works': (r) => r.status === 200,
        'response contains capabilities': (r) => r.body.includes('capabilities'),
      }) || errorRate.add(1);

      response = http.get(\`\${BASE_URL}/api/live-demos/status\`);
      check(response, {
        'live demos status works': (r) => r.status === 200,
      }) || errorRate.add(1);

      sleep(1);
    }
---
apiVersion: k6.io/v1alpha1
kind: K6
metadata:
  name: agi-portal-frontend-test
  namespace: ${NAMESPACE}
spec:
  parallelism: 1
  script:
    configMap:
      name: agi-portal-frontend-test
      file: frontend-test.js
  arguments: --out influxdb=http://influxdb:8086/k6
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: agi-portal-frontend-test
  namespace: ${NAMESPACE}
data:
  frontend-test.js: |
    import http from 'k6/http';
    import { check, sleep } from 'k6';
    import { Rate } from 'k6/metrics';

    export let errorRate = new Rate('errors');

    export let options = {
      stages: [
        { duration: '1m', target: 5 },
        { duration: '3m', target: 5 },
        { duration: '1m', target: 0 },
      ],
      thresholds: {
        http_req_duration: ['p(95)<2000'],
        errors: ['rate<0.05'],
      },
    };

    const BASE_URL = 'http://agi-portal-frontend.agi-portal.svc.cluster.local:3000';

    export default function () {
      let response = http.get(BASE_URL);
      check(response, {
        'frontend loads': (r) => r.status === 200,
        'contains AGI Portal': (r) => r.body.includes('AGI Portal') || r.body.includes('agi-portal'),
        'loads in reasonable time': (r) => r.timings.duration < 2000,
      }) || errorRate.add(1);

      response = http.get(\`\${BASE_URL}/agi-portal\`);
      check(response, {
        'AGI Portal page loads': (r) => r.status === 200,
      }) || errorRate.add(1);

      response = http.get(\`\${BASE_URL}/live-demo-arena\`);
      check(response, {
        'Live Demo Arena loads': (r) => r.status === 200,
      }) || errorRate.add(1);

      sleep(2);
    }
---
apiVersion: k6.io/v1alpha1
kind: K6
metadata:
  name: agi-portal-ai-gateway-test
  namespace: ${NAMESPACE}
spec:
  parallelism: 1
  script:
    configMap:
      name: agi-portal-ai-gateway-test
      file: ai-gateway-test.js
  arguments: --out influxdb=http://influxdb:8086/k6
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: agi-portal-ai-gateway-test
  namespace: ${NAMESPACE}
data:
  ai-gateway-test.js: |
    import http from 'k6/http';
    import { check, sleep } from 'k6';
    import { Rate } from 'k6/metrics';

    export let errorRate = new Rate('errors');

    export let options = {
      stages: [
        { duration: '1m', target: 2 },
        { duration: '2m', target: 2 },
        { duration: '1m', target: 0 },
      ],
      thresholds: {
        http_req_duration: ['p(95)<10000'],
        errors: ['rate<0.1'],
      },
    };

    const BASE_URL = 'http://agi-portal-backend.agi-portal.svc.cluster.local:8000';
    const AUTH_TOKEN = 'test-token';

    export default function () {
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${AUTH_TOKEN}\`,
      };

      let payload = JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello, this is a test message' }
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 50
      });

      let response = http.post(\`\${BASE_URL}/api/ai/chat\`, payload, { headers });
      check(response, {
        'AI Gateway responds': (r) => r.status === 200 || r.status === 401,
        'response time acceptable': (r) => r.timings.duration < 10000,
      }) || errorRate.add(1);

      response = http.get(\`\${BASE_URL}/api/ai/providers\`, { headers });
      check(response, {
        'providers endpoint works': (r) => r.status === 200 || r.status === 401,
      }) || errorRate.add(1);

      sleep(5);
    }
EOF
    
    echo "Synthetic tests created successfully"
}

create_test_schedule() {
    echo "Creating test schedule..."
    
    cat << EOF | kubectl apply -f -
apiVersion: batch/v1
kind: CronJob
metadata:
  name: agi-portal-synthetic-tests
  namespace: ${NAMESPACE}
spec:
  schedule: "*/15 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: k6-runner
            image: grafana/k6:latest
            command:
            - /bin/sh
            - -c
            - |
              echo "Running synthetic tests..."
              kubectl apply -f /tests/agi-portal-api-test.yaml
              kubectl apply -f /tests/agi-portal-frontend-test.yaml
              sleep 300
              kubectl delete k6 agi-portal-api-test agi-portal-frontend-test || true
            volumeMounts:
            - name: test-configs
              mountPath: /tests
          volumes:
          - name: test-configs
            configMap:
              name: synthetic-test-configs
          restartPolicy: OnFailure
          serviceAccountName: k6-runner
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: k6-runner
  namespace: ${NAMESPACE}
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: k6-runner
rules:
- apiGroups: ["k6.io"]
  resources: ["k6s"]
  verbs: ["create", "delete", "get", "list", "patch", "update", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: k6-runner
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: k6-runner
subjects:
- kind: ServiceAccount
  name: k6-runner
  namespace: ${NAMESPACE}
EOF
    
    echo "Test schedule created successfully"
}

main() {
    echo "Setting up Synthetic Monitoring with k6..."
    
    install_k6_operator
    create_synthetic_tests
    create_test_schedule
    
    echo "Synthetic Monitoring setup complete!"
    echo ""
    echo "Verify installation:"
    echo "kubectl get k6 -n ${NAMESPACE}"
    echo "kubectl get cronjobs -n ${NAMESPACE}"
}

main "$@"
