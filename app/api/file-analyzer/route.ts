import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { analysisResult } = await request.json();

    if (!analysisResult) {
      return NextResponse.json(
        { error: "No analysis result provided" },
        { status: 400 },
      );
    }
    const mockQuestions = [
      {
        id: 1,
        question:
          "What is the primary difference between supervised and unsupervised learning?",
        options: [
          "Supervised learning uses labeled data, unsupervised learning uses unlabeled data",
          "Supervised learning is faster than unsupervised learning",
          "Supervised learning only works with numerical data",
          "There is no significant difference between them",
        ],
        correctAnswer: 0,
        explanation:
          "Supervised learning algorithms learn from labeled training data to make predictions, while unsupervised learning finds patterns in data without labeled examples.",
        difficulty: "Easy",
      },
      {
        id: 2,
        question:
          "Which of the following is NOT a common evaluation metric for classification models?",
        options: ["Accuracy", "Precision", "Mean Squared Error", "F1-Score"],
        correctAnswer: 2,
        explanation:
          "Mean Squared Error is typically used for regression problems, not classification. Classification models use metrics like accuracy, precision, recall, and F1-score.",
        difficulty: "Medium",
      },
      {
        id: 3,
        question:
          "In neural networks, what is the purpose of the activation function?",
        options: [
          "To initialize weights randomly",
          "To introduce non-linearity into the model",
          "To reduce overfitting",
          "To normalize input data",
        ],
        correctAnswer: 1,
        explanation:
          "Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns and relationships in data that linear models cannot capture.",
        difficulty: "Medium",
      },
      {
        id: 4,
        question:
          "What technique is commonly used to prevent overfitting in machine learning models?",
        options: [
          "Increasing the learning rate",
          "Adding more features",
          "Cross-validation and regularization",
          "Using smaller datasets",
        ],
        correctAnswer: 2,
        explanation:
          "Cross-validation helps assess model performance on unseen data, while regularization techniques (L1, L2) add penalties to prevent the model from becoming too complex.",
        difficulty: "Hard",
      },
      {
        id: 5,
        question:
          "Which clustering algorithm requires you to specify the number of clusters beforehand?",
        options: ["DBSCAN", "Hierarchical clustering", "K-means", "Mean shift"],
        correctAnswer: 2,
        explanation:
          "K-means clustering requires you to specify the number of clusters (k) as a parameter before running the algorithm, unlike DBSCAN or hierarchical clustering.",
        difficulty: "Easy",
      },
    ];

    return NextResponse.json({ questions: mockQuestions });
  } catch (error) {
    console.error("Error generating MCQ questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 },
    );
  }
}
