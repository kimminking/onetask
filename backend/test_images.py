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

# 플래시카드용 프롬프트 - 단순하고 아이콘처럼 명확한 표현
SCENES = [
    {
        "key": "friendship",
        "prompt": "two cartoon children happily holding hands, simple clean illustration, white background, bright cheerful colors, minimalist, cute",
    },
    {
        "key": "food",
        "prompt": "colorful bowl of delicious food with steam rising, simple clean illustration, white background, bright colors, cute, minimalist icon style",
    },
]

# 스타일별로 다른 모델 - 한 장씩 비교용
MODELS = [
    # 1. flux-1.1-pro - 고품질 사실적 일러스트
    {
        "key": "flux-pro",
        "id": "black-forest-labs/flux-1.1-pro",
        "input": lambda p: {
            "prompt": f"cute flat illustration, children's book style, {p}, soft pastel colors, simple white background, clean lines",
            "aspect_ratio": "1:1",
            "output_format": "webp",
            "output_quality": 90,
            "safety_tolerance": 2,
        },
    },
    # 2. recraft-v3 - 2d 포스터 스타일
    {
        "key": "recraft-poster",
        "id": "recraft-ai/recraft-v3",
        "input": lambda p: {
            "prompt": f"flat 2d illustration, bold simple shapes, {p}, bright primary colors, clean minimal design, white background",
            "size": "1024x1024",
            "style": "digital_illustration/2d_art_poster",
        },
    },
    # 3. ideogram - 동화풍 일러스트
    {
        "key": "ideogram",
        "id": "ideogram-ai/ideogram-v2",
        "input": lambda p: {
            "prompt": f"cute children's book illustration, watercolor style, {p}, soft pastel colors, simple background, warm and friendly",
            "aspect_ratio": "1:1",
            "resolution": "1024x1024",
            "style_type": "General",
        },
    },
    # 4. sd3.5 - pixar/3d 귀여운 스타일
    {
        "key": "sd3-pixar",
        "id": "stability-ai/stable-diffusion-3.5-large",
        "input": lambda p: {
            "prompt": f"cute pixar 3d style, {p}, soft rounded shapes, pastel colors, simple clean background, high quality render",
            "negative_prompt": "anime, flat, sketch, text, watermark, complex background",
            "aspect_ratio": "1:1",
            "output_format": "webp",
            "num_inference_steps": 28,
            "guidance_scale": 5.0,
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
            # rate limit 대응: 요청 사이 12초 대기
            time.sleep(12)

    print(f"\n완료. {OUTPUT_DIR}/ 폴더 확인해봐.")


if __name__ == "__main__":
    run()
