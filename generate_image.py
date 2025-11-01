#!/usr/bin/env python3
import argparse
import base64
import json
import os
import sys
from typing import Optional

import requests
import time


API_URL = "https://api.whomeai.com/v1/images/generations"


def ensure_png_extension(filename: str) -> str:
    if not filename.lower().endswith(".png"):
        return f"{filename}.png"
    return filename


def write_image_b64_to_file(b64_data: str, output_path: str) -> None:
    image_bytes = base64.b64decode(b64_data)
    with open(output_path, "wb") as f:
        f.write(image_bytes)


def generate_image(prompt: str,
                   output_filename: str,
                   *,
                   api_key: Optional[str] = None,
                   model: str = "nano-banana",
                   size: str = "1792x1024",
                   retry_on_429: bool = True) -> str:
    """
    Generate an image from text using whomeai API and save it to disk.
    Returns the absolute path to the saved file.
    retry_on_429: If True, will auto-wait and retry once if API says rate-limited (HTTP 429)
    """
    token = (api_key or os.getenv("WHOMEAI_API_KEY") or "sk-demo").strip()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }
    payload = {
        "model": model,
        "prompt": prompt,
        "n": 1,
        "size": size,
        # API defaults response_format to b64_json
    }
    retries = 0
    while True:
        try:
            resp = requests.post(API_URL, headers=headers, data=json.dumps(payload), timeout=120)
        except requests.RequestException as req_err:
            raise SystemExit(f"Request failed: {req_err}") from req_err
        if resp.status_code == 429 and retry_on_429:
            try:
                err_json = resp.json()
                wait_sec = int(err_json.get("retry_after", 60))
                print(f"Rate limit hit, waiting {wait_sec} seconds then retrying...")
                for sec in range(wait_sec, 0, -1):
                    print(f"  ...retrying in {sec}s   ", end="\r", flush=True)
                    time.sleep(1)
                print()
                retries += 1
                retry_on_429 = False  # Only retry once!
                continue
            except Exception:
                raise SystemExit(f"API error (429): {resp.text}")
        if resp.status_code != 200:
            try:
                err_json = resp.json()
                err_msg = json.dumps(err_json, ensure_ascii=False)
            except Exception:
                err_msg = resp.text
            raise SystemExit(f"API error ({resp.status_code}): {err_msg}")
        try:
            payload_json = resp.json()
            data_list = payload_json.get("data", [])
            if not data_list:
                raise ValueError("Empty 'data' in API response")
            b64_img = data_list[0].get("b64_json")
            if not b64_img:
                raise ValueError("Missing 'b64_json' in first data item")
        except Exception as parse_err:
            raise SystemExit(f"Failed to parse API response: {parse_err}\nRaw: {resp.text[:500]}") from parse_err
        output_filename = ensure_png_extension(output_filename)
        output_path = os.path.abspath(output_filename)
        try:
            write_image_b64_to_file(b64_img, output_path)
        except Exception as io_err:
            raise SystemExit(f"Failed to write image file: {io_err}") from io_err
        return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate an image from a text prompt using whomeai test API."
    )
    parser.add_argument("prompt", nargs="?", default=None,
                        help="Text prompt describing the desired image (single mode)")
    parser.add_argument("output", nargs="?", default=None,
                        help="Output image filename (single mode, .png will be added if missing)")
    parser.add_argument("--prompts", dest="prompts_file", default=None,
                        help="Path to prompts.json for batch generation. Saves to ./images/<name>.png")
    parser.add_argument("--api-key", dest="api_key", default=None,
                        help="Bearer token (defaults to env WHOMEAI_API_KEY or 'sk-demo')")
    parser.add_argument("--model", default="nano-banana",
                        choices=["nano-banana"],
                        help="Model to use for text-to-image")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    # Batch mode
    if args.prompts_file:
        json_path = os.path.abspath(args.prompts_file)
        if not os.path.exists(json_path):
            raise SystemExit(f"prompts file not found: {json_path}")
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                entries = json.load(f)
        except Exception as read_err:
            raise SystemExit(f"Failed to read prompts file: {read_err}") from read_err

        if not isinstance(entries, list):
            raise SystemExit("prompts file must contain a JSON array of {name,prompt}")

        images_dir = os.path.abspath(os.path.join(os.getcwd(), "images"))
        os.makedirs(images_dir, exist_ok=True)

        saved_files = []
        for idx, item in enumerate(entries):
            if not isinstance(item, dict):
                raise SystemExit(f"Invalid item at index {idx}: expected object with name/prompt")
            name = item.get("name")
            prompt_text = item.get("prompt")
            if not name or not prompt_text:
                raise SystemExit(f"Missing name or prompt at index {idx}")
            output_path = os.path.join(images_dir, f"{name}.png")
            saved = generate_image(
                prompt_text,
                output_path,
                api_key=args.api_key,
                model=args.model,
                size="1792x1024",
                retry_on_429=True,
            )
            print(saved)
            saved_files.append(saved)
            # Delay 25s before next unless last
            if idx < len(entries)-1:
                print(f"Waiting 25s before next image...")
                for sec in range(25,0,-1):
                    print(f"  ...next request in {sec}s   ", end="\r", flush=True)
                    time.sleep(1)
                print()
        # Print last saved path again for convenience
        if saved_files:
            print(f"Saved {len(saved_files)} images to {images_dir}")
        return

    # Single mode
    if not args.prompt or not args.output:
        raise SystemExit("Provide either: <prompt> <output> for single mode, or --prompts prompts.json for batch mode")

    saved_path = generate_image(
        args.prompt,
        args.output,
        api_key=args.api_key,
        model=args.model,
        size="1792x1024",
    )
    print(saved_path)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)


