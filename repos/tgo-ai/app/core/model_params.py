"""Model-specific parameter rules for OpenAI-compatible endpoints."""

from __future__ import annotations

import re
from typing import Optional

# Reasoning-era models (o-series, gpt-5 and newer) rejected `max_tokens` and
# only accept `max_completion_tokens`.
_MAX_COMPLETION_TOKENS_MODELS = re.compile(
    r"(^|[/:._-])(o[1-9]|gpt-([5-9]|[1-9]\d))",
    re.IGNORECASE,
)


def requires_max_completion_tokens(*model_ids: Optional[str]) -> bool:
    """Whether the model must receive `max_completion_tokens` instead of `max_tokens`."""
    return any(
        model_id and _MAX_COMPLETION_TOKENS_MODELS.search(model_id)
        for model_id in model_ids
    )
