#!/bin/bash

set -euo pipefail

TERRAFORM_DIR=${1:-"terraform/aws"}
BUDGET_THRESHOLD=${2:-"1000"}
OUTPUT_FORMAT=${3:-"json"}

check_infracost() {
    if ! command -v infracost &> /dev/null; then
        echo "Installing Infracost..."
        curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh
    fi
}

run_cost_analysis() {
    local terraform_dir="$1"
    local output_file="infracost-report.${OUTPUT_FORMAT}"
    
    echo "Running Infracost analysis on: $terraform_dir"
    
    cd "$terraform_dir"
    
    infracost breakdown \
        --path . \
        --format "$OUTPUT_FORMAT" \
        --out-file "$output_file"
    
    echo "Cost analysis saved to: $output_file"
    
    if [[ "$OUTPUT_FORMAT" == "json" ]]; then
        local total_cost
        total_cost=$(jq -r '.totalMonthlyCost // "0"' "$output_file")
        
        echo "Estimated monthly cost: \$${total_cost}"
        
        if (( $(echo "$total_cost > $BUDGET_THRESHOLD" | bc -l) )); then
            echo "⚠️  WARNING: Estimated cost (\$${total_cost}) exceeds budget threshold (\$${BUDGET_THRESHOLD})"
            exit 1
        else
            echo "✅ Cost estimate within budget threshold"
        fi
    fi
}

generate_cost_report() {
    local terraform_dir="$1"
    
    cat > cost-report.md << EOF

- **Terraform Directory**: $terraform_dir
- **Analysis Date**: $(date)
- **Budget Threshold**: \$${BUDGET_THRESHOLD}

EOF
    
    if [[ -f "infracost-report.json" ]]; then
        echo "### Monthly Cost Estimate" >> cost-report.md
        jq -r '.totalMonthlyCost // "0"' infracost-report.json | xargs -I {} echo "**Total**: \${}" >> cost-report.md
        
        echo "" >> cost-report.md
        echo "### Resource Breakdown" >> cost-report.md
        jq -r '.projects[0].breakdown.resources[] | "- **\(.name)**: \$\(.monthlyCost // 0)"' infracost-report.json >> cost-report.md
    fi
    
    echo "Cost report generated: cost-report.md"
}

main() {
    check_infracost
    run_cost_analysis "$TERRAFORM_DIR"
    generate_cost_report "$TERRAFORM_DIR"
}

main "$@"
