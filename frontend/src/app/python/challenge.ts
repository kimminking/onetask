export interface PyChallengeQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const PY_CHALLENGE: Record<number, PyChallengeQuiz[]> = {
  1: [
    {
      question: "x = '10'일 때 int(x) + 5의 결과는?",
      options: ["'105'", "15", "오류", "10"],
      answer: 1,
      explanation: "int('10')은 문자열 '10'을 정수 10으로 변환해요. 10 + 5 = 15",
    },
    {
      question: "a = 5, b = 2일 때 a // b와 a % b는 각각?",
      options: ["2.5, 0", "2, 1", "2.5, 1", "3, 0"],
      answer: 1,
      explanation: "// 는 정수 나눗셈(몫), % 는 나머지예요. 5//2=2, 5%2=1",
    },
    {
      question: "name = 'Python'일 때 name[2:5]는?",
      options: ["Pyt", "tho", "yth", "hon"],
      answer: 1,
      explanation: "슬라이싱 [2:5]는 인덱스 2,3,4의 문자를 반환해요. 'P','y','t','h','o','n' 중 'tho'",
    },
    {
      question: "x = 3; print(x > 2 and x < 5) 의 결과는?",
      options: ["False", "True", "1", "오류"],
      answer: 1,
      explanation: "3 > 2는 True, 3 < 5는 True. True and True = True",
    },
    {
      question: "다음 중 Python에서 유효한 변수명은?",
      options: ["2score", "my-name", "_result", "class"],
      answer: 2,
      explanation: "변수명은 숫자로 시작 불가, 하이픈 불가, 예약어(class) 불가. _로 시작하는 건 유효해요.",
    },
  ],
  2: [
    {
      question: "a = [1,2,3]; b = a; b.append(4); print(a)의 결과는?",
      options: ["[1,2,3]", "[1,2,3,4]", "[4]", "오류"],
      answer: 1,
      explanation: "b = a는 복사가 아니라 같은 리스트를 가리켜요. b.append(4)는 a에도 영향을 줘요.",
    },
    {
      question: "[i**2 for i in range(1,6)]의 결과는?",
      options: ["[1,2,3,4,5]", "[1,4,9,16,25]", "[2,4,6,8,10]", "오류"],
      answer: 1,
      explanation: "리스트 컴프리헨션으로 1~5의 제곱을 생성해요.",
    },
    {
      question: "for i in range(10, 0, -2): 에서 생성되는 숫자는?",
      options: ["10,8,6,4,2", "10,8,6,4,2,0", "8,6,4,2", "10,9,8,...,1"],
      answer: 0,
      explanation: "range(10, 0, -2)는 10부터 0(미포함)까지 -2씩 감소: 10,8,6,4,2",
    },
    {
      question: "words = ['ai','ml','dl']; print(','.join(words))의 결과는?",
      options: ["['ai','ml','dl']", "ai ml dl", "ai,ml,dl", "aimlDL"],
      answer: 2,
      explanation: "'구분자'.join(리스트)는 리스트 요소를 구분자로 연결한 문자열을 반환해요.",
    },
    {
      question: "다음 중 리스트에서 특정 값의 인덱스를 찾는 메서드는?",
      options: ["find()", "search()", "index()", "locate()"],
      answer: 2,
      explanation: "list.index(값)으로 해당 값의 인덱스를 반환해요. 없으면 ValueError가 발생해요.",
    },
  ],
  3: [
    {
      question: "재귀함수 def f(n): return n if n<=1 else n*f(n-1) 에서 f(4)는?",
      options: ["4", "8", "12", "24"],
      answer: 3,
      explanation: "팩토리얼 함수예요. f(4)=4×f(3)=4×3×f(2)=4×3×2×f(1)=4×3×2×1=24",
    },
    {
      question: "def f(*args): return sum(args) 에서 f(1,2,3,4)는?",
      options: ["오류", "10", "[1,2,3,4]", "(1,2,3,4)"],
      answer: 1,
      explanation: "*args는 가변 인자로 튜플로 받아요. sum((1,2,3,4))=10",
    },
    {
      question: "lambda x: x**2 + 1 에서 x=3 입력 시 결과는?",
      options: ["7", "9", "10", "4"],
      answer: 2,
      explanation: "3**2 + 1 = 9 + 1 = 10",
    },
    {
      question: "def f(x, y=10): return x+y 에서 f(5)와 f(5,3)의 결과는?",
      options: ["5, 5", "15, 8", "오류, 8", "10, 3"],
      answer: 1,
      explanation: "f(5)는 y=10(기본값) → 15. f(5,3)은 y=3 → 8",
    },
    {
      question: "클로저(closure)에서 내부 함수가 외부 함수 변수를 참조할 수 있는 이유는?",
      options: ["전역 변수이기 때문", "자유 변수(free variable)로 캡처되기 때문", "클래스를 사용해서", "return이 없어서"],
      answer: 1,
      explanation: "내부 함수는 외부 함수의 변수를 자유 변수로 캡처해요. 이것이 클로저의 핵심이에요.",
    },
  ],
  4: [
    {
      question: "np.zeros((3,4)).shape는?",
      options: ["(3,)", "(4,3)", "(3,4)", "12"],
      answer: 2,
      explanation: "np.zeros((3,4))는 3행 4열의 0으로 채워진 배열이에요. shape=(3,4)",
    },
    {
      question: "a = np.array([1,2,3]); b = np.array([4,5,6]); np.dot(a,b)는?",
      options: ["[4,10,18]", "15", "32", "오류"],
      answer: 2,
      explanation: "내적(dot product): 1×4 + 2×5 + 3×6 = 4+10+18 = 32",
    },
    {
      question: "np.arange(0, 1, 0.25)의 결과는?",
      options: ["[0,1]", "[0,0.25,0.5,0.75]", "[0,0.25,0.5,0.75,1]", "[1,2,3,4]"],
      answer: 1,
      explanation: "arange(시작, 끝, 간격)으로 0부터 1(미포함)까지 0.25 간격으로 생성해요.",
    },
    {
      question: "a = np.array([[1,2],[3,4]]); a.T는?",
      options: ["[[1,2],[3,4]]", "[[1,3],[2,4]]", "[1,2,3,4]", "오류"],
      answer: 1,
      explanation: ".T는 전치(transpose)예요. 행과 열이 바뀌어 [[1,3],[2,4]]가 돼요.",
    },
    {
      question: "np.argmax([3, 7, 2, 9, 1])의 결과는?",
      options: ["9", "3", "4", "7"],
      answer: 1,
      explanation: "argmax는 최댓값의 인덱스를 반환해요. [3,7,2,9,1]에서 최댓값 9의 인덱스는 3이에요.",
    },
  ],
  5: [
    {
      question: "df.dropna()는 어떤 역할을 하나요?",
      options: ["NA를 0으로 채움", "결측값(NaN) 행 제거", "열 이름 변경", "데이터 정렬"],
      answer: 1,
      explanation: "dropna()는 NaN(결측값)이 있는 행을 제거해요. fillna(값)은 채우는 방법이에요.",
    },
    {
      question: "df.groupby('city')['sales'].sum() 의 의미는?",
      options: ["city 열 삭제", "도시별 sales 합계", "sales 중복 제거", "city 정렬"],
      answer: 1,
      explanation: "groupby로 city별 그룹을 만들고 각 그룹의 sales를 합산해요.",
    },
    {
      question: "df.shape가 (100, 5)일 때 df.iloc[99]는?",
      options: ["99번째 열", "마지막 행", "100번째 열", "오류"],
      answer: 1,
      explanation: "iloc는 정수 인덱스로 접근해요. 인덱스 0~99이므로 iloc[99]는 마지막(100번째) 행이에요.",
    },
    {
      question: "df['score'].value_counts()가 반환하는 것은?",
      options: ["고유값 수", "각 값의 등장 횟수", "평균값", "중앙값"],
      answer: 1,
      explanation: "value_counts()는 각 고유값이 몇 번 등장하는지 세어 반환해요.",
    },
    {
      question: "머신러닝 데이터 전처리에서 정규화(Normalization)의 목적은?",
      options: ["데이터 삭제", "모든 특성을 비슷한 범위로 맞추기", "데이터 복사", "결측값 채우기"],
      answer: 1,
      explanation: "특성마다 범위가 다르면 큰 범위 특성이 학습을 지배해요. 정규화로 0~1 또는 -1~1로 맞춰요.",
    },
  ],
  6: [
    {
      question: "plt.subplot(2, 3, 4)는 어느 위치에 그래프를 그리나요?",
      options: ["2행 3열의 첫 번째", "2행 3열의 4번째", "4행 2열의 3번째", "3행 2열의 4번째"],
      answer: 1,
      explanation: "subplot(행, 열, 위치번호). 2행 3열 그리드의 4번째 칸(2행 1열)이에요.",
    },
    {
      question: "plt.savefig('output.png')의 역할은?",
      options: ["파일에서 이미지 불러오기", "그래프를 파일로 저장", "화면 지우기", "그래프 크기 설정"],
      answer: 1,
      explanation: "savefig()로 현재 그래프를 PNG, PDF, SVG 등으로 저장해요.",
    },
    {
      question: "학습 곡선에서 훈련 손실은 낮고 검증 손실이 높다면?",
      options: ["과소적합", "과적합", "정상 학습", "데이터 오류"],
      answer: 1,
      explanation: "과적합(Overfitting): 훈련 데이터엔 잘 맞지만 새 데이터엔 성능이 낮아요.",
    },
    {
      question: "plt.figure(figsize=(10, 6))에서 숫자의 단위는?",
      options: ["픽셀", "인치", "센티미터", "포인트"],
      answer: 1,
      explanation: "figsize의 단위는 인치(inch)예요. (10, 6)은 가로 10인치, 세로 6인치의 그래프를 만들어요.",
    },
    {
      question: "히스토그램에서 bins의 역할은?",
      options: ["색상 지정", "구간 개수 설정", "x축 범위", "y축 최댓값"],
      answer: 1,
      explanation: "bins는 데이터를 몇 개의 구간으로 나눌지 결정해요. 클수록 세밀하게 분포를 보여줘요.",
    },
  ],
  7: [
    {
      question: "과적합을 방지하는 방법으로 올바르지 않은 것은?",
      options: ["더 많은 훈련 데이터", "정규화(Regularization)", "학습률 높이기", "교차 검증"],
      answer: 2,
      explanation: "학습률을 높이면 수렴이 불안정해져요. 과적합 방지에는 데이터 증강, 정규화, 교차검증을 사용해요.",
    },
    {
      question: "R² (결정계수)가 1.0에 가까울수록 의미하는 것은?",
      options: ["모델이 나쁘다", "모델이 데이터를 잘 설명한다", "과적합이다", "데이터가 적다"],
      answer: 1,
      explanation: "R²=1은 완벽한 예측, R²=0은 평균 예측과 동일, 음수는 평균보다 나쁜 모델이에요.",
    },
    {
      question: "from sklearn.preprocessing import StandardScaler의 역할은?",
      options: ["데이터 시각화", "특성을 평균 0, 표준편차 1로 표준화", "레이블 인코딩", "결측값 처리"],
      answer: 1,
      explanation: "StandardScaler는 각 특성을 평균 0, 표준편차 1로 변환해요 (Z-score 정규화).",
    },
    {
      question: "선형회귀에서 y = 2.5x + 3.0일 때, x=4 예측값은?",
      options: ["10", "13", "11", "12"],
      answer: 1,
      explanation: "y = 2.5 × 4 + 3.0 = 10 + 3 = 13",
    },
    {
      question: "train_test_split에서 test_size=0.2의 의미는?",
      options: ["20개를 테스트로", "20%를 테스트로", "2번 반복 테스트", "2개 특성 사용"],
      answer: 1,
      explanation: "test_size=0.2는 전체 데이터의 20%를 테스트 세트로, 80%를 훈련 세트로 사용해요.",
    },
  ],
  8: [
    {
      question: "정밀도(Precision)와 재현율(Recall) 중 암 진단에서 더 중요한 것은?",
      options: ["정밀도", "재현율", "둘 다 같다", "정확도"],
      answer: 1,
      explanation: "암 진단에서는 실제 환자를 놓치면 안 되므로 재현율(Recall = TP/(TP+FN))이 더 중요해요.",
    },
    {
      question: "KNN에서 K가 너무 크면 어떤 문제가 생기나요?",
      options: ["과적합", "과소적합(underfitting)", "속도가 빨라짐", "정확도가 높아짐"],
      answer: 1,
      explanation: "K가 크면 이웃이 너무 많아 경계가 매끄러워져 underfitting이 발생해요.",
    },
    {
      question: "confusion matrix에서 False Negative(FN)의 의미는?",
      options: ["실제 Positive를 Positive로 예측", "실제 Positive를 Negative로 예측", "실제 Negative를 Positive로 예측", "실제 Negative를 Negative로 예측"],
      answer: 1,
      explanation: "FN: 실제 양성인데 음성으로 잘못 예측한 경우예요. 암 진단 시 환자를 정상으로 보는 것이에요.",
    },
    {
      question: "from sklearn.preprocessing import LabelEncoder의 역할은?",
      options: ["숫자를 문자로", "문자 레이블을 숫자로 인코딩", "이미지 전처리", "데이터 분리"],
      answer: 1,
      explanation: "LabelEncoder는 '개', '고양이' 같은 문자 클래스를 0, 1 같은 정수로 변환해요.",
    },
    {
      question: "KNN은 어떤 종류의 알고리즘인가요?",
      options: ["딥러닝", "지도학습", "비지도학습", "강화학습"],
      answer: 1,
      explanation: "KNN은 레이블이 있는 훈련 데이터로 학습하는 지도학습 알고리즘이에요.",
    },
  ],
  9: [
    {
      question: "torch.tensor([1.0, 2.0], requires_grad=True)에서 sum().backward() 후 grad는?",
      options: ["[1.0, 1.0]", "[1.0, 2.0]", "[2.0, 2.0]", "[0.5, 0.5]"],
      answer: 0,
      explanation: "sum = x[0] + x[1]. d(sum)/d(x[0]) = 1, d(sum)/d(x[1]) = 1 → grad = [1.0, 1.0]",
    },
    {
      question: "학습률이 너무 작으면 어떤 문제가 생기나요?",
      options: ["발산한다", "수렴이 매우 느리다", "과적합이 생긴다", "그래디언트가 0이 된다"],
      answer: 1,
      explanation: "학습률이 너무 작으면 최솟값에 도달하기까지 매우 많은 스텝이 필요해요.",
    },
    {
      question: "torch.no_grad() 컨텍스트에서 연산하면?",
      options: ["그래디언트가 2배로 됨", "그래디언트 추적을 하지 않아 메모리/속도 절약", "역전파가 안 됨", "b와 c 둘 다"],
      answer: 1,
      explanation: "no_grad()는 그래디언트 계산 그래프를 만들지 않아 추론 시 메모리와 속도를 절약해요.",
    },
    {
      question: "PyTorch에서 w.grad.zero_()의 언더스코어(_)가 의미하는 것은?",
      options: ["음수", "in-place 연산(원본 수정)", "비공개 메서드", "그래디언트 초기화"],
      answer: 1,
      explanation: "PyTorch에서 메서드 끝의 _는 in-place 연산을 의미해요. 새 텐서를 만들지 않고 원본을 직접 수정해요.",
    },
    {
      question: "Adam 옵티마이저가 SGD보다 일반적으로 좋은 이유는?",
      options: ["학습률이 고정돼 안정적", "각 파라미터마다 적응형 학습률 사용", "역전파를 하지 않음", "메모리를 덜 사용"],
      answer: 1,
      explanation: "Adam은 각 파라미터의 그래디언트 이력을 보고 학습률을 자동 조절해요. 대부분의 경우 SGD보다 빠르게 수렴해요.",
    },
  ],
  10: [
    {
      question: "nn.Linear(4, 8)이 생성하는 파라미터 수는?",
      options: ["12", "32", "40", "24"],
      answer: 2,
      explanation: "가중치 4×8=32 + 편향 8 = 40개의 파라미터가 있어요.",
    },
    {
      question: "신경망에서 Sigmoid 활성화 함수의 출력 범위는?",
      options: ["0 이상", "0~1", "-1~1", "-∞~+∞"],
      answer: 1,
      explanation: "Sigmoid(x) = 1/(1+e^-x)는 항상 0과 1 사이 값을 출력해요. 이진 분류 출력층에 적합해요.",
    },
    {
      question: "XOR 문제를 단층 퍼셉트론으로 풀 수 없는 이유는?",
      options: ["데이터가 적어서", "XOR은 선형 분리 불가능한 문제이기 때문", "활성화 함수가 없어서", "학습률이 작아서"],
      answer: 1,
      explanation: "XOR의 0,1 입출력은 직선 하나로 분리할 수 없어요. 은닉층이 있어야 비선형 경계를 만들 수 있어요.",
    },
    {
      question: "model.eval()을 추론 시에 호출하는 이유는?",
      options: ["그래디언트 계산", "Dropout/BatchNorm 동작을 추론 모드로 전환", "모델 저장", "학습률 변경"],
      answer: 1,
      explanation: "model.eval()은 Dropout과 BatchNorm을 추론(테스트) 모드로 바꿔요. model.train()은 학습 모드예요.",
    },
    {
      question: "ChatGPT와 같은 대형 언어 모델(LLM)의 기본 구조는?",
      options: ["CNN", "RNN", "Transformer(Attention)", "KNN"],
      answer: 2,
      explanation: "ChatGPT는 Transformer 아키텍처 기반이에요. Self-Attention 메커니즘으로 문맥을 이해해요.",
    },
  ],
};
