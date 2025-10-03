#!/bin/bash

set -euo pipefail

REPO=${GITHUB_REPOSITORY:-"RUSTEM003/Birlik"}
OUTPUT_FILE=${1:-"ossf-scorecard-results.json"}

run_scorecard() {
    echo "Running OSSF Scorecard for repository: $REPO"
    
    if ! command -v scorecard &> /dev/null; then
        echo "Installing OSSF Scorecard..."
        go install github.com/ossf/scorecard/v4/cmd/scorecard@latest
    fi
    
    scorecard \
        --repo="github.com/$REPO" \
        --format=json \
        --output-file="$OUTPUT_FILE"
    
    echo "Scorecard results saved to: $OUTPUT_FILE"
}

analyze_results() {
    local results_file="$1"
    
    if [[ ! -f "$results_file" ]]; then
        echo "Error: Results file not found: $results_file"
        return 1
    fi
    
    echo "OSSF Scorecard Analysis:"
    echo "========================"
    
    local overall_score
    overall_score=$(jq -r '.score' "$results_file")
    echo "Overall Score: $overall_score/10"
    
    echo ""
    echo "Check Results:"
    echo "--------------"
    
    jq -r '.checks[] | "\(.name): \(.score)/10 - \(.reason)"' "$results_file"
    
    echo ""
    echo "Recommendations:"
    echo "----------------"
    
    jq -r '.checks[] | select(.score < 7) | "⚠️  \(.name): \(.documentation.short)"' "$results_file"
}

generate_badge() {
    local results_file="$1"
    local score
    score=$(jq -r '.score' "$results_file")
    
    local color="red"
    if (( $(echo "$score >= 7" | bc -l) )); then
        color="green"
    elif (( $(echo "$score >= 5" | bc -l) )); then
        color="yellow"
    fi
    
    local badge_url="https://img.shields.io/badge/OSSF%20Scorecard-${score}%2F10-${color}"
    echo "Badge URL: $badge_url"
    
    cat > ossf-scorecard-badge.md << EOF
[![OSSF Scorecard](${badge_url})](https://github.com/ossf/scorecard)
EOF
    
    echo "Badge markdown saved to: ossf-scorecard-badge.md"
}

main() {
    run_scorecard
    analyze_results "$OUTPUT_FILE"
    generate_badge "$OUTPUT_FILE"
    
    echo ""
    echo "OSSF Scorecard analysis complete!"
}

main "$@"
