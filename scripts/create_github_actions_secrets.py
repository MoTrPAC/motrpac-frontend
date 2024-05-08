"""
This script was created to easily sync the .env file with the GitHub Actions secrets.

To use this script, you need to have a GitHub token with the `repo` scope.
"""
import argparse
from argparse import Namespace
from pathlib import Path

from dotenv import dotenv_values
from github import Github, Auth
from github.Repository import Repository


def get_repo(token: str) -> Repository:
    """Get the repository object from the token."""
    auth = Auth.Token(token)
    g = Github(auth=auth)
    return g.get_repo("MoTrPAC/motrpac-frontend")


def read_secrets(env_file: Path) -> dict[str, str | None]:
    """Read a file and encrypt each value in the file using the public key."""
    if not env_file.exists():
        raise FileNotFoundError(f"{env_file.absolute()} does not exist.")
    return dotenv_values(".env")


def encrypt_secrets(repo: Repository, secrets: dict[str, str]) -> None:
    """Encrypt each secret and add it to the repository."""
    for key, value in secrets.items():
        print(f"Encrypting {key} :: {value}")
        encrypted = repo.create_secret(key, value)
        print(
            f"Secret '{encrypted.name}' was successfully added.\n"
            f" - Created At: {encrypted.created_at.isoformat()}\n"
            f" - Updated At: {encrypted.updated_at.isoformat()}\n"
            f" - URL:       {encrypted.url}\n"
        )


def cli_args() -> Namespace:
    parser = argparse.ArgumentParser(description="Encrypt secrets for GitHub Actions")
    parser.add_argument("env_file", type=Path, help="Path to the .env file")
    parser.add_argument(
        "--token", type=str, required=True,
        help="GitHub token. Use `gh auth token` if you have the GitHub CLI installed."
    )
    return parser.parse_args()


def main():
    args = cli_args()
    repo = get_repo(args.token)
    secrets = read_secrets(args.env_file)
    encrypt_secrets(repo, secrets)
    print("All secrets have been encrypted.")


if __name__ == '__main__':
    main()
