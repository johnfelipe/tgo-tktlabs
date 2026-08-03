"""seed openrouter default model templates

Revision ID: 0028_openrouter_defaults
Revises: 0027_agent_only_ai_routing
Create Date: 2026-08-02

"""

from __future__ import annotations

from typing import Sequence, Union
import uuid

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0028_openrouter_defaults"
down_revision: Union[str, None] = "0027_agent_only_ai_routing"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

PROVIDER = "openrouter"

# OpenRouter only exposes chat completions; embeddings must use another provider.
SEED_ROWS: list[tuple[str, str, str, int]] = [
    ("openai/gpt-4.1-mini", "GPT-4.1 Mini", "chat", 10),
    ("openai/gpt-4o-mini", "GPT-4o Mini", "chat", 20),
    ("openai/gpt-4.1", "GPT-4.1", "chat", 30),
    ("anthropic/claude-sonnet-4.5", "Claude Sonnet 4.5", "chat", 40),
    ("google/gemini-2.5-flash", "Gemini 2.5 Flash", "chat", 50),
    ("deepseek/deepseek-chat", "DeepSeek Chat", "chat", 60),
    ("meta-llama/llama-3.3-70b-instruct", "Llama 3.3 70B Instruct", "chat", 70),
]


def _defaults_table() -> sa.Table:
    return sa.table(
        "api_ai_provider_default_models",
        sa.column("id", sa.UUID()),
        sa.column("provider", sa.String()),
        sa.column("model_id", sa.String()),
        sa.column("model_name", sa.String()),
        sa.column("model_type", sa.String()),
        sa.column("sort_order", sa.Integer()),
        sa.column("is_active", sa.Boolean()),
    )


def upgrade() -> None:
    op.bulk_insert(
        _defaults_table(),
        [
            {
                "id": uuid.uuid4(),
                "provider": PROVIDER,
                "model_id": model_id,
                "model_name": model_name,
                "model_type": model_type,
                "sort_order": sort_order,
                "is_active": True,
            }
            for model_id, model_name, model_type, sort_order in SEED_ROWS
        ],
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            "DELETE FROM api_ai_provider_default_models WHERE provider = :provider"
        ).bindparams(provider=PROVIDER)
    )
