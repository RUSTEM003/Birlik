package terraform.security

import rego.v1

deny contains msg if {
    input.resource_type == "aws_s3_bucket"
    not input.values.server_side_encryption_configuration
    msg := "S3 bucket must have server-side encryption enabled"
}

deny contains msg if {
    input.resource_type == "aws_db_instance"
    not input.values.storage_encrypted
    msg := "RDS instance must have storage encryption enabled"
}

deny contains msg if {
    input.resource_type == "aws_security_group"
    some rule in input.values.ingress
    rule.from_port == 22
    rule.to_port == 22
    "0.0.0.0/0" in rule.cidr_blocks
    msg := "SSH access should not be open to the world"
}

deny contains msg if {
    input.resource_type == "aws_iam_policy"
    some statement in input.values.policy.Statement
    statement.Effect == "Allow"
    statement.Action == "*"
    statement.Resource == "*"
    msg := "IAM policy should not allow all actions on all resources"
}

warn contains msg if {
    input.resource_type == "aws_instance"
    not input.values.monitoring
    msg := "EC2 instance should have detailed monitoring enabled"
}

warn contains msg if {
    input.resource_type == "aws_db_instance"
    not input.values.backup_retention_period
    msg := "RDS instance should have backup retention configured"
}
