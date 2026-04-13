// 각 단계별 도전 퀴즈 (5문제, 4개 이상 맞아야 통과)
export interface ChallengeQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const CHALLENGE: Record<number, ChallengeQuiz[]> = {
  1: [
    {
      question: "f(x) = 2x² - 3x + 1일 때, f(2)는?",
      options: ["1", "2", "3", "4"],
      answer: 2,
      explanation: "2(4) - 3(2) + 1 = 8 - 6 + 1 = 3",
    },
    {
      question: "x = -2일 때, x³ + 2x² - x + 1의 값은?",
      options: ["1", "3", "5", "-1"],
      answer: 1,
      explanation: "-8 + 8 + 2 + 1 = 3",
    },
    {
      question: "a = 3, b = -2일 때 (a - b)²는?",
      options: ["1", "25", "5", "10"],
      answer: 1,
      explanation: "(3 - (-2))² = 5² = 25",
    },
    {
      question: "x = 1/2일 때, 4x² - 4x + 1의 값은?",
      options: ["0", "1", "2", "-1"],
      answer: 0,
      explanation: "4(1/4) - 4(1/2) + 1 = 1 - 2 + 1 = 0",
    },
    {
      question: "f(x) = x² - 1, g(x) = x + 1일 때 f(2) / g(1)는?",
      options: ["1", "3/2", "2", "5/2"],
      answer: 1,
      explanation: "f(2) = 3, g(1) = 2, 3/2",
    },
  ],
  2: [
    {
      question: "f(x) = 2x + 1일 때, f(f(2))는?",
      options: ["7", "9", "11", "13"],
      answer: 2,
      explanation: "f(2) = 5, f(5) = 11",
    },
    {
      question: "f(x) = x² - 1일 때, f(3) - f(-2)는?",
      options: ["3", "5", "7", "8"],
      answer: 1,
      explanation: "f(3) = 8, f(-2) = 3, 8 - 3 = 5",
    },
    {
      question: "f(x) = 3x - 2일 때, f(x) = 7을 만족하는 x는?",
      options: ["2", "3", "4", "5"],
      answer: 1,
      explanation: "3x - 2 = 7 → x = 3",
    },
    {
      question: "f(x) = x² + x일 때, f(a+1) - f(a)는?",
      options: ["1", "2a", "2a + 2", "a + 1"],
      answer: 2,
      explanation: "(a+1)² + (a+1) - a² - a = 2a + 1 + 1 = 2a + 2",
    },
    {
      question: "f(x) = |x - 2| + 1일 때, f(-1) + f(3)는?",
      options: ["5", "6", "7", "8"],
      answer: 1,
      explanation: "f(-1) = 3 + 1 = 4, f(3) = 1 + 1 = 2, 합 = 6",
    },
  ],
  3: [
    {
      question: "(2, 3)과 (4, 7)을 지나는 직선의 방정식은?",
      options: ["y = x + 1", "y = 2x - 1", "y = 2x + 1", "y = x + 3"],
      answer: 1,
      explanation: "기울기 = (7-3)/(4-2) = 2, y = 2x + b → 3 = 4 + b → b = -1",
    },
    {
      question: "y = 3x - 2와 수직인 직선의 기울기는?",
      options: ["3", "-3", "1/3", "-1/3"],
      answer: 3,
      explanation: "수직인 직선의 기울기는 원래 기울기의 역수에 음수 → -1/3",
    },
    {
      question: "x절편이 2, y절편이 -4인 직선의 기울기는?",
      options: ["1", "2", "-2", "-1"],
      answer: 1,
      explanation: "두 점 (2, 0), (0, -4)를 지남. 기울기 = (0-(-4))/(2-0) = 2",
    },
    {
      question: "y = 2x + k가 점 (3, 5)를 지날 때 k는?",
      options: ["-2", "-1", "0", "1"],
      answer: 1,
      explanation: "5 = 2(3) + k → k = -1",
    },
    {
      question: "두 직선 y = 3x + 1, y = -x + 5의 교점은?",
      options: ["(1, 4)", "(2, 3)", "(0, 1)", "(1, 3)"],
      answer: 0,
      explanation: "3x + 1 = -x + 5 → 4x = 4 → x = 1, y = 4",
    },
  ],
  4: [
    {
      question: "y = x² - 4x + 3의 꼭짓점은?",
      options: ["(2, -1)", "(2, 1)", "(-2, -1)", "(1, 0)"],
      answer: 0,
      explanation: "y = (x-2)² - 1, 꼭짓점 (2, -1)",
    },
    {
      question: "y = -x² + 2x + 3의 최댓값은?",
      options: ["2", "3", "4", "5"],
      answer: 2,
      explanation: "y = -(x-1)² + 4, 최댓값 = 4",
    },
    {
      question: "y = x² - 6x + k의 최솟값이 2이면 k는?",
      options: ["9", "10", "11", "12"],
      answer: 2,
      explanation: "y = (x-3)² + k - 9, 최솟값 = k - 9 = 2 → k = 11",
    },
    {
      question: "y = (x-3)(x+1)에서 이 함수가 음수인 x의 범위는?",
      options: ["x < -1 또는 x > 3", "-1 < x < 3", "x < 3", "x > -1"],
      answer: 1,
      explanation: "포물선이 아래로 볼록하고 x절편이 -1, 3이므로 -1 < x < 3에서 음수",
    },
    {
      question: "y = 2x² + 4x - 1의 판별식이 양수일 때의 해석은?",
      options: [
        "x축과 만나지 않는다",
        "x축에 접한다",
        "x축과 두 점에서 만난다",
        "항상 양수다",
      ],
      answer: 2,
      explanation: "판별식 D = 16 + 8 = 24 > 0이면 x축과 두 점에서 만남",
    },
  ],
  5: [
    {
      question: "lim(x→2) (x² - 4) / (x - 2) = ?",
      options: ["2", "4", "0", "∞"],
      answer: 1,
      explanation: "(x-2)(x+2)/(x-2) = x+2 → x→2이면 4",
    },
    {
      question: "lim(x→∞) (3x² + 1) / (x² - x) = ?",
      options: ["0", "1", "3", "∞"],
      answer: 2,
      explanation: "최고차항 계수의 비: 3/1 = 3",
    },
    {
      question: "lim(x→1) (x³ - 1) / (x - 1) = ?",
      options: ["0", "1", "2", "3"],
      answer: 3,
      explanation: "x³-1 = (x-1)(x²+x+1)이므로 x²+x+1 → 1+1+1 = 3",
    },
    {
      question: "lim(x→∞) (2x + 3) / (x + 1) = ?",
      options: ["1", "2", "3", "∞"],
      answer: 1,
      explanation: "분자·분모를 x로 나누면 (2 + 3/x) / (1 + 1/x) → 2/1 = 2",
    },
    {
      question: "lim(n→∞) (n + 2) / (2n - 1) = ?",
      options: ["0", "1/2", "1", "2"],
      answer: 1,
      explanation: "n으로 나누면 (1 + 2/n) / (2 - 1/n) → 1/2",
    },
  ],
  6: [
    {
      question: "f(x) = x³ - 3x일 때, f'(2)는?",
      options: ["3", "6", "9", "12"],
      answer: 2,
      explanation: "f'(x) = 3x² - 3, f'(2) = 12 - 3 = 9",
    },
    {
      question: "y = x² + x에서 x = 1인 점의 접선 기울기는?",
      options: ["1", "2", "3", "4"],
      answer: 2,
      explanation: "y' = 2x + 1, x=1이면 3",
    },
    {
      question: "거리 s(t) = t² + 3t일 때 t = 2에서 순간속도는?",
      options: ["5", "7", "9", "11"],
      answer: 1,
      explanation: "s'(t) = 2t + 3, s'(2) = 7",
    },
    {
      question: "f(x) = x²이고 f'(a) = 6일 때 a는?",
      options: ["2", "3", "4", "6"],
      answer: 1,
      explanation: "f'(x) = 2x, 2a = 6 → a = 3",
    },
    {
      question: "f(x) = (x - 1)²를 전개 후 미분하면?",
      options: ["2x - 1", "2x - 2", "x - 1", "2x + 2"],
      answer: 1,
      explanation: "f(x) = x² - 2x + 1, f'(x) = 2x - 2",
    },
  ],
  7: [
    {
      question: "f(x) = x⁴ - 2x³ + 3x - 1, f'(x)는?",
      options: [
        "4x³ - 6x² + 3",
        "4x³ - 6x² + 3x",
        "x³ - x² + 3",
        "4x⁴ - 6x³ + 3",
      ],
      answer: 0,
      explanation: "4x³ - 6x² + 3 (상수 미분 → 0)",
    },
    {
      question: "f(x) = 2x³ - x², f'(x) = 0인 x는? (x ≠ 0)",
      options: ["1/6", "1/4", "1/3", "1/2"],
      answer: 2,
      explanation: "f'(x) = 6x² - 2x = 2x(3x - 1) = 0 → x = 0 또는 x = 1/3",
    },
    {
      question: "y = (x² + 1)²를 전개 후 미분하면?",
      options: ["2x(x²+1)", "4x³ + 4x", "4x² + 2", "2x² + 2"],
      answer: 1,
      explanation: "y = x⁴ + 2x² + 1, y' = 4x³ + 4x",
    },
    {
      question: "f'(x) = 3x² - 2x일 때 f(x)의 한 형태는?",
      options: ["x³ - x² + 1", "x³ - x²", "3x³ - 2x²", "x² - x"],
      answer: 1,
      explanation: "∫(3x² - 2x)dx = x³ - x² + C",
    },
    {
      question: "가속도 a(t) = 6t + 2일 때 t = 1에서 값은?",
      options: ["6", "7", "8", "9"],
      answer: 2,
      explanation: "a(1) = 6(1) + 2 = 8",
    },
  ],
  8: [
    {
      question: "∫(x² + 2x)dx = ?",
      options: [
        "2x + 2 + C",
        "x³/3 + x² + C",
        "x³ + x² + C",
        "x²/2 + x + C",
      ],
      answer: 1,
      explanation: "∫x²dx = x³/3, ∫2x dx = x²",
    },
    {
      question: "∫₀³ (2x - 1)dx = ?",
      options: ["3", "4", "5", "6"],
      answer: 3,
      explanation: "[x² - x]₀³ = 9 - 3 - 0 = 6",
    },
    {
      question: "∫₁² (3x² - 2x)dx = ?",
      options: ["2", "3", "4", "5"],
      answer: 2,
      explanation: "[x³ - x²]₁² = (8-4) - (1-1) = 4",
    },
    {
      question: "F(x) = ∫4x³ dx이고 F(0) = 1이면 F(x)는?",
      options: ["x⁴", "x⁴ + 1", "4x⁴ + 1", "x⁴ - 1"],
      answer: 1,
      explanation: "∫4x³ dx = x⁴ + C, F(0) = C = 1, F(x) = x⁴ + 1",
    },
    {
      question: "∫₋₁¹ x³ dx = ? (홀함수의 성질)",
      options: ["1/4", "1/2", "0", "2"],
      answer: 2,
      explanation: "홀함수(f(-x)=-f(x))의 대칭 구간 적분은 0",
    },
  ],
  9: [
    {
      question: "∫(x³ + 2x² - x + 1)dx = ?",
      options: [
        "x⁴/4 + 2x³/3 - x²/2 + x + C",
        "3x² + 4x - 1 + C",
        "x⁴ + x³ - x² + C",
        "x⁴/4 + x³ - x² + x + C",
      ],
      answer: 0,
      explanation: "각 항을 따로 적분",
    },
    {
      question: "∫₀² (x² + x)dx = ?",
      options: ["10/3", "14/3", "16/3", "4"],
      answer: 1,
      explanation: "[x³/3 + x²/2]₀² = 8/3 + 2 = 14/3",
    },
    {
      question: "F'(x) = 2x + 1이고 F(1) = 3이면 F(x)는?",
      options: [
        "x² + x + 1",
        "x² + x",
        "x² + x + 2",
        "2x² + x + 1",
      ],
      answer: 0,
      explanation: "F(x) = x² + x + C, F(1) = 1 + 1 + C = 3 → C = 1",
    },
    {
      question: "y = x² - 1과 x축 사이 (-1 ≤ x ≤ 1) 넓이는?",
      options: ["2/3", "4/3", "1", "2"],
      answer: 1,
      explanation: "∫₋₁¹(1-x²)dx = [x - x³/3]₋₁¹ = (1-1/3)-(-1+1/3) = 4/3",
    },
    {
      question: "∫₁⁴ (2√x)dx = ? (√x = x^(1/2))",
      options: ["14/3", "28/3", "7", "4"],
      answer: 1,
      explanation: "∫2x^(1/2)dx = [4x^(3/2)/3]₁⁴ = 32/3 - 4/3 = 28/3",
    },
  ],
  10: [
    {
      question: "L(w) = (w - 3)², 경사하강법 w=5, α=0.1 적용 후 w는?",
      options: ["4.6", "4.8", "5.2", "3.0"],
      answer: 0,
      explanation: "L'(w)=2(w-3), L'(5)=4, w_new=5-0.1×4=4.6",
    },
    {
      question: "L(w) = w² + 2w + 5의 최솟값은?",
      options: ["2", "4", "5", "6"],
      answer: 1,
      explanation: "L'(w)=2w+2=0 → w=-1, L(-1)=1-2+5=4",
    },
    {
      question: "L(w) = (w - 2)²에서 L'(w) = 0인 w는?",
      options: ["0", "1", "2", "4"],
      answer: 2,
      explanation: "L'(w)=2(w-2)=0 → w=2 (최솟값 위치)",
    },
    {
      question: "학습률(α)이 너무 크면 어떤 문제가 생기나?",
      options: [
        "학습이 느려진다",
        "최솟값을 지나쳐 발산할 수 있다",
        "그래디언트가 0이 된다",
        "손실함수가 커진다",
      ],
      answer: 1,
      explanation: "너무 큰 학습률은 최솟값을 지나쳐 왔다갔다 하거나 발산해요.",
    },
    {
      question: "역전파(Backpropagation)에서 핵심으로 사용되는 수학 규칙은?",
      options: ["극한 법칙", "연쇄법칙(Chain Rule)", "적분 공식", "테일러 급수"],
      answer: 1,
      explanation: "역전파는 연쇄법칙 df/dx = df/dg × dg/dx을 반복 적용해 각 층의 그래디언트를 계산해요.",
    },
  ],
};
