"""Azure OpenAI helpers shared by the chat service and the agent runtime."""

from __future__ import annotations

from typing import Optional

AZURE_VENDORS = {"azure_openai", "azure-openai", "azure"}


def azure_deployment_or_model(
    vendor: Optional[str],
    azure_deployment: Optional[str],
    model: Optional[str],
) -> Optional[str]:
    """Return the identifier to send as ``model`` to an Azure OpenAI endpoint.

    Azure routes requests by deployment name, which is chosen when the model is
    deployed and usually differs from the catalog model id (e.g. deployment
    ``gpt-5-nano`` serving ``gpt-5-nano-2025-08-07``). When the provider defines
    a deployment, it takes precedence over the configured model id.
    """
    if (vendor or "").lower() not in AZURE_VENDORS:
        return model
    deployment = (azure_deployment or "").strip()
    return deployment or model
