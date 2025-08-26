
resource "aws_elasticache_subnet_group" "agi_portal" {
  name       = "${var.cluster_name}-ec-subnet"
  subnet_ids = module.vpc.private_subnets
  tags       = var.tags
}

resource "aws_security_group" "elasticache" {
  name_prefix = "${var.cluster_name}-elasticache"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.cluster_name}-elasticache"
  })
}

resource "aws_elasticache_replication_group" "agi_portal" {
  replication_group_id          = "${var.cluster_name}-redis"
  description                   = "Redis for AGI Portal"
  node_type                     = "cache.t4g.medium"
  automatic_failover_enabled    = true
  multi_az_enabled              = true
  num_cache_clusters            = 2
  engine                        = "redis"
  engine_version                = "7.1"
  parameter_group_name          = "default.redis7"
  subnet_group_name             = aws_elasticache_subnet_group.agi_portal.name
  security_group_ids            = [aws_security_group.elasticache.id]
  at_rest_encryption_enabled    = true
  transit_encryption_enabled    = true
  auth_token                    = var.redis_auth_token
  
  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.elasticache.name
    destination_type = "cloudwatch-logs"
    log_format       = "text"
    log_type         = "slow-log"
  }

  tags = merge(var.tags, {
    Name = "${var.cluster_name}-redis"
  })
}

resource "aws_cloudwatch_log_group" "elasticache" {
  name              = "/aws/elasticache/${var.cluster_name}"
  retention_in_days = 7
  tags              = var.tags
}

resource "aws_secretsmanager_secret" "redis_url" {
  name = "${var.cluster_name}/redis/url"
  tags = merge(var.tags, {
    Name = "${var.cluster_name}-redis-url"
  })
}

resource "aws_secretsmanager_secret_version" "redis_url" {
  secret_id = aws_secretsmanager_secret.redis_url.id
  secret_string = jsonencode({
    url = "redis://:${var.redis_auth_token}@${aws_elasticache_replication_group.agi_portal.primary_endpoint_address}:6379/0"
    host = aws_elasticache_replication_group.agi_portal.primary_endpoint_address
    port = "6379"
    auth_token = var.redis_auth_token
  })
}
