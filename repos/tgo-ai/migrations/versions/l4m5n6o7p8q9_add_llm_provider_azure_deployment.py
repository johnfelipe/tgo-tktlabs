"""add azure deployment to llm providers

Revision ID: l4m5n6o7p8q9
Revises: k3l4m5n6o7p8
Create Date: 2026-08-12 17:20:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'l4m5n6o7p8q9'
down_revision: Union[str, None] = 'k3l4m5n6o7p8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'ai_llm_providers',
        sa.Column(
            'azure_deployment',
            sa.String(length=100),
            nullable=True,
            comment='Azure OpenAI deployment name (replaces the model id on requests)',
        ),
    )


def downgrade() -> None:
    op.drop_column('ai_llm_providers', 'azure_deployment')
