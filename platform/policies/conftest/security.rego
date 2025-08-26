package main

import rego.v1

# Deny containers without resource limits
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.resources.limits
    msg := sprintf("Container '%s' must have resource limits defined", [container.name])
}

# Deny containers without resource requests
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.resources.requests
    msg := sprintf("Container '%s' must have resource requests defined", [container.name])
}

# Deny containers running as root
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    container.securityContext.runAsUser == 0
    msg := sprintf("Container '%s' must not run as root (UID 0)", [container.name])
}

# Deny containers without readOnlyRootFilesystem
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.securityContext.readOnlyRootFilesystem
    msg := sprintf("Container '%s' must have readOnlyRootFilesystem set to true", [container.name])
}

# Deny containers with privileged access
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    container.securityContext.privileged == true
    msg := sprintf("Container '%s' must not run in privileged mode", [container.name])
}

# Deny containers without dropped capabilities
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.securityContext.capabilities.drop
    msg := sprintf("Container '%s' must drop all capabilities", [container.name])
}

# Deny containers with allowPrivilegeEscalation
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    container.securityContext.allowPrivilegeEscalation == true
    msg := sprintf("Container '%s' must not allow privilege escalation", [container.name])
}

# Deny images with latest tag
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    endswith(container.image, ":latest")
    msg := sprintf("Container '%s' must not use 'latest' tag", [container.name])
}

# Deny missing security context
deny contains msg if {
    input.kind == "Deployment"
    not input.spec.template.spec.securityContext
    msg := "Pod must have a security context defined"
}

# Deny missing seccomp profile
deny contains msg if {
    input.kind == "Deployment"
    not input.spec.template.spec.securityContext.seccompProfile
    msg := "Pod must have seccomp profile set to RuntimeDefault"
}
