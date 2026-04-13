"""
천안문역 예문 이미지 테스트 - 저렴한 모델 4개
"""
import os
import time
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
import replicate

load_dotenv()
client = replicate.Client(api_token=os.getenv("REPLICATE_API_TOKEN"))

OUTPUT_DIR = "test_output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

PROMPT_EN = "subway train interior, Beijing metro, passengers standing holding rails, announcement screen showing Tiananmen station, people preparing to get off, crowded city commute scene"

MODELS = [
    {
        "key": "flux-schnell",
        "id": "black-forest-labs/flux-schnell",
        "input": {
            "prompt": f"anime illustration style, {PROMPT_EN}, soft colors, clean lineart",
            "aspect_ratio": "1:1",
            "output_format": "webp",
            "num_inference_steps": 4,
        },
    },
    {
        "key": "flux-dev",
        "id": "black-forest-labs/flux-dev",
        "input": {
            "prompt": f"flat illustration, {PROMPT_EN}, minimal background, warm tones",
            "aspect_ratio": "1:1",
            "output_format": "webp",
            "num_inference_steps": 28,
            "guidance": 3.5,
        },
    },
    {
        "key": "sdxl",
        "id": "stability-ai/sdxl:7762fd07cf82c948538e41f4d1e9b650c5dc0711d3e11b27f3d90e9e2a4c2e1e",
        "input": {
            "prompt": f"digital art, {PROMPT_EN}, vibrant colors, detailed",
            "negative_prompt": "blurry, low quality, distorted",
            "width": 1024,
            "height": 1024,
            "num_inference_steps": 30,
        },
    },
    {
        "key": "flux-schnell-v2",
        "id": "black-forest-labs/flux-schnell",
        "input": {
            "prompt": f"watercolor painting style, {PROMPT_EN}, soft brushstrokes, pastel tones",
            "aspect_ratio": "1:1",
            "output_format": "webp",
            "num_inference_steps": 4,
        },
    },
]


def save_image(output, filename: str):
    path = os.path.join(OUTPUT_DIR, filename)
    url = str(output[0]) if isinstance(output, list) else str(output)
    urllib.request.urlretrieve(url, path)
    size = Path(path).stat().st_size // 1024
    print(f"  저장: {path} ({size}KB)")


def run():
    print(f"예문: '다음 역은 천안문이니 내릴 준비 하세요'\n")
    for model in MODELS:
        print(f"[{model['key']}] 생성 중...")
        try:
            output = client.run(model["id"], input=model["input"])
            save_image(output, f"tiananmen_{model['key']}.webp")
        except Exception as e:
            print(f"  실패: {e}")
        print("  15초 대기 중...")
        time.sleep(15)

    print(f"\n완료. {OUTPUT_DIR}/ 폴더 확인해봐.")


if __name__ == "__main__":
    run()
