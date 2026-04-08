"""
모델별 테스트 이미지 생성 스크립트
결과: backend/test_output/ 폴더에 저장
"""
import os
import time
import urllib.request
from dotenv import load_dotenv
import replicate

load_dotenv()
client = replicate.Client(api_token=os.getenv("REPLICATE_API_TOKEN"))

OUTPUT_DIR = "test_output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 플래시카드용 장면 - 지브리 스타일 테스트
SCENES = [
    {
        "key": "friendship",
        "prompt": "two children holding hands in a sunlit meadow",
    },
    {
        "key": "food",
        "prompt": "a steaming bowl of ramen on a wooden table",
    },
    {
        "key": "journey",
        "prompt": "a small girl walking along a forest path with a cat",
    },
]

# flux-schnell: 가장 저렴한 모델 (4 steps, 초고속)
MODELS = [
    {
        "key": "ghibli-schnell",
        "id": "black-forest-labs/flux-schnell",
        "input": lambda p: {
            "prompt": f"Studio Ghibli style anime illustration, {p}, soft watercolor, warm pastel colors, hand-drawn feel, gentle lighting, magical atmosphere, simple clean background",
            "aspect_ratio": "1:1",
            "output_format": "webp",
            "num_inference_steps": 4,
        },
    },
]


def save_image(url: str, filename: str):
    path = os.path.join(OUTPUT_DIR, filename)
    urllib.request.urlretrieve(url, path)
    print(f"  저장: {path}")


def run():
    for scene in SCENES:
        for i, model in enumerate(MODELS):
            name = f"{scene['key']}_{model['key']}.webp"
            print(f"\n[{scene['key']}] {model['key']} 생성 중...")
            try:
                output = client.run(model["id"], input=model["input"](scene["prompt"]))
                url = str(output[0]) if isinstance(output, list) else str(output)
                save_image(url, name)
            except Exception as e:
                print(f"  실패: {e}")
            # rate limit 대응 (크레딧 $5 미만: burst=1, 요청 간 15초)
            time.sleep(15)

    print(f"\n완료. {OUTPUT_DIR}/ 폴더 확인해봐.")


if __name__ == "__main__":
    run()
