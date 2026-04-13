export interface Step {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  concepts: string[];
  explanation: string;
  examples: { problem: string; solution: string; hint?: string }[];
  quiz: { question: string; options: string[]; answer: number; explanation: string }[];
  aiConnection: string;
}

export const CURRICULUM: Step[] = [
  {
    id: 1,
    title: "수와 변수",
    subtitle: "미적분의 언어 배우기",
    emoji: "🔢",
    concepts: ["변수", "상수", "수식", "치환"],
    explanation: `미적분을 배우려면 먼저 '변하는 값'을 다루는 법을 알아야 해요.

**변수(Variable)**: x, y처럼 다양한 값을 가질 수 있는 문자예요.
**상수(Constant)**: 3, π, e처럼 고정된 값이에요.

예를 들어 "사과 x개의 가격"에서 x는 변수고, "사과 1개에 1000원"에서 1000은 상수예요.

AI에서는 수백만 개의 변수(파라미터)가 동시에 바뀌면서 모델이 학습돼요.`,
    examples: [
      {
        problem: "x = 3일 때, 2x + 1의 값은?",
        solution: "2 × 3 + 1 = 7",
        hint: "x 자리에 3을 대입해요"
      },
      {
        problem: "x = -2일 때, x² + 2x의 값은?",
        solution: "(-2)² + 2×(-2) = 4 - 4 = 0",
        hint: "(-2)² = 4 임에 주의!"
      },
      {
        problem: "y = 2x - 3에서 x = 5이면 y는?",
        solution: "y = 2×5 - 3 = 10 - 3 = 7",
        hint: "x에 5를 넣으면 돼요"
      }
    ],
    quiz: [
      {
        question: "x = 4일 때, 3x - 2의 값은?",
        options: ["10", "12", "14", "6"],
        answer: 0,
        explanation: "3 × 4 - 2 = 12 - 2 = 10"
      },
      {
        question: "다음 중 변수는?",
        options: ["π (파이)", "e (자연상수)", "n (개수)", "3.14"],
        answer: 2,
        explanation: "n은 상황에 따라 달라지는 변수예요. π, e, 3.14는 고정된 상수예요."
      },
      {
        question: "x = -1일 때, x² 의 값은?",
        options: ["-1", "1", "-2", "2"],
        answer: 1,
        explanation: "(-1)² = (-1) × (-1) = 1 (음수 × 음수 = 양수)"
      }
    ],
    aiConnection: "AI 모델의 '가중치(weight)'가 바로 수백만 개의 변수예요. 학습이란 이 변수들의 최적값을 찾는 과정이에요."
  },
  {
    id: 2,
    title: "함수 기초",
    subtitle: "입력 → 출력의 규칙",
    emoji: "⚙️",
    concepts: ["함수", "f(x)", "정의역", "치역"],
    explanation: `**함수(Function)**: 입력값을 넣으면 딱 하나의 출력값이 나오는 규칙이에요.

f(x) = 2x + 1 이라면:
- x에 1을 넣으면 → f(1) = 3
- x에 2를 넣으면 → f(2) = 5
- x에 0을 넣으면 → f(0) = 1

자판기처럼 생각하면 돼요. 500원(입력)을 넣으면 음료(출력)가 나오는 것처럼요.

AI 신경망 자체가 거대한 함수예요. 이미지(입력)를 넣으면 "고양이"(출력)가 나오죠.`,
    examples: [
      {
        problem: "f(x) = x² 일 때, f(3)은?",
        solution: "f(3) = 3² = 9",
        hint: "x 자리에 3을 대입"
      },
      {
        problem: "g(x) = 2x + 3 일 때, g(-1)은?",
        solution: "g(-1) = 2×(-1) + 3 = -2 + 3 = 1",
        hint: "음수 대입에 주의해요"
      },
      {
        problem: "h(x) = x² - x 일 때, h(4)는?",
        solution: "h(4) = 4² - 4 = 16 - 4 = 12",
        hint: "각 항에 4를 대입"
      }
    ],
    quiz: [
      {
        question: "f(x) = 3x - 1 일 때, f(2)는?",
        options: ["5", "6", "7", "4"],
        answer: 0,
        explanation: "f(2) = 3×2 - 1 = 6 - 1 = 5"
      },
      {
        question: "함수란 무엇인가요?",
        options: [
          "입력값마다 여러 출력값이 나오는 관계",
          "입력값마다 딱 하나의 출력값이 나오는 규칙",
          "항상 양수만 출력하는 규칙",
          "x와 y가 같은 관계"
        ],
        answer: 1,
        explanation: "함수는 하나의 입력에 하나의 출력이 대응되는 규칙이에요."
      },
      {
        question: "f(x) = x² + 1 일 때, f(0)는?",
        options: ["0", "1", "2", "-1"],
        answer: 1,
        explanation: "f(0) = 0² + 1 = 0 + 1 = 1"
      }
    ],
    aiConnection: "AI의 활성화 함수(ReLU, sigmoid 등)가 바로 이 함수 개념이에요. 뉴런의 입력값을 받아 출력값을 결정해요."
  },
  {
    id: 3,
    title: "일차함수와 기울기",
    subtitle: "변화의 빠르기 측정하기",
    emoji: "📈",
    concepts: ["일차함수", "기울기", "y절편", "변화율"],
    explanation: `y = ax + b 형태의 함수를 **일차함수**라고 해요.

여기서:
- **a** = 기울기 (slope): x가 1 증가할 때 y가 얼마나 변하는지
- **b** = y절편: x = 0일 때의 y값

기울기가 클수록 그래프가 가파르고, 기울기가 음수면 그래프가 내려가요.

기울기 공식: a = (y의 변화량) / (x의 변화량) = Δy / Δx`,
    examples: [
      {
        problem: "y = 2x + 1의 기울기와 y절편은?",
        solution: "기울기 = 2, y절편 = 1 (x=0이면 y=1)",
        hint: "y = ax + b에서 a가 기울기, b가 y절편"
      },
      {
        problem: "(1, 3)과 (3, 7)을 지나는 직선의 기울기는?",
        solution: "기울기 = (7-3)/(3-1) = 4/2 = 2",
        hint: "기울기 = (y변화)/(x변화)"
      },
      {
        problem: "y = -3x + 5에서 x가 2 증가하면 y는 얼마나 변하나요?",
        solution: "y는 -3 × 2 = -6 만큼 감소 (기울기가 -3이므로)",
        hint: "기울기 × x변화량 = y변화량"
      }
    ],
    quiz: [
      {
        question: "y = 4x - 2의 기울기는?",
        options: ["-2", "4", "2", "-4"],
        answer: 1,
        explanation: "y = ax + b에서 a = 4가 기울기예요."
      },
      {
        question: "기울기가 음수이면 그래프는?",
        options: ["오른쪽 위로 올라간다", "오른쪽 아래로 내려간다", "수평선이다", "수직선이다"],
        answer: 1,
        explanation: "기울기가 음수면 x가 증가할수록 y가 감소하므로 내려가는 모양이에요."
      },
      {
        question: "(0, 1)과 (2, 5)를 지나는 직선의 기울기는?",
        options: ["1", "2", "3", "4"],
        answer: 1,
        explanation: "(5-1)/(2-0) = 4/2 = 2"
      }
    ],
    aiConnection: "경사하강법에서 '기울기(gradient)'가 바로 이 개념이에요. 손실함수의 기울기를 따라 내려가면서 최적값을 찾아요."
  },
  {
    id: 4,
    title: "이차함수",
    subtitle: "곡선과 최솟값 찾기",
    emoji: "🔲",
    concepts: ["이차함수", "포물선", "꼭짓점", "최솟값"],
    explanation: `y = ax² + bx + c 형태를 **이차함수**라고 해요.

그래프가 포물선(U자 또는 ∩자) 모양이에요.
- a > 0 이면 U자 모양 (아래로 볼록) → 최솟값 존재
- a < 0 이면 ∩자 모양 (위로 볼록) → 최댓값 존재

**꼭짓점**: 포물선의 최저점 또는 최고점

AI에서 손실(Loss)이 이차함수 모양이라면, 꼭짓점이 바로 최솟값 = 가장 좋은 모델이에요!`,
    examples: [
      {
        problem: "y = x²에서 x = -2, -1, 0, 1, 2일 때 y값을 구하세요.",
        solution: "x=-2: y=4, x=-1: y=1, x=0: y=0, x=1: y=1, x=2: y=4",
        hint: "각 x값을 대입하면 돼요"
      },
      {
        problem: "y = x² - 4x + 4 = (x-2)²의 최솟값은?",
        solution: "x=2일 때 y=0이 최솟값. 꼭짓점은 (2, 0)",
        hint: "(x-2)²는 항상 0 이상이므로 최솟값은 0"
      },
      {
        problem: "y = x² + 2x + 3에서 x = 1일 때 y는?",
        solution: "y = 1 + 2 + 3 = 6",
        hint: "x에 1 대입"
      }
    ],
    quiz: [
      {
        question: "y = 2x²에서 x = 3일 때 y는?",
        options: ["6", "9", "12", "18"],
        answer: 3,
        explanation: "2 × 3² = 2 × 9 = 18"
      },
      {
        question: "y = x²의 최솟값은?",
        options: ["-1", "0", "1", "없다"],
        answer: 1,
        explanation: "x = 0일 때 y = 0이 최솟값이에요. x² ≥ 0 이므로 0보다 작을 수 없어요."
      },
      {
        question: "a > 0인 이차함수 y = ax²의 그래프 모양은?",
        options: ["∩자 (위로 볼록)", "U자 (아래로 볼록)", "직선", "S자"],
        answer: 1,
        explanation: "a > 0이면 U자 모양으로 최솟값이 존재해요."
      }
    ],
    aiConnection: "AI의 손실함수(Loss Function)는 주로 이차함수처럼 생겼어요. 이 함수의 최솟값을 찾는 게 AI 학습의 목표예요!"
  },
  {
    id: 5,
    title: "극한(Limit)",
    subtitle: "무한히 가까워지면 어떻게 될까?",
    emoji: "🎯",
    concepts: ["극한", "lim", "수렴", "발산"],
    explanation: `**극한**: x가 어떤 값에 한없이 가까워질 때, f(x)가 다가가는 값

lim(x→a) f(x) = L
"x가 a에 한없이 가까워질 때, f(x)는 L에 가까워진다"

예: f(x) = 2x일 때
lim(x→3) 2x = 6
(x가 3에 가까워지면 2x는 6에 가까워짐)

극한은 "정확히 그 점"이 아닌 "그 점에 가까워질 때"를 보는 거예요. 이게 미분의 핵심 아이디어예요!`,
    examples: [
      {
        problem: "lim(x→2) (x + 3) = ?",
        solution: "x가 2에 가까워지면 x+3은 2+3 = 5에 가까워짐. 답: 5",
        hint: "x에 2를 넣으면 돼요 (이 경우)"
      },
      {
        problem: "lim(x→0) (x²/x) = ?",
        solution: "x²/x = x이므로, lim(x→0) x = 0. 답: 0",
        hint: "x≠0일 때 x²/x = x로 약분 가능"
      },
      {
        problem: "lim(x→∞) (1/x) = ?",
        solution: "x가 무한히 커지면 1/x는 0에 가까워짐. 답: 0",
        hint: "분모가 무한히 커지면 전체는 0에 가까워져요"
      }
    ],
    quiz: [
      {
        question: "lim(x→1) (3x + 2) = ?",
        options: ["3", "4", "5", "6"],
        answer: 2,
        explanation: "x→1이면 3×1 + 2 = 5"
      },
      {
        question: "극한이란?",
        options: [
          "x가 정확히 a일 때의 함수값",
          "x가 a에 가까워질 때 함수가 다가가는 값",
          "함수의 최댓값",
          "x = 0일 때의 값"
        ],
        answer: 1,
        explanation: "극한은 '정확히'가 아닌 '가까워질 때'를 봐요."
      },
      {
        question: "lim(x→∞) (5/x²) = ?",
        options: ["5", "∞", "0", "1"],
        answer: 2,
        explanation: "x가 무한히 커지면 5/x²는 0에 가까워져요."
      }
    ],
    aiConnection: "신경망에서 학습률(learning rate)을 조금씩 줄여가는 것도 극한 개념이에요. 0에 한없이 가까워지지만 0은 아닌 값을 다뤄요."
  },
  {
    id: 6,
    title: "미분 기초",
    subtitle: "순간의 변화율 구하기",
    emoji: "⚡",
    concepts: ["미분", "도함수", "순간변화율", "접선"],
    explanation: `**미분**: 함수에서 순간순간의 변화율을 구하는 것

기울기 = Δy/Δx (평균 변화율)
미분 = Δx → 0 일 때의 순간 변화율

f'(x) = lim(h→0) [f(x+h) - f(x)] / h

예: 자동차 속도계가 바로 미분이에요!
위치 함수 s(t)를 시간으로 미분하면 → 속도 v(t)
속도를 다시 미분하면 → 가속도 a(t)

f'(x)는 "x에서의 순간 변화율" 또는 "접선의 기울기"예요.`,
    examples: [
      {
        problem: "f(x) = x²일 때, x=2에서의 순간변화율(미분값)은? (f'(2))",
        solution: "f'(x) = 2x이므로 f'(2) = 2×2 = 4",
        hint: "x²을 미분하면 2x가 돼요 (다음 단계에서 배울 공식!)"
      },
      {
        problem: "속도가 v(t) = 3t라면 t=2초에서의 순간 속도는?",
        solution: "v(2) = 3×2 = 6 m/s",
        hint: "함수에 t=2를 대입"
      },
      {
        problem: "f(x) = 2x + 1의 미분값 f'(x)는?",
        solution: "f'(x) = 2 (상수 함수: 기울기가 항상 2)",
        hint: "일차함수의 미분은 기울기예요"
      }
    ],
    quiz: [
      {
        question: "미분이란?",
        options: [
          "평균 변화율",
          "순간 변화율",
          "최댓값",
          "함수의 넓이"
        ],
        answer: 1,
        explanation: "미분은 아주 짧은 순간의 변화율을 구하는 것이에요."
      },
      {
        question: "속도를 시간으로 미분하면?",
        options: ["위치", "거리", "가속도", "힘"],
        answer: 2,
        explanation: "속도를 미분하면 가속도가 돼요. 가속도 = dv/dt"
      },
      {
        question: "f(x) = 5x의 미분값은?",
        options: ["5x", "5", "x", "0"],
        answer: 1,
        explanation: "일차함수 f(x) = 5x의 미분은 기울기인 5예요."
      }
    ],
    aiConnection: "AI에서 손실함수를 각 파라미터로 미분하면 '그래디언트(gradient)'가 나와요. 이게 바로 어느 방향으로 파라미터를 바꿔야 손실이 줄어드는지 알려줘요."
  },
  {
    id: 7,
    title: "기본 미분 공식",
    subtitle: "미분을 빠르게 계산하는 법",
    emoji: "📐",
    concepts: ["거듭제곱 미분", "합/차 미분", "상수 미분"],
    explanation: `미분을 매번 극한으로 계산하면 오래 걸려요. 공식을 외우면 빠르게 풀 수 있어요!

**핵심 공식 3가지:**

1. **(xⁿ)' = nxⁿ⁻¹** (거듭제곱 미분)
   - (x³)' = 3x²
   - (x²)' = 2x
   - (x)' = 1

2. **(상수)' = 0**
   - (5)' = 0
   - (π)' = 0

3. **(f + g)' = f' + g'** (합의 미분)
   - (x² + 3x)' = 2x + 3`,
    examples: [
      {
        problem: "f(x) = x⁴를 미분하면?",
        solution: "f'(x) = 4x³",
        hint: "(xⁿ)' = nxⁿ⁻¹ 공식 적용"
      },
      {
        problem: "f(x) = 3x² + 2x + 1을 미분하면?",
        solution: "f'(x) = 6x + 2 (상수 1의 미분은 0)",
        hint: "각 항을 따로 미분해서 더해요"
      },
      {
        problem: "f(x) = x⁵ - 3x³ + 7을 미분하면?",
        solution: "f'(x) = 5x⁴ - 9x² + 0 = 5x⁴ - 9x²",
        hint: "상수(7)의 미분은 0"
      }
    ],
    quiz: [
      {
        question: "(x⁶)'는?",
        options: ["x⁵", "6x⁵", "6x⁶", "5x⁵"],
        answer: 1,
        explanation: "(xⁿ)' = nxⁿ⁻¹ 이므로 (x⁶)' = 6x⁵"
      },
      {
        question: "(상수)' 의 값은?",
        options: ["1", "상수", "0", "∞"],
        answer: 2,
        explanation: "상수는 변화가 없으므로 미분하면 0이에요."
      },
      {
        question: "f(x) = 4x³ + 2x의 미분은?",
        options: ["12x² + 2", "4x² + 2", "12x³ + 2x", "12x + 2"],
        answer: 0,
        explanation: "(4x³)' = 12x², (2x)' = 2 이므로 f'(x) = 12x² + 2"
      }
    ],
    aiConnection: "AI 모델의 역전파(Backpropagation)는 이 미분 공식들을 자동으로 계산해요. PyTorch의 autograd가 바로 이걸 자동화한 것이에요."
  },
  {
    id: 8,
    title: "적분 기초",
    subtitle: "넓이와 누적을 계산하기",
    emoji: "📊",
    concepts: ["적분", "넓이", "∫", "부정적분"],
    explanation: `**적분**: 함수의 그래프 아래 넓이를 구하는 것 (미분의 반대!)

∫f(x)dx = F(x) + C
(F'(x) = f(x))

미분이 "순간 변화율"이라면,
적분은 "변화의 누적"이에요.

예: 속도를 시간에 대해 적분하면 → 이동 거리
매시간 기온을 적분하면 → 하루 평균 기온의 누적

**C**는 적분 상수: f'(x)가 같아도 원래 함수는 여러 개일 수 있어요.
예: x², x²+1, x²-5 모두 미분하면 2x`,
    examples: [
      {
        problem: "∫2x dx = ?",
        solution: "x² + C (미분하면 2x가 되는 함수)",
        hint: "2x를 적분하면 x²이 돼요"
      },
      {
        problem: "∫3 dx = ?",
        solution: "3x + C",
        hint: "상수를 적분하면 (상수)x가 돼요"
      },
      {
        problem: "속도 v(t) = 10t일 때, 0~2초 동안 이동 거리는?",
        solution: "∫₀² 10t dt = [5t²]₀² = 5×4 - 0 = 20m",
        hint: "정적분: 위끝 대입값 - 아래끝 대입값"
      }
    ],
    quiz: [
      {
        question: "적분은 미분의?",
        options: ["같은 것", "반대(역연산)", "두 배", "제곱"],
        answer: 1,
        explanation: "적분은 미분의 역연산이에요. F'(x) = f(x)이면 ∫f(x)dx = F(x) + C"
      },
      {
        question: "∫6x dx = ?",
        options: ["6", "6x²", "3x² + C", "6x + C"],
        answer: 2,
        explanation: "∫6x dx = 3x² + C (미분하면 6x가 되는 것은 3x²)"
      },
      {
        question: "적분 상수 C가 필요한 이유는?",
        options: [
          "계산이 틀렸기 때문에",
          "원래 함수가 여러 개일 수 있어서",
          "x = 0이 될 수 없어서",
          "항상 양수여야 해서"
        ],
        answer: 1,
        explanation: "x²와 x²+5는 미분하면 둘 다 2x가 돼요. 그래서 +C로 표현해요."
      }
    ],
    aiConnection: "AI에서 학습 곡선 아래 넓이(적분)는 전체 학습 성능을 나타내요. 또한 확률분포에서 확률값을 계산할 때 적분을 써요."
  },
  {
    id: 9,
    title: "기본 적분 공식",
    subtitle: "적분을 빠르게 계산하는 법",
    emoji: "🧮",
    concepts: ["거듭제곱 적분", "정적분", "넓이 계산"],
    explanation: `**핵심 적분 공식:**

1. **∫xⁿ dx = xⁿ⁺¹/(n+1) + C** (단, n ≠ -1)
   - ∫x² dx = x³/3 + C
   - ∫x³ dx = x⁴/4 + C

2. **∫a dx = ax + C** (상수 적분)
   - ∫5 dx = 5x + C

3. **정적분 계산법:**
   ∫ₐᵇ f(x) dx = F(b) - F(a)
   (b에서의 값 - a에서의 값)`,
    examples: [
      {
        problem: "∫x³ dx = ?",
        solution: "x⁴/4 + C",
        hint: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C"
      },
      {
        problem: "∫₁³ 2x dx = ?",
        solution: "[x²]₁³ = 3² - 1² = 9 - 1 = 8",
        hint: "∫2x dx = x², 그리고 위끝(3) - 아래끝(1)"
      },
      {
        problem: "∫₀² (x² + 1) dx = ?",
        solution: "[x³/3 + x]₀² = (8/3 + 2) - (0 + 0) = 8/3 + 2 = 14/3",
        hint: "각 항을 따로 적분하고 정적분 계산"
      }
    ],
    quiz: [
      {
        question: "∫x⁴ dx = ?",
        options: ["4x³ + C", "x⁵/5 + C", "x³/3 + C", "5x⁴ + C"],
        answer: 1,
        explanation: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C 이므로 ∫x⁴ dx = x⁵/5 + C"
      },
      {
        question: "∫₀¹ 2x dx = ?",
        options: ["1", "2", "0", "4"],
        answer: 0,
        explanation: "[x²]₀¹ = 1² - 0² = 1"
      },
      {
        question: "∫5 dx = ?",
        options: ["5", "5x", "5x + C", "0"],
        answer: 2,
        explanation: "상수 적분: ∫a dx = ax + C 이므로 ∫5 dx = 5x + C"
      }
    ],
    aiConnection: "확률 모델에서 특정 구간의 확률을 구할 때 정적분을 써요. 예: '키가 160~170cm인 사람의 비율'을 정규분포에서 정적분으로 계산해요."
  },
  {
    id: 10,
    title: "AI에서의 미적분",
    subtitle: "경사하강법으로 AI 학습하기",
    emoji: "🤖",
    concepts: ["경사하강법", "손실함수", "그래디언트", "역전파"],
    explanation: `드디어 AI에서 미적분이 어떻게 쓰이는지 배울 차례예요!

**손실함수(Loss Function)**: AI의 "오답률"을 수치화한 함수
- 예측값과 실제값의 차이를 측정
- L(w) = (예측값 - 실제값)²

**경사하강법(Gradient Descent)**:
손실함수를 최소화하는 파라미터 w를 찾는 방법

w_new = w - α × L'(w)

- L'(w): 손실의 미분값 (기울기/그래디언트)
- α (알파): 학습률 (얼마나 크게 이동할지)

산에서 내려올 때 경사(기울기)가 아래인 방향으로 걸으면 결국 골짜기(최솟값)에 도달하는 것과 같아요!`,
    examples: [
      {
        problem: "L(w) = (w - 3)²의 최솟값은 언제?",
        solution: "w = 3일 때 L = 0으로 최솟값. L'(w) = 2(w-3) = 0 → w = 3",
        hint: "미분해서 0이 되는 지점이 최솟값"
      },
      {
        problem: "w = 5, α = 0.1, L'(5) = 4 일 때, 한 번 업데이트 후 w는?",
        solution: "w_new = 5 - 0.1 × 4 = 5 - 0.4 = 4.6",
        hint: "w_new = w - α × 그래디언트"
      },
      {
        problem: "학습률 α가 너무 크면 어떤 문제가 생길까요?",
        solution: "최솟값을 지나쳐서 왔다갔다 하거나 발산(diverge)할 수 있어요.",
        hint: "산에서 너무 큰 걸음으로 내려가면 반대편으로 넘어가버리는 것처럼"
      }
    ],
    quiz: [
      {
        question: "경사하강법에서 그래디언트란?",
        options: [
          "함수의 최댓값",
          "손실함수의 미분값(기울기)",
          "학습률",
          "파라미터의 초기값"
        ],
        answer: 1,
        explanation: "그래디언트 = 손실함수를 파라미터로 미분한 값. 어느 방향으로 이동할지 알려줘요."
      },
      {
        question: "경사하강법의 목표는?",
        options: [
          "손실함수의 최댓값 찾기",
          "손실함수의 최솟값 찾기",
          "파라미터를 0으로 만들기",
          "학습률을 최대화하기"
        ],
        answer: 1,
        explanation: "AI 학습의 목표는 오차(손실)를 최소화하는 파라미터를 찾는 거예요."
      },
      {
        question: "역전파(Backpropagation)는 무엇인가요?",
        options: [
          "데이터를 거꾸로 입력하는 것",
          "연쇄법칙을 이용해 각 층의 그래디언트를 계산하는 알고리즘",
          "모델을 처음부터 다시 학습하는 것",
          "정확도를 계산하는 것"
        ],
        answer: 1,
        explanation: "역전파는 출력층에서 입력층 방향으로 미분(연쇄법칙)을 적용해 각 파라미터의 그래디언트를 계산해요."
      }
    ],
    aiConnection: "축하해요! 🎉 여기까지 왔다면 AI의 핵심 알고리즘인 경사하강법과 역전파를 이해할 수 있는 수학적 기초를 갖춘 거예요. 다음은 PyTorch나 TensorFlow로 직접 구현해보세요!"
  }
];
