#!/bin/bash

set -euo pipefail

REPO_URL=${GITHUB_SERVER_URL:-"https://github.com"}/${GITHUB_REPOSITORY:-""}
COMMIT_SHA=${GITHUB_SHA:-$(git rev-parse HEAD)}
BUILD_ID=${GITHUB_RUN_ID:-"local-$(date +%s)"}
ARTIFACT_PATH=${1:-""}

if [[ -z "$ARTIFACT_PATH" ]]; then
    echo "Usage: $0 <artifact_path>"
    exit 1
fi

generate_provenance() {
    local artifact_path="$1"
    local artifact_name
    artifact_name=$(basename "$artifact_path")
    
    local artifact_hash
    artifact_hash=$(sha256sum "$artifact_path" | cut -d' ' -f1)
    
    cat > "${artifact_path}.provenance.json" << EOF
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "https://slsa.dev/provenance/v0.2",
  "subject": [
    {
      "name": "$artifact_name",
      "digest": {
        "sha256": "$artifact_hash"
      }
    }
  ],
  "predicate": {
    "builder": {
      "id": "https://github.com/actions/runner"
    },
    "buildType": "https://github.com/actions/workflow",
    "invocation": {
      "configSource": {
        "uri": "$REPO_URL",
        "digest": {
          "sha1": "$COMMIT_SHA"
        },
        "entryPoint": ".github/workflows/"
      }
    },
    "metadata": {
      "buildInvocationId": "$BUILD_ID",
      "buildStartedOn": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
      "buildFinishedOn": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
      "completeness": {
        "parameters": true,
        "environment": false,
        "materials": false
      },
      "reproducible": false
    },
    "materials": [
      {
        "uri": "$REPO_URL",
        "digest": {
          "sha1": "$COMMIT_SHA"
        }
      }
    ]
  }
}
EOF

    echo "SLSA provenance generated: ${artifact_path}.provenance.json"
}

sign_provenance() {
    local provenance_file="$1"
    
    if command -v cosign &> /dev/null; then
        echo "Signing provenance with cosign..."
        cosign sign-blob --bundle="${provenance_file}.bundle" "$provenance_file"
        echo "Provenance signed: ${provenance_file}.bundle"
    else
        echo "Warning: cosign not found, skipping signature"
    fi
}

main() {
    local artifact_path="$1"
    
    if [[ ! -f "$artifact_path" ]]; then
        echo "Error: Artifact not found: $artifact_path"
        exit 1
    fi
    
    echo "Generating SLSA provenance for: $artifact_path"
    generate_provenance "$artifact_path"
    sign_provenance "${artifact_path}.provenance.json"
    
    echo "SLSA provenance generation complete"
}

main "$@"
