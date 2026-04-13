export interface PyExample {
  problem: string;
  hint?: string;
  solution: string;
}

export interface PyQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface PyStep {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  concepts: string[];
  explanation: string;
  aiConnection: string;
  examples: PyExample[];
  quiz: PyQuiz[];
}

export const PY_CURRICULUM: PyStep[] = [
  {
    id: 1,
    title: "Python 첫걸음",
    subtitle: "변수, 자료형, 출력",
    emoji: "🐍",
    concepts: ["변수", "int/float/str", "print()", "type()"],
    explanation: `Python은 AI 연구자들이 가장 많이 쓰는 언어예요. 문법이 간단하고 AI 라이브러리가 풍부하기 때문이에요.

**변수와 자료형**
변수는 값을 담는 상자예요. Python은 자료형을 자동으로 알아내요.

x = 10        # 정수 (int)
y = 3.14      # 소수 (float)
name = "AI"   # 문자열 (str)
flag = True   # 참/거짓 (bool)

**출력과 확인**
print(x)          # 10
print(type(x))    # <class 'int'>
print(x + y)      # 13.14

**문자열 포매팅**
age = 15
print(f"나는 {age}살입니다")  # f-string 사용`,
    aiConnection: "AI 모델은 수천 개의 변수(가중치)를 다뤄요. Python의 변수 개념이 그 기초가 됩니다.",
    examples: [
      {
        problem: "변수 score에 95를 저장하고, '내 점수: 95점'을 출력하는 코드를 작성하세요.",
        hint: "f-string을 사용해보세요: f'내 점수: {변수}점'",
        solution: `score = 95\nprint(f"내 점수: {score}점")`,
      },
      {
        problem: "두 수 a = 7, b = 3을 저장하고 합, 차, 곱, 나눗셈 결과를 모두 출력하세요.",
        hint: "나눗셈은 / 연산자를 사용해요.",
        solution: `a = 7\nb = 3\nprint(a + b)  # 10\nprint(a - b)  # 4\nprint(a * b)  # 21\nprint(a / b)  # 2.333...`,
      },
      {
        problem: "사용자 이름 'AlphaGo'와 등급 1을 변수에 저장하고 'AlphaGo 1등급' 형식으로 출력하세요.",
        solution: `name = "AlphaGo"\nrank = 1\nprint(f"{name} {rank}등급")`,
      },
    ],
    quiz: [
      {
        question: "Python에서 소수를 저장하는 자료형은?",
        options: ["int", "float", "str", "bool"],
        answer: 1,
        explanation: "float(부동소수점)이 소수를 저장해요.",
      },
      {
        question: "x = 5일 때 print(type(x)) 출력 결과는?",
        options: ["int", "5", "<class 'int'>", "float"],
        answer: 2,
        explanation: "type()은 <class '자료형'>형식으로 출력해요.",
      },
      {
        question: "f-string 문법으로 올바른 것은?",
        options: ["f(name)", "f'{name}'", "f\"name\"", "%s % name"],
        answer: 1,
        explanation: "f'{변수명}' 형식으로 변수를 문자열 안에 넣어요.",
      },
      {
        question: "a = '3', b = '5'일 때 a + b 결과는?",
        options: ["8", "35", "'8'", "오류"],
        answer: 1,
        explanation: "문자열 + 문자열 = 이어붙이기(concatenation)이에요. '3' + '5' = '35'",
      },
    ],
  },
  {
    id: 2,
    title: "리스트와 반복",
    subtitle: "list, for loop, range",
    emoji: "📋",
    concepts: ["list", "for loop", "range()", "len()", "append()"],
    explanation: `리스트는 여러 값을 순서대로 담는 상자예요. AI에서는 데이터를 리스트로 많이 다뤄요.

**리스트 기본**
scores = [85, 92, 78, 96, 88]
print(scores[0])    # 85 (첫 번째)
print(scores[-1])   # 88 (마지막)
print(len(scores))  # 5

**리스트 조작**
scores.append(100)  # 끝에 추가
scores[0] = 90      # 첫 번째 값 변경

**for 반복문**
for s in scores:
    print(s)

**range()와 함께**
for i in range(5):   # 0,1,2,3,4
    print(i)

for i in range(1, 6): # 1,2,3,4,5
    print(i)`,
    aiConnection: "AI의 훈련 데이터는 수만 개의 숫자 리스트예요. for loop으로 전체 데이터를 순회하며 학습해요.",
    examples: [
      {
        problem: "1부터 10까지의 합을 for loop으로 계산하세요.",
        hint: "total = 0으로 시작하고 total += i로 더해가세요.",
        solution: `total = 0\nfor i in range(1, 11):\n    total += i\nprint(total)  # 55`,
      },
      {
        problem: "temperatures = [23, 27, 19, 31, 25] 리스트에서 평균을 구하세요.",
        hint: "sum()과 len()을 활용하거나 for loop을 사용해요.",
        solution: `temperatures = [23, 27, 19, 31, 25]\navg = sum(temperatures) / len(temperatures)\nprint(f"평균: {avg}°C")  # 평균: 25.0°C`,
      },
      {
        problem: "1~20 중 짝수만 리스트에 담아 출력하세요.",
        hint: "if i % 2 == 0 으로 짝수를 판별해요.",
        solution: `evens = []\nfor i in range(1, 21):\n    if i % 2 == 0:\n        evens.append(i)\nprint(evens)`,
      },
    ],
    quiz: [
      {
        question: "scores = [10, 20, 30]일 때 scores[1]은?",
        options: ["10", "20", "30", "오류"],
        answer: 1,
        explanation: "리스트 인덱스는 0부터 시작해요. [1]은 두 번째 요소 20이에요.",
      },
      {
        question: "range(3)이 생성하는 숫자는?",
        options: ["1,2,3", "0,1,2", "0,1,2,3", "1,2"],
        answer: 1,
        explanation: "range(3)은 0,1,2를 생성해요. 끝 숫자는 포함 안 돼요.",
      },
      {
        question: "리스트에 새 항목을 추가하는 메서드는?",
        options: ["add()", "push()", "append()", "insert()"],
        answer: 2,
        explanation: "list.append(값)으로 끝에 추가해요.",
      },
      {
        question: "for i in range(2, 5): print(i) 의 출력은?",
        options: ["2 3 4 5", "2 3 4", "1 2 3 4", "2 3"],
        answer: 1,
        explanation: "range(2, 5)는 2,3,4를 생성해요. 끝값 5는 포함 안 돼요.",
      },
    ],
  },
  {
    id: 3,
    title: "함수와 조건문",
    subtitle: "def, if/elif/else, return",
    emoji: "⚙️",
    concepts: ["def", "return", "if/elif/else", "함수 인자"],
    explanation: `함수는 특정 작업을 묶어 이름을 붙인 것이에요. AI 코드는 함수의 연속이에요.

**함수 정의**
def add(a, b):
    return a + b

result = add(3, 5)  # 8

**기본값 인자**
def greet(name, lang="ko"):
    if lang == "ko":
        return f"안녕, {name}!"
    return f"Hello, {name}!"

**조건문**
def grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    else:
        return "F"

print(grade(85))  # B`,
    aiConnection: "신경망의 활성화 함수(ReLU, sigmoid)는 Python 함수로 구현돼요. def relu(x): return max(0, x) 처럼요.",
    examples: [
      {
        problem: "두 수 중 큰 수를 반환하는 함수 max_of_two(a, b)를 만드세요.",
        hint: "if a > b: return a 로 시작해요.",
        solution: `def max_of_two(a, b):\n    if a > b:\n        return a\n    return b\n\nprint(max_of_two(7, 3))  # 7`,
      },
      {
        problem: "ReLU 함수를 구현하세요. ReLU(x) = x if x > 0 else 0",
        hint: "max(0, x)를 사용할 수도 있어요.",
        solution: `def relu(x):\n    if x > 0:\n        return x\n    return 0\n\n# 또는\ndef relu(x):\n    return max(0, x)\n\nprint(relu(3))   # 3\nprint(relu(-2))  # 0`,
      },
      {
        problem: "체온을 받아 '정상'(36-37.5), '미열'(37.5-38), '고열'(38 이상)을 반환하는 함수를 만드세요.",
        solution: `def fever_check(temp):\n    if temp < 37.5:\n        return "정상"\n    elif temp < 38:\n        return "미열"\n    else:\n        return "고열"\n\nprint(fever_check(37.8))  # 미열`,
      },
    ],
    quiz: [
      {
        question: "함수에서 값을 반환하는 키워드는?",
        options: ["result", "output", "return", "give"],
        answer: 2,
        explanation: "return 키워드로 값을 반환해요.",
      },
      {
        question: "def f(x=5): return x*2 에서 f()를 호출하면?",
        options: ["오류", "0", "5", "10"],
        answer: 3,
        explanation: "x=5가 기본값이므로 인자 없이 호출하면 x=5, 결과는 10이에요.",
      },
      {
        question: "ReLU 함수의 특징으로 올바른 것은?",
        options: ["항상 양수", "음수 입력은 0 출력", "0~1 사이 출력", "음수도 그대로 출력"],
        answer: 1,
        explanation: "ReLU(x) = max(0,x)로, 음수 입력은 0, 양수는 그대로 출력해요.",
      },
      {
        question: "elif는 어떤 상황에서 사용하나요?",
        options: ["첫 번째 조건", "두 번째 이후 조건", "항상 마지막", "반복문에서"],
        answer: 1,
        explanation: "elif는 if 이후 추가 조건을 검사할 때 사용해요.",
      },
    ],
  },
  {
    id: 4,
    title: "NumPy 기초",
    subtitle: "배열 연산, AI의 수학 도구",
    emoji: "🔢",
    concepts: ["numpy array", "shape", "벡터 연산", "브로드캐스팅"],
    explanation: `NumPy는 숫자 배열을 빠르게 계산하는 라이브러리예요. AI의 핵심 도구예요.

**NumPy 배열**
import numpy as np

a = np.array([1, 2, 3, 4, 5])
print(a.shape)   # (5,)
print(a.dtype)   # int64

**배열 연산 (요소별)**
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(a + b)    # [5, 7, 9]
print(a * 2)    # [2, 4, 6]
print(a ** 2)   # [1, 4, 9]

**유용한 함수들**
print(np.sum(a))    # 6
print(np.mean(a))   # 2.0
print(np.max(a))    # 3
print(np.min(a))    # 1

**2D 배열 (행렬)**
matrix = np.array([[1, 2], [3, 4]])
print(matrix.shape)  # (2, 2)`,
    aiConnection: "신경망의 가중치는 NumPy 배열로 저장돼요. 입력 데이터와 가중치의 행렬 곱이 신경망의 핵심 연산이에요.",
    examples: [
      {
        problem: "NumPy로 [1, 4, 9, 16, 25]의 평균, 최솟값, 최댓값을 구하세요.",
        hint: "np.mean(), np.min(), np.max()를 사용해요.",
        solution: `import numpy as np\narr = np.array([1, 4, 9, 16, 25])\nprint(np.mean(arr))  # 11.0\nprint(np.min(arr))   # 1\nprint(np.max(arr))   # 25`,
      },
      {
        problem: "시험 점수 [70, 85, 92, 78, 88]을 NumPy로 받아 평균 대비 차이를 구하세요.",
        hint: "배열 - 평균은 브로드캐스팅으로 자동 계산돼요.",
        solution: `import numpy as np\nscores = np.array([70, 85, 92, 78, 88])\nmean = np.mean(scores)\ndiff = scores - mean\nprint(f"평균: {mean}")\nprint(f"차이: {diff}")`,
      },
      {
        problem: "2×3 행렬을 만들고 shape를 확인한 뒤, 모든 요소에 2를 곱하세요.",
        solution: `import numpy as np\nm = np.array([[1, 2, 3], [4, 5, 6]])\nprint(m.shape)  # (2, 3)\nprint(m * 2)\n# [[ 2  4  6]\n#  [ 8 10 12]]`,
      },
    ],
    quiz: [
      {
        question: "np.array([1,2,3]).shape는?",
        options: ["3", "(3)", "(3,)", "[3]"],
        answer: 2,
        explanation: "1D 배열의 shape는 (요소 수,) 형태의 튜플이에요.",
      },
      {
        question: "a = np.array([1,2,3])일 때 a * 3은?",
        options: ["[1,2,3,1,2,3,1,2,3]", "[3,6,9]", "9", "오류"],
        answer: 1,
        explanation: "NumPy 배열은 브로드캐스팅으로 각 요소에 곱해요.",
      },
      {
        question: "AI에서 NumPy를 쓰는 주된 이유는?",
        options: ["그래프 그리기", "빠른 수치 연산", "파일 읽기", "인터넷 통신"],
        answer: 1,
        explanation: "NumPy는 C로 구현되어 순수 Python보다 수십~수백 배 빠른 수치 연산을 제공해요.",
      },
      {
        question: "np.mean([2, 4, 6, 8])의 결과는?",
        options: ["4", "5.0", "20", "4.0"],
        answer: 1,
        explanation: "(2+4+6+8)/4 = 20/4 = 5.0",
      },
    ],
  },
  {
    id: 5,
    title: "Pandas로 데이터 다루기",
    subtitle: "DataFrame, CSV, 데이터 분석",
    emoji: "🐼",
    concepts: ["DataFrame", "Series", "read_csv", "groupby", "describe()"],
    explanation: `Pandas는 표 형태의 데이터를 다루는 라이브러리예요. AI 훈련 데이터를 준비할 때 필수예요.

**DataFrame 만들기**
import pandas as pd

data = {
    "name": ["Alice", "Bob", "Charlie"],
    "score": [88, 92, 75],
    "age": [15, 16, 15]
}
df = pd.DataFrame(data)
print(df)

**기본 조회**
print(df.shape)        # (3, 3)
print(df.columns)      # 열 이름 목록
print(df["score"])     # score 열만
print(df.describe())   # 통계 요약

**필터링**
high = df[df["score"] >= 90]
print(high)

**CSV 파일 읽기**
df = pd.read_csv("data.csv")

**groupby**
avg = df.groupby("age")["score"].mean()`,
    aiConnection: "AI 프로젝트의 80%는 데이터 준비예요. Pandas로 데이터를 정리하고 이상값을 제거한 뒤 학습에 투입해요.",
    examples: [
      {
        problem: "학생 5명의 이름과 점수로 DataFrame을 만들고 80점 이상만 출력하세요.",
        hint: "df[df['score'] >= 80] 형태로 필터링해요.",
        solution: `import pandas as pd\ndata = {"name": ["Alice","Bob","Carol","Dave","Eve"],\n        "score": [92, 75, 88, 61, 95]}\ndf = pd.DataFrame(data)\nprint(df[df["score"] >= 80])`,
      },
      {
        problem: "위 DataFrame에서 평균 점수와 최고 점수를 구하세요.",
        hint: "df['score'].mean() 과 .max()를 사용해요.",
        solution: `print(f"평균: {df['score'].mean()}")\nprint(f"최고: {df['score'].max()}")`,
      },
      {
        problem: "점수를 기준으로 내림차순 정렬하여 출력하세요.",
        hint: "sort_values()를 사용하고 ascending=False로 설정해요.",
        solution: `sorted_df = df.sort_values("score", ascending=False)\nprint(sorted_df)`,
      },
    ],
    quiz: [
      {
        question: "DataFrame에서 특정 열만 선택하는 방법은?",
        options: ["df.score", "df[score]", "df['score']", "df.get(score)"],
        answer: 2,
        explanation: "df['열이름'] 형태로 특정 열을 선택해요.",
      },
      {
        question: "df.describe()가 반환하는 것은?",
        options: ["열 이름 목록", "행 수", "수치형 열의 통계 요약", "데이터 타입"],
        answer: 2,
        explanation: "describe()는 count, mean, std, min, max 등 통계 정보를 반환해요.",
      },
      {
        question: "CSV 파일을 읽는 Pandas 함수는?",
        options: ["pd.open()", "pd.load()", "pd.read_csv()", "pd.import()"],
        answer: 2,
        explanation: "pd.read_csv('파일경로')로 CSV를 DataFrame으로 읽어요.",
      },
      {
        question: "AI 프로젝트에서 Pandas를 주로 사용하는 단계는?",
        options: ["모델 설계", "데이터 준비·전처리", "모델 배포", "성능 측정"],
        answer: 1,
        explanation: "Pandas는 훈련 데이터를 불러오고 정리하는 전처리 단계에서 핵심적으로 사용돼요.",
      },
    ],
  },
  {
    id: 6,
    title: "matplotlib 시각화",
    subtitle: "데이터를 그래프로 표현하기",
    emoji: "📊",
    concepts: ["plot()", "scatter()", "hist()", "xlabel/ylabel", "plt.show()"],
    explanation: `데이터를 눈으로 보는 것은 AI 개발에 매우 중요해요. 학습 곡선, 데이터 분포를 시각화해요.

**기본 선 그래프**
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [1, 4, 9, 16, 25]

plt.plot(x, y, marker='o')
plt.xlabel("x")
plt.ylabel("y = x²")
plt.title("제곱 함수")
plt.show()

**산점도**
plt.scatter(x, y, color='red')
plt.show()

**히스토그램**
import numpy as np
data = np.random.randn(1000)
plt.hist(data, bins=30)
plt.show()

**여러 그래프**
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
plt.plot(x, y)
plt.subplot(1, 2, 2)
plt.scatter(x, y)
plt.show()`,
    aiConnection: "학습 손실(loss) 곡선을 그리면 모델이 잘 학습되고 있는지 확인할 수 있어요. 과적합도 그래프로 바로 보여요.",
    examples: [
      {
        problem: "에포크 1~10에서 손실값 [0.9, 0.7, 0.5, 0.4, 0.3, 0.25, 0.2, 0.18, 0.15, 0.12]을 선 그래프로 그리세요.",
        hint: "plt.plot()에 리스트를 전달하면 돼요.",
        solution: `import matplotlib.pyplot as plt\nepochs = list(range(1, 11))\nloss = [0.9, 0.7, 0.5, 0.4, 0.3, 0.25, 0.2, 0.18, 0.15, 0.12]\nplt.plot(epochs, loss, marker='o')\nplt.xlabel("Epoch")\nplt.ylabel("Loss")\nplt.title("학습 손실 곡선")\nplt.show()`,
      },
      {
        problem: "키 [160,165,170,175,180]와 몸무게 [55,60,65,70,75]로 산점도를 그리세요.",
        solution: `import matplotlib.pyplot as plt\nheight = [160, 165, 170, 175, 180]\nweight = [55, 60, 65, 70, 75]\nplt.scatter(height, weight)\nplt.xlabel("키(cm)")\nplt.ylabel("몸무게(kg)")\nplt.title("키-몸무게 관계")\nplt.show()`,
      },
      {
        problem: "정규분포를 따르는 데이터 500개를 생성하고 히스토그램으로 시각화하세요.",
        solution: `import numpy as np\nimport matplotlib.pyplot as plt\ndata = np.random.randn(500)\nplt.hist(data, bins=25, color='steelblue', edgecolor='black')\nplt.xlabel("값")\nplt.ylabel("빈도")\nplt.title("정규분포 히스토그램")\nplt.show()`,
      },
    ],
    quiz: [
      {
        question: "산점도를 그리는 matplotlib 함수는?",
        options: ["plt.line()", "plt.plot()", "plt.scatter()", "plt.dot()"],
        answer: 2,
        explanation: "plt.scatter(x, y)로 산점도를 그려요.",
      },
      {
        question: "그래프를 화면에 표시하는 명령어는?",
        options: ["plt.display()", "plt.render()", "plt.show()", "plt.draw()"],
        answer: 2,
        explanation: "plt.show()를 호출해야 그래프가 실제로 표시돼요.",
      },
      {
        question: "AI 훈련에서 loss 곡선을 그리는 주된 목적은?",
        options: ["그림 저장", "학습 진행 및 과적합 확인", "데이터 정리", "모델 배포"],
        answer: 1,
        explanation: "loss 곡선으로 모델이 잘 학습되는지, 과적합이 발생하는지 시각적으로 확인해요.",
      },
      {
        question: "plt.xlabel()의 역할은?",
        options: ["x축 범위 설정", "x축 레이블(이름) 설정", "x축 눈금 설정", "그래프 제목 설정"],
        answer: 1,
        explanation: "plt.xlabel('이름')으로 x축에 설명 레이블을 붙여요.",
      },
    ],
  },
  {
    id: 7,
    title: "scikit-learn 선형회귀",
    subtitle: "첫 번째 머신러닝 모델",
    emoji: "📈",
    concepts: ["LinearRegression", "fit()", "predict()", "train/test split", "MSE"],
    explanation: `scikit-learn은 Python의 대표적인 머신러닝 라이브러리예요. 선형회귀부터 시작해봐요.

**선형회귀란?**
데이터를 가장 잘 설명하는 직선 y = ax + b를 찾는 것이에요.

**코드 흐름**
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

# 데이터 준비
X = np.array([[1],[2],[3],[4],[5]])  # 입력 (2D!)
y = np.array([2, 4, 5, 4, 5])       # 정답

# 훈련/테스트 분리
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# 모델 학습
model = LinearRegression()
model.fit(X_train, y_train)

# 예측
y_pred = model.predict(X_test)
print(f"기울기: {model.coef_[0]:.2f}")
print(f"절편: {model.intercept_:.2f}")`,
    aiConnection: "선형회귀는 가장 단순한 AI 모델이에요. 복잡한 딥러닝도 본질적으로는 이 원리를 여러 층으로 쌓은 것이에요.",
    examples: [
      {
        problem: "공부 시간 [1,2,3,4,5]과 점수 [50,60,65,70,80]으로 선형회귀 모델을 만들고, 6시간 공부 시 점수를 예측하세요.",
        hint: "model.predict([[6]]) 형태로 예측해요. X는 2D 배열이어야 해요.",
        solution: `from sklearn.linear_model import LinearRegression\nimport numpy as np\nX = np.array([[1],[2],[3],[4],[5]])\ny = np.array([50, 60, 65, 70, 80])\nmodel = LinearRegression()\nmodel.fit(X, y)\nprint(model.predict([[6]]))  # 약 85`,
      },
      {
        problem: "모델의 기울기(coef_)와 절편(intercept_)을 출력하고 y = ax + b 형태로 표현하세요.",
        solution: `a = model.coef_[0]\nb = model.intercept_\nprint(f"y = {a:.1f}x + {b:.1f}")`,
      },
      {
        problem: "예측값과 실제값의 평균 오차(MSE)를 계산하세요.",
        hint: "from sklearn.metrics import mean_squared_error를 import해요.",
        solution: `from sklearn.metrics import mean_squared_error\ny_pred = model.predict(X)\nmse = mean_squared_error(y, y_pred)\nprint(f"MSE: {mse:.2f}")`,
      },
    ],
    quiz: [
      {
        question: "선형회귀에서 모델 학습에 사용하는 메서드는?",
        options: ["learn()", "train()", "fit()", "run()"],
        answer: 2,
        explanation: "model.fit(X, y)로 학습 데이터를 이용해 모델을 훈련시켜요.",
      },
      {
        question: "훈련/테스트 데이터를 분리하는 이유는?",
        options: ["데이터를 두 배로 늘리기 위해", "본 적 없는 데이터에 대한 성능 평가", "학습 속도 향상", "메모리 절약"],
        answer: 1,
        explanation: "테스트 데이터는 모델이 학습에 사용하지 않은 데이터로, 실제 예측 성능을 평가해요.",
      },
      {
        question: "MSE(Mean Squared Error)가 0에 가까울수록?",
        options: ["모델이 나쁘다", "예측이 정확하다", "데이터가 적다", "과적합이다"],
        answer: 1,
        explanation: "MSE는 예측값과 실제값의 차이 제곱의 평균이에요. 0에 가까울수록 예측이 정확해요.",
      },
      {
        question: "scikit-learn에서 예측하는 메서드는?",
        options: ["forecast()", "estimate()", "predict()", "calc()"],
        answer: 2,
        explanation: "model.predict(X_new)로 새 데이터에 대한 예측값을 반환해요.",
      },
    ],
  },
  {
    id: 8,
    title: "분류 모델 (KNN)",
    subtitle: "K-최근접 이웃 알고리즘",
    emoji: "🎯",
    concepts: ["KNeighborsClassifier", "분류", "accuracy_score", "confusion matrix"],
    explanation: `분류는 데이터를 카테고리로 나누는 것이에요. KNN은 가장 직관적인 분류 알고리즘이에요.

**KNN 개념**
새 데이터가 들어오면 가장 가까운 K개 이웃을 보고 다수결로 분류해요.

**코드 예시**
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Iris 데이터셋 (붓꽃 3종류 분류)
iris = load_iris()
X, y = iris.data, iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# KNN 모델
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

y_pred = knn.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"정확도: {acc * 100:.1f}%")

**정확도(Accuracy)**
정답 수 / 전체 수 × 100%`,
    aiConnection: "이미지 분류(고양이/개 구분), 스팸 메일 필터, 의료 진단 등이 모두 분류 문제예요. GPT도 다음 토큰 '분류'가 핵심이에요.",
    examples: [
      {
        problem: "Iris 데이터셋으로 KNN(k=5) 모델을 훈련하고 정확도를 출력하세요.",
        solution: `from sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42)\n\nknn = KNeighborsClassifier(n_neighbors=5)\nknn.fit(X_train, y_train)\nprint(f"정확도: {accuracy_score(y_test, knn.predict(X_test))*100:.1f}%")`,
      },
      {
        problem: "k=1, 3, 5, 7에서 정확도를 각각 출력하고 가장 좋은 k를 찾으세요.",
        hint: "for k in [1, 3, 5, 7]: 루프를 활용해요.",
        solution: `for k in [1, 3, 5, 7]:\n    knn = KNeighborsClassifier(n_neighbors=k)\n    knn.fit(X_train, y_train)\n    acc = accuracy_score(y_test, knn.predict(X_test))\n    print(f"k={k}: {acc*100:.1f}%")`,
      },
      {
        problem: "새 붓꽃 데이터 [[5.1, 3.5, 1.4, 0.2]]를 분류하고 클래스 이름을 출력하세요.",
        solution: `pred = knn.predict([[5.1, 3.5, 1.4, 0.2]])\nprint(iris.target_names[pred[0]])  # setosa`,
      },
    ],
    quiz: [
      {
        question: "KNN에서 K=3이면 예측 방식은?",
        options: ["3개의 먼 이웃 투표", "가장 가까운 3개 이웃 투표", "3번 반복 학습", "3개 레이어 사용"],
        answer: 1,
        explanation: "K=3이면 가장 가까운 3개 이웃의 클래스 중 다수를 선택해요.",
      },
      {
        question: "정확도(Accuracy) 계산식은?",
        options: ["오답수/전체", "정답수/전체", "전체/정답수", "정답수-오답수"],
        answer: 1,
        explanation: "Accuracy = 정답수/전체 (× 100%)",
      },
      {
        question: "분류(Classification)와 회귀(Regression)의 차이는?",
        options: ["분류는 수치 예측, 회귀는 카테고리", "분류는 카테고리, 회귀는 수치 예측", "둘 다 같다", "분류가 항상 더 정확하다"],
        answer: 1,
        explanation: "분류는 카테고리(개/고양이, 스팸/정상)를, 회귀는 연속 수치(집값, 온도)를 예측해요.",
      },
      {
        question: "Iris 데이터셋에는 몇 종류의 클래스가 있나요?",
        options: ["2", "3", "4", "5"],
        answer: 1,
        explanation: "Iris는 setosa, versicolor, virginica 3종류의 붓꽃을 분류해요.",
      },
    ],
  },
  {
    id: 9,
    title: "PyTorch 자동미분",
    subtitle: "Tensor와 autograd로 신경망 이해하기",
    emoji: "🔥",
    concepts: ["Tensor", "requires_grad", "backward()", "grad", "경사하강법"],
    explanation: `PyTorch는 딥러닝 프레임워크예요. autograd가 미분을 자동으로 계산해줘요.

**Tensor 기본**
import torch

x = torch.tensor(3.0, requires_grad=True)
y = x ** 2 + 2 * x + 1   # y = x² + 2x + 1

# 자동 미분 (역전파)
y.backward()
print(x.grad)  # dy/dx = 2x + 2 = 8.0

**실제 경사하강법**
# w는 학습할 가중치
w = torch.tensor(5.0, requires_grad=True)
lr = 0.1  # 학습률

for _ in range(10):
    loss = (w - 3) ** 2   # 목표: w → 3
    loss.backward()

    with torch.no_grad():
        w -= lr * w.grad
    w.grad.zero_()        # 그래디언트 초기화
    print(f"w={w.item():.3f}, loss={loss.item():.3f}")`,
    aiConnection: "딥러닝 학습의 핵심은 loss를 역전파해 각 가중치의 그래디언트를 구하는 것이에요. PyTorch의 autograd가 이를 자동화해요.",
    examples: [
      {
        problem: "y = 3x² - 4x + 1에서 x = 2일 때 dy/dx를 PyTorch로 계산하세요.",
        hint: "requires_grad=True를 설정하고 y.backward()를 호출해요.",
        solution: `import torch\nx = torch.tensor(2.0, requires_grad=True)\ny = 3 * x**2 - 4 * x + 1\ny.backward()\nprint(x.grad)  # 6*2 - 4 = 8.0`,
      },
      {
        problem: "loss = (w - 5)²를 최소화하는 w를 경사하강법(lr=0.1, 20번)으로 찾으세요.",
        solution: `import torch\nw = torch.tensor(0.0, requires_grad=True)\nfor i in range(20):\n    loss = (w - 5)**2\n    loss.backward()\n    with torch.no_grad():\n        w -= 0.1 * w.grad\n    w.grad.zero_()\nprint(f"w = {w.item():.3f}")  # 약 5.0`,
      },
      {
        problem: "torch.no_grad()를 사용하는 이유를 코드 주석으로 설명하고, 없으면 어떻게 되는지 서술하세요.",
        solution: `# torch.no_grad() 블록 안에서는 그래디언트를 추적하지 않아요.\n# 가중치 업데이트는 학습 과정이 아니라 단순 값 변경이므로\n# 그래디언트 그래프에 포함되면 안 돼요.\n# 없으면 업데이트 연산도 그래디언트 그래프에 포함되어\n# 다음 backward() 호출 시 오류가 발생해요.`,
      },
    ],
    quiz: [
      {
        question: "PyTorch에서 자동미분을 활성화하는 설정은?",
        options: ["autograd=True", "requires_grad=True", "compute_grad=True", "gradient=True"],
        answer: 1,
        explanation: "tensor를 만들 때 requires_grad=True로 설정하면 이후 연산의 그래디언트가 추적돼요.",
      },
      {
        question: "역전파를 실행하는 메서드는?",
        options: ["compute()", "differentiate()", "backward()", "gradient()"],
        answer: 2,
        explanation: "loss.backward()를 호출하면 연산 그래프를 역방향으로 탐색해 그래디언트를 계산해요.",
      },
      {
        question: "매 반복마다 w.grad.zero_()를 하는 이유는?",
        options: ["속도 향상", "그래디언트 누적 방지", "메모리 절약", "정확도 향상"],
        answer: 1,
        explanation: "PyTorch는 그래디언트를 누적해요. 이전 그래디언트가 남아있으면 잘못된 업데이트가 되므로 매번 초기화해요.",
      },
      {
        question: "w = 10이고 loss = (w - 3)², lr = 0.1일 때 한 번 업데이트 후 w는?",
        options: ["10 - 0.1×14 = 8.6", "10 - 14 = -4", "10 - 0.1×2 = 9.8", "10 - 0.1×7 = 9.3"],
        answer: 0,
        explanation: "d/dw(w-3)² = 2(w-3) = 14, w_new = 10 - 0.1×14 = 8.6",
      },
    ],
  },
  {
    id: 10,
    title: "첫 번째 신경망",
    subtitle: "PyTorch로 XOR 문제 풀기",
    emoji: "🧠",
    concepts: ["nn.Module", "Linear", "ReLU", "BCELoss", "optimizer", "epoch"],
    explanation: `드디어 진짜 신경망이에요! XOR 문제를 신경망으로 풀어봐요.

**신경망 구조 정의**
import torch
import torch.nn as nn

class XORNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(2, 4),   # 입력층→은닉층
            nn.ReLU(),
            nn.Linear(4, 1),   # 은닉층→출력층
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)

**학습 루프**
model = XORNet()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
criterion = nn.BCELoss()

X = torch.tensor([[0,0],[0,1],[1,0],[1,1]], dtype=torch.float)
y = torch.tensor([[0],[1],[1],[0]], dtype=torch.float)

for epoch in range(1000):
    pred = model(X)
    loss = criterion(pred, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

print(model(X).round())  # XOR 결과 확인`,
    aiConnection: "이 신경망이 ChatGPT, 이미지 인식, 음성 인식의 기본 구조예요. 층이 수백 개, 파라미터가 수십억 개로 커진 것이 GPT예요.",
    examples: [
      {
        problem: "위 XORNet을 그대로 구현하고 1000번 학습 후 손실값과 예측 결과를 출력하세요.",
        solution: `import torch\nimport torch.nn as nn\n\nclass XORNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(2, 4), nn.ReLU(),\n            nn.Linear(4, 1), nn.Sigmoid())\n    def forward(self, x):\n        return self.net(x)\n\nX = torch.tensor([[0,0],[0,1],[1,0],[1,1]], dtype=torch.float)\ny = torch.tensor([[0],[1],[1],[0]], dtype=torch.float)\nmodel = XORNet()\noptimizer = torch.optim.Adam(model.parameters(), lr=0.01)\ncriterion = nn.BCELoss()\n\nfor epoch in range(1000):\n    pred = model(X)\n    loss = criterion(pred, y)\n    optimizer.zero_grad()\n    loss.backward()\n    optimizer.step()\n\nprint(f"Loss: {loss.item():.4f}")\nprint(model(X).round())`,
      },
      {
        problem: "은닉층 뉴런 수를 4 → 8로 늘리고 결과가 달라지는지 비교하세요.",
        hint: "nn.Linear(2, 8)로 첫 번째 레이어를 변경하고 nn.Linear(8, 1)로 두 번째도 바꿔요.",
        solution: `class XORNet8(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(2, 8), nn.ReLU(),\n            nn.Linear(8, 1), nn.Sigmoid())\n    def forward(self, x):\n        return self.net(x)\n\n# 위와 동일한 학습 코드로 비교`,
      },
      {
        problem: "학습 중 100 에포크마다 손실을 출력하도록 수정하세요.",
        hint: "if (epoch + 1) % 100 == 0: 조건을 사용해요.",
        solution: `for epoch in range(1000):\n    pred = model(X)\n    loss = criterion(pred, y)\n    optimizer.zero_grad()\n    loss.backward()\n    optimizer.step()\n    if (epoch + 1) % 100 == 0:\n        print(f"Epoch {epoch+1}: loss = {loss.item():.4f}")`,
      },
    ],
    quiz: [
      {
        question: "nn.Sequential에서 레이어를 쌓는 순서는?",
        options: ["출력→은닉→입력", "입력→은닉→출력", "랜덤 순서", "알파벳 순"],
        answer: 1,
        explanation: "데이터 흐름 방향대로 입력층→은닉층→출력층 순서로 쌓아요.",
      },
      {
        question: "optimizer.zero_grad()를 학습 루프에서 매번 하는 이유는?",
        options: ["속도 향상", "이전 그래디언트 누적 방지", "모델 초기화", "손실 감소"],
        answer: 1,
        explanation: "PyTorch는 그래디언트를 누적하므로 매 반복마다 초기화해야 정확한 업데이트가 돼요.",
      },
      {
        question: "BCELoss는 어떤 문제에 사용하나요?",
        options: ["다중 클래스 분류", "이진 분류(0/1)", "회귀", "강화학습"],
        answer: 1,
        explanation: "BCELoss(Binary Cross Entropy Loss)는 0 또는 1을 출력하는 이진 분류에 사용해요.",
      },
      {
        question: "신경망이 XOR를 학습할 수 있는 이유는?",
        options: ["선형 분리가 가능해서", "은닉층이 비선형 변환을 제공해서", "데이터가 충분해서", "에포크가 많아서"],
        answer: 1,
        explanation: "XOR은 선형으로 분리 불가능해요. 은닉층의 비선형 활성화 함수(ReLU)가 비선형 경계를 만들어줘요.",
      },
    ],
  },
];
