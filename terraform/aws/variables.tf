
variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "agi-portal"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "portal"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "agi_portal"
}

variable "redis_auth_token" {
  description = "Redis authentication token"
  type        = string
  sensitive   = true
}

variable "backend_secret_key" {
  description = "Backend secret key for JWT signing"
  type        = string
  sensitive   = true
}

variable "oidc_issuer" {
  description = "OIDC issuer URL"
  type        = string
  default     = ""
}

variable "oidc_audience" {
  description = "OIDC audience"
  type        = string
  default     = ""
}

variable "oidc_jwks_url" {
  description = "OIDC JWKS URL"
  type        = string
  default     = ""
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "anthropic_api_key" {
  description = "Anthropic API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "ai_default_provider" {
  description = "Default AI provider"
  type        = string
  default     = "openai"
}

variable "pagerduty_integration_key" {
  description = "PagerDuty integration key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for alerts"
  type        = string
  sensitive   = true
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "agi-portal.example.com"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "AGI-Portal"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
