"""
Claude SDK client wrapper for AI analysis.
"""

import json
from pathlib import Path
from typing import Any

try:
    from claude_agent_sdk import ClaudeAgentOptions, ClaudeSDKClient
    from phase_config import resolve_model_id

    CLAUDE_SDK_AVAILABLE = True
except ImportError:
    CLAUDE_SDK_AVAILABLE = False


class ClaudeAnalysisClient:
    """Wrapper for Claude SDK client with analysis-specific configuration."""

    DEFAULT_MODEL = "sonnet"  # Shorthand - resolved via API Profile if configured
    ALLOWED_TOOLS = ["Read", "Glob", "Grep"]
    MAX_TURNS = 50

    # Language code to language name mapping
    LANGUAGE_NAMES = {
        "en": "English",
        "ko": "Korean",
        "fr": "French",
    }

    def __init__(self, project_dir: Path, language: str = "en"):
        """
        Initialize Claude client.

        Args:
            project_dir: Root directory of project being analyzed
            language: Language for AI-generated content (en, ko, fr)
        """
        if not CLAUDE_SDK_AVAILABLE:
            raise RuntimeError(
                "claude-agent-sdk not available. Install with: pip install claude-agent-sdk"
            )

        self.project_dir = project_dir
        self.language = language
        self._validate_oauth_token()

    def _validate_oauth_token(self) -> None:
        """Validate that an authentication token is available."""
        from core.auth import require_auth_token

        require_auth_token()  # Raises ValueError if no token found

    async def run_analysis_query(self, prompt: str) -> str:
        """
        Run a Claude query for analysis.

        Args:
            prompt: The analysis prompt

        Returns:
            Claude's response text
        """
        settings_file = self._create_settings_file()

        try:
            client = self._create_client(settings_file)

            async with client:
                await client.query(prompt)
                return await self._collect_response(client)

        finally:
            # Cleanup settings file
            if settings_file.exists():
                settings_file.unlink()

    def _create_settings_file(self) -> Path:
        """
        Create temporary security settings file.

        Returns:
            Path to settings file
        """
        settings = {
            "sandbox": {"enabled": True, "autoAllowBashIfSandboxed": True},
            "permissions": {
                "defaultMode": "acceptEdits",
                "allow": [
                    "Read(./**)",
                    "Glob(./**)",
                    "Grep(./**)",
                ],
            },
        }

        settings_file = self.project_dir / ".claude_ai_analyzer_settings.json"
        with open(settings_file, "w") as f:
            json.dump(settings, f, indent=2)

        return settings_file

    def _create_client(self, settings_file: Path) -> Any:
        """
        Create configured Claude SDK client.

        Args:
            settings_file: Path to security settings file

        Returns:
            ClaudeSDKClient instance
        """
        # Build language instruction for non-English languages
        language_instruction = ""
        if self.language and self.language != "en":
            language_name = self.LANGUAGE_NAMES.get(self.language, self.language)
            language_instruction = (
                f"\n\n**IMPORTANT LANGUAGE REQUIREMENT**: Write all analysis descriptions, "
                f"recommendations, and explanations in **{language_name}**. "
                f"JSON keys must remain in English, but all human-readable content values "
                f"must be in {language_name}."
            )

        system_prompt = (
            f"You are a senior software architect analyzing this codebase. "
            f"Your working directory is: {self.project_dir.resolve()}\n"
            f"Use Read, Grep, and Glob tools to analyze actual code. "
            f"Output your analysis as valid JSON only.{language_instruction}"
        )

        return ClaudeSDKClient(
            options=ClaudeAgentOptions(
                model=resolve_model_id(self.DEFAULT_MODEL),  # Resolve via API Profile
                system_prompt=system_prompt,
                allowed_tools=self.ALLOWED_TOOLS,
                max_turns=self.MAX_TURNS,
                cwd=str(self.project_dir.resolve()),
                settings=str(settings_file.resolve()),
            )
        )

    async def _collect_response(self, client: Any) -> str:
        """
        Collect text response from Claude client.

        Args:
            client: ClaudeSDKClient instance

        Returns:
            Collected response text
        """
        response_text = ""

        async for msg in client.receive_response():
            msg_type = type(msg).__name__

            if msg_type == "AssistantMessage":
                for content in msg.content:
                    if hasattr(content, "text"):
                        response_text += content.text

        return response_text
