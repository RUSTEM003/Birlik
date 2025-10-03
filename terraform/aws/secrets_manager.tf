
resource "aws_secretsmanager_secret" "backend_secret" {
  name = "${var.cluster_name}/backend/secret"
  tags = merge(var.tags, {
    Name = "${var.cluster_name}-backend-secret"
  })
}

resource "aws_secretsmanager_secret_version" "backend_secret" {
  secret_id     = aws_secretsmanager_secret.backend_secret.id
  secret_string = var.backend_secret_key
}

resource "aws_secretsmanager_secret" "database_url" {
  name = "${var.cluster_name}/backend/database_url"
  tags = merge(var.tags, {
    Name = "${var.cluster_name}-database-url"
  })
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id = aws_secretsmanager_secret.database_url.id
  secret_string = "postgresql+psycopg2://${var.db_username}:${var.db_password}@${aws_db_instance.main.address}:5432/${var.db_name}"
}

resource "aws_secretsmanager_secret" "oidc_config" {
  name = "${var.cluster_name}/oidc/config"
  tags = merge(var.tags, {
    Name = "${var.cluster_name}-oidc-config"
  })
}

resource "aws_secretsmanager_secret_version" "oidc_config" {
  secret_id = aws_secretsmanager_secret.oidc_config.id
  secret_string = jsonencode({
    issuer = var.oidc_issuer
    audience = var.oidc_audience
    jwks_url = var.oidc_jwks_url
  })
}

resource "aws_secretsmanager_secret" "ai_providers" {
  name = "${var.cluster_name}/ai/providers"
  tags = merge(var.tags, {
    Name = "${var.cluster_name}-ai-providers"
  })
}

resource "aws_secretsmanager_secret_version" "ai_providers" {
  secret_id = aws_secretsmanager_secret.ai_providers.id
  secret_string = jsonencode({
    openai_api_key = var.openai_api_key
    anthropic_api_key = var.anthropic_api_key
    default_provider = var.ai_default_provider
  })
}

resource "aws_secretsmanager_secret" "alerting" {
  name = "${var.cluster_name}/alerting/webhooks"
  tags = merge(var.tags, {
    Name = "${var.cluster_name}-alerting"
  })
}

resource "aws_secretsmanager_secret_version" "alerting" {
  secret_id = aws_secretsmanager_secret.alerting.id
  secret_string = jsonencode({
    pagerduty_key = var.pagerduty_integration_key
    slack_webhook = var.slack_webhook_url
  })
}
