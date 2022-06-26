import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = trpc.useQuery(["questions.get-by-id", { id }]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoading && !data) {
    return <div>Question not found</div>;
  }

  return (
    <div className="flex flex-col">
      {data?.isOwner && (
        <div className="bg-red-700 rounded text-center p-2">
          You made this poll
        </div>
      )}
      <div className="text-2xl font-bold">{data?.question?.question}</div>
      <div>
        {(data?.question?.options as string[])?.map((option) => (
          <div key={option}>{option}</div>
        ))}
      </div>
    </div>
  );
};

const QuestionPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  return <QuestionPageContent id={id} />;
};

export default QuestionPage;
