package main

import rego.v1

# Deny pods without security context
deny contains msg if {
    input.kind == "Pod"
    container := input.spec.containers[_]
    not container.securityContext
    msg := sprintf("Container %s must have securityContext defined", [container.name])
}

# Deny containers running as root
deny contains msg if {
    input.kind == "Pod"
    container := input.spec.containers[_]
    container.securityContext.runAsUser == 0
    msg := sprintf("Container %s must not run as root", [container.name])
}

# Deny containers without readOnlyRootFilesystem
deny contains msg if {
    input.kind == "Pod"
    container := input.spec.containers[_]
    not container.securityContext.readOnlyRootFilesystem
    msg := sprintf("Container %s must set readOnlyRootFilesystem: true", [container.name])
}

# Deny containers with privileged access
deny contains msg if {
    input.kind == "Pod"
    container := input.spec.containers[_]
    container.securityContext.privileged == true
    msg := sprintf("Container %s must not run in privileged mode", [container.name])
}

# Deny containers without resource limits
deny contains msg if {
    input.kind == "Pod"
    container := input.spec.containers[_]
    not container.resources.limits
    msg := sprintf("Container %s must have resource limits", [container.name])
}

# Deny containers using latest tag
deny contains msg if {
    input.kind == "Pod"
    container := input.spec.containers[_]
    endswith(container.image, ":latest")
    msg := sprintf("Container %s uses :latest tag", [container.name])
}

# Deny containers from unauthorized registries
deny contains msg if {
    input.kind == "Pod"
    container := input.spec.containers[_]
    not starts_with_allowed_registry(container.image)
    msg := sprintf("Container %s uses unauthorized registry", [container.name])
}

starts_with_allowed_registry(image) if {
    allowed_registries := [
        "123456789012.dkr.ecr.us-west-2.amazonaws.com/",
        "ghcr.io/rustem003/"
    ]
    startswith(image, allowed_registries[_])
}
