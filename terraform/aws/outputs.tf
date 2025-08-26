
output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = var.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ids attached to the cluster control plane"
  value       = module.eks.cluster_security_group_id
}

output "region" {
  description = "AWS region"
  value       = var.region
}

output "cluster_oidc_issuer_url" {
  description = "The URL on the EKS cluster for the OpenID Connect identity provider"
  value       = module.eks.cluster_oidc_issuer_url
}

output "redis_primary_endpoint" {
  description = "Redis primary endpoint"
  value       = aws_elasticache_replication_group.agi_portal.primary_endpoint_address
}

output "redis_port" {
  description = "Redis port"
  value       = "6379"
}

output "secret_backend_secret_arn" {
  description = "ARN of backend secret"
  value       = aws_secretsmanager_secret.backend_secret.arn
}

output "secret_database_url_arn" {
  description = "ARN of database URL secret"
  value       = aws_secretsmanager_secret.database_url.arn
}

output "secret_redis_url_arn" {
  description = "ARN of Redis URL secret"
  value       = aws_secretsmanager_secret.redis_url.arn
}

output "secret_oidc_config_arn" {
  description = "ARN of OIDC config secret"
  value       = aws_secretsmanager_secret.oidc_config.arn
}

output "secret_ai_providers_arn" {
  description = "ARN of AI providers secret"
  value       = aws_secretsmanager_secret.ai_providers.arn
}

output "secret_alerting_arn" {
  description = "ARN of alerting webhooks secret"
  value       = aws_secretsmanager_secret.alerting.arn
}

output "alb_controller_role_arn" {
  description = "ARN of ALB Controller IAM role"
  value       = aws_iam_role.alb_controller.arn
}

output "external_dns_role_arn" {
  description = "ARN of External DNS IAM role"
  value       = aws_iam_role.external_dns.arn
}

output "cert_manager_role_arn" {
  description = "ARN of Cert Manager IAM role"
  value       = aws_iam_role.cert_manager.arn
}

output "external_secrets_role_arn" {
  description = "ARN of External Secrets IAM role"
  value       = aws_iam_role.external_secrets.arn
}
