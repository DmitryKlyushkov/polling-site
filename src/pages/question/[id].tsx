import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = trpc.useQuery(["questions.get-by-id", { id }]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate, data: voteResponse } = trpc.useMutation(
    "questions.vote-on-question",
    {
      onSuccess: () => window.location.reload(),
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.question) {
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
      <div className="flex flex-col gap-4">
        {(data?.question?.options as string[])?.map((option, index) => {
          if (data?.isOwner || data?.vote) {
            return (
              <div
                key={index}
                className={data?.vote?.Choice === index ? "underline" : ""}
              >
                {data?.votes?.[index]?._count ?? 0} - {(option as any).text}
              </div>
            );
          }
          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                mutate({ questionId: data?.question!.id, option: index });
              }}
            >
              {(option as any).text}
            </button>
          );
        })}
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
