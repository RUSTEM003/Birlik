package helm.security

import rego.v1

deny contains msg if {
    input.kind == "Deployment"
    some container in input.spec.template.spec.containers
    not container.securityContext.runAsNonRoot
    msg := sprintf("Container %s must run as non-root user", [container.name])
}

deny contains msg if {
    input.kind == "Deployment"
    some container in input.spec.template.spec.containers
    not container.securityContext.readOnlyRootFilesystem
    msg := sprintf("Container %s must have read-only root filesystem", [container.name])
}

deny contains msg if {
    input.kind == "Deployment"
    some container in input.spec.template.spec.containers
    container.image
    endswith(container.image, ":latest")
    msg := sprintf("Container %s should not use 'latest' tag", [container.name])
}

deny contains msg if {
    input.kind == "Service"
    input.spec.type == "LoadBalancer"
    not input.metadata.annotations["service.beta.kubernetes.io/aws-load-balancer-ssl-cert"]
    msg := "LoadBalancer service should use SSL certificate"
}

warn contains msg if {
    input.kind == "Deployment"
    some container in input.spec.template.spec.containers
    not container.resources.limits
    msg := sprintf("Container %s should have resource limits defined", [container.name])
}

warn contains msg if {
    input.kind == "Deployment"
    not input.spec.template.spec.securityContext
    msg := "Deployment should have pod security context defined"
}
