"""Local development uploads and optional persistent S3-compatible storage."""

import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "uploads"))
if not UPLOAD_DIR.is_absolute():
    UPLOAD_DIR = BACKEND_DIR / UPLOAD_DIR
UPLOAD_DIR = UPLOAD_DIR.resolve()


def _s3_settings() -> tuple[str, str, str, str, str] | None:
    values = tuple(
        os.getenv(key, "").strip()
        for key in (
            "AWS_ENDPOINT_URL_S3",
            "AWS_REGION",
            "AWS_ACCESS_KEY_ID",
            "AWS_SECRET_ACCESS_KEY",
            "UPLOAD_BUCKET",
        )
    )
    if all(values):
        return values
    if any(values):
        raise RuntimeError("Object storage settings are incomplete")
    return None


def _s3_client(settings: tuple[str, str, str, str, str]):
    import boto3
    from botocore.client import Config

    endpoint, region, access_key, secret_key, _bucket = settings
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(s3={"addressing_style": "path"}),
    )


def _safe_local_path(key: str) -> Path:
    path = (UPLOAD_DIR / key).resolve()
    if not path.is_relative_to(UPLOAD_DIR) or path == UPLOAD_DIR:
        raise ValueError("Invalid upload path")
    return path


def save_upload(key: str, data: bytes, content_type: str) -> str:
    """Persist a file and return its stable API path."""
    path = _safe_local_path(key)
    settings = _s3_settings()
    if settings:
        _s3_client(settings).put_object(
            Bucket=settings[4], Key=key, Body=data, ContentType=content_type
        )
    else:
        if os.getenv("REQUIRE_PERSISTENT_UPLOADS", "false").lower() == "true":
            raise RuntimeError("Persistent upload storage is not configured")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
    return f"/uploads/{key}"


def load_upload(key: str) -> tuple[bytes, str] | None:
    """Read an uploaded image, falling back to packaged local media."""
    path = _safe_local_path(key)
    if key.startswith(("words/", "stories/")) and (settings := _s3_settings()):
        try:
            response = _s3_client(settings).get_object(Bucket=settings[4], Key=key)
        except Exception as error:
            from botocore.exceptions import ClientError

            if not isinstance(error, ClientError) or error.response.get("Error", {}).get("Code") not in ("NoSuchKey", "404"):
                raise
        else:
            return response["Body"].read(), response.get("ContentType", "application/octet-stream")
    if path.is_file():
        import mimetypes

        return path.read_bytes(), mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return None
