import io
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from backend import storage


class UploadStorageTests(unittest.TestCase):
    def test_local_upload_round_trip(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent) as directory:
            self.assertTrue(Path(directory).resolve().is_relative_to(Path(__file__).resolve().parents[1]))
            with patch.object(storage, "UPLOAD_DIR", Path(directory)):
                with patch.dict(os.environ, {"REQUIRE_PERSISTENT_UPLOADS": "false"}):
                    self.assertEqual(
                        storage.save_upload("words/word_1.png", b"image", "image/png"),
                        "/uploads/words/word_1.png",
                    )
                    self.assertEqual(
                        storage.load_upload("words/word_1.png"), (b"image", "image/png")
                    )

    def test_public_deployment_requires_persistent_storage(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent) as directory:
            self.assertTrue(Path(directory).resolve().is_relative_to(Path(__file__).resolve().parents[1]))
            with patch.object(storage, "UPLOAD_DIR", Path(directory)):
                with patch.dict(os.environ, {"REQUIRE_PERSISTENT_UPLOADS": "true"}):
                    with self.assertRaises(RuntimeError):
                        storage.save_upload("words/word_1.png", b"image", "image/png")
                    self.assertFalse((Path(directory) / "words" / "word_1.png").exists())

    def test_rejects_path_outside_upload_directory(self):
        with self.assertRaises(ValueError):
            storage.load_upload("../private.txt")

    def test_object_storage_save_and_read(self):
        settings = ("https://storage.example", "eu-central-1", "access", "secret", "vera-uploads")
        client = Mock()
        client.get_object.return_value = {"Body": io.BytesIO(b"image"), "ContentType": "image/png"}
        with patch.object(storage, "_s3_settings", return_value=settings):
            with patch.object(storage, "_s3_client", return_value=client):
                self.assertEqual(
                    storage.save_upload("stories/story_1.png", b"image", "image/png"),
                    "/uploads/stories/story_1.png",
                )
                self.assertEqual(
                    storage.load_upload("stories/story_1.png"), (b"image", "image/png")
                )
        client.put_object.assert_called_once_with(
            Bucket="vera-uploads", Key="stories/story_1.png", Body=b"image", ContentType="image/png"
        )


if __name__ == "__main__":
    unittest.main()
