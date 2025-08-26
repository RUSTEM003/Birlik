#!/bin/bash

set -euo pipefail

create_dependabot_config() {
    mkdir -p .github
    
    cat > .github/dependabot.yml << EOF
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/backend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    reviewers:
      - "RUSTEM003"
    assignees:
      - "RUSTEM003"
    commit-message:
      prefix: "deps"
      include: "scope"
    
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    reviewers:
      - "RUSTEM003"
    assignees:
      - "RUSTEM003"
    commit-message:
      prefix: "deps"
      include: "scope"
    
  - package-ecosystem: "npm"
    directory: "/contracts"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 3
    reviewers:
      - "RUSTEM003"
    assignees:
      - "RUSTEM003"
    commit-message:
      prefix: "deps"
      include: "scope"
    
  - package-ecosystem: "terraform"
    directory: "/terraform/aws"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 3
    reviewers:
      - "RUSTEM003"
    assignees:
      - "RUSTEM003"
    commit-message:
      prefix: "terraform"
      include: "scope"
    
  - package-ecosystem: "docker"
    directory: "/backend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 2
    reviewers:
      - "RUSTEM003"
    assignees:
      - "RUSTEM003"
    commit-message:
      prefix: "docker"
      include: "scope"
    
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 2
    reviewers:
      - "RUSTEM003"
    assignees:
      - "RUSTEM003"
    commit-message:
      prefix: "ci"
      include: "scope"
EOF
    
    echo "Dependabot configuration created: .github/dependabot.yml"
}

create_renovate_config() {
    cat > renovate.json << EOF
{
  "\$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:base",
    "security:openssf-scorecard"
  ],
  "schedule": ["before 6am on monday"],
  "timezone": "UTC",
  "assignees": ["RUSTEM003"],
  "reviewers": ["RUSTEM003"],
  "packageRules": [
    {
      "matchPackagePatterns": ["^@openzeppelin/"],
      "groupName": "OpenZeppelin packages",
      "schedule": ["before 6am on monday"]
    },
    {
      "matchPackagePatterns": ["^@nomicfoundation/"],
      "groupName": "Hardhat packages",
      "schedule": ["before 6am on monday"]
    },
    {
      "matchDatasources": ["terraform-provider"],
      "groupName": "Terraform providers",
      "schedule": ["before 6am on monday"]
    },
    {
      "matchDatasources": ["terraform-module"],
      "groupName": "Terraform modules",
      "schedule": ["before 6am on monday"]
    }
  ],
  "vulnerabilityAlerts": {
    "enabled": true
  },
  "osvVulnerabilityAlerts": true,
  "commitMessagePrefix": "deps: ",
  "prTitle": "deps: {{depName}} {{#if isPinDigest}}{{{newDigestShort}}}{{else}}{{#if isMajor}}{{prettyNewMajor}}{{else}}{{#if isSingleVersion}}{{prettyNewVersion}}{{else}}{{#if newValue}}{{{newValue}}}{{else}}{{{newDigestShort}}}{{/if}}{{/if}}{{/if}}{{/if}}",
  "prConcurrentLimit": 10,
  "branchConcurrentLimit": 5
}
EOF
    
    echo "Renovate configuration created: renovate.json"
}

main() {
    echo "Setting up dependency management..."
    create_dependabot_config
    create_renovate_config
    echo "Dependency management configuration complete!"
}

main "$@"
